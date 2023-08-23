import { expect } from "chai";
import { ethers } from "hardhat";
import { RaffleContract, VRFCoordinatorV2Mock } from "../typechain-types";

const students = ["João", "Ana", "Vivi"];

describe("Raffle Contract", function() {

    let contractOwner: any;
    let raffleInstance: RaffleContract, vrfCoordinatorMockInstance: VRFCoordinatorV2Mock;

    this.beforeEach(async () => {
        [contractOwner] = await ethers.getSigners();
        
        let vrfCoordinatorMock = await ethers.getContractFactory("VRFCoordinatorV2Mock");
        let raffle = await ethers.getContractFactory("RaffleContract");

        vrfCoordinatorMockInstance = await vrfCoordinatorMock.deploy(0,0);
        await vrfCoordinatorMockInstance.createSubscription();
        await vrfCoordinatorMockInstance.fundSubscription(1, ethers.parseEther("7"));
        raffleInstance = await raffle.deploy(await vrfCoordinatorMockInstance.getAddress(), 1, students);
        await vrfCoordinatorMockInstance.addConsumer(1, await raffleInstance.getAddress());
        console.log(await raffleInstance.getAddress())
    });

   it("My contract request randomness successfully", async () => {
    await expect(raffleInstance.requestRandomWords(2)).to.emit(
        raffleInstance,
        "RequestSent"
    );
   });

   it("My coordinator should request randomness successfuly", async () => {
    await expect(raffleInstance.requestRandomWords(2)).to.emit(
        vrfCoordinatorMockInstance,
        "RandomWordsRequested"
    );
   });

   it("Should fulfill randomness request", async () => {
    var requestId : number = 0;

        raffleInstance.on(raffleInstance.getEvent("RequestSent"), (_requestId, _) => {
            requestId = parseInt(_requestId.toString());
        });

        let transaction: TransactionResponse = await raffleInstance.requestRandomWords(2);

        await transaction.wait();   
        let tx : TransactionResponse = await vrfCoordinatorMockInstance.fulfillRandomWords(1, await raffleInstance.getAddress());
        await tx.wait();
        expect(await raffleInstance.raffleStudents()).to.emit(
                    raffleInstance,
                    "RaffleDone"
                ).withArgs(["Vivi", "João"]);
    });



});
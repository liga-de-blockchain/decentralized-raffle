import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

const students = ["João", "Ana", "Vivi"];

describe("Raffle", function() {
    async function deployRaffleStudentsFixture() {
        const [owner] = await ethers.getSigners();

        const Raffle = await ethers.getContractFactory("RaffleContract"); 
        const raffle = await Raffle.deploy(students);

        return raffle;
    }


describe("Raffle Students", function () {
    it("should return the raffled students", async function() {
        const raffle = await loadFixture(deployRaffleStudentsFixture);
        expect(await raffle.raffleStudents(3)).to.eql(students);
    });

    it("Should return all the existing students", async () => {
        const raffle = await loadFixture(deployRaffleStudentsFixture);
        expect(await raffle.getExistingStudents()).to.eql(students);
    })
});

});
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";


contract RaffleContract is  VRFConsumerBaseV2 {

    event RequestSent(uint256 requestId, uint32 numWords);
    event RequestFulfilled(uint requestId, uint256[] randomWords);
    event RaffleDone(address indexed sender);

    struct RequestStatus {
        bool fulfilled;
        bool exists;
        uint256[] randomWords;
    }

    mapping(uint256 => RequestStatus) public reqIdToReqStatus;
    VRFCoordinatorV2Interface COORDINATOR;

    uint64 subscriptionId; //the subscription id needs to be in the chainlink VRF subscription page
    bytes32 keyHash; //used to define the max LINK gas to pay for each randomness request
    uint256 fee;

    uint256 public latestRequestId; //this make it easy for you to check the latest erquest without the need to store this offchain
    uint32 callbackGasLimit = 100000; //this is how much you are willing to pay so the randomness provider calls the callback function fulfillRandomness()
    uint16 requestConfirmations = 3;
    uint32 numWords = 1; //number of random values to be returned;

    string[] students;

    // this is the SEPOLIA ADDRESS for vrfCoordinator param: 0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625;

    constructor(address _vrfCoordinatorAddress, uint64 _subscriptionId, string[] memory _students)
    VRFConsumerBaseV2(_vrfCoordinatorAddress)
     {
        COORDINATOR = VRFCoordinatorV2Interface(_vrfCoordinatorAddress);
        students = _students;
        subscriptionId = _subscriptionId;
     } 

    function raffleStudents(uint8 _numberOfStudents) external returns(string memory firstStudent, string memory seconStudent) {
        require(_numberOfStudents >= students.length, "More students asked than existing in list");
        RequestStatus memory lastReq = reqIdToReqStatus[latestRequestId];
        uint16 firstStudentIndex  = uint16(lastReq.randomWords[0]%students.length);
        uint16 secondStudentIndex = uint16(lastReq.randomWords[1]%students.length); 

        emit RaffleDone(msg.sender);
        return (students[firstStudentIndex], students[secondStudentIndex]);
    }

    function getExistingStudents() public view returns(string[] memory) {
        return students;
    }

    function requestRandomWords()
        external 
        returns (uint256 requestId) 
    {
        requestId = COORDINATOR.requestRandomWords(keyHash, subscriptionId, requestConfirmations, callbackGasLimit, numWords);
        reqIdToReqStatus[requestId] = RequestStatus({
            randomWords: new uint256[](0),
            exists: true,
            fulfilled: false
        });
        latestRequestId = requestId;
        emit RequestSent(requestId, numWords);
    }

    function fulfillRandomWords(uint256 _requestId, uint256[] memory _randomWords) internal override {
        require(reqIdToReqStatus[_requestId].exists == true, "request doesn't exist");
        reqIdToReqStatus[_requestId].fulfilled = true;
        reqIdToReqStatus[_requestId].randomWords = _randomWords;

        emit RequestFulfilled(_requestId, _randomWords);
    }

    function getRequestStatus(uint256 _requestId) external view returns(bool fulfilled, uint256[] memory randomWords) {
        require(reqIdToReqStatus[_requestId].exists == true, "request doesn't exist");
        RequestStatus memory request = reqIdToReqStatus[_requestId];
        return(request.fulfilled, request
        .randomWords);
    }



}
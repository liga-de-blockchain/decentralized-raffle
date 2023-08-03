// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract RaffleContract {
    
    event RaffleDone(address indexed sender);
    
    string[] students;

    constructor(string[] memory _students) {
        students = _students;
    }

    function raffleStudents(uint8 _numberOfStudents) public view returns(string[] memory) {
        require(_numberOfStudents >= students.length, "More students asked than existing in list");
        
        string[] memory result = new string[](_numberOfStudents);
        for(uint i = 0; i < _numberOfStudents; i++) {
            result[i] = students[i];
        }
        return result;
    }

    function getExistingStudents() public view returns(string[] memory) {
        return students;
    }

}
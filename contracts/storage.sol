// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract SimpleStorage {
    constructor () {
        data = 10;
    }
    uint public data;

    function set(uint x) public {
        data = x;
    }

    function get() public view returns (uint) {
        return data;
    }

    function checkStatus() public pure returns(uint8){
        return 1;
    }
}
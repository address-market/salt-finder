// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DeployerCreate {

    constructor (bytes memory code){
        deploy(code);
    }
    event Deployed(address addr);

    function deploy(bytes memory code) public returns (address) {
        address addr;
        assembly {
            addr := create(0, add(code, 0x20), mload(code))
            if iszero(extcodesize(addr)) {
                revert(0, 0)
            }
        }

        emit Deployed(addr);
        return addr;
    }

    function checkStatus() public pure returns(uint8){
        return 1;
    }
}
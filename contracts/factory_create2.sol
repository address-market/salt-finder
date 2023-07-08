// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DeployerCreate2 {
    // event to log the address of deployed contract
    event Deployed(address addr, bytes32 salt);

    function deploy(bytes memory contractCode, bytes32 salt, bytes memory constructorArgs) public returns (address){
        bytes memory bytecodeWithConstructorArgs = abi.encodePacked(contractCode, abi.encode(constructorArgs));
        
        address addr;
        assembly {
            addr := create2(0, add(bytecodeWithConstructorArgs, 0x20), mload(bytecodeWithConstructorArgs), salt)
            if iszero(extcodesize(addr)) {
                revert(0, 0)
            }
        }
        emit Deployed(addr, salt);
        return addr;
    }

    function checkStatus() public pure returns(uint8){
        return 1;
    }
}
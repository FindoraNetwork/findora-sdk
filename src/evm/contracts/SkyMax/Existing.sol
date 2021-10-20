pragma solidity ^0.4.17;

contract AlreadyDeployed {
  function enter(address senderAddress) payable public {}
}

contract Existing  {
  address dc;
  AlreadyDeployed main;

  function Existing(address deployedContractAddress) public {
    dc = deployedContractAddress;
    main = AlreadyDeployed(deployedContractAddress);
  }

  function setA_Signature(uint _val) public {
    require(dc.call(bytes4(keccak256("setA(uint256)")),_val));
  }

  function enter_Signature() public payable {
    main.enter.value(msg.value)(msg.sender);
  }
}

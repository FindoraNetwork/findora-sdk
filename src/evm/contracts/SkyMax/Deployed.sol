pragma solidity ^0.4.17;

contract Deployed {
  uint public a;
  address public manager;
  address[] public players;
  mapping(address => uint256) contributions;

  event Transferred(address from, uint quantity);

	function Deployed(uint initialNum) public {
    manager = msg.sender;
		a = initialNum;
	}

  function getContribution(address contributior) public view returns (uint256){
    return contributions[contributior];
  }

  function enter(address senderAddress) public payable {
    require(msg.value > .01 ether);
    players.push(senderAddress);
    contributions[senderAddress] = msg.value;
    Transferred(senderAddress, msg.value);
  }

  function random() private view returns (uint256) {
    return uint256(keccak256(block.difficulty, now, players));
  }

  function pickWinner() public restricted {
    uint256 index = random() % players.length;
    players[index].transfer(this.balance);
    players = new address[](0);
  }

  modifier restricted() {
    require(msg.sender == manager);
    _;
  }

  function getPlayers() public view returns (address[]) {
    return players;
  }

  function setA(uint _a) public {
    a = _a;
  }
}

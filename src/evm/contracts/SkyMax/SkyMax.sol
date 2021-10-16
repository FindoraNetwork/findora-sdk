pragma solidity ^0.4.17;

contract SkyMax {
  address public manager;
  address[] public players;
  mapping(address => uint256) contributions;
	string public message;

  event Transferred(address from, uint quantity);

  function SkyMax(string initialMessage) public {
    manager = msg.sender;
		message = initialMessage;
  }

  function getContribution(address contributior) public view returns (uint256){
    return contributions[contributior];
  }

	function setMessage(string newMessage) public {
		message = newMessage;
	}

  function enter() public payable {
    require(msg.value > .01 ether);
    players.push(msg.sender);
    contributions[msg.sender] = msg.value;
    Transferred(msg.sender, msg.value);
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
}

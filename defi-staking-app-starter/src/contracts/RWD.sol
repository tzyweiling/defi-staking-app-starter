//reward token contract - yield farming, come to app take tether deposit into abnk and get reward token in exchg

pragma solidity ^0.5.0;

contract RWD {
    string public name = "Reward Token";
    string public symbol = "RWD";
    uint256 public totalSupply = 1000000000000000000000000; //1 million tokens
    uint8 public decimals = 18;

    //indexed:used to enable efficient filtering of events based on this parameter
    //only use 3 indexed per event
    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    event Approval(address indexed _owner, address indexed _to, uint256 _value);

    // Mapping to store token balances for each address
    mapping(address => uint256) public balanceOf;

    // Mapping to store allowances for spending tokens from one address to another
    mapping(address => mapping(address => uint256)) public allowance;

    constructor() public {
        balanceOf[msg.sender] = totalSupply;
    }

    // Function to transfer tokens from the sender to another address
    function transfer(
        address _to,
        uint256 _value
    ) public returns (bool success) {
        //require the balance is equal or greater for transfer
        require(balanceOf[msg.sender] >= _value);
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        //Emits a Transfer event, signaling that a transfer has occurred
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    // Function to grant approval for a spender to spend tokens on behalf of the owner
    function approve(
        address _spender,
        uint256 _value
    ) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    // Function to transfer tokens from one address to another on behalf of the owner (3rd parties)
    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        // Check if the sender has enough balance to transfer
        require(_value <= balanceOf[_from]);
        // Check if the sender has been approved to spend the specified amount
        require(_value <= allowance[_from][msg.sender]);
        // Deduct the transferred amount from the sender's balance
        balanceOf[_from] -= _value;
        // Add the transferred amount to the recipient's balance
        balanceOf[_to] += _value;
        // Decrease the allowance of the sender for the recipient by the transferred amount
        allowance[_from][msg.sender] -= _value;
        //Emits a Transfer event, signaling that a transfer has occurred
        emit Transfer(_from, _to, _value);
        return true;
    }
}

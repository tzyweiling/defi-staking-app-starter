pragma solidity ^0.5.0;
//main three fucntion: staking, unstaking, rewarding(issuing and depositing token)

//want to hv access to tether and reward token
//able to issue token, reward token, keep track of the state, accept the deposit & withdrawls

//import the Solidity code from a solidity file into another Solidity file
//allows to use or inherit functionality from the "Tether" contract within the current contract
import "./RWD.sol";
import "./Tether.sol";

contract DecentralBank {
    //contract state variable
    string public name = "Decentral Bank";
    address public owner;
    //the var is set to the contract themselves
    RWD public rwd;
    Tether public tether;

    //array of stakers to keep track of addresses
    address[] public stakers;

    //keep track of staking balance as they change
    mapping(address => uint) public stakingBalance;
    //to check if they have staked or are staking
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    //use constructor to setup the interaction with tether and reward token
    //the var is set to the contract themselves
    //used to initialize the state variables with the instances provided as parameters
    constructor(RWD _rwd, Tether _tether) public {
        tether = _tether;
        rwd = _rwd;
        owner = msg.sender;
    }

    //staking function
    function depositTokens(uint _amount) public {
        //require staking amount to be greater than zero
        require(_amount > 0, "amount cannot be 0");

        //transfer tether tokens to decentralBank contract address for staking
        //address(this): decentralBank contract
        tether.transferFrom(msg.sender, address(this), _amount);

        //update staking balance
        stakingBalance[msg.sender] += _amount;

        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        //update staking status
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    //unstake tokens
    function unstakeTokens() public {
        uint balance = stakingBalance[msg.sender];
        //require the amount to be greater than 0
        require(balance > 0, "staking balance can't be less than 0");

        //transfer tokens to the specified contract address from our bank
        tether.transfer(msg.sender, balance);

        //reset staking balance
        stakingBalance[msg.sender] = 0;

        //update staking status
        isStaking[msg.sender] = false;
    }

    //issue reward tokens
    function issueTokens() public {
        // Only allow the owner to issue tokens
        require(msg.sender == owner, "the caller must be the owner");

        // Iterate through stakers array
        for (uint i = 0; i < stakers.length; i++) {
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient];
            if (balance > 0) {
                // Reward will be the amount that they were staking
                rwd.transfer(recipient, balance);
            }
        }
    }
}

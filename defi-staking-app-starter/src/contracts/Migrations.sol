pragma solidity ^0.5.0;

contract Migrations {
    address public owner;
    uint public last_complete_migrations;

    constructor() public {
        owner = msg.sender;
    }

    modifier restricted() {
        if (msg.sender == owner) _;
    }

    function setCompleted(uint completed) public restricted {
        last_complete_migrations = completed;
    }

    function upgrade(address new_address) public restricted {
        //creates a new instance of the Migrations contract at the provided new_address
        //This is known as contract casting or typecasting
        //The upgraded variable now refers to the contract at the new address
        Migrations upgraded = Migrations(new_address);

        //calls the set_completed function on the newly created upgraded contract
        //passing the last_complete_migrations value from the current contract
        upgraded.setCompleted(last_complete_migrations);
    }
}

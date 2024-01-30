pragma solidity '^0.5.0';

contract Migrations {
    address public owner;
    uint public last_complete_migrations;

    constructor() public {
        owner = msg.sender;
    }

    modifier restricted() {
        if (msg.sender == owner) _;
    }

    function set_completed(uint completed) public restricted {
        last_complete_migrations = completed;
    }
   
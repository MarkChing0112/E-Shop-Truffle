pragma solidity >=0.5.0 <0.9.0;



contract Tickets{
    address public owner = msg.sender;
    uint256 constant Total_Supply = 20;
    // string public name = "Eshop Token";
    // // set the token symbol
    // string public symbol = "Epos";
    // uint8 public decimals = 0;

    struct Ticket{
        address owner;
        uint256 price;
    }

    Ticket[Total_Supply] public tickets;

    constructor(){
        for (uint256 i = 0;i < Total_Supply; i++){
            tickets[i].owner = address(0x0);
            tickets[i].price = 1e17;
        }
    }

    function buyTicket(uint256 _index) external payable{
        require(_index < Total_Supply && _index >= 0);
        require(tickets[_index].owner == address(0x0));
        require(msg.value >= tickets[_index].price);

        tickets[_index].owner = msg.sender;
    }
    
}
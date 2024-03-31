pragma solidity >=0.7.0 <0.9.0;

contract products{
    address public purchasers;
    // uint256 constant Total_Supply = 20;
    event Product(string product_name, uint256 quantity,string name, string url, uint256 price);
    address public authority;

    struct ProductDetails {
        uint256 quantity;
        address[] purchasers;
        string name;
        string url;
        uint256 price;
        bool isSet;
    }
    mapping(string => ProductDetails) productList;


    struct Ticket{
        address owner;
        uint256 price;
    }

    // Ticket[Total_Supply] public tickets;

    constructor(){
        // for (uint256 i = 0;i < Total_Supply; i++){
        //     tickets[i].owner = address(0x0);
        //     tickets[i].price = 1e17;
        // }
        authority = msg.sender;
    }

    function addProduct(string calldata product_name, uint256 Quantity,string calldata name, string calldata url, uint256 price) public {
        
        productList[product_name].quantity = Quantity;
        productList[product_name].url = url;
        productList[product_name].price = 1e17;
        productList[product_name].isSet = true;
        productList[product_name].name = product_name;

        emit Product(product_name, Quantity,name, url, price);
    }

    function addProductQuantity(string calldata product_name, uint256 addQuantity) public {
        require(productList[product_name].isSet);
        productList[product_name].quantity += addQuantity;
    }
    
    function purchaseProduct(string calldata product_name, address purchaser) public { 
        require(productList[product_name].purchasers.length < productList[product_name].quantity); 
        productList[product_name].purchasers.push(purchaser);
    }
    

    //Testing get purchasers
    function getProductDetail(string calldata product_name) public view returns (address[] memory purchasers,uint256 countRemain,string memory name,string memory url,uint256 price) {
        countRemain = productList[product_name].quantity - productList[product_name].purchasers.length;
        name = productList[product_name].name;
        url = productList[product_name].url;
        price = productList[product_name].price;
        return (productList[product_name].purchasers,countRemain,name,url,price);
    }

    function getcountPurchasers(string calldata product_name) public view returns (uint256){
        uint256 countRemain = productList[product_name].quantity - productList[product_name].purchasers.length;
        return countRemain;
    }
    function getPurchasers(string memory product) public view returns (address[] memory purchasers) {
        return productList[product].purchasers;
    }
    //testing metamusk buy product
    // function buyTicket(uint256 _index) external payable{
    //     require(_index < Total_Supply && _index >= 0);
    //     require(tickets[_index].owner == address(0x0));
    //     require(msg.value >= tickets[_index].price);

    //     tickets[_index].owner = msg.sender;
    // }
    
}
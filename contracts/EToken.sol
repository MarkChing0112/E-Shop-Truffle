pragma solidity >=0.7.0 <0.9.0;

contract Etoken {
    mapping (address => uint256) _balances;
    // mapping (address => mapping(address => uint256)) _allowed;

    string public name = "Eshop Token";
    // set the token symbol
    string public symbol = "Epos";
    uint8 public decimals = 0;

    // contract owner
    address public owner;
    address public treasury;

    uint256 public  _totalSupply = 150;
    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    constructor() public {
        owner = msg.sender;
        
        treasury = address(0x53e971a9f6b888fa151673Ff98Bc34023E6FE7C5);

        _balances[msg.sender] = _totalSupply;
        emit Transfer(address(0), treasury, _totalSupply);
}

    function totalSupply() public view returns (uint) {
        return _totalSupply - _balances[address(0)];
}
    function balanceOf(address _owner) public view returns (uint balance) {
        return _balances[_owner];
}
    function transfer(address _to, uint256 _value) public returns (bool success)
{
        require(_to != msg.sender);
        require(_to != address(0));
        require(_to != address(this));
        require(_balances[msg.sender] - _value <= _balances[msg.sender]);
        require(_balances[_to] <= _balances[_to]+_value);
        require(_balances[msg.sender] >= _value,"value exceeds senders balance");
       
        _balances[msg.sender] -= _value;
        _balances[_to] += _value;

        emit Transfer(msg.sender, _to, _value);
        return true;
}


 function transferableTokens(address holder) public view returns (uint256) {
        return balanceOf(holder);
    }

    function transferfrom(address _from, address _to, uint256 _value) public
        returns (bool success)
{
    require(_value <= _balances[_from],"Not enough balance");
    require(_from != address(0));
    require(_from != address(this));
    require(_to != _from);
    require(_to != address(0));
    require(_to != address(this));
    require(_value <= transferableTokens(_from));
    require(_balances[_from] - _value <= _balances[_from]);
    require(_balances[_to] <= _balances[_to] + _value);


    _balances[_from] -= _value;
    _balances[_to] += _value;


    emit Transfer(_from, _to, _value);
    return true;
}
}
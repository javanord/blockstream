// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.8;

contract TradeManagerv2 {

    enum State {Alleged, Affirmed,Rejected, Setteled}

    struct Trade {
        bytes32 initiatorCp;
        bytes32 receiverCp;
        string quoteTerm;
        uint rate;
        uint notional;
        uint contraNotional;
        CUR_TYPE buyCur;
        CUR_TYPE sellCur;
        State state;
        bool isExist;
    }

    address private owner;
    mapping (bytes32 => Trade) _tradesMapping;
   
    //---------------Currency----------
    enum CUR_TYPE {INRDC, GBPDC}
    
    struct ACCOUNT {
        string name;
        string lei;
        mapping(CUR_TYPE => uint) curr;
        bool isExist;
    }

    mapping(bytes32 => ACCOUNT) ACC_MAP;


    //----------- Events-----------
    event NewTradeCreated(address _address, bytes32 _tradeId, State tradeStatus);
    event TradeAccepted(address _address, bytes32 _tradeId, State tradeStatus);
    event TradeRejected(address _address, bytes32 _tradeId,  State tradeStatus);
    event TradeSettled(address _address, bytes32 _tradeId,  State tradeStatus);
    event SettlementData(CUR_TYPE _fc, CUR_TYPE sc, uint fc_amnt, uint _sc_amnt);

    constructor ()  {
        owner = msg.sender;
    }

    function _generateTradeHash(Trade  memory _trade) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(_trade.initiatorCp, _trade.receiverCp, _trade.quoteTerm,_trade.rate, _trade.notional, _trade.contraNotional));
    }

    function settleTrade(bytes32 _tdHash) public {
    
        require (_tradesMapping[_tdHash].isExist, "Trade doesn't exist");
        require (_tradesMapping[_tdHash].state != State.Setteled, "Trade already settled");
        uint amount = _tradesMapping[_tdHash].notional;
        _transfer( 
            _tradesMapping[_tdHash].initiatorCp,
            _tradesMapping[_tdHash].receiverCp,
            _tradesMapping[_tdHash].buyCur,
            _tradesMapping[_tdHash].sellCur,
            _tradesMapping[_tdHash].notional,
            _tradesMapping[_tdHash].contraNotional            
        );
        emit TradeSettled(msg.sender, _tdHash, State.Setteled);
    }

    function _transfer(bytes32 p1, bytes32 p2,
                        CUR_TYPE buyCur, CUR_TYPE sellCur,
                        uint buyAmt, uint sellAmt) internal returns (bool){

        require(ACC_MAP[p1].isExist, "Account[from] not registered");
        require(ACC_MAP[p2].isExist, "Account[to] not registered");

        require(ACC_MAP[p1].curr[sellCur] >= sellAmt, "Account[_from] balance not sufficient");
        require(ACC_MAP[p2].curr[buyCur] >= buyAmt, "Account[_to] balance not sufficient");

        _deductWalletMoney(p1, sellCur, sellAmt);
        _deductWalletMoney(p2, buyCur, buyAmt);
        _addWalletMoney(p1, buyCur, buyAmt);
        _addWalletMoney(p2, sellCur, sellAmt);       

       return true;
    }

    function _deductWalletMoney(bytes32 p, CUR_TYPE _curr, uint _amnt ) internal returns (bool) {
        ACC_MAP[p].curr[_curr] -= _amnt;
        return true;
    }

    function _addWalletMoney(bytes32 p, CUR_TYPE _curr, uint _amnt ) internal returns (bool) {
        ACC_MAP[p].curr[_curr] += _amnt;
        return true;
    }

    function  createTrade(bytes32 p1, bytes32 p2, string memory _quoteTerm, 
                    CUR_TYPE _buyCur, CUR_TYPE _sellCur, uint _rate, uint256 _notional,
                     uint256 _contraNotional) public returns(bytes32) {
         require (owner != msg.sender);
         Trade memory newTrade = Trade({
            initiatorCp: p1,
            receiverCp: p2,
            quoteTerm: _quoteTerm,
            buyCur: _buyCur,
            sellCur: _sellCur,
            rate: _rate,
            notional: _notional,
            contraNotional: _contraNotional,
            state: State.Affirmed,
            isExist: false
        });

        bytes32 tradeHash = _generateTradeHash(newTrade);
        require(_tradesMapping[tradeHash].isExist == false, "Trade already exists");
        
        newTrade.isExist = true;
        _tradesMapping[tradeHash] = newTrade;
        
        emit NewTradeCreated(msg.sender, tradeHash, State.Affirmed);
        return tradeHash;
    }

     function getTrade(bytes32 _tradeHashId) public view returns(Trade memory){
        Trade memory returnedTrade = _tradesMapping[_tradeHashId];
        require (_tradesMapping[_tradeHashId].isExist, "Trade doesn't exist");
        //require (returnedTrade.initiatorCp == msg.sender || returnedTrade.receiverCp == msg.sender);
        
        return returnedTrade;
     } 
  
    function acceptTrade(bytes32 _tradeHash) public returns(bool){
        require (owner != msg.sender);
        require(_tradesMapping[_tradeHash].isExist, "Trade doesn't exists.");
        _tradesMapping[_tradeHash].state = State.Affirmed;
        emit TradeAccepted(msg.sender, _tradeHash,State.Affirmed);
        return true;  
    }

    function rejectTrade(bytes32 _tradeHash) public {
        require (owner != msg.sender);
        require(_tradesMapping[_tradeHash].isExist, "Trade doesn't exists.");

        _tradesMapping[_tradeHash].state = State.Rejected;
        emit TradeRejected(msg.sender, _tradeHash, State.Rejected);
    }

    function compareStrings(string memory str1, string memory str2) internal pure returns (bool) {
        if (bytes(str1).length != bytes(str2).length) {
            return false;
        }
        return keccak256(abi.encodePacked(str1)) == keccak256(abi.encodePacked(str2));
    }
 
    function messageSenderHash() view public returns(bytes32){
        return keccak256(abi.encodePacked(msg.sender));
    }


    //----------------ACCOUNT Manager-----------------------------
    function registerAccount(string memory _name, string memory _lei) external returns (bytes32) {

        require( bytes(_name).length > 0, "Account not valid");
        require( bytes(_lei).length  > 0, "LEI not valid");

        bytes32 accHash = keccak256(abi.encodePacked(_name, _lei));

        // TODO - retry for new hash
        require(!ACC_MAP[accHash].isExist, "Account already registered");
        //require(userExistMap[hash] == false , "User already registered");
        
        ACC_MAP[accHash].isExist = true;
        ACC_MAP[accHash].name = _name;
        ACC_MAP[accHash].lei = _lei;
        ACC_MAP[accHash].curr[CUR_TYPE.INRDC] = 0;
        ACC_MAP[accHash].curr[CUR_TYPE.GBPDC] = 0;

        return accHash;
    }

    function accExists(bytes32 _accHash) external view returns(bool) {
        return ACC_MAP[_accHash].isExist;
    }

    function depositeAmount(bytes32 _userHash, CUR_TYPE _curr, uint _amt) external returns (bool) {
        require( _amt > 0, "Amount not valid");
        require(ACC_MAP[_userHash].isExist, "Account not registered");
        ACC_MAP[_userHash].curr[_curr] += _amt;
        return true;
    }

    function withdrawAmount(bytes32 _userHash, CUR_TYPE _curr, uint _amt) external returns (bool) {
        require( _amt > 0, "Amount not valid");
        require(ACC_MAP[_userHash].isExist, "Account not registered");
        ACC_MAP[_userHash].curr[_curr] -= _amt;
        return true;
    }

    function getUserCurrencyAmount(bytes32 _userHash, CUR_TYPE _curr) external view returns(uint) {
        require(ACC_MAP[_userHash].isExist, "User not registered");
        return ACC_MAP[_userHash].curr[_curr];
    }
}

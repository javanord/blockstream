// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.8;

contract TradeManagerv2 {

    enum State {Alleged, Affirmed,Rejected, Setteled}
    enum Direction {BUY, SELL}

    struct Trade {
        address initiatorCp;
        address receiverCp;
        uint notional;
        uint contraNotional;
        Direction direction;
        uint rate;
        CUR_TYPE buyCur;
        CUR_TYPE sellCur;
        string tradeDate;
        string valueDate;
        State state;
        bool isExist;
    }

    address private owner;
    mapping (bytes32 => Trade) _tradesMapping;
   
    //---------------Currency----------
    enum CUR_TYPE {INRDC, GBPDC}
    
    struct ACCOUNT {
        string lei;
        mapping(CUR_TYPE => uint) curr;
        bool isExist;
    }
    //address RBS = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4;
    //address Barclay = 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2;

    mapping(address => ACCOUNT) ACC_MAP;

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
        return keccak256(abi.encodePacked(_trade.initiatorCp, _trade.receiverCp, _trade.notional, _trade.contraNotional));
    }

    function settleTrade(bytes32 _tdHash) public {
    
        require (_tradesMapping[_tdHash].isExist, "Trade doesn't exist");
        require (_tradesMapping[_tdHash].state != State.Setteled, "Trade already settled");
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

    function _transfer(address p1, address p2,
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

    function _deductWalletMoney(address p, CUR_TYPE _curr, uint _amnt ) internal returns (bool) {
        ACC_MAP[p].curr[_curr] -= _amnt;
        return true;
    }

    function _addWalletMoney(address p, CUR_TYPE _curr, uint _amnt ) internal returns (bool) {
        ACC_MAP[p].curr[_curr] += _amnt;
        return true;
    }


    function  createTrade(address p1, address p2, Direction _direction, 
                    uint _rate, CUR_TYPE _buyCur, CUR_TYPE _sellCur, uint256 _notional,
                     uint256 _contraNotional, string memory _tradeDate, string memory _valueDate) public returns(bytes32) {
         
         Trade memory newTrade = Trade({
            initiatorCp: p1,
            receiverCp: p2,
            buyCur: _buyCur,
            sellCur: _sellCur,
            direction: _direction,
            rate: _rate,
            notional: _notional,
            contraNotional: _contraNotional,
            tradeDate: _tradeDate,
            valueDate: _valueDate,
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

    function accExists(address _acc) external view returns(bool) {
        return ACC_MAP[_acc].isExist;
    }

    function depositeAmount(address _acc, CUR_TYPE _curr, uint _amt) external returns (bool) {
        require( _amt > 0, "Amount not valid");
        require(ACC_MAP[_acc].isExist, "Account not registered");
        ACC_MAP[_acc].curr[_curr] += _amt;
        return true;
    }

    function withdrawAmount(address _acc, CUR_TYPE _curr, uint _amt) external returns (bool) {
        require( _amt > 0, "Amount not valid");
        require(ACC_MAP[_acc].isExist, "Account not registered");
        ACC_MAP[_acc].curr[_curr] -= _amt;
        return true;
    }

    function getUserCurrencyAmount(address _acc, CUR_TYPE _curr) external view returns(uint) {
        require(ACC_MAP[_acc].isExist, "Account not registered");
        return ACC_MAP[_acc].curr[_curr];
    }

    /*function resetAcc() external returns (bool) {
        ACC_MAP[RBS].curr[CUR_TYPE.INRDC] = 0;
        ACC_MAP[RBS].curr[CUR_TYPE.GBPDC] = 0;
        ACC_MAP[Barclay].curr[CUR_TYPE.INRDC] = 0;
        ACC_MAP[Barclay].curr[CUR_TYPE.GBPDC] = 0;
        return true;
    }*/

    function registerAccount(address _newAcc, string memory _lei) external returns (bool) {

        require( bytes(_lei).length  > 0, "LEI not valid");
        //bytes32 accHash = keccak256(abi.encodePacked(_name, _lei));

        // TODO - retry for new hash
        require(!ACC_MAP[_newAcc].isExist, "Account already registered");

        ACC_MAP[_newAcc].isExist = true;
        ACC_MAP[_newAcc].lei = _lei;
        ACC_MAP[_newAcc].curr[CUR_TYPE.INRDC] = 0;
        ACC_MAP[_newAcc].curr[CUR_TYPE.GBPDC] = 0;

        /*ACC_MAP[RBS].isExist = true;
        ACC_MAP[RBS].lei = "RBSLei";
        ACC_MAP[RBS].curr[CUR_TYPE.INRDC] = 0;
        ACC_MAP[RBS].curr[CUR_TYPE.GBPDC] = 0;

        ACC_MAP[Barclay].isExist = true;
        ACC_MAP[Barclay].lei = "BarclayLei";
        ACC_MAP[Barclay].curr[CUR_TYPE.INRDC] = 0;
        ACC_MAP[Barclay].curr[CUR_TYPE.GBPDC] = 0;

        ACC_MAP[RBS].curr[CUR_TYPE.INRDC] += 10000;
        ACC_MAP[RBS].curr[CUR_TYPE.GBPDC] += 2000;
        ACC_MAP[Barclay].curr[CUR_TYPE.INRDC] += 5000;
        ACC_MAP[Barclay].curr[CUR_TYPE.GBPDC] += 3000;*/
        return true;
    }

}

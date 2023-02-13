export const TradeManagerv2Abi = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "_address",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bytes32",
                "name": "_tradeId",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "internalType": "enum TradeManagerv2.State",
                "name": "tradeStatus",
                "type": "uint8"
            }
        ],
        "name": "NewTradeCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "enum TradeManagerv2.CUR_TYPE",
                "name": "_fc",
                "type": "uint8"
            },
            {
                "indexed": false,
                "internalType": "enum TradeManagerv2.CUR_TYPE",
                "name": "sc",
                "type": "uint8"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "fc_amnt",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_sc_amnt",
                "type": "uint256"
            }
        ],
        "name": "SettlementData",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "_address",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bytes32",
                "name": "_tradeId",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "internalType": "enum TradeManagerv2.State",
                "name": "tradeStatus",
                "type": "uint8"
            }
        ],
        "name": "TradeAccepted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "_address",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bytes32",
                "name": "_tradeId",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "internalType": "enum TradeManagerv2.State",
                "name": "tradeStatus",
                "type": "uint8"
            }
        ],
        "name": "TradeRejected",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "_address",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bytes32",
                "name": "_tradeId",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "internalType": "enum TradeManagerv2.State",
                "name": "tradeStatus",
                "type": "uint8"
            }
        ],
        "name": "TradeSettled",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_acc",
                "type": "address"
            }
        ],
        "name": "accExists",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "_tradeHash",
                "type": "bytes32"
            }
        ],
        "name": "acceptTrade",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "p1",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "p2",
                "type": "address"
            },
            {
                "internalType": "enum TradeManagerv2.Direction",
                "name": "_direction",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "_rate",
                "type": "uint256"
            },
            {
                "internalType": "enum TradeManagerv2.CUR_TYPE",
                "name": "_buyCur",
                "type": "uint8"
            },
            {
                "internalType": "enum TradeManagerv2.CUR_TYPE",
                "name": "_sellCur",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "_notional",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_contraNotional",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_tradeDate",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_valueDate",
                "type": "string"
            }
        ],
        "name": "createTrade",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_acc",
                "type": "address"
            },
            {
                "internalType": "enum TradeManagerv2.CUR_TYPE",
                "name": "_curr",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "_amt",
                "type": "uint256"
            }
        ],
        "name": "depositeAmount",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "_tradeHashId",
                "type": "bytes32"
            }
        ],
        "name": "getTrade",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "initiatorCp",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "receiverCp",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "notional",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "contraNotional",
                        "type": "uint256"
                    },
                    {
                        "internalType": "enum TradeManagerv2.Direction",
                        "name": "direction",
                        "type": "uint8"
                    },
                    {
                        "internalType": "uint256",
                        "name": "rate",
                        "type": "uint256"
                    },
                    {
                        "internalType": "enum TradeManagerv2.CUR_TYPE",
                        "name": "buyCur",
                        "type": "uint8"
                    },
                    {
                        "internalType": "enum TradeManagerv2.CUR_TYPE",
                        "name": "sellCur",
                        "type": "uint8"
                    },
                    {
                        "internalType": "string",
                        "name": "tradeDate",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "valueDate",
                        "type": "string"
                    },
                    {
                        "internalType": "enum TradeManagerv2.State",
                        "name": "state",
                        "type": "uint8"
                    },
                    {
                        "internalType": "bool",
                        "name": "isExist",
                        "type": "bool"
                    }
                ],
                "internalType": "struct TradeManagerv2.Trade",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_acc",
                "type": "address"
            },
            {
                "internalType": "enum TradeManagerv2.CUR_TYPE",
                "name": "_curr",
                "type": "uint8"
            }
        ],
        "name": "getUserCurrencyAmount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "messageSenderHash",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_newAcc",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "_lei",
                "type": "string"
            }
        ],
        "name": "registerAccount",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "_tradeHash",
                "type": "bytes32"
            }
        ],
        "name": "rejectTrade",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "_tdHash",
                "type": "bytes32"
            }
        ],
        "name": "settleTrade",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_acc",
                "type": "address"
            },
            {
                "internalType": "enum TradeManagerv2.CUR_TYPE",
                "name": "_curr",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "_amt",
                "type": "uint256"
            }
        ],
        "name": "withdrawAmount",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];
const sha256 = require('sha256');
const currentNodeUrl = process.argv[3];

//Constructor function 
function Blockchain() {
    // All the blocks that will be created and mined will be stored in this array as a chain
    this.chain = [];
    // All the new transactions that will be created before being post to a block and mined will be stored in this array
    this.pendingTransactions = [];

    this.currentNodeUrl = currentNodeUrl;
    this.networkNodes = [];

    //Creating Genesis Block
    this.createNewBlock(100, '0', '0'); // The arbitrary params for the first block of the chain
}

Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash) {
    const newBlock = {
        index: this.chain.length + 1,
        timestamp: Date.now(),
        transactions: this.pendingTransactions,
        nonce: nonce, // Nonce - a number 
        hash: hash, // All of the transactions are going to be compressed into single string - hash
        previousBlockHash: previousBlockHash
    };

    this.pendingTransactions = [];
    this.chain.push(newBlock);

    return newBlock;
}

Blockchain.prototype.getLastBlock = function() {
    return this.chain[this.chain.length - 1];
}

Blockchain.prototype.createNewTransaction = function(amount, sender, recipient) {
    const newTransaction = {
        amount: amount,
        sender: sender,
        recipient: recipient
    };

    this.pendingTransactions.push(newTransaction);
    // Returning the number of the block that this transaction will be added to
    return this.getLastBlock()['index'] + 1;
}


Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce) {
    const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);

    const hash = sha256(dataAsString);

    return hash;
}
//This function finds a correct nonce (the one that generates hash with '0000')
Blockchain.prototype.proofOfWork = function(previousBlockHash, currentBlockData) {
    //Blockchain.hashBlock(previousBlockHash, currentBlockData, nonce) // first 2 params are same, nonce is constantly changing while looking for a correct hash '0000...'
    //repeatedly hashing the block until it finds correct hash with '0000 ...'
    //previous block hash and current block data are used to generate the hash
    // nonce is continuously changing while finding correct hash
    //returns to us the nonce that creates correct hash

    let nonce = 0;
    let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);

    while (hash.substring(0, 4) !== '0000') {
        nonce++;
        hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
        //console.log(hash);
    } 
    return nonce; 
}

module.exports = Blockchain; 
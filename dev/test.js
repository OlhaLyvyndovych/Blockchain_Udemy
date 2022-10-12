const Blockchain = require('./blockchain');
const bitcoin = new Blockchain();

console.log(bitcoin);

//const previousBlockHash = 'some92384random23948data';
//current block data is an array of transactions 
/*
const currentBlockData = [
    {
        amount: 10,
        sender: 'dsho9380984nftwe47493',
        recipient: 'ksjdwef83975urey65rb'
    },
    {
        amount: 30,
        sender: 'dsho938098980458409ru',
        recipient: 'ksjdf83975urdcd34ey65rb'
    },
    {
        amount: 200,
        sender: 'dsho93809wewe84nf47493',
        recipient: 'ksjdfsd83975urey65rb'
    }
];
*/
//const nonce = 100;

//console.log(bitcoin.proofOfWork(previousBlockHash, currentBlockData)); // 9888 means it took 9888 times to find a hash with '0000'.

//console.log(bitcoin.hashBlock(previousBlockHash, currentBlockData, 9888));

// bitcoin.createNewBlock(1234, '01e27a4808c7bdd6562a42b2ca928789', 'fbf679c64ced0eadb5f894fd3cf83bfd');
// bitcoin.createNewTransaction(100, 'AlLEXkjb34fhibd394', 'JENNidje930948nde');
// bitcoin.createNewBlock(9876, 'prev93iuhfhash', 'hash0938jofshd98ethe9block');

// bitcoin.createNewTransaction(300, 'SaraXkjb34fhibd394', 'Jillidje930948nde');
// bitcoin.createNewTransaction(50, 'JackXkjb34fhibd394', 'Mikeidje930948nde');
// bitcoin.createNewTransaction(800, 'SamXkjb34fhibd394', 'Saraidje930948nde');
// bitcoin.createNewBlock(5647, 'some93iuhfhash', 'hhd98ethe9block');

//console.log(bitcoin.chain[2]);

console.log(bitcoin.currentNodeUrl);
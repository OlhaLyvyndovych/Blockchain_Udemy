const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const { v1: uuidv1 } = require('uuid');
const port = process.argv[2]; // Refers to start command variables array, port var is the third variable of array
const rp = require('request-promise');
const { request } = require('express');
const { removeAllListeners } = require('nodemon');

const nodeAddress = uuidv1().split('-').join('');

//We have an instance of our Bitcoin constructor function 
const bitcoin = new Blockchain();

//If the request comes in with json or form data 
//we parse it to access it in any of routes of our app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/blockchain', (req, res) => {
    //Here we are sending back the whole blockchain
    res.send(bitcoin);
});

app.post('/transaction', (req, res) => {
    const blockIndex = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
    res.json({ note: `Transaction will be added in block ${blockIndex}`});
});

app.get('/mine', (req, res) => {
    const lastBlock = bitcoin.getLastBlock();
    const previousBlockHash = lastBlock['hash']; // prev block hash at the hash property

    const currentBlockData = {
        transactions: bitcoin.pendingTransactions,
        index: lastBlock['index'] + 1 // is at property index + 1 
    }

    const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData); // returns nonce
    const blockHash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);

    // This current node (the whole api of the app is a node) will be rewarded for creating a block
    bitcoin.createNewTransaction(12.5, "00", nodeAddress);


    const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);
    res.json({
        note: "New block mined successfully",
        block: newBlock
    })
});

//Register a node and broadcast it to other nodes (the whole network)
app.post('/register-and-broadcast-node', (req, res) => {
    //Passing every node, that we want to register, into request body
    // When we use this endpoint we are going to send-in the url of a new node that we want to add to a network
    const newNodeUrl = req.body.newNodeUrl; 
    // Add a node
    if (bitcoin.networkNodes.indexOf(newNodeUrl) == -1) {
        bitcoin.networkNodes.push(newNodeUrl);
    }
    // ...  after some calculations we broadcast it so other nodes are going to add it as well
    //by hitting '/register-node' endpoint

    const regNodesPromises = [];

    bitcoin.networkNodes.forEach(networkNodeUrl => {
        //hitting '/register-node' endpoint - to broadcast to the other nodes of our network
        const requestOptions = {
            uri: networkNodeUrl + '/register_node', // other nodes are registering a new node
            method: 'POST',
            body: { newNodeUrl: newNodeUrl },
            json: true
        };

        regNodesPromises.push(rp(requestOptions));
    });

    Promise.all(regNodesPromises)
    .then(data => {
        //Here we are registering every node with a new node in our network by hitting '/register-nodes-bulk' endpoint
        //use the data ..   
        const bulkRegisterOptions = {
            uri: newNodeUrl + '/register-nodes-bulk',
            method: 'POST',
            body: { allNetworkNodes: [...bitcoin.networkNodes, bitcoin.currentNodeUrl]},
            json: true
        };
        return rp(bulkRegisterOptions);
    })
    .then(data => {
        res.json({ note: 'New node registred successfully' });
    });
});

//Register a node with the network // Here it's just being accepted by other nodes 
//Here every node should receive a broadcast sent by '/register-and-broadcast-node' endpoint
//And only thing that this endpoint should do - register a new node with a node that receives this request
app.post('/register-node', (req, res) => {
    //Taking a new node url passed (the data that we send) in body and save in a variable
    const newNodeUrl = req.body.newNodeUrl;
    //Check if node is not present in the array of nodes
    const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrl) == -1;
    //Check if a new node is not a current node
    const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl;
    //Registering new node url with a node that receive this request
    if (nodeNotAlreadyPresent && notCurrentNode) bitcoin.networkNodes.push(newNodeUrl);
    
    
    res.json({ note: 'New node registered successfully.'})
});

//Register multiple nodes at once
app.post('/register-nodes-bulk', (req,res) => {
    const allNetworkNodes = req.body.allNetworkNodes;
    //Looping through every node url of an array and register it with a new node
    allNetworkNodes.forEach(networkNodeUrl => {
        // register each node with current node which is a new node
        const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf == -1;
        const notCurrentNode = bitcoin.currentNodeUrl !== networkNodeUrl;
        if (nodeNotAlreadyPresent && notCurrentNode) bitcoin.networkNodes.push(networkNodeUrl);
    });
    res.json({ note: "Bulk registration successful!" });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
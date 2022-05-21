
// Import react components
import { useState, useEffect} from 'react';

// Import UI Components
import { Header, Container, Button } from 'semantic-ui-react';

// Import the SkynetClient and a helper
// import { SkynetClient } from 'skynet-js';


// We'll define a portal to allow for developing on localhost.
// When hosted on a skynet portal, SkynetClient doesn't need any arguments.
// const portal = window.location.hostname === 'localhost' ? 'https://siasky.net' : undefined;

// Initiate the SkynetClient
// const client = new SkynetClient(portal);

/*****/

function App() {
  // Define app state helpers
  const [loading, setLoading] = useState(false);
  
  // choose a data domain for saving files in MySky
  //const dataDomain = 'localhost';

  /*****/
  // On initial run, start initialization of MySky
  useEffect(() => {
    
  }, []);

  // Connecting Wallet to Frontend
  const handleConnect = async (event) => {
    event.preventDefault();
    console.log('begin login attempt');
    setLoading(true);
    // Check that AlgoSigner is installed
    if(typeof AlgoSigner !== 'undefined') {
      // connects to the browser AlgoSigner instance
      window.AlgoSigner.connect()
      // finds the TestNet accounts currently in AlgoSigner
      .then(() => window.AlgoSigner.accounts({
          ledger: 'TestNet'
      }))
      .then((accountData) => {
          // the accountData object should contain the Algorand addresses from TestNet that AlgoSigner currently knows about
          console.log(accountData);
          window.document.getElementById("account").innerText = "Account: " + 
          accountData[0].address.substring(0,4)+" ... "+accountData[0].address.substring(accountData[0].address.length-4);
          sessionStorage.setItem('address',accountData[0].address);
        })
      .catch((e) => {
          // handle errors and perform error cleanup here
          console.error(e);
      });
    }
  }
  
  /* Sending Coins */
  const handleSendAlgo = async (event) => {
    event.preventDefault();
    console.log('begin send attempt');
    setLoading(true);
    
    const algosdk = require('algosdk');
    
    const baseServer = 'https://testnet-algorand.api.purestake.io/ps2'
    const port = '';
    const token = {
        'X-API-Key': 'BjPgZDZX4T3ZjlUzyEl7H9ZYK5TtZbyq72ua1r63'
    }
    
    const algodclient = new algosdk.Algodv2(token, baseServer, port);
    
    let params = await algodclient.getTransactionParams().do();
      
    const receiver = "E2YB673D7KLS4363SC77AQQTXYAJPQNTA2QMUVYAJZVCKVKU6VBZRYK4WQ";
    const enc = new TextEncoder();
    const note = enc.encode("Hello World");
    let amount = 1000000; // equals 1 ALGO
    
    let txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: sessionStorage.getItem('address'), 
        to: receiver, 
        amount: amount, 
        note: note, 
        suggestedParams: params
    });

    // Use the AlgoSigner encoding library to make the transactions base64
    let txn_b64 = window.AlgoSigner.encoding.msgpackToBase64(txn.toByte());

    let txnID = await window.AlgoSigner.signTxn([{txn: txn_b64}]);
    
    console.log(txnID[0].blob);
    
    window.AlgoSigner.send({
      ledger: 'TestNet',
      tx: txnID[0].blob // the unique blob representing the signed transaction
    }).then((d) =>{
      console.log("send successful")
      console.log(d);

    })
    .catch((e) => {
        console.error(e);
    });  
    setLoading(false);      
   
  }
  const handleSendWeth = async (event) => {
    event.preventDefault();
    console.log('begin send attempt');
    setLoading(true);
    
    const algosdk = require('algosdk');
    const baseServer = 'https://testnet-algorand.api.purestake.io/ps2'
    const port = '';
    const token = {
        'X-API-Key': 'BjPgZDZX4T3ZjlUzyEl7H9ZYK5TtZbyq72ua1r63'
    }
    
    const algodclient = new algosdk.Algodv2(token, baseServer, port);
    
    let params = await algodclient.getTransactionParams().do();
      
    const receiver = "2RTLJ5YR6YNF4KBZ6SSYFSQLRGXDORU5JV7VRQ6P52MOHQVGL4NFT3IPBQ";
    const enc = new TextEncoder();
    const note = enc.encode("Hello World");
    let amount = 5; // equals 1 ALGO
    let assetId = 90650110;
    
    let txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        assetIndex: assetId,
        from: sessionStorage.getItem('address'), 
        to: receiver, 
        amount: amount, 
        note: note, 
        type:  'axfer',  // ASA Configuration (acfg)
        suggestedParams: params
    });

    // Use the AlgoSigner encoding library to make the transactions base64
    let txn_b64 = window.AlgoSigner.encoding.msgpackToBase64(txn.toByte());

    let txnID = await window.AlgoSigner.signTxn([{txn: txn_b64}]);
    
    console.log(txnID[0].blob);
    
    window.AlgoSigner.send({
      ledger: 'TestNet',
      tx: txnID[0].blob // the unique blob representing the signed transaction
    }).then((d) =>{
      console.log("send successful")
      console.log(d);

    })
    .catch((e) => {
        console.error(e);
    });  
    setLoading(false);      
   
  }

  /* Checking Wallet Balance */
  const getAlgoBalance = async (event) => {
    const algosdk = require('algosdk');
    const baseServer = 'https://testnet-algorand.api.purestake.io/idx2'
    const port = '';
    const token = {
        'X-API-Key': 'BjPgZDZX4T3ZjlUzyEl7H9ZYK5TtZbyq72ua1r63'
    };
    
    const indexerClient = new algosdk.Indexer(token, baseServer, port);
    
    let address = "JTCQW5TV5OY5HIX6O7ER5LKIC74UJYU2ORYDRHYXRGGVOJJK4ALDUZSMXI";
    let response = await indexerClient.lookupAccountAssets(address).do();
    let algAmount;
    response.assets.forEach((asset) => {
      if(asset['asset-id']===90650110){
        algAmount = asset['amount'] * 10**-8
        //console.log(algAmount)
      }
    })
    window.document.getElementById('algoWallet').innerText = "Algorand Wallet: " + String(algAmount).substring(0,8) + " ALGO";
    return algAmount;

  }
  getAlgoBalance();
  setInterval(getAlgoBalance, 1000);
  const getEthBalance = async (event) => {
    const Web3 = require('web3');
    const web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/e8dcbee341124f3884d296c775de27fa"))
    
    let tokenAddress = "0xc778417E063141139Fce010982780140Aa0cD5Ab";
    let walletAddress = "0x7F36B39c2e1bCc4Ec135832e21eCF082A6EC7e77";

    // The minimum ABI to get ERC20 Token balance
    let minABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"guy","type":"address"},{"name":"wad","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"wad","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"guy","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Withdrawal","type":"event"}];
    let contract = new web3.eth.Contract(minABI,tokenAddress);
    let balance = await contract.methods.balanceOf(walletAddress).call();
    //console.log(web3.utils.fromWei(balance, "ether") + " ETH");
    //console.log(balance);
    window.document.getElementById('ethWallet').innerText = "Wrapped Ethereum Wallet: " + web3.utils.fromWei(balance, "ether") + " wETH";
   
        
  }
  getEthBalance();
  setInterval(getEthBalance, 10000);
  


  return (
    <Container>
    <Container
      style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}
    >
      <Header
        as="h1"
        content="xStaking"
        textAlign="left"
        style={{ marginTop: '1em', marginBottom: '1em' }}
      />
      <Header
        as="p"
        id="account"
        content="Account: "
        style={{ marginTop: '2em', marginBottom: '2em' }}
      >
      </Header>
      <Button
        onClick={handleConnect}
        style={{color:'white',backgroundColor: 'steelblue', height:'50px', margin:'auto 0'}}
      > Connect Wallet </Button>
    </Container>
    
    <Container
      style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}
    >
      
     <Header
        as="p"
        id="algoWallet"
        content="Algorand Wallet: "
        style={{ marginTop: '2em', marginBottom: '2em' }}
      >
      </Header>
      <Header
        as="p"
        id="ethWallet"
        content="Wrapped Ethereum Wallet: "
        style={{ marginTop: '2em', marginBottom: '2em' }}
      >
      </Header>
    </Container>

    <Button
        onClick={handleSendAlgo}
        style={{color:'white',backgroundColor: 'steelblue', height:'50px', margin:'auto 0'}}
    > Convert ALGO to wETH </Button>

    <Button
        onClick={handleSendWeth}
        style={{marginLeft:'10px',color:'white',backgroundColor: 'steelblue', height:'50px'}}
    > Stake wETH </Button>
    </Container>
  );
}

export default App;

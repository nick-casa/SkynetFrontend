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
     
    <Button
        onClick={handleSendAlgo}
        style={{color:'white',backgroundColor: 'steelblue', height:'50px', margin:'auto 0'}}
    > Stake Algo </Button>
    <Button
        onClick={handleSendWeth}
        style={{color:'white',backgroundColor: 'steelblue', height:'50px', margin:'auto 0'}}
    > Stake wETH </Button>
    </Container>
    </Container>
  );
}

export default App;

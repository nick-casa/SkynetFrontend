// Import AlgoSigner Wallet
//import AlgoSignerWallet from "./wallets/algosigner";
//import { PermissionCallback, Wallet, SignedTxn } from "./wallets/wallet";

// Import Transaction and TransactionSigner from Algorand
//import "algosdk";

// Import react components
import { useState, useEffect, useCallback } from 'react';

// Import App Component & helper
import WorkshopForm from './components/Form';
// import generateWebPage from './helpers/generateWebPage';

// Import UI Components
import { Header, Tab, Container, Button, Message } from 'semantic-ui-react';

// Import the SkynetClient and a helper
import { SkynetClient } from 'skynet-js';

const algosdk = require('algosdk');

// We'll define a portal to allow for developing on localhost.
// When hosted on a skynet portal, SkynetClient doesn't need any arguments.
const portal =
  window.location.hostname === 'localhost' ? 'https://siasky.net' : undefined;

// Initiate the SkynetClient
const client = new SkynetClient(portal);
/*****/

function App() {
  // Define app state helpers
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Step 1 Helpers
  const [file, setFile] = useState();
  const [fileSkylink, setFileSkylink] = useState('');

  // Step 2 Helpers
  const [name, setName] = useState('');
  //const [webPageSkylink, setWebPageSkylink] = useState('');
  //const [webPageSkylinkUrl, setWebPageSkylinkUrl] = useState('');

  // Step 3 Helpers
  const [dataKey, setDataKey] = useState('');
  const [userColor, setUserColor] = useState('#000000');
  //const [filePath, setFilePath] = useState();
  const [userID, setUserID] = useState();
  const [mySky, setMySky] = useState();
  const [loggedIn, setLoggedIn] = useState(null);

  // When dataKey changes, update FilePath state.
  /*
  useEffect(() => {
    setFilePath(dataDomain + '/' + dataKey);
  }, [dataKey]);
  */

  // choose a data domain for saving files in MySky
  const dataDomain = 'localhost';

  /*****/

  // On initial run, start initialization of MySky
  useEffect(() => {
    /************************************************/
    /*        Step 3.2 Code goes here               */
    /************************************************/
    
    // define async setup function
    async function initMySky() {
      try {
        // load invisible iframe and define app's data domain
        // needed for permissions write
        const mySky = await client.loadMySky(dataDomain);

        // load necessary DACs and permissions
        // await mySky.loadDacs(contentRecord);

        // check if user is already logged in with permissions
        const loggedIn = await mySky.checkLogin();

        // set react state for login status and
        // to access mySky in rest of app
        setMySky(mySky);
        setLoggedIn(loggedIn);
        if (loggedIn) {
          setUserID(await mySky.userID());
        }
      } catch (e) {
        console.error(e);
      }
    }

    // call async setup function
    initMySky();
    /*****/
  }, []);

  
  const handleConnect = async (event) => {
    event.preventDefault();
    console.log('begin login attempt');
    setLoading(true);
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
      })
      .catch((e) => {
          // handle errors and perform error cleanup here
          console.error(e);
      });
    }
  }

  const handleSend = async (event) => {
    const algodToken = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
    const algodServer = 'http://localhost';
    const algodPort = 4001;
    let algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);
    console.log(algodClient);

    /*
    let assetId = '368715566'
    let from = '{address of the account to send ALGOs from}'; 
    let to = 'JWMNDCP4XCDLTH2FOCX7EDI4J5TJKDPSATRMKS6ARIVTTGFHD6IQ'; 
    let amount = '0.1'; 
    let note = 'An optional note'; 


    window.AlgoSigner.connect()
        .then(() => window.AlgoSigner.algod({ 
            ledger: 'TestNet', 
            path: '/v2/transactions/params'
        }))
        .then((txParams) => window.AlgoSigner.sign({
          assetIndex: assetId,
            from: from,
            to: to,
            amount: +amount,
            note: note,
            type: 'axfer',
            fee: txParams['min-fee'],
            firstRound: txParams['last-round'],
            lastRound: txParams['last-round'] + 1000,
            genesisID: txParams['genesis-id'],
            genesisHash: txParams['genesis-hash'],
            flatFee: true
        })) 
        .then((signedTx) => window.AlgoSigner.send({ 
            ledger: 'TestNet', 
            tx: signedTx.blob 
        }))
        .catch((e) => 
        { 
            // handle errors and perform error cleanup here
            console.error(e); 
        });
        */
      }


  // Handle form submission. This is where the bulk of the workshop logic is
  // handled
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('form submitted');
    setLoading(true);
 
    /************************************************/
    /*        Part 1: Upload a file                */
    /************************************************/
    console.log('Uploading file...');

    /************************************************/
    /*        Step 1.3 Code goes here               */
    /************************************************/
    // Upload user's file and get backs descriptor for our Skyfile
    const { skylink } = await client.uploadFile(file);

    // skylinks start with `sia://` and don't specify a portal URL
    // we can generate URLs for our current portal though.
    const skylinkUrl = await client.getSkylinkUrl(skylink);

    console.log('File Uploaded:', skylinkUrl);

    // To use this later in our React app, save the URL to the state.
    setFileSkylink(skylinkUrl);

    /************************************************/
    /*        Part 2: Upload a Web Page             */
    /************************************************/
    // console.log('Uploading web page...');

    /************************************************/
    /*        Step 2.1 Code goes here               */
    /************************************************/


    /************************************************/
    /*        Part 3: MySky                         */
    /************************************************/
    // console.log('Saving user data to MySky file...');

    /************************************************/
    /*        Step 3.6 Code goes here              */
    /************************************************/


    /*****/

    setLoading(false);
  };

  const handleMySkyLogin = async () => {
    /************************************************/
    /*        Step 3.3 Code goes here               */
    /************************************************/


    /*****/
  };

  const handleMySkyLogout = async () => {
    /************************************************/
    /*        Step 3.4 Code goes here              */
    /************************************************/


    /*****/
  };

  const handleMySkyWrite = async (jsonData) => {
    /************************************************/
    /*        Step 3.7 Code goes here              */
    /************************************************/


    /*****/
    /************************************************/
    /*        Step 4.7 Code goes here              */
    /************************************************/


    /*****/
  };

  // loadData will load the users data from SkyDB
  const loadData = async (event) => {
    event.preventDefault();
    setLoading(true);
    console.log('Loading user data from SkyDB');

    /************************************************/
    /*        Step 4.5 Code goes here              */
    /************************************************/


    /*****/

    setLoading(false);
  };

  const handleSaveAndRecord = async (event) => {
    event.preventDefault();
    setLoading(true);

    /************************************************/
    /*        Step 4.6 Code goes here              */
    /************************************************/


    /*****/

    setLoading(false);
  };

  // define args passed to form
  const formProps = {
    mySky,
    handleSubmit,
    handleMySkyLogin,
    handleMySkyLogout,
    handleSaveAndRecord,
    loadData,
    name,
    dataKey,
    userColor,
    activeTab,
    fileSkylink,
    //webPageSkylinkUrl,
    loading,
    loggedIn,
    dataDomain,
    userID,
    setLoggedIn,
    setDataKey,
    setFile,
    setName,
    setUserColor,
  };

  // handleSelectTab handles selecting the part of the workshop
  const handleSelectTab = (e, { activeIndex }) => {
    setActiveTab(activeIndex);
  };

  const panes = [
    {
      menuItem: 'Part 1: File Upload',
      render: () => (
        <Tab.Pane>
          <WorkshopForm {...formProps} />
        </Tab.Pane>
      ),
    }];

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
      <Button
        onClick={handleConnect}
        style={{backgroundColor: 'steelblue', height:'50px', margin:'auto 0'}}
      > Connect Wallet </Button>
    </Container>
    
    <Container
      style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}
    >
     
      <Button
        onClick={handleSend}
        style={{backgroundColor: 'steelblue', height:'50px', margin:'auto 0'}}
      > Stake </Button>
    </Container>
    </Container>
  );
}
/*
<Container>
      <Tab
        menu={{ fluid: true, vertical: true, tabular: true }}
        panes={panes}
        onTabChange={handleSelectTab}
        activeIndex={activeTab}
      />
    </Container>
*/
export default App;

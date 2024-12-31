import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal';

// Components
import Navigation from './components/Navigation'
import Sort from './components/Sort'
import Card from './components/Card'
import SeatChart from './components/SeatChart'

// ABIs
import TokenMaster from './abis/TicketCountz.json'

// Config
import config from './config.json'

function App() {

  //useStates for storing the variables
  const [provider, setProvider] = useState(null)
  const [account, setAccount] = useState(null)

  const [tokenmaster , setTokenmaster]=useState(null);
  const [showData , setShowData]=useState([]);
  const [toggle , setToggle]=useState(false);
  const [show , setShow]=useState({});

  //loading the blockchain
  const LoadBlockchain=async()=>{

    const web3Modal = new Web3Modal(); //creating the instance of web3 modal
    const connection = await web3Modal.connect(); //connecting the user wallet
    const provider = new ethers.providers.Web3Provider(connection) //wrapping connection obj with the web3 provider
    const signer =await provider.getSigner(); //getting the account which is used to communicate with the contract


    const tokenMaster = new ethers.Contract("0xb0ebe9C9e1c15EAA16f0d77Bcf0e02203247153a", TokenMaster, signer);
    setTokenmaster(tokenMaster);

    //loading datas from the smartcontract;

    const totalSupply=await tokenMaster.totalOccation();
    const datas=[];
    for(var i=1;i<totalSupply;i++)
    {
      const data=await tokenMaster.occasions(i);
      datas.push(data);
    }
    setShowData(datas);
    console.log(showData);


  }

  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(true); 
    //useEffect for loading blockchain
    useEffect(()=>{
      if (typeof window.ethereum === 'undefined') { 
        setIsMetaMaskInstalled(false); 
      }else
      LoadBlockchain();
    },[])


  return (
    <div>
      {isMetaMaskInstalled ?<>
        <header>
         <Navigation account={account} setAccount={setAccount}/>
        <h2 className='header__title'><strong>Event</strong> Tickets</h2>
       </header>
       <Sort/>

       <div className='cards'>
        {showData.map((show, index) => (
          <Card
            occasion={show}
            id={index + 1}
            tokenMaster={tokenmaster}
            provider={provider}
            account={account}
            toggle={toggle}
            setToggle={setToggle}
            setOccasion={setShow}
            key={index}
          />
        ))}
      </div>
      {toggle && (
        <SeatChart
          occasion={show}
          tokenMaster={tokenmaster}
          provider={provider}
          setToggle={setToggle}
        />
      )}
      </>:<><p style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', margin: 0 }}>Install Metamask to access this site.</p></>}

    </div>
  );
}

export default App;
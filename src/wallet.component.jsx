import React, {useState} from 'react';
import { ethers } from "ethers";



const Wallet = () => {
    const [errorMessage, setErrorMessage] = useState('')
    const [balance, setBalance] = useState('')
    const [gasPrice, setGasPrice] = useState('')
    const [network, setNetwork] = useState('')
    const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
    const [defaultAccount, setDefaultAccount] = useState(null)
    const signer = provider.getSigner()

    provider.on("network", (newNetwork, oldNetwork) => {
        if (oldNetwork) {
            window.location.reload();
        }
    });
    
    const detectMetamask = () => {
        setErrorMessage(' ');
        if (window.ethereum) {
            window.ethereum.request({ method: 'eth_requestAccounts' })
            .then(result => {
				accountChangedHandler(result[0]);
                getNetwork()
                getGasPrice()
			})
            
        }else{
            setErrorMessage('Please install metamask');
        }
    }

   
        // Send 1 ether to an ens name.
    const  transaction = () => {
        signer.sendTransaction({
        to: "0xa4326545b6e7f946CB8F2373191Bc2C56A8A8a19",
        value: ethers.utils.parseEther("0.005")
    })
    }

    const accountChangedHandler = (address) => {
        setDefaultAccount(address)
        getBalance(address.toString())
    }

    async function getNetwork(){
        const { chainId } = await provider.getNetwork()
        setNetwork(chainId)
    }

    async function getGasPrice(){
        const gasPrice = await provider.getGasPrice();
        setGasPrice(gasPrice)
    }

    async function getBalance(address){
        let balance = await provider.getBalance(address)
        setBalance(ethers.utils.formatEther(balance)) 
    } 

    return(
       <div>
           <button className="button" onClick={detectMetamask}>Connect Metamask</button>
           <div className="grid">
                <div className="card-info">
                    <div className="card-title">
                        Eth Address
                    </div>
                    <div className="card-body">
                        {defaultAccount}
                    </div>
                </div>
                <div className="card-info">
                    <div className="card-title">
                        Balance Eth
                    </div>
                    <div className="card-body">
                        {balance}
                    </div>
                </div>
                <div className="card-info">
                    <div className="card-title">
                        Network
                    </div>
                    <div className="card-body">
                        {network}
                    </div>
                </div>
                <div className="card-info">
                    <div className="card-title">
                        Gas Price
                    </div>
                    <div className="card-body">
                        {gasPrice._hex}
                    </div>
                </div>
                <div className="card-info">
                    <div className="card-title">
                        Send 0.05 eth to other account
                    </div>
                    <div className="card-body">
                    <button className="button" onClick={transaction}>make transaction</button>
                    </div>
                </div>
           </div>
           <p>{errorMessage}</p>
       </div>
    )
}


export default Wallet


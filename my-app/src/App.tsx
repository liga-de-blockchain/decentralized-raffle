import { ethers } from 'ethers';
import './App.css';
import RaffleContract from "../../artifacts/contracts/Raffle.sol/RaffleContract.json";
const { CONTRACT_ADDRESS } = process.env;


function App() {

  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");
  const contract = new ethers.Contract("", RaffleContract["abi"]);
  return (
    <div className="App">
      <h1>Decentralized Raffler</h1>
      
    </div>
  );
}

export default App;

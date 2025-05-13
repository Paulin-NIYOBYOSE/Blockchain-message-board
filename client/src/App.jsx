import React, { useEffect, useState } from "react";
import Web3 from "web3";
import HelloWorldContract from "./MyContract.json";
import "./App.css";

function App() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [storedName, setStoredName] = useState("Loading......."); // Initial loading message
  const [newName, setNewName] = useState("");

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });

        const accounts = await web3Instance.eth.getAccounts();
        setAccount(accounts[0]);

        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = HelloWorldContract.networks[networkId];

        if (deployedNetwork) {
          const instance = new web3Instance.eth.Contract(
            HelloWorldContract.abi,
            deployedNetwork.address
          );
          setWeb3(web3Instance);
          setContract(instance);
        } else {
          alert("Smart contract not deployed to this network.");
        }
      } else {
        alert("Please install MetaMask!");
      }
    };

    init();
  }, []);

  const getName = async () => {
    if (contract) {
      setStoredName("Loading......."); // Clear the name message when refreshing
      const name = await contract.methods.getName().call();
      if (name && name.trim() !== "") {
        setStoredName(name); // Update message only when we have a valid one
      }// } else {
      //   setStoredName("No message set."); // If no message is set
      // }
    }
  };

  const setName = async () => {
    if (contract && account && newName.trim()) {
      await contract.methods.setName(newName).send({ from: account });
      setNewName("");
      getName(); // Refresh
    }
  };

  const clearMessage = async () => {
    if (contract) {
      await contract.methods.clearName().send({ from: account });
      getName(); // Refresh after clearing
    }
  };

  useEffect(() => {
    if (contract) {
      getName();
    }
  }, [contract]);

  return (
    <div className="board-container">
      <h1 className="heading">📬 Blockchain Message Board</h1>

      <div className="message-box">
        <p className="label">
          <strong>Current message:</strong> {storedName}
        </p>
      </div>

      <div className="form-row">
        <input
          type="text"
          placeholder="Enter a new message"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="input-field"
        />
        <button onClick={setName} className="button">
          Update Message
        </button>
      </div>

      <div className="refresh-row">
        <button onClick={clearMessage} className="refresh-button">
          🔄 Refresh
        </button>

      
      </div>
    </div>
  );
}

export default App;

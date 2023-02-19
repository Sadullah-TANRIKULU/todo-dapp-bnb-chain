import { useState } from "react";
import { ImBin2, ImQuill } from "react-icons/im";
import Web3 from "web3";
import "./App.css";

let account = null;
let contract = null;

function App() {
  const [inputValue, setInputValue] = useState("");
  const [tasks, setTasks] = useState([]);
  const [isUpdate, setIsUpdate] = useState(true);
  const [taskId, setTaskId] = useState(0);
  let tempId;
  let id;
  const ABI = [
    {
      inputs: [
        {
          internalType: "string",
          name: "taskDescription",
          type: "string"
        }
      ],
      name: "addTask",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "index",
          type: "uint256"
        }
      ],
      name: "removeTask",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "index",
          type: "uint256"
        }
      ],
      name: "updateStatus",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "index",
          type: "uint256"
        },
        {
          internalType: "string",
          name: "newDescription",
          type: "string"
        }
      ],
      name: "updateTask",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [],
      name: "listTasks",
      outputs: [
        {
          components: [
            {
              internalType: "string",
              name: "description",
              type: "string"
            },
            {
              internalType: "bool",
              name: "status",
              type: "bool"
            }
          ],
          internalType: "struct Todo.Task[]",
          name: "",
          type: "tuple[]"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256"
        }
      ],
      name: "tasks",
      outputs: [
        {
          internalType: "string",
          name: "description",
          type: "string"
        },
        {
          internalType: "bool",
          name: "status",
          type: "bool"
        }
      ],
      stateMutability: "view",
      type: "function"
    }
  ];
  const ADDRESS = "0x16baB880435CfAE58D38150C7CE77e3C162220C2";

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.send("eth_requestAccounts");
        const accounts = await web3.eth.getAccounts();
        account = accounts[0];
        contract = new web3.eth.Contract(ABI, ADDRESS);
        const data = await contract.methods.listTasks().call();
        setTasks([...data]);
        console.log(tasks);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addTask = async e => {
    e.preventDefault();
    await contract.methods.addTask(inputValue).send({ from: account });
    const data = await contract.methods.listTasks().call();
    console.log(data);
    setTasks([...data]);
    console.log(tasks);
    setInputValue("");
  };

  const updateTask = async e => {
    e.preventDefault();
    try {
      console.log(taskId, tempId, inputValue);
      await contract.methods
        .updateTask(taskId, inputValue)
        .send({ from: account });
      const data = await contract.methods.listTasks().call();
      setTasks([...data]);
      setIsUpdate(!isUpdate);
      setInputValue("");
      console.log(data);
      console.log(tasks);
    } catch (error) {
      console.error(error);
    }
  };

  const handleTaskStatus = async item => {
    const id = tasks.indexOf(item);

    console.log(id);
    await contract.methods.updateStatus(id).send({ from: account });
    const data = await contract.methods.listTasks().call();
    console.log(data);
    setTasks([...data]);
    console.log(tasks);
  };

  const handleUpdate = async item => {
    tempId = tasks.indexOf(item);
    setTaskId(tempId);
    setInputValue(item.description);
    setIsUpdate(!isUpdate);
    console.log("updated", taskId);
  };

  const handleDelete = async item => {
    const id = tasks.indexOf(item);

    console.log(id);
    await contract.methods.removeTask(id).send({ from: account });
    const data = await contract.methods.listTasks().call();
    console.log(data);
    setTasks([...data]);
    console.log(tasks);
  };

  return (
    
    <div className="App">
      <header>
        <h1>TODO DAPP</h1>
        <div>
          <button onClick={connectWallet}>Connect Wallet</button>
        </div>
      </header>
      <main>
        <section className="form">
          {isUpdate
            ? <form onSubmit={e => addTask(e)}>
                <div>
                  <label htmlFor="taskDescription">Task Description</label>
                  <input
                    type="text"
                    name="taskDescription"
                    id="taskDescription"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                  />
                </div>
                <button type="submit">Add Task</button>
              </form>
            : <form onSubmit={e => updateTask(e)}>
                <div>
                  <label htmlFor="taskDescription">Task Description</label>
                  <input
                    type="text"
                    name="taskDescription"
                    id="taskDescription"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                  />
                </div>

                <button type="submit">Update Task</button>
              </form>}
        </section>

        <section className="displayTasks">
          {tasks.map(item => {
            id = tasks.indexOf(item);
            return (
              <div className="task" key={id}>
                <div onClick={() => handleTaskStatus(item)}>
                  <p>
                    {id}
                  </p>
                  <p
                    style={{
                      textDecoration: item.status ? "line-through" : "none"
                    }}
                  >
                    {item.description}
                  </p>
                </div>
                <div>
                  <ImQuill onClick={() => handleUpdate(item)} id="quill" />
                  <ImBin2 onClick={() => handleDelete(item)} id="bin" />
                </div>
              </div>
            );
          })}
        </section>
      </main>
      <footer>All rights reserved! 👨🏿‍🦳</footer>
    </div>
  );
}

export default App;

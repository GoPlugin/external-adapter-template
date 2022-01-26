# Xinfin Network + Plugin:  API Data pull from Customized Acurite Weather Unit

Demonstrating how to connect Xinfin Network and Plugin together, and thus bringing the world of oracles to Xinfin Network.

There are two main implications:

The connection of Plugin to Xinfin Network allows for the growth of all types of oracles on Xinfin Network to power exchanges, other oracle needs, and bridge Web2 technology with Web3.

Automating the process by including the CRON so that it updates the price value periodically

## Setup Steps

Follow plugin-deployment script to setup Plugin Node

Please see 
[plugin-deployment](https://github.com/GoPlugin/plugin-deployment)

### Steps to be done If you want to try this locally
1) Deploy Consumer.sol in "Mainnet" network
2) Fund your "Consumer" contract address with PLI token
3) Go to Plugin GUI 
- 3a) Create a bridge to connect external adapter
- 3b) Create a job spec with Oracle address - It will result JOB ID
- 3c) Copy this job-Id and feed the inputs in requestWeather function
4) Execute weather_adapter and keep listening for events 
5) Trigger requestweather function from remix to register the request

### 1) Deploy Consumer.sol in "Mainnet" network

copy Consumer.sol from contracts folder and do the deployment using remix IDE - https://remix.xinfin.network/

Make sure, you have "Injected web3" and XdcPay wallet is connected. Deploy Contract by overriding PLI Token address -- Once deployed, copy the contract address - > this is going to be the client contract address 

### 2) Fund your "Consumer" contract address with PLI token

Make sure you fund your contract address with enough PLI token - This is key step, without which you will not be able to trigger requestweather function - it will throw Json-RPC error. 

### 3) Create Bridge & Job Spec in Plugin GUI

#### 3a) Create a bridge to register the "External adapter"

- Login Plugin UI using the email ID & Password which you have setup during Plugin node setup
- Go to Bridge section
  - Give a name(user defined) for ex - Temperature
  - Give a URL and it should be http://localhost:5000

once done, save this and you should be good.

#### 3b) Create a Job ID using following job spec

- Login Plugin UI using the email ID & Password which you have setup during Plugin node setup
- Go to Job section
  - Click "New Job" and copy paste the following job spec

```
{
  "initiators": [
    {
      "type": "external",
      "params": {
        "name": "xdc",
        "body": {
          "endpoint": "xdc",
          "addresses": ["oracle address"]
        }
      }
    }
  ],
  "tasks": [
    {
      "type": "temperature"
    },
    {
      "type": "copy",
        "params": {
        "copyPath": [
          "result"
        ]
      }
    },
    {
      "type": "multiply"
    },
    {
      "type": "ethuint256"
    },
    {
       "type": "EthTx"
    }
  ]
}

```

The initiators set the contract address that triggers the Plugin node to initiate a specific job, while tasks defines the work pipeline for this job. Note that the parameter “address: 0xac01be7848651fbc7a9f3e8b72f9d47a0f4ceb47" indicates that the node will only listen to that address for the job ID, which should be updated with the deployed Oracle contract address properly.

For example, the “tasks” define that the Plugin node will first retrieve data from the external adapter "weather" (i.e., the Bridge will interact with the URL endpoint of external adapter to access the data in JSON format), copy the data field, multiply it by 100, and convert it into uint256 type.
The new Job can be found in the Tab of “Jobs” as below. 

once done, save this and you should be get a job ID in this format  --> 8cbc3e6ceed04d5b9a7591374325b640

#### 3c) Copy this JOB_ID and feed this in client contract 

This job id should be overriden in requestweather function in remix and trigger

### 5) Execute weather_adapter and keep listening for events 

External adapters are provided in the [weather_adapter](./weather_adapter) folder. They are simple servers built using Express that receives a post API call from the Plugin node and sends the information to the smart contract on Xinfin Network.

```
cd weather_adapter
npm install
npm start
```

Don't forget to install packages with `npm install` and then start the servers with `npm start`. The external servers will start on `http://localhost:5000`

| Bridge Name    | Endpoint                     | Functionality                          |
| -------------- | ---------------------------- | -------------------------------------- |
| `weather`    | http://localhost:5000          | Sending transaction to Xinfin Network  |


Once the above steps are successful, you will be able to see the job is triggered in Plugin UI and task is succesfully writing weather on blockchain.

pragma solidity 0.4.24;

import "@goplugin/contracts/src/v0.4/vendor/Ownable.sol";
import "@goplugin/contracts/src/v0.4/PluginClient.sol";

contract Consumer is PluginClient, Ownable {
    
  //Initialize Oracle Payment     
  uint256 constant private ORACLE_PAYMENT = 0.1 * 10**18;
  uint256 public currentValue;

  //Initialize event RequestFulfilled   
  event RequestFulfilled(
    bytes32 indexed requestId,
    uint256 indexed currentVal
  );

  //Initialize event requestCreated   
  event requestCreated(address indexed requester,bytes32 indexed jobId, bytes32 indexed requestId);

  //Constructor to pass Pli Token Address during deployment
  constructor(address _pli) public Ownable() {
    setPluginToken(_pli);
  }

  //_fsysm should be the name of your source token from which you want the comparison 
  //_tsysm should be the name of your destinaiton token to which you need the comparison
  //_jobID should be tagged in Oracle
  //_oracle should be fulfiled with your plugin node address

  function requestData(address _oracle, string _jobId,string _fsysm,string _tsysm)
    public
    onlyOwner
    returns (bytes32 requestId)
  {
    Plugin.Request memory req = buildPluginRequest(stringToBytes32(_jobId), this, this.fulfill.selector);
    req.add("fsyms",_fsysm);
    req.add("tsyms",_tsysm);
    req.addInt("times", 100);
    requestId = sendPluginRequestTo(_oracle, req, ORACLE_PAYMENT);
    emit requestCreated(msg.sender, stringToBytes32(_jobId), requestId);
  }

  //callBack function
  function fulfill(bytes32 _requestId, uint256 _currentval)
    public
    recordPluginFulfillment(_requestId)
  {
    emit RequestFulfilled(_requestId, _currentval);
    currentValue = _currentval;
  }

  function getPluginToken() public view returns (address) {
    return pluginTokenAddress();
  }

  //With draw pli can be invoked only by owner
  function withdrawPli() public onlyOwner {
    PliTokenInterface pli = PliTokenInterface(pluginTokenAddress());
    require(pli.transfer(msg.sender, pli.balanceOf(address(this))), "Unable to transfer");
  }

  //Cancel the existing request
  function cancelRequest(
    bytes32 _requestId,
    uint256 _payment,
    bytes4 _callbackFunctionId,
    uint256 _expiration
  )
    public
    onlyOwner
  {
    cancelPluginRequest(_requestId, _payment, _callbackFunctionId, _expiration);
  }

  //String to bytes to convert jobid to bytest32
  function stringToBytes32(string memory source) private pure returns (bytes32 result) {
    bytes memory tempEmptyStringTest = bytes(source);
    if (tempEmptyStringTest.length == 0) {
      return 0x0;
    }
    assembly { 
      result := mload(add(source, 32))
    }
  }

}


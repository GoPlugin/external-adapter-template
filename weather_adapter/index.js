const { Requester, Validator } = require('@goplugin/external-adapter')
require("dotenv").config();

const customError = (data) => {
  if (data.Response === 'Error') return true
  return false
}

const customParams = {
  country:['country'],
  state:['state'],
  city:['city']
}
const createRequest = (input, callback) => {
  
  const url = `http://3.141.162.75:5000/api/${input.data.endpoint}/${input.data.country}/${input.data.state}/${input.data.city}`
  const city = input.data.city;
  const country = input.data.country;
  const state = input.data.state;
 console.log(input.data.endpoint)
	/*
  const params ={
    city,
    state,
    country
  }
*/
  const config = {
	  url
  }

  if (process.env.API_KEY) {
    config.headers = {
      Authorization: process.env.API_KEY
    }
  }
//config.params = {country: input.data.country, state:input.data.state, city:input.data.city}
  console.log("config value is",config);
  Requester.request(config, customError)
    .then(response => {
      console.log("response is sisis",response.data)
      console.log("inputdata is",input.data);
      if(input.data.envCheck=="WindDirection"){
        var resultData = response.data[0]['windDirection'];
      }else if(input.data.envCheck=="Temperature"){
        var resultData = response.data[0]['tempC'];
      }else if(input.data.envCheck=="WindChill"){
        var resultData = response.data[0]['windChillC'];
      }
      else if(input.data.envCheck=="HeatIndex"){
        var resultData = response.data[0]['heatIndexF'];
      }
      else if(input.data.envCheck=="RelativeHumidity"){
        var resultData = response.data[0]['RH'];
      }
console.log('Err_string',resultData);
      response.data.result =resultData.toString();

      console.log("resultData is",resultData);
      console.log("response is",response.data.result);
      const res = {
        data: {
                "result": response.data.result.toString()
            }
      }
      callback(response.status, Requester.success(input.id, res));
    })
    .catch(error => {
      callback(500, Requester.errored(input.id, error))
    })
}

module.exports.createRequest = createRequest

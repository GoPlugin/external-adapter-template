const { Requester, Validator } = require('@goplugin/external-adapter')
require("dotenv").config();

const customError = (data) => {
  if (data.Response === 'Error') return true
  return false
}

const customParams = {
  endpoint: ['endpoint']
}

const createRequest = (input, callback) => {

  const url = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${input.data.fromsystem}&tsyms=${input.data.tosystem}`

  const config = {
    url
  }

  if (process.env.API_KEY) {
    config.headers = {
      "api_key": process.env.API_KEY
    }
  }
  Requester.request(config, customError)
    .then(response => {
      
      //console.log("response value is ",response.data[input.data.fromsystem][input.data.tosystem]);
      
      const res = {
        data: {
          "result": response.data[input.data.fromsystem][input.data.tosystem].toString()
        }
      }
      callback(response.status, Requester.success(input.id, res));
    })
    .catch(error => {
      callback(500, Requester.errored(input.id, error))
    })
}

module.exports.createRequest = createRequest
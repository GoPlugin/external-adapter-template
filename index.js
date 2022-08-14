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

const url = `https://goplugin.apidiscovery.teejlab.com/edsn/api/benchmark/endpoint_request_live?endpoint_id=YJmrh3b`

var dataString = {"fsyms": `${input.data.fsyms}`, "tsyms": `${input.data.tsyms}`};
  const config = {
    url,
    method : "POST",
    data : dataString,
  }

  if (process.env.API_KEY) {
    config.headers = {
      "api-key": process.env.API_KEY
    }
  }
  Requester.request(config, customError)
    .then(response => {
      const res = {
        data: {
          "result": response.data[`${input.data.fsyms}`][`${input.data.tsyms}`].toString()
        }
      }
      callback(response.status, Requester.success(input.id, res));
    })
    .catch(error => {
      callback(500, Requester.errored(input.id, error))
    })
}

module.exports.createRequest = createRequest

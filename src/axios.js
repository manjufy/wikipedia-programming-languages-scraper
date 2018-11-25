const axios = require('axios')
return axios.create({
  timeout: 7000,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})

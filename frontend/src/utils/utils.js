import axios from 'axios'

const api_endpoint = process.env.REACT_APP_BASE_URL
const headers = {
    "Content-type": "application/json"
}

const usersApi = {
  async getUsers() {
    try {
      const res = await axios.get(`${api_endpoint}/api/users`, headers);
      return res.data
    } catch (err){
      console.log(err)
    }
  },
  async getUserInfo(id) {
    try {
      const res = await axios.get(`${api_endpoint}/api/user/${id}`, headers);
      return res.data
    } catch (err){
      console.log(err)
    }
  },
  async getUserOrders(id) {
    try {
      const res = await axios.get(`${api_endpoint}/api/orders/${id}`, headers);
        console.log('res: ', res)
      return res.data
    } catch (err){
      console.log(err)
    }
  }
}

export default usersApi

const axios = require('axios');

export const getOrders = () => {
    return axios.get('http://localhost:3004/orders');
}

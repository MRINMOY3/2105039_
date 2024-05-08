const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const port = 9876;

app.use(bodyParser.json());

// Function to fetch data from a given API endpoint
async function fetchData(endpoint) {
    try {
        const response = await axios.get(endpoint);
        return response.data;
    } catch (error) {
        console.error(`Error fetching data from ${endpoint}:`, error.message);
        return null;
    }
}

// Route handler to test the first API
app.get('/test/companies/:companyname/categories/:categoryname/products/:topNaminPrice-:maxPrice-:panaxPrice-q', async (req, res) => {
    const { companyname, categoryname, topNaminPrice, maxPrice, panaxPrice, q } = req.params;
    const endpoint = `http://78.244.56.144/test/companies/${companyname}/categories/${categoryname}/products/top-${topNaminPrice}-${maxPrice}-${panaxPrice}-${q}`;
    
    const data = await fetchData(endpoint);
    if (data) {
        console.log(`Response from ${endpoint}:`, data);
        res.json(data);
    } else {
        res.status(500).send('Failed to fetch data');
    }
});

// Route handler to test the second API
app.get('/test/companies/:companyname/categories/:categoryname/products/:top-:minPrice-:maxPrice', async (req, res) => {
    const { companyname, categoryname, top, minPrice, maxPrice } = req.params;
    const endpoint = `http://20.244.56.144/test/companies/${companyname}/categories/${categoryname}/products/top-${top}-${minPrice}-${maxPrice}`;
    
    const data = await fetchData(endpoint);
    if (data) {
        console.log(`Response from ${endpoint}:`, data);
        res.json(data);
    } else {
        res.status(500).send('Failed to fetch data');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

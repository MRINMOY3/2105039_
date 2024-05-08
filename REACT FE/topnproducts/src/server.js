const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

const WINDOW_SIZE = 10;
let numbers = [];
let window = [];

// Fetch numbers from the third-party server
const fetchNumbers = async () => {
    try {
        const response = await axios.get('http://78.244.56.144/test/companies/AM2/categories/Laptop/products/top-10?minPrice=1&maxPrice=10000');
        return response.data.map(product => product.price);
    } catch (error) {
        console.error('Error fetching numbers:', error);
        return [];
    }
};

// Calculate the average of numbers
const calculateAverage = () => {
    const sum = window.reduce((acc, num) => acc + num, 0);
    return sum / window.length;
};

// Middleware to ensure uniqueness of stored numbers and maintain window size
const updateNumbers = async (req, res, next) => {
    const newNumbers = await fetchNumbers();
    newNumbers.forEach(num => {
        if (!numbers.includes(num)) {
            numbers.push(num);
            window.push(num);
        }
    });

    if (window.length > WINDOW_SIZE) {
        window.shift(); // Remove the oldest number
    }

    next();
};

// API endpoint to handle requests for numbers
app.get('/numbers/:numberid', updateNumbers, (req, res) => {
    const { numberid } = req.params;
    const avg = calculateAverage();

    const response = {
        windowPrevState: [...window], // Clone window array
        windowCurrState: [...window], // Clone window array
        numbers: [...numbers], // Clone numbers array
        avg: avg.toFixed(2) // Round average to 2 decimal places
    };

    res.json(response);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

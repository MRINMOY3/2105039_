const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const port = 9876;

let storedNumbers = [];
const WINDOW_SIZE = 10;

app.use(bodyParser.json());

// Function to fetch numbers from the test server based on number type
async function fetchTestServerNumbers(type) {
    try {
        const response = await axios.get(`http://20.244.56.144/test/${type}`);
        return response.data.numbers;
    } catch (error) {
        console.error(`Error fetching ${type} numbers:`, error.message);
        return [];
    }
}

// Function to calculate average
function calculateAverage(numbers) {
    return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
}

// Middleware to handle requests
app.get('/numbers/:numberId', async (req, res) => {
    const { numberId } = req.params;

    // Fetch numbers from the test server based on number ID
    let newNumbers = [];
    switch (numberId) {
        case 'p':
            newNumbers = await fetchTestServerNumbers('primes');
            break;
        case 'f':
            newNumbers = await fetchTestServerNumbers('fibo');
            break;
        case 'e':
            newNumbers = await fetchTestServerNumbers('even');
            break;
        case 'r':
            newNumbers = await fetchTestServerNumbers('rand');
            break;
        default:
            break;
    }

    // Ensure uniqueness and maintain window size
    newNumbers.forEach(num => {
        if (!storedNumbers.includes(num)) {
            storedNumbers.push(num);
            if (storedNumbers.length > WINDOW_SIZE) {
                storedNumbers.shift(); // Replace oldest number if window size is breached
            }
        }
    });

    // Calculate average if there are enough numbers
    let average = null;
    if (storedNumbers.length >= WINDOW_SIZE) {
        average = calculateAverage(storedNumbers.slice(-WINDOW_SIZE));
    }

    // Construct response
    const response = {
        windowPrevState: storedNumbers.slice(0, -newNumbers.length),
        windowCurrState: storedNumbers,
        average: average !== null ? average.toFixed(2) : null
    };

    res.json(response);
});

// Start the server
app.listen(port, () => {
    console.log(`Average Calculator microservice listening at http://localhost:${port}`);
});

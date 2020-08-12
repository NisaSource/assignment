const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

let account = {};

//Reset state before starting tests
app.post('/reset', (req, res) => {
	console.log('Reset');
	account = {};
	res.status(200).send('OK');
});

app.get('/balance', (req, res) => {
	console.log('Balance');
	res.status(404).send('0');
});

app.post('/event', (req, res) => {
	console.log('Event');
	res.status(201).send('Event');
});

app.listen(8000, () => {
	console.log('Listening on 8000');
});

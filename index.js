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
	const id = req.query.account_id;
	// Get balance for non-existing account
	if (!(id in account)) {
		res.status(404).send('0');
	}

	// Get balance for existing account
	const balance = account[id];
	res.status(200).json(balance);
});

app.post('/event', (req, res) => {
	const { type } = req.body;

	if (type === 'deposit') {
		const { destination, amount } = req.body;

		// Create account with initial balance
		if (!(destination in account)) {
			account[destination] = amount;
		} else {
			// Deposit into existing account
			account[destination] += amount;
		}

		res.status(201).json({
			destination: { id: destination, balance: account[destination] },
		});
	}

	if (type === 'withdraw') {
		const { origin, amount } = req.body;

		// Withdraw from non-existing account
		if (!(origin in account)) {
			res.status(404).send('0');
		}

		// Withdraw from existing account
		account[origin] -= amount;
		res.status(201).json({ origin: { id: origin, balance: account[origin] } });
	}

	if (type === 'transfer') {
		const { origin, amount, destination } = req.body;

		// Transfer from non-existing account
		if (!(origin in account || !destination in account)) {
			res.status(404).send('0');
		}

		// Transfer from existing account
		account[origin] -= amount;
		if (!(destination in account)) {
			account[destination] = 0;
		}

		account[destination] += amount;
		res.status(201).json({
			origin: { id: origin, balance: account[origin] },
			destination: { id: destination, balance: account[destination] },
		});
	}
});

app.listen(8000, () => {
	console.log('Listening on 8000');
});

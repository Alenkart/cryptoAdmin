const express = require('express');
const app = express();
const request = require('request');
const cexio = require('./core/cexio');
const port = 3000;

let storage = {};

app.use(express.static('public'));

app.get('/', (req, res) => {	
	//res.send(storage);
	res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/data', (req, res) => {
	
	let data = {};

	if(req.query.coin && storage[req.query.coin]) {
		const coin = req.query.coin;
		data[coin] = storage[coin];
	} else {
		data = storage;
	}

	res.send(data);
});


app.get('/f', (req, res) => {
	
	const prices = storage['XRP'];

	const size = prices.length;
	const first = prices[0];
	const last = prices[size-1];

	res.send(`${size} |  ${last} / ${first}  = ${last / first}`);
});

app.listen(port, () => {

	const cex = new cexio();

	cex.messageCb = (res) => {

		if(!res.data) {
			console.log(res);
			return;
		}

		const { symbol1, symbol2, price } = res.data;

		if(symbol2 !== 'USD') {
			console.log(res.data);
			return;
		}

		if(!storage[symbol1]) {
			storage[symbol1] = [];
		}

		if (storage[symbol1].length > 100) {
			storage[symbol1].shift();
		}

		storage[symbol1].push(price);

		console.log(`${symbol1} to ${symbol2}`, price);
	}



	// cex.send({"e": "init-ohlcv-new", "i": "1m", "rooms": ["pair-BTC-USD"]});

	// cex.send({ "e": "subscribe", "rooms": [ "tickers" ] });

cex.send({
    "e": "subscribe",
    "rooms": ["pair-BTC-USD"]
});

	cex.init();


	console.log('server is running on port 3000');
});



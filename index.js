const express = require('express');
const app = express();
const request = require('request');
const Job = require('./core/job');

let storage = {};

const WebSocket = require('ws');

const ws = new WebSocket('wss://ws.cex.io/ws/');

ws.on('open', function open() {

  ws.send('{ "e": "subscribe", "rooms": [ "tickers" ] }');
});

ws.on('message', function incoming(data) {
  
  jsonData = JSON.parse(data);

  if(!jsonData.data) {
  	return;
  }

  const { symbol1, symbol2, price } = jsonData.data;

  if(symbol2 !== 'USD') {
  	return;
  }

  if(!storage[symbol1]) {
  	storage[symbol1] = [];
  }

  if (storage[symbol1].length > 50) {
  	storage[symbol1].shift();
  }

  storage[symbol1].push(price);

  console.log(`${symbol1} to ${symbol2}`, price);

});

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

app.listen(3000, () => console.log('server is running on port 3000'));



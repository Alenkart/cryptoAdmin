'use strict';

const WebSocket = require('ws');

function cexio() {

	this.api = 'wss://ws.cex.io/ws/';

	this.ws = new WebSocket(this.api);

	this.openCb;

	this.messageCb; 

	this.open = () => {
		
		const message = { "e": "subscribe", "rooms": [ "tickers" ] };
		const messageStr = JSON.stringify(message);
	  	
	  	this.ws.send(messageStr);

	  	if(typeof this.openCb === 'function') {
	  		this.openCb();	
	  	}
	}

	this.incoming = (data) => {
	  
		const jsonData = JSON.parse(data);

		if(!jsonData.data) {
			return;
		}

		if(typeof this.messageCb === 'function') {
	  		this.messageCb(jsonData.data);	
	  	}

	}

	this.init = () => {
		this.ws.on('open', this.open);
		this.ws.on('message', this.incoming);
	}
}

module.exports = cexio;
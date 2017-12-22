'use strict';

const WebSocket = require('ws');

function cexio() {

	let open = false;

	let messages = [];

	this.api = 'wss://ws.cex.io/ws/';

	this.ws = new WebSocket(this.api);

	this.openCb;

	this.messageCb; 

	this.open = (message) => {

		open = true;

		this.sendMessages();

	  	if(typeof this.openCb === 'function') {
	  		this.openCb();	
	  	} else {
	  		console.log(`Connected to ${this.api}`);
	  	}

	}

	this.incoming = (data) => {
	  
		const jsonData = JSON.parse(data);

		if(typeof this.messageCb === 'function') {
	  		this.messageCb(jsonData);	
	  	} else {
	  		console.log(jsonData);
	  	}
	}

	this.send = (message) => {

		const type = typeof message;

		if(type !== 'string' && type !== 'object') {
			throw 'Invalid message type';
		}

		const messageStr = type === 'string' 
			? message 
			: JSON.stringify(message);

		if(!open) {
			messages.push(messageStr);
			console.log(`Added message: ${messageStr}`);
			return;
		}
	  	
	  	this.ws.send(messageStr);
	} 

	this.sendMessages = () => {
		messages.forEach(this.send);
	}

	this.init = () => {
		this.ws.on('open', this.open);
		this.ws.on('message', this.incoming);
	}
}

module.exports = cexio;
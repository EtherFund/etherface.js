/*
- etherface.js v0.1
- Etherface is a real-time API for interacting with Ethereum, uses socket.io
- http://ether.fund/tool/etherface
- (c) 2014 J.R. Bédard (jrbedard.com)
*/

function Etherface(key) {
	var url = "http://api.ether.fund";
	var hostname = document.location.hostname;
	if(hostname == "localhost") {
		url = "http://localhost"; // local debug
	}
	var socket = io(url);
	
	socket.on('connect', function() {
		//
		socket.emit('client', 'tobi', function (data) {
			console.log(data); // data will be 'woot'
		});
	});
	
	socket.on('block', function (data) {
		console.log(data);
		//socket.emit('my other event', { my: 'data' });
	});
};
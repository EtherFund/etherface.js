/*
- etherface.js v0.1
- Etherface is a real-time API for interacting with Ethereum, uses socket.io
- http://ether.fund/tool/etherface
- (c) 2014 J.R. Bédard (jrbedard.com)
*/

function Etherface(args) {
	this.key = args.key;
	this.app = args.app;
	this.url = "http://api.ether.fund";
	this.hostname = document.location.hostname;
	if(this.hostname == "localhost") {
		this.url = "http://localhost:8080"; // local debug
	}
	this.socket = null;
	return this;
}

Etherface.prototype.connect = function(data, con, dis) {
	this.socket = io(this.url, {key: this.key, app: this.app});
	
	this.socket.on('connect', function() {
		if(con) { con(); }
		
		this.on('disconnect', function() {
			if(dis) { dis(); }
		});
		
		// ...
	});
};

Etherface.prototype.network = function(cmd, done) {
	if(!this.socket) { return; }
	this.socket.emit('ether', cmd, function(data) {
		
		if(done) { done(data); }
	});
};





// REST

Etherface.prototype.get = function() {
	// 'http://api.ether.fund/blocks'
};

Etherface.prototype.post = function() {
	// 'http://api.ether.fund/blocks'
};



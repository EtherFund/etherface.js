/*
- etherface.js v0.1
- Etherface is a real-time API for interacting with Ethereum, uses socket.io
- http://ether.fund/tool/etherface
- (c) 2014 J.R. Bédard (jrbedard.com)
*/

function Etherface(args) {
	this.key = args.key;
	this.app = args.app;
	this.url = "http://api.ether.fund:80";
	this.hostname = document.location.hostname;
	if(this.hostname == "localhost") {
		//this.url = "http://localhost:3000"; // local debug or not
	}
	this.socket = null;
	return this;
}

Etherface.prototype.connect = function(data, con, dis, confail) {
	this.socket = io(this.url, {key: this.key, app: this.app});
	
	this.socket.on('connect', function() {
		if(con) { con(); }
		
		this.on('disconnect', function() {
			if(dis) { dis(); }
		});
		
		this.on("connect_failed", function() {
			console.log('failed');
			if(confail) { confail(); }
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



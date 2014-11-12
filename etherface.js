/*
- etherface.js v0.1
- Front-end JS wrapper for the Etherface API.
- http://ether.fund/tool/etherface
- (c) 2014 J.R. Bédard (jrbedard.com)
*/

function Etherface(args) {
	this.version = '0.1';
	this.key = args.key;
	this.app = args.app;
	this.url = "http://api.ether.fund:80";
	this.hostname = document.location.hostname;
	if(this.hostname == "localhost") {
		this.url = "http://localhost:3000"; // local debug
	}
	this.socket = null;
	this.type = null;
	return this;
}


// SOCKET
Etherface.prototype.connect = function(data, con, dis, confail) {
	var that=this;
	this.socket = io(this.url, {key: this.key, app: this.app});//, transports:['websocket']});
	// ["xhr-polling", "flashsocket", "htmlfile", "jsonp-polling", "websocket"]
	
	this.socket.on('connect', function() {
		if(that.socket.io && that.socket.io.engine && that.socket.io.engine.transport ) {
			that.type = that.socket.io.engine.transport.name;
		}
		if(con) { con(); }
		
		this.on('disconnect', function() {
			if(dis) { dis(); }
		});
	});
	
	this.socket.on("connect_failed", function() {
		console.log('failed');
		if(confail) { confail(); }
	});
};

// SOCKET SEND
Etherface.prototype.send = function(cmd, args, done) {
	var that=this;
	if(!this.socket) { return; }
	this.socket.emit('etherface', {cmd:cmd, args:args}, function(data) {
		if(done) { done(data); }
	});
};



//  R E S T

// STATUS
Etherface.prototype.status = {
	get: function(fn) {
		this.get('/status', fn);
	},
	schema: function(fn) {
		this.get('/schema', fn);
	},
};


// CONTRACT
Etherface.prototype.contract = {
	
	_checkId : function() {
	},
	
	list : function(args,fn) {
		this.get('/contracts', fn);
	},
	create : function(args,fn) {
		this.put('/contracts', fn);
	},
	delete : function(id,fn) {
		this.delete('/contracts', fn);
	},
	
	view : function(id,fn) {
		this.get('/contracts/'+id, fn);
	},
	update : function(id,fn) {
		this.post('/contracts/'+id, fn);
	},
	validate : function(id,fn) {
		this.get('/contracts/'+id+'/validate', fn);
	},
	compile : function(id,fn) {
		this.post('/contracts/'+id+'/compile', fn);
	},
	simulate : function(id,fn) {
		this.post('/contracts/'+id+'/simulate', fn);
	},
	audit : function(id,fn) {
		this.post('/contracts/'+id+'/audit', fn);
	}
};


// TRANSACTION
Etherface.prototype.transaction = {
};

// ACCOUNT
Etherface.prototype.account = {
};

// BLOCK
Etherface.prototype.block = {
};

// ANALYTICS
Etherface.prototype.analytics = {
};


// ETHER
Etherface.prototype.ether = {
	get: function(fn) {
		this.get('/ether', fn);
	},
	gas: function(fn) {
		this.get('/ether/gas', fn);
	},
	faucet: function(fn) {
		this.post('/ether/faucet', fn);
	},
};


// BITCOIN
Etherface.prototype.bitcoin = {
	get: function(fn) {
		this.get('/bitcoin', fn);
	},
};


// CURRENCY
Etherface.prototype.currency = {
	list: function(fn) {
		this.get('/currencies', fn);
	},
	get: function(sym,fn) {
		this.get('/currencies/'+sym, fn);
	},
};



// GET
Etherface.prototype.get = function(url, done) {
	$.get(this.url+url, function(data) {
		done(data);
	});
};

// POST
Etherface.prototype.post = function(url, data, done, error) {
	// Ajax POST
	data.csrfmiddlewaretoken = gCsrfToken;
	$.ajax({type:'POST', cache:false, url: url, data: data,
		beforeSend:function(xhr, settings) {
		},
	  	success:function(data) {
			if('error' in data) {
				error(data);
			} else {
				done(data);
			}
	  	},
	  	error:function() {
			error(data);
	  	}
	});
};

// PUT
Etherface.prototype.put = function(url, data, done, error) {
	$.ajax({type:'PUT', cache:false, url: url, data: data});
};

// DELETE
Etherface.prototype.delete = function(url, data, done, error) {
	$.ajax({type:'DELETE', cache:false, url: url, data: data});
};









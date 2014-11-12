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
	var hostname = document.location.hostname;
	if(hostname == "localhost") {
		this.hostname = "http://localhost:3000"; // local debug
		this.port = 3000;
	} else {
		this.hostname = "http://api.ether.fund:80";
		this.port = 80;
	}
	this.socket = null;
	this.type = null;
	return this;
}


// SOCKET
Etherface.prototype.connect = function(data, con, dis, confail) {
	var self=this;
	this.socket = io(this.hostname, {key: this.key, app: this.app});//, transports:['websocket']});
	// ["xhr-polling", "flashsocket", "htmlfile", "jsonp-polling", "websocket"]
	
	this.socket.on('connect', function() {
		if(self.socket.io && self.socket.io.engine && self.socket.io.engine.transport ) {
			self.type = self.socket.io.engine.transport.name;
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
	if(!this.socket) { return; }
	this.socket.emit('etherface', {cmd:cmd, args:args}, function(data) {
		if(done) { done(data); }
	});
};



//  R E S T endpoints

// STATUS
Etherface.prototype.status = function(cmd,args,fn) {
	if(cmd=='get') {
		this.get('/status',args,fn);
	}
	else if(cmd=='schema') {
		this.get('/schema',args,fn);
	}
	else {
		return fn('invalid status method');
	}
};


// CONTRACT
Etherface.prototype.contract = function(cmd,args,fn) {
	if(cmd=='list') {
		//default args
		this.get('/contracts',args,fn);
	}
	else if(cmd=='create') {
		this.put('/contracts',args,fn);
	}
	else if(cmd=='view') {
		this.get('/contracts/'+args.id,args,fn);
	}
	else if(cmd=='update') {
		this.post('/contracts/'+args.id,args,fn);
	}
	else if(cmd=='delete') {
		this.delete('/contracts/'+args.id,args,fn);
	}
	else if(cmd=='validate') {
		this.get('/contracts/'+args.id+'/validate',args,fn);
	}
	else if(cmd=='compile') {
		this.post('/contracts/'+args.id+'/compile',args,fn);
	}
	else if(cmd=='simulate') {
		this.post('/contracts/'+args.id+'/simulate',args,fn);
	}
	else if(cmd=='audit') {
		this.post('/contracts/'+args.id+'/audit',args,fn);
	}
	else {
		return fn('invalid contract method');
	}
};


// TRANSACTION
Etherface.prototype.transaction = function(cmd,args,fn) {
};

// ACCOUNT
Etherface.prototype.account = function(cmd,args,fn) {
};

// BLOCK
Etherface.prototype.block = function(cmd,args,fn) {
};

// ANALYTICS
Etherface.prototype.analytics = function(cmd,args,fn) {
};


// ETHER
Etherface.prototype.ether = function(cmd,args,fn) {
	if(cmd=='get') {
		this.get('/ether',args,fn);
	}
	else if(cmd=='gas') {
		this.get('/ether/gas',args,fn);
	}
	else if(cmd=='faucet') {
		this.post('/ether/faucet',args,fn);
	}
	else {
		return fn('invalid ether method');
	}
};


// BITCOIN
Etherface.prototype.bitcoin = function(cmd,args,fn) {
	if(cmd=='get') {
		this.self.get('/bitcoin',args,fn);
	}
	else {
		return fn('invalid bitcoin method');
	}
};


// CURRENCY
Etherface.prototype.currency = function(cmd,args,fn) {
	if(cmd=='list') {
		this.get('/currencies',args,fn);
	}
	else if(cmd=='get') {
		this.get('/currencies/'+args.sym,args,fn);
	}
	else {
		return fn('invalid currency method');
	}
};



// GET
Etherface.prototype.get = function(path, data, done, error) {
	return this.ajax('GET',path,data,done,error);
};

// POST
Etherface.prototype.post = function(path, data, done, error) {
	return this.ajax('POST',path,data,done,error);
};

// PUT
Etherface.prototype.put = function(path, data, done, error) {
	return this.ajax('PUT',path,data,done,error);
};

// DELETE
Etherface.prototype.delete = function(path, data, done, error) {
	return this.ajax('DELETE',path,data,done,error);
};

// AJAX
Etherface.prototype.ajax = function(type, path, data, done, error) {
	data.csrfmiddlewaretoken = gCsrfToken;
	var url = this.hostname + path;
	$.ajax({type:type, cache:false, url:url, data:data,
		beforeSend:function(xhr, settings) {
		},
	  	success:function(data) {
			if('error' in data) {
				console.log("Etherface backend error on "+type+" "+url+" : "+data);
				error(data);
			} else {
				done(data);
			}
	  	},
	  	error:function() {
			console.log("Etherface error on "+type+" "+url+" : "+data);
			error(data);
	  	}
	});
};



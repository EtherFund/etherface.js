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
		this.hostname = "http://localhost"; // local debug
		this.port = 3000;
	} else {
		this.hostname = "http://api.ether.fund";
		this.port = 3000;
	}
	this.socket = null;
	this.type = null;
	return this;
}


// SOCKET
Etherface.prototype.connect = function(data, con, dis, confail) {
	var self=this;
	this.socket = io(this.hostname+':'+this.port, {key: this.key, app: this.app});//, transports:['websocket']});
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
		this.GET('/status',args,fn);
	}
	else if(cmd=='schema') {
		this.GET('/schema',args,fn);
	}
	else {
		return fn('invalid status method');
	}
};


// PEERS
Etherface.prototype.peer = function(cmd,args,fn) {
	if(cmd=='list') {
		this.GET('/peers',args,fn);
	}
	else if(cmd=='get') {
		this.GET('/peers/'+args.id,args,fn);
	}
	else {
		return fn('invalid peers method');
	}
};


// CONTRACT
Etherface.prototype.contract = function(cmd,args,fn) {
	if(cmd=='list') {
		//default args
		this.GET('/contracts',args,fn);
	}
	else if(cmd=='create') {
		this.PUT('/contracts',args,fn);
	}
	else if(cmd=='view') {
		this.GET('/contracts/'+args.id,args,fn);
	}
	else if(cmd=='update') {
		this.POST('/contracts/'+args.id,args,fn);
	}
	else if(cmd=='delete') {
		this.DELETE('/contracts/'+args.id,args,fn);
	}
	else if(cmd=='validate') {
		this.GET('/contracts/'+args.id+'/validate',args,fn);
	}
	else if(cmd=='compile') {
		this.POST('/contracts/'+args.id+'/compile',args,fn);
	}
	else if(cmd=='simulate') {
		this.POST('/contracts/'+args.id+'/simulate',args,fn);
	}
	else if(cmd=='audit') {
		this.POST('/contracts/'+args.id+'/audit',args,fn);
	}
	else {
		return fn('invalid contract method');
	}
};


// TRANSACTION
Etherface.prototype.transaction = function(cmd,args,fn) {
	return fn('invalid transaction method');
};

// ACCOUNT
Etherface.prototype.account = function(cmd,args,fn) {
	
	
	return fn('invalid account method');
};

// BLOCK
Etherface.prototype.block = function(cmd,args,fn) {
	if(cmd=='list') {
		//default args
		this.GET('/blocks',args,fn);
	}
	else if(cmd=='view') {
		this.GET('/blocks/'+args.id,args,fn);
	}
	else {
		return fn('invalid block method');
	}
};


// ANALYTICS
Etherface.prototype.analytics = function(cmd,args,fn) {
	if(cmd=='peers') {
		this.GET('/analytics/peers',args,fn);
	} else {
		return fn('invalid analytics method');
	}
};


// ETHER
Etherface.prototype.ether = function(cmd,args,fn) {
	if(cmd=='get') {
		this.GET('/ether',args,fn);
	}
	else if(cmd=='gas') {
		this.GET('/ether/gas',args,fn);
	}
	else if(cmd=='faucet') {
		this.POST('/ether/faucet',args,fn);
	}
	else {
		return fn('invalid ether method');
	}
};


// BITCOIN
Etherface.prototype.bitcoin = function(cmd,args,fn) {
	if(cmd=='get') {
		this.GET('/bitcoin',args,fn);
	}
	else {
		return fn('invalid bitcoin method');
	}
};


// CURRENCY
Etherface.prototype.currency = function(cmd,args,fn) {
	if(cmd=='list') {
		this.GET('/currencies',args,fn);
	}
	else if(cmd=='get') {
		this.GET('/currencies/'+args.sym,args,fn);
	}
	else {
		return fn('invalid currency method');
	}
};


// DAPP
Etherface.prototype.dapp = function(cmd,args,fn) {
	if(cmd=='list') {
		//default args
		this.GET('/dapps',args,fn);
	}
	else if(cmd=='create') {
		this.PUT('/dapps',args,fn);
	}
	else if(cmd=='view') {
		this.GET('/dapps/'+args.id,args,fn);
	}
	else if(cmd=='update') {
		this.POST('/dapps/'+args.id,args,fn);
	}
	else if(cmd=='delete') {
		this.DELETE('/dapps/'+args.id,args,fn);
	}
	else {
		return fn('invalid DApp method');
	}
};





// GET
Etherface.prototype.GET = function(path, data, done, error) {
	return this.ajax('GET',path,data,done,error);
};

// POST
Etherface.prototype.POST = function(path, data, done, error) {
	return this.ajax('POST',path,data,done,error);
};

// PUT
Etherface.prototype.PUT = function(path, data, done, error) {
	return this.ajax('PUT',path,data,done,error);
};

// DELETE
Etherface.prototype.DELETE = function(path, data, done, error) {
	return this.ajax('DELETE',path,data,done,error);
};

// AJAX
Etherface.prototype.ajax = function(type, path, data, done, error) {
	if(!this.hostname || this.hostname=='') { return 'Error: Etherface not initialized.' }
	data.csrfmiddlewaretoken = gCsrfToken;
	if(this.hostname == 'http://localhost') { this.hostname = 'http://localhost:3000' } // todo: fix
	var url = this.hostname + path;
	$.ajax({type:type, url:url, data:data, contentType:'application/json', cache:false, //data:JSON.stringify(obj),?
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
			if(error) { error(data); }
	  	}
	});
};



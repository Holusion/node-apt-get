var exec = require('child_process').exec;
var events = require('events');
var fs = require('fs');
var AptGetErr = require('./errorHandler.js');
var AptGetProg = require('./progressVerifier.js')


function AptGet(sudo){
	if(sudo){
		this.sudo = sudo+' ';
	}else{
		this.sudo = '';
	}
	this.AptGetErr = AptGetErr;
	this.AptGetProg = AptGetProg;
}

/**
* Simulates the upgrade
*/
AptGet.prototype.simulateUpgrade = function(callback){
	var self= this;
	var child = exec(self.sudo+'apt-get -s dist-upgrade', function(err,stdout,stderr){
		if(err){
			err="Upgrade simulation error";
		}
		callback(err,stderr,stdout);
	});
	return child;
}

/**
* Download index files that contains packages last versions
*/

AptGet.prototype.update = function(callback){
	var self= this;
	var child = exec(self.sudo+'apt-get update', function(err, stdout, stderr){
		if(stderr){
			err="Update error";
		}
		callback(err,stderr, stdout);
	});
	return child;
}

/*
* Download packages to be uploaded
*/
AptGet.prototype.downloadUpgrade = function(callback){
	var self= this;
	var child = exec(self.sudo+'apt-get -dy dist-upgrade', function(err,stdout,stderr){
		if(err){
			err="Download error";
		}
		callback(err,stderr,stdout);
	});
	return child;
}

/*
* Install upgrades
*/
AptGet.prototype.upgrade = function(callback){
	var self= this;
	var child = exec(self.sudo+'apt-get -y dist-upgrade', function(err,stdout,stderr){
		if(err){
			err="Upgrade installation error";
		}
		callback(err,stderr,stdout);
	});
	return child;
}

/**
* Clean cover
*/

AptGet.prototype.clean = function(callback){
	var self= this;
	var child = exec(self.sudo+'apt-get clean', function(err,stdout,stderr){
		if(err){
			err = "Cover clean error";
		}
		callback(err,stderr,stdout);
	});
	return child;
}

module.exports = AptGet;
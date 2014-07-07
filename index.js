var exec = require('child_process').exec;
var events = require('events');
var fs = require('fs');
var ErrorMod = require('./errorHandler.js');
var Verifier = require('./progressVerifier.js')

var errorMod = module.exports.ErrorMod = ErrorMod;
var verifier = module.exports.Verifier = Verifier;

/**
* Returns an array with all packages to install, null otherwise
*/
var listPackages = module.exports.listPackages = function (text){
  text = text.slice(text.indexOf("...")+3);
  text = text.slice(0, text.indexOf(", "));
  var p = text.indexOf(":");
  if(p === -1){
    return null;
  }else{
  	text = text.slice(p+2);
    p = text.indexOf(":");
    if(p!==-1){
      text = text.slice(p+2);
      text = text.slice(text.indexOf("  ")+2, text.indexOf('\n'));
    }else{
      text = text.slice(text.indexOf("  ")+2, text.indexOf('\n'));
    }
    if(text === ''){
      return null;
    }else{
      return text.split(" ");
    }
  }
}
/**
* Simulates the upgrade
*/
var simulateUpgrade = module.exports.simulateUpgrade = function(callback){
	var child = exec('apt-get -s dist-upgrade', function(err,stdout,stderr){
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

var update = module.exports.update = function(callback){
	var child = exec('apt-get update', function(err, stdout, stderr){
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
var downloadUpgrade = module.exports.downloadUpgrade = function(callback){
	var child = exec('apt-get -dy dist-upgrade', function(err,stdout,stderr){
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
var upgrade = module.exports.upgrade = function(callback){
	var child = exec('apt-get -y dist-upgrade', function(err,stdout,stderr){
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

var Clean = module.exports.clean = function(callback){
	var child = exec('apt-get clean', function(err,stdout,stderr){
		if(err){
			err = "Cover clean error";
		}
		callback(err,stderr,stdout);
	});
	return child;
}


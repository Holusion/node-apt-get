var exec = require('child_process').exec;
var events = require('events');
var fs = require('fs');

/**
* Array of possible errors
*/
var errors = {'Failed To download Index Files':"Le téléchargement de quelques fichiers d'index a échoué",
'Permission Denied':"13: Permission non accordée",
'exit error status':"erreur de sortie d'état",
'Package Not Found':"Impossible de trouver le paquet",
'Failed To Read Sources':"mal formée dans la liste des sources /etc/apt/sources.list",
'Failed to lock status':"Impossible de verrouiller /var/lib/dpkg/status",
'Failed to fetch gzip':"W: Failed to fetch gzip:",
'GPG error':"GPG error"};



/**
* Update/Upgrade Error Handler
*/
var errorHandler = module.exports.errorHandler = function(error, callback){
	var err = null;
	for(var key in errors){
		var element = errors[key];
		var index = error.indexOf(element);
		if(index != -1){
			if(key == 'Failed To download Index Files'){
				var index2 = error.indexOf("404  Not Found");
				if(index2 != -1){
					err = 'Index Files Not Found';
					console.log(err + ' : \n' + error + '\n');
					callback(err);
				}else{
					err = "Network is unreachable";
					console.log(err + ' : ' + error + '\n');
					callback(err);
				}
			}else if(key == "exit error status"){
				index = error.indexOf(element + ' 127');
				if(index!=-1){
					err = key + ' 127';
					console.log(err + ' : \n' + error + '\n');
					callback(err);
				}else{
					index = error.indexOf(element + ' 1');
					if(index!=-1){
						err = key + ' 1';
						console.log(err + ' : \n' + error + '\n');
						callback(err);
					}else{
						console.log(key + ' : \n' + error + '\n');
						callback(key);
					}
				}
			}else{
				err = key;
				console.log(key + ' : \n' + error + '\n');
				callback(key);
			}
		}
	}
}

/**
* Returns an array with all packages to install, null otherwise
*/
var listPackages = module.exports.listPackages = function (text){
  text = text.slice(text.indexOf("...")+3);
  text = text.slice(0, text.indexOf(", "));
  var p = text.indexOf(":");
  if(p === -1){
    return null;
  }
  else{
    text = text.slice(p+2);
    text = text.slice(text.indexOf("  ")+2, text.indexOf('\n'));
    return text.split(" ");
  }
}

/**
* Simulates the upgrade
*/
var simulateUpgrade = module.exports.simulateUpgrade = function(callback){
	var child = exec('apt-get -s upgrade', function(err,stdout,stderr){
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
	var child = exec('apt-get -dy upgrade', function(err,stdout,stderr){
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
	var child = exec('apt-get -y upgrade', function(err,stdout,stderr){
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


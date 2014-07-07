var aptGet = require('./index.js');

var globalId = ["Lecture des listes de paquets",
	"Construction de l'arbre des dépendances",
	"Lecture des informations d'état",
	"Les paquets suivants seront mis à jour :"];
var simulationId = ["Inst","Conf"];
var downloadId = ["Lecture des listes de paquets",
	"Construction de l'arbre des dépendances",
	"Lecture des informations d'état",
	"Les paquets suivants seront mis à jour :",
	"d'espace disque supplémentaires seront utilisés"];
var upgradeId = ["Réception de :",
	"Préparation du remplacement de",
	"Dépaquetage de la mise à jour de",
	"Paramétrage de"];

/**
* Sets the progress of reading step for upgrade simulation
*/
var simulationReading = module.exports.simulationReading = function(stdout, callback){
	if(stdout.slice(0, stdout.indexOf(", ")) == "0 mis à jour"){
			callback(100);
	}else{
		globalId.forEach(function(element, ind){
			var index = stdout.indexOf(element);
			if(index != -1){
				callback((ind+1)*5);
			}
		})
	}
}
/**
* Sets the progress of next step of simulation
*/
var simulationVerifier = module.exports.simulationVerifier = function(stdout,pack,callback){
	var index;
	simulationId.forEach(function(Id,ind){
		index = stdout.indexOf(Id);
		if(index != -1){
			index = stdout.indexOf(pack);
			if(index != -1){
				callback(pack);
			}
		}else{
			callback(null)
		}
	})
}
/**
* Sends the progress of the upgrade simulation
*/
var Progress, simulStdout = "";
var packagesTab, part;
var simulationProgress = module.exports.simulationProgress = function(stdout,callback){
	simulStdout += stdout + "\n";
	packagesTab = aptGet.listPackages(simulStdout);
	if(packagesTab){
		part = 80/(packagesTab.length*2);
		packagesTab.forEach(function(Package){
			simulationVerifier(stdout, Package,function(packageName){
				if(packageName){
					Progress = Progress + part;
					callback(Progress+'%');
				}else{
					callback(null);
				}				
			});
		})
	}
	if(!packagesTab){
		simulationReading(stdout, function(progress){
			Progress = progress;
			callback(progress+'%');
		})
	}
}

/**
* Sets the progress of reading step for download and upgrade
*/
var downloadReading = module.exports.downloadReading = function(stdout,callback){
	downloadId.forEach(function(element, ind){
		var index = stdout.indexOf(element);
		if(index != -1){
			callback((ind+1)*10);
		}
	});
}
/**
* Sets the progress for each package in the next step
*/
var downloadVerifier = module.exports.downloadVerifier = function(stdout,packages,callback){
	var index;
	index = stdout.indexOf("Réception de :");
	if(index != -1){
		packages.forEach(function(Package){
			index = stdout.indexOf(Package);
			if(index != -1){
				callback(Package);
			}
		})
	}
}
/**
* Sends the progress for each package in download
*/
var Prog;
var downloadProgress = module.exports.downloadProgress = function(stdout,packages,callback){
	downloadReading(stdout,function(progress){
		Prog = progress;
		packages.forEach(function(packageN){
			callback(packageN,progress+'%')
		})
	});
	if(Prog == 50){
		downloadVerifier(stdout,packages,function(packageN){
			packages.forEach(function(element){
				if(element == packageN){
					callback(packageN,'100%');
				}else{
					callback(null,null)
				}
			})
		})
	}
}

/**
* Sets the progress for each package in the next step
*/
var upgradeVerifier = module.exports.upgradeVerifier = function(stdout,packages,callback){
	var index;
	upgradeId.forEach(function(element, Ind){
		index = stdout.indexOf(element);
		if(index != -1){
			packages.forEach(function(Package){
				index = stdout.indexOf(Package);
				if(index != -1){
					callback(Package,(Ind+1)*12.5)
				}
			});
		}
	})
}
/**
* Sends the progress for each package in upgrade
*/
var Progr;
var upgradeProgress = module.exports.upgradeProgress = function(stdout,packages,callback){
	downloadReading(stdout,function(progress){
		Progr = progress;
		packages.forEach(function(packageN){
			callback(packageN,progress+'%');
		})
	});
	if(Progr == 50){
		upgradeVerifier(stdout,packages,function(packageN,progress){
			packages.forEach(function(element){
				if(element == packageN){
					progress = Progr+progress;
					callback(packageN,progress+'%');
				}else{
					callback(null, null);
				}
			})
		})
	}
}

/**
* Sends true or false whether it is necessary to display the stdout or not
*/
var updateProgress = module.exports.updateProgress = function(stdout,callback){
	var index;
	index = stdout.indexOf('Atteint');
	if(index != -1){
		callback(true);
	}else{
		index = stdout.indexOf('Réception de :');
		if(index != -1){
			callback(true);
		}
		else{
			callback(false);
		}
	}
}
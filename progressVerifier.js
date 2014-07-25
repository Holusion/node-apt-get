var globalId = ["Lecture des listes de paquets",
	"Construction de l'arbre des dépendances",
	"Lecture des informations d'état",
	"Les paquets suivants seront mis à jour :"];
var simulationId = ["Inst","Conf"];
var downloadId = ["Lecture des listes de paquets",
	"Construction de l'arbre des dépendances",
	"Lecture des informations d'état",
	"Les paquets suivants seront mis à jour :",
	"d'espace disque"];
var upgradeId = ["Réception de :",
	"Préparation du remplacement",
	"Dépaquetage de la mise à jour",
	"Paramétrage"];

/**
* Returns an array with all packages to install, null otherwise
*/
var listPackages = module.exports.listPackages = function (text){
  var p = text.indexOf("Les paquets suivants seront mis à jour :");
  if(p === -1){
    return null;
  }else{
    text = text.slice(p+41);
	text = lineSearcher(text);
	text = text.slice(0, text.lastIndexOf(' '));
    if(text === ''){
      return null;
    }else{
      return text.split(" ");
    }
  }
}

var listNewPackages = module.exports.listNewPackages = function(text){
	var p = text.indexOf("Les NOUVEAUX paquets suivants seront installés :");
  if(p === -1){
    return null;
  }else{
    text = text.slice(p+49, text.indexOf("Les paquets suivants seront mis à jour :"));
	text = lineSearcher(text);
	text = text.slice(0, text.lastIndexOf(' '));
    if(text === ''){
      return null;
    }else{
      return text.split(" ");
    }
  }
}

var lineSearcher = module.exports.lineSearcher = function(text){
	if(text.indexOf("  ")===-1){
		return '';
	}else{
		var line = text.indexOf('\n');
		return text.slice(text.indexOf("  ")+2, line) + ' ' + lineSearcher(text.slice(line+1));
	}
}
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
			callback(true);
		}else{
			callback(false)
		}
	})
}
/**
* Sends the progress of the upgrade simulation
*/
var Progress = 0, simulStdout = "";
var packagesTab = null, part;
var simulationProgress = module.exports.simulationProgress = function(stdout,callback){
	simulStdout += '\n'+stdout;
	simulationReading(stdout, function(progress){
		Progress = progress;
		/*if(Progress == 20){
	    	packagesTab = listPackages(simulStdout);
	    }*/
		callback(progress+'%');
	})
	//if(Progress >= 20){
		//if(packagesTab == null){
		if(stdout.indexOf('mis à jour')!=-1 && stdout.indexOf('nouvellement installés')!=-1 && stdout.indexOf('à enlever')!=-1){
			packagesTab = listPackages(simulStdout);
			var NewPacks = listNewPackages(simulStdout);
			if(NewPacks !== null){
				for(var i=0;i<NewPacks.length;i++){
					packagesTab.push(NewPacks[i]);
				}
			}
			simulStdout = "";
		}
		//}else{
		if(packagesTab != null){
			part = Math.floor(80/(packagesTab.length*2));
			simulationVerifier(stdout, null,function(packageName){
				if(packageName==true){
					Progress = Progress + part;
					callback(Progress+'%');
				}
			});
		}
	//}
	console.log('packagesTab = ' + packagesTab);
}

/**
* Sets the progress of reading step for download and upgrade
*/
var downloadReading = module.exports.downloadReading = function(stdout,callback){
	var index;
	for(var i=0;i<downloadId.length;i++){
		element = downloadId[i];
		index = stdout.indexOf(element);
		if(index != -1){
			if(i != 4 && stdout.indexOf(downloadId[4]) == -1){
				callback('Préparation du téléchargement...');
			}
		}
	}
	if(stdout.indexOf(downloadId[4])!=-1){
		callback('En cours...');
	}
}
/**
* Sets the progress for each package in the next step
*/
var downPacks = [];
var downloadVerifier = module.exports.downloadVerifier = function(stdout,packages,callback){
	var index;
	index = stdout.indexOf("Réception de :");
	if(index != -1){
		packages.forEach(function(Package){
			index = stdout.indexOf(Package);
			if(index != -1 && downPacks.indexOf(Package) == -1){
				downPacks.push(Package);
				callback(Package,'Téléchargement terminé');
			}
		})
	}
	if(downPacks.length == packages.length){
		console.log('all packages downloaded')
		downPacks = [];
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
			callback(packageN,progress)
		})
	});
	if(Prog == 'En cours...'){
		downloadVerifier(stdout,packages,function(packageN,state){
			callback(packageN,state);
		})
	}
}

/**
* Sets the progress for each package in the next step
*/
var upgradeVerifier = module.exports.upgradeVerifier = function(stdout,packages,callback){
	var index; var msg;
	upgradeId.forEach(function(element, Ind){
		index = stdout.indexOf(element);
		if(index != -1){
			packages.forEach(function(Package){
				index = stdout.indexOf(Package);
				if(index != -1){
					if(Ind == 0){
						msg = 'Réception du paquet'
					}else{
						msg = element;
					}
					callback(Package,msg)
				}
			});
		}
	})
}
/**
* Sends the progress for each package in upgrade
*/
var upgradeProgress = module.exports.upgradeProgress = function(stdout,packages,callback){
	downloadReading(stdout,function(progress){
		packages.forEach(function(packageN){
			callback(packageN,"Préparation de l'installation...");
		})
	});
		upgradeVerifier(stdout,packages,function(packageN,progress){
			packages.forEach(function(element){
				if(element == packageN){
					callback(packageN,progress);
				}
			})
		})
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

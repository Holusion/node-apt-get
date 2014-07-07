/**
* Array of possible errors
*/
/*E: dpkg a été interrompu. Il est nécessaire d'utiliser « dpkg --configure -a » pour corriger le problème.
*/
var errors = {'Failed To download Index Files':"Le téléchargement de quelques fichiers d'index a échoué",
'Permission Denied':"13: Permission non accordée",
'exit error status':"erreur de sortie d'état",
'Package Not Found':"Impossible de trouver le paquet",
'Failed To Read Sources':"mal formée dans la liste des sources /etc/apt/sources.list",
'Failed to lock status':"Impossible de verrouiller /var/lib/dpkg/status",
'Failed to fetch gzip':"W: Failed to fetch gzip:",
'GPG error':"GPG error",
'dpkg was interrupted, please try « dpkg --configure -a »':"dpkg a été interrompu. Il est nécessaire d'utiliser « dpkg --configure -a »"};


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
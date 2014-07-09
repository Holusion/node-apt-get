/**
* Array of possible errors
*/
/*E: dpkg a été interrompu. Il est nécessaire d'utiliser « dpkg --configure -a » pour corriger le problème.
*/
var errors = {"Le téléchargement de quelques fichiers d'index a échoué":"Le téléchargement de quelques fichiers d'index a échoué",
'Permission non accordée':"13: Permission non accordée",
"erreur de sortie d'état":"erreur de sortie d'état",
'Impossible de trouver un ou plusieurs paquets':"Impossible de trouver le paquet",
'Echec de lecture de la liste des sources':"mal formée dans la liste des sources /etc/apt/sources.list",
'Impossible de vérouiller /var/lib/dpkg/status':"Impossible de verrouiller /var/lib/dpkg/status",
'Impossible de récupérer quelques fichiers':"W: Failed to fetch",
'erreur de GPG':"GPG error",
"dpkg a été interrompu. Il est nécessaire d'utiliser « dpkg --configure -a »":"dpkg a été interrompu. Il est nécessaire d'utiliser « dpkg --configure -a »",
"Le gestionnaire de paquet est temporairement indisponible...":"11: Ressource temporairement non disponible",
"Impossible de récupérer les fichiers d'index ou les paquets":"Ne parvient pas à résoudre"};


/**
* Update/Upgrade Error Handler
*/
var errorHandler = module.exports.errorHandler = function(error, callback){
	var err = null; var i=0; var found = false;
	for(var key in errors){
		i+=1;
		var element = errors[key];
		var index = error.indexOf(element);
		if(index != -1){
			if(key == "Le téléchargement de quelques fichiers d'index a échoué"){
				var index2 = error.indexOf("404  Not Found");
				if(index2 != -1){
					err = "Quelques fichiers d'index n'ont pas été trouvés";
					console.log(err + ' : \n' + error + '\n');
					found=true;
					callback(err);
				}else{
					err = "connexion réseau inaccessible";
					console.log(err + ' : ' + error + '\n');
					found=true;
					callback(err);
				}
			}else if(key == "erreur de sortie d'état"){
				index = error.indexOf(element + ' 127');
				if(index!=-1){
					err = key + ' 127';
					console.log(err + ' : \n' + error + '\n');
					found=true;
					callback(err);
				}else{
					index = error.indexOf(element + ' 1');
					if(index!=-1){
						err = key + ' 1';
						console.log(err + ' : \n' + error + '\n');
						found=true;
						callback(err);
					}else{
						console.log(key + ' : \n' + error + '\n');
						found=true;
						callback(key);
					}
				}
			}else{
				err = key;
				console.log(key + ' : \n' + error + '\n');
				found=true;
				callback(key);
			}
		}else{
			if(i==11 && found==false){
				callback(null);
			}
		}
	}
}

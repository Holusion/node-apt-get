var AptGet = require('./index.js');
var aptGet = new AptGet('sudo -n');
var aptGetErr = aptGet.AptGetErr;
var aptGetProg = aptGet.AptGetProg;

var packages;
var download;
var install;
var simulate;
var errmsg = " : Une erreur s'est produite pendant les mises à jours.";


/*Command tests*/
var update = aptGet.update(function(err,stderr,data){
	console.log('UPDATE :');
	console.log(data);
	if(!stderr){
		update.emit('Finished update');
	}else{
		aptGetErr.errorHandler(stderr,function(errMsg){
			if(!errMsg){
				console.log('Error' + errmsg);
			}else{
				if(errMsg == "Quelques fichiers d'index n'ont pas été trouvés"){
					console.log(errMsg + " : Une erreur non fatale s'est produite pendant les mises à jours.");
					update.emit('Finished update');
				}else{
					console.log(errMsg +  errmsg);
				}
				
			}
		});
	}
});

update.on('Finished update', function(){
	simulate = aptGet.simulateUpgrade(function(err,stderr,data){
		console.log('SIMULATE UPGRADE : ')
		if(!stderr){
			console.log(data);
			packages = aptGetProg.listPackages(data);
			console.log('Packages to update :');
			console.log(packages);
			update.emit('Finished simulation',packages);
		}else{
			aptGetErr.errorHandler(stderr,function(errMsg){
				if(!errMsg){
					errMsg = "Error";
				}
				console.log(errMsg + errmsg);
			});
		}
	});
})

update.on('Finished simulation',function(packages){
	if(packages != null){
		download = aptGet.downloadUpgrade(function(err,stderr,data){
			if(!stderr){
				console.log('DOWNLOAD STDOUT')
				console.log(data);
				update.emit('Finished download');
			}else{
				aptGetErr.errorHandler(stderr,function(errMsg){
					if(!errMsg){
						errMsg = "Error";
					}
					console.log(errMsg + errmsg);
				});
			}
		});
	}
	else{
		console.log('Everything up to date');
	}
})

update.on('Finished download',function(){
	install = aptGet.upgrade(function(err,stderr,data){
		if(!stderr){
			console.log('INSTALL STDOUT')
			console.log(data);
			simulate.emit('Finished installation');
		}else{
			aptGetErr.errorHandler(stderr,function(errMsg){
				if(!errMsg){
					errMsg = "Error";
				}
				console.log(errMsg + errmsg);
			});
		}
	})
	install.stdout.on('data', function(stdout){
			console.log(stdout)

		})
});

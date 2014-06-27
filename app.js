var aptGet = require('./index');

var packages;
var download;
var install;
var simulate;
var errmsg = " : Une erreur s'est produite pendant les mises à jours.";


var update = aptGet.update(function(err,stderr,data){
	console.log('UPDATE :');
	if(!stderr){
		console.log(data);
		update.emit('Finished update');
	}else{
		aptGet.errorHandler(stderr,function(errMsg){
			if(!errMsg){
				console.log('Error' + errmsg);
			}else{
				console.log(errMsg + " : Une erreur non fatale s'est produite pendant les mises à jours.");
				update.emit('Finished update');
			}
		});
	}
});

update.on('Finished update', function(){
	simulate = aptGet.simulateUpgrade(function(err,stderr,data){
		console.log('SIMULATE UPGRADE : ')
		if(!stderr){
			console.log(data);
			packages = aptGet.listPackages(data);
			console.log('Packages to update :');
			console.log(packages);
			update.emit('Finished simulation',packages);
		}else{
			aptGet.errorHandler(stderr,function(errMsg){
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
				aptGet.errorHandler(stderr,function(errMsg){
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
			aptGet.errorHandler(stderr,function(errMsg){
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

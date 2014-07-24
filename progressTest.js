var AptGet = require('./index');
var aptGet = new AptGet('sudo -n');
var fs = require('fs');
var events = require('events');
var verifier = aptGet.AptGetProg;

var updateChild = new events.EventEmitter();
var simulChild  = new events.EventEmitter();
var downlChild  = new events.EventEmitter();
var upgradeChild  = new events.EventEmitter();


/*Update Progress*/
updateChild.on('stdout', function(tabData, data){
	verifier.updateProgress(data,function(state){
		if(state == true){
			console.log(data);
		}
	})
})
/*Simulation Progress*/
simulChild.on('stdout',function(data){
	console.log(data);
	verifier.simulationProgress(data,function(progress){
		if(progress){
			console.log(progress);
			if(progress == '100%'){
				simulChild.emit('Finished')
			}
		}
	})
});

/*Download Progress*/
var i=0; var packages = ['dbus', 'dbus-x11', 'libdbus-1-3', 'libc-dev-bin', 'libc6', 'libc6-dev', 'locales', 'libjpeg8', 'libopenobex1', 'mobile-broadband-provider-info', 'base-files'];
downlChild.on('stdout',function(data){
	console.log(data);
	verifier.downloadProgress(data,packages,function(packagename,progress){
		if(packagename && progress){
			console.log(packagename + ' = ' + progress);
		}
	})
});

/*Upgrade Progress*/
var j=0;
packages = ['gnupg', 'gpgv'];
upgradeChild.on('stdout', function(data){
	verifier.upgradeProgress(data,packages,function(packagename,progress){
		if(packagename && progress){
			console.log(packagename + ' = ' + progress);
			if(progress == '100%'){
				j=j+1;
			}
			if(j == packages.length){
				upgradeChild.emit('Finished');
			}
		}
	})
});

/*File reading*/
fs.readFile("./test/fixtures/update.out",{encoding:"UTF-8"},function(err,data){
	console.log('update : ');
	var tab = data.split("\n");
	tab.forEach(function(stdout){
		updateChild.emit('stdout',tab,stdout);
	});
});
updateChild.on('Finished',function(){
	fs.readFile("./test/fixtures/s_upgrade_newPacks.out",{encoding:"UTF-8"},function(err,data){
		console.log('upgrade simulation : ');
		console.log(verifier.listPackages(data));
		console.log(verifier.listNewPackages(data));
		var tab = data.split("\n");
		tab.forEach(function(stdout){
			simulChild.emit('stdout',stdout);
		});

	});
})
simulChild.on('Finished', function(){
	fs.readFile("./test/fixtures/dy_upgrade.out",{encoding:"UTF-8"},function(err,data){
		console.log('download : ');
		var tab = data.split("\n");
		tab.forEach(function(stdout){
			downlChild.emit('stdout',stdout);
		});
	});
})
downlChild.on('Finished', function(){
	fs.readFile("./test/fixtures/upgrade.out",{encoding:"UTF-8"},function(err,data){
		console.log('upgrade : ')
		var tab = data.split("\n");
		tab.forEach(function(stdout){
			upgradeChild.emit('stdout',stdout);
		});
	});
})
var fs = require("fs");
var events = require('events');
var expect = require('chai').expect;
var index = require('../index.js');
var aptGet = new index('sudo -n');
var aptGetProg = aptGet.AptGetProg;

describe("test update Progress", function(){
	it("sends true when stdout contains 'Atteint' or 'Réception de :', false otherwise", function(done){
		aptGetProg.updateProgress("Atteint http://packages.holusion.net wheezy Release.gpg",function(state){
			expect(state).to.be.true;
			aptGetProg.updateProgress("Réception de : 1 http://dl.google.com stable Release.gpg [198 B]",function(state){
				expect(state).to.be.true;
				done();
			})
		})
	})
});
describe("test upgrade simulation simulationReading", function(){
	it('should set progress to 5%',function(done){
		aptGetProg.simulationReading("Lecture des listes de paquets...",function(progress){
			expect(progress).to.equal(5);
			done();
		})
	});
	it('should set progress to 20%',function(done){
		aptGetProg.simulationReading("Les paquets suivants seront mis à jour :",function(progress){
			expect(progress).to.equal(20);
			done();
		})
	});
	it('should set progress to 100% if no updates to do',function(done){
		aptGetProg.simulationReading("0 mis à jour, 0 nouvellement installés, 0 à enlever et 0 non mis à jour.",function(progress){
			expect(progress).to.equal(100);
			done();
		})
	});
});
describe("test upgrade simulation progress", function(){
	it('should set progress to 100% if no updates to do',function(done){
		aptGetProg.simulationProgress("0 mis à jour, 0 nouvellement installés, 0 à enlever et 0 non mis à jour.",function(progress){
			expect(progress).to.equal('100%');
			done();
		});
	});
});
describe("test download progress", function(){
	var packages = ['test1','test2'];
	it('should set \'En cours...\' for each package',function(){
		aptGetProg.downloadProgress("Après cette opération, 375 ko d'espace disque supplémentaires seront utilisés.", packages,
			function(packagename,progress){
				expect(progress).to.be.equal('En cours...');
			})
	})
	it('should returns the right name of package', function(done){
		aptGetProg.downloadVerifier("Réception de : 1 http://security.debian.org/ wheezy/updates/main test1 amd64 1.4.12-7+deb7u4 [227 kB]", 
			packages, function(packagename,progress){
				expect(packagename).to.be.equal('test1');
				done();
		});
	})
})
describe("test uprade progress", function(){
	var packages = ['test1','test2'];
	it('should set progress \'Préparation de l\'installation...\' for each package',function(){
		aptGetProg.upgradeProgress("Lecture des informations d'état... Fait",packages,
			function(packagename,progress){
				console.log(progress);
				expect(progress).to.be.equal('Préparation de l\'installation...');
		})
	});
})

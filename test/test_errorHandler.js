var fs = require("fs");
var expect = require('chai').expect;
var index = require('../index.js');
var aptGet = new index();
var aptGetErr = aptGet.AptGetErr;

describe("test errorHandler", function(){
  it("returns 'connexion réseau inaccessible'", function(){
    aptGetErr.errorHandler("Le téléchargement de quelques fichiers d'index a échoué", function(err){
      expect(err).to.deep.equal('connexion réseau inaccessible');
      })
    })
  it("returns 'Permission non accordée'", function(){
    aptGetErr.errorHandler("13: Permission non accordée", function(err){
      expect(err).to.deep.equal('Permission non accordée');
    })
  })
  it("returns 'Le gestionnaire de paquet est temporairement indisponible...'", function(){
    aptGetErr.errorHandler("11: Ressource temporairement non disponible", function(err){
      expect(err).to.deep.equal("Le gestionnaire de paquet est temporairement indisponible...");
    })
  })
  it("returns 'Quelques fichiers d'index n'ont pas été trouvés'", function(){
    aptGetErr.errorHandler("Le téléchargement de quelques fichiers d'index a échoué 404  Not Found", function(err){
      expect(err).to.deep.equal("Quelques fichiers d'index n'ont pas été trouvés");
    })
  })
  it("returns 'erreur de sortie d'état 127'", function(){
    aptGetErr.errorHandler("erreur de sortie d'état 127", function(err){
      expect(err).to.deep.equal("erreur de sortie d'état 127");
      })
    })
  it("returns 'erreur de sortie d'état 1'", function(){
    aptGetErr.errorHandler("erreur de sortie d'état 1", function(err){
      expect(err).to.deep.equal("erreur de sortie d'état 1");
      })
    })
  it("returns 'Impossible de trouver un ou plusieurs paquets'", function(){
    aptGetErr.errorHandler("Impossible de trouver le paquet", function(err){
      expect(err).to.deep.equal('Impossible de trouver un ou plusieurs paquets');
      })
    })
  it("returns 'Echec de lecture de la liste des sources'", function(){
    aptGetErr.errorHandler("mal formée dans la liste des sources /etc/apt/sources.list", function(err){
      expect(err).to.deep.equal('Echec de lecture de la liste des sources');
      })
    })
  it("returns 'Impossible de vérouiller /var/lib/dpkg/status'", function(){
    aptGetErr.errorHandler("Impossible de verrouiller /var/lib/dpkg/status", function(err){
      expect(err).to.deep.equal('Impossible de vérouiller /var/lib/dpkg/status');
      })
    })
  it("returns 'Impossible de récupérer quelques fichiers'", function(){
    aptGetErr.errorHandler("W: Failed to fetch gzip:", function(err){
      expect(err).to.deep.equal('Impossible de récupérer quelques fichiers');
      })
    })
  it("returns 'erreur de GPG'", function(){
    aptGetErr.errorHandler("GPG error", function(err){
      expect(err).to.deep.equal('erreur de GPG');
      })
    })
  it("returns 'dpkg a été interrompu. Il est nécessaire d'utiliser « dpkg --configure -a »'", function(){
    aptGetErr.errorHandler("GE: dpkg a été interrompu. Il est nécessaire d'utiliser « dpkg --configure -a » pour corriger le problème.", function(err){
      expect(err).to.deep.equal("dpkg a été interrompu. Il est nécessaire d'utiliser « dpkg --configure -a »");
      })
    })
  it("returns 'Impossible de récupérer les fichiers d'index ou les paquets'", function(){
    aptGetErr.errorHandler("W: Impossible de récupérer http://ftp.fr.debian.org/debian/dists/wheezy/Release.gpg Ne parvient pas à résoudre « ftp.fr.debian.org »", function(err){
      expect(err).to.deep.equal("Impossible de récupérer les fichiers d'index ou les paquets");
      })
    })
})
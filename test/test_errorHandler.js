var fs = require("fs");
var expect = require('chai').expect;
var index = require('../errorHandler.js');

describe("test errorHandler", function(){
  it("returns 'Network is unreachable'", function(){
    index.errorHandler("Le téléchargement de quelques fichiers d'index a échoué", function(err){
      expect(err).to.deep.equal('Network is unreachable');
      })
    })
  it("returns 'Permission Denied'", function(){
    index.errorHandler("13: Permission non accordée", function(err){
      expect(err).to.deep.equal('Permission Denied');
    })
  })
it("returns 'Another package manager is already running'", function(){
    index.errorHandler("11: Ressource temporairement non disponible", function(err){
      expect(err).to.deep.equal('Another package manager is already running');
    })
  })
  it("returns 'Index Files Not Found'", function(){
    index.errorHandler("Le téléchargement de quelques fichiers d'index a échoué 404  Not Found", function(err){
      expect(err).to.deep.equal('Index Files Not Found');
    })
  })
  it("returns 'exit error status 127'", function(){
    index.errorHandler("erreur de sortie d'état 127", function(err){
      expect(err).to.deep.equal('exit error status 127');
      })
    })
  it("returns 'exit error status 1'", function(){
    index.errorHandler("erreur de sortie d'état 1", function(err){
      expect(err).to.deep.equal('exit error status 1');
      })
    })
  it("returns 'Package Not Found'", function(){
    index.errorHandler("Impossible de trouver le paquet", function(err){
      expect(err).to.deep.equal('Package Not Found');
      })
    })
  it("returns 'Failed To Read Sources'", function(){
    index.errorHandler("mal formée dans la liste des sources /etc/apt/sources.list", function(err){
      expect(err).to.deep.equal('Failed To Read Sources');
      })
    })
  it("returns 'Failed to lock status'", function(){
    index.errorHandler("Impossible de verrouiller /var/lib/dpkg/status", function(err){
      expect(err).to.deep.equal('Failed to lock status');
      })
    })
  it("returns 'Failed to fetch gzip'", function(){
    index.errorHandler("W: Failed to fetch gzip:", function(err){
      expect(err).to.deep.equal('Failed to fetch gzip');
      })
    })
  it("returns 'GPG error'", function(){
    index.errorHandler("GPG error", function(err){
      expect(err).to.deep.equal('GPG error');
      })
    })
  it("returns 'dpkg was interrupted, please try « dpkg --configure -a »'", function(){
    index.errorHandler("GE: dpkg a été interrompu. Il est nécessaire d'utiliser « dpkg --configure -a » pour corriger le problème.", function(err){
      expect(err).to.deep.equal('dpkg was interrupted, please try « dpkg --configure -a »');
      })
    })
})

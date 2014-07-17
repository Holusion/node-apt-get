var fs = require("fs");
var rewire = require("rewire");
var expect = require('chai').expect;
var Index = rewire('../index.js');
var index = new Index('sudo');

describe("test update",function(){
  var upgrade_out;
  before(function(done){
    fs.readFile("test/fixtures/s_upgrade.out",{encoding:"UTF-8"},function(err,data){
      expect(err).to.be.null;
      upgrade_out = data;
      done();
    });
  });
  it('outputs stdout',function(done){
    Index.__set__('exec', function(param, callback){
      var out = upgrade_out;
      var err = null;
      var ret = 0;
      callback(err, out, ret);
    });
    var expected_out = upgrade_out;
    index.update(function(err, stderr, data){
      expect(data).to.deep.equal(expected_out);
      expect(err).to.be.null;
      done();
    });
  })
  it('returns the error',function(done){
    Index.__set__('exec', function(param, callback){
      var out = null;
      var err = null;
      var ret = 1;
      callback(err, out, ret);
    });
    index.update(function(err, stderr, data){
      expect(data).to.be.null;
      expect(err).to.deep.equal("Erreur de téléchargement des mises à jour");
      done();
    });
  })
})

describe("test simulateUpgrade",function(){
  var upgrade_out;
  before(function(done){
    fs.readFile("test/fixtures/s_upgrade.out",{encoding:"UTF-8"},function(err,data){
      expect(err).to.be.null;
      upgrade_out = data;
      done();
    });
  });
  it('outputs stdout',function(done){
    Index.__set__('exec', function(param, callback){
      var out = upgrade_out;
      var err = null;
      var ret = 0;
      callback(err, out, ret);
    });
    var expected_out = upgrade_out;
    index.simulateUpgrade(function(err,stderr, data){
      expect(data).to.deep.equal(expected_out);
      expect(err).to.be.null;
      done();
    });
  })
  it('returns the error',function(done){
    Index.__set__('exec', function(param, callback){
      var out = null;
      var err = "error";
      var ret = 0;
      callback(err, out, ret);
    });
    index.simulateUpgrade(function(err,stderr, data){
      expect(data).to.be.null;
      expect(err).to.deep.equal("Erreur de simulation des mises à jour");
      done();
    });
  })
})

describe("test downloadUpgrade",function(){
  var upgrade_out;
  before(function(done){
    fs.readFile("test/fixtures/dy_upgrade.out",{encoding:"UTF-8"},function(err,data){
      expect(err).to.be.null;
      upgrade_out = data;
      done();
    });
  });
  it('outputs stdout',function(done){
    Index.__set__('exec', function(param, callback){
      var out = upgrade_out;
      var err = null;
      var ret = 0;
      callback(err, out, ret);
    });
    var expected_out = upgrade_out;
    index.downloadUpgrade(function(err,stderr, data){
      expect(data).to.deep.equal(expected_out);
      expect(err).to.be.null;
      done();
    });
  })
  it('returns the error',function(done){
    Index.__set__('exec', function(param, callback){
      var out = null;
      var err = "error";
      var ret = 0;
      callback(err, out, ret);
    });
    index.downloadUpgrade(function(err,stderr, data){
      expect(data).to.be.null;
      expect(err).to.deep.equal("Erreur de téléchargement des paquets");
      done();
    });
  })
})

describe("test upgrade",function(){
  var upgrade_out;
  before(function(done){
    fs.readFile("test/fixtures/upgrade.out",{encoding:"UTF-8"},function(err,data){
      expect(err).to.be.null;
      upgrade_out = data;
      done();
    });
  });
  it('outputs stdout',function(done){
    Index.__set__('exec', function(param, callback){
      var out = upgrade_out;
      var err = null;
      var ret = 0;
      callback(err, out, ret);
    });
    var expected_out = upgrade_out;
    index.upgrade(function(err,stderr, data){
      expect(data).to.deep.equal(expected_out);
      expect(err).to.be.null;
      done();
    });
  })
  it('returns the error',function(done){
    Index.__set__('exec', function(param, callback){
      var out = null;
      var err = "error";
      var ret = 0;
      callback(err, out, ret);
    });
    index.upgrade(function(err,stderr, data){
      expect(data).to.be.null;
      expect(err).to.deep.equal("Erreur d'installation des paquets");
      done();
    });
  })
})

describe("test clean",function(){
  it('outputs stdout',function(done){
    Index.__set__('exec', function(param, callback){
      var out = null;
      var err = null;
      var ret = 0;
      callback(err, out, ret);
    });
    index.clean(function(err,stderr, data){
      expect(data).to.be.null;
      expect(err).to.be.null;
      done();
    });
  })
  it('returns the error',function(done){
    Index.__set__('exec', function(param, callback){
      var out = null;
      var err = "error";
      var ret = 0;
      callback(err, out, ret);
    });
    index.clean(function(err,stderr, data){
      expect(data).to.be.null;
      expect(err).to.deep.equal("Erreur dans le nettoyage du cache");
      done();
    });
  })
})
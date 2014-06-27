var fs = require("fs");
var expect = require('chai').expect;
var index = require('../index.js');


describe("test listPackages",function(){
  var upgrade_out;
  var upgrade_not;
  before(function(done){
    fs.readFile("test/fixtures/s_upgrade.out",{encoding:"UTF-8"},function(err,data){
      expect(err).to.be.null;
      upgrade_out = data;
      done();
    })
  })
  it('isolates the packages to upgrade',function(){
    var expected_out = ["gnupg", "gpgv"];
    var res = index.listPackages(upgrade_out);
    expect(res).to.deep.equal(expected_out);
  })
  before(function(done){
    fs.readFile("test/fixtures/s_upgrade(nothing).out",{encoding:"UTF-8"},function(err,data){
      expect(err).to.be.null;
      upgrade_not = data;
      done();
    })
  })
  it('returns null if the system is up-to-date',function(){
    var res = index.listPackages(upgrade_not);
    expect(res).to.be.null;
  })
})

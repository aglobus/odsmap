var should = require('should');

var app = require('../app');

describe('Converter', function(){

  var Converter = require('../lib/converter');

  describe('#Converter()', function(){

    it('Should return a new Converter', function(){
      var converter = new Converter();
      converter.should.be.an.instanceOf(Converter);

    });

    it('Should be ok without new keyword', function() {
      var c = Converter();
      c.should.be.an.instanceOf(Converter);
    });

  }); 


  describe('#prototype.load()', function() {
    it('Should not return error', function(done) {
      var converter = new Converter();
      console.log(converter);
    });
  });
});

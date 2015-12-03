///**
// * Created by developer on 2-12-15.
// */
//var webdriverio =require('webdriverio');
//var expect = require('chai').expect;
//
//describe('Test 1', function(){
//    this.timeout(20000);
//    var browser;
//
//    before(function(done) {
//        browser = webdriverio.remote({
//            desiredCapabilities: {
//                browserName: 'chrome'
//            }
//        });
//        browser.init(done);
//    });
//
//    it("Should see an lamp", function(done){
//        browser.
//            url("http://localhost:3221/#/actuators")
//            .click('.customCard')
//            .getText(".col").then( function(result){
//                assert(value === 'lamp');
//                expect(result).to.be.a("string");
//                done();
//            });
//    });
//
//    it("should change intesity", function(done){
//        browser.
//            url("http://localhost:3221/#/actuators")
//            .click('.detailcontainer')
//            .click('.touch valign')
//            .getText("#commandTitle").then( function(result){
//                assert(value === 'change intensity');
//                expect(result).to.be.a("string");
//                done();
//            });
//    });
//
//    after(function(done){
//        browser.end(done);
//    });
//});

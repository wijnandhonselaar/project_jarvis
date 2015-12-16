var webdriverio    = require('webdriverio');
var chai           = require('chai');
var expect         = chai.expect;

describe("Test scenario", function() {

   // set up the tests
   this.timeout(20000);  // prevent mocha from terminating a test to soon,
                         // when browser is slow
   var siteURL = "http://localhost:3221/";
   var browser;

   before( function (done) {
     // load the driver for browser
     browser = webdriverio.remote({
         desiredCapabilities: {
             browserName: 'chrome'
         }
     });
     browser.init(done);
   });

   it("should show the master 5 menu items", function(done){
      browser
            .url(siteURL)
            .elements(".menu_item").then(function(result){
            console.log("ELEMENTS:", result);
            expect(result.value).to.have.length(5);
            done();
         })
         .catch(function(exception){
            console.log("EXCEPTION", exception);
            done(exception);
         })
   });
   it("should go to scenario overzicht pagina", function(done){
      browser
            .click('#scenario')
              .getText('#newscenario').then(function(value) {
              console.log(value);
              expect(value).to.be.equal("Nieuw Scenario"); // true
              done();
              })
         .catch(function(exception){
            console.log("EXCEPTION", exception);
            done(exception);
         })
   });
    it("should go to newpage of scenario", function(done){
        browser
            .click('#newscenario')
            .getText('#createNew').then(function(value) {
                console.log(value);
                expect(value).to.be.equal("Opslaan"); // true
                done();
            })
            .catch(function(exception){
                console.log("EXCEPTION", exception);
                done(exception);
            })
    });

    it("should fill in new scenario and open addactuator modal", function(done){
        browser
            .setValue('#name', 'E2ETestNewScenario')
            .setValue('#description', 'E2ETestNewScenariodescription')
            .click('#addactuator')
            .getText('#commandTitle').then(function(value){
                console.log(value);
                expect(value).to.be.equal("Apparaat toevoegen");
                done();
            })
            .catch(function(exception){
                console.log("EXCEPTION", exception);
                done(exception);
            })
    });


    it("should click a lamp and a it to the scenario", function(done){
        //browser
        //    .setValue('#name', 'E2ETestNewScenario')
        //    .setValue('#description', 'E2ETestNewScenariodescription')
        //    .click('#addactuator')
        //    .getText('#commandTitle').then(function(value){
        //        console.log(value);
        //        expect(value).to.be.equal("Apparaat toevoegen");
        //        done();
        //    })
        //    .catch(function(exception){
        //        console.log("EXCEPTION", exception);
        //        done(exception);
        //    })
    });



    after( function(done) {
       browser.end(done);
   });
});

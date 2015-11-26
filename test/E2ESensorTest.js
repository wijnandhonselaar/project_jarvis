// var webdriverio =require('webdriverio');
// var expect = require('chai').expect;

// describe('Test 1', function(){
// 	this.timeout(10000);
// 	var browser;

// 	before(function(done) {
// 		browser = webdriverio.remote({
// 			desiredCapabilities: {
// 				browserName: 'phantomjs'
// 			}
// 		});
// 		browser.init(done);
// 	});

// 	it("Should read the news", function(done){
// 		browser.
// 			url("http://www.bbc.com/news/world-middle-east-34917485")
// 			.getText(".story-body__h1").then( function(result){
// 				console.log("Headline is: " + result);
// 				expect(result).to.be.a("string");
// 				done();
// 			});
// 	})

// 	after(function(done){
// 		browser.end(done);
// 	});
// });

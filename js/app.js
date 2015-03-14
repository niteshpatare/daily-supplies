$(document).ready(function(){


	$(function () {
		var app = app || {};
		app.models = {};
		app.viewmodels = {};
		var paperItems ='';
		//console.log("s:::::::"+ko.toJS(paperItems));

		paperItems = ko.utils.parseJson(paperItems);
		app.models.paperModel = function(paperItem){
			//paperItem = ko.toJS(paperItems) || "";
			var self = this;
			//self.id = ko.observable(paperItem.id ? paperItem.id : "");
			self.papertitle = ko.observable(paperItem.papertitle ? paperItem.papertitle : "");
			self.startdt = ko.observable(paperItem.startdt ? paperItem.startdt : "");
			self.enddt = ko.observable(paperItem.enddt ? paperItem.enddt : "");
			self.plan = ko.observable(paperItem.plan ? paperItem.plan : "");
			self.paymentmode = ko.observable(paperItem.paymentmode ? paperItem.paymentmode : "");
			self.paperstatus = ko.observable(paperItem.paperstatus ? paperItem.paperstatus : "");
			self.paperstatusclass = ko.computed(function(){
										var cssclass="";
										if(self.paperstatus() == "Active"){
											cssclass = "success";
										}
										else if(self.paperstatus() == "Pending"){
											cssclass = "warning";
										}
										else if(self.paperstatus() == "Declined"){
											cssclass = "error";
										}
										else{
											cssclass = "info";
										}
										return cssclass;
									});
		};

		app.viewmodels.paperViewModel = function(){
			var self = this;
			self.paperList = ko.observableArray(
								ko.utils.arrayMap(paperItems, function(paperItem){
									console.log(paperItem);
									return new app.models.paperModel(paperItem);
								})
							 );
		};

		app.servicelayer = (function($){

			function _getData(url){
				// $.ajax({
				//   dataType: "json",
				//   url: url,
				//   data: data,
				//   success: success
				// });
				$.get( url,  function( data ) {
				    $( ".result" ).html( data );
				 		 console.log( "Load was performed." );
					}, "json")
					.done(function() {
				    	console.log( "second success" );
				 	})
				 	.fail(function() {
				    	console.log( "error" );
				 	})
				 	.always(function() {
				    	console.log( "finished" );
				  });
			};

			return{
				getData: _getData
			}
		})($);

		app.utilities = (function($, ko){
			function _applyTemplate(vmInst, ele){
				var jqElement = $(ele)[0];
				if(typeof jqElement !== "undefined"){
					ko.cleanNode(jqElement);
					ko.applyBindings(vmInst, jqElement);
				}
				else{
					ko.applyBindings(vmInst);
				}
			};

			return{
				applyTemplate: _applyTemplate
			}

		})($, ko);

		app.run = (function($, app){

			function _init(){
					var paperInstance = new app.viewmodels.paperViewModel();
					app.utilities.applyTemplate(paperInstance, "#home");
					app.servicelayer.getData("../paperItems.json");

			};

			return{
				init: _init
			}

		})($, app);

		app.run.init();
		console.log("end::::::");
	});
});


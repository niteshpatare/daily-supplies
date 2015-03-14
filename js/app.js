$(document).ready(function(){


	$(function () {
		var app = app || {};
		app.models = {};
		app.viewmodels = {};
		var paperItemsSubscribed ='';
		var newspaperLists = "";
		//console.log("s:::::::"+ko.toJS(paperItemsSubscribed));

		paperItemsSubscribed = ko.utils.parseJson(paperItemsSubscribed);
		newspaperLists = ko.utils.parseJson(newspaperLists);

		app.models.newspaperModel = function(newspaperItem){
			var self= this;
			self.newspaperid = ko.observable(newspaperItem.newspaperid ? newspaperItem.newspaperid :"")
			self.newspapertitle = ko.observable(newspaperItem.newspapertitle ? newspaperItem.newspapertitle :"")
			self.newspaperoffer = ko.observable(newspaperItem.newspaperoffer ? newspaperItem.newspaperoffer :"")
			self.newspaperlanguage = ko.observable(newspaperItem.newspaperlanguage ? newspaperItem.newspaperlanguage :"")
		};

		app.models.paperModel = function(paperItem){
			//paperItem = ko.toJS(paperItemsSubscribed) || "";
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
										else if(self.paperstatus() == "Expired"){
											cssclass = "error";
										}
										else{
											cssclass = "info";
										}
										return cssclass;
									});
		};

		app.viewmodels.newspaperViewModel = function(){
			var self= this;
			self.newspaperList = ko.observableArray(
									ko.utils.arrayMap(newspaperLists,function(newspaperitem){
										console.log(newspaperitem);
										return new app.models.newspaperModel(newspaperitem);
									})
								);
		};

		app.viewmodels.paperViewModel = function(){
			var self = this;
			self.paperList = ko.observableArray(
								ko.utils.arrayMap(paperItemsSubscribed, function(paperItem){
									console.log(paperItem);
									return new app.models.paperModel(paperItem);
								})
							 );
		};

		app.servicelayer = (function($){

			function _getData(url, callbackFun){

				$.get( url,  function( data ) {
				    
				 		 console.log( "Load was performed." + data);
				 		
				 		 callbackFun(data);
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

		app.fetch = (function($){
			function _getHomePaperList(data){
				paperItemsSubscribed = data;
				var paperInstance = new app.viewmodels.paperViewModel();
				app.utilities.applyTemplate(paperInstance, "#home");

			};
			function _getSearchPaperList(data){
				newspaperLists = data;
				var newspaperListsInstance = new app.viewmodels.newspaperViewModel();
				app.utilities.applyTemplate(newspaperListsInstance, "#searchcard");

			};
			return{
				getHomePaperList: _getHomePaperList,
				getSearchPaperList: _getSearchPaperList
			}
		})($);

		app.run = (function($, app){

			function _init(){
					app.servicelayer.getData("paperItemsSubscribed.json", app.fetch.getHomePaperList);
					app.servicelayer.getData("newspaperItemsListed.json", app.fetch.getSearchPaperList);
//					app.fetch.getHomePaperList(data);				
			};

			return{
				init: _init
			}

		})($, app);

		app.run.init();
		console.log("end::::::");
	});
});


require.config({
	baseUrl: "./js/",
	paths: {
		"angular": "ThirdParty/angular",
		"angular-route": "ThirdParty/angular-route.min",
		"angular-animate": "ThirdParty/angular-animate",
		"jquery": "ThirdParty/jquery-2.1.4.min",
		"ui-bootstrap-tpls-0": "ThirdParty/ui-bootstrap-tpls-0.14.3",
		"smart-table": "task/smart-table",
	},
	shim: {
		"angular" : {
			exports : "angular", 
			deps: ["jquery"]
		},
		"jquery" : {
			exports : "jquery"
		},
		"angular-route" : {
			exports : "angular",
			deps: ["angular"] 			
		},
		"smart-table" : {
			deps: ["angular"],
			exports : "angular" 
		},
		"ui-bootstrap-tpls-0" : {
			deps: ["angular"],
			exports : "angular" 
		},
		"angular-animate" : {
			deps:["angular"],
			exports : "angular" 
		},
		"smart-table" : {
			deps:["angular"],
			exports : "angular"
		}
	}
});

require(
	["atnowApp"], function(atnowApp) {
		atnowApp.init();
	}
);
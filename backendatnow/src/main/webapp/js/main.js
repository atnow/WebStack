require.config({
	baseUrl: "./js/",
	paths: {
		"angular": "ThirdParty/angular",
		"angular-route": "ThirdParty/angular-route.min",
		"angular-animate": "ThirdParty/angular-animate",
		"jquery": "ThirdParty/jquery-2.1.4.min",
		"ui-bootstrap-tpls-0": "ThirdParty/ui-bootstrap-tpls-0.14.3",
		"smart-table": "task/smart-table",
		"atnowApp": "atnowApp"
	},
	shim: {
		"angular" : {"exports" : "angular", deps: ["jquery"]},
		"jquery" : {"exports" : "jquery"},
		"angular-route" : {deps: ["angular"]},
		"smart-table" : {deps: ["angular"]},
		"ui-bootstrap-tpls-0" : {deps: ["angular"]},
		"angular-animate" : {deps:["angular"]},
		"atnowApp" : {deps:["angular"]}
	}
});

require(
	[
		"atnowApp",
		"angular",
		"angular-route",
		"angular-animate",
		"jquery",
		"ui-bootstrap-tpls-0",
		"smart-table"

	], function() {

	}
);
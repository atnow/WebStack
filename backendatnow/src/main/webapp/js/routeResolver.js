'use strict';

define([], function () {

    var routeResolver = function () {

        this.$get = function () {
            return this;
        };

        this.routeConfig = function () {
            var controllerDirectory = '/js/controllers/',
                viewDirectory = '/js/views/',

            setBaseDirectories = function (controllerDir, viewDir) {
                controllerDirectory = controllerDir;
                viewDirectory = viewDir;
            },

            getViewDirectory = function() {
                return viewDirectory;
            },

            getControllerDirectory = function () {
                return controllerDirectory;
            };



            return {
                setBaseDirectories: setBaseDirectories,
                getControllerDirectory: getControllerDirectory,
                getViewDirectory: getViewDirectory
            };
        }();

        this.route = function (routeConfig) {

            var resolve = function (baseName, path, controllerAs, secure) {
                if (!path) path = '';

                var routeDef = {};
                var baseFileName = baseName.charAt(0).toLowerCase() + baseName.substr(1);
                routeDef.templateUrl = routeConfig.getViewDirectory() + path + baseFileName + '.html';
                routeDef.controller = baseName + 'Controller';
                if (controllerAs) routeDef.controllerAs = controllerAs;
                routeDef.secure = (secure) ? secure : false;
                routeDef.resolve = {
                    load: ['$q', '$rootScope', function ($q, $rootScope) {
                        var dependencies = [routeConfig.getControllerDirectory() + path + baseFileName + 'Controller.js'];
                        return resolveDependencies($q, $rootScope, dependencies);
                    }]
                };

                return routeDef;
            },

            resolveDependencies = function ($q, $rootScope, dependencies) {
                var defer = $q.defer();
                require(dependencies, function () {
                    defer.resolve();
                    $rootScope.$apply()
                });

                return defer.promise;
            };

            return {
                resolve: resolve
            }
        }(this.routeConfig);

    };

    var servicesApp = angular.module('routeResolverServices', []);

    //Must be a provider since it will be injected into module.config()    
    servicesApp.provider('routeResolver', routeResolver);
});
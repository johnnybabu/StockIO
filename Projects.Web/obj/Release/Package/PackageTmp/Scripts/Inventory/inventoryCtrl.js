(function (app) {
    'use strict';

    app.controller('inventoryCtrl', inventoryCtrl);

    inventoryCtrl.$inject = ['$scope', 'apiService', 'membershipService', 'notificationService', '$rootScope', '$location'];

    function inventoryCtrl($scope, apiService, membershipService, notificationService, $rootScope, $location) {


    }

})(angular.module('common.core'));
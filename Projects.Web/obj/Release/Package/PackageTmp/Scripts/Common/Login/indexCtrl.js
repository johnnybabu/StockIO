(function (app) {
    'use strict';
    
    app.controller('indexCtrl', indexCtrl);

    indexCtrl.$inject = ['$scope', 'apiService', 'membershipService', 'notificationService', '$rootScope', '$location', '$mdDialog'];

    function indexCtrl($scope, apiService, membershipService, notificationService, $rootScope, $location, $mdDialog) {

        GetCurrentStockList();
        function GetCurrentStockList() {
            apiService.get('api/addstock/GetCurrentStockList/' + $rootScope.tenant.tenant_id, null, GetCurrentStockListComplete, GetCurretnStockListFailed);
        }
        function GetCurrentStockListComplete(response) {
            $scope.CurrentStockList = response.data;
        }
        function GetCurretnStockListFailed() {
            notificationService.displayError('Unable to get Current Stock List');
        }

        $scope.getProductName = function (pid) {
            for (var i = 0; i < $rootScope.productsList.length; i++) {
                if ($rootScope.productsList[i].id == pid) {
                    return $rootScope.productsList[i].product_name;
                }
            }
        };

    }

})(angular.module('common.core'));


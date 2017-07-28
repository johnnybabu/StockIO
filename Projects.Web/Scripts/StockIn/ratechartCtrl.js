(function (app) {
    'use strict';

    app.controller('ratechartCtrl', ratechartCtrl);

    ratechartCtrl.$inject = ['$scope', 'apiService', 'membershipService', 'notificationService', '$rootScope', '$location'];

    function ratechartCtrl($scope, apiService, membershipService, notificationService, $rootScope, $location) {

        GetRateChartList();
        function GetRateChartList() {
            apiService.get('api/addstock/GetRateChartList/' + $rootScope.tenant.tenant_id, null, GetRateChartListComplete, GetRateChartListFailed);
        }
        function GetRateChartListComplete(response) {
            $scope.RateChartList = response.data;
        }
        function GetRateChartListFailed() {
            notificationService.displayError('Unable to get Rate chart List');
        }

        $scope.getProductName = function (pid) {
            for (var i = 0; i < $rootScope.productsList.length; i++) {
                if ($rootScope.productsList[i].id == pid) {
                    return $rootScope.productsList[i].product_name;
                }
            }
        };

        $scope.canEdit = true;
        $scope.showSaveBtn = false;
        $scope.EidtRate = function (rate) {
            $scope.canEdit = false;
            $scope.showSaveBtn = true;
        };
        $scope.UpdateRate = function (rate) {
            $scope.rate.id = rate.id;
            $scope.rate.rate = rate.sale_price;
            alert($scope.rate.rate);
            apiService.post('api/addstock/UpdateRateChart', $scope.rate, UpdateRateChartSuccess, UpdateRateChartFailed);
        };

        function UpdateRateChartSuccess() {
            notificationService.displaySuccess("Rate Updtaed Successfull");
            $scope.canEdit = true;
            $scope.showSaveBtn = false;
        }
        function UpdateRateChartFailed() {
            notificationService.displayError("Unable to Update Rate");
        }
    }
})(angular.module('common.core'));
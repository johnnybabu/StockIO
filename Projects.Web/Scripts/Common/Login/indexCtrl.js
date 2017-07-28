(function (app) {
    'use strict';
    
    app.controller('indexCtrl', indexCtrl);

    indexCtrl.$inject = ['$scope', 'apiService', 'membershipService', 'notificationService', '$rootScope', '$location', '$mdDialog'];

    function indexCtrl($scope, apiService, membershipService, notificationService, $rootScope, $location, $mdDialog) {
        $scope.pagination = {
            pageSize:3,
            pageIndex: 0,
            total:7          
        };
        //$scope.pageIndex = 0;
        //$scope.pageSize = 3;        

        GetCurrentStockList();
        function GetCurrentStockList() {
            //apiService.get('api/addstock/GetCurrentStockList/' + $rootScope.tenant.tenant_id, null, GetCurrentStockListComplete, GetCurretnStockListFailed);
            apiService.get('api/addstock/GetCurrentStockList/' + $scope.pagination.pageIndex + '/' + $scope.pagination.pageSize + '/' + $rootScope.tenant.tenant_id, null, GetCurrentStockListComplete, GetCurretnStockListFailed);
        }
        function GetCurrentStockListComplete(response) {
            $scope.CurrentStockList = response.data;
            //$scope.TotalItems = $scope.CurrentStockList.length;
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

        //$scope.getRecords = function () {
        //   // alert($scope.pageSize + ' ' + $scope.pageIndex);
        //    apiService.get('api/addstock/GetCurrentStockList/' + $scope.pagination.pageIndex + '/' + $scope.pagination.pageSize + '/' + $rootScope.tenant.tenant_id, null, GetCurrentStockListComplete, GetCurretnStockListFailed);

        //    function GetCurrentStockListComplete(response) {
        //        $scope.CurrentStockList = response.data;
        //    }
        //    function GetCurretnStockListFailed() {
        //        notificationService.displayError('Unable to get Current Stock List');
        //    }
        //}

        $scope.getNumber = function (num) {
            return new Array(num);
        }
        $scope.setCurrentPage = function (newPage) {
            //$scope.pagination.currentPage = newPage;
            //$scope.loadItems();
            //alert(newPage + 1);
            apiService.get('api/addstock/GetCurrentStockList/' + newPage + '/' + $scope.pagination.pageSize + '/' + $rootScope.tenant.tenant_id, null, GetCurrentStockListComplete, GetCurretnStockListFailed);
        };


    }

})(angular.module('common.core'));


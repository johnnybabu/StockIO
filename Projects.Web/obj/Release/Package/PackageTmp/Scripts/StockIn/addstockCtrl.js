(function (app) {
    'use strict';

    app.controller('addstockCtrl', addstockCtrl);

    addstockCtrl.$inject = ['$scope', 'apiService', 'membershipService', 'notificationService', '$rootScope', '$location'];

    function addstockCtrl($scope, apiService, membershipService, notificationService, $rootScope, $location) {
        $scope.unitsList = ['kilogram', 'gram', 'litre', 'millilitre', 'piece', 'packet', 'meters', 'other'];
        $scope.itemsList = [];
        $scope.addStockForm = false;

        $scope.ShowAddStockForm = function () {
            $scope.addStockForm = true;
        }
        $scope.CancelAddStock = function () {
            $scope.stock = {};
            $scope.itemsList = [];
            $scope.newStockForm.$setPristine();
            $scope.newStockForm.$setUntouched();
            $scope.addStockForm = false;
        }


        GetStockList();
        function GetStockList(){
            apiService.get('api/addstock/GetRawStockList/' + $rootScope.tenant.tenant_id, null, GetRawStockListComplete, GetRawStockListFailed);
        }
        function GetRawStockListComplete(response) {
            $scope.Stocklist = response.data;
        }
        function GetRawStockListFailed(){
            notificationService.displayError('Unable to get Stock List');
        }

        $scope.totalAmount = 0;
        $scope.addItem = function () {            
            if ($scope.product_id == "" || $scope.brand_name == "" || $scope.model_name == "" || $scope.quantity == "" || $scope.units_in == "" || $scope.price == "")
            {
                notificationService.displayError("Please enter reqired fields");
            }
            else {
                $scope.itemsList.push({
                    'product_id': $scope.product_id,
                    'brand_name': $scope.brand_name,
                    'model_name': $scope.model_name,
                    'quantity': $scope.quantity,
                    'units_in': $scope.units_in,
                    'price': $scope.price
                });
                $scope.totalAmount += $scope.price * $scope.quantity;
                $scope.product_id = '';
                $scope.brand_name = '';
                $scope.model_name = '';
                $scope.quantity = '';
                $scope.units_in = '';
                $scope.price = '';
            }           
        }
        $scope.removeItem = function (id,item) {
            //alert(id);
            $scope.itemsList.splice(id, 1);
            $scope.totalAmount -= item.price * item.quantity;
        }

        $scope.SaveStockDetails = function () {
            $scope.stock.tenant_id = $rootScope.tenant.tenant_id;
            $scope.stock.addstockitems = $scope.itemsList;

            if ($scope.newStockForm.$valid && $scope.itemsList.length>0) {
                apiService.post('api/addstock/SaveStock', $scope.stock, SaveStockSuccess, SaveStockFailed);
            }          
            else { notificationService.displayError('Please enter the required details');}
        };
        function SaveStockSuccess(response) {
            notificationService.displaySuccess('Stock saved Successfully!');            
            $scope.stock = {};
            $scope.itemsList = [];
            $scope.newStockForm.$setPristine();
            $scope.newStockForm.$setUntouched();
            $scope.addStockForm = false;
            GetStockList();
        }

        function SaveStockFailed() {
            notificationService.displayError('unable to save stock');
        }


        $scope.getProductName = function (pid) {
            for (var i = 0; i < $rootScope.productsList.length; i++)
            {
                if ($rootScope.productsList[i].id == pid)
                {
                    return $rootScope.productsList[i].product_name;
                }
            }
        };
    }
})(angular.module('common.core'));
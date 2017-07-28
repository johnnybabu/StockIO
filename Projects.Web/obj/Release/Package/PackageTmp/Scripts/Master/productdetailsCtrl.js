(function (app) {
    'use strict';

    app.controller('productdetailsCtrl', productdetailsCtrl);

    productdetailsCtrl.$inject = ['$scope', 'apiService', 'membershipService', 'notificationService', '$rootScope', '$location'];

    function productdetailsCtrl($scope, apiService, membershipService, notificationService, $rootScope, $location) { 

        $scope.product = {};
        $scope.productsList = [];
        
        $scope.SaveProduct = function(){
            $scope.product.tenant_id = $rootScope.tenant.tenant_id;
            apiService.post('api/products/SaveProduct', $scope.product, SaveProductSuccess, SaveProductFailed);
        }

        function SaveProductSuccess(response) {
            notificationService.displaySuccess('Product saved Successfully!');
            LoadProductsList();
            $scope.product = {};
            $scope.newProductForm.$setPristine();
            $scope.newProductForm.$setUntouched();            
        }

        function SaveProductFailed() {
            notificationService.displayError('unable to save product');
        }

        LoadProductsList();
        function LoadProductsList() {
            apiService.get('api/products/GetProductsList/' + $rootScope.tenant.tenant_id, null, GetProductListComplete, GetProductListFailed);
        }
        function GetProductListComplete(response) {
            $scope.productsList = response.data;
        }
        function GetProductListFailed() {
            notificationService.displayError('unable to get Products List');
        }

        $scope.deleteProduct = function (product) {
            if (confirm("Confirm to delete"))
            {
                apiService.post('api/products/DeleteProduct', product, DeleteProductSuccess, DeleteProductFailed);
            }
            
        };
        function DeleteProductSuccess(response) {
            notificationService.displaySuccess('product deleted successfully');
            LoadProductsList();
        }
        function DeleteProductFailed() {
            notificationService.displayError('unable to delete');
        }
    } 
})(angular.module('common.core'));
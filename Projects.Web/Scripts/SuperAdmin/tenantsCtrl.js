(function (app) {
    app.controller('tenantsCtrl', tenantsCtrl);

    tenantsCtrl.$inject = ['$scope', '$location', '$rootScope', 'apiService', 'notificationService', '$modal', '$filter']
    function tenantsCtrl($scope, $location, $rootScope, apiService, notificationService, $modal, $filter) {

        $scope.tenants = [];

        LoadMaster();
        function LoadMaster() {
            apiService.get('api/Tenant/GetTenants/', null, GetTenantsComplete, GetTenantsFailed);
        }

        function GetTenantsComplete(response) {
            $scope.tenants = response.data;
        }

        function GetTenantsFailed(response) {
            notificationService.displayError("Tenants could not be loaded !");
        }
    }
})(angular.module('common.core'));
(function (app) {
    app.controller('myprofileCtrl', myprofileCtrl);
    myprofileCtrl.$inject = ['$scope', '$location', '$rootScope', 'apiService', 'notificationService', '$modal', '$filter']
    function myprofileCtrl($scope, $location, $rootScope, apiService, notificationService, $modal, $filter) {

        $scope.myprofile =[];

       loadmaster();
        function loadmaster() {
            apiService.get('api/Tenant/GetMyProfile', null, UsersLoadComplete, UsersLoadFailed);
        }

        function UsersLoadComplete(response) {
            $scope.myprofile = response.data[0];
        }

        function UsersLoadFailed() {
              notificationService.displayError("fetching data failed");
        }

        //function loadmaster(){
        //    apiService.get('api/Tenant/GetUser/' + tenantid, null, GetuserComplete, GetuserFailed);
        //}
        //function GetuserComplete(response) {
        //    $scope.CountriesList = response.data;
        //}

        //function GetuserFailed(response) {
        //    notificationService.displayError("Countries could not be loaded !");
        //}
    }
})(angular.module('common.core'));
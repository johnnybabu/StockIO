
(function (app) {
    'use strict';

    app.factory('Excel', function ($window) {
        var uri = 'data:application/vnd.ms-excel;base64,',
            template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
            base64 = function (s) { return $window.btoa(unescape(encodeURIComponent(s))); },
            format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) };
        return {
            tableToExcel: function (tableId, worksheetName) {
                var table = $(tableId).clone(),
                    ctx = { worksheet: worksheetName, table: table.html() },
                    href = uri + base64(format(template, ctx));
                return href;
            }
        };
    });

    app.controller('rootCtrl', rootCtrl);

    rootCtrl.$inject = ['apiService','$scope', '$location', 'membershipService', '$rootScope', '$cookieStore'];
    function rootCtrl(apiService,$scope, $location, membershipService, $rootScope, $cookieStore) {

        $scope.userData = {};

        $scope.userData.displayUserInfo = displayUserInfo;
        $scope.logout = logout;


        function displayUserInfo() {
            $scope.userData.isUserLoggedIn = membershipService.isUserLoggedIn();

            if ($scope.userData.isUserLoggedIn) {
                $scope.userid = $rootScope.repository.loggedUser.userid;
            }
        }

        function logout() {
            membershipService.removeCredentials();
            $location.path('/');
            $scope.userData.displayUserInfo();
        }

        $scope.userData.displayUserInfo();
        //$location.path('/');

        $rootScope.$on('$routeChangeStart', function () {
            //alert('refresh happening' + ' ' + $location.path());
            $rootScope.tenant = $cookieStore.get('ck_tenant');
            $rootScope.productsList = $cookieStore.get('ck_productList');
            GetMenuList();
            function GetMenuList() {
                apiService.get('api/MenuAccess/GetMenuList/' + $rootScope.tenant.user_id, null, GetMenuListComplete, null);
            }

            function GetMenuListComplete(response) {
                $rootScope.MenuList = response.data;
            }            

        });
    }

})(angular.module('Projects'));

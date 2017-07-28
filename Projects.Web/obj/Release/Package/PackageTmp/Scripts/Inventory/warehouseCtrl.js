(function (app) {
    'use strict';
    
    app.controller('warehouseCtrl', warehouseCtrl);

    warehouseCtrl.$inject = ['$scope', 'apiService', 'membershipService', 'notificationService', '$rootScope', '$location','$modal'];

    function warehouseCtrl($scope, apiService, membershipService, notificationService, $rootScope, $location,$modal) {

        $scope.Refmaster = $rootScope.ReferenceMasterData;
        $scope.SubContractorList = $rootScope.SCMasterList;
        $scope.totalItems = $scope.SubContractorList.length;
        $scope.IndentStatusList = [];
        $scope.IndentHeaderList = [];
        $scope.IndentDetailsList = [];
        $scope.WarehouseDetailsList = [];
        $scope.projectslists = [];

        GetProjectMasterList();
        function GetProjectMasterList() {
            apiService.get('api/indent/GetProjectMasterList/' + $rootScope.tenant.tenant_id, null, GetProjectMasterListLoadComplete, GetProjectMasterListFailed);
        }
        function GetProjectMasterListLoadComplete(response) {
            $scope.projectslists = response.data;
        }
        function GetProjectMasterListFailed() {
            notificationService.displayError('fetching GetProject MasterList failed');
        }

        GetIndentStatusList();
        function GetIndentStatusList() {
            apiService.get('api/indent/GetIndentStatus/' + $rootScope.tenant.tenant_id, null, GetIndentStatusListComplete, GetIndentStatusListFailed);
        }
        function GetIndentStatusListComplete(response) {
            $scope.IndentStatusList = response.data;
        }
        function GetIndentStatusListFailed() {
            notificationService.displayError('Indent Status List Load failed...!');
        }
        GetIndentHeaderList();
        function GetIndentHeaderList() {
            apiService.get('api/indent/GetIndent', null, GetIndentHeaderListComplete, GetIndentHeaderListFailed);
        }
        function GetIndentHeaderListComplete(response) {
            $scope.IndentHeaderList = response.data;
        }
        function GetIndentHeaderListFailed() {
            notificationService.displayError('Indent Header List Load failed...!');
        }
        GetIndentdetailsList();
        function GetIndentdetailsList() {
            apiService.get('api/indent/GetIndentdetails', null, GetIndentdetailsListComplete, GetIndentdetailsListFailed);
        }
        function GetIndentdetailsListComplete(response) {
            $scope.IndentDetailsList = response.data;
        }
        function GetIndentdetailsListFailed() {
            notificationService.displayError('Indent Details List Load failed...!');
        }

        GetWarehousedetailsList();
        function GetWarehousedetailsList() {
            apiService.get('api/indent/WarehouseDetailsList', null, GetWarehousedetailsComplete, GetWarehousedetailsFailed);
        }
        function GetWarehousedetailsComplete(response) {
            $scope.WarehouseDetailsList = response.data;
        }
        function GetWarehousedetailsFailed() {
            notificationService.displayError('Warehouse Details List Load failed...!');
        }



        ///forpopup///
        $rootScope.Count = 0;
        $scope.releasematerialPopUp = releasematerialPopUp;
        function releasematerialPopUp(indentStatus) {
            var modalInstance = $modal.open({
                templateUrl: 'Scripts/Inventory/warehousePopup.html',
                controller: 'warehousePopupCtrl',
                scope: $scope,
                resolve: {
                    indentNo: function () { return indentStatus.indent_no },
                    created_Date: function () { return indentStatus.date_recieved },
                }
            })
            modalInstance.result.then(function () {
                GetIndentStatusList();
            })
        }
        ///for popup///

    }
})(angular.module('common.core'));

(function (app) {
    'use strict';

    app.controller('settingsCtrl', settingsCtrl);

    settingsCtrl.$inject = ['$scope', 'apiService', 'membershipService', 'notificationService', '$rootScope', '$location'];

    function settingsCtrl($scope, apiService, membershipService, notificationService, $rootScope, $location) {

       

        $scope.tenantID = $rootScope.tenant.tenant_id;
        $scope.empCodeSettings = {};

        $scope.SaveEmpCodeSettings = function SaveEmpCodeSettings() {
            $scope.empCodeSettings.tenant_id = $scope.tenantID;
            $scope.empCodeSettings.auto_code = $scope.autocode;
            apiService.post('api/EmployeeMaster/AddEmployeeCodeSettings', $scope.empCodeSettings, SaveEmpCodeSettingsComplete, SaveEmpCodeSettingsFailed);
        }

        function SaveEmpCodeSettingsComplete() {
            notificationService.displaySuccess("Employee Code Settings Saved Successfully !");
            $scope.empCodeSettings = {};
            $scope.empCodeForm.$setPristine();
            $scope.empCodeForm.$setUntouched();
        }

        function SaveEmpCodeSettingsFailed() {
            notificationService.displayError("Employee Code Settings could not be Saved !");
        }

        //LoadEmpDetails();
        //function LoadEmpDetails() {
        //    apiService.get('api/EmployeeMaster/GetEmployeesList', null, LoadEmpComplete, LoadEmpFailed);
        //}

        //function LoadEmpComplete(response) {
        //    notificationService.displaySuccess("Employee loaded success !");
        //}
        //function LoadEmpFailed(response) {
        //    notificationService.displayError("Employee loaded failed !");
        //}

        $scope.gridlist = [
            { id: 1, grid_name: 'SubContractorList' },
            { id: 2, grid_name: 'LaboursList' },
            { id: 3, grid_name: 'VehiclesList' }
        ];
        $scope.SubContractorList = [
            'project_name', 'subcontractor_name', 'service_tax_no', 'pan', 'bank_account_no', 'created_date','agreement',
        ];
        $scope.LaboursList = [
            'projectname', 'subcontractorname', 'name', 'current_contact_number', 'fathers_name', 'mother_tongue',
            'current_street', 'permanent_street', 'contact_person_name', 'relation', 'contact_person_contact_number',
            'created_date'
        ];









        $scope.ColumnsList = [];

        function retrieveColumns(listData) {
            $scope.ColumnsList = [];
            for (var name in listData[0]) {
                $scope.ColumnsList.push(name);
            }
        }

        $scope.getColumns = function (grid_id) {
            if (grid_id == 1) {
                $scope.ColumnsList = $scope.SubContractorList;
            }            
            else if (grid_id == 2) {
                $scope.ColumnsList = $scope.LaboursList;
            }
        };

        //apiService.get('api/SubContractor/getSubContractorsList/' + $rootScope.tenant.tenant_id, null, SubContractorsListLoadComplete, SubContractorsListLoadFailed);
        //apiService.get('api/Labour/GetLaboursList/' + $rootScope.tenant.tenant_id, null, LoadLabourSucceess, LoadLabourFailed);
        //function SubContractorsListLoadComplete(response) {
        //    $scope.SubContractorsList = response.data;
        //    retrieveColumns($scope.SubContractorsList);
        //}
        //function SubContractorsListLoadFailed(response) {
        //    notificationService.displayError('Subcontractorslist Failed');
        //}
        //function LoadLabourSucceess(response) {
        //    $scope.LaboursList = response.data;
        //    retrieveColumns($scope.LaboursList);
        //}
        //function LoadLabourFailed() {
        //    notificationService.displayError('fetching Workers list failed');
        //}
    }
})(angular.module('common.core'));
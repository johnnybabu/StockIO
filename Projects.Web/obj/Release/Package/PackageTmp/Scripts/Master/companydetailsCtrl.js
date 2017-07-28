(function (app) {
    'use strict';

    app.controller('companydetailsCtrl', companydetailsCtrl);

    companydetailsCtrl.$inject = ['$scope', 'apiService', 'membershipService', 'notificationService', '$rootScope', '$location'];

    function companydetailsCtrl($scope, apiService, membershipService, notificationService, $rootScope, $location) {
        $scope.tenantID = $rootScope.tenant.tenant_id;
        $scope.refmaster = $rootScope.ReferenceMasterData;
        $scope.ComoponentsList = [];
        $scope.components = {};
        $scope.componentdetails = [];

        //pagination- no. per page dropdown......
        $scope.page = {};
        $scope.page.levelsArr = [
            { value: "3", label: "Records Per Page" },
            { value: "5", label: "5" },
            { value: "10", label: "10" },
            { value: "20", label: "20" },
            { value: "30", label: "30" },
            { value: "40", label: "40" },
            { value: "50", label: "50" },
            { value: "60", label: "60" },
            { value: "70", label: "70" },
            { value: "80", label: "80" },
            { value: "90", label: "90" },
            { value: "100", label: "100" },
            { value: "150", label: "150" },
            { value: "200", label: "200" }
        ];
        $scope.page.levels = $scope.page.levelsArr[0].value;
        //end........
        

        $scope.sort = function (keyname) {
            $scope.sortKey = keyname;   //set the sortKey to the param passed
            $scope.reverse = !$scope.reverse; //if true make it false and vice versa
        }

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

        GetComponentsList();
        function GetComponentsList() {
            apiService.get('api/ProjectComponents/getComponentsList/' + $rootScope.tenant.tenant_id, null, GetComponentsListComplete, GetComponentsListFailed);
        }
        function GetComponentsListComplete(response) {
            $scope.ComoponentsList = response.data;
        }
        function GetComponentsListFailed() {
            notificationService.displayError('fetching components List failed');
        }        


        $scope.SaveComponents = function () {
            $scope.rowItems = $scope.rows.items;
            $scope.components = {
                'tenant_id': $rootScope.tenant.tenant_id,
                'project_id': $scope.project_id,
                'componentdetails': $scope.componentdetails,
            }
            for (var i = 0; i < $scope.rowItems.length; i++) {
                $scope.componentdetails.push({
                    'component': $scope.rowItems[i].component,
                    'description': $scope.rowItems[i].component_description,
                    'uom': $scope.rowItems[i].unitofmeasurement
                });
            }
            if ($scope.components) {
                if ($scope.rowItems[0].component == 'undefined' || $scope.rowItems[0].component == null || $scope.rowItems[0].unitofmeasurement == 'undefined' || $scope.rowItems[0].unitofmeasurement == null) {
                    notificationService.displayError('Please enter a component');
                }
                else {
                    apiService.post('api/ProjectComponents/SaveComponents', $scope.components, SaveComponentSucceess, SaveComponentFailed);
                }
            }
        };

        function SaveComponentSucceess(response) {
            //$scope.showIndentForm = false;
            GetComponentsList();
            notificationService.displaySuccess('Components saved successfully');

            $scope.rows = { items: [{}] };
            $scope.componentdetails = [];
            $scope.showComponentsForm = false; 
            //$scope.rows.items = '';
            // GetIndentList();
        }
        function SaveComponentFailed() {
            notificationService.displayError('unable to save Components');
        }
    }
})(angular.module('common.core'));
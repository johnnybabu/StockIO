(function (app) {
    'use strict';
    app.filter('startFrom', function () {
        return function (input, start) {
            return input.slice(start);
        };
    });
    app.controller('junctionsCtrl', junctionsCtrl);

    junctionsCtrl.$inject = ['$scope', 'apiService', 'membershipService', 'notificationService', '$rootScope', '$location'];

    function junctionsCtrl($scope, apiService, membershipService, notificationService, $rootScope, $location) {


        //pagination- no. per page dropdown......
        $scope.page = {};
        $scope.page.levelsArr = [
            { value: "5", label: "Records Per Page" },
            { value: "7", label: "7" },
            { value: "10", label: "10" },
            { value: "20", label: "20" },
            { value: "40", label: "40" },
            { value: "60", label: "60" },
            { value: "100", label: "100" }
        ];
        $scope.page.levels = $scope.page.levelsArr[0].value;
        //end........


        $scope.showJNForm = false;
        $scope.showAddform = function () {
            if ($scope.showJNForm == false)
            { $scope.showJNForm = true; }
            else { $scope.showJNForm = false; }
        };
        loadform();
        function loadform() {
            if ($scope.JunctionsList == 0) {
                $scope.showJNForm = true;
            }
            else {
                $scope.showJNForm = false;
            }
        }

        $scope.tenantid = $rootScope.tenant.tenant_id;
        $scope.junComponents = [];
        $scope.junction = {};
        $scope.PolicestationList = [];
        $scope.JunctionsList = [];
        $scope.ComponentsList = [];

        LoadProjectsList();
        function LoadProjectsList() {
            apiService.get('api/ProjectMaster/GetProjectsList/' + $rootScope.tenant.tenant_id, null, GetProjectsListLoadComplete, GetProjectsListLoadFailed);
        }
        function GetProjectsListLoadComplete(response) {
            $scope.projectslists = response.data;
        }
        function GetProjectsListLoadFailed() {
            notificationService.displayError('Fetching GetProjectsList Failed');
        }
        LoadComponentsList();
        function LoadComponentsList() {
            apiService.get('api/ProjectComponents/getComponentsList/' + $rootScope.tenant.tenant_id, null, GetComponentsListComplete, GetComponentsListFailed);
        }
        function GetComponentsListComplete(response) {
            $scope.ComponentsList = response.data;
        }
        function GetComponentsListFailed() {
            notificationService.displayError('fetching components List failed');
        }


        GetPoliceStationsList();
        function GetPoliceStationsList() {
            apiService.get('api/PoliceStation/getPoliceStationList', null, PoliceStationsListLoadComplete, PoliceStationsListLoadFailed);
        }
        function PoliceStationsListLoadComplete(response) {
            $scope.PolicestationList = response.data;
        }
        function PoliceStationsListLoadFailed() {
            notificationService.displayError('fetching policestations list failed');
        }

        GetJunctionsList();
        function GetJunctionsList() {
            apiService.get('api/Junction/getJunctionsList', null, JunctionsListLoadComplete, JunctionsListLoadFailed);
            apiService.get('api/Junction/getJunctionsCompList', null, JunctionsCompListLoadComplete, JunctionsCompListLoadFailed);
        }
        function JunctionsListLoadComplete(response) {
            $scope.JunctionsList = response.data;
            $scope.totalItems = $scope.JunctionsList.length;
        }
        function JunctionsListLoadFailed() {
            notificationService.displayError('fetching junctions list failed');
        }
        function JunctionsCompListLoadComplete(response) {
            $scope.JunctionsCompList = response.data;
            for (var i = 0; i < $scope.JunctionsCompList.length; i++) {
                for (var j = 0; j < $scope.ComponentsList.length; j++) {
                    if ($scope.JunctionsCompList[i].component == $scope.ComponentsList[j].component) {
                        $scope.JunctionsCompList[i].uom = $scope.ComponentsList[j].uom;
                    }
                }
            }
        }
        function JunctionsCompListLoadFailed() {
            notificationService.displayError('fetching junctionsComponents list failed');
        }

        $scope.rows = {
            items: [{

            }]
        };
        $scope.nrows = [];

        $scope.addRow = function () {
            $scope.rows.items.push({

            });
        }
        $scope.removeItem = function (m) {
            $scope.rows.items.splice($scope.rows.items.indexOf(m), 1);
        }



        $scope.addJunction = function () {            

            $scope.rowItems = $scope.rows.items;
            $scope.junction = {    
                'tenant_id': $rootScope.tenant.tenant_id,
                'project_id': $scope.junction.project_id,
                'ps_id': $scope.ps,
                'junction_name': $scope.junction.junction_name,
                'created_by': $rootScope.tenant.tenant_id,
                'modified_by':$rootScope.tenant.tenant_id,
                'junComponents': $scope.junComponents
            }
            for (var i = 0; i < $scope.rowItems.length; i++) {
                if ($scope.rowItems[0].component == 'undefined' || $scope.rowItems[0].component == null || $scope.rowItems[0].quantity == 'undefined' || $scope.rowItems[0].quantity == null) {
                    notificationService.displayError("please enter the component");
                }
                else {


                    $scope.junComponents.push({
                        'component': $scope.rowItems[i].component,
                        'quantity': $scope.rowItems[i].quantity
                    });
                }
            }

            if ($scope.newJunctionForm.$valid) {
                if ($scope.rowItems[0].component == 'undefined' || $scope.rowItems[0].component == null || $scope.rowItems[0].quantity == 'undefined' || $scope.rowItems[0].quantity == null) {
                    notificationService.displayError('Please enter a component');
                }
                else {
                    apiService.post('api/Junction/SaveJunction', $scope.junction, saveJunctionSucceess, saveJunctionFailed);
                }
                
            }
            else { notificationService.displayError('Please enter mandatory fields');}
        };
        function saveJunctionSucceess() {
            $scope.showJNForm = false;
            notificationService.displaySuccess('Junctions Details Saved Succefully');
            $scope.junction = {};
            $scope.ps = '';
            $scope.newJunctionForm.$setPristine();
            $scope.newJunctionForm.$setUntouched();
            
            $scope.rows = { items: [{}] };
            $scope.junComponents = [];
            //$scope.rows = {
            //    items: [{}]
            //};
            GetJunctionsList();
            GetComponentsList();            
            
        }
        function saveJunctionFailed() {
            notificationService.displayError('Junctions Details Saved Failed');
        }

        $scope.readOnlyStatus = false;
        $scope.ViewDetails = function (jn) {
            $scope.addBtn = false;
            $scope.updateBtn = false;
            $scope.readOnlyStatus = true;
            $scope.showJNForm = true;
            $scope.junction.id = jn.id;
            $scope.ps = jn.ps_id;
            $scope.junction.junction_name = jn.junction_name;
            $scope.junction.poles_no = jn.poles_no;
            $scope.junction.pits_no = jn.pits_no;
            $scope.junction.earthings_pits_no = jn.earthings_pits_no;
            $scope.junction.trench_length_meters = jn.trench_length_meters;
        };

        $scope.addBtn = true;
        $scope.updateBtn = false;
        $scope.EditJs = function (jn) {
            $scope.addBtn = false;
            $scope.updateBtn = true;
            $scope.readOnlyStatus = false;
            $scope.showJNForm = true;
            $scope.junction = jn;            
            $scope.ps = jn.ps_id;            
        };
        //$scope.row = {};
        $scope.DeleteJun = function DeleteJun(Jun) {
            //$scope.row = Jun;
            alertify.confirm('Delete', 'Are You sure to Delete..!',
                function () {
                     apiService.post('api/Junction/DeleteJun/' + Jun.row_id, null, DeleteJunSuccess, DeleteJunFailure);
                }
                 , function () { }).set('reverseButtons', true);
            //apiService.post('api/Junction/DeleteJun/' + Jun.row_id, null, DeleteJunSuccess, DeleteJunFailure);
        }

        function DeleteJunSuccess(response) {
            notificationService.displaySuccess("Jun Deleted Successfully !");
            GetJunctionsList();
            GetComponentsList();
        }
        function DeleteJunFailure(response) {
            notificationService.displayError("Jun Delete Failed. Please try again !");
        }


        $scope.UpdateJunction = function (data, id) {
            angular.extend(data, { id: id });
            apiService.post('api/Junction/UpdateJunction', data, UserUpdateComplete, UserUpdateFailed);

        };

        function UserUpdateComplete() {
            notificationService.displaySuccess(' updated user successfully.');
        }

        function UserUpdateFailed() {
            notificationService.displayError('Update user Failed !');
        }
        $scope.components = {};
        $scope.AddComponents = function AddComponents(jn) {
            $scope.components = jn;
            $scope.project_id = jn.project_id;
            alert($scope.project_id);
            
        }

        $scope.change1 = true;
        $scope.changefunc = function () {
            $scope.change1 = false;
        };


    }

})(angular.module('common.core'));
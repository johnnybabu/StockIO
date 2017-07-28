(function (app) {
    'use strict';

    app.controller('materialManagementCtrl', materialManagementCtrl);

    materialManagementCtrl.$inject = ['$scope', 'apiService', 'membershipService', 'notificationService', '$rootScope', '$location'];

    function materialManagementCtrl($scope, apiService, membershipService, notificationService, $rootScope, $location) {

        $scope.Refmaster = $rootScope.ReferenceMasterData;
        $scope.showdiv = false;

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


        $scope.addMaterial = function () {
            $scope.material.tenant_id = $rootScope.tenant.tenant_id;
            if ($scope.addMaterialForm.$valid) {
                apiService.post('api/MaterialPrice/SaveMaterialPrice', $scope.material, saveMaterialSucceess, saveMaterialFailed);
            }
            else { notificationService.displayError('Please enter mandatory details');}
        };
        function saveMaterialSucceess() {
            $scope.showMMForm = false;
            notificationService.displaySuccess('Material Details Saved Successfully');
            GetMaterialList();
            $scope.material = {};
            $scope.addMaterialForm.$setPristine();
            $scope.addMaterialForm.$setUntouched();
        }

        $scope.showMMForm = false;
        $scope.showmatform = function () {
            if ($scope.showMMForm == false) {
                $scope.showMMForm = true;
                $scope.addMaterialForm.$setPristine();
                $scope.addMaterialForm.$setUntouched();

            }
            else {
                $scope.showMMForm = false;
            }

        };

        $scope.limitKeypress = function ($event, value, maxLength) {
            if (value !== undefined && value.toString().length >= maxLength) {
                $event.preventDefault();
            }
        }
        function saveMaterialFailed() {
            notificationService.displayError('Material Details Saved Failed');
        }

        //GetMaterialList();

        //function GetMaterialList() {
        //    apiService.get('api/MaterialPrice/GetMaterialList', null, LoadMaterialSucceess, LoadMaterialFailed);
        //}
        $scope.getMaterialsByProjId = function (project_id) {
            apiService.get('api/MaterialPrice/GetMaterialListByProjId/' + project_id, null, LoadMaterialSucceess, LoadMaterialFailed);
            $scope.showdiv = true;
        };
        function LoadMaterialSucceess(response) {
            $scope.MaterialList = response.data;
            //for (var i = 0; i < $scope.MaterialList.length; i++) {
            //    for (var j = 0; j < $scope.Refmaster.length; j++) {
            //        if ($scope.MaterialList[i].unit_of_measurement == $scope.Refmaster[j].id) {
            //            $scope.MaterialList[i].unit_of_measurement = $scope.Refmaster[j].reference_value;
            //        }
            //    }
            //}
            for (var i = 0; i < $scope.Refmaster.length; i++) {
                for (var j = 0; j < $scope.MaterialList.length; j++) {
                    if ($scope.Refmaster[i].id == $scope.MaterialList[j].unit_of_measurement) {
                        $scope.MaterialList[j].unit_of_measurement = $scope.Refmaster[i].reference_value;
                    }
                }
            }
           
        }
        function LoadMaterialFailed() {
            notificationService.displayError('fetching material list failed');
            $scope.showdiv = false;
        }
        $scope.checkmaterial = function () {
            for (var i = 0; i < $scope.MaterialList.length; i++) {
                if ($scope.MaterialList[i].material_name == $scope.material.material_name) {
                    notificationService.displayError("materail already existed please enter another one");
                    $scope.material.material_name = '';
                    document.getElementById('materialname').focus();
                }
            }
        };


        $scope.saveUser = function (data, id) {
            angular.extend(data, { id: id });
            apiService.post('api/MaterialPrice/updatematerial', data, UserUpdateComplete, UserUpdateFailed);
        };
        function UserUpdateComplete() {
            notificationService.displaySuccess(' material price updated  successfully.');
            GetMaterialList();
        }

        function UserUpdateFailed() {
            notificationService.displayError('material price updated Failed !');
        }

    }
})(angular.module('common.core'));
(function (app) {
    'use strict';

    app.controller('fieldworkpriceCtrl', fieldworkpriceCtrl);

    fieldworkpriceCtrl.$inject = ['$scope', 'apiService', 'membershipService', 'notificationService', '$rootScope', '$location'];

    function fieldworkpriceCtrl($scope, apiService, membershipService, notificationService, $rootScope, $location) {
        $scope.Refmaster = $rootScope.ReferenceMasterData;
        $scope.FieldWork = {};
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

        $scope.showfddForm = false;
        $scope.showfieldform = function () {
            if ($scope.showfddForm == false) {
                $scope.showfddForm = true;
                $scope.addFieldWorkForm.$setPristine();
                $scope.addFieldWorkForm.$setUntouched();
            }
            else {
                $scope.showfddForm = false;
            }
        };

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


        $scope.addfieldwork = function () {
            $scope.FieldWork.tenant_id = $rootScope.tenant.tenant_id;
            if ($scope.addFieldWorkForm.$valid) {
                apiService.post('api/fieldworkprice/SaveFieldWorkPrice', $scope.FieldWork, saveFieldWorkSucceess, saveFieldWorkFailed);
            }
            else { notificationService.displayError('Please enter mandatory fields');}
        }          
        function saveFieldWorkSucceess(response) {
            $rootScope.fieldworkslist = response.data;
            $scope.showfddForm = false;
            notificationService.displaySuccess('fieldwork Details Saved Successfully');
            GetFieldworkList();
            $scope.FieldWork = {};
            $scope.addFieldWorkForm.$setPristine();
            $scope.addFieldWorkForm.$setUntouched();
        }

        function saveFieldWorkFailed() {
            notificationService.displayError('fieldwork Details Saved Failed');
        }
        //GetFieldworkList();
        //function GetFieldworkList() {
        //    apiService.get('api/fieldworkprice/GetFieldWorksList', null, LoadFieldworkSucceess, LoadFieldworkFailed);
        //}
        $scope.getFieldworkByProjId = function (project_id) {
            apiService.get('api/fieldworkprice/GetFieldWorksListByprojId/' + project_id, null, LoadFieldworkSucceess, LoadFieldworkFailed);
            $scope.showdiv = true;
        };
        function LoadFieldworkSucceess(response) {
            $scope.FieldworksList = response.data;
            for (var i = 0; i < $scope.FieldworksList.length; i++) {
                for (var j = 0; j < $scope.Refmaster.length; j++) {
                    if ($scope.FieldworksList[i].unit_of_measurement == $scope.Refmaster[j].id) {
                        $scope.FieldworksList[i].UOM = $scope.Refmaster[j].reference_value;
                    }
                }
            }
        }
        function LoadFieldworkFailed() {
            notificationService.displayError('fetching Field works list failed');
            $scope.showdiv = false;
        }


        $scope.saveUser = function (data, id) {
            angular.extend(data, { id: id });
            apiService.post('api/fieldworkprice/updatefieldworkprice', data, FieldWorkUpdateComplete, FieldWorkUpdateFailed);
        };
        function FieldWorkUpdateComplete() {
            notificationService.displaySuccess(' FieldWork price updated  successfully.');
            GetMaterialList();
        }

        function FieldWorkUpdateFailed() {
            notificationService.displayError('FieldWork price updated Failed !');
        }
        $scope.limitKeypress = function ($event, value, maxLength) {
            if (value !== undefined && value.toString().length >= maxLength) {
                $event.preventDefault();
            }
        }
    }

})(angular.module('common.core'));
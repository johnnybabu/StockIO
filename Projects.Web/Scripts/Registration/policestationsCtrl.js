(function (app) {
    'use strict';

    app.controller('policestationsCtrl', policestationsCtrl);

    policestationsCtrl.$inject = ['$scope', 'apiService', 'membershipService', 'notificationService', '$rootScope', '$location'];

    function policestationsCtrl($scope, apiService, membershipService, notificationService, $rootScope, $location) {

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
        
        $scope.showPSForm = false; 
        $scope.showAddform = function () {
            if ($scope.showPSForm == false)
            {
                $scope.showPSForm = true;
                $scope.policestation = {};
                $scope.readOnlyStatus = false;
            }
            else { $scope.showPSForm = false; }
            $scope.addBtn = true;
            $scope.updateBtn = false;

        };
       
        $scope.sort = function (keyname) {
            $scope.sortKey = keyname;   //set the sortKey to the param passed
            $scope.reverse = !$scope.reverse; //if true make it false and vice versa
        }

        $scope.policestation = {};
        $scope.PolicestationList = [];
        //$scope.CountriesList = [];
        //$scope.StatesList = [];
        ////$scope.states = [];
        //$scope.CitiesList = [];
        ////$scope.Cities = [];


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

        //LoadMaster();
        //function LoadMaster() {
        //    apiService.get('api/MasterData/GetCountryList', null, GetCountriesListComplete, GetCountriesListFailed);
        //    apiService.get('api/MasterData/GetStateList', null, GetStatesListComplete, GetStatesListFailed);
        //    apiService.get('api/MasterData/GetCityList', null, GetCitiesListComplete, GetCitiesListFailed);
        //}
        //function GetCountriesListComplete(response) {
        //    $scope.CountriesList = response.data;
        //}

        //function GetCountriesListFailed(response) {
        //    notificationService.displayError("Countries could not be loaded !");
        //}

        //function GetStatesListComplete(response) {
        //    $scope.StatesList = response.data;
        //}

        //function GetStatesListFailed(response) {
        //    notificationService.displayError("States could not be loaded !");
        //}

        //function GetCitiesListComplete(response) {
        //    $scope.CitiesList = response.data;
        //}

        //function GetCitiesListFailed(response) {
        //    notificationService.displayError("Cities could not be loaded !");
        //}
        loadform();
        function loadform() {
            if ($scope.PolicestationList == 0) {
                $scope.showPSForm = true;
            }
            else {
                $scope.showPSForm = false;
            }

        }
        
        $scope.GetPoliceStationByPrjtId = function (project_id) {
            apiService.get('api/PoliceStation/getPoliceStationListByProjId/' + project_id, null, PoliceStationsListLoadComplete, PoliceStationsListLoadFailed);
        };
        function PoliceStationsListLoadComplete(response) {
            $scope.PolicestationList = response.data;
            $scope.showdiv = true;
        }
        function PoliceStationsListLoadFailed() {
            notificationService.displayError('fetching policestations list failed');
            $scope.showdiv = false;
        }

        $scope.addPoliceStation = function () {
            $scope.policestation.tenant_id = $rootScope.tenant.tenant_id;
            if ($scope.newPoliceStationForm.$valid) {
                apiService.post('api/PoliceStation/SavePoliceStation', $scope.policestation, savePoliceStationSucceess, savePoliceStationFailed);
            }
            else { notificationService.displayError('Enter mandatory details'); }
        };
        function savePoliceStationSucceess() {
            $scope.showPSForm = false;
            notificationService.displaySuccess('PoliceStation Details Saved Successfully');
            GetPoliceStationsList();
            $scope.policestation = {};
            $scope.policestation.project_id = '';
            $scope.newPoliceStationForm.$setPristine();
            $scope.newPoliceStationForm.$setUntouched();
        }
        function savePoliceStationFailed() {
            notificationService.displayError('PoliceStation Details Saved Failed');
        }

        $scope.readOnlyStatus = false;
        $scope.ViewDetails = function (ps) {
            $scope.policestation = {};
            $scope.addBtn = false;
            $scope.updateBtn = false;
            $scope.readOnlyStatus = true;
            $scope.showPSForm = false;
            $scope.policestation.ps_name = ps.ps_name;
            $scope.policestation.ps_contact_person = ps.ps_contact_person;
            $scope.policestation.contact_person_mobile_no = ps.contact_person_mobile_no;
            $scope.policestation.project_id = ps.project_id;
        };

        //$scope.editColor = function (psname) {            
        //    if (psname == $scope.policestation.ps_name) {
        //        return { backgroundColor: "dodgerblue", color: "white" }
        //    }
        //};

        $scope.addBtn = true;
        $scope.updateBtn = false;
        $scope.EditPs = function (ps) { 
            $scope.policestation = {};
            $scope.showPSForm = false;
            $scope.addBtn = false;
            $scope.updateBtn = true;
            $scope.readOnlyStatus = false;
            $scope.policestation = ps;            
        };

        $scope.UpdatePS = function () {
            $scope.policestation.modified_by = $rootScope.tenant.tenant_id;
            apiService.post('api/PoliceStation/UpdatePolicestation', $scope.policestation, updatePoliceStationSucceess, updatePoliceStationFailed);
        };
        function updatePoliceStationSucceess() {
            notificationService.displaySuccess("Data Updated Successfully");
            $scope.policestation = {};
            $scope.showPSForm = false;
            $scope.addBtn = true;
            $scope.updateBtn = false;
            GetPoliceStationsList();
        }
        function updatePoliceStationFailed() {
            notificationService.displayError("Updating data failed");
        }
    }

})(angular.module('common.core'));
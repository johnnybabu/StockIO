﻿(function (app) {
    'use strict';
    app.filter('startFrom', function () {
        return function (input, start) {
            return input.slice(start);
        };
    });
    app.controller('subcontractorsCtrl', subcontractorsCtrl);

    subcontractorsCtrl.$inject = ['$scope', 'apiService', '$filter', 'membershipService', 'notificationService', '$rootScope', '$location', '$mdDialog'];

    function subcontractorsCtrl($scope, apiService, $filter, membershipService, notificationService, $rootScope, $location, $mdDialog) {

        $scope.ComponentsList = {};
        $scope.contractor = {};
        $scope.SubContractorsList = [];
        $scope.CountriesList = [];
        $scope.StatesList = $rootScope.StatesList;
        $scope.states = [];
        $scope.Cities = [];
        $scope.CitiesList = [];
        $scope.tenantlogo = "";
        $scope.Refmaster = $rootScope.ReferenceMasterData;
        $scope.photo_file = "";
        $scope.addcon = true;
        $scope.updatecon = false;
        $scope.current_country = '';
        $scope.current_state = '';
        $scope.current_city = '';
        $scope.isEditable = true;
        $scope.contractorDetails = {};
        $scope.contractorcomponent = {};
        $scope.scomponentslist = [];
        $scope.showPopover = false;
        $scope.selected = [];
        $scope.list = [];

        $scope.person = {};
        $scope.person.levelsArr = [
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
        $scope.person.levels = $scope.person.levelsArr[0].value;

        $scope.limitKeypress = function ($event, value, maxLength) {
            if (value !== undefined && value.toString().length >= maxLength) {
                $event.preventDefault();
            }
        }

        $scope.getCountryStates = function (country) {
            $scope.states = ($filter('filter')($scope.StatesList, { country_id: country }, true));
            //$scope.cities = [];
        };

        $scope.getImageinView = function (data) {
            return 'data:image/jpeg;base64,' + data;
        }

        $scope.getStateCities = function (state) {
            $scope.cities = ($filter('filter')($scope.CitiesList, { state_id: state }, true));
        }
        $('#s_file').change(function (event) {
            var filesSelected = document.getElementById("s_file").files;

            if (filesSelected.length > 0) {
                $scope.filetype = filesSelected[0].type;
                $scope.filename = filesSelected[0].name;
                var fileToLoad = filesSelected[0];
                var fileReader = new FileReader();
                fileReader.onload = function (fileLoadedEvent) {
                    var srcData = fileLoadedEvent.target.result;
                    //if (filesSelected[0].size > 200000) {
                    //    notificationService.displayError("Please upload less than 200 kb file");
                    //    $('#uploadFile').val('');
                    //    return false;
                    //}
                    //if (filesSelected[0].type == "application/pdf") {
                    //    $scope.uploadFile = srcData.replace(/data:application\/pdf;base64,/g, '');
                    //}
                    //else if (filesSelected[0].type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                    //    $scope.uploadFile = srcData.replace(/data:application\/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,/g, '');
                    //}
                    //else if (filesSelected[0].type == "application/msword") {
                    //    $scope.uploadFile = srcData.replace(/data:application\/msword;base64,/g, '');
                    //}
                    //else {
                    //    notificationService.displayError("Please Upload PDF or Doc/x..!");
                    //    $('#uploadFile').val('');
                    //    return false;
                    //}

                    $scope.tenantlogofiletype = filesSelected[0].type;

                    if (filesSelected[0].type == "image/jpeg") {
                        $scope.tenantlogoencoded = srcData.replace(/data:image\/jpeg;base64,/g, '');

                    }
                    else if (filesSelected[0].type == "image/png") {
                        $scope.tenantlogoencoded = srcData.replace(/data:image\/png;base64,/g, '');

                    }
                    else {
                        notificationService.displayError("Please Upload JPG or PNG Files!");
                        return false;
                    }

                }
                fileReader.readAsDataURL(fileToLoad);
            }
            $("#imgcontractorphoto").fadeIn("fast").attr('src', URL.createObjectURL(event.target.files[0]));

        });
        $("#imgcontractorphoto").click(function () {
            $("#s_file").trigger("click");
        });

        if ($scope.photofile) {
            $scope.photofile = $scope.getImage($scope.photofile);
        }
        else {
            $scope.photofile = "Content/images/Common/emp_photo.jpg";
        }
        LoadMaster();
        function LoadMaster() {
            apiService.get('api/MasterData/GetCountryList', null, GetCountriesListComplete, GetCountriesListFailed);
            apiService.get('api/MasterData/GetStateList', null, GetStatesListComplete, GetStatesListFailed);
            apiService.get('api/MasterData/GetCityList', null, GetCitiesListComplete, GetCitiesListFailed);
        }
        function GetCountriesListComplete(response) {
            $scope.CountriesList = response.data;
        }

        function GetCountriesListFailed(response) {
            notificationService.displayError("Countries could not be loaded !");
        }

        function GetStatesListComplete(response) {
            $scope.StatesList = response.data;
        }

        function GetStatesListFailed(response) {
            notificationService.displayError("States could not be loaded !");
        }

        function GetCitiesListComplete(response) {
            $scope.CitiesList = response.data;
        }

        function GetCitiesListFailed(response) {
            notificationService.displayError("Cities could not be loaded !");
        }

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

        GetComponentsList();
        function GetComponentsList() {
            apiService.get('api/ProjectComponents/getComponentsList/' + $rootScope.tenant.tenant_id, null, ComponentsListLoadComplete, ComponentsListLoadFailed);
        }
        function ComponentsListLoadComplete(response) {
            $scope.ComponentsList = response.data;
        }
        function ComponentsListLoadFailed(response) {
            notificationService.displayError('Componentslist Failed');
        }
        GetSubcontractorComponentsList();
        function GetSubcontractorComponentsList() {
            apiService.get('api/SubContractor/GetSubcontractorComponentsList', null, SubComponentsListLoadComplete, SubComponentsListLoadFailed);
        }
        function SubComponentsListLoadComplete(response) {
            $scope.SC_ComponentsList = response.data;
        }
        function SubComponentsListLoadFailed(response) {
            notificationService.displayError('SC_Componentslist loading Failed');
        }

        GetSubContractorsList();
        function GetSubContractorsList() {
            apiService.get('api/SubContractor/getSubContractorsList/' + $rootScope.tenant.tenant_id, null, SubContractorsListLoadComplete, SubContractorsListLoadFailed);
        }
        function SubContractorsListLoadComplete(response) {
            $scope.SubContractorsList = response.data;
            $scope.totalItems = $scope.SubContractorsList.length;
        }
        function SubContractorsListLoadFailed(response) {
            notificationService.displayError('Subcontractorslist Failed');
        }

        $scope.SearchSubcontractors = function (filter) {
            apiService.get('api/SubContractor/search/' + filter, null, SubContractorsListLoadComplete, SubContractorsListLoadFailed);
        }
        function SubContractorsListLoadComplete(response) {
            $scope.SubContractorsList = response.data;
        }
        function SubContractorsListLoadFailed() {
            notificationService.displayError('Subcontractorslist Failed');
        }


        //multi select comps..
        var startCount = 0;
        $scope.addOrRemoveComp = function (comp, checkedStatus) {            
            //if (startCount == 0) { $scope.scomponentslist = []; }
                           
            if (checkedStatus == true) {
                var isDup = false;
                for (var i = 0; i < $scope.scomponentslist.length; i++) {
                    if ($scope.scomponentslist[i].component_name == comp.component) {
                        isDup = true; break;
                    }
                }
                
                if (isDup == false) {
                    $scope.scomponentslist.push({
                        'component_id': comp.id,
                        'component_name': comp.component
                    }); 
                }               
            }
            else if (checkedStatus == false) {
                $scope.scomponentslist.splice(getIndexNo(comp.component, $scope.scomponentslist), 1);
            }
            startCount++;
        };



        $scope.addSubContractor = function () {
            $scope.contractor.tenant_id = $rootScope.tenant.tenant_id;

            $scope.contractor.current_country = $scope.contractor.current_country;
            $scope.contractor.current_state = $scope.contractor.current_state;
            $scope.contractor.current_city = $scope.contractor.current_city;

            $scope.contractor.created_by = $rootScope.tenant.tenant_id;
            $scope.contractor.modified_by = $rootScope.tenant.tenant_id;

            if ($scope.aggrement_file != null) {
                $scope.contractor.agreement = $scope.aggrement_file.base64;
                $scope.contractor.agreement_file_type = $scope.aggrement_file.filetype;
                $scope.contractor.contractor_agreement_file_name = $scope.aggrement_file.filename;

            }
            if ($scope.photo_file != null) {
                $scope.contractor.contractor_photo = $scope.photo_file.base64;
                $scope.contractor.contractor_photo_file_type = $scope.photo_file.filetype;
                $scope.contractor.contractor_photo_file_name = $scope.photo_file.filename;
            }

            //for (var i = 0; i < $scope.selected.length; i++) {
            //    $scope.scomponentslist.push({
            //        'component_id': $scope.selected[i].id,
            //        'component_name': $scope.selected[i].component
            //    });
            //}
            $scope.contractor.scomponentslist = $scope.scomponentslist;
            if ($scope.newSubContractorForm.$valid) {
                apiService.post('api/SubContractor/SaveSubContractor', $scope.contractor, saveSubContractorSucceess, saveSubContractorFailed);
            }
            else { notificationService.displayError('Please enter mandatory fields'); }
        };
        function saveSubContractorSucceess() {
            notificationService.displaySuccess('SubContractor Details Saved Succefully');
            $scope.showSCForm = false;
            GetSubContractorsList();
            $scope.contractor.current_country = '';
            $scope.contractor.current_state = '';
            $scope.contractor.current_city = '';
            $scope.component_id = '';
            $scope.contractor = {};
            $scope.newSubContractorForm.$setPristine();
            $scope.newSubContractorForm.$setUntouched();
            $scope.scomponentslist = [];
            $scope.selected = [];
        }
        function saveSubContractorFailed() {
            notificationService.displayError('SubContractor Details Saved Failed');
            $scope.scomponentslist = [];
        }


        // hide/show form...
        $scope.showSCForm = false;
        $scope.showAddform = function () {
            if ($scope.showSCForm == false) {
                editModeFlag = false;
                $scope.scomponentslist = [];
                $scope.showSCForm = true;
                $scope.contractor = {};
                $scope.contractor.current_country = '';
                $scope.contractor.current_state = '';
                $scope.contractor.current_city = '';
                $scope.isEditable = true;
                $scope.contractor.agreement = document.getElementById("c_file").value = '';
                if ($scope.photofile) {
                    $scope.photofile = {};
                    $scope.photofile = "Content/images/Common/emp_photo.jpg";
                }
                else {
                    $scope.photofile = "Content/images/Common/emp_photo.jpg";
                }
                $scope.ContractorForm = false;
                $scope.addcon = true;
                $scope.updatecon = false;
                $scope.newSubContractorForm.$setPristine();
                $scope.newSubContractorForm.$setUntouched();

            }
            else {
                $scope.showSCForm = false;
            }

        };

        $scope.downLoadImage = function (data, subcontractorname, filetype) {
            var a = document.createElement('a');
            if (filetype == 'image/jpeg') {
                a.href = 'data:image/jpeg;base64,' + data;
                a.download = subcontractorname + ' agreementForm.jpeg';
                a.click();
            }
            if (filetype == 'application/pdf') {
                a.href = 'data:application/pdf;base64,' + data;
                a.download = subcontractorname + ' agreementForm.pdf';
                a.click();
            }
        }

        $scope.getImage = function (data) {
            return 'data:' + $scope.contractor.contractor_photo_file_type + ';base64,' + data;
        }

        $scope.getimageforedit = function (data) {
            return 'data:' + $scope.contractor.contractor_photo_file_type + ';base64,' + data;
        }

        $scope.subcontractorView = {};
        $scope.subcontractorView = function (subid) {
            apiService.get('api/SubContractor/getSubContractorbyid/' + subid, null, subcontractorViewSucceess, subcontractorViewFailed);
        }
        function subcontractorViewSucceess(response) {
            $scope.contractorDetails = response.data[0];
            //$scope.contractor = response.data[0];
            //$scope.addcon = false;
            //$scope.updatecon = false;
            //$scope.showSCForm = true;
            //$scope.isEditable = false;
            //$scope.contractor.current_zip = parseInt($scope.contractor.current_zip);
            //$scope.photo_file = $scope.getImage($scope.contractor.contractor_photo);
            //if ($scope.photo_file) {
            //    $scope.photofile = $scope.getImage($scope.contractor.contractor_photo);
            //}
            //else {
            //    $scope.photofile = "Content/images/Common/emp_photo.jpg";
            //} 
            //$scope.getCountryStates($scope.contractor.current_country);
            //$scope.getStateCities($scope.contractor.current_state);
        }
        function subcontractorViewFailed() {
            notificationService.displayError('SubContractor details view Failed');
        }

        $scope.EditSubcontractorDetails = function (subcont) {
            $scope.selected = [];
            //var x = '';
            //for (var i = 0; i < $scope.SubComponentsList.length; i++) {
            //    if($scope.SubComponentsList[i].subcontractor_id==subcont.id)
            //    {

            //        if (x != $scope.SubComponentsList[i].component_id) {
            //            $scope.selected.push(
            //                {
            //                    'id': $scope.SubComponentsList[i].component_id,
            //                    'component': $scope.SubComponentsList[i].component_name
            //                });
            //        }
            //        x = $scope.SubComponentsList[i].component_id;

            //    }

            //} 
            //$scope.exists = function (comp, selected) {
            //    return list.indexOf(comp) > -1;
            //};
            $scope.addcon = false;
            $scope.updatecon = true;
            $scope.showSCForm = true;
            $scope.ContractorForm = false;
            $scope.isEditable = true;
            $scope.contractor.id = subcont.id;
            $scope.contractor.tenant_id = $rootScope.tenant.tenant_id;
            $scope.contractor.subcontractor_name = subcont.subcontractor_name;
            $scope.contractor.company_name = subcont.company_name;
            $scope.contractor.reg_No = subcont.reg_No;
            $scope.contractor.current_street = subcont.current_street;
            $scope.contractor.current_zip = parseInt(subcont.current_zip);
            $scope.contractor.current_contact_number = subcont.current_contact_number;
            $scope.contractor.alternative_contactNumber = subcont.alternative_contactNumber;
            $scope.contractor.project_id = subcont.project_id;
            $scope.contractor.service_tax_no = subcont.service_tax_no;
            $scope.contractor.pan = subcont.pan;
            $scope.contractor.bank_account_no = subcont.bank_account_no;
            $scope.contractor.bank_branch = subcont.bank_branch;
            $scope.contractor.ifsc = subcont.ifsc;
            $scope.contractor.bank_name = subcont.bank_name;
            $scope.contractor.email_id = subcont.email_id;
            $scope.contractor.contractor_photo_file_type = subcont.contractor_photo_file_type;
            $scope.photo_file = subcont.contractor_photo;
            if ($scope.photo_file) {
                $scope.photofile = $scope.getimageforedit(subcont.contractor_photo);
            }
            else {
                $scope.photofile = "content/images/common/emp_photo.jpg";
            }
            $scope.contractor.contractor_photo = $scope.photo_file;
            $scope.contractor.current_country = subcont.current_country;
            $scope.contractor.current_state = subcont.current_state;
            $scope.contractor.current_city = subcont.current_city;

            $scope.contractor.created_by = $rootScope.tenant.tenant_id;
            $scope.contractor.modified_by = $rootScope.tenant.tenant_id;
            $scope.contractor.agreement = subcont.agreement;
            $scope.contractor.agreement_file_type = subcont.agreement_file_type;

            $scope.getCountryStates($scope.contractor.current_country);
            $scope.getStateCities($scope.contractor.current_state);

            //binding sc_components...
            $scope.scomponentslist = [];
            editModeFlag = true;    //need to update in 3 places--show/hide form, addremove comp, edit updat funcs
            for (var i = 0; i < $scope.SC_ComponentsList.length; i++) {
                if ($scope.SC_ComponentsList[i].subcontractor_id == subcont.id) {
                    $scope.scomponentslist.push({
                        'component_id': $scope.SC_ComponentsList[i].component_id,
                        'component_name': $scope.SC_ComponentsList[i].component_name
                    });
                }
            }
        };

        //sccomp two-way binding...
        var editModeFlag = false;
        $scope.isSelected = function (comp) {
            for (var i = 0; i < $scope.scomponentslist.length; i++) {
                if ($scope.scomponentslist[i].component_name == comp.component) {
                    return true;
                }
            }
        }

        $scope.updateContractor = function () {
            //for (var i = 0; i < $scope.selected.length; i++) {
            //    $scope.scomponentslist.push({
            //        'component_id': $scope.selected[i].id,
            //        'component_name': $scope.selected[i].component
            //    });
            //}
            $scope.contractor.scomponentslist = $scope.scomponentslist;

            apiService.post('api/SubContractor/UpdateSubContractorsList', $scope.contractor, updatecontractorComplete, updatecontractorFailed);
        };
        function updatecontractorComplete(response) {
            notificationService.displaySuccess("Your Profile Updated Successfully !");
            $scope.showSCForm = false;
            editModeFlag = false;
            GetSubContractorsList();
        }

        function updatecontractorFailed() {
            notificationService.displayError("Profile not updated !");
        }

        $scope.showcity = function (City) {
            var selected = $filter('filter')($scope.CitiesList, { id: City });
            return (City && selected.length) ? selected[0].city_name : 'Not set';
        };

        $scope.showstate = function (State) {
            var selected = $filter('filter')($scope.StatesList, { id: State });
            return (State && selected.length) ? selected[0].state_name : 'Not set';
        };
        $scope.showcountry = function (Country) {
            var selected = $filter('filter')($scope.CountriesList, { id: Country });
            return (Country && selected.length) ? selected[0].country_name : 'Not set';
        };


        $scope.dynamicPopover = {
            content: $scope.contractorDetails,
            templateUrl: 'Scripts/Registration/contractorViewTemplate.html',
            title: 'Subcontractor Details'
        };

        $scope.getProjectName = function (project_id) {
            for (var j = 0; j < $scope.projectslists.length; j++) {
                if ($scope.projectslists[j].id == project_id) {
                    return $scope.projectslists[j].project_name;
                }
            }
        };



        $scope.toggle = function (comp, list) {
            var idx = list.indexOf(comp);
            if (idx > -1) {
                list.splice(idx, 1);
            }
            else {
                list.push(comp);
            }
        };

        $scope.exists = function (comp, list) {
            return list.indexOf(comp) > -1;
        };

        //getting index_no based on value..
        function getIndexNo(value, array) {
            var index = -1;
            var comArr = eval(array);
            for (var i = 0; i < comArr.length; i++) {
                if (comArr[i].component_name === value) {
                    index = i;
                    return index;
                }
            }
        }
    }

})(angular.module('common.core'));
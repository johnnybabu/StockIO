(function (app) {
    'use strict';

    app.controller('laborsCtrl', laborsCtrl);

    laborsCtrl.$inject = ['$scope', 'apiService', 'membershipService', 'notificationService', '$rootScope', '$location', '$filter', '$modal'];

    function laborsCtrl($scope, apiService, membershipService, notificationService, $rootScope, $location, $filter, $modal) {

        $scope.LaboursList = [];
        $scope.CountriesList = [];
        $scope.states = [];
        $scope.cities = [];
        $scope.Refmaster = $rootScope.ReferenceMasterData;
        $scope.labourlogo = '';
        $scope.labour = {};
        $scope.CountriesList = $rootScope.CountriesList;
        $scope.StatesList = $rootScope.StatesList;
        $scope.CitiesList = $rootScope.CitiesList;
        $scope.tenantID = $rootScope.tenant.tenant_id;
        //$scope.projectslists = $rootScope.projectslists
        $scope.projectslists = [];
        $scope.isEditable = true;
        $scope.sublist = [];
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

        loadform();
        function loadform() {
            if ($scope.LaboursList == 0) {
                $scope.showSBForm = true;
            }
            else {
                $scope.showSBForm = false;
            }

        }
        
        $scope.sort = function (keyname) {
            $scope.sortKey = keyname;   //set the sortKey to the param passed
            $scope.reverse = !$scope.reverse; //if true make it false and vice versa
        }

        $scope.showSBForm = false;
        $scope.showAddform = function () {
            if ($scope.showSBForm == false) {
                $scope.labour = {};
                $scope.labourlogo = "Content/images/Common/emp_photo.jpg";
                $scope.readOnlyStatus = false;
                $scope.showSBForm = true;
                $scope.addBtn = true;
                $scope.updateBtn = false;
                $scope.field_readOnlyStatus = false;
                $scope.isEditable = true;


            }
            else { $scope.showSBForm = false; }
        };

        $scope.limitKeypress = function ($event, value, maxLength) {
            if (value !== undefined && value.toString().length >= maxLength) {
                $event.preventDefault();
            }
        }
        LoadProjectsList();
        function LoadProjectsList() {
            apiService.get('api/ProjectMaster/GetProjectsList/' + $rootScope.tenant.tenant_id, null, GetProjectsListLoadComplete, GetProjectsListLoadFailed);
            apiService.get('api/SubContractor/getSubContractorsList/' + $rootScope.tenant.tenant_id, null, SubContractorsListLoadComplete, SubContractorsListLoadFailed);
        }
        function GetProjectsListLoadComplete(response) {
            $scope.projectslists = response.data;
        }
        function GetProjectsListLoadFailed() {
            notificationService.displayError('Fetching GetProjectsList Failed');
        }

        function SubContractorsListLoadComplete(response) {
            $rootScope.SCList = response.data;
        }
        function SubContractorsListLoadFailed() {
            notificationService.displayError('fetching subcontractorslist failed');
        }

        $scope.getsubcont = function (project) {
            $scope.sublist = ($filter('filter')($scope.SCList, { project_id: project }, true));
        }

        $scope.getCountryStates = function (country) {
            $scope.states = ($filter('filter')($scope.StatesList, { country_id: country }, true));
            $scope.cities = [];
        };

        $scope.getStateCities = function (state) {
            $scope.cities = ($filter('filter')($scope.CitiesList, { state_id: state }, true));
        }
        $scope.getCountryStates1 = function (country1) {
            $scope.states1 = ($filter('filter')($scope.StatesList, { country_id: country1 }, true));
            $scope.cities1 = [];
        };

        $scope.getStateCities1 = function (state1) {
            $scope.cities1 = ($filter('filter')($scope.CitiesList, { state_id: state1 }, true));
        }
        $scope.getCountryStates2 = function (country2) {
            $scope.states2 = ($filter('filter')($scope.StatesList, { country_id: country2 }, true));
            $scope.cities2 = [];
        };

        $scope.getStateCities2 = function (state2) {
            $scope.cities2 = ($filter('filter')($scope.CitiesList, { state_id: state2 }, true));
        }


        //Labour image Logo Function
        //$('#l_file').change(function (event) {
        //    $("#imglabourlogo").fadeIn("fast").attr('src', URL.createObjectURL(event.target.files[0]));

        //});
        $('#l_file').change(function (event) {
            var filesSelected = document.getElementById("l_file").files;
            if (filesSelected.length > 0) {
                $scope.filetype = filesSelected[0].type;
                $scope.filename = filesSelected[0].name;
                var fileToLoad = filesSelected[0];
                var fileReader = new FileReader();
                fileReader.onload = function (fileLoadedEvent) {
                    var srcData = fileLoadedEvent.target.result;
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
            $("#imglabourlogo").fadeIn("fast").attr('src', URL.createObjectURL(event.target.files[0]));

        });
        $("#imglabourlogo").click(function () {
            $("#l_file").trigger("click");
        });
        GetLabourImage();
        function GetLabourImage() {
            if ($scope.labourlogo != null && $scope.labourlogo != '') {
                $scope.labourlogo = $scope.getImage($scope.labourlogo);
            }
            else {
                $scope.labourlogo = "Content/images/Common/emp_photo.jpg";
            }
        }

        $scope.SaveLabour = function () {
            if ($scope.labour_photo != null) {
                $scope.labour.labour_filename = $scope.labour_photo.filename;
                $scope.labour.labour_photo = $scope.labour_photo.base64;
                $scope.labour.labour_photo_file_type = $scope.labour_photo.filetype;
            }
            if ($scope.aadharfile != null) {
                $scope.labour.aadhar_filename = $scope.aadharfile.filename;
                $scope.labour.aadhar_encode = $scope.aadharfile.base64;
                $scope.labour.aadhar_encode_file_type = $scope.aadharfile.filetype;
            }
            if ($scope.bankfile != null) {
                $scope.labour.bank_filename = $scope.bankfile.filename;
                $scope.labour.bank_encode = $scope.bankfile.base64;
                $scope.labour.bank_encode_file_type = $scope.bankfile.filetype;
            }
            if ($scope.medicalcertificatefile != null) {
                $scope.labour.medical_filename = $scope.medicalcertificatefile.filename;
                $scope.labour.medical_certificate_encode = $scope.medicalcertificatefile.base64;
                $scope.labour.medical_certificate_encode_file_type = $scope.medicalcertificatefile.filetype;
            }
            if ($scope.eyecertificatefile != null) {
                $scope.labour.eye_certificate_filenmae = $scope.eyecertificatefile.filename;
                $scope.labour.eye_certificate_encode = $scope.eyecertificatefile.base64;
                $scope.labour.eye_certificate_encode_file_type = $scope.eyecertificatefile.filetype;
            }

            $scope.labour.tenant_id = $scope.tenantID;
            //$scope.labour.labour_photo = $scope.labour_photo.base64;
            //$scope.labour.labour_photo_file_type = $scope.labour_photo.filetype;
            //$scope.labour.aadhar_encode = $scope.aadharfile.base64;
            //$scope.labour.aadhar_encode_file_type = $scope.aadharfile.filetype;
            //$scope.labour.bank_encode = $scope.bankfile.base64;
            //$scope.labour.bank_encode_file_type = $scope.bankfile.filetype;
            //$scope.labour.medical_certificate_encode = $scope.medicalcertificatefile.base64;
            //$scope.labour.medical_certificate_encode_file_type = $scope.medicalcertificatefile.filetype;
            //$scope.labour.eye_certificate_encode = $scope.eyecertificatefile.base64;
            //$scope.labour.eye_certificate_encode_file_type = $scope.eyecertificatefile.filetype;
            $scope.labour.created_by = $scope.tenantID;
            $scope.labour.modified_by = $scope.tenantID;

            if ($scope.newLabourEnrollmentForm.$valid) {
                //if (isDuplicateAdhaar == 'Yes') { notificationService.displayError('Adhaar number already exists'); }
                //else {
                apiService.post('api/Labour/SaveLabour', $scope.labour, SaveLabourSucceess, SaveLabourFailed);
                // }
            }
            else { notificationService.displayError('Please enter mandatory fields'); }
        };

        function SaveLabourSucceess() {
            $scope.showSBForm = false;
            notificationService.displaySuccess('Worker saved successfully');
            $scope.labour = '';
            $scope.newLabourEnrollmentForm.$setPristine();
            $scope.newLabourEnrollmentForm.$setUntouched();
            $scope.labour_photo = '';
            $scope.aadharfile = '';
            $scope.bankfile = '';
            $scope.medicalcertificatefile = '';
            $scope.eyecertificatefile = '';
            GetLabourList();
        }
        function SaveLabourFailed() {
            notificationService.displayError('Worker Saved failed');
        }

        GetLabourList();
        function GetLabourList() {
            apiService.get('api/Labour/GetLaboursList/' + $rootScope.tenant.tenant_id, null, LoadLabourSucceess, LoadLabourFailed);
        }
        function LoadLabourSucceess(response) {
            $scope.LaboursList = response.data;
            $scope.labour = '';

            for (var i = 0; i < $scope.Refmaster.length; i++) {
                for (var j = 0; j < $scope.LaboursList.length; j++) {
                    if ($scope.Refmaster[i].id == $scope.LaboursList[j].contact_person_relationship_id) {
                        $scope.LaboursList[j].relation = $scope.Refmaster[i].reference_value;
                    }
                }
            }
            for (var i = 0; i < $scope.SCList.length; i++) {
                for (var j = 0; j < $scope.LaboursList.length; j++) {
                    if ($scope.SCList[i].id == $scope.LaboursList[j].subcontractor_id) {
                        $scope.LaboursList[j].subcontractorname = $scope.SCList[i].subcontractor_name;
                    }
                }
            }
            for (var i = 0; i < $scope.projectslists.length; i++) {
                for (var j = 0; j < $scope.LaboursList.length; j++) {
                    if ($scope.projectslists[i].id == $scope.LaboursList[j].subcontractor_id) {
                        $scope.LaboursList[j].projectname = $scope.projectslists[i].project_name;
                    }
                }
            }
        }
        function LoadLabourFailed() {
            notificationService.displayError('fetching Workers list failed');
        }

        $scope.getImage = function (data) {
            return 'data:' + $scope.labour.labour_photo_file_type + ';base64,' + data;
        }
        //$scope.field_readOnlyStatus = false;
        //$scope.readOnlyStatus = false;
        //$scope.ViewLabour = function (labors) {

        //    $scope.addBtn = false;
        //    $scope.updateBtn = false;
        //    $scope.readOnlyStatus = true;
        //    $scope.field_readOnlyStatus = true;
        //    $scope.showSBForm = true;
        //    $scope.isEditable = false;
        //    $scope.labour = labors;
        //    $scope.labour.age = new Date(labors.age);

        //    $scope.labour.labour_photo_file_type = labors.labour_photo_file_type;
        //    $scope.labour_photo = $scope.getImage(labors.labour_photo);
        //    if ($scope.labour_photo) {
        //        $scope.labourlogo = $scope.getImage(labors.labour_photo);
        //    }
        //    else {
        //        $scope.labourlogo = "Content/images/Common/emp_photo.jpg";
        //    }

        //    $scope.labour.current_contact_number = parseInt(labors.current_contact_number);
        //    $scope.labour.current_zip = parseInt(labors.current_zip);

        //    $scope.labour.permanent_contact_number = parseInt(labors.permanent_contact_number);
        //    $scope.labour.permanent_zip = parseInt(labors.permanent_zip);

        //    $scope.labour.contact_person_contact_number = parseInt(labors.contact_person_contact_number);
        //    $scope.labour.contact_person_zip = parseInt(labors.contact_person_zip);

        //    $scope.labour.bank_account_no = parseInt(labors.bank_account_no);
        //    $scope.labour.aadhar = parseInt(labors.aadhar);

        //    $scope.getCountryStates($scope.labour.current_country);
        //    $scope.getStateCities($scope.labour.current_state);

        //    $scope.getCountryStates2($scope.labour.contact_person_country);
        //    $scope.getStateCities2($scope.labour.contact_person_state);

        //    $scope.getCountryStates1($scope.labour.permanent_country);
        //    $scope.getStateCities1($scope.labour.permanent_state);

        //};





        $scope.addBtn = true;
        $scope.updateBtn = false;
        $scope.field_readOnlyStatus = true;
        $scope.EditLabours = function (labors) {
            $scope.labour = {};
            $scope.addBtn = false;
            $scope.updateBtn = true;
            $scope.readOnlyStatus = false;
            $scope.field_readOnlyStatus = true;
            $scope.showSBForm = true;
            $scope.isEditable = true;
            $scope.labour = labors;
            $scope.labour.created_by = parseInt($scope.tenantID);
            $scope.labour.modified_by = parseInt($scope.tenantID);
            $scope.labour.age = new Date(labors.age);
            $scope.labour.current_contact_number = parseInt(labors.current_contact_number);
            $scope.labour.current_zip = parseInt(labors.current_zip);


            $scope.labour.permanent_contact_number = parseInt(labors.permanent_contact_number);
            $scope.labour.permanent_zip = parseInt(labors.permanent_zip);

            $scope.labour.contact_person_contact_number = parseInt(labors.contact_person_contact_number);
            $scope.labour.contact_person_zip = parseInt(labors.contact_person_zip);

            $scope.labour.bank_account_no = parseInt(labors.bank_account_no);
            $scope.labour.aadhar = parseInt(labors.aadhar);

            $scope.getCountryStates($scope.labour.current_country);
            $scope.getStateCities($scope.labour.current_state);

            $scope.getCountryStates2($scope.labour.contact_person_country);
            $scope.getStateCities2($scope.labour.contact_person_state);

            $scope.getCountryStates1($scope.labour.permanent_country);
            $scope.getStateCities1($scope.labour.permanent_state);
        };

        $scope.updateLabour = function () {
            if ($scope.labour_photo != null) {
                $scope.labour.labour_photo = $scope.labour_photo.base64;
                $scope.labour.labour_photo_file_type = $scope.labour_photo.filetype;
            }
            if ($scope.aadharfile != null) {
                $scope.labour.aadhar_encode = $scope.aadharfile.base64;
                $scope.labour.aadhar_encode_file_type = $scope.aadharfile.filetype;
            }
            if ($scope.bankfile != null) {
                $scope.labour.bank_encode = $scope.bankfile.base64;
                $scope.labour.bank_encode_file_type = $scope.bankfile.filetype;
            }
            if ($scope.medicalcertificatefile != null) {
                $scope.labour.medical_certificate_encode = $scope.medicalcertificatefile.base64;
                $scope.labour.medical_certificate_encode_file_type = $scope.medicalcertificatefile.filetype;
            }
            if ($scope.eyecertificatefile != null) {
                $scope.labour.eye_certificate_encode = $scope.eyecertificatefile.base64;
                $scope.labour.eye_certificate_encode_file_type = $scope.eyecertificatefile.filetype;
            }
            $scope.labour.created_by = $scope.tenantID;
            $scope.labour.modified_by = $scope.tenantID;
            //if (isDuplicateAdhaar == 'Yes') { notificationService.displayError('Adhaar number already exists'); }
            //else {

            apiService.post('api/Labour/UpdateLabour', $scope.labour, updateLabourSucceess, updateLabourFailed);
            //}            
        };
        function updateLabourSucceess() {
            notificationService.displaySuccess("Labour Updated Successfully");
            $scope.labour = {};
            $scope.newLabourEnrollmentForm.$setPristine();
            $scope.newLabourEnrollmentForm.$setUntouched();
            $scope.labourlogo = '';
            $scope.showSBForm = false;
            $scope.addBtn = true;
            $scope.updateBtn = false;
            GetLabourList();
        }
        function updateLabourFailed() {
            notificationService.displayError("Updating Labour failed");
        }
        /////checking duplicates//////


        //var isDuplicateAdhaar = '';
        //$scope.checkaadhar = function () {
        //    for (var i = 0; i < $scope.LaboursList.length; i++) {
        //        if ($scope.LaboursList[i].aadhar == $scope.labour.aadhar) {
        //            notificationService.displayError("aadhar nmbr already exists please enter another");
        //            //isDuplicateAdhaar = 'Yes';
        //            $scope.labour.aadhar = '';
        //            document.getElementById('aaadhar').focus();
        //        } else { isDuplicateAdhaar = ''; }
        //    }
        //};


        ///checking duplicates//////


        $scope.checkprop = function () {
            if ($scope.labour_samecurrent == true) {
                $scope.labour.permanent_street = $scope.labour.current_street;
                $scope.labour.permanent_country = $scope.labour.current_country;

                $scope.getCountryStates1($scope.labour.permanent_country);
                $scope.labour.permanent_state = $scope.labour.current_state;
                $scope.getStateCities1($scope.labour.permanent_state);
                $scope.labour.permanent_city = $scope.labour.current_city;



                $scope.labour.permanent_zip = $scope.labour.current_zip;
                $scope.labour.permanent_contact_number = $scope.labour.current_contact_number;



            }
        }

        /////mouse hover/////
        $scope.showlabourDetails = function (labors) {
            var modalInstance = $modal.open({
                templateUrl: 'Scripts/Registration/labourviewdetails.html',
                controller: 'labourviewdetailsCtrl',
                resolve: {
                    labors: function () { return labors },
                }
            });
        }
        /////mouse hover////

    }
})(angular.module('common.core'));
(function (app) {
    app.controller('tenantCtrl', tenantCtrl);

    tenantCtrl.$inject = ['$scope', '$location', '$rootScope', 'apiService', 'notificationService', '$modal', '$filter']
    function tenantCtrl($scope, $location, $rootScope, apiService, notificationService, $modal, $filter) {
        $scope.tenant = {};
        $scope.country = {};
        $scope.state = {};
        $scope.city = {};
        $scope.finmonth = {};
        $scope.tenantlogo = "";
        $scope.tenantlogofiletype = "";
        $scope.tenantlogoencoded = "";
        $scope.CountriesList = [];
        $scope.StatesList = [];
        $scope.states = [];
        $scope.CitiesList = [];
        $scope.Cities = [];

        tenantid = $rootScope.tenant.tenant_id;

        $('#s_file').change(function (event) {
            $("#imgtenantlogo").fadeIn("fast").attr('src', URL.createObjectURL(event.target.files[0]));

        });

        $scope.getCountryStates = function (countryid) {
            $scope.states = ($filter('filter')($scope.StatesList, { country_id: countryid }, true));
            $scope.cities = [];
        };

        $scope.getStateCities = function (stateid) {
            $scope.cities = ($filter('filter')($scope.CitiesList, { state_id: stateid }, true));
        }

        function getStates(countryid) {
            $scope.states = ($filter('filter')($scope.StatesList, { country_id: countryid }, true));
            $scope.cities = [];
        };

        //function getCities(stateid) {
        //    $scope.cities = ($filter('filter')($scope.CitiesList, { state_id: stateid }, true));
        //}

        $scope.limitKeypress = function ($event, value, maxLength) {
            if (value != undefined && value.toString().length >= maxLength) {
                $event.preventDefault();
            }
        }

        $(document).ready(function () {
            $('#tenantName').keyup(function () {
                $(this).val($(this).val().toUpperCase());
            });

            $('#domain').keyup(function () {
                $(this).val($(this).val().toLowerCase());
            });

            $('#pan').keyup(function () {
                $(this).val($(this).val().toUpperCase());
            });

            $('#tin').keyup(function () {
                $(this).val($(this).val().toUpperCase());
            });

            $('#vat').keyup(function () {
                $(this).val($(this).val().toUpperCase());
            });

            $('#companyEmail').keyup(function () {
                $(this).val($(this).val().toLowerCase());
            });

            $('#ifsc').keyup(function () {
                $(this).val($(this).val().toUpperCase());
            });

            $('#bankname').keyup(function () {
                $(this).val($(this).val().toUpperCase());
            });
        });

        $scope.months = [
            { id: 1, name: 'JANUARY' },
            { id: 2, name: 'FEBRUARY' },
            { id: 3, name: 'MARCH' },
            { id: 4, name: 'APRIL' },
            { id: 5, name: 'MAY' },
            { id: 6, name: 'JUNE' },
            { id: 7, name: 'JULY' },
            { id: 8, name: 'AUGUST' },
            { id: 9, name: 'SEPTEMBER' },
            { id: 10, name: 'OCTOBER' },
            { id: 11, name: 'NOVEMBER' },
            { id: 12, name: 'DECEMBER' }
        ]

        function GetTenantComplete(response) {
            $scope.tenant = response.data[0];
            $scope.country = $scope.tenant.country;
            $scope.states = ($filter('filter')($scope.StatesList, { country_id: $scope.tenant.country }, true));
            $scope.state.id = $scope.tenant.state;
            $scope.city.id = $scope.tenant.city;
            if ($scope.tenant.logo) {
                $scope.tenantlogo = $scope.getImage($scope.tenant.logo);
            }
            else {
                $scope.tenantlogo = "Content/images/Common/emp_photo.jpg";
            }
             
            $scope.finmonth = $scope.tenant.finance_start_month;
        }

        function GetTenantFailed() {
            notificationService.displayError("Tenant not Found !");
        }

        $scope.UpdateTenantProfile = function () {
            $scope.tenant.city = $scope.city;
            $scope.tenant.state = $scope.state;
            $scope.tenant.country = $scope.country;
            $scope.tenant.finance_start_month = $scope.finmonth;
            $scope.tenant.modified_by = $rootScope.user_id;
            $scope.tenant.logo = $scope.tenantlogoencoded;
            $scope.tenant.logo_image_type = $scope.tenantlogofiletype;
            apiService.post('api/Tenant/UpdateTenant', $scope.tenant, UpdateTenantComplete, UpdateTenantFailed);
        }

        function UpdateTenantComplete(response) {
            notificationService.displaySuccess("Your Profile Updated Successfully !");
            $rootScope.tenant.tenantlogo = $scope.tenant.logo;
            $rootScope.tenant.tenantlogofiletype = $scope.tenant.logo_image_type;
        }

        function UpdateTenantFailed() {
            notificationService.displayError("Profile not updated !");
        }

        LoadMaster();
        function LoadMaster() {
            apiService.get('api/MasterData/GetCountryList', null, GetCountriesListComplete, GetCountriesListFailed);
            apiService.get('api/MasterData/GetStateList', null, GetStatesListComplete, GetStatesListFailed);
            apiService.get('api/MasterData/GetCityList', null, GetCitiesListComplete, GetCitiesListFailed);
            apiService.get('api/Tenant/GetTenant/' + tenantid, null, GetTenantComplete, GetTenantFailed);
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
                

        $("#imgtenantlogo").click(function () {
            $("#s_file").trigger("click");
        });

        $scope.getImage = function (data) {
            return 'data:' + $scope.tenant.logo_image_type + ';base64,' + data;
        }

        $scope.encodeImageFileAsURL = encodeImageFileAsURL;
        function encodeImageFileAsURL() {
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
        }
    }

      
})(angular.module('common.core'));
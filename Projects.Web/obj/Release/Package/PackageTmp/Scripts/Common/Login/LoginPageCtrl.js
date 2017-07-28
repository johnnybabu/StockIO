(function (app) {
    'use strict';

    app.controller('LoginPageCtrl', LoginPageCtrl);

    LoginPageCtrl.$inject = ['$scope', 'apiService', 'membershipService', 'notificationService', '$rootScope', '$location'];

    function LoginPageCtrl($scope, apiService, membershipService, notificationService, $rootScope, $location) {

        $scope.pageClass = 'page-login';
        $scope.user = {};
        $scope.msg = '';
        $rootScope.MenuList = [];
        $scope.tenant_key = chance.fbid();
        $scope.logintrack = {};

        $(document).ready(function () {
            $("#rotate").click(function () {
                $(".flip3D").toggleClass("rotated");
            });

            //$('#companyname').keyup(function () {
            //    $(this).val($(this).val().toUpperCase());
            //});

            //$('#owner').keyup(function () {
            //    $(this).val($(this).val().toUpperCase());
            //});

            $('#email').keyup(function () {
                $(this).val($(this).val().toLowerCase());
            });
        });

        $(".register").click(function () {
            $(this).text(function (i, v) {
                return v === 'Register' ? 'Login' : 'Register'
            })
            $(".lblregister").text(function (i, v) {
                return v === 'Not yet registered?' ? 'Already registered?' : 'Not yet registered?'
            })
        });

        $(function () {

            $.support.css3d = supportsCSS3D();
            var formContainer = $('#formContainer');

            $('.flipLink').click(function (e) {

                formContainer.toggleClass('flipped');

                if (!$.support.css3d) {
                    $('#login').toggle();
                }
                e.preventDefault();
            });

            formContainer.find('form').submit(function (e) {
                e.preventDefault();
            });

            function supportsCSS3D() {
                var props = [
                    'perspectiveProperty', 'WebkitPerspective', 'MozPerspective'
                ], testDom = document.createElement('a');

                for (var i = 0; i < props.length; i++) {
                    if (props[i] in testDom.style) {
                        return true;
                    }
                }

                return false;
            }
        });

        $scope.Login = function () {
            membershipService.login($scope.user, loginCompleted)
        }

        function loginCompleted(result) {
            if (result.data.success) {

                membershipService.saveCredentials($scope.user);

                $rootScope.tenant = {
                    'user_id': result.data.user_id,
                    'userid': $scope.userid,
                    'username': result.data.username,
                    'user_image': '',
                    'role_id': result.data.roleid,
                    'tenant_id': result.data.tenantid,
                    'tenantkey': result.data.tenantkey,
                    'tenantemail': result.data.tenantemail,
                    'tenantlogo': result.data.tenantlogo,
                    'tenantlogofiletype': result.data.tenantlogoimagetype
                };

                if (result.data.is_tenant) {
                    $rootScope.user = {
                        'is_tenant': result.data.is_tenant,
                        'profileURL': "/Tenant"
                    }
                }
                else {
                    $rootScope.user = {
                        'is_tenant': result.data.is_tenant,
                        'profileURL': "/MyProfile"
                    }
                }

                GetMenuList();

                apiService.get('api/MasterData/GetReferenceMasterData/0', null, RefMasterLoadComplete, RefMasterLoadFailed); //Getting data from ReferenceMaster

                $scope.logintrack.user_id = $rootScope.user_id;
                apiService.post('api/LoginTrack/TrackLogin', $scope.logintrack, trackComplete, null); //Tracking Login

                function trackComplete(response) {

                }

                $scope.userData.displayUserInfo();

                $location.url("/Dashboard");

                //if ($rootScope.previousState) {
                //    $location.path($rootScope.previousState);
                //    $location.url("/Index");
                //}
                //else
                //    $location.path('/');
                LoadMaster();
            }
            else {
                $scope.msg = 'Invalid UserID or Password.';
                notificationService.displayError('Login failed. Please try again.');
            }

            LoadProjectsList();
        }

        function RefMasterLoadComplete(response) {
            $rootScope.ReferenceMasterData = response.data;
        }

        function RefMasterLoadFailed(response) {
            notificationService.displayError("Unable to Get Reference Master Data");
        }

        //LoadProjectsList();
        //function LoadProjectsList() {
        //    apiService.get('api/ProjectMaster/GetProjectsList', null, GetProjectsListLoadComplete, GetProjectsListLoadFailed);
        //}
        //function GetProjectsListLoadComplete(response) {
        //    $rootScope.projectslists = response.data; 
        //}
        //function GetProjectsListLoadFailed() {
        //    notificationService.displayError('Fetching GetProjectsList Failed');
        //}
        
        function LoadMaster() {
            apiService.get('api/MasterData/GetCountryList', null, GetCountriesListComplete, GetCountriesListFailed);
            apiService.get('api/MasterData/GetStateList', null, GetStatesListComplete, GetStatesListFailed);
            apiService.get('api/MasterData/GetCityList', null, GetCitiesListComplete, GetCitiesListFailed);
            apiService.get('api/products/GetProductsList/' + $rootScope.tenant.tenant_id, null, GetProductListComplete, GetProductListFailed);
        }
        function GetCountriesListComplete(response) {
            $rootScope.CountriesList = response.data;
        }
        function GetCountriesListFailed(response) {
            notificationService.displayError("Countries could not be loaded !");
        }

        function GetStatesListComplete(response) {
            $rootScope.StatesList = response.data;
        }
        function GetStatesListFailed(response) {
            notificationService.displayError("States could not be loaded !");
        }

        function GetCitiesListComplete(response) {
            $rootScope.CitiesList = response.data;
        }
        function GetCitiesListFailed(response) {
            notificationService.displayError("Cities could not be loaded !");
        }
        function GetProductListComplete(response) {
            $rootScope.productsList = response.data;
        }
        function GetProductListFailed() {
            notificationService.displayError('unable to get Products List');
        }

        $scope.RegisterTenant = function () {
            $scope.tenant.tenant_key = $scope.tenant_key;
            $scope.tenant.tenant_type = 1;
            $scope.tenant.IsLocked = false;
            $scope.tenant.created_by = 1;
            $scope.tenant.modified_by = 1;
            apiService.post('api/Tenant/CreateTenant', $scope.tenant, TenantCreateComplete, TenantCreateFailed);
        }

        function TenantCreateComplete() {
            notificationService.displaySuccess("Registration Success!!!");
        }

        function TenantCreateFailed() {
            notificationService.displayError("Registration Failed. Please try again!!!");
        }

        function GetMenuList() {
            apiService.get('api/MenuAccess/GetMenuList/' + $rootScope.tenant.user_id, null, GetMenuListComplete, null);
        }

        function GetMenuListComplete(response) {
            $rootScope.MenuList = response.data;
        }                
    }
})(angular.module('common.core'));
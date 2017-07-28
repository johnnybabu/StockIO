(function () {
    'use strict';
    /// 
    angular.module('Projects', ['common.core', 'common.ui', 'isteven-multi-select', 'xeditable', 'ngSanitize', 'ngMaterial', 'ngMessages', 'ngMask', 'naif.base64', 'angularUtils.directives.dirPagination', 'ui.grid', 'ui.filters']).config(config);

    function config($routeProvider, $locationProvider) {

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });

        //$mdIconProvider.defaultIconSet('Content/fonts/mdi.svg');

        $routeProvider
            .when("/", {
                templateUrl: "Scripts/Common/Login/LoginPage.html", controller: "LoginPageCtrl"
            })

            .when("/Index", {
                templateUrl: "Scripts/Common/Login/index.html", controller: "indexCtrl"
            })

            .when("/Users", {
                templateUrl: "Scripts/Common/Login/register_user.html", controller: "register_userCtrl"
            })

            .when("/UserAccess", {
                templateUrl: "Scripts/SuperAdmin/usermenuaccess.html", controller: "usermenuaccessCtrl"
            })

            .when("/Tenant", {
                templateUrl: "Scripts/Tenant/tenant.html", controller: "tenantCtrl"
            })

            .when("/MyProfile", {
                templateUrl: "Scripts/Common/Profile/myprofile.html", controller: "myprofileCtrl"
            })

            .when("/Tenants", {
                templateUrl: "Scripts/SuperAdmin/tenants.html", controller: "tenantsCtrl"
            })

            .when("/ErrorLog", {
                templateUrl: "Scripts/Common/Error/ErrorLog.html", controller: "ErrorLogCtrl"
            })

            .when("/LoginLog", {
                templateUrl: "Scripts/SuperAdmin/loginlog.html", controller: "loginlogCtrl"
            })

            .when("/RefMaster", {
                templateUrl: "Scripts/SuperAdmin/refmaster.html", controller: "refmasterCtrl"
            })

            .when("/Company", {
                templateUrl: "Scripts/Company/register_company.html", controller: "register_companyCtrl"
            })

            .when("/Representative", {
                templateUrl: "Scripts/Representative/add_representative.html", controller: "add_representativeCtrl"
            })

            .when("/Customer", {
                templateUrl: "Scripts/Customer/add_customer.html", controller: "add_customerCtrl"
            })

            .when("/Invoice", {
                templateUrl: "Scripts/Customer/invoice.html", controller: "invoiceCtrl"
            })

            .when("/Product", {
                templateUrl: "Scripts/Product/products.html", controller: "productsCtrl"
            })

            .when("/PurchaseOrder", {
                templateUrl: "Scripts/PurchaseOrder/po.html", controller: "poCtrl"
            })

            .when("/CreateUser", {
                templateUrl: "Scripts/Admin/createuser.html", controller: "createuserCtrl"
            })
                    
            .when("/Settings", {
                templateUrl: "Scripts/Master/settings.html", controller: "settingsCtrl"
            })

            .when("/CompanyDetails", {
                templateUrl: "Scripts/Master/companydetails.html", controller: "companydetailsCtrl"
            })

            .when("/ProductDetails", {
                templateUrl: "Scripts/Master/productdetails.html", controller: "productdetailsCtrl"
            })
            .when("/Dashboard", {
                templateUrl: "Scripts/Dashboard/dashboard.html", controller: "dashboardCtrl"
            })
            .when("/SampleReports", {
                templateUrl: "Scripts/Dashboard/sampleReports.html", controller: "sampleReportsCtrl"
            })     
            .when("/AddStock", {
                templateUrl: "Scripts/StockIn/addstock.html", controller: "addstockCtrl"
            })     
            .when("/RateChart", {
                templateUrl: "Scripts/StockIn/ratechart.html", controller: "ratechartCtrl"
            })     
            
            .otherwise({ redirectTo: "/" });

    }

    run.$inject = ['$rootScope', '$location', '$cookieStore', '$http'];

    function run($rootScope, $location, $cookieStore, $http) {
        // handle page refreshes
        $rootScope.repository = $cookieStore.get('repository') || {};

        if ($rootScope.repository.loggedUser) {
            $http.defaults.headers.common['Authorization'] = $rootScope.repository.loggedUser.authdata;
        }

        $(document).ready(function () {
            $(".fancybox").fancybox({
                openEffect: 'none',
                closeEffect: 'none'
            });

            $('.fancybox-media').fancybox({
                openEffect: 'none',
                closeEffect: 'none',
                helpers: {
                    media: {}
                }
            });

            $('[data-toggle=offcanvas]').click(function () {
                $('.row-offcanvas').toggleClass('active');
            });
        });
    }

    isAuthenticated.$inject = ['membershipService', '$rootScope', '$location'];

    function isAuthenticated(membershipService, $rootScope, $location) {
        if (!membershipService.isUserLoggedIn()) {
            $rootScope.previousState = $location.path();
            $location.path('/');
        }
    }



})();

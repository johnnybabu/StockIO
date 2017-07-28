(function (app) {
    'use strict';

    app.controller('usermenuaccessCtrl', usermenuaccessCtrl);

    usermenuaccessCtrl.$inject = ['$scope', '$filter', 'apiService', 'membershipService', 'notificationService', '$rootScope', '$location'];

    function usermenuaccessCtrl($scope, $filter, apiService, membershipService, notificationService, $rootScope, $location) {

        $scope.MenuList = $rootScope.MenuList;
        $scope.TenantMenuList = $rootScope.MenuList;
        $scope.AllMenuAccessList = [];
        $scope.userMenuAccessList = [];
        $scope.myUsers = [];
        $scope.rolesList = [];
        $scope.userAccessList = [];
        $scope.toggle = true;
        $scope.newUser = {};
        $scope.newUser.mail2tenant = true;
        $scope.newUser.mail2user = false;

        $scope.pageClass = 'page-login';
        $scope.registerNewUser = registerNewUser;

        $scope.user = {};
        $scope.DeleteUserList = DeleteUserList;

        GetRolesList();
        function GetRolesList() {
            apiService.get('api/account/getroles', null, RolesLoadComplete, RolesLoadFailed);
        }

        function RolesLoadComplete(response) {
            $scope.rolesList = response.data;
        }

        function RolesLoadFailed(response) {
            notificationService.displayError(response.data);
        }

        BindUsersGrid();
        function BindUsersGrid() {
            apiService.get('api/account/GetMyUsers/' + $rootScope.tenant.tenant_id, null, UsersLoadComplete, UsersLoadFailed);
        }

        function DeleteUserList(u) {
            membershipService.deleteuser(u.userID, deleteCompleted);
        }

        function UsersLoadComplete(response) {
            $scope.myUsers = response.data;
        }

        function UsersLoadFailed(response) {
            notificationService.displayError(response.data);
        }

        function registerNewUser() {
            $scope.newUser.tenant_id = $rootScope.tenant.tenant_id;
            $scope.newUser.is_tenant = false;
            $scope.newUser.password = $scope.newUser.pwd;
            $scope.newUser.Roleid = $scope.roles.id;

            if ($scope.newUserForm.$valid) {
                membershipService.register($scope.newUser, registerCompleted)
            }
            else { notificationService.displayError('Please fill mandatory fields'); }
        }

        function registerCompleted(result) {
            if (result.data.success) {
                BindUsersGrid();
                notificationService.displaySuccess($scope.newUser.userid + ' is Registered successfully!');
                $scope.newUser = {};
                $scope.roles = '';
                $scope.newUserForm.$setPristine();
                $scope.newUserForm.$setUntouched();

                $scope.showEmpList = true;
                $scope.showUserRegForm = false;
            }
            else {
                notificationService.displayError('Registration failed. Try again.');
            }
        }

        GetUserAccessList();
        function GetUserAccessList() {
            apiService.get('api/MenuAccess/GetMenuForAccess/' + $rootScope.tenant.tenant_id, null, GetMenuForAccessComplete, null);
        }

        function GetMenuForAccessComplete(response) {
            $scope.MenuForAccessList = response.data;
        }

        GetAllUsersMenuAccessList();
        function GetAllUsersMenuAccessList() {
            apiService.get('api/MenuAccess/GetMenuForAccess/' + $rootScope.tenant.user_id, null, GetAllUsersMenuAccessListComplete, null);
        }

        function GetAllUsersMenuAccessListComplete(response) {
            $scope.AllMenuAccessList = response.data;
        }


        $scope.updateUser = function (data, id) {
            angular.extend(data, { id: id });
            $scope.user.id = data.id;
            $scope.user.userid = data.user_id;
            $scope.user.user_name = data.mUserName;
            $scope.user.email = data.mEmail;
            $scope.user.Role_id = data.mRole;

            apiService.post('api/account/UpdateUser', $scope.user, UpdateUserComplete, UpdateUSerFailed);

        };

        function UpdateUserComplete() {
            notificationService.displaySuccess('User updated successfully.');
            BindUsersGrid();
        }

        function UpdateUSerFailed() {
            notificationService.displayError('User Update Failed !');
        }

        $scope.showRole = function (roleid) {
            var selected = $filter('filter')($scope.rolesList, { id: roleid });
            return (roleid && selected.length) ? selected[0].Name : 'Not set';
        };

        $scope.LoadUserMenuAccess = function (userid) {
            GetAllUsersMenuAccessList();
            $scope.userMenuAccessList = $filter('filter')($scope.AllMenuAccessList, { userid: userid });
            for (var j = 0; j < $scope.TenantMenuList.length; j++) {
                $scope.TenantMenuList[j].is_access = false;
            }

            for (var i = 0; i < $scope.userMenuAccessList.length; i++) {
                for (var j = 0; j < $scope.TenantMenuList.length; j++) {
                    if ($scope.userMenuAccessList[i].menu_id == $scope.TenantMenuList[j].id) {
                        $scope.TenantMenuList[j].is_access = $scope.userMenuAccessList[i].is_access;
                    }
                }
            }
        }

        $scope.SaveMenuAccess = function () {
            $scope.userAccessList = [];

            for (var i = 0; i < $scope.TenantMenuList.length; i++) {
                if ($scope.TenantMenuList[i].is_access == true) {
                    $scope.userAccessList.push({
                        'user_id': $scope.userSelected.id,
                        'tenant_id': $rootScope.tenant.tenant_id,
                        'menu_id': $scope.TenantMenuList[i].id,
                        'is_active': true
                    });
                }
            }

            apiService.post('api/MenuAccess/SaveMenuAccess', $scope.userAccessList, MenuAccessComplete, MenuAccessFailed);
        }

        function MenuAccessComplete() {
            notificationService.displaySuccess('Access Given successfully.');
        }

        function MenuAccessFailed() {
            notificationService.displayError('Could not save the User Access!');
        }

        $scope.$watch('toggle', function () {
            $scope.toggleText = $scope.toggle ? 'Add New User' : 'Hide User Form';
        })

        $scope.showEmpList = true;
        $scope.showUserRegForm = false;
        GetEmployeesList();
        function GetEmployeesList() {
            apiService.get('api/MenuAccess/GetEmployeesList', null, GetEmployeesListSuccess, GetEmployeesListFailed);
        }

        function GetEmployeesListSuccess(response) {
            $scope.EmployeesList = response.data;
        }
        function GetEmployeesListFailed() {
            notificationService.displayError('Unable to get employees list');
        }

        $scope.CreateUser = function (emp) {
            $scope.showEmpList = false;
            $scope.showUserRegForm = true;
            $scope.newUser.username = emp.UserName;
        };

        $scope.hideUserForm = function () {
            $scope.newUser = {};
            $scope.roles = '';
            $scope.newUserForm.$setPristine();
            $scope.newUserForm.$setUntouched();

            $scope.showEmpList = true;
            $scope.showUserRegForm = false;
        }
    }
})(angular.module('common.core'));
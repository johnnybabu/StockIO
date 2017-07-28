(function (app) {
    'use strict';

    app.controller('createIndentCtrl', createIndentCtrl);

    createIndentCtrl.$inject = ['$scope', 'apiService', 'membershipService', 'notificationService', '$rootScope', '$location'];

    function createIndentCtrl($scope, apiService, membershipService, notificationService, $rootScope, $location) {

        $scope.material = {};
        $scope.indentdetails = [];
        $scope.Refmaster = $rootScope.ReferenceMasterData;
        $scope.SCList = $rootScope.SCMasterList;
        $scope.GetIndentList = [];
        $scope.showdiv = false;

        $scope.showIndentForm = false;
        $scope.showAddIndentform = function () {
            if ($scope.showIndentForm == false)
            { $scope.showIndentForm = true; }
            else { $scope.showIndentForm = false; }
        };
        $scope.indent = {};
        $scope.indentlist = {};

        loadform();
        function loadform() {
            if ($scope.vehicleslists == 0) {
                $scope.showIndentForm = true;
            }
            else {
                $scope.showIndentForm = false;
            }

        }

        GetProjectMasterList();
        function GetProjectMasterList() {
            apiService.get('api/indent/GetProjectMasterList/' + $rootScope.tenant.tenant_id, null, GetProjectMasterListLoadComplete, GetProjectMasterListFailed);
            //apiService.get('api/SubContractor/getSubContractorsList', null, SubContractorsListLoadComplete, SubContractorsListLoadFailed);
        }
        function GetProjectMasterListLoadComplete(response) {
            $scope.projectslists = response.data;
        }
        function GetProjectMasterListFailed() {
            notificationService.displayError('fetching GetProject MasterList failed');
        }

        //function SubContractorsListLoadComplete(response) {
        //    $rootScope.SCMasterList = response.data;
        //}
        //function SubContractorsListLoadFailed() {
        //    notificationService.displayError('fetching subcontractorslist failed');
        //}


        GetSubContractorsList();
        function GetSubContractorsList() {
            apiService.get('api/SubContractor/getSubContractorsList/' + $rootScope.tenant.tenant_id, null, SubContractorsListLoadComplete, SubContractorsListLoadFailed);
        }
        function SubContractorsListLoadComplete(response) {
            $scope.SubContractorsList = response.data;
        }
        function SubContractorsListLoadFailed() {
            notificationService.displayError('Fetching Subcontractorslist Failed');
        }

        $scope.rows = {
            items: [{}]
        };
        $scope.addRow = function () {
            $scope.rows.items.push({
                //material_name: '',
                //material_description: '',
                //quantity: '',
                //unit_of_measurement: '',
                //material_price: '',
                //total_price:''
            });
        }
        $scope.removeItem = function (m) {
            $scope.rows.items.splice($scope.rows.items.indexOf(m), 1);
        }
        $scope.indentdetails = [];
        $scope.SaveIndent = function () {
            $scope.rowItems = $scope.rows.items;
            $scope.indentlist = {
                'tenant_id': $rootScope.tenant.tenant_id,
                'project_id': $scope.indent.project_id,
                'indent_no': $scope.indent.indent_no,
                'SubContractor_id': $scope.indent.SubContractor_id,
                'authorized_by': $scope.indent.authorized_by,
                'recieved_by': $scope.indent.recieved_by,
                'recieved_from': $scope.indent.recieved_from,
                'date_recieved': $scope.indent.date_recieved,
                'date_required': $scope.indent.date_required,
                //'indent_encode': $scope.indentfile.base64,
                //'indent_encode_file_type': $scope.indentfile.filetype,
                'indentdetails': $scope.indentdetails,
            }
            for (var i = 0; i < $scope.rowItems.length; i++) {
                if ($scope.rowItems[0].material_name == 'undefined' || $scope.rowItems[0].material_name == null || $scope.rowItems[0].material_description == 'undefined' || $scope.rowItems[0].material_description == null || $scope.rowItems[0].quantity == 'undefined' || $scope.rowItems[0].quantity == null || $scope.rowItems[0].unit_of_measurement == 'undefined' || $scope.rowItems[0].unit_of_measurement == null || $scope.rowItems[0].material_price == 'undefined' || $scope.rowItems[0].material_price == null || $scope.indentdetails == 'undefined' || $scope.indentdetails == null) {
                    notificationService.displayError("please enter the material");
                }
                else {
                    $scope.indentdetails.push({
                        'tenant_id': $rootScope.tenant.tenant_id,
                        'indent_no': $scope.indent.indent_no,
                        'material_name': $scope.rowItems[i].material_name,
                        'material_description': $scope.rowItems[i].material_description,
                        'quantity': $scope.rowItems[i].quantity,
                        'unit_of_measurement': $scope.rowItems[i].unit_of_measurement,
                        'material_price': $scope.rowItems[i].material_price,
                        'total_price': ($scope.rowItems[i].quantity * $scope.rowItems[i].material_price),
                        'given_quantity':0,
                        'material_released_status': false,
                        'released_material_Cost': 0,
                        'material_released_date': '01-01-2017',
                    });
                }

            }
            if ($scope.indentfile != null) {
                $scope.indentlist.indent_encode = $scope.indentfile.base64;
                $scope.indentlist.indent_encode_file_type = $scope.indentfile.filetype;
            }
            //    if ($scope.indentlist) {

            if ($scope.newIndentForm.$valid) {
                if ($scope.rowItems[0].material_name == 'undefined' || $scope.rowItems[0].material_name == null || $scope.rowItems[0].material_description == 'undefined' || $scope.rowItems[0].material_description == null || $scope.rowItems[0].quantity == 'undefined' || $scope.rowItems[0].quantity == null || $scope.rowItems[0].unit_of_measurement == 'undefined' || $scope.rowItems[0].unit_of_measurement == null || $scope.rowItems[0].material_price == 'undefined' || $scope.rowItems[0].material_price == null || $scope.indentdetails == 'undefined' || $scope.indentdetails == null) {
                    notificationService.displayError('Please enter material');
                }
                else {
                    apiService.post('api/indent/SaveIndent', $scope.indentlist, SaveIndentSucceess, SaveIndentFailed);
                }
            }
            else {
                notificationService.displayError('please enter mandatory fileds');
            }
        };

        function SaveIndentSucceess(response) {
            $scope.showIndentForm = false;
            notificationService.displaySuccess('Indent saved successfully');
            $scope.indent.indent_no = '';
            $scope.indent.project_id = '';
            $scope.indent.SubContractor_id = '';
            $scope.indent.authorized_by = '';
            $scope.indent.recieved_by = '';
            $scope.indent.date_required = '';
            $scope.indent.date_recieved = '';
            $scope.indent.recieved_from = '';
            $scope.indentfile = '';
            $scope.newIndentForm.$setPristine();
            $scope.newIndentForm.$setUntouched();
            $scope.rows = { items: [{}] };
            $scope.indentdetails = [];;
            $scope.indentlist = [];
            GetIndent();
            GetIndentdetails();

        }
        function SaveIndentFailed() {
            notificationService.displayError('Indent Saved failed');
        }


        //GetIndent();
        //function GetIndent() {
        //    apiService.get('api/indent/GetIndent', null, GetIndentLoadComplete, GetIndentFailed);
        //}
        $scope.getIndentsByProjId = function (project_id) {
            apiService.get('api/indent/GetIndentByProjId/' + project_id, null, GetIndentLoadComplete, GetIndentFailed);
            $scope.showdiv = true;
        };
        function GetIndentLoadComplete(response) {
            $scope.GetIndentlist = response.data;
            for (var i = 0; i < $scope.SCList.length; i++) {
                for (var j = 0; j < $scope.GetIndentlist.length; j++) {
                    if ($scope.SCList[i].id == $scope.GetIndentlist[j].SubContractor_id) {
                        $scope.GetIndentlist[j].SubContractor_id = $scope.SCList[i].subcontractor_name;
                    }
                }
            }
            $scope.totalItems = $scope.GetIndentlist.length;
        }
        function GetIndentFailed() {
            notificationService.displayError('fetching GetProject MasterList failed');
            $scope.showdiv = false;
        }
        //$scope.Deleteindent = function Deleteindent(indent) {
        //    alert(indent.id);
        //    alertify.confirm("Delete", "Are you sure to Delete the indent" + '  ' + indent.indent_no,
        //        function () {
        //            apiService.post('api/indent/Deleteindent/' + indent.id, null, DeleteindentSuccess, DeleteindentFailure);
        //        },
        //         function () { }).set('reverseButtons', false);

        //}
        //function DeleteindentSuccess(response) {
        //    notificationService.displaySuccess("indent Deleted Successfully !");
        //    BindUsersGrid();
        //}
        //function DeleteindentFailure(response) {
        //    notificationService.displayError("indent Delete Failed. Please try again !");
        //}

        GetIndentdetails();
        function GetIndentdetails() {
            apiService.get('api/indent/GetIndentdetails', null, GetIndentdetailsComplete, GetIndentdetailsFailed);
        }
        function GetIndentdetailsComplete(response) {
            $scope.GetIndentdetailslist = response.data;
        }
        function GetIndentdetailsFailed() {
            notificationService.displayError('fetching GetProject MasterList failed');
        }

        GetMaterialList();
        function GetMaterialList() {
            apiService.get('api/MaterialPrice/GetMaterialList', null, LoadMaterialSucceess, LoadMaterialFailed);
        }
        function LoadMaterialSucceess(response) {
            $scope.MaterialList = response.data;


        }
        function LoadMaterialFailed() {
            notificationService.displayError('fetching material list failed');
        }


        //$scope.rows = {
        //    items: [{

        //    }]
        //};
        $scope.nrows = [];

        //$scope.addRow = function () {
        //    $scope.rows.items.push([{
        //        material_name: '',
        //        material_description: '',
        //        quantity: '',
        //        unit_of_measurement: '',
        //        material_price:''
        //    }]);
        //}
        //$scope.removeItem = function (m) {
        //    $scope.rows.items.splice($scope.rows.items.indexOf(m), 1);
        //    }

        $scope.total_amount = function () {

            var total = 0;
            $scope.rows.items.forEach(function (row) {

                total += row.amount;

            })

            return total;
        }

        $scope.getMaterialDetails = function (item) {

            angular.forEach($scope.MaterialList, function (p) {
                if (p.material_name == item.material_name) {
                    item.material_description = p.material_description;
                    item.unit_of_measurement = p.unit_of_measurement;

                    //for (var i = 0; i < $scope.Refmaster.length; i++) {
                    //    if ($scope.Refmaster[i].id == p.unit_of_measurement) {
                    //        item.unit_of_measurement = $scope.Refmaster[i].reference_value;
                    //        break;
                    //    }
                    //}

                    item.material_price = p.material_price;

                }

            })

        }

        $scope.getUnitName = function (unit_id) {
            for (var i = 0; i < $scope.Refmaster.length; i++) {
                if ($scope.Refmaster[i].id == unit_id) {
                    return $scope.Refmaster[i].reference_value;
                }
            }
        };
        $scope.checkindentNoDup = function () {
            for (var i = 0; i < $scope.GetIndentlist.length; i++) {
                if ($scope.GetIndentlist[i].indent_no == $scope.indent.indent_no) {
                    notificationService.displayError("IndentNo already exists please enter a different ID");
                    $scope.indent.indent_no = '';
                    document.getElementById('IndNo').focus();
                }
            }
        };

    }
})(angular.module('common.core'));
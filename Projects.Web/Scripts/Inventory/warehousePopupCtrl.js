(function (app) {
    'use strict';

    app.controller('warehousePopupCtrl', warehousePopupCtrl);

    warehousePopupCtrl.$inject = ['$scope', 'apiService', 'membershipService', 'notificationService', '$rootScope', '$location', '$modalInstance', 'indentNo', 'created_Date'];

    function warehousePopupCtrl($scope, apiService, membershipService, notificationService, $rootScope, $location, $modalInstance, indentNo, created_Date) {

        $scope.closewarehousemodal = closewarehousemodal;
        function closewarehousemodal() {
            $modalInstance.close();
        }

        $scope.indentNo = indentNo;
        $scope.created_Date = created_Date;
        $scope.WarehouseDetailsList = [];
        $scope.WarehouseUpdateDetails = [];

        GetWarehousedetailsList();
        function GetWarehousedetailsList() {
            apiService.get('api/indent/WarehouseDetailsList', null, GetWarehousedetailsComplete, GetWarehousedetailsFailed);
        }
        function GetWarehousedetailsComplete(response) {
            $scope.WarehouseDetailsList = response.data;
        }
        function GetWarehousedetailsFailed() {
            notificationService.displayError('Warehouse Details List Load failed...!');
        }

        $scope.getdetails = getdetails;
        function getdetails(warehouse) {
            if (warehouse.material_released_status == true) {
                $scope.WarehouseUpdateDetails.push({
                    'id':warehouse.id,
                    'indent_no': warehouse.indent_no,
                    'material_name': warehouse.material_name,
                    'quantity': warehouse.raised_quantity,
                    'material_price': warehouse.material_price,
                    'total_price': warehouse.raised_total_price,
                    'given_quantity':warehouse.given_quantity,
                    'released_material_Cost': (warehouse.given_quantity * warehouse.material_price),
                    'material_released_date': warehouse.material_released_date,
                    'material_released_status':true,
              });
        }
    }
        
    $scope.updateMaterialDetails = updateMaterialDetails;
    function updateMaterialDetails() {
        for (var i = 0; i < $scope.WarehouseUpdateDetails.length; i++) {
            apiService.post('api/indent/UpdateWarehouseDetails', $scope.WarehouseUpdateDetails[i], null, updateMaterialDetailsFailed);
        }
        updateMaterialDetailsComplete();
    }
    function updateMaterialDetailsComplete() {
        notificationService.displaySuccess('Update Successfully...!');
        $rootScope.Count = 1;
        //GetWarehousedetailsList();
        $modalInstance.close();
    }
    function updateMaterialDetailsFailed() {
        $rootScope.Count = 0;
        notificationService.displayError('Update failed...!');
    }

    $scope.comparefunc = comparefunc;
    function comparefunc(warehouse) {
        if (warehouse.given_quantity > warehouse.raised_quantity) {
            notificationService.displayError('Released quantity is must be lessthan or equal to Raised quantity..!');
            document.getElementById('given_quantity').value = "";
            document.getElementById("given_quantity").focus();
            //$scope.var1 = true;
        }
        else {
            //$scope.var1 = false;
        }
    }


}
})(angular.module('common.core'));

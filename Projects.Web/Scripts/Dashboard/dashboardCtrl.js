(function (app) {
    'use strict';

    app.controller('dashboardCtrl', dashboardCtrl);

    dashboardCtrl.$inject = ['$scope', 'apiService', 'membershipService', 'notificationService', '$rootScope', '$location', '$modal', '$mdDialog', '$filter'];

    function dashboardCtrl($scope, apiService, membershipService, notificationService, $rootScope, $location, $modal, $mdDialog, $filter) {

        $scope.showWPChart = false;
        $scope.showIndChart = false;


        $scope.subcontracorsNamesList = [];
        $scope.ScWiseTotalEmployesList = [];
        $scope.InductionDoneListList = [];
        $scope.notDoneList = [];
        $scope.doneList = [];


        
        function MasterLoad(fid) {
            apiService.get('api/Dashboard/JunctionWiseWorkProgress/' + fid + '/' + 0, null, WorkProgressListComplete, WorkProgressListFailed);
            apiService.get('api/PoliceStation/getPoliceStationListByProjId/' + fid, null, PoliceStationsListLoadComplete, PoliceStationsListLoadFailed);
            apiService.get('api/Dashboard/ScWiseTotalEmployesList/' + fid, null, ScWiseTotalEmployesListComplete, ScWiseTotalEmployesListFailed);
            apiService.get('api/Dashboard/InductionDoneList/' + fid, null, InductionDoneListComplete, InductionDoneListFailed);
            apiService.get('api/Dashboard/IndentsStatusList/' + fid, null, IndentsStatusListComplete, IndentsStatusListFailed);
            apiService.get('api/Dashboard/LabourTestCertificates/' + fid, null, LabourTestCertificatesListComplete, LabourTestCertificatesListFailed);
            apiService.get('api/Dashboard/SubContractorWiseIndentcost/' + fid, null, IndentCostListComplete, IndentCostListFailed);
            apiService.get('api/Dashboard/WorkProgressVerifList/' + fid, null, WorkProgressVerifListComplete, WorkProgressVerifListFailed);
            apiService.get('api/Dashboard/SCwithTotalIndentCost/' + fid, null, SCwithTotalIndentCostComplete, SCwithTotalIndentCostFailed);
            apiService.get('api/Dashboard/SCTotalMaterials/' + fid, null, SCTotalMaterialsComplete, SCTotalMaterialsFailed);
            apiService.get('api/Dashboard/SCWiseTotalMaterialsList/' + fid, null, ScWisetotalIndentswiseDetailsComplete, ScWisetotalIndentswiseDetailsFailed);

        }
        //LoadMaster();
        function LoadMaster() {
            apiService.get('api/ProjectMaster/GetProjectsList/' + $rootScope.tenant.tenant_id, null, GetProjectsListLoadComplete, GetProjectsListLoadFailed);
            apiService.get('api/SubContractor/getSubContractorsList/' + $rootScope.tenant.tenant_id, null, SubContractorsListLoadComplete, SubContractorsListLoadFailed);
            //apiService.get('api/Dashboard/ScWiseTotalEmployesList', null, ScWiseTotalEmployesListComplete, ScWiseTotalEmployesListFailed);
            //apiService.get('api/Dashboard/InductionDoneList', null, InductionDoneListComplete, InductionDoneListFailed);

        }
        function GetProjectsListLoadComplete(response) {
            $scope.projectslists = response.data;
            $scope.fid = $scope.projectslists[0].id;
            $scope.project_id = $scope.fid;
            MasterLoad($scope.fid);
        }
        function GetProjectsListLoadFailed() {
            notificationService.displayError('Fetching GetProjectsList Failed');
        }





        function SubContractorsListLoadComplete(response) {
            $scope.SCList = response.data;

            for (var i = 0; i < $scope.SCList.length; i++) {
                //for (var j = 0; j < $scope.ScWiseTotalEmployesList.length; j++) {
                //    if ($scope.SCList[i].id == $scope.ScWiseTotalEmployesList[j].subcontractor_id) {
                var scname = '';
                scname = $scope.SCList[i].subcontractor_name
                $scope.subcontracorsNamesList.push(scname);
                GetInductionsChrt();
                //}
                //}
            }

            for (var j = 0; j < $scope.LabourSubcontractorsList.length; j++) {
                for (var i = 0; i < $scope.SCList.length; i++) {
                    if ($scope.SCList[i].id == $scope.LabourSubcontractorsList[j]) {
                        $scope.LabourSubcontractorsList[j] = $scope.SCList[i].subcontractor_name;
                        break;
                    }
                }
            }
            GetLaborCertificatesCountChart();
        }
        function SubContractorsListLoadFailed() {
            notificationService.displayError('fetching subcontractorslist failed');

        }

        function ScWiseTotalEmployesListComplete(response) {
            $scope.ScWiseTotalEmployesList = response.data;
            $scope.notDoneList = [];

            for (var i = 0; i < $scope.ScWiseTotalEmployesList.length; i++) {
                var ndone = $scope.ScWiseTotalEmployesList[i].Total;
                $scope.notDoneList.push(ndone);
                GetInductionsChrt();
            }
        }
        function ScWiseTotalEmployesListFailed() {
            notificationService.displayError('fetching InductionDone list failed');

        }
        function InductionDoneListComplete(response) {
            $scope.InductionDoneListList = response.data;
            $scope.doneList = [];

            for (var i = 0; i < $scope.InductionDoneListList.length; i++) {
                var done = $scope.InductionDoneListList[i].Total;
                $scope.doneList.push(done);
                GetInductionsChrt();
            }
            if ($scope.InductionDoneListList.length == 0) { $scope.showIndChart = false; } else { $scope.showIndChart = true; }
        }
        function InductionDoneListFailed() {
            notificationService.displayError('fetching InductionDone list failed');

        }
        
        $scope.getChartDataByProjId = function (project_id) {
            apiService.get('api/Dashboard/JunctionWiseWorkProgress/' + $scope.project_id + '/' + 0, null, WorkProgressListComplete, WorkProgressListFailed);
            apiService.get('api/PoliceStation/getPoliceStationListByProjId/' + $scope.project_id, null, PoliceStationsListLoadComplete, PoliceStationsListLoadFailed);
            apiService.get('api/Dashboard/ScWiseTotalEmployesList/' + $scope.project_id, null, ScWiseTotalEmployesListComplete, ScWiseTotalEmployesListFailed);
            apiService.get('api/Dashboard/InductionDoneList/' + $scope.project_id, null, InductionDoneListComplete, InductionDoneListFailed);
            apiService.get('api/Dashboard/IndentsStatusList/' + $scope.project_id, null, IndentsStatusListComplete, IndentsStatusListFailed);
            apiService.get('api/Dashboard/LabourTestCertificates/' + $scope.project_id, null, LabourTestCertificatesListComplete, LabourTestCertificatesListFailed);
            apiService.get('api/Dashboard/SubContractorWiseIndentcost/' + $scope.project_id, null, IndentCostListComplete, IndentCostListFailed);
            apiService.get('api/Dashboard/WorkProgressVerifList/' + $scope.project_id, null, WorkProgressVerifListComplete, WorkProgressVerifListFailed);
            apiService.get('api/Dashboard/SCwithTotalIndentCost/' + $scope.project_id, null, SCwithTotalIndentCostComplete, SCwithTotalIndentCostFailed);
            apiService.get('api/Dashboard/SCTotalMaterials/' + $scope.project_id, null, SCTotalMaterialsComplete, SCTotalMaterialsFailed);
        };

        $scope.psWiseWP = function (ps_id) {
            //alert(ps_id);
            if (ps_id == null) { ps_id = 0; }
            apiService.get('api/Dashboard/JunctionWiseWorkProgress/' + $scope.project_id + '/' + ps_id, null, WorkProgressListComplete, WorkProgressListFailed);

        };
        $scope.junctions = [];
        $scope.workprogressPercnt = [];
        GetJunctionsWorkProgress();
        function GetJunctionsWorkProgress() {
            //apiService.get('api/PoliceStation/getPoliceStationListByProjId/' + $scope.project_id, null, PoliceStationsListLoadComplete, PoliceStationsListLoadFailed);
            //apiService.get('api/Dashboard/JunctionWiseWorkProgress/' + $scope.project_id + '/' + 0, null, WorkProgressListComplete, WorkProgressListFailed);
        }
        function PoliceStationsListLoadComplete(response) {
            $scope.PolicestationList = response.data;
        }
        function PoliceStationsListLoadFailed() {
            //notificationService.displayError('fetching policestations list failed');
        }
        function WorkProgressListComplete(response) {
            $scope.WorkProgressList = response.data;
            $scope.junctions = [];
            $scope.workprogressPercnt = [];

            for (var i = 0; i < $scope.WorkProgressList.length; i++) {
                $scope.junctions.push($scope.WorkProgressList[i].junction_name);
                var tot = $scope.WorkProgressList[i].totalwork;
                var comp = $scope.WorkProgressList[i].completedwork;
                var wpPercentage = (comp / tot) * 100;
                $scope.workprogressPercnt.push(wpPercentage);
                GetWorkProgressChart();                
            }
            if ($scope.WorkProgressList.length == 0) { $scope.showWPChart = false; } else { $scope.showWPChart = true; }
        }
        function WorkProgressListFailed() {
            notificationService.displayError('fetching workprogress list failed');

        }

        $scope.Subcontractorname = [];
        $scope.IndentCost = [];
        GetSubContractorIndentCost();
        function GetSubContractorIndentCost() {
            //apiService.get('api/Dashboard/SubContractorWiseIndentcost', null, IndentCostListComplete, IndentCostListFailed);
        }
        function IndentCostListComplete(response) {
            $scope.IndentCostList = response.data;
        }
        function IndentCostListFailed() {
            notificationService.displayError('fetching IndentCost list failed');

        }

        GetIndentStatusList();
        function GetIndentStatusList() {
            //apiService.get('api/Dashboard/IndentsStatusList', null, IndentsStatusListComplete, IndentsStatusListFailed);
        };
        function IndentsStatusListComplete(response) {
            $scope.IndentsStatusList = response.data;
            $scope.indentstatuses = [];
            var approvedCount = 0, rejectedCount = 0, pendingCount = 0, createdCount = 0, givenCount = 0;
            for (var i = 0; i < $scope.IndentsStatusList.length; i++) {
                if ($scope.IndentsStatusList[i].indentstatus == 'Approved') { approvedCount++; }
                else if ($scope.IndentsStatusList[i].indentstatus == 'Pending') { pendingCount++; }
                else if ($scope.IndentsStatusList[i].indentstatus == 'Rejected') { rejectedCount++; }
                else if ($scope.IndentsStatusList[i].indentstatus == 'Created') { createdCount++; }
                else if ($scope.IndentsStatusList[i].indentstatus == 'Given') { givenCount++; }

            }
            $scope.indentstatuses = [['Approved', approvedCount], ['Pending', pendingCount], ['Rejected', rejectedCount], ['Created', createdCount], ['Given', givenCount]];
            if ($scope.IndentsStatusList.length == 0) { $scope.showIndStatChart = false; } else { $scope.showIndStatChart = true; }
            GetIndentsStatusChart();

        }
        function IndentsStatusListFailed() {
            notificationService.displayError('fetching indents status list failed');

        }


        $scope.LabourTestCertificatesList = [];
        $scope.LabourSubcontractorsList = [];
        $scope.MedicalTestDoneList = [];
        $scope.MedicalTestNotDoneList = [];
        $scope.EyeTestDoneList = [];
        $scope.EyeTestNotDoneList = [];
        GetLabourTestCertificates();
        function GetLabourTestCertificates() {
            //apiService.get('api/Dashboard/LabourTestCertificates', null, LabourTestCertificatesListComplete, LabourTestCertificatesListFailed);
        }
        function LabourTestCertificatesListComplete(response) {
            $scope.LabourTestCertificatesList = response.data;
            $scope.MedicalTestDoneList = [];
            $scope.MedicalTestNotDoneList = [];
            $scope.EyeTestDoneList = [];
            $scope.EyeTestNotDoneList = [];
            for (var i = 0; i < $scope.LabourTestCertificatesList.length; i++) {
                $scope.LabourSubcontractorsList.push($scope.LabourTestCertificatesList[i].sc_id);
                $scope.MedicalTestDoneList.push($scope.LabourTestCertificatesList[i].medicalTestDone);
                $scope.MedicalTestNotDoneList.push($scope.LabourTestCertificatesList[i].medicalTestNotDone);
                $scope.EyeTestDoneList.push($scope.LabourTestCertificatesList[i].eyeTestDone);
                $scope.EyeTestNotDoneList.push($scope.LabourTestCertificatesList[i].eyeTestNotDone);
            }

            if ($scope.LabourTestCertificatesList.length == 0) { $scope.showLbCertChart = false; } else { $scope.showLbCertChart = true; }
            GetLaborCertificatesCountChart();
        }
        function LabourTestCertificatesListFailed() {
            notificationService.displayError('fetching LabourTestCertificates list failed');

        }


        $scope.WVJunctionsList = [];
        $scope.WVApproved = [];
        $scope.WVNotconfirmed = [];
        function WorkProgressVerifListComplete(response) {
            $scope.WPVerifList = response.data;
            $scope.WVJunctionsList = [];
            $scope.WVApproved = [];
            $scope.WVNotconfirmed = [];

            for (var i = 0; i < $scope.WPVerifList.length; i++) {
                $scope.WVJunctionsList.push($scope.WPVerifList[i].jn_name);
                $scope.WVApproved.push($scope.WPVerifList[i].approvedWork);
                $scope.WVNotconfirmed.push($scope.WPVerifList[i].NotConfirmedWork);                
            }

            if ($scope.WPVerifList.length == 0) { $scope.showWpQualChart = false; } else { $scope.showWpQualChart = true; }
            WorkProgressQualityChart();
        }
        function WorkProgressVerifListFailed() {
            notificationService.displayError('fetching LabourTestCertificates list failed');

        }


        
        function SCwithTotalIndentCostComplete(response) {
            $scope.SCwithTotalIndentCostList = response.data;
            GetSubcontractorIndentCostChart()
        }
        function SCwithTotalIndentCostFailed() {
            notificationService.displayError('fetching SCwith Total Indents total Cost list failed');
        }
        $scope.SCwiseMaterialDetailsList = [];
        function SCTotalMaterialsComplete(response) {
            $scope.SCwiseMaterialDetailsList = response.data;
            apiService.get('api/Dashboard/SCWiseTotalMaterialsList/' + $scope.project_id, null, ScWisetotalIndentswiseDetailsComplete, ScWisetotalIndentswiseDetailsFailed);
        }
        function SCTotalMaterialsFailed() {
            notificationService.displayError('fetching SC wise Total Materials list failed');
        }

        function ScWisetotalIndentswiseDetailsComplete(response) {
            $scope.SCwiseTotalMaterialList = response.data;
            if ($scope.SCwiseTotalMaterialList.length == 0) { $scope.showMatrlChart = false; } else { $scope.showMatrlChart = true; }
            SubcontractorWiseMaterialChart();
        }
        function ScWisetotalIndentswiseDetailsFailed() {
            //notificationService.displayError('fetching SCwise Total  Materials list failed');
        }


        function GetInductionsChrt() {
            Highcharts.chart('InductionContainer', {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Induction Done chart'
                },
                xAxis: {
                    categories: $scope.subcontracorsNamesList
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Employess Induction Done list'
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                        }
                    }
                },
                legend: {
                    align: 'right',
                    x: -30,
                    verticalAlign: 'top',
                    y: 25,
                    floating: true,
                    backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                    borderColor: '#CCC',
                    borderWidth: 1,
                    shadow: false
                },
                credits: {
                    enabled: false
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true,
                            color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                        }
                    }
                },
                series: [{
                    name: 'Done',
                    data: $scope.doneList
                },
                {
                    name: 'Not Done',
                    data: $scope.notDoneList
                }]
            });
        }//end of inductionChart func


        function GetSubcontractorIndentCostChart() {
            $scope.Subcontractorname = [];
            $scope.IndentCost = [];
            for (var i = 0; i < $scope.SCwithTotalIndentCostList.length; i++) {
                $scope.Subcontractorname.push($scope.SCwithTotalIndentCostList[i].sc_name[0]);
                $scope.IndentCost.push($scope.SCwithTotalIndentCostList[i].total_cost);
            }
            if ($scope.SCwithTotalIndentCostList.length == 0) { $scope.showIndCostChart = false; } else { $scope.showIndCostChart = true; }


            Highcharts.chart('SubcontractorIndentCostContainer', {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Subcontractor Indent Cost Details'
                },
                xAxis: {
                    categories: $scope.Subcontractorname//['Floor mill', 'Laxmi nagar', 'Shaik tea stall', 'Raidurgam', 'Olive hospital']
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Subcontractor Material Cost'
                    }
                },
                legend: {
                    reversed: true
                },
                credits: {
                    enabled: false
                },
                plotOptions: {
                    series: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true,
                            format: '{point.y:.1f}'
                        }
                    }
                },
                series: [{
                    name: 'Subcontractor',
                    data: $scope.IndentCost//[5, 3, 4, 7, 2]
                }]
            });

        }//end of Subcontractor IndentCost Chart func

        function GetWorkProgressChart() {
            Highcharts.chart('WorkProgressContainer', {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Junction Wise Work Progress'
                },
                xAxis: {
                    categories: $scope.junctions//['Floor mill', 'Laxmi nagar', 'Shaik tea stall', 'Raidurgam', 'Olive hospital']
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Junctions Work Progress'
                    }
                },
                legend: {
                    reversed: true
                },
                credits: {
                    enabled: false
                },
                plotOptions: {
                    series: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true,
                            format: '{point.y:.1f}%'
                        }
                    }
                },
                series: [{
                    name: 'Work Progress',
                    data: $scope.workprogressPercnt//[5, 3, 4, 7, 2]
                }]
            });

        }//end of workprogressChart func


        function GetIndentsStatusChart() {
            Highcharts.chart('IndentsStatusContainer', {
                chart: {
                    type: 'pie'
                },
                title: {
                    text: 'Complete Indents status'
                },
                subtitle: {
                    text: ''
                },
                credits: {
                    enabled: false
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        innerSize: 0,
                        depth: 0
                    }
                },
                series: [{
                    name: 'Delivered amount',
                    data: $scope.indentstatuses
                }]
            });
        };//end IndentsStatusChart func



        function GetLaborCertificatesCountChart() {
            Highcharts.chart('LaborCertificatesContainer', {

                chart: {
                    type: 'column'
                },

                title: {
                    text: 'Medical and Eye Test Done list of Labours'
                },

                xAxis: {
                    categories: $scope.LabourSubcontractorsList//['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
                },

                yAxis: {
                    allowDecimals: false,
                    min: 0,
                    title: {
                        text: 'Number of Employees'
                    }
                },
                credits: {
                    enabled: false
                },
                tooltip: {
                    formatter: function () {
                        return '<b>' + this.x + '</b><br/>' +
                            this.series.name + ': ' + this.y + '<br/>' +
                            'Total: ' + this.point.stackTotal;
                    }
                },

                plotOptions: {
                    column: {
                        stacking: 'normal'
                    }
                },

                series: [{
                    name: 'MedicalTest Done',
                    data: $scope.MedicalTestDoneList,//[5, 3, 4, 7, 2],
                    stack: 'Medical Test'
                }, {
                    name: 'MedicalTest Not Done',
                    data: $scope.MedicalTestNotDoneList,//[3, 4, 4, 2, 5],
                    stack: 'Medical Test'
                }, {
                    name: 'EyeTest Done',
                    data: $scope.EyeTestDoneList,//[2, 5, 6, 2, 1],
                    stack: 'Eye Test'
                }, {
                    name: 'EyeTest Not Done',
                    data: $scope.EyeTestNotDoneList,//[3, 0, 4, 4, 3],
                    stack: 'Eye Test'
                }]
            });
        }//end of laboircertificatescount func


        function WorkProgressQualityChart() {
            Highcharts.chart('WorkProgressQualityContainer', {

                chart: {
                    type: 'column'
                },
                title: {
                    text: 'WorkProgress Quality Chart'
                },
                xAxis: {
                    categories: $scope.WVJunctionsList
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Employess Induction Done list'
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                        }
                    }
                },
                legend: {
                    align: 'right',
                    x: -30,
                    verticalAlign: 'top',
                    y: 25,
                    floating: true,
                    backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                    borderColor: '#CCC',
                    borderWidth: 1,
                    shadow: false
                },
                credits: {
                    enabled: false
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true,
                            color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                        }
                    }
                },
                series: [{
                    name: 'Approved',
                    data: $scope.WVApproved
                },
                {
                    name: 'Not Confirmed',
                    data: $scope.WVNotconfirmed
                }]
            });
        }//end of workprogressquality func


        $scope.SCwTIList = [];
        $scope.Original = [];
        $scope.mtrlList = [];
        function SubcontractorWiseMaterialChart() {
            $scope.SCwTIList = [];
            $scope.mtrlList = [];
            $scope.Original = [];
            for (var i = 0; i < $scope.SCwiseMaterialDetailsList.length; i++) {
                //for Subcontractor wise total Materials List
                $scope.SCwTIList.push({
                    'name': $scope.SCwiseMaterialDetailsList[i].sc_name[0],
                    'y': $scope.SCwiseMaterialDetailsList[i].total_given_quantity,
                    'drilldown': $scope.SCwiseMaterialDetailsList[i].sc_name[0]
                });
                //for Subcontractor wise total materails and given quantity
                $scope.mtrlList = [];
                for (var j = 0; j < $scope.SCwiseTotalMaterialList.length; j++) {
                    if ($scope.SCwiseMaterialDetailsList[i].sc_id[0] == $scope.SCwiseTotalMaterialList[j].sc_id) {
                        $scope.mtrlList.push([
                            $scope.SCwiseTotalMaterialList[j].material_name,
                            $scope.SCwiseTotalMaterialList[j].given_quantity
                        ]);
                    }
                }
                $scope.Original.push({
                    'name': $scope.SCwiseMaterialDetailsList[i].sc_name[0],
                    'id': $scope.SCwiseMaterialDetailsList[i].sc_name[0],
                    'data': $scope.mtrlList
                }); 
            }

            // Create the chart
            Highcharts.chart('SCWiseMaterailchart', {
                chart: {type: 'column'},
                title: {text: 'SubContractor Wise Materials Detail Chart'},
                subtitle: {text: 'Click the columns to view Material Details'},
                xAxis: {type: 'category'},
                yAxis: {
                    title: {text: 'Total Materials (Units)'}
                },
                legend: {enabled: false},
                plotOptions: {
                    series: {
                        borderWidth: 0,
                        dataLabels: {
                            enabled: true,
                            format: '{point.y}'
                        }
                    }
                },

                credits: {
                    enabled: false
                },

                tooltip: {
                    headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                    pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b> Units <br/>' //{point.y:.2f}
                },
                
                series: [{name: 'Subcontractor:',colorByPoint: true,
                          data: $scope.SCwTIList
                }],
                drilldown: {
                    colorByPoint: true,
                    series: $scope.Original
                }

            });
        } //end of SubcontractorWiseMaterialChart func

    }
})(angular.module('common.core'));
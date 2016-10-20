'use strict';

mailSender.controller('templateController', ['$http','$scope','$location','$rootScope','logger', function ($http,$scope,$location,$rootScope,logger) {


    $scope.templateData=[];
    $scope.setTemplate=function(step){
        $scope.selectedTemplate=step;
        $scope.activeTemplate=[];
        $scope.activeTemplate[step]="active";

        var iframe = document.getElementById('iframe'),
            iframedoc = iframe.contentDocument || iframe.contentWindow.document;

        iframedoc.body.innerHTML = $scope.templateData[$scope.selectedTemplate].content.header+$scope.templateData[$scope.selectedTemplate].content.footer;

    };
    $scope.loadTemplate=function(data){
        $http.post('/loadTemplate',data).success(function(response){
            $scope.templateData=response;
            $scope.setTemplate(0);
        });
    };
    $scope.loadTemplate();

    //$scope.addContact=function(data){
    //    if($.inArray(data, $scope.contactData)==-1){
    //        $scope.contactData.push(data);
    //        $http.post('/updateContact',$scope.contactData).success(function(response){
    //            $scope.contactData=response;
    //        });
    //    }else
    //        logger.logError("already added this email.")
    //};
    //$scope.deleteContact=function($index){
    //    $scope.contactData.splice($index,1);
    //    $http.post('/updateContact',$scope.contactData).success(function(response){
    //        $scope.contactData=response;
    //    });
    //};

}]);
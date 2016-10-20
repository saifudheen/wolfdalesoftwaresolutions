'use strict';

mailSender.controller('contactController', ['$http','$scope','$location','$rootScope','logger', function ($http,$scope,$location,$rootScope,logger) {


    $scope.contactData=[];
    $scope.loadContact=function(data){
        $http.post('/loadContact',data).success(function(response){
            $scope.contactData=response;
        });
    };
    $scope.loadContact();

    $scope.addContact=function(data){
        if($.inArray(data, $scope.contactData)==-1){
            $scope.contactData.push(data);
            $http.post('/updateContact',$scope.contactData).success(function(response){
                $scope.contactData=response;
            });
        }else
            logger.logError("already added this email.")
    };
    $scope.deleteContact=function($index){
        $scope.contactData.splice($index,1);
        $http.post('/updateContact',$scope.contactData).success(function(response){
            $scope.contactData=response;
        });
    };

}]);
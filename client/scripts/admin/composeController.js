'use strict';

mailSender.controller('composeController', ['$http','$scope','$location','$rootScope','logger', function ($http,$scope,$location,$rootScope,logger) {

    $scope.mailData={"recipients":[],"subject":"","content":"","template":0,"body":""};
    $rootScope.menuList=[{name:'Compose'},{name:'Contacts'},{name:'Templates'}];
    $scope.failure_email=[];

    $scope.loadContact=function(data){
        $http.post('/loadContact',data).success(function(response){
            $scope.mailData.recipients=response;
        });
    };
    $scope.loadContact();
    $rootScope.setTab=function(step){
        $rootScope.menuTab=step;
        $rootScope.menuTabActive=[];
        $rootScope.menuTabActive[step]="active";
    };
    $rootScope.setTab(0);
    $scope.loadTemplate=function(data){
        $http.post('/loadTemplate',data).success(function(response){
            $scope.templateData=response;
            $scope.templateChanged();
        });
    };
    $scope.loadTemplate();
    $scope.viewPreview=function(){
        $(".modal-fullscreen").on('show.bs.modal', function () {
            setTimeout( function() {
                $(".modal-backdrop").addClass("modal-backdrop-fullscreen");
            }, 0);
        });
        $(".modal-fullscreen").on('hidden.bs.modal', function () {
            $(".modal-backdrop").addClass("modal-backdrop-fullscreen");
        });
        var iframe = document.getElementById('iframeid'),
            iframedoc = iframe.contentDocument || iframe.contentWindow.document;

        iframedoc.body.innerHTML = $scope.templateData[$scope.mailData.template].content.header+$scope.mailData.body+$scope.templateData[$scope.mailData.template].content.footer;

        $('#preview').modal('show');
    };
    $scope.viewConfig=function(){
        $scope.loadConfig();
        $('#config').modal('show');
    };
    $scope.loadConfig=function(){
        $http.post('/loadConfig').success(function(response){
            $scope.config_data=response;
        });
    };
    $scope.saveConfig=function(data){
        $http.post('/saveConfig',data).success(function(response){
            $scope.config_data=response;
            $('#config').modal('hide');
        });
    };
    $scope.templateChanged=function(data){
        $scope.mailData.template=data;
    }
    $scope.addRecipient=function(data){
        if($.inArray(data, $scope.mailData.recipients)==-1){
            $scope.mailData.recipients.push(data);
        }else
            logger.logError("already added this email.")
    };
    $scope.deleteRecipient=function(row,$index){
        $scope.mailData.recipients.splice($index,1);
    };
    $scope.sendMail=function(data){
        $scope.failure_email=[];
        $http.post('/sendmail',data).success(function(response){
            $scope.failure_email=response[0].failure_email;
            $scope.failure_email.length!=0?
                logger.logError("Email Sending Failed !"):
                logger.logSuccess("Email Sending Success !");
        });
    }

}]);
'use strict';

mailSender.controller('userController', ['$http','$scope','$rootScope','userService','logger', function ($http,$scope,$rootScope,userService,logger) {
    $rootScope.Today=new Date();
//    userService.checkAuthenticatedUser($scope);
//    setInterval(function(){
//    $scope.$apply(function(){
//        userService.checkAuthenticatedUser($scope)
//    });},60000);
    $rootScope.login=function(username,password)
    {
        userService.login($scope,username,password);
    };
    $rootScope.logout=function()
    {
        userService.logout($scope);
    };
    $scope.forgotPassword=function(){
        $http.post('/forgotPassword').success(function(response) {
            logger.logSuccess("Please Check Your Email And Continue Sign In.");
        });
    };
    $rootScope.checkAuthenticatedUser=function(){
        $scope.$apply(function(){
            userService.checkAuthenticatedUser($scope)
        });
    };

//    categoryService.loadCategory($scope);
//    itemService.loadItems($scope);
//    userService.loadCustomers($scope);
//    userService.load($scope);

}]);
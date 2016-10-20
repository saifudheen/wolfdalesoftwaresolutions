'use strict';

mailSender.factory('userService',function($http,$location,$rootScope,logger){
    return{
        login:function($scope,username,password){
            var data = { "mail": username, "pass": password };
            $http.post('/login',data).success(function(response){
                if(response[0].RESULT!=1)
                {
                    $rootScope.loginedUserData=undefined;

                    logger.logError('Please check your  username or password ')
                }
                else
                {
                    logger.logSuccess("Welcome to E-Mail Sender.");
                    logger.logSuccess("Access Granted for "+username);
                    $rootScope.loginedUserData=data;
                    $location.path('/')

                }

            }).error(function()
                {
                    logger.logError("Something went Wrong !!! Please Check Your Connection!");
                });
        },
        logout:function($scope){
            $rootScope.loginedUserData=undefined;
            $location.path('/')

        }

    }
});

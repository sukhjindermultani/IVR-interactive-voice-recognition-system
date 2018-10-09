'use strict';

MetronicApp.controller('LoginController', function($rootScope, $scope, $http, $timeout,$location,$modal,$state,Restangular) {
	$scope.$on('$viewContentLoaded', function() { 	 
		// initialize core components
		Metronic.initAjax();
		if(localStorage.getItem('acc') != null)
		{
			//$location.path('/dashboard.html');
			$scope.IsUserExist();	
		}
		//localStorage.clear();

		//Need to write your here
		$rootScope.settings.layout.pageSidebarClosed = false;
	});



	
	$scope.doLogin=function()
	{ 
	$("#overlay").show();
		var username=$scope.username;
		var password=$scope.password;
		$http({url:'php-script/login.php',method:'GET',params:{'username':username,'password':password}}).success(function(data,status)
		{
			if(data.msg == 'success' && data.user_role_grant_detail[0].user_role_id !=1)
			{
				var i =0;
				var UserRole=[];
				while(i<data.user_role_grant_detail.length)
				{
					UserRole.push(data.user_role_grant_detail[i].module_name);
					i++;
				}

				localStorage.setItem('nm', $scope.username);
				localStorage.setItem('md5', data.md5_credential);
				localStorage.setItem('acnm', data.account_name);
				localStorage.setItem('mob', data.mobile_number);
				localStorage.setItem('role', data.user_role_grant_detail[0].user_role_id);
				$scope.kazooAuthentication(data.md5_credential, data.account_name, UserRole);
				//$location.path('/dashboard.html');
				//location.reload();
			}
			else
			{
				$("#overlay").hide();
				//$location.path('/login.html');
				$scope.msg = 'Login Credentials are not valid';
			}
		});                   
	}

	$scope.doAdminLogin=function()
	{ 
	$("#adminOverlay").show();
		var username=$scope.username;
		var password=$scope.password;
		$http({url:'php-script/login.php',method:'GET',params:{'username':username,'password':password}}).success(function(data,status)
		{
			if(data.msg == 'success' && data.user_role_grant_detail[0].user_role_id == 1)
			{
				var i =0;
				var UserRole=[];
				while(i<data.user_role_grant_detail.length)
				{
					UserRole.push(data.user_role_grant_detail[i].module_name);
					i++;
				}

				localStorage.setItem('nm', $scope.username);
				localStorage.setItem('md5', data.md5_credential);
				localStorage.setItem('acnm', data.account_name);
				localStorage.setItem('mob', data.mobile_number);
				localStorage.setItem('role', data.user_role_grant_detail[0].user_role_id);
				$scope.kazooAuthentication(data.md5_credential, data.account_name, UserRole);
				//$location.path('/dashboard.html');
				//location.reload();
			}
			else
			{
				$("#adminOverlay").hide();
				//$location.path('/login.html');
				$scope.msg = 'Login Credentials are not valid';
			}
		});                   
	}


$scope.kazooAuthentication=function(hashMd5, account_name, UserRole)
{

	var data1 = {'credentials':hashMd5,"account_name":account_name}
    var auth = Restangular.one("user_auth")
    auth.data = data1
    auth.put().then(function(data){
    	if(data.status == 'success')
    	{
	        $scope.auth_Id = data.auth_token;
	        $scope.account_Id = data.data.account_id;  
			localStorage.setItem('auth', data.auth_token);
	        localStorage.setItem('acc', data.data.account_id);
	        localStorage.setItem('module', UserRole); 
	       	$location.path('/dashboard.html');	     
			
			dashboard.updateSidebar();
			dashboard.updateAdminMenu();
			// Krishan Babbar: No need to reload page. May be we need to show left panel on some condition basis
	       	//location.reload(false);
		    //$scope.getPhoneNumbers();
		    //$scope.getCredits();
		    //$scope.recentCdrs();
		    
		}
		else
		{
			$scope.msg = 'Login Credentials are not valid';
			//$location.path('/login.html');			
		}

    });
}


$scope.IsUserExist=function()
{
	var hashMd5 = localStorage.getItem('md5');
	var account_name = localStorage.getItem('acnm');
	var data1 = {'credentials':hashMd5,"account_name":account_name}
    var auth = Restangular.one("user_auth")
    auth.data = data1
    auth.put().then(function(data){
    	if(data.status == 'success')
    	{
	        $scope.auth_Id = data.auth_token;
	        $scope.account_Id = data.data.account_id;  
			localStorage.setItem('auth', data.auth_token);
	        localStorage.setItem('acc', data.data.account_id);
	        //localStorage.setItem('module', UserRole);
	        //location.reload();
	       	$location.path('/dashboard.html');	        
		    //$scope.getPhoneNumbers();
		    //$scope.getCredits();
		    //$scope.recentCdrs();
		    
		}
		else
		{
			$scope.msg = 'Login Credentials are not valid';
			//$location.path('/login.html');			
		}

    });
}

$scope.forgot_password=function(size)
{
	var modalInstance = $modal.open({
		templateUrl: 'forgot.html',
		controller: 'forgotPasswordCtrl',
		size: size
	});
}


});


MetronicApp.controller('forgotPasswordCtrl',function( $modalInstance, $scope,$http, $state ) {

	$scope.forgot=function()
	{
		$http({url:'php-script/forgot_password.php',method:'GET',params:{'email':$scope.forgot_pwd}}).success(function(data,status)
		{
			if(data.msg == 'success'){
				alert('Your password has been sent to your mail.');
				$modalInstance.close();
			}else{
				alert('This Email does not exist.');
			}
		});
	}


	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};


});

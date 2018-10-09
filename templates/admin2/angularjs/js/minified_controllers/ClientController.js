MetronicApp.controller('ClientController', ["$rootScope", "$scope", "$http", "$timeout", "$location", "$modal", "$state", "Restangular", function($rootScope, $scope, $http, $timeout,$location,$modal,$state, Restangular) {
		$scope.$on('$viewContentLoaded', function() {   
			// initialize core components
			Metronic.initAjax();

		});


	$scope.SelectedAccount = '';
	$scope.accAllRealms = [];
	$scope.allAccName = [];
	$scope.AllClients = [];
	$scope.PlanIDS = [];
	$scope.getClients=function()
	{
			$http({url:'php-script/getClients.php',method:'GET',params:{}}).success(function(data,status)
			{			
				for(var i=0;i<data.length;i++)
				{
					$scope.AllClients.push(data[i].id);
					if(data[i].plan_id != 0){
						$scope.PlanIDS.push(data[i].plan_id);
					}
					
				}
			});
			
	}
	$scope.getClients();
	$scope.getAllAccounts=function()
	{
			$scope.AllAccounts = [];
			var accountId = localStorage.getItem('acc');
			var authId = localStorage.getItem('auth');
			$http.get('http://43.252.243.10:8000/v1/'+'accounts/'+accountId+'/children', {
				headers: {'X-Auth-Token': authId}}).then(function(data) {
				//if(data.status == 'success')
				//{
						var accounts= data.data.data;
						//console.log(data.data.data);
						for(var i =0;i<accounts.length;i++)
						{
								$scope.AllAccounts.push({'account_id':accounts[i].id,'name':accounts[i].name, 'realm':accounts[i].realm});
								$scope.accAllRealms.push(accounts[i].realm);
								$scope.allAccName.push(accounts[i].name);
						}
				//}
			 });
	}
	$scope.getAllAccounts();

	$scope.deleteAcc=function(acc,acc_name)
	{
		var con = confirm('Are you sure to delete this account ?');
		if(con == true){
			var authId = localStorage.getItem('auth');
			$http.delete('http://43.252.243.10:8000/v1/'+'accounts/'+acc, {
				headers: {'X-Auth-Token': authId}}).then(function(data) {
					if(data.status == 200)
					{
						$http({url:'php-script/deleteAcc.php',method:'GET',params:{'account_name':acc_name, 'account_id':acc}}).success(function(data,status){

						});
						//$state.reload();
					}
					else
					{
						//alert('hello');
					}
					$state.reload();
				});
		}
		
	}


	$scope.ExistClient=function(id)
	{
		if($scope.AllClients.indexOf(id) > -1)
		{
			document.getElementById('id_add_'+id).style.display='none';
			document.getElementById('id_edit_'+id).style.display='block';
		}
		else
		{
			document.getElementById('id_edit_'+id).style.display='none';
			document.getElementById('id_add_'+id).style.display='block';	
		}		
		return true;		
	}

	$scope.ExistPlan=function(id)
	{
		if($scope.PlanIDS.indexOf(id) > -1)
		{
			document.getElementById('id_add_plan'+id).style.display='none';
			document.getElementById('id_edit_plan'+id).style.display='block';
		}
		else
		{
			document.getElementById('id_edit_plan'+id).style.display='none';
			document.getElementById('id_add_plan'+id).style.display='block';	
		}		
		return true;		
	}


	$scope.viewAcc = function(name,realm,size) {
		var modalInstance = $modal.open({
			templateUrl: 'viewAccModal.html',
			controller: 'viewAccmodalCtrl',
			size: size,
			resolve: {
					accName: function () {
						return name;
					},
					accRealm: function () {
						return realm;
					}
				}
		});
	}


	$scope.open = function (size) {
		var modalInstance = $modal.open({
			templateUrl: 'addClientModal.html',
			controller: 'modalCtrl',
			size: size
		});
	};


	$scope.addKazooAcc = function (size) {
		var modalInstance = $modal.open({
			templateUrl: 'addKazooAccModal.html',
			controller: 'addKazooAccModal',
			size: size,
			resolve: {
					allRealms: function () {
						return $scope.accAllRealms;
					},
					allAccName: function () {
						return $scope.allAccName;
					}

				}
		});
	};

	$scope.addAccNum = function(id,name,size){
		var modalInstance = $modal.open({
			templateUrl: 'addAccNum.html',
			controller: 'addAccNumCtrl',
			size: size,
			resolve: {
					CurrentAccountId: function () {
						return id;
					},
					CurrentAccountName: function () {
						return name;
					}

				}
		});
	}

	$scope.ViewNumbers = function(id,size){
		$scope.phone_numbers=[];
		$http({url:'php-script/getNumbers.php',method:'GET',params:{'id':id}}).success(function(data,status)
		{					
			for(var i=0;i<data.length;i++)
			{
				$scope.phone_numbers.push({"number":data[i].pri_number,"dt_number":data[i].dt_number, "account_id":data[i].account_id, 'caller_id_number': data[i].caller_id_number});
			}
		});
		var modalInstance = $modal.open({
			templateUrl: 'viewNumbersModal.html',
			controller: 'viewmodalNumberCtrl',
			size: size,
			resolve: {
						CurrentAccountId: function () {
						return id;
						},
						phnNumbers: function () {
						return $scope.phone_numbers;
						}
				}
		});
	}


	$scope.editAccNum = function(id,size){
		$http({url:'php-script/editClient.php',method:'GET',params:{'id':id}}).success(function(data,status)
		{					
			$scope.clientData = data[0];
			var modalInstance = $modal.open({
			templateUrl: 'editAccNum.html',
			controller: 'editAccNumCtrl',
			size: size,
			resolve: {
					CurrentAccountId: function () {
						return id;
					},
					clientData: function () {
						return $scope.clientData
					}
				}
			});
		});
		
	}

	$scope.addProfile = function(id,account_name,size){
		var modalInstance = $modal.open({
			templateUrl: 'addClientModal.html',
			controller: 'AddProfileCtrl',
			size: size,
			resolve: {
					CurrentAccountId: function () {
						return id;
					},
					account_name: function () {
						return account_name;
					}
				}
		});
	}

	$(function() {
   $("a").click(function() {
      // remove classes from all
      $("a").removeClass("active");
      // add class to the one we clicked
      $(this).addClass("active");
   });
});

	$scope.addPlan = function(id,size){
		$http({url:'php-script/getPlans.php',method:'GET',params:{}}).success(function(data,status)
		{					
			$scope.AllPlans = [];
			console.log(data);
			for(var i=0;i<data.length;i++)
			{
				$scope.AllPlans.push({'name': data[i].plan_name, 'value': data[i].plan_name});
			}
			console.log($scope.AllPlans);
			var modalInstance = $modal.open({
			templateUrl: 'addAccPlan.html',
			controller: 'addAccPlanCtrl',
			size: size,
			resolve: {
					CurrentAccountId: function () {
						return id;
					},
					allplans: function () {
						return $scope.AllPlans
					}
				}
			});
		});
		
	}

	$scope.editAccPlan = function(id,size){
		$http({url:'php-script/getPlans.php',method:'GET',params:{}}).success(function(data,status)
		{					
			$scope.AllPlans = [];
			for(var i=0;i<data.length;i++)
			{
				$scope.AllPlans.push({'name': data[i].plan_name, 'value': data[i].plan_name});
			}
			console.log($scope.AllPlans);
		});
		$http({url:'php-script/editClient.php',method:'GET',params:{'id':id}}).success(function(data,status)
		{					
			$scope.clientData = data[0];
			var modalInstance = $modal.open({
			templateUrl: 'editAccPlan.html',
			controller: 'editAccPlanCtrl',
			size: size,
			resolve: {
					CurrentAccountId: function () {
						return id;
					},
					clientData: function () {
						return $scope.clientData
					},
					allplans: function () {
						return $scope.AllPlans
					}
				}
			});
		});
		
	}

	$scope.addKyc = function(id,size){
		// var modalInstance = $modal.open({
		// 	templateUrl: 'addAccNum.html',
		// 	controller: 'addAccNumCtrl',
		// 	size: size,
		// 	resolve: {
		// 			CurrentAccountId: function () {
		// 				return id;
		// 			}
		// 		}
		// });
	}





	$scope.AddClientDiv=function(id)
	{
			document.getElementById('showClients').style.display='none';
			document.getElementById('createNewClient').style.display='block';
			$scope.SelectedAccount = id;
			$scope.addAccNum($scope.SelectedAccount);
	}


	$scope.ShowClientDiv=function()
	{
			$scope.getClients();
			document.getElementById('showClients').style.display='block';
			document.getElementById('createNewClient').style.display='none';
			$scope.SelectedAccount = '';
			
	}


	$scope.EditClient = function (id, account_name) {
		$http({url:'php-script/editClient.php',method:'GET',params:{'id':id}}).success(function(data,status)
			{
				var userdetail = data[0];
				console.log(userdetail);
		var modalInstance = $modal.open({
			templateUrl: 'editClientModal.html',
			controller: 'editmodalCtrl',
			resolve: {
					userdetail: function () {
					return userdetail;
					},
					CurrentAccountId: function () {
					return id;
					},
					accountName: function () {
						return account_name;
					}
			}
			});
		});	
	}

	$scope.deleteClient = function (id) {
		var con = confirm('Are you sure to delete this client ?')
		if(con == true){
			$http({url:'php-script/deleteClient.php',method:'GET',params:{'id':id}}).success(function(data,status)
			{
				$state.reload();
			});
		}
	}

	$scope.AddNewUsr = function(id,account_name,size){
		var modalInstance = $modal.open({
			templateUrl: 'addUserModal.html',
			controller: 'modalUserCtrl',
			size: size,
			resolve: {
						CurrentAccountId: function () {
						return id;
						},
						CurrentAccountName: function () {
						return account_name;
						}
				}
		});
	}

	$scope.ViewUsers = function(id,size){
		$scope.users=[];
			$http.get('http://43.252.243.10:8000/v1/'+'accounts/'+id+'/users', {
					headers: {'X-Auth-Token': authId}}).then(function(data) {
						console.log(data);
						var result=data.data.data;
						for(var i=0; i<=result.length;i++){
							var name = result[i].first_name + ' ' + result[i].last_name; 
							$scope.users.push({'name':  name,'id':result[i].id,'email':result[i].email});
						}
			 });
			var modalInstance = $modal.open({
				templateUrl: 'viewUsersModal.html',
				controller: 'viewmodalUserCtrl',
				size: size,
				resolve: {
							CurrentAccountId: function () {
							return id;
							},
							Users: function () {
							return $scope.users;
							}
					}
			});
	}


}]);



MetronicApp.controller('viewAccmodalCtrl',["$modalInstance", "$scope", "$http", "$state", "accName", "accRealm", function( $modalInstance, $scope,$http, $state, accName, accRealm ) {
		$scope.accName = accName;
		$scope.accRealm = accRealm;
		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

}]);









MetronicApp.controller('AddProfileCtrl',["$modalInstance", "$scope", "$http", "$state", "CurrentAccountId", "account_name", function( $modalInstance, $scope,$http, $state, CurrentAccountId, account_name ) {
	$scope.newClient={};
	$scope.newClient.account_name = account_name;

	 // $(function () {
		//         $("#addButton").attr("disabled", "disabled");

		//             $("#email").blur(function () {
		//                 checkdata();
		//             });

		//     });


		$scope.checkData = function()
		{
			var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

			    if (!filter.test($scope.newClient.email)) {
			    	document.getElementById('emailValid').innerHTML='Email Not Valid.';
			    	document.getElementById('emailValid').style.display='block';
			    	$("#addButton").attr("disabled", "disabled");
			 }else{
					$http({url:'php-script/checkEmail.php',method:'GET',params:{'email':$scope.newClient.email}}).success(function(data,status)
					{
						if(data.msg=='success')
						{
			    			document.getElementById('emailValid').style.display='none';
			    			$("#addButton").removeAttr("disabled", "false");
						}
						else
						{
							document.getElementById('emailValid').innerHTML='Email Not Available.';
			    			document.getElementById('emailValid').style.display='block';
						}
					});
			}	
		}
		$scope.AddClient = function()
		{
			$scope.email_notify = 0;
			$scope.sms_notify = 0;
			if ($('#email_notification').is(":checked"))
			{
				$scope.email_notify = 1;
			}
			if ($('#sms_notification').is(":checked"))
			{
				$scope.sms_notify = 1;
			}
			if ($('#call_forward').is(":checked"))
			{
				var sendData1 = {"data":{
					'first_name': $scope.newClient.first_name,
					'last_name': $scope.newClient.last_name,
					'username': $scope.newClient.email,
					'priv_level': 'admin',
					'password': $scope.newClient.password,
					'vm_to_email_enabled': true,
					'fax_to_email_enabled': true,
					'email': $scope.newClient.email,
					'verified': true,
					'call_forward':{'enabled':true,'number':$scope.newClient.mobile_number,'substitute':true,'require_keypress':false,'keep_caller_id'
	:false,'direct_calls_only':false}
					}
				};
				$scope.call_forward_enabled = 1;
			}
			else
			{
				var sendData1 = {"data":{
					'first_name': $scope.newClient.first_name,
					'last_name': $scope.newClient.last_name,
					'username': $scope.newClient.email,
					'priv_level': 'admin',
					'password': $scope.newClient.password,
					'vm_to_email_enabled': true,
					'fax_to_email_enabled': true,
					'email': $scope.newClient.email,
					'verified': true
					}
				};
			}
			var sendData = {
				'account_id':CurrentAccountId,
				'first_name': $scope.newClient.first_name,
				'last_name': $scope.newClient.last_name,
				'username': $scope.newClient.email,
				'company_name': $scope.newClient.company_name,
				'password': $scope.newClient.password,
				'address': $scope.newClient.address,
				'zip_code': $scope.newClient.zip_code,
				'company_phone': $scope.newClient.company_phone,
				'state': $scope.newClient.state,
				'mobile_number': $scope.newClient.mobile_number,
				'city': $scope.newClient.city,
				'country': $scope.newClient.country,
				'email': $scope.newClient.email,
				'date_joining': $scope.date_from,
				'nature_of_business': $scope.newClient.nature_of_business,
				'job_title': $scope.newClient.job_title,
				'number_of_employees': $scope.newClient.number_of_employees,
				'annual_turnover': $scope.newClient.annual_turnover,
				'email_notification': $scope.email_notify,
				'sms_notification': $scope.sms_notify,
				'call_forward_enabled':$scope.call_forward_enabled
			};
			
			if(($scope.newClient.mobile_number.toString().length == 11) && ($scope.newClient.mobile_number.toString().charAt(0) == 0))
			{
				//$http({url:'php-script/checkEmail.php',method:'GET',params:{'email':$scope.newClient.email}}).success(function(data,status)
				//{
					//if(data.msg=='success'){
						$http.put('http://43.252.243.10:8000/v1/'+'accounts/'+CurrentAccountId+'/users',sendData1, {
							headers: {'X-Auth-Token': authId}}).then(function(data) {   
								if($('#call_forward').is(":checked"))
								{
									var sendData2 =  {"data":{
											'name': $scope.newClient.first_name,
											'owner_id': data.data.data.id,
											'enabled': true,
											'device_type': 'softphone'
										},'verb':'PUT'
									};
									$http.put('http://43.252.243.10:8000/v1/'+'accounts/'+CurrentAccountId+'/devices',sendData2, {
										headers: {'X-Auth-Token': authId}}).then(function(data) {
									});
								}
								sendData.user_kazoo_id = data.data.data.id;
								$http({url:'php-script/register_client.php',method:'GET',params:{sendData}}).success(function(data,status)
								{
									$http({url:'php-script/adduser.php',method:'GET',params:{'username':$scope.newClient.email,'password':$scope.newClient.password,'account_name': account_name,'priv_level': 'admin'}}).success(function(data,status){

									});
									$modalInstance.close();
									$state.reload();
								});
						});
				//	}else{
				//		alert('Email already exists. Please try with another Email.');
				//	}
				//});	
			}
			else
			{
				alert('Mobile number is not valid.');
			}
		}
		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

}]);

MetronicApp.controller('editmodalCtrl',["$modalInstance", "$scope", "$http", "$state", "userdetail", "CurrentAccountId", "accountName", function( $modalInstance, $scope,$http, $state, userdetail, CurrentAccountId, accountName ) {
	$scope.currentUserKazooId=userdetail.user_kazoo_id;
	if(userdetail.email_notification == 1){
		userdetail.email_notification = true;
	}else{
		userdetail.email_notification = false;
	}

	if(userdetail.sms_notification == 1){
		userdetail.sms_notification = true;
	}else{
		userdetail.sms_notification = false;
	}

	if(userdetail.call_forward_enabled == 1){
		userdetail.call_forward_enabled = true;
	}else{
		userdetail.call_forward_enabled = false;
	}

	$scope.newClient=userdetail;
	$scope.newClient.mobile_number = '0' + userdetail.mobile_number;
	$scope.newClient.account_name = accountName;
	$scope.UserEmail = userdetail.email;
	$scope.date_from = userdetail.date_joining;
	$scope.checkData = function()
		{
			var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			if($scope.UserEmail != $scope.newClient.email)
			{
			    if (!filter.test($scope.newClient.email)) {
			    	document.getElementById('emailValid').innerHTML='Email Not Valid.';
			    	document.getElementById('emailValid').style.display='block';
			    	$("#addButton").attr("disabled", "disabled");
			 	}else{
					$http({url:'php-script/checkEmail.php',method:'GET',params:{'email':$scope.newClient.email}}).success(function(data,status)
					{
						if(data.msg=='success')
						{
			    			document.getElementById('emailValid').style.display='none';
			    			$("#addButton").removeAttr("disabled", "false");
						}
						else
						{
							document.getElementById('emailValid').innerHTML='Email Not Available.';
			    			document.getElementById('emailValid').style.display='block';
						}
					});
				}
			}	
		}






		$scope.updateClient = function()
		{
			$scope.email_notify = 0;
			$scope.sms_notify = 0;
			if ($('#email_notification').is(":checked"))
			{
				$scope.email_notify = 1;
			}
			if ($('#sms_notification').is(":checked"))
			{
				$scope.sms_notify = 1;
			}
			if ($('#call_forward').is(":checked"))
			{
				$scope.call_forward_enabled = 1;
				var sendData1 = {"data":{
									'first_name': $scope.newClient.first_name,
									'last_name': $scope.newClient.last_name,
									'username': $scope.newClient.email,
									'password': $scope.newClient.password,
									'email': $scope.newClient.email,
									'verified': true,
									'call_forward':{'enabled':true,'number':$scope.newClient.mobile_number,'substitute':true,'require_keypress':false,'keep_caller_id'
:false,'direct_calls_only':false}
								}
						};
			}else{
				var sendData1 = {"data":{
									'first_name': $scope.newClient.first_name,
									'last_name': $scope.newClient.last_name,
									'username': $scope.newClient.email,
									'password': $scope.newClient.password,
									'email': $scope.newClient.email,
									'verified': true,
									'call_forward':{'enabled':false,'number':$scope.newClient.mobile_number,'substitute':true,'require_keypress':false,'keep_caller_id'
:false,'direct_calls_only':false}
								}
						};
			}
			var sendData = {
				'account_id':CurrentAccountId,
				'first_name': $scope.newClient.first_name,
				'last_name': $scope.newClient.last_name,
				'username': $scope.newClient.email,
				'company_name': $scope.newClient.company_name,
				'password': $scope.newClient.password,
				'address': $scope.newClient.address,
				'zip_code': $scope.newClient.zip_code,
				'city': $scope.newClient.city,
				'company_phone': $scope.newClient.company_phone,
				'state': $scope.newClient.state,
				'mobile_number': $scope.newClient.mobile_number,
				'country': $scope.newClient.country,
				'email': $scope.newClient.email,
				'date_joining': $scope.date_from,
				'nature_of_business': $scope.newClient.nature_of_business,
				'job_title': $scope.newClient.job_title,
				'no_of_employees': $scope.newClient.number_of_employees,
				'annual_turnover': $scope.newClient.annual_turnover,
				'email_notification': $scope.email_notify,
				'sms_notification': $scope.sms_notify,
				'call_forward_enabled':$scope.call_forward_enabled
			};

			//ALTER TABLE `registration_detail` CHANGE `call_forward_enable` `call_forward_enabled` INT(1) NOT NULL DEFAULT '0';
			$http.post('http://43.252.243.10:8000/v1/'+'accounts/'+CurrentAccountId+'/users/'+$scope.currentUserKazooId,sendData1, {
				headers: {'X-Auth-Token': authId}}).then(function(data) {     
					$http({url:'php-script/register_client.php',method:'GET',params:{sendData}}).success(function(data,status)
					{
						$modalInstance.close();
						$state.reload();
					});
			});
		}
		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
}]);



MetronicApp.controller('addKazooAccModal',["$modalInstance", "$scope", "$http", "$state", "allRealms", "allAccName", function( $modalInstance, $scope,$http, $state, allRealms, allAccName) {
		$scope.realms=allRealms;
		$scope.allAccountNames = allAccName;
		$scope.addAccountFn = function (isValid) {
			if (isValid) {
				var accountId = localStorage.getItem('acc');
				var authId = localStorage.getItem('auth');
				var sendData = {"data":{
							'name': $scope.newAccount.name,
							'realm': $scope.newAccount.realm
						}
				};
				if($scope.realms.indexOf($scope.newAccount.realm) < 0)
				{
					if($scope.allAccountNames.indexOf($scope.newAccount.name) < 0)
					{	
					 	$http.put('http://43.252.243.10:8000/v1/'+'accounts/'+accountId,sendData, {
							headers: {'X-Auth-Token': authId}}).then(function(data) {
								var newAccountId = data.data.data.id;
								var sendData2 = {"data":{"numbers":["no_match"],"flow":{"children":{},"data":{},"module":"offnet"},"ui_metadata":{"ui":"kazoo-ui","version":"v3.16-2"}},"verb":"PUT"};
								var webHookData = {"data":{"name":"Notify Calls", "uri":"http://52.10.19.109/eivr/templates/admin2/angularjs/php-script/sms.php", "http_verb":"get", "hook":"channel_destroy", "retries":3},"ui_metadata":{"ui":"kazoo-ui","version":"v3.16-2"},"verb":"PUT"};
									$http.put('http://43.252.243.10:8000/v1/'+'accounts/'+newAccountId+'/callflows',sendData2, {
										 headers: {'X-Auth-Token': authId}}).then(function(data) {
											    
										 });
										 
									$http.put('http://43.252.243.10:8000/v1/'+'accounts/'+newAccountId+'/webhooks',webHookData, {
										headers: {'X-Auth-Token': authId}}).then(function(data) {
											 
										 });
									$modalInstance.close();
									$state.reload();
					 	});
					}
					else
					{
						alert('Account Name already exists. Please try again with another account name');
					}
				}
				else
				{
					alert('Realm already exists. Please try again with another realm');
				}	
			}   
		};

		$scope.cancel = function () {
				$modalInstance.dismiss('cancel');
		};
}]);


MetronicApp.controller('addAccNumCtrl',["$modalInstance", "$scope", "$http", "$state", "CurrentAccountId", "CurrentAccountName", function( $modalInstance, $scope,$http, $state, CurrentAccountId, CurrentAccountName) {
		$scope.AccountName = CurrentAccountName
		$scope.newNumber={};
		$scope.newNumber.dt_number = 0;
		$scope.newNumber.caller_id_number= 0;
		$scope.newNumber.number= '';
		$scope.addNumberFn = function (isValid) {
			if (isValid) {
				var sendData = {"data":{
					'ui_metadata': {'ui':'kazoo-ui', version:'v3.16-2'}},
					'verb': 'PUT'
				};
				if($scope.newNumber.number != '')
				{
					$http({url:'php-script/checkPri.php',method:'GET',params:{'number':$scope.newNumber.number}}).success(function(data,status)
					{
						if(data.msg == 'success'){
							$http.put('http://43.252.243.10:8000/v1/'+'accounts/'+CurrentAccountId+'/phone_numbers/'+$scope.newNumber.number,sendData, {
								headers: {'X-Auth-Token': authId}}).then(function(data) {
									$modalInstance.close();
								$http.put('http://43.252.243.10:8000/v1/'+'accounts/'+CurrentAccountId+'/phone_numbers/'+$scope.newNumber.number+'/activate',sendData, {
									headers: {'X-Auth-Token': authId}}).then(function(data) {
									$http({url:'php-script/addNum.php',method:'GET',params:{'account_id':CurrentAccountId,'dt_number':$scope.newNumber.dt_number,'caller_id_number':$scope.newNumber.caller_id_number, 'pri_number':$scope.newNumber.number}}).success(function(data,status)
										{
											
											
										});	
									
								});
							});
						} else {
							alert('Pri Number already Exist');
						}
				    });
				}
				else
				{
					alert('Please provide Pri number.');
				}
			}
		}

		$scope.cancel = function () {
				$modalInstance.dismiss('cancel');
		};
}]);


MetronicApp.controller('viewmodalNumberCtrl',["$modalInstance", "$scope", "$http", "$state", "CurrentAccountId", "phnNumbers", function( $modalInstance, $scope,$http, $state, CurrentAccountId, phnNumbers) {
		 $scope.phone_numbers=phnNumbers;

		 $scope.DeleteNumber = function(num,acc)
		 {
				var c = confirm('Are you sure to delete this number ?');
				if(c == true){
					 $http.delete('http://43.252.243.10:8000/v1/'+'accounts/'+acc+'/phone_numbers/'+num, {
						headers: {'X-Auth-Token': authId}}).then(function(data) {
							$http({url:'php-script/deleteNum.php',method:'GET',params:{'account_id':acc,'pri_number':num}}).success(function(data,status)
								{
									
								});	
						});
						$state.reload();
						$modalInstance.close();
				}
		 }
		$scope.cancel = function () {
				$modalInstance.dismiss('cancel');
		};
}]);



MetronicApp.controller('editAccNumCtrl',["$modalInstance", "$scope", "$http", "$state", "CurrentAccountId", "clientData", function( $modalInstance, $scope,$http, $state, CurrentAccountId, clientData) {
		$scope.newNumber=clientData;
		console.log($scope.newNumber);
		$scope.updateAccNum = function (isValid) {
				if (isValid) {
						// {data: {ui_metadata: {ui: "kazoo-ui", version: "v3.16-2"}}, verb: "PUT"}
						// var sendData = {"data":{
						// 			'ui_metadata': {'ui':'kazoo-ui', version:'v3.16-2'}},
						// 			'verb': 'PUT'
						// 		};
						// $http.put('http://43.252.243.10:8000/v1/'+'accounts/'+CurrentAccountId+'/phone_numbers/'+$scope.newNumber.number,sendData, {
						// 		headers: {'X-Auth-Token': authId}}).then(function(data) {
										// $http.put('http://43.252.243.10:8000/v1/'+'accounts/'+CurrentAccountId+'/phone_numbers/'+$scope.newNumber.number+'/activate',sendData, {
										// 	headers: {'X-Auth-Token': authId}}).then(function(data) {
											$http({url:'php-script/addNum.php',method:'GET',params:{'account_id':CurrentAccountId,'dt_number':$scope.newNumber.dt_number,'number_issued':$scope.newNumber.number_issued,'no_of_channels':$scope.newNumber.number_of_channels}}).success(function(data,status)
											{
												$modalInstance.close();
												
											});	
											
										//});
						 //});
						$modalInstance.close();
				}   
		};

		$scope.cancel = function () {
				$modalInstance.dismiss('cancel');
		};
}]);




MetronicApp.controller('addAccPlanCtrl',["$modalInstance", "$scope", "$http", "$state", "CurrentAccountId", "allplans", function( $modalInstance, $scope,$http, $state, CurrentAccountId, allplans) {
		$scope.accPlan={};
		$scope.AllPlans = allplans;
		$scope.accPlan = function (isValid) {
			if (isValid) {
					var sendData1 = {"data":{"amount":$scope.accPlan.credits,"ui_metadata":{"ui":"kazoo-ui","version":"v3.16-2"}},"verb":"PUT"};
					$http.put('http://43.252.243.10:8000/v1/'+'accounts/'+CurrentAccountId+'/braintree/credits',sendData1, {
						headers: {'X-Auth-Token': authId}}).then(function(data) {
							$http({url:'php-script/AddPlan.php',method:'GET',params:{'account_id':CurrentAccountId,'plan':$scope.accPlan.plan, 'from':$scope.date_planfrom, 'to':$scope.date_planto, 'credits':$scope.accPlan.credits}}).success(function(data,status)
							{

							});
					});
					$modalInstance.close();
					$state.reload();
			}   
		};

		$scope.cancel = function () {
				$modalInstance.dismiss('cancel');
		};
}]);


MetronicApp.controller('editAccPlanCtrl',["$modalInstance", "$scope", "$http", "$state", "CurrentAccountId", "allplans", "clientData", function( $modalInstance, $scope,$http, $state, CurrentAccountId, allplans, clientData) {
		$scope.accPlan=clientData;
		console.log(clientData);
		$scope.credits = clientData.credits;
		$scope.AllPlans = allplans;
		$scope.date_planfrom = clientData.plan_valid_from;
		$scope.date_planto = clientData.plan_valid_upto;

		$scope.updateAccPlan = function () {
					if($scope.accPlan.credits != $scope.credits)
					{
						 var totalCredits = parseInt($scope.accPlan.credits) + parseInt($scope.credits);
						// if(totalCredits < 501)
						// {
							var sendData1 = {"data":{"amount":$scope.accPlan.credits,"ui_metadata":{"ui":"kazoo-ui","version":"v3.16-2"}},"verb":"PUT"};
							$http.put('http://43.252.243.10:8000/v1/'+'accounts/'+CurrentAccountId+'/braintree/credits',sendData1, {
								headers: {'X-Auth-Token': authId}}).then(function(data) {
									$http({url:'php-script/AddPlan.php',method:'GET',params:{'account_id':CurrentAccountId,'plan':$scope.accPlan.plan, 'from':$scope.date_planfrom, 'to':$scope.date_planto, 'credits':totalCredits}}).success(function(data,status)
									{
										$modalInstance.close();
									});
									
							});
						// }
						// else
						// {
						// 	alert('credits cannot be exceeds 500');
						// }
					} 
					else
					{
						$http({url:'php-script/AddPlan.php',method:'GET',params:{'account_id':CurrentAccountId,'plan':$scope.accPlan.plan, 'from':$scope.date_planfrom, 'to':$scope.date_planto, 'credits':$scope.accPlan.credits}}).success(function(data,status)
							{
								$modalInstance.close();
							});
					} 
		};

		$scope.cancel = function () {
				$modalInstance.dismiss('cancel');
		};
}]);


MetronicApp.controller('viewmodalUserCtrl',["$modalInstance", "$scope", "$http", "$state", "CurrentAccountId", "Users", "$modal", function( $modalInstance, $scope,$http, $state, CurrentAccountId, Users, $modal) {
		 $scope.users=Users;

		$scope.DeleteUser = function(id){
			var c = confirm('Are you sure to delete this user ?');
				if(c == true){
							$http.delete('http://43.252.243.10:8000/v1/'+'accounts/'+CurrentAccountId+'/users/'+id, {
								headers: {'X-Auth-Token': authId}}).then(function(data) {
								
								$http({url:'php-script/deleteClient.php',method:'GET',params:{'id':id}}).success(function(data,status)
								{
	
								});		

							});

							$state.reload();
							$modalInstance.close();
				}
		}



		$scope.EditUser=function(id){

							$http.get('http://43.252.243.10:8000/v1/'+'accounts/'+CurrentAccountId+'/users/'+id, {
								headers: {'X-Auth-Token': authId}}).then(function(data) {
										var userD = data.data.data;
										$modalInstance.close();
										// $scope.firstname = data.data.data.first_name;
										// $scope.lastname = data.data.data.last_name;
										// $scope.id = id;
										// $scope.email = data.data.data.email;
										// $scope.call_forwardEnable = data.data.data.call_forward.enabled;
										// $scope.call_forwardNumber = data.data.data.call_forward.number;
										// $scope.priv_level = data.data.data.priv_level;
										// $scope.voicemail = data.data.data.vm_to_email_enabled;
										// $scope.faxEn = data.data.data.fax_to_email_enabled;
										// $scope.username = data.data.data.username;
										var modalInstance = $modal.open({
											templateUrl: 'EditUserModal.html',
											controller: 'modalEditUserCtrl',
											resolve: {
														CurrentAccountId: function () {
														return CurrentAccountId;
														},
														userData: function () {
														return userD;
														}
												}
										});
									});

								//$state.reload();
		}


		$scope.cancel = function () {
				$modalInstance.dismiss('cancel');
		};
}]);



MetronicApp.controller('modalUserCtrl',["$modalInstance", "$scope", "$http", "$state", "CurrentAccountId", "CurrentAccountName", function( $modalInstance, $scope,$http, $state, CurrentAccountId, CurrentAccountName) {
		$scope.newUser={};

		$scope.checkData = function()
		{
			var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		    if (!filter.test($scope.newClient.email)) {
		    	document.getElementById('emailValid').innerHTML='Email Not Valid.';
		    	document.getElementById('emailValid').style.display='block';
		    	$("#addButton").attr("disabled", "disabled");
		 	}else{
				$http({url:'php-script/checkEmail.php',method:'GET',params:{'email':$scope.newUser.email}}).success(function(data,status)
				{
					if(data.msg=='success')
					{
		    			document.getElementById('emailValid').style.display='none';
		    			$("#addButton").removeAttr("disabled", "false");
					}
					else
					{
						document.getElementById('emailValid').innerHTML='Email Not Available.';
		    			document.getElementById('emailValid').style.display='block';
					}
				});
			}	
		}


			$scope.addUsrFn = function (isValid) {
				$scope.vm = false;
				$scope.fx = false;
				$scope.fwd = false;
				if ($('#vm').is(":checked"))
				{
					$scope.vm = true;
				}
				if ($('#fax').is(":checked"))
				{
					$scope.fx = true;
				}
				// if ($('#call_fwd').is(":checked"))
				// {
					$scope.fwd = true;
				//}
				if (isValid) { 
						var sendData = {"data":{
									'first_name': $scope.newUser.firstname,
									'last_name': $scope.newUser.lastname,
									'username': $scope.newUser.email,
									'priv_level': $scope.newUser.priv_level,
									'password': $scope.newUser.password,
									'vm_to_email_enabled': $scope.vm,
									'fax_to_email_enabled': $scope.fx,
									'email': $scope.newUser.email,
									'verified': true,
									'call_forward':{'enabled':$scope.fwd,'number':$scope.newUser.number,'substitute':true,'require_keypress':false,'keep_caller_id'
:false,'direct_calls_only':false}
								}
						};

						//$http({url:'php-script/checkEmail.php',method:'GET',params:{'email':$scope.newUser.email}}).success(function(data,status)
						//{
						//	if(data.msg=='success'){
								$http.put('http://43.252.243.10:8000/v1/'+'accounts/'+CurrentAccountId+'/users',sendData, {
									headers: {'X-Auth-Token': authId}}).then(function(data) {         
											var sendData1 =  {"data":{
												'name': $scope.newUser.firstname,
												'owner_id': data.data.data.id,
												'enabled': true,
												'device_type': 'softphone'
											},'verb':'PUT'
										};
											$http.put('http://43.252.243.10:8000/v1/'+'accounts/'+CurrentAccountId+'/devices',sendData1, {
												headers: {'X-Auth-Token': authId}}).then(function(data) {
															 $http({url:'php-script/adduser.php',method:'GET',params:{'username':$scope.newUser.email,'password':$scope.newUser.password,'account_name': CurrentAccountName,'priv_level': $scope.newUser.priv_level}}).success(function(data,status){

															 });

											$state.reload();
										});
							 	});
									$modalInstance.close();
							//}else{
							//	alert('Email already exists. Please try with another Email.');
							//}
						//});
						
				}   
		};

		$scope.cancel = function () {
				$modalInstance.dismiss('cancel');
		};
}]);



MetronicApp.controller('modalEditUserCtrl',["$modalInstance", "$scope", "$http", "$state", "CurrentAccountId", "userData", function( $modalInstance, $scope,$http, $state, CurrentAccountId, userData) {
		console.log(userData);
		$scope.UserEmail = userData.email;
		$scope.newUser={};

		$scope.checkData = function()
		{
			var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			if($scope.UserEmail != $scope.newUser.email)
			{
			    if (!filter.test($scope.newClient.email)) {
			    	document.getElementById('emailValid').innerHTML='Email Not Valid.';
			    	document.getElementById('emailValid').style.display='block';
			    	$("#addButton").attr("disabled", "disabled");
			 	}else{
					$http({url:'php-script/checkEmail.php',method:'GET',params:{'email':$scope.newClient.email}}).success(function(data,status)
					{
						if(data.msg=='success')
						{
			    			document.getElementById('emailValid').style.display='none';
			    			$("#addButton").removeAttr("disabled", "false");
						}
						else
						{
							document.getElementById('emailValid').innerHTML='Email Not Available.';
			    			document.getElementById('emailValid').style.display='block';
						}
					});
				}
			}	
		}


		$http({url:'php-script/getUser.php',method:'GET',params:{'email':userData.email}}).success(function(data,status)
		{
			$scope.newUser.password = data.password;
		});
	
		$scope.newUser={
									'firstname': userData.first_name,
									'lastname': userData.last_name,
									'username': userData.username,
									'priv_level': userData.priv_level,
									'password': userData.password,
									'voicemail': userData.vm_to_email_enabled,
									'fax': userData.fax_to_email_enabled,
									'email': userData.email,
									'verified': true,
									'call_fwd':userData.call_forward.enabled,
									'number':userData.call_forward.number
								};
		//$scope.UserData = userData;
		$scope.EditUsrFn = function (isValid) {
				$scope.vm = false;
				$scope.fx = false;
				$scope.fwd = false;
				if ($('#vm').is(":checked"))
				{
					$scope.vm = true;
				}
				if ($('#fax').is(":checked"))
				{
					$scope.fx = true;
				}
				if ($('#call_fwd').is(":checked"))
				{
					$scope.fwd = true;
				}
				if (isValid) {
					if($scope.newUser.password == '')
					{
						var sendData = {"data":{
									'first_name': $scope.newUser.firstname,
									'last_name': $scope.newUser.lastname,
									'username': $scope.newUser.email,
									'priv_level': $scope.newUser.priv_level,
									'vm_to_email_enabled': $scope.vm,
									'fax_to_email_enabled': $scope.fx,
									'email': $scope.newUser.email,
									'verified': true,
									'call_forward':{'enabled':$scope.fwd,'number':$scope.newUser.number,'substitute':true,'require_keypress':false,'keep_caller_id'
:false,'direct_calls_only':false}
								}
						};
					}else{
						var sendData = {"data":{
									'first_name': $scope.newUser.firstname,
									'last_name': $scope.newUser.lastname,
									'username': $scope.newUser.email,
									'priv_level': $scope.newUser.priv_level,
									'password': $scope.newUser.password,
									'vm_to_email_enabled': $scope.vm,
									'fax_to_email_enabled': $scope.fx,
									'email': $scope.newUser.email,
									'verified': true,
									'call_forward':{'enabled':$scope.fwd,'number':$scope.newUser.number,'substitute':true,'require_keypress':false,'keep_caller_id'
:false,'direct_calls_only':false}
								}
						};
					}
						

						$http.post('http://43.252.243.10:8000/v1/'+'accounts/'+CurrentAccountId+'/users/'+userData.id,sendData, {
								headers: {'X-Auth-Token': authId}}).then(function(data) {         
									//   var sendData1 =  {"data":{
									//     'name': $scope.newUser.device_name,
									//     'owner_id': data.data.data.id,
									//     'enabled': true,
									//     'device_type': 'softphone'
									//   },'verb':'POST'
									// };
									//   $http.put('http://43.252.243.10:8000/v1/'+'accounts/'+CurrentAccountId+'/devices',sendData1, {
									//     headers: {'X-Auth-Token': authId}}).then(function(data) {
									//            // $http({url:'php-script/adduser.php',method:'GET',params:{'username':$scope.newUser.email,'password':$scope.newUser.password,'account_name': CurrentAccountName,'priv_level': $scope.newUser.priv_level}}).success(function(data,status){

									//            // });

										 $state.reload();
									// });
						 });
						$modalInstance.close();
				}   
		};

		$scope.cancel = function () {
				$modalInstance.dismiss('cancel');
		};
}]);


MetronicApp.directive('datepickerfrom', function () {
	return {
		restrict: 'A',
		require: 'ngModel',
		 link: function (scope, element, attrs, ngModelCtrl) {
			element.datepicker({
				dateFormat: 'dd/mm/yy',
				onSelect: function (date) {
					scope.date_from = date;
					scope.$apply();
				}
			});
		}
	};
});
MetronicApp.directive('datepickerjoin', function () {
	return {
		restrict: 'A',
		require: 'ngModel',
		 link: function (scope, element, attrs, ngModelCtrl) {
			element.datepicker({
				dateFormat: 'dd/mm/yy',
				onSelect: function (date) {
					scope.date_from = date;
					scope.$apply();
				}
			});
		}
	};
});
MetronicApp.directive('datepickerplanfrom', function () {
	return {
		restrict: 'A',
		require: 'ngModel',
		 link: function (scope, element, attrs, ngModelCtrl) {
			element.datepicker({
				dateFormat: 'dd/mm/yy',
				onSelect: function (date) {
					scope.date_planfrom = date;
					scope.$apply();
				}
			});
		}
	};
});
MetronicApp.directive('datepickerplanto', function () {
	return {
		restrict: 'A',
		require: 'ngModel',
		 link: function (scope, element, attrs, ngModelCtrl) {
			element.datepicker({
				dateFormat: 'dd/mm/yy',
				onSelect: function (date) {
					scope.date_planto = date;
					scope.$apply();
				}
			});
		}
	};
});
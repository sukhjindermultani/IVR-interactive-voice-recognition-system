MetronicApp.controller('ClientController', function($rootScope, $scope, $http, $timeout,$location,$modal,$state, Restangular) {
		$scope.$on('$viewContentLoaded', function() {   
			// initialize core components
			Metronic.initAjax();
			dashboard.checkSession();

		});

	$scope.SelectedAccount = '';
	$scope.accAllRealms = [];
	$scope.allAccName = [];
	$scope.AllClients = [];
	$scope.PlanIDS = [];
	$scope.sortType     = 'name';
	$scope.sortReverse  = false; 
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
	
	/* This methos brings all accounts from Kazoo which come under the logged in account. 
	It takes current logged in account id and auth from local storage.
	Response is an array of accounts in which each account consists of id, name and realm of that account.*/
	$scope.getAllAccounts=function()
	{
			$scope.AllAccounts = [];
			var accountId = localStorage.getItem('acc');
			var authId = localStorage.getItem('auth');
			var auth = Restangular.one("accounts/"+accountId+"/children")
			var data1 = '';
			auth.get(data1,{'X-AUTH-TOKEN': authId}).then(function(data){
				//if(data.status == 'success')
				//{
						var accounts= data.data;
						//console.log(data.data);
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

	/* This method removes the selected account from both Kazoo and local database*/
	$scope.deleteAcc=function(acc,acc_name)
	{
		var con = confirm('Are you sure to delete this account ?');
		if(con == true){
			var authId = localStorage.getItem('auth');
			var auth = Restangular.one("accounts/"+acc)
			var data1 = '';
			auth.remove(data1,{'X-AUTH-TOKEN': authId}).then(function(data){
					if(data.status == 'success')
					{
						$http({url:'php-script/deleteAcc.php',method:'GET',params:{'account_name':acc_name, 'account_id':acc}}).success(function(data,status){
							alert('Account deleted successfully');
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
			document.getElementById('id_add_plan_'+id).style.display='none';
		}
		else
		{
			
			if($scope.AllClients.indexOf(id) > -1)
			{
				document.getElementById('id_edit_plan'+id).style.display='none';
				document.getElementById('id_add_plan'+id).style.display='block';
				document.getElementById('id_add_plan_'+id).style.display='none';
			}
			else
			{
				document.getElementById('id_edit_plan'+id).style.display='none';
				document.getElementById('id_add_plan'+id).style.display='none';
				document.getElementById('id_add_plan_'+id).style.display='block';
			}
				
		}		
		return true;		
	}

	/* This method opens the pop up to view the account and sets its controller */
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

	
/* This method opens the pop up to add a new account and sets its controller */
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

	/* This method opens the pop up to add number to the account and sets its controller */
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

	/* This method shows the numbers associated with the selected account in a pop up. */
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


	

	/* This method open the pop up to add profile for the selected account.*/
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

/* This method opens the popup to add plan for the selected account.*/
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

	/* This method opens the popup to edit existing plan for selected account*/
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
			var authId = localStorage.getItem('auth');
			var auth = Restangular.one("accounts/"+id+"/users")
			var data1 = '';
			auth.get(data1,{'X-AUTH-TOKEN': authId}).then(function(data){
						var result=data.data;
						for(var i=0; i<result.length;i++){
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


});



MetronicApp.controller('viewAccmodalCtrl',function( $modalInstance, $scope,$http, $state, accName, accRealm ) {
		$scope.accName = accName;
		$scope.accRealm = accRealm;
		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

});









MetronicApp.controller('AddProfileCtrl',function( $modalInstance, $scope,$http, $state, CurrentAccountId, account_name, Restangular) {
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
			$scope.sms_notify_for_caller = 0;
			if ($('#email_notification').is(":checked"))
			{
				$scope.email_notify = 1;
			}
			if ($('#sms_notification').is(":checked"))
			{
				$scope.sms_notify = 1;
			}
			if ($('#sms_notification_for_caller').is(":checked"))
			{
				$scope.sms_notify_for_caller = 1;
			}
			if ($('#call_forward').is(":checked"))
			{
				var sendData1 = {
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
					};
				$scope.call_forward_enabled = 1;
			}
			else
			{
				var sendData1 = {
					'first_name': $scope.newClient.first_name,
					'last_name': $scope.newClient.last_name,
					'username': $scope.newClient.email,
					'priv_level': 'admin',
					'password': $scope.newClient.password,
					'vm_to_email_enabled': true,
					'fax_to_email_enabled': true,
					'email': $scope.newClient.email,
					'verified': true
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
				'sms_notification_for_caller': $scope.sms_notify_for_caller,
				'call_forward_enabled':$scope.call_forward_enabled
			};
			
			if(($scope.newClient.mobile_number.toString().length == 11) && ($scope.newClient.mobile_number.toString().charAt(0) == 0))
			{
				//$http({url:'php-script/checkEmail.php',method:'GET',params:{'email':$scope.newClient.email}}).success(function(data,status)
				//{
					//if(data.msg=='success'){
						var authId = localStorage.getItem('auth');
						var newUsr = Restangular.one("accounts/"+CurrentAccountId+"/users")
							var data1 = '';
							newUsr.data = sendData1;
							newUsr.put(data1,{'X-AUTH-TOKEN': authId}).then(function(data){  
								if($('#call_forward').is(":checked"))
								{
									var sendData2 =  {
											'name': $scope.newClient.first_name,
											'owner_id': data.data.id,
											'enabled': true,
											'device_type': 'softphone'
										};
										var newDevice = Restangular.one("accounts/"+CurrentAccountId+"/devices")
										var data1 = '';
										newDevice.data = sendData2;
										newDevice.put(data1,{'X-AUTH-TOKEN': authId}).then(function(data){
									});
								}
								sendData.user_kazoo_id = data.data.id;
								$http({url:'php-script/register_client.php',method:'GET',params:{sendData}}).success(function(data,status)
								{
									$modalInstance.close();
									alert('Profile added successfully');
									$state.reload();
									$http({url:'php-script/adduser.php',method:'GET',params:{'username':$scope.newClient.email,'password':$scope.newClient.password,'account_name': account_name,'priv_level': 'admin','mobile_number':$scope.newClient.mobile_number,'sms_notification':$scope.sms_notify,'email_notification':$scope.email_notify}}).success(function(data,status){

									});
									$http({url:'php-script/add_user_numbers.php',method:'GET',params:{'account_id':CurrentAccountId,'number':$scope.newClient.mobile_number}}).success(function(data,status){

									});
									
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

});

MetronicApp.controller('editmodalCtrl',function( $modalInstance, $scope,$http, $state, userdetail, CurrentAccountId, accountName ) {
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
	
	if(userdetail.sms_notification_for_caller == 1){
		userdetail.sms_notification_for_caller = true;
	}else{
		userdetail.sms_notification_for_caller = false;
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
			$scope.sms_notify_for_caller = 0;
			$scope.call_forward_enabled = 0;
			if ($('#email_notification').is(":checked"))
			{
				$scope.email_notify = 1;
			}
			if ($('#sms_notification').is(":checked"))
			{
				$scope.sms_notify = 1;
			}
			if ($('#sms_notification_for_caller').is(":checked"))
			{
				$scope.sms_notify_for_caller = 1;
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
				'number_of_employees': $scope.newClient.number_of_employees,
				'annual_turnover': $scope.newClient.annual_turnover,
				'email_notification': $scope.email_notify,
				'sms_notification': $scope.sms_notify,
				'sms_notification_for_caller': $scope.sms_notify_for_caller,
				'call_forward_enabled':$scope.call_forward_enabled
			};

			var authId = localStorage.getItem('auth');
			console.log(authId);
			//ALTER TABLE `registration_detail` CHANGE `call_forward_enable` `call_forward_enabled` INT(1) NOT NULL DEFAULT '0';

			$http({url:'php-script/updateUserInKazoo.php',method:'GET',params:{'account_id':CurrentAccountId,'id':$scope.currentUserKazooId,'auth':authId,'sendData':sendData1}}).success(function(data,status)
			{    
					$http({url:'php-script/register_client.php',method:'GET',params:{sendData}}).success(function(data,status)
					{
						$modalInstance.close();
						$state.reload();
						$http({url:'php-script/add_user_numbers.php',method:'GET',params:{'account_id':CurrentAccountId, 'number':$scope.newClient.mobile_number}}).success(function(data,status)
						{
							alert('Profile updated successfully');
						});
						
					});
			});
		}
		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
});



MetronicApp.controller('addKazooAccModal',function( $modalInstance, $scope,$http, $state, allRealms, allAccName, Restangular) {
		$scope.realms=allRealms;
		$scope.allAccountNames = allAccName;
		$scope.addAccountFn = function (isValid) {
			if (isValid) {
				var accountId = localStorage.getItem('acc');
				var authId = localStorage.getItem('auth');
				var sendData = {
							'name': $scope.newAccount.name,
							'realm': $scope.newAccount.realm
				};
				if($scope.realms.indexOf($scope.newAccount.realm) < 0)
				{
					if($scope.allAccountNames.indexOf($scope.newAccount.name) < 0)
					{	
						var newAcc = Restangular.one("accounts/"+accountId)
						var data1 = '';
						newAcc.data = sendData;
						newAcc.put(data1,{'X-AUTH-TOKEN': authId}).then(function(data){
								var newAccountId = data.data.id;
								var sendData2 = {"data":{"numbers":["no_match"],"flow":{"children":{},"data":{},"module":"offnet"},"ui_metadata":{"ui":"kazoo-ui","version":"v3.16-2"}},"verb":"PUT"};
								var webHookData = {"data":{"name":"Notify Calls", "uri":"http://43.252.243.10/eivr/php-script/sms.php", "http_verb":"get", "hook":"channel_destroy", "retries":3},"ui_metadata":{"ui":"kazoo-ui","version":"v3.16-2"},"verb":"PUT"};
									$http.put('http://43.252.243.10:8000/v1/'+'accounts/'+newAccountId+'/callflows',sendData2, {
										 headers: {'X-Auth-Token': authId}}).then(function(data) {
											    
										 });
										 
									$http.put('http://43.252.243.10:8000/v1/'+'accounts/'+newAccountId+'/webhooks',webHookData, {
										headers: {'X-Auth-Token': authId}}).then(function(data) {
											 
										 });
									$modalInstance.close();
									alert('Account successfully created');
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
});


MetronicApp.controller('addAccNumCtrl',function( $modalInstance, $scope,$http, $state, CurrentAccountId, CurrentAccountName, Restangular) {
		$scope.AccountName = CurrentAccountName
		$scope.newNumber={};
		$scope.newNumber.dt_number = 0;
		$scope.newNumber.caller_id_number= 0;
		$scope.newNumber.number= '';
		$scope.addNumberFn = function (isValid) {
			if (isValid) {
				var sendData = {
					'ui_metadata': {'ui':'kazoo-ui', version:'v3.16-2'}};
				if($scope.newNumber.number != '')
				{
					$http({url:'php-script/checkPri.php',method:'GET',params:{'number':$scope.newNumber.number}}).success(function(data,status)
					{
						if(data.msg == 'success'){
							var authId = localStorage.getItem('auth');
							var newNumbr = Restangular.one("accounts/"+CurrentAccountId+"/phone_numbers/"+$scope.newNumber.number);
							var data1 = '';
							newNumbr.data = sendData;
							newNumbr.put(data1,{'X-AUTH-TOKEN': authId}).then(function(data){
									$modalInstance.close();
									var newNumbrActivate = Restangular.one("accounts/"+CurrentAccountId+"/phone_numbers/"+$scope.newNumber.number+"/activate")
									var data1 = '';
									newNumbrActivate.data = sendData;
									newNumbrActivate.put(data1,{'X-AUTH-TOKEN': authId}).then(function(data){
									$http({url:'php-script/addNum.php',method:'GET',params:{'account_id':CurrentAccountId,'dt_number':$scope.newNumber.dt_number,'caller_id_number':$scope.newNumber.caller_id_number, 'pri_number':$scope.newNumber.number}}).success(function(data,status)
										{
											alert('Number succssfully added');
											
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
});


MetronicApp.controller('viewmodalNumberCtrl',function( $modalInstance,$modal, $scope,$http, $state, CurrentAccountId, phnNumbers, Restangular) {
		 $scope.phone_numbers=phnNumbers;

		 $scope.DeleteNumber = function(num,acc)
		 {
				var c = confirm('Are you sure to delete this number ?');
				if(c == true){
					var authId = localStorage.getItem('auth');
					var auth = Restangular.one("accounts/"+acc+"/phone_numbers/"+num)
					var data1 = '';
					auth.remove(data1,{'X-AUTH-TOKEN': authId}).then(function(data){
							$http({url:'php-script/deleteNum.php',method:'GET',params:{'account_id':acc,'pri_number':num}}).success(function(data,status)
								{
									alert('Number has been deleted');
								});	
						});
						$state.reload();
						$modalInstance.close();
				}
		 }
		 
		 $scope.editAccNum = function(id,number,size){
		$http({url:'php-script/getNumber.php',method:'GET',params:{'id':id, 'number':number}}).success(function(data,status)
		{					
			$scope.numberData = data;
			$modalInstance.close();
			var modalInstance = $modal.open({
			templateUrl: 'editAccNum.html',
			controller: 'editAccNumCtrl',
			size: size,
			resolve: {
					CurrentAccountId: function () {
						return id;
					},
					numberData: function () {
						return $scope.numberData
					}
				}
			});
		});
		
	}
	
		$scope.cancel = function () {
				$modalInstance.dismiss('cancel');
		};
});



MetronicApp.controller('editAccNumCtrl',function( $modalInstance, $scope,$http, $state,Restangular, CurrentAccountId, numberData) {
		$scope.newNumber=numberData;
		$scope.number = numberData.pri_number;
$scope.updateAccNum = function (isValid) {
			if (isValid) {
				if($scope.newNumber.number != ''){
					if($scope.newNumber.pri_number != $scope.number){
						var sendData = {'ui_metadata': {'ui':'kazoo-ui', version:'v3.16-2'}};
						$http({url:'php-script/checkPri.php',method:'GET',params:{'number':$scope.newNumber.pri_number}}).success(function(data,status)
					{
						if(data.msg == 'success'){
							var authId = localStorage.getItem('auth');
							var auth = Restangular.one("accounts/"+CurrentAccountId+"/phone_numbers/"+$scope.number)
							var data1 = '';
							auth.remove(data1,{'X-AUTH-TOKEN': authId}).then(function(data){
								var newNumbr = Restangular.one("accounts/"+CurrentAccountId+"/phone_numbers/"+$scope.newNumber.pri_number);
							var data1 = '';
							newNumbr.data = sendData;
							newNumbr.put(data1,{'X-AUTH-TOKEN': authId}).then(function(data){
									$modalInstance.close();
									var newNumbrActivate = Restangular.one("accounts/"+CurrentAccountId+"/phone_numbers/"+$scope.newNumber.pri_number+"/activate")
									var data1 = '';
									newNumbrActivate.data = sendData;
									newNumbrActivate.put(data1,{'X-AUTH-TOKEN': authId}).then(function(data){
									$http({url:'php-script/editNumber.php',method:'GET',params:{'account_id':CurrentAccountId,'dt_number':$scope.newNumber.dt_number,'caller_id_number':$scope.newNumber.caller_id_number, 'pri_number':$scope.newNumber.pri_number, 'number': $scope.number}}).success(function(data,status)
										{
											$modalInstance.close();
											alert('Number succssfully updated');
											$state.reload();
											
										});	
									
								});
							});
							});
							
						} else {
							alert('Pri Number already Exist');
						}
				    });
					
					}else{
						$http({url:'php-script/editNumber.php',method:'GET',params:{'account_id':CurrentAccountId,'dt_number':$scope.newNumber.dt_number,'caller_id_number':$scope.newNumber.caller_id_number, 'pri_number':$scope.newNumber.pri_number, 'number': numberData.pri_number}}).success(function(data,status)
							{
								$modalInstance.close();
								alert('Number succssfully added');
								$state.reload();
								
							});	
					}
				}else
				{
					alert('Please provide Pri number.');
				}
				
			}
		}
		$scope.cancel = function () {
				$modalInstance.dismiss('cancel');
		};
});




MetronicApp.controller('addAccPlanCtrl',function( $modalInstance, $scope,$http, $state, CurrentAccountId, allplans) {
		$scope.accPlan={};
		$scope.AllPlans = allplans;
		$scope.disMediaId = '';
		$scope.unauthMediaId='';
		$scope.disaId='';
		$scope.accPlan = function (isValid) {
			if (isValid) {
					var sendData1 = {"data":{"amount":$scope.accPlan.credits,"ui_metadata":{"ui":"kazoo-ui","version":"v3.16-2"}},"verb":"PUT"};
					if ($('#outgoing_feature_status').is(":checked"))
						{
							$scope.status = 1;
						}
					else
						{
							$scope.status = 0;
						}
						var authId = localStorage.getItem('auth');
					$http.put('http://43.252.243.10:8000/v1/'+'accounts/'+CurrentAccountId+'/braintree/credits',sendData1, {
						headers: {'X-Auth-Token': authId}}).then(function(data) {
							$http({url:'php-script/AddPlan.php',method:'GET',params:{'account_id':CurrentAccountId,'plan':$scope.accPlan.plan, 'from':$scope.date_planfrom, 'to':$scope.date_planto, 'smsPerCredit': $scope.accPlan.smsPerCredit, 'credits':$scope.accPlan.credits,'status':$scope.status}}).success(function(data,status)
							{
								$modalInstance.close();
								alert('Plan added successfully');
								$state.reload();
								
								if ($('#outgoing_feature_status').is(":checked"))
								{
									var disaData = {
													"data":{
														"numbers":["DISA"],
														"flow":{
															"data":{
																"pin":"1234",
																"retries":"3"
															},
															"module":"disa",
															"children":{}
														},
														"ui_metadata":{
															"ui":"kazoo-ui",
															"version":"v3.16-2"
														}
													},
													"verb":"PUT"
												};
									var unauthorizedMediaData = {
																"data":{
																	"numbers":["DISA_NotAuthorized"],
																	"flow":{
																		"data":{
																			"id":"b5f347b01b46aae30aa9ffca736205b2"
																		},
																		"module":"play",
																		"children":{}
																	},
																	"ui_metadata":{
																		"ui":"kazoo-ui",
																		"version":"v3.16-2"
																	}
																},
																"verb":"PUT"
															};
									var mediaDisabledData = {
															"data":{
																"numbers":["DISA_NoService"],
																"flow":{
																	"data":{
																		"id":"39004aa2704b0997c3a000ca0288ee2a"
																	},
																	"module":"play",
																	"children":{}
																},
																"ui_metadata":{
																	"ui":"kazoo-ui",
																	"version":"v3.16-2"
																}
															},
															"verb":"PUT"
														};
									$http.put('http://43.252.243.10:8000/v1/'+'accounts/'+CurrentAccountId+'/callflows',disaData, {
										headers: {'X-Auth-Token': authId}}).then(function(data) {
										$scope.disaId = data.data.data.id;
											$http.put('http://43.252.243.10:8000/v1/'+'accounts/'+CurrentAccountId+'/callflows',unauthorizedMediaData, {
												headers: {'X-Auth-Token': authId}}).then(function(data) {
												$scope.unauthMediaId = data.data.data.id;
													$http.put('http://43.252.243.10:8000/v1/'+'accounts/'+CurrentAccountId+'/callflows',mediaDisabledData, {
														headers: {'X-Auth-Token': authId}}).then(function(data) {
														$scope.disMediaId = data.data.data.id;
															$http({url:'php-script/add_account_callflow.php',method:'GET',params:{'account_id':CurrentAccountId,'disa_id':$scope.disaId, 'media_unauthorized_id':$scope.unauthMediaId, 'media_disabled_id':$scope.disMediaId}}).success(function(data,status)
															{
																
															});	
													});
											});
									});									
									
								}

							});
					});
					
			}   
		};

		$scope.cancel = function () {
				$modalInstance.dismiss('cancel');
		};
});


MetronicApp.controller('editAccPlanCtrl',function( $modalInstance, $scope,$http, $state, CurrentAccountId, allplans, clientData) {
		$scope.accPlan=clientData;
		console.log(clientData);
		$scope.credits = clientData.credits;
		$scope.AllPlans = allplans;
		$scope.date_planfrom = clientData.plan_valid_from;
		$scope.date_planto = clientData.plan_valid_upto;
		$scope.accPlan.smsPerCredit = parseInt(clientData.no_of_sms_per_credit, 10);

		$http({url:'php-script/get_outgoing_status.php',method:'GET',params:{'account_id':CurrentAccountId}}).success(function(data,status)
		{
			if(data.msg == 'success'){

				$scope.accPlan.status = true;
			}else{
				$scope.accPlan.status = false;
			}
		});



		$scope.updateAccPlan = function () {
			var authId = localStorage.getItem('auth');
				if ($('#outgoing_feature_status').is(":checked"))
					{
						$scope.status = 1;
					}
				else
					{
						$scope.status = 0;
					}
					if($scope.accPlan.credits != $scope.credits)
					{
						var authId = localStorage.getItem('auth');
						 var totalCredits = parseInt($scope.accPlan.credits) + parseInt($scope.credits);
						// if(totalCredits < 501)
						// {
							var sendData1 = {"data":{"amount":$scope.accPlan.credits,"ui_metadata":{"ui":"kazoo-ui","version":"v3.16-2"}},"verb":"PUT"};
							
							$http.put('http://43.252.243.10:8000/v1/'+'accounts/'+CurrentAccountId+'/braintree/credits',sendData1, {
								headers: {'X-Auth-Token': authId}}).then(function(data) {
									$http({url:'php-script/AddPlan.php',method:'GET',params:{'account_id':CurrentAccountId, 'status':$scope.accPlan.status,'plan':$scope.accPlan.plan, 'from':$scope.date_planfrom, 'to':$scope.date_planto, 'smsPerCredit':$scope.accPlan.smsPerCredit, 'credits':totalCredits}}).success(function(data,status)
									{
										if(data.callflow == 'unchanged' && $scope.status == 1){
											$scope.disMediaId = '';
											$scope.unauthMediaId='';
											$scope.disaId='';
											var disaData = {
													"data":{
														"numbers":["DISA"],
														"flow":{
															"data":{
																"pin":"1234",
																"retries":"3"
															},
															"module":"disa",
															"children":{}
														},
														"ui_metadata":{
															"ui":"kazoo-ui",
															"version":"v3.16-2"
														}
													},
													"verb":"PUT"
												};
									var unauthorizedMediaData = {
																"data":{
																	"numbers":["DISA_NotAuthorized"],
																	"flow":{
																		"data":{
																			"id":"b5f347b01b46aae30aa9ffca736205b2"
																		},
																		"module":"play",
																		"children":{}
																	},
																	"ui_metadata":{
																		"ui":"kazoo-ui",
																		"version":"v3.16-2"
																	}
																},
																"verb":"PUT"
															};
									var mediaDisabledData = {
															"data":{
																"numbers":["DISA_NoService"],
																"flow":{
																	"data":{
																		"id":"39004aa2704b0997c3a000ca0288ee2a"
																	},
																	"module":"play",
																	"children":{}
																},
																"ui_metadata":{
																	"ui":"kazoo-ui",
																	"version":"v3.16-2"
																}
															},
															"verb":"PUT"
														};
									$http.put('http://43.252.243.10:8000/v1/'+'accounts/'+CurrentAccountId+'/callflows',disaData, {
										headers: {'X-Auth-Token': authId}}).then(function(data) {
										$scope.disaId = data.data.data.id;
											$http.put('http://43.252.243.10:8000/v1/'+'accounts/'+CurrentAccountId+'/callflows',unauthorizedMediaData, {
												headers: {'X-Auth-Token': authId}}).then(function(data) {
												$scope.unauthMediaId = data.data.data.id;
													$http.put('http://43.252.243.10:8000/v1/'+'accounts/'+CurrentAccountId+'/callflows',mediaDisabledData, {
														headers: {'X-Auth-Token': authId}}).then(function(data) {
														$scope.disMediaId = data.data.data.id;
															$http({url:'php-script/add_account_callflow.php',method:'GET',params:{'account_id':CurrentAccountId,'disa_id':$scope.disaId, 'media_unauthorized_id':$scope.unauthMediaId, 'media_disabled_id':$scope.disMediaId}}).success(function(data,status)
															{
																
															});	
													});
											});
									});	
										}
										$modalInstance.close();
										alert('Plan updated successfully');
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
						$http({url:'php-script/AddPlan.php',method:'GET',params:{'account_id':CurrentAccountId,'plan':$scope.accPlan.plan,'status':$scope.status, 'from':$scope.date_planfrom, 'to':$scope.date_planto, 'smsPerCredit':$scope.accPlan.smsPerCredit, 'credits':$scope.accPlan.credits}}).success(function(data,status)
							{
								if(data.callflow == 'unchanged' && $scope.status == 1){
											$scope.disMediaId = '';
											$scope.unauthMediaId='';
											$scope.disaId='';
											var disaData = {
													"data":{
														"numbers":["DISA"],
														"flow":{
															"data":{
																"pin":"1234",
																"retries":"3"
															},
															"module":"disa",
															"children":{}
														},
														"ui_metadata":{
															"ui":"kazoo-ui",
															"version":"v3.16-2"
														}
													},
													"verb":"PUT"
												};
									var unauthorizedMediaData = {
																"data":{
																	"numbers":["DISA_NotAuthorized"],
																	"flow":{
																		"data":{
																			"id":"b5f347b01b46aae30aa9ffca736205b2"
																		},
																		"module":"play",
																		"children":{}
																	},
																	"ui_metadata":{
																		"ui":"kazoo-ui",
																		"version":"v3.16-2"
																	}
																},
																"verb":"PUT"
															};
									var mediaDisabledData = {
															"data":{
																"numbers":["DISA_NoService"],
																"flow":{
																	"data":{
																		"id":"39004aa2704b0997c3a000ca0288ee2a"
																	},
																	"module":"play",
																	"children":{}
																},
																"ui_metadata":{
																	"ui":"kazoo-ui",
																	"version":"v3.16-2"
																}
															},
															"verb":"PUT"
														};
									$http.put('http://43.252.243.10:8000/v1/'+'accounts/'+CurrentAccountId+'/callflows',disaData, {
										headers: {'X-Auth-Token': authId}}).then(function(data) {
										$scope.disaId = data.data.data.id;
											$http.put('http://43.252.243.10:8000/v1/'+'accounts/'+CurrentAccountId+'/callflows',unauthorizedMediaData, {
												headers: {'X-Auth-Token': authId}}).then(function(data) {
												$scope.unauthMediaId = data.data.data.id;
													$http.put('http://43.252.243.10:8000/v1/'+'accounts/'+CurrentAccountId+'/callflows',mediaDisabledData, {
														headers: {'X-Auth-Token': authId}}).then(function(data) {
														$scope.disMediaId = data.data.data.id;
															$http({url:'php-script/add_account_callflow.php',method:'GET',params:{'account_id':CurrentAccountId,'disa_id':$scope.disaId, 'media_unauthorized_id':$scope.unauthMediaId, 'media_disabled_id':$scope.disMediaId}}).success(function(data,status)
															{
																
															});	
													});
											});
									});	
										}
								$modalInstance.close();
								alert('Plan updated successfully');
							});
					} 
		};

		$scope.cancel = function () {
				$modalInstance.dismiss('cancel');
		};
});


MetronicApp.controller('viewmodalUserCtrl',function( $modalInstance, $scope,$http, $state, CurrentAccountId, Users, $modal, Restangular) {
		 $scope.users=Users;
		 $scope.sortType     = 'name';
		 $scope.sortReverse  = false; 

		$scope.DeleteUser = function(id){
			var c = confirm('Are you sure to delete this user ?');
				if(c == true){
							var authId = localStorage.getItem('auth');
							var auth = Restangular.one("accounts/"+CurrentAccountId+"/users/"+id)
							var data1 = '';
							auth.remove(data1,{'X-AUTH-TOKEN': authId}).then(function(data){
								
								$http({url:'php-script/deleteClient.php',method:'GET',params:{'id':id}}).success(function(data,status)
								{
									alert('User deleted successfully');
								});		

							});

							$state.reload();
							$modalInstance.close();
				}
		}



		$scope.EditUser=function(id){
							var authId = localStorage.getItem('auth');
							var auth = Restangular.one("accounts/"+CurrentAccountId+"/users/"+id)
							var data1 = '';
							auth.get(data1,{'X-AUTH-TOKEN': authId}).then(function(data){
										var userD = data.data;
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
});



MetronicApp.controller('modalUserCtrl',function( $modalInstance, $scope,$http, $state, CurrentAccountId, CurrentAccountName, Restangular) {
		
		$http({url:'php-script/editClient.php',method:'GET',params:{'id':CurrentAccountId}}).success(function(data,status)
		{				
					$scope.newUser={};
					var userdetail = data[0];
					if(userdetail.sms_notification == 1)
					{
						$scope.newUser.sms_notification = true;
					}
					else
					{
						$scope.newUser.sms_notification = false;
					}
					if(userdetail.email_notification == 1)
					{
						$scope.newUser.email_notification = true;
					}
					else
					{
						$scope.newUser.email_notification = false;
					}
		$scope.checkData = function()
		{
			var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		    if (!filter.test($scope.newUser.email)) {
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
				//$scope.fwd = false;
				$scope.email_notify = 0;
				$scope.sms_notify = 0;
				if ($('#vm').is(":checked"))
				{
					$scope.vm = true;
				}
				if ($('#fax').is(":checked"))
				{
					$scope.fx = true;
				}

				if ($('#email_notification').is(":checked"))
				{
					$scope.email_notify = 1;
				}
				if ($('#sms_notification').is(":checked"))
				{
					$scope.sms_notify = 1;
				}
				// if ($('#call_fwd').is(":checked"))
				// {
					$scope.fwd = true;
				//}
				if (isValid) { 
						var sendData = {
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
								};

						//$http({url:'php-script/checkEmail.php',method:'GET',params:{'email':$scope.newUser.email}}).success(function(data,status)
						//{
						//	if(data.msg=='success'){
							var authId = localStorage.getItem('auth');
							var newUsr = Restangular.one("accounts/"+CurrentAccountId+"/users")
							var data1 = '';
							newUsr.data = sendData;
							newUsr.put(data1,{'X-AUTH-TOKEN': authId}).then(function(data){
								         
											var sendData1 =  {
												'name': $scope.newUser.firstname,
												'owner_id': data.data.id,
												'enabled': true,
												'device_type': 'softphone'
											};
											var newDevice = Restangular.one("accounts/"+CurrentAccountId+"/devices")
											var data1 = '';
											newDevice.data = sendData1;
											newDevice.put(data1,{'X-AUTH-TOKEN': authId}).then(function(data){
													$http({url:'php-script/adduser.php',method:'GET',params:{'username':$scope.newUser.email,'password':$scope.newUser.password,'account_name': CurrentAccountName,'priv_level': $scope.newUser.priv_level, 'email_notification':$scope.email_notify, 'sms_notification':$scope.sms_notify, 'mobile_number':$scope.newUser.number}}).success(function(data,status){

													});
													$http({url:'php-script/add_user_numbers.php',method:'GET',params:{'account_id':CurrentAccountId, 'number':$scope.newUser.number}}).success(function(data,status)
													{
														
													});


											$state.reload();
											alert('User added successfully');
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
});
});



MetronicApp.controller('modalEditUserCtrl',function( $modalInstance, $scope,$http, $state, CurrentAccountId, userData) {
		console.log(userData);
		$scope.UserEmail = userData.email;
		$scope.newUser={};

		$scope.checkData = function()
		{
			var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			if($scope.UserEmail != $scope.newUser.email)
			{
			    if (!filter.test($scope.newUser.email)) {
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
		}


		$http({url:'php-script/getUser.php',method:'GET',params:{'email':userData.email}}).success(function(data,status)
		{
			$scope.newUser.account_user_id = data.account_user_id;
			console.log("id  is " + $scope.newUser.account_user_id + "and" + data.account_user_id);
			$scope.newUser.password = data.password;
			if(data.sms_notification == 1)
			{
				$scope.newUser.sms_notification = true;
			}
			else
			{
				$scope.newUser.sms_notification = false;
			}
			if(data.email_notification == 1)
			{
				$scope.newUser.email_notification = true;
			}
			else
			{
				$scope.newUser.email_notification = false;
			}
			
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
									'verified': true
								};
		// 'call_fwd':userData.call_forward.enabled,
		// 'number':userData.call_forward.number
		if(userData.call_forward != undefined)
		{
			$scope.newUser.call_fwd = userData.call_forward.enabled
			$scope.newUser.number = userData.call_forward.number
		}
		//$scope.UserData = userData;
		$scope.EditUsrFn = function (isValid) {
				$scope.vm = false;
				$scope.fx = false;
				$scope.fwd = false;
				$scope.email_notify = 0;
				$scope.sms_notify = 0;
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
				if ($('#email_notification').is(":checked"))
			    {
					$scope.email_notify = 1;
			    }
			   if ($('#sms_notification').is(":checked"))
			    {
					$scope.sms_notify = 1;
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
						var authId = localStorage.getItem('auth');
						$http({url:'php-script/updateUserInKazoo.php',method:'GET',params:{'account_id':CurrentAccountId,'id':userData.id,'auth':authId,'sendData':sendData}}).success(function(data,status)
						{
						});
						$http({url:'php-script/adduser.php',method:'GET',params:{'username':$scope.newUser.email,'password':$scope.newUser.password,'priv_level': $scope.newUser.priv_level, 'email_notification':$scope.email_notify, 'sms_notification':$scope.sms_notify, 'mobile_number':$scope.newUser.number, 'account_user_id':$scope.newUser.account_user_id}}).success(function(data,status){

						});
						$http({url:'php-script/add_user_numbers.php',method:'GET',params:{'account_id':CurrentAccountId, 'number':$scope.newUser.number}}).success(function(data,status)
						{
							
						});
						$modalInstance.close();
						alert('User updated successfully');
						$state.reload();
				}   
		};

		$scope.cancel = function () {
				$modalInstance.dismiss('cancel');
		};
});


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
				changeMonth: true,
            	changeYear: true,
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
				changeMonth: true,
            	changeYear: true,
				onSelect: function (date) {
					scope.date_planto = date;
					scope.$apply();
				}
			});
		}
	};
}); 
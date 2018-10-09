MetronicApp.controller('AccountController', function($rootScope, $scope, $http, $timeout,$location,$modal,$state, Restangular) {
		$scope.$on('$viewContentLoaded', function() {   
			// initialize core components
			Metronic.initAjax();
			dashboard.checkSession();

		});
		$http.defaults.useXDomain = true;
	   	$http.defaults.headers.post["Content-Type"]="application/x-www-form-urlencoded";
	  	$http.defaults.headers.post["Access-Control-Allow-Origin"]="*";
	   	$http.defaults.headers.post["Access-Control-Allow-Headers"]="Origin, Accept,AUTH_TOKEN";
	   	$http.defaults.headers.post["Access-Control-Allow-Methods"]="POST, GET, OPTIONS, HEAD, PUT";
	   	delete $http.defaults.headers.common['X-Requested-With'];  
$scope.AccountName = '';
			$scope.GetRole=function()     
				{
					$scope.UserRole = localStorage.getItem('role');
					if($scope.UserRole == 1){
						document.getElementById('AccountDiv').style.display = 'block';
						document.getElementById('AgentDiv').style.display='none';
					}else if($scope.UserRole == 2){
						var accountId = localStorage.getItem('acc');
						var authId = localStorage.getItem('auth');
						var auth = Restangular.one("accounts/"+accountId)
						var data1 = '';
						auth.get(data1,{'X-AUTH-TOKEN': authId}).then(function(data){
										//if(data.status == 'success')
										//{
												var accounts= data.data;
												$scope.AgentAccountName = accounts.name;
												$scope.AgentAccountId = accounts.id;
												
										//}
						 });
								
						document.getElementById('AccountDiv').style.display = 'none';
						document.getElementById('AgentDiv').style.display='block';

					}
				}
		
$scope.GetRole();

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

		// $(function() {
	 //   $("a").click(function() {
	 //      // remove classes from all
	 //      $("a").removeClass("active");
	 //      // add class to the one we clicked
	 //      $(this).addClass("active");
	 //   });
	//});


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

				$scope.getContent=function()
				{
						$http({url:'php-script/getContent.php',method:'GET',params:{}}).success(function(data,status)
						{
								if(data.msg == 'success')
								{
										document.getElementById('emailContent').value = data.email_content;
										document.getElementById('smsContent').value = data.sms_content;
								}
						});
				}

				$scope.updateEmailContent=function()
				{
						var EmailContent = document.getElementById('emailContent').value
						$http({url:'php-script/updateEmailContent.php',method:'GET',params:{"emailContent": EmailContent}}).success(function(data,status)
						{
								if(data.msg == 'success')
								{
										alert('Email Content has been saved Successfully');
								}
						});
				}

				$scope.updateSmsContent=function()
				{
						var SmsContent = document.getElementById('smsContent').value
						$http({url:'php-script/updateSmsContent.php',method:'GET',params:{"smsContent": SmsContent}}).success(function(data,status)
						{
								if(data.msg == 'success')
								{
										alert('Sms Content has been saved Successfully');
								}
						});
				}


				$scope.AddNewAccount=function()
				{
						document.getElementById('AccountAdd').className = 'btn btn-primary';
						document.getElementById('AddContent').className = 'btn btn-default';
						 document.getElementById('mailSms_div').style.display='none';
						document.getElementById('addAccount_div').style.display='block';
				}


				$scope.AddEmailSms=function()
				{
						$scope.getContent();
						document.getElementById('AddContent').className = 'btn btn-primary';
						document.getElementById('AccountAdd').className = 'btn btn-default';
						document.getElementById('mailSms_div').style.display='block';
						document.getElementById('addAccount_div').style.display='none';
						
				}


			// $scope.addUser=function()
			// {
			//  var accountId = localStorage.getItem('acc');
			//  var authId = localStorage.getItem('auth');
			//  var sendData = {"data":{
		 //                'first_name': $scope.firstname,
		 //                'last_name': $scope.lastname,
		 //                'username': $scope.username,
		 //                'password': $scope.password,
		 //                'email': $scope.email,
		 //                'account_name': $scope.account_name
		 //            }
		 //        };
			 //   $http.put('http://43.252.243.10:8000/v1/'+'accounts/'+accountId+'/users',sendData, {
		 //            headers: {'X-Auth-Token': authId}}).then(function(data) {
		 //             alert('hello');
		 //             alert(data.status);
		 //               if(data.status == '201')
		 //               {

		 //                   $http({url:'php-script/adduser.php',method:'GET',params:{'username':$scope.username,'password':$scope.password,'account_name': $scope.account_name}}).success(function(data,status)
					//  {
					//    if(data.msg == 'success')
					//    {
					//      alert('User has been Added Successfully');
					//    }
					//  });
		 //               }
		 //         });
			// }

				$scope.open = function (size) {
						var modalInstance = $modal.open({
							templateUrl: 'addAgentModal.html',
							controller: 'modalCtrl',
							size: size
						});
				};





				$scope.getAllAccounts=function()
				{
						$scope.AllAccounts = [];
						var accountId = localStorage.getItem('acc');
						var authId = localStorage.getItem('auth');
						var auth = Restangular.one("accounts/"+accountId+"/children");
						var data1 = '';
						auth.get(data1,{'X-AUTH-TOKEN': authId}).then(function(data){
										//if(data.status == 'success')
										//{
												var accounts= data.data;
												//console.log(data.data.data);
												for(var i =0;i<accounts.length;i++)
												{
														$scope.AllAccounts.push({'account_id':accounts[i].id,'name':accounts[i].name, 'realm':accounts[i].realm});
												}
										//}
						 });
				}
				$scope.getAllAccounts();

				$scope.addAccount=function()
				{
						var accountId = localStorage.getItem('acc');
						var authId = localStorage.getItem('auth');
						var sendData = {
										'name': $scope.name,
										'realm': $scope.realm
						};
						var newAcc = Restangular.one("accounts/"+accountId)
						var data1 = '';
						newAcc.data = sendData;
						newAcc.put(data1,{'X-AUTH-TOKEN': authId}).then(function(data){
						 });
				}


				// $scope.deleteAcc=function(acc,acc_name)
				// {
				// 		//var accountId = localStorage.getItem('acc');
				// 		var authId = localStorage.getItem('auth');
				// 		http://43.252.243.10:8000/v1/accounts/8ca7231b312e1a3248f8db72408760a9/descendants
				// 		 $http.get('http://43.252.243.10:8000/v1/'+'accounts/'+acc+'/descendants', {
				// 				headers: {'X-Auth-Token': authId}}).then(function(data) {
				// 					console.log(data.data.data.length);
				// 					if(data.data.data.length > 0)
				// 					{
				// 						var descendants = data.data.data;
				// 						var total = data.data.data.length;
				// 						for(var i=0;i<total-1;i++)
				// 						{
				// 							$http.delete('http://43.252.243.10:8000/v1/'+'accounts/'+descendants[i].id, {
				// 								headers: {'X-Auth-Token': authId}}).then(function(data) {

				// 							});
				// 						}
				// 						// $http({url:'php-script/deleteAcc.php',method:'GET',params:{'account_name':acc_name}}).success(function(data,status){

				// 						// });
				// 						// $state.reload();
				// 					}
				// 					else
				// 					{
				// 						alert('Account has descendants, please delete them first.');
				// 					}

				// 		 });
				// }


				$scope.deleteAcc=function(acc,acc_name)
				{
					var con = confirm('Are you sure to delete this account ?');
					if(con == true){
						var authId = localStorage.getItem('auth');
						var auth = Restangular.one("accounts/"+acc)
						var data1 = '';
						auth.remove(data1,{'X-AUTH-TOKEN': authId}).then(function(data){
								if(data.status == 200)
								{
									$http({url:'php-script/deleteAcc.php',method:'GET',params:{'account_name':acc_name}}).success(function(data,status){

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


				$scope.AddNewNmbr = function(id,size){
						var modalInstance = $modal.open({
							templateUrl: 'addNumberModal.html',
							controller: 'modalNumberCtrl',
							size: size,
							resolve: {
										CurrentAccountId: function () {
										return id;
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





				$scope.ViewUsers = function(id,size){
					$scope.users=[];
					var authId = localStorage.getItem('auth');
					var auth = Restangular.one("accounts/"+id+"/users")
					var data1 = '';
					auth.get(data1,{'X-AUTH-TOKEN': authId}).then(function(data){
									console.log(data);
									var result=data.data;
									for(var i=0; i<=result.length-1;i++){
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



				$scope.AllUsers = function(id,size){
					$scope.users=[];
					var accountId = localStorage.getItem('acc');
					var authId = localStorage.getItem('auth');
					var auth = Restangular.one("accounts/"+accountId+"/users")
					var data1 = '';
					auth.get(data1,{'X-AUTH-TOKEN': authId}).then(function(data){
									var result=data.data;
									for(var i=0; i<=result.length;i++){
										var name = result[i].first_name + ' ' + result[i].last_name; 
										$scope.users.push({'name':  name,'id':result[i].id,'email':result[i].email});
									}
						 });

				}

				$scope.AllUsers();

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

						$scope.DeleteUser = function(id){
						 var CurrentAccountId = localStorage.getItem('acc');
							var c = confirm('Are you sure to delete this user ?');
								if(c == true){
									var auth = Restangular.one("accounts/"+CurrentAccountId+"/users/"+id)
									var data1 = '';
									auth.remove(data1,{'X-AUTH-TOKEN': authId}).then(function(data){
													
													});

													$state.reload();
											 //$modalInstance.close();
								}
						}



		$scope.EditUser=function(id){
							var authId = localStorage.getItem('auth');
						 var CurrentAccountId = localStorage.getItem('acc');
							var auth = Restangular.one("accounts/"+CurrentAccountId+"/users/"+id)
							var data1 = '';
							auth.get(data1,{'X-AUTH-TOKEN': authId}).then(function(data){ 
										var userD = data.data;
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


				// $scope.ShowAllNumbers  = function(id,size){
				//     var modalInstance = $modal.open({
				//       templateUrl: 'addNumberModal.html',
				//       controller: 'modalNumberCtrl',
				//       size: size,
				//       resolve: {
				//             CurrentAccountId: function () {
				//             return id;
				//             }
				//         }
				//     });
				// }
});

MetronicApp.controller('AddProfileCtrl',function( $modalInstance, $scope,$http, $state, CurrentAccountId, account_name, Restangular ) {
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
									$http({url:'php-script/adduser.php',method:'GET',params:{'username':$scope.newClient.email,'password':$scope.newClient.password,'account_name': account_name,'priv_level': 'admin'}}).success(function(data,status){

									});
									$http({url:'php-script/add_user_numbers.php',method:'GET',params:{'account_id':CurrentAccountId, 'number':$scope.newClient.mobile_number}}).success(function(data,status)
									{
										
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

});


MetronicApp.controller('editmodalCtrl',function( $modalInstance, $scope,$http, $state, userdetail, CurrentAccountId, accountName, Restangular ) {
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
				'no_of_employees': $scope.newClient.number_of_employees,
				'annual_turnover': $scope.newClient.annual_turnover,
				'email_notification': $scope.email_notify,
				'sms_notification': $scope.sms_notify,
				'sms_notification_for_caller': $scope.sms_notify_for_caller,
				'call_forward_enabled':$scope.call_forward_enabled
			};

			var authId = localStorage.getItem('auth');
			//ALTER TABLE `registration_detail` CHANGE `call_forward_enable` `call_forward_enabled` INT(1) NOT NULL DEFAULT '0';
			$http({url:'php-script/updateUserInKazoo.php',method:'GET',params:{'account_id':CurrentAccountId,'id':$scope.currentUserKazooId,'auth':authId,'sendData':sendData1}}).success(function(data,status)
				{    
					$http({url:'php-script/register_client.php',method:'GET',params:{sendData}}).success(function(data,status)
					{
						$modalInstance.close();
						$state.reload();
						$http({url:'php-script/add_user_numbers.php',method:'GET',params:{'account_id':CurrentAccountId, 'number':$scope.newClient.mobile_number}}).success(function(data,status)
						{
							
						});
					});

			});
		}
		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
});





MetronicApp.controller('modalCtrl',function( $modalInstance, $scope,$http, $state, Restangular) {
		 $scope.newAccount={};
		 $scope.typeOptions = [
		{ name: 'Days', value: 'days' , selected: 'selected'}, 
		{ name: 'Weeks', value: 'weeks' }, 
		{ name: 'Months', value: 'month' }
		];

		$scope.addAccountFn = function (isValid) {

				if (isValid) {
					var accountId = localStorage.getItem('acc');
						var authId = localStorage.getItem('auth');
					if($scope.newAccount.credits < 500){
							var sendData = {
										'name': $scope.newAccount.name,
										'realm': $scope.newAccount.realm
							};
							var newAcc = Restangular.one("accounts/"+accountId)
							var data1 = '';
							newAcc.data = sendData;
							newAcc.put(data1,{'X-AUTH-TOKEN': authId}).then(function(data){
										var newAccountId = data.data.id;
										var sendData1 = {"data":{"amount":$scope.newAccount.credits,"ui_metadata":{"ui":"kazoo-ui","version":"v3.16-2"}},"verb":"PUT"};
										var sendData2 = {"data":{"numbers":["no_match"],"flow":{"children":{},"data":{},"module":"offnet"},"ui_metadata":{"ui":"kazoo-ui","version":"v3.16-2"}},"verb":"PUT"};
										var webHookData = {"data":{"name":"Notify Calls", "uri":"http://43.252.243.10/eivr/templates/admin2/angularjs/php-script/sms.php", "http_verb":"get", "hook":"channel_destroy", "retries":3},"ui_metadata":{"ui":"kazoo-ui","version":"v3.16-2"},"verb":"PUT"};
											$http.put('http://43.252.243.10:8000/v1/'+'accounts/'+newAccountId+'/braintree/credits',sendData1, {
												 headers: {'X-Auth-Token': authId}}).then(function(data) {
												 });
											$http.put('http://43.252.243.10:8000/v1/'+'accounts/'+newAccountId+'/callflows',sendData2, {
												 headers: {'X-Auth-Token': authId}}).then(function(data) {
													    
												 });
												 
											$http.put('http://43.252.243.10:8000/v1/'+'accounts/'+newAccountId+'/webhooks',webHookData, {
												headers: {'X-Auth-Token': authId}}).then(function(data) {
													 
												 });

											$state.reload();

							 });
							$modalInstance.close();
					}
					else
					{
						alert('Credit cannot exceeds $500.00');
					}
				}   
		};

		$scope.cancel = function () {
				$modalInstance.dismiss('cancel');
		};
});



MetronicApp.controller('modalNumberCtrl',function( $modalInstance, $scope,$http, $state, CurrentAccountId, Restangular) {
		$scope.newNumber={};
		$scope.addNumberFn = function (isValid) {
				if (isValid) {
						//{data: {ui_metadata: {ui: "kazoo-ui", version: "v3.16-2"}}, verb: "PUT"}
						var sendData = {
									'ui_metadata': {'ui':'kazoo-ui', version:'v3.16-2'}
								};
								var newNumbr = Restangular.one("accounts/"+CurrentAccountId+"/phone_numbers/"+$scope.newNumber.number)
								var data1 = '';
								newNumbr.data = sendData;
								newNumbr.put(data1,{'X-AUTH-TOKEN': authId}).then(function(data){
									var newNumbrActivate = Restangular.one("accounts/"+CurrentAccountId+"/phone_numbers/"+$scope.newNumber.number+"/activate")
									var data1 = '';
									newNumbrActivate.data = sendData;
									newNumbrActivate.put(data1,{'X-AUTH-TOKEN': authId}).then(function(data){
												$state.reload();
										});
						 });
						$modalInstance.close();
				}   
		};

		$scope.cancel = function () {
				$modalInstance.dismiss('cancel');
		};
});




MetronicApp.controller('viewmodalNumberCtrl',function( $modalInstance, $scope,$http, $state, CurrentAccountId, phnNumbers, Restangular) {
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
		$scope.cancel = function () {
				$modalInstance.dismiss('cancel');
		};
});


MetronicApp.controller('viewmodalUserCtrl',function( $modalInstance, $scope,$http, $state, CurrentAccountId, Users, $modal, Restangular) {
		 $scope.users=Users;

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
		$scope.newUser={};
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
													 	$http({url:'php-script/add_user_numbers.php',method:'GET',params:{'account_id':CurrentAccountId, 'number':$scope.newUser.number}}).success(function(data,status)
														{
															
														});
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
});


MetronicApp.controller('modalEditUserCtrl',function( $modalInstance, $scope,$http, $state, CurrentAccountId, userData, Restangular) {
	$http.defaults.useXDomain = true;
    $http.defaults.headers.post["Content-Type"]="application/x-www-form-urlencoded";
    $http.defaults.headers.post["Access-Control-Allow-Origin"]="*";
    $http.defaults.headers.post["Access-Control-Allow-Headers"]="Origin, Accept,x-csrf-token";
    $http.defaults.headers.post["Access-Control-Allow-Methods"]="POST, GET, OPTIONS, HEAD";
    delete $http.defaults.headers.common['X-Requested-With'];
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
						$http({url:'php-script/adduser.php',method:'GET',params:{'username':$scope.newUser.email,'password':$scope.newUser.password,'priv_level': $scope.newUser.priv_level, 'email_notification':$scope.email_notify, 'sms_notification':$scope.sms_notify, 'mobile_number':$scope.newUser.number}}).success(function(data,status){

						});
							$http({url:'php-script/add_user_numbers.php',method:'GET',params:{'account_id':CurrentAccountId, 'number':$scope.newUser.number}}).success(function(data,status){
								
						});
						$modalInstance.close();
						$state.reload();
				}   
		};

		$scope.cancel = function () {
				$modalInstance.dismiss('cancel');
		};
});




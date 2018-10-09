'use strict';

MetronicApp.controller('DashboardController', function($rootScope, $scope, $http, $timeout,$location, Restangular) {
	$scope.$on('$viewContentLoaded', function() { 	 
		// initialize core components
		Metronic.initAjax();
		dashboard.checkSession();
		//Need to write your here
		$rootScope.settings.layout.pageSidebarClosed = false;
	});

	$http.defaults.useXDomain = true;
   	$http.defaults.headers.post["Content-Type"]="application/x-www-form-urlencoded";
  	$http.defaults.headers.post["Access-Control-Allow-Origin"]="*";
   	$http.defaults.headers.post["Access-Control-Allow-Headers"]="Origin, Accept,AUTH_TOKEN";
   	$http.defaults.headers.post["Access-Control-Allow-Methods"]="POST, GET, OPTIONS, HEAD, PUT";
   	delete $http.defaults.headers.common['X-Requested-With'];  
	// set sidebar closed and body solid layout mode
$scope.RoleUser = localStorage.getItem('role');
$scope.mobNum = localStorage.getItem('mob');
$scope.show = false;
$scope.missed = 0;
$scope.answered = 0;
$scope.voiceMail = 0;
$scope.created_to = 0;
$scope.created_from = 0;
$scope.form='days';
$scope.current=true;
$scope.cdrDetail= [];
$scope.cdrDetailInDates = [];
$scope.TotalCalls = 0;
$scope.auth_Id = '';
$scope.dateBlock = false;
$scope.account_Id = '';
$scope.date_from='';
$scope.date_to='';
$scope.credit=0;
$scope.numbers = [];
$scope.phnNumbers = 'all';
$scope.cdrResponseArray=[];
$scope.voiceMailIds = [];
$scope.typeOptions = [
	{ name: 'Days', value: 'days' , selected: 'selected'}, 
	{ name: 'Weeks', value: 'weeks' }, 
	{ name: 'Months', value: 'month' }
	];
$scope.phone_numbersOptions=[
	{ name: 'All Plans', value: 'all', selected: 'selected'}
	];

    $scope.testData = [{
        "id":"201506-424c2a00-098e-11e5-8de5-25922553de2e",
        "call_id":"424c2a00-098e-11e5-8de5-25922553de2e",
        "caller_id_number":"9814061916",
        "caller_id_name":"9814061916",
        "callee_id_number":"09878597619",
        "callee_id_name":"09878597619",
        "duration_seconds":"86",
        "billing_seconds":"69",
        "timestamp":63600513516,
        "hangup_cause":"NORMAL_CLEARING",
        "other_leg_call_id":"2beab70503ea58dd0bd2c1a06e72d78b @103.28.241.102:5060",
        "owner_id":"",
        "to":"09878597619@103.28.241.102",
        "from":"9814061916@103.28.241.102",
        "direction":"outbound",
        "request":"09878597619@103.28.241.102",
        "authorizing_id":"",
        "cost":0,
        "dialed_number":"09878597619",
        "calling_from":"9814061916",
        "datetime":"2015-06-01 01:18:36",
        "unix_timestamp":1433294316,
        "call_type":"",
        "rate":0.0,
        "rate_name":""
    }];
	
	
	
	$scope.getSuperadminData=function()
		{
			$scope.descendantList = [];
			$scope.totalCredits = 0;
			$scope.totalSoftphones = 0;
			$scope.softphones = 0;
			$scope.account_Id = localStorage.getItem('acc');
			$scope.auth_Id = localStorage.getItem('auth');
			var auth = Restangular.one("accounts/"+$scope.account_Id+"/descendants")
			var data1 = '';
			auth.get(data1,{'X-AUTH-TOKEN': $scope.auth_Id}).then(function(data){
			$scope.descendants = data.data;
			console.log(data.data);
			for(var i=0; i<=($scope.descendants.length-1);i++){
				var descendant = {};
				descendant.softphones = 0;
				descendant.credits = 0;
				$scope.auth_Id = localStorage.getItem('auth');
				/* var auth = Restangular.one("accounts/"+$scope.descendants[i].id+"/phone_numbers")
				var data1 = '';
				auth.get(data1,{'X-AUTH-TOKEN': $scope.auth_Id}).then(function(data){
					console.log(data.data.numbers);
				}); */
				devices(i,descendant,credits);			
	    }
			
		});
		}
		
		function devices(i,descendant,callback){
			console.log($scope.descendants[i]);
			
			var auth = Restangular.one("accounts/"+$scope.descendants[i].id+"/devices")
				var data1 = '';
				auth.get(data1,{'X-AUTH-TOKEN': $scope.auth_Id}).then(function(data){
					var devices = data.data;
					for(var j=0; j<=(devices.length-1);j++){
						if(devices[j].device_type == 'softphone'){
							descendant.softphones += 1;
							$scope.totalSoftphones += 1;
						}
						
					}
					callback(i,descendant,addItems);
					
				});
				
		}
		function credits(i,descendant,callback){
			//console.log($scope.descendants[i].id);
			var auth = Restangular.one("accounts/"+$scope.descendants[i].id+"/braintree/credits")
				var data1 = '';
					auth.get(data1,{'X-AUTH-TOKEN': $scope.auth_Id}).then(function(data){
						$http({url:'php-script/editClient.php',method:'GET',params:{'id':$scope.descendants[i].id}}).success(function(data1,status)
						{
							var clientData = data1[0];
							$scope.totalCredits += data.data.amount - clientData.credit_deduction_for_sms;
							descendant.credits += data.data.amount - clientData.credit_deduction_for_sms;
							callback(i,descendant);
						});
					});
		}
		
		function addItems(i,descendant){
			console.log(descendant);
			descendant.name = $scope.descendants[i].name;
				$scope.descendantList.push(descendant);
		}
		
		$scope.getSuperadminData();
$scope.getCredits=function()
{
	$scope.account_Id = localStorage.getItem('acc');
	$scope.auth_Id = localStorage.getItem('auth');
	$scope.clientData = 0;
	$http({url:'php-script/editClient.php',method:'GET',params:{'id':$scope.account_Id}}).success(function(data,status)
		{
			//console.log($scope.account_Id);
			$scope.clientData = data[0];
			var auth = Restangular.one("accounts/"+$scope.account_Id+"/braintree/credits")
		    var data1 = '';
		    auth.get(data1,{'X-AUTH-TOKEN': $scope.auth_Id}).then(function(data){
		    	//console.log(data.data.amount);
		    	//console.log($scope.clientData.credit_deduction_for_sms);
		       	$scope.credit=data.data.amount - $scope.clientData.credit_deduction_for_sms;

		    });
		});
    
}

$scope.getPhoneNumbers=function()
{
	$scope.phone_numbersOptions=[
	{ name: 'All Plans', value: 'all', selected: 'selected'}
	]
	// $scope.account_Id = localStorage.getItem('acc');
	// $scope.auth_Id = localStorage.getItem('auth');
 //    var auth = Restangular.one("accounts/"+$scope.account_Id+"/phone_numbers")
 //    var data1 = '';
 //    auth.get(data1,{'X-AUTH-TOKEN': $scope.auth_Id}).then(function(data){
	//     var result=data.data.numbers;
	//    	var numbers= Object.keys(result);
	//     for(var i=0; i<=(numbers.length-1);i++){
	//     	$scope.phone_numbersOptions.push({'name': numbers[i], 'value': numbers[i]});
	//     }
 //    });
}

$scope.getDTnumbers=function()
{
	var id = localStorage.getItem('acc');
	$scope.DTNumbers=[];
		$http({url:'php-script/getNumbers.php',method:'GET',params:{'id':id}}).success(function(data,status)
		{					
			for(var i=0;i<data.length;i++)
			{
				$scope.DTNumbers.push(data[i].dt_number);
			}
			if($scope.DTNumbers.length > 0)
			{
				$scope.AllDtNums=$scope.DTNumbers.join(',');
			}
			else{
				$scope.AllDtNums = '';
			}
			//console.log($scope.DTNumbers);
		});
}

$scope.getVoiceMails=function()
{
	$scope.account_Id = localStorage.getItem('acc');
	$scope.auth_Id = localStorage.getItem('auth');
	var voiceMailData = [];
	for(var i=0;i<$scope.voiceMailIds.length;i++)
	{
	    var auth = Restangular.one("accounts/"+$scope.account_Id+"/vmboxes/"+$scope.voiceMailIds[i])
	    var data1 = '';
	    auth.get(data1,{'X-AUTH-TOKEN': $scope.auth_Id}).then(function(data){
		var result=data.data.messages;
		var from = new Date($scope.date_from).getTime()/1000
		var to = new Date($scope.date_to).getTime()/1000
		
		if(result.length > 0)
	    {
	    	
	    	for(var i=0;i<result.length;i++)
	    	{
	    		var time = result[i].timestamp - 62167219200;
	    		var mailDate = new Date(time*1000);		    		
	      		var a = mailDate.toString().substr(0,15);
	      		var voiceMailDate= a.split(" ");
	      		voiceMailData.push(voiceMailDate);	      					
	    	}
	    	for(var i =0;i<$scope.cdrDetail.length;i++)
			{
				for(var j=0;j<voiceMailData.length;j++)
				{
					if(($scope.cdrDetail[i].date[0] == voiceMailData[j][0]) && ($scope.cdrDetail[i].date[1] == voiceMailData[j][1]) && ($scope.cdrDetail[i].date[2] == voiceMailData[j][2]) && ($scope.cdrDetail[i].date[3] == voiceMailData[j][3]))
					{
						$scope.cdrDetail[i].voice_mail = $scope.cdrDetail[i].voice_mail + 1;

					}
				}
			}	
	    }
	   	  		    
	    });
	}
}


$scope.getVoiceMailBoxes=function()
{
	$scope.account_Id = localStorage.getItem('acc');
	$scope.auth_Id = localStorage.getItem('auth');
	$scope.voiceMailIds = [];
    var auth = Restangular.one("accounts/"+$scope.account_Id+"/vmboxes")
    var data1 = '';
    auth.get(data1,{'X-AUTH-TOKEN': $scope.auth_Id}).then(function(data){
       var result = data.data;
       for(var i=0;i<result.length;i++)
       {	
       		$scope.voiceMailIds.push(result[i].id);
       }

      $scope.getVoiceMails();
    });
    
    
}


$scope.outgoingNumbersList=function()
{
	$scope.outgoingNumbers = [];
	var id = localStorage.getItem('acc');
	$http({url:'php-script/getaccount_outgoing_numbers.php',method:'GET',params:{'id':id}}).success(function(data,status)
		{
			$scope.outgoingNumbers = data;
			console.log("Dashboard.outgoingNumbers: " + $scope.outgoingNumbers);
			$scope.getcdrs();
		});

}



$scope.getcdrs=function()
{
	//$scope.getPhoneNumbers();
	$scope.getDTnumbers();
	$scope.getCredits();
	//$scope.outgoingNumbersList();
	if($scope.dateBlock == true){
		$scope.date_from = document.getElementById('date_from').value;
		$scope.date_to = document.getElementById('date_to').value;
	}
	$scope.dateBlock = false;
	var from = new Date($scope.date_from).getTime()/1000
	var to = new Date($scope.date_to).getTime()/1000
	//console.log(to);
	//console.log(from);
	to = to + 800000;
	from = from+62167219200;
	to = to+62167219200;
	//console.log(new Date().getTime()/1000);
	$scope.auth_Id = localStorage.getItem('auth');
	$scope.account_Id = localStorage.getItem('acc');
	$scope.cdrDetail= [];
	$scope.cdrDetailDates=[];
	var data1 = {"auth_token":$scope.auth_Id, "created_from": from, "created_to": to}
    var auth = Restangular.one("accounts/"+$scope.account_Id+"/cdrs")
    auth.data = data1
    auth.get(data1,{'X-AUTH-TOKEN': $scope.auth_Id}).then(function(data){
		$scope.cdrResponseArray = data.data;
		//console.log($scope.cdrResponseArray);
		
		$scope.created_from = $scope.date_from;
		$scope.created_to = $scope.date_to;
		$scope.TotalCalls = 0;
		var start = $scope.created_from,
			end = new Date($scope.created_to),
			currentDate = new Date(start)
		;
		$scope.between=[];
		$scope.callsIn24Hrs=[];
		while (currentDate <= end) {
			$scope.between.push(new Date(currentDate));
			currentDate.setDate(currentDate.getDate() + 1);
		}
		for (var k=0;k<$scope.between.length;k++) 
		{
			var today = new Date($scope.between[k]);
				today.setHours(0, 0, 0, 0);
				var todayStr = today.toString().substr(0,15);
			if($scope.cdrResponseArray.length > 0)
			{
				for(var i=0;i<$scope.cdrResponseArray.length;i++)
				{				
					var dt = $scope.cdrResponseArray[i].datetime.substr(0,10);
					var d = new Date(dt); 
					d.setHours(0, 0, 0, 0);
					var toStr = d.toString().substr(0,15);
					if($scope.RoleUser == 3)
					{
						if($scope.cdrResponseArray[i].callee_id_number.charAt(0) === '0')
						{
							$scope.cdrResponseArray[i].callee_id_number = $scope.cdrResponseArray[i].callee_id_number.substr(1);
							
						}
						console.log($scope.cdrResponseArray[i].callee_id_number);
						if(($scope.mobNum  == $scope.cdrResponseArray[i].caller_id_number) || ($scope.mobNum  == $scope.cdrResponseArray[i].callee_id_number))
						{
							if(todayStr == toStr)
							{ 
								var index = $scope.cdrDetailDates.indexOf(toStr);
								if(index > -1)
								{
									if($scope.cdrResponseArray[i].other_leg_call_id != '')
									{
										if($scope.cdrResponseArray[i].other_leg_call_id.indexOf('@') > -1) 
										{  
											if ($scope.cdrResponseArray[i].callee_id_number.match(/[a-z]/i)) {
											}
											else{ 
												if($scope.cdrResponseArray[i].direction == 'outbound')
												{
													if($scope.mobNum == $scope.cdrResponseArray[i].caller_id_number)
													{
														if($scope.cdrResponseArray[i].hangup_cause == 'NORMAL_CLEARING')
														{
															$scope.cdrDetail[index].outbound_call = $scope.cdrDetail[index].outbound_call + 1;
															$scope.TotalCalls = $scope.TotalCalls + 1;
														}	
													}
													else
													{
														if($scope.cdrResponseArray[i].hangup_cause == 'NORMAL_CLEARING')
														{   
															$scope.cdrDetail[index].call_answered = $scope.cdrDetail[index].call_answered + 1;
															$scope.TotalCalls = $scope.TotalCalls + 1;										
														}
														else
														{
															$scope.cdrDetail[index].call_missed = $scope.cdrDetail[index].call_missed + 1;
															$scope.TotalCalls = $scope.TotalCalls + 1;									
					                                    }
					                                    $scope.TotalCalls = $scope.TotalCalls + 1;	
													}                  
												}
											}
		                                }
		                            }
								}
								else
								{
									if($scope.cdrResponseArray[i].other_leg_call_id != '')
									{
										if($scope.cdrResponseArray[i].other_leg_call_id.indexOf('@') > -1) 
										{
											if ($scope.cdrResponseArray[i].callee_id_number.match(/[a-z]/i)) {
											}
											else{	
												if($scope.cdrResponseArray[i].direction == 'outbound')
												{
													if($scope.mobNum == $scope.cdrResponseArray[i].caller_id_number)
													{
														if($scope.cdrResponseArray[i].hangup_cause == 'NORMAL_CLEARING')
														{
															$scope.cdrDetail.unshift({'date':todayStr, 'call_answered': 0, 'call_missed' : 0, 'voice_mail' : 0, 'outbound_call': 1 })
															$scope.TotalCalls = $scope.TotalCalls + 1;
														}
														else
														{
															$scope.cdrDetail.unshift({'date':todayStr, 'call_answered': 0, 'call_missed' : 0, 'voice_mail' : 0, 'outbound_call': 0 });	
														}	
														$scope.cdrDetailDates.unshift(todayStr);	
													}
													else
													{
														if($scope.cdrResponseArray[i].hangup_cause == 'NORMAL_CLEARING')
														{
															$scope.cdrDetail.unshift({'date':todayStr, 'call_answered': 1, 'call_missed' : 0, 'voice_mail' : 0, 'outbound_call': 0 })
															$scope.TotalCalls = $scope.TotalCalls + 1;
														}
														else
														{
															$scope.cdrDetail.unshift({'date':todayStr, 'call_answered': 0, 'call_missed' : 1, 'voice_mail' : 0, 'outbound_call': 0})
															$scope.TotalCalls = $scope.TotalCalls + 1;									
					                                    }
					                                    $scope.cdrDetailDates.unshift(todayStr);
													}
												}
											}
										}
									}
								}									
							}
						}
					}
					else
					{
						if($scope.phnNumbers == 'all')
						{
							if(todayStr == toStr)
							{ 
								var index = $scope.cdrDetailDates.indexOf(toStr);
								if(index > -1)
								{
									if($scope.cdrResponseArray[i].other_leg_call_id != '')
									{
										if($scope.cdrResponseArray[i].other_leg_call_id.indexOf('@') > -1) 
										{
											var regex = '/^[a-z]*$/';
											//console.log($scope.cdrResponseArray[i].callee_id_number);
											if ($scope.cdrResponseArray[i].callee_id_number.match(/[a-z]/i)) {
											} 
											else {
												if($scope.cdrResponseArray[i].direction == 'outbound')
												{
													if($scope.outgoingNumbers.indexOf($scope.cdrResponseArray[i].caller_id_number) > -1)
													{
														if($scope.cdrResponseArray[i].hangup_cause == 'NORMAL_CLEARING')
														{
															$scope.cdrDetail[index].outbound_call = $scope.cdrDetail[index].outbound_call + 1;
															$scope.TotalCalls = $scope.TotalCalls + 1;
														}	
													}
													else
													{
														if($scope.cdrResponseArray[i].hangup_cause == 'NORMAL_CLEARING')
														{   
															$scope.cdrDetail[index].call_answered = $scope.cdrDetail[index].call_answered + 1;
															$scope.TotalCalls = $scope.TotalCalls + 1;									}
														else
														{
															$scope.cdrDetail[index].call_missed = $scope.cdrDetail[index].call_missed + 1;
															$scope.TotalCalls = $scope.TotalCalls + 1;								
						                                }
													}
													
												}
											}
										}
									}                    
								}
								else
								{
									if($scope.cdrResponseArray[i].other_leg_call_id != '')
									{
										if($scope.cdrResponseArray[i].other_leg_call_id.indexOf('@') > -1) 
										{
											if ($scope.cdrResponseArray[i].callee_id_number.match(/[a-z]/i)) {
											}
											else
											{
												if($scope.cdrResponseArray[i].direction == 'outbound')
												{
													if($scope.outgoingNumbers.indexOf($scope.cdrResponseArray[i].caller_id_number) > -1)
													{
														if($scope.cdrResponseArray[i].hangup_cause == 'NORMAL_CLEARING')
														{
															$scope.cdrDetail.unshift({'date':todayStr, 'call_answered': 0, 'call_missed' : 0, 'voice_mail' : 0, 'outbound_call': 1 })
															$scope.TotalCalls = $scope.TotalCalls + 1;
														}	
														else
														{
															$scope.cdrDetail.unshift({'date':todayStr, 'call_answered': 0, 'call_missed' : 0, 'voice_mail' : 0, 'outbound_call': 0 });	
														}	
														$scope.cdrDetailDates.unshift(todayStr);
													}
													else
													{
														if($scope.cdrResponseArray[i].hangup_cause == 'NORMAL_CLEARING')
														{
															$scope.cdrDetail.unshift({'date':todayStr, 'call_answered': 1, 'call_missed' : 0, 'voice_mail' : 0, 'outbound_call': 0 })
															$scope.TotalCalls = $scope.TotalCalls + 1;								
														}
														else
														{
															$scope.cdrDetail.unshift({'date':todayStr, 'call_answered': 0, 'call_missed' : 1, 'voice_mail' : 0, 'outbound_call': 0})
															$scope.TotalCalls = $scope.TotalCalls + 1;								
						                                }
						                                $scope.cdrDetailDates.unshift(todayStr);
													}
												}
											}
										}
									}
								}
								
							}
						}
						else
						{
							if($scope.phnNumbers  == $scope.cdrResponseArray[i].dialed_number)
							{
								if(todayStr == toStr)
								{ 
									var index = $scope.cdrDetailDates.indexOf(toStr);
									if(index > -1)
									{
										if($scope.cdrResponseArray[i].other_leg_call_id != '')
										{
											if($scope.cdrResponseArray[i].other_leg_call_id.indexOf('@') > -1) 
											{  
												if ($scope.cdrResponseArray[i].callee_id_number.match(/[a-z]/i)) {
												}
												else{ 
													if($scope.cdrResponseArray[i].direction == 'outbound')
													{
														if($scope.outgoingNumbers.indexOf($scope.cdrResponseArray[i].caller_id_number) > -1)
														{
															if($scope.cdrResponseArray[i].hangup_cause == 'NORMAL_CLEARING')
															{
																$scope.cdrDetail[index].outbound_call = $scope.cdrDetail[index].outbound_call + 1;
																$scope.TotalCalls = $scope.TotalCalls + 1;
															}	
														}
														else
														{
															if($scope.cdrResponseArray[i].hangup_cause == 'NORMAL_CLEARING')
															{   
																$scope.cdrDetail[index].call_answered = $scope.cdrDetail[index].call_answered + 1;
																$scope.TotalCalls = $scope.TotalCalls + 1;										
															}
															if(($scope.cdrResponseArray[i].hangup_cause == 'ORIGINATOR_CANCEL') || ($scope.cdrResponseArray[i].hangup_cause == 'UNALLOCATED_NUMBER') || ($scope.cdrResponseArray[i].hangup_cause == 'CALL_REJECTED') || ($scope.cdrResponseArray[i].hangup_cause == 'NO_ANSWER') || ($scope.cdrResponseArray[i].hangup_cause == 'NO_USER_RESPONSE') || ($scope.cdrResponseArray[i].hangup_cause == 'RECOVERY_ON_TIME_EXPIRE'))
															{
																$scope.cdrDetail[index].call_missed = $scope.cdrDetail[index].call_missed + 1;
																$scope.TotalCalls = $scope.TotalCalls + 1;									
						                                    }
						                                    $scope.TotalCalls = $scope.TotalCalls + 1;	
														}                  
													}
												}
			                                }
			                            }
									}
									else
									{
										if($scope.cdrResponseArray[i].other_leg_call_id != '')
										{
											if($scope.cdrResponseArray[i].other_leg_call_id.indexOf('@') > -1) 
											{
												if ($scope.cdrResponseArray[i].callee_id_number.match(/[a-z]/i)) {
												}
												else{	
													if($scope.cdrResponseArray[i].direction == 'outbound')
													{
														if($scope.outgoingNumbers.indexOf($scope.cdrResponseArray[i].caller_id_number) > -1)
														{
															if($scope.cdrResponseArray[i].hangup_cause == 'NORMAL_CLEARING')
															{
																$scope.cdrDetail.unshift({'date':todayStr, 'call_answered': 0, 'call_missed' : 0, 'voice_mail' : 0, 'outbound_call': 1 })
																$scope.TotalCalls = $scope.TotalCalls + 1;
															}
															else
															{
																$scope.cdrDetail.unshift({'date':todayStr, 'call_answered': 0, 'call_missed' : 0, 'voice_mail' : 0, 'outbound_call': 0 });	
															}	
															$scope.cdrDetailDates.unshift(todayStr);	
														}
														else
														{
															if($scope.cdrResponseArray[i].hangup_cause == 'NORMAL_CLEARING')
															{
																$scope.cdrDetail.unshift({'date':todayStr, 'call_answered': 1, 'call_missed' : 0, 'voice_mail' : 0, 'outbound_call': 0 })
																$scope.TotalCalls = $scope.TotalCalls + 1;
															}
															if(($scope.cdrResponseArray[i].hangup_cause == 'ORIGINATOR_CANCEL') || ($scope.cdrResponseArray[i].hangup_cause == 'UNALLOCATED_NUMBER') || ($scope.cdrResponseArray[i].hangup_cause == 'CALL_REJECTED') || ($scope.cdrResponseArray[i].hangup_cause == 'NO_ANSWER') || ($scope.cdrResponseArray[i].hangup_cause == 'NO_USER_RESPONSE') || ($scope.cdrResponseArray[i].hangup_cause == 'RECOVERY_ON_TIME_EXPIRE'))
															{
																$scope.cdrDetail.unshift({'date':todayStr, 'call_answered': 0, 'call_missed' : 1, 'voice_mail' : 0, 'outbound_call': 0})
																$scope.TotalCalls = $scope.TotalCalls + 1;									
						                                    }
						                                    $scope.cdrDetailDates.unshift(todayStr);
														}
													}
												}
											}
										}
									}									
								}
							}
						}
					}
					//$scope.cdrDetailDates.push($scope.between[k].toString().substr(0,15));
				}
			   	if($scope.cdrDetailDates.indexOf(todayStr) == -1){
					$scope.cdrDetail.unshift({'date':todayStr, 'call_answered': 0, 'call_missed' : 0, 'voice_mail' : 0, 'outbound_call' : 0, 'dates':todayStr})
					$scope.cdrDetailDates.unshift(todayStr);
				}
			}
			else
			{
				$scope.cdrDetail.unshift({'date':todayStr, 'call_answered': 0, 'call_missed' : 0, 'voice_mail' : 0, 'outbound_call' : 0, 'dates':todayStr})
				$scope.cdrDetailDates.unshift(todayStr);			}
	}
	for(var f=0;f<$scope.cdrDetail.length;f++){
		$scope.cdrDetail[f].date= $scope.cdrDetail[f].date.split(" ");
	}

	var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
	var firstDate = new Date($scope.date_from);
	var secondDate = new Date($scope.date_to);
	var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay))) + 1;
	$scope.AverageCallsPerDay = Math.round($scope.TotalCalls/diffDays)
	if((diffDays > 6 && diffDays < 30)) {
		$scope.typeOptions = [
		{ name: 'Days', value: 'days' , selected: 'selected'}, 
		{ name: 'Weeks', value: 'weeks' }, 
		];
	}
	else if(diffDays > 28){
		$scope.typeOptions = [
		{ name: 'Days', value: 'days' , selected: 'selected'}, 
		{ name: 'Weeks', value: 'weeks' }, 
		{ name: 'Months', value: 'month' }
		];
	}
	else{
		$scope.typeOptions = [
		{ name: 'Days', value: 'days' , selected: 'selected'}
		];
	}
	if($scope.form =='weeks'){
		$scope.getcdrsWeek();
	}
	if($scope.form =='month'){
		$scope.getcdrsMonth();
	}

	$scope.RecentCalls();
	$scope.getVoiceMailBoxes();
	});
//console.log($scope.cdrDetail);
}

$scope.dwnldClass=function(dur){
	if(dur === 0){
		return 'calldnwl1';
	}else{
		return 'callTime';
	}
}

$scope.timeSet=function()
{
	setInterval(function(){ 
		$scope.RecentCalls();
	}, 60000);

}


$scope.RecentCalls = function()
{
	 var today = Math.round(new Date().getTime() / 1000);
    var yesterday = today - (24 * 3600);

   //var today =  Math.round(new Date('2015.04.22').getTime() / 1000);
   //var yesterday = Math.round(new Date('2015.04.21').getTime() / 1000)
    var from = yesterday+62167219200;
	var to = today+62167219200+100000;
	var data1 = {"auth_token":$scope.auth_Id, "created_from": from, "created_to": to}
	var auth = Restangular.one("accounts/"+$scope.account_Id+"/cdrs")
    auth.data = data1
    auth.get(data1,{'X-AUTH-TOKEN': $scope.auth_Id}).then(function(data){
    	// if(data.page_size > 0)
    	// {
    		$scope.recentCall = false;
    		$scope.recentCallOk = true;
    		document.getElementById('nocalls').style.display='none';
    		document.getElementById('yescalls').style.display='block';
    		var result = data.data;
    		$scope.callsIn24Hrs=[];
    		
    		//console.log(result);
    		for(var i=0;i<result.length;i++)
    		{
    			if($scope.RoleUser == 3)
				{
	    			if(result[i].callee_id_number.charAt(0) === '0')
					{
						result[i].callee_id_number = result[i].callee_id_number.substr(1);
					}
	    			if(($scope.mobNum  == result[i].caller_id_number) || ($scope.mobNum  == result[i].callee_id_number))
					{
	    				if(result[i].other_leg_call_id.indexOf('@') > -1) 
						{
							if(result[i].callee_id_number.match(/[a-z]/i)) {
							}
							else{
								if(result[i].direction == 'outbound')
								{

									var time = result[i].datetime.substr(10,6);
									var dt = result[i].datetime.substr(0,10);
									var d = new Date(dt); 
									d.setHours(0, 0, 0, 0);
									var toStr = d.toString().substr(0,15);
									toStr = toStr.split(' ');
									if($scope.outgoingNumbers.indexOf(result[i].caller_id_number) > -1)
									{
										if(result[i].hangup_cause == 'NORMAL_CLEARING')
										{
											$scope.callsIn24Hrs.unshift({'date':toStr[2]+' '+ toStr[1]+',' +toStr[3],'type':'outgoing','caller': result[i].caller_id_number, 'time':time, 'caller_number': result[i].callee_id_number, 'duration': result[i].billing_seconds, 'call_id':result[i].other_leg_call_id});
										}									
									}
									else
									{
										if(result[i].hangup_cause == 'NORMAL_CLEARING')
										{
											$scope.callsIn24Hrs.unshift({'date':toStr[2]+' '+ toStr[1]+',' +toStr[3],'type':'NORMAL_CLEARING','caller': result[i].caller_id_number, 'time':time, 'caller_number': result[i].callee_id_number, 'duration': result[i].billing_seconds, 'call_id':result[i].other_leg_call_id});
										}
										else
										{
											$scope.callsIn24Hrs.unshift({'date':toStr[2]+' '+ toStr[1]+',' +toStr[3],'type':'missed','caller': result[i].caller_id_number, 'time':time, 'caller_number': result[i].callee_id_number, 'duration': result[i].billing_seconds, 'call_id':result[i].other_leg_call_id});
										}
										
									}
	    						}
	    					}
	    				}
	    			}
	    		}
	    		else
	    		{
	    			if(result[i].other_leg_call_id.indexOf('@') > -1) 
					{
						if(result[i].callee_id_number.match(/[a-z]/i)) {
						}
						else{
							if(result[i].direction == 'outbound')
							{

								var time = result[i].datetime.substr(10,6);
								var dt = result[i].datetime.substr(0,10);
								var d = new Date(dt); 
								d.setHours(0, 0, 0, 0);
								var toStr = d.toString().substr(0,15);
								toStr = toStr.split(' ');
								if($scope.outgoingNumbers.indexOf(result[i].caller_id_number) > -1)
								{
									if(result[i].hangup_cause == 'NORMAL_CLEARING')
									{
										$scope.callsIn24Hrs.unshift({'date':toStr[2]+' '+ toStr[1]+',' +toStr[3],'type':'outgoing','caller': result[i].caller_id_number, 'time':time, 'caller_number': result[i].callee_id_number, 'duration': result[i].billing_seconds, 'call_id':result[i].other_leg_call_id});
									}									
								}
								else
								{
									if(result[i].hangup_cause == 'NORMAL_CLEARING')
									{
										$scope.callsIn24Hrs.unshift({'date':toStr[2]+' '+ toStr[1]+',' +toStr[3],'type':'NORMAL_CLEARING','caller': result[i].caller_id_number, 'time':time, 'caller_number': result[i].callee_id_number, 'duration': result[i].billing_seconds, 'call_id':result[i].other_leg_call_id});
									}
									else
									{
										$scope.callsIn24Hrs.unshift({'date':toStr[2]+' '+ toStr[1]+',' +toStr[3],'type':'missed','caller': result[i].caller_id_number, 'time':time, 'caller_number': result[i].callee_id_number, 'duration': result[i].billing_seconds, 'call_id':result[i].other_leg_call_id});
									}
									
								}
    						}
    					}
    				}
	    		}
    		}

    	// }
    	// else
    	// {
    	// 	document.getElementById('nocalls').style.display='block';
    	// 	document.getElementById('yescalls').style.display='none';
    	// }
    });

	//$scope.timeSet();
}




$scope.recentCdrs=function()
{
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!
		var yyyy = today.getFullYear();
		var yesterday = new Date(today);
		yesterday.setDate(today.getDate() - 5);
		var $dd = yesterday.getDate();
		var $mm = yesterday.getMonth()+1; //January is 0!
		var $yyyy = yesterday.getFullYear();
		if($dd<10){$dd='0'+$dd} if($mm<10){$mm='0'+$mm} 
		var fiveDayBefore = $mm+'/'+$dd+'/'+$yyyy;
		var today = mm+'/'+dd+'/'+yyyy;
		$scope.date_to = today;
		$scope.date_from = fiveDayBefore;
		$scope.outgoingNumbersList();
		

}
// Krishan: 11-Aug-2015
$scope.recentCdrs();

//login function
// $scope.doLogin=function()
// 	{ 
// 		var username=$scope.username;
// 		var password=$scope.password;
// 		$http({url:'php-script/login.php',method:'GET',params:{'username':username,'password':password}}).success(function(data,status)
// 		{
// 			if(data.msg == 'success')
// 			{
// 				var i =0;
// 				var UserRole=[];
// 				while(i<data.user_role_grant_detail.length)
// 				{
// 					UserRole.push(data.user_role_grant_detail[i].module_name);
// 					i++;
// 				}

// 				localStorage.setItem('nm', $scope.username);
// 				localStorage.setItem('md5', data.md5_credential);
// 				localStorage.setItem('role', data.user_role_grant_detail[0].user_role_id);
// 				$scope.kazooAuthentication(data.md5_credential, data.account_name, UserRole);
// 				//$location.path('/dashboard.html');
// 				//location.reload();
// 			}
// 			else
// 			{
// 				$location.path('/login.html');
// 				$scope.msg = 'Login Credentials are not valid';
// 			}
// 		});                   
// 	}



// $scope.kazooAuthentication=function(hashMd5, account_name, UserRole)
// {

// 	var data1 = {'credentials':hashMd5,"account_name":account_name}
//     var auth = Restangular.one("user_auth")
//     auth.data = data1
//     auth.put().then(function(data){
//     	if(data.status == 'success')
//     	{
// 	        $scope.auth_Id = data.auth_token;
// 	        $scope.account_Id = data.data.account_id;  
// 			localStorage.setItem('auth', data.auth_token);
// 	        localStorage.setItem('acc', data.data.account_id);
// 	        localStorage.setItem('module', UserRole);
// 	       	$location.path('/dashboard.html');
// 	        location.reload();
// 		    $scope.getPhoneNumbers();
// 		    $scope.getCredits();
// 		    $scope.recentCdrs();
		    
// 		}
// 		else
// 		{
// 			$scope.msg = 'Login Credentials are not valid';
// 			$location.path('/login.html');			
// 		}

//     });
// }



$scope.getcdrsWeek=function()
{
	var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
	var firstDate = new Date($scope.date_from);
	var secondDate = new Date($scope.date_to);
	var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
	var SortWeekWise = [];
	while($scope.cdrDetail.length) {
    		SortWeekWise.push($scope.cdrDetail.splice(0,7));
	}
	for(var k =0;k<SortWeekWise.length;k++)
	{
		var SortWeek = [];
		var call_answered = 0;
		var call_missed = 0;
		var voice_mail = 0;
		var outbound_call = 0;
		for(var i=0;i<SortWeekWise[k].length;i++)
		{
			var WeekfirstDate = SortWeekWise[k][0].date;
			var WeekLastDate = SortWeekWise[k][SortWeekWise[k].length-1].date
			call_answered = call_answered + SortWeekWise[k][i].call_answered
			call_missed = call_missed + SortWeekWise[k][i].call_missed
			voice_mail = voice_mail + SortWeekWise[k][i].voice_mail
			outbound_call = outbound_call + SortWeekWise[k][i].outbound_call
		}
		if(WeekfirstDate[1] == WeekLastDate[1])
		{
			var SortedWeek = {"date":['', WeekfirstDate[1]+"'"+WeekfirstDate[3], WeekfirstDate[2]+'-'+WeekLastDate[2], ''], "call_missed":call_missed, "call_answered":call_answered, "voice_mail":voice_mail, "outbound_call":outbound_call};
		$scope.cdrDetail.push(SortedWeek)
		}
		else
		{
			var SortedWeek = {"date":['', WeekfirstDate[1]+"'"+WeekfirstDate[3] +'-'+ WeekLastDate[1]+"'"+WeekLastDate[3], WeekfirstDate[2]+'-'+WeekLastDate[2], ''], "call_missed":call_missed, "call_answered":call_answered, "voice_mail":voice_mail, "outbound_call":outbound_call};
		$scope.cdrDetail.push(SortedWeek)
		}
	}
}


    $scope.getCallLogs=function(dt,type)
    {
        $scope.CallLogs=[];
    	var todayStr = dt.join(' ');
    	//$scope.callIds = [];
    	var ShowDt=dt[2]+' '+dt[1]+','+dt[3];
    	for(var i=0;i<$scope.cdrResponseArray.length;i++)
    	{
    		//var index = $scope.callIds.indexOf($scope.cdrResponseArray[i].other_leg_call_id)
    		//if(index < 0)
    		//{
	    		var dt = $scope.cdrResponseArray[i].datetime.substr(0,10);
	    		var d = new Date(dt); 
	    		d.setHours(0, 0, 0, 0);
	 
	            var time = $scope.cdrResponseArray[i].datetime.substr(10,6);

	    		var toStr = d.toString().substr(0,15);
	    		if($scope.RoleUser == 3)
	    		{
	    			if($scope.cdrResponseArray[i].callee_id_number.charAt(0) === '0')
					{
						$scope.cdrResponseArray[i].callee_id_number = $scope.cdrResponseArray[i].callee_id_number.substr(1);
					}
		    		if($scope.phnNumbers == 'all')
		    		{
		    			if(($scope.mobNum  == $scope.cdrResponseArray[i].caller_id_number) || ($scope.mobNum  == $scope.cdrResponseArray[i].callee_id_number))
						{
			    			if(todayStr == toStr)
			    			{  
			    				if(type == 'answered')
			    				{                 

			    					if($scope.cdrResponseArray[i].hangup_cause == 'NORMAL_CLEARING')
			    					{
			    						if($scope.cdrResponseArray[i].other_leg_call_id.indexOf('@') > -1) 
										{
											if ($scope.cdrResponseArray[i].callee_id_number.match(/[a-z]/i)) {
											}
											else{	
												if($scope.cdrResponseArray[i].direction == 'outbound')
												{	console.log($scope.cdrResponseArray[i]);
													console.log($scope.outgoingNumbers); 
													if($scope.outgoingNumbers.indexOf($scope.cdrResponseArray[i].caller_id_number) < 0)
													{
														if($scope.cdrResponseArray[i].callee_id_number == '')
							                            {
							                                $scope.CallLogs.unshift({'date':ShowDt, 'type':$scope.cdrResponseArray[i].hangup_cause, 'caller': $scope.cdrResponseArray[i].caller_id_number, 'caller_number': $scope.cdrResponseArray[i].calling_from, 'duration': $scope.cdrResponseArray[i].billing_seconds,'total_duration': $scope.cdrResponseArray[i].duration_seconds, 'time': time, 'call_id':$scope.cdrResponseArray[i].other_leg_call_id});    
							                            }
							                            else
							                            {
							    						  $scope.CallLogs.unshift({'date':ShowDt,'type':$scope.cdrResponseArray[i].hangup_cause,'caller': $scope.cdrResponseArray[i].caller_id_number, 'caller_number': $scope.cdrResponseArray[i].callee_id_number, 'duration': $scope.cdrResponseArray[i].billing_seconds,'total_duration': $scope.cdrResponseArray[i].duration_seconds, 'time': time, 'call_id':$scope.cdrResponseArray[i].other_leg_call_id});
							    					    }
													}
						    					}
					    					}
				    					}
			                        }
			    				}
			    				else if(type == 'outbound')
			    				{                     
			    					if($scope.cdrResponseArray[i].hangup_cause == 'NORMAL_CLEARING')
			    					{
			    						if($scope.cdrResponseArray[i].other_leg_call_id.indexOf('@') > -1) 
										{
											if ($scope.cdrResponseArray[i].callee_id_number.match(/[a-z]/i)) {
											}
											else{	
												if($scope.cdrResponseArray[i].direction == 'outbound')
												{
						                            if($scope.outgoingNumbers.indexOf($scope.cdrResponseArray[i].caller_id_number) > -1)
													{
						    						  $scope.CallLogs.unshift({'date':ShowDt,'type':'outgoing','caller': $scope.cdrResponseArray[i].caller_id_number, 'caller_number': $scope.cdrResponseArray[i].callee_id_number, 'duration': $scope.cdrResponseArray[i].billing_seconds,'total_duration': $scope.cdrResponseArray[i].duration_seconds, 'time': time, 'call_id':$scope.cdrResponseArray[i].other_leg_call_id});
						    					    }
						    					}
					    					}
				    					}
			                        }
			    				}
			    				else if(type == 'missed')
			    				{
			    					if($scope.cdrResponseArray[i].hangup_cause !== 'NORMAL_CLEARING')
			    					{
			    						if($scope.cdrResponseArray[i].other_leg_call_id.indexOf('@') > -1) 
										{
											if ($scope.cdrResponseArray[i].callee_id_number.match(/[a-z]/i)) {
											}
											else{
												if($scope.cdrResponseArray[i].direction == 'outbound')
												{
													if($scope.cdrResponseArray[i].callee_id_number == $scope.mobNum)
													{
														if($scope.cdrResponseArray[i].callee_id_number == '')
							                            {
							    						  $scope.CallLogs.unshift({'date':ShowDt,'type':'missed', 'caller': $scope.cdrResponseArray[i].caller_id_number, 'caller_number': $scope.cdrResponseArray[i].calling_from, 'duration': $scope.cdrResponseArray[i].billing_seconds,'total_duration': $scope.cdrResponseArray[i].duration_seconds, 'time': time, 'call_id':$scope.cdrResponseArray[i].other_leg_call_id});
							    					    }
							                            else
							                            {
							                                $scope.CallLogs.unshift({'date':ShowDt,'type':'missed', 'caller': $scope.cdrResponseArray[i].caller_id_number, 'caller_number': $scope.cdrResponseArray[i].callee_id_number, 'duration': $scope.cdrResponseArray[i].billing_seconds,'total_duration': $scope.cdrResponseArray[i].duration_seconds, 'time': time, 'call_id':$scope.cdrResponseArray[i].other_leg_call_id});
							                            }
													}
						                            
						                        }
					                        }
				                        }
			                        }
			    				}
			    			}
			    		}
		            }							
		    		else
		    		{
		    			if(($scope.mobNum  == $scope.cdrResponseArray[i].caller_id_number) || ($scope.mobNum  == $scope.cdrResponseArray[i].callee_id_number))
						{
			    			if($scope.phnNumbers  == $scope.cdrResponseArray[i].dialed_number)
			    			{
			    				if(todayStr == toStr)
			    				{ 
			    					if(type == 'answered')
			    					{                     
			    						if($scope.cdrResponseArray[i].hangup_cause == 'NORMAL_CLEARING')
			    						{   
			                                if($scope.cdrResponseArray[i].other_leg_call_id.indexOf('@') > -1) 
											{
												if ($scope.cdrResponseArray[i].callee_id_number.match(/[a-z]/i)) {
												}
												else{
													if($scope.cdrResponseArray[i].direction == 'outbound')
													{
						                                if($scope.cdrResponseArray[i].callee_id_number == '')
						                                {	
						    							     $scope.CallLogs.unshift({'date':ShowDt,'type':$scope.cdrResponseArray[i].hangup_cause, 'caller': $scope.cdrResponseArray[i].caller_id_number, 'caller_number': $scope.cdrResponseArray[i].calling_from, 'duration': $scope.cdrResponseArray[i].billing_seconds,'total_duration': $scope.cdrResponseArray[i].duration_seconds, 'time': time, 'call_id':$scope.cdrResponseArray[i].other_leg_call_id});
						    						    }
						                                else
						                                {
						                                    $scope.CallLogs.unshift({'date':ShowDt,'type':$scope.cdrResponseArray[i].hangup_cause, 'caller': $scope.cdrResponseArray[i].caller_id_number, 'caller_number': $scope.cdrResponseArray[i].callee_id_number, 'duration': $scope.cdrResponseArray[i].billing_seconds,'total_duration': $scope.cdrResponseArray[i].duration_seconds, 'time': time, 'call_id':$scope.cdrResponseArray[i].other_leg_call_id});                                    
						                                }
						                            }
					                            }
				                            }
			                            }
			    					}
			    					else if(type == 'missed')
			    					{
			    						if($scope.cdrResponseArray[i].hangup_cause !== 'NORMAL_CLEARING')
			    						{
			                                if($scope.cdrResponseArray[i].other_leg_call_id.indexOf('@') > -1) 
											{
												if ($scope.cdrResponseArray[i].callee_id_number.match(/[a-z]/i)) {
												}
												else{
													if($scope.cdrResponseArray[i].direction == 'outbound')
													{
						                                if($scope.cdrResponseArray[i].callee_id_number == '')
						                                {
						    							     $scope.CallLogs.unshift({'date':ShowDt,'type':$scope.cdrResponseArray[i].hangup_cause, 'caller': $scope.cdrResponseArray[i].caller_id_number, 'caller_number': $scope.cdrResponseArray[i].calling_from, 'duration': $scope.cdrResponseArray[i].billing_seconds,'total_duration': $scope.cdrResponseArray[i].duration_seconds, 'time': time, 'call_id':$scope.cdrResponseArray[i].other_leg_call_id});
						    						    }
						                                else
						                                {
						                                    $scope.CallLogs.unshift({'date':ShowDt,'type':$scope.cdrResponseArray[i].hangup_cause, 'caller': $scope.cdrResponseArray[i].caller_id_number, 'caller_number': $scope.cdrResponseArray[i].callee_id_number, 'duration': $scope.cdrResponseArray[i].billing_seconds,'total_duration': $scope.cdrResponseArray[i].duration_seconds, 'time': time, 'call_id':$scope.cdrResponseArray[i].other_leg_call_id});
						                                }
						                            }
					                            }
				                            }
			                            }
			    					}
			    					else if(type == 'outbound')
			    					{                     
			    						if($scope.cdrResponseArray[i].hangup_cause == 'OUTGOING_CALL_BARRED')
			    						{   
			                                if($scope.cdrResponseArray[i].other_leg_call_id.indexOf('@') > -1) 
											{
												if ($scope.cdrResponseArray[i].callee_id_number.match(/[a-z]/i)) {
												}
												else{
													if($scope.cdrResponseArray[i].direction == 'outbound')
													{
						                                if($scope.cdrResponseArray[i].callee_id_number == '')
						                                {	
						    							     $scope.CallLogs.unshift({'date':ShowDt,'type':$scope.cdrResponseArray[i].hangup_cause, 'caller': $scope.cdrResponseArray[i].caller_id_number, 'caller_number': $scope.cdrResponseArray[i].calling_from, 'duration': $scope.cdrResponseArray[i].billing_seconds,'total_duration': $scope.cdrResponseArray[i].duration_seconds, 'time': time, 'call_id':$scope.cdrResponseArray[i].other_leg_call_id});
						    						    }
						                                else
						                                {
						                                    $scope.CallLogs.unshift({'date':ShowDt,'type':$scope.cdrResponseArray[i].hangup_cause, 'caller': $scope.cdrResponseArray[i].caller_id_number, 'caller_number': $scope.cdrResponseArray[i].callee_id_number, 'duration': $scope.cdrResponseArray[i].billing_seconds,'total_duration': $scope.cdrResponseArray[i].duration_seconds, 'time': time, 'call_id':$scope.cdrResponseArray[i].other_leg_call_id});                                    
						                                }
						                            }
					                            }
				                            }
			                            }
			    					}											
			    				}
			    			}
			    		}
					}	
				}
				else
				{
					if($scope.phnNumbers == 'all')
		    		{
		    			if(todayStr == toStr)
		    			{  
		    				if(type == 'answered')
		    				{                     
		    					if($scope.cdrResponseArray[i].hangup_cause == 'NORMAL_CLEARING')
		    					{
		    						if($scope.cdrResponseArray[i].other_leg_call_id.indexOf('@') > -1) 
									{
										if ($scope.cdrResponseArray[i].callee_id_number.match(/[a-z]/i)) {
										}
										else{	
											if($scope.cdrResponseArray[i].direction == 'outbound')
											{	
												if($scope.outgoingNumbers.indexOf($scope.cdrResponseArray[i].caller_id_number) < 0)
												{
													if($scope.cdrResponseArray[i].callee_id_number == '')
						                            {
						                                $scope.CallLogs.unshift({'date':ShowDt, 'type':$scope.cdrResponseArray[i].hangup_cause, 'caller': $scope.cdrResponseArray[i].caller_id_number, 'caller_number': $scope.cdrResponseArray[i].calling_from, 'duration': $scope.cdrResponseArray[i].billing_seconds,'total_duration': $scope.cdrResponseArray[i].duration_seconds, 'time': time, 'call_id':$scope.cdrResponseArray[i].other_leg_call_id});    
						                            }
						                            else
						                            {
						    						  $scope.CallLogs.unshift({'date':ShowDt,'type':$scope.cdrResponseArray[i].hangup_cause,'caller': $scope.cdrResponseArray[i].caller_id_number, 'caller_number': $scope.cdrResponseArray[i].callee_id_number, 'duration': $scope.cdrResponseArray[i].billing_seconds,'total_duration': $scope.cdrResponseArray[i].duration_seconds, 'time': time, 'call_id':$scope.cdrResponseArray[i].other_leg_call_id});
						    					    }
												}
					    					}
				    					}
			    					}
		                        }
		    				}
		    				else if(type == 'outbound')
		    				{                     
		    					if($scope.cdrResponseArray[i].hangup_cause == 'NORMAL_CLEARING')
		    					{
		    						if($scope.cdrResponseArray[i].other_leg_call_id.indexOf('@') > -1) 
									{
										if ($scope.cdrResponseArray[i].callee_id_number.match(/[a-z]/i)) {
										}
										else{	
											if($scope.cdrResponseArray[i].direction == 'outbound')
											{
					                            if($scope.outgoingNumbers.indexOf($scope.cdrResponseArray[i].caller_id_number) > -1)
												{
					    						  $scope.CallLogs.unshift({'date':ShowDt,'type':'outgoing','caller': $scope.cdrResponseArray[i].caller_id_number, 'caller_number': $scope.cdrResponseArray[i].callee_id_number, 'duration': $scope.cdrResponseArray[i].billing_seconds,'total_duration': $scope.cdrResponseArray[i].duration_seconds, 'time': time, 'call_id':$scope.cdrResponseArray[i].other_leg_call_id});
					    					    }
					    					}
				    					}
			    					}
		                        }
		    				}
		    				else if(type == 'missed')
		    				{
		    					if($scope.cdrResponseArray[i].hangup_cause !== 'NORMAL_CLEARING')
		    					{
		    						if($scope.cdrResponseArray[i].other_leg_call_id.indexOf('@') > -1) 
									{
										if ($scope.cdrResponseArray[i].callee_id_number.match(/[a-z]/i)) {
										}
										else{
											if($scope.cdrResponseArray[i].direction == 'outbound')
											{
					                            if($scope.cdrResponseArray[i].callee_id_number == '')
					                            {
					    						  $scope.CallLogs.unshift({'date':ShowDt,'type':'missed', 'caller': $scope.cdrResponseArray[i].caller_id_number, 'caller_number': $scope.cdrResponseArray[i].calling_from, 'duration': $scope.cdrResponseArray[i].billing_seconds,'total_duration': $scope.cdrResponseArray[i].duration_seconds, 'time': time, 'call_id':$scope.cdrResponseArray[i].other_leg_call_id});
					    					    }
					                            else
					                            {
					                                $scope.CallLogs.unshift({'date':ShowDt,'type':'missed', 'caller': $scope.cdrResponseArray[i].caller_id_number, 'caller_number': $scope.cdrResponseArray[i].callee_id_number, 'duration': $scope.cdrResponseArray[i].billing_seconds,'total_duration': $scope.cdrResponseArray[i].duration_seconds, 'time': time, 'call_id':$scope.cdrResponseArray[i].other_leg_call_id});
					                            }
					                        }
				                        }
			                        }
		                        }
		    				}
		    			}
		            }							
		    		else
		    		{
		    			if($scope.phnNumbers  == $scope.cdrResponseArray[i].dialed_number)
		    			{
		    				if(todayStr == toStr)
		    				{ 
		    					if(type == 'answered')
		    					{                     
		    						if($scope.cdrResponseArray[i].hangup_cause == 'NORMAL_CLEARING')
		    						{   
		                                if($scope.cdrResponseArray[i].other_leg_call_id.indexOf('@') > -1) 
										{
											if ($scope.cdrResponseArray[i].callee_id_number.match(/[a-z]/i)) {
											}
											else{
												if($scope.cdrResponseArray[i].direction == 'outbound')
												{
					                                if($scope.cdrResponseArray[i].callee_id_number == '')
					                                {	
					    							     $scope.CallLogs.unshift({'date':ShowDt,'type':$scope.cdrResponseArray[i].hangup_cause, 'caller': $scope.cdrResponseArray[i].caller_id_number, 'caller_number': $scope.cdrResponseArray[i].calling_from, 'duration': $scope.cdrResponseArray[i].billing_seconds,'total_duration': $scope.cdrResponseArray[i].duration_seconds, 'time': time, 'call_id':$scope.cdrResponseArray[i].other_leg_call_id});
					    						    }
					                                else
					                                {
					                                    $scope.CallLogs.unshift({'date':ShowDt,'type':$scope.cdrResponseArray[i].hangup_cause, 'caller': $scope.cdrResponseArray[i].caller_id_number, 'caller_number': $scope.cdrResponseArray[i].callee_id_number, 'duration': $scope.cdrResponseArray[i].billing_seconds,'total_duration': $scope.cdrResponseArray[i].duration_seconds, 'time': time, 'call_id':$scope.cdrResponseArray[i].other_leg_call_id});                                    
					                                }
					                            }
				                            }
			                            }
		                            }
		    					}
		    					else if(type == 'missed')
		    					{
		    						if($scope.cdrResponseArray[i].hangup_cause !== 'NORMAL_CLEARING')
		    						{
		                                if($scope.cdrResponseArray[i].other_leg_call_id.indexOf('@') > -1) 
										{
											if ($scope.cdrResponseArray[i].callee_id_number.match(/[a-z]/i)) {
											}
											else{
												if($scope.cdrResponseArray[i].direction == 'outbound')
												{
					                                if($scope.cdrResponseArray[i].callee_id_number == '')
					                                {
					    							     $scope.CallLogs.unshift({'date':ShowDt,'type':$scope.cdrResponseArray[i].hangup_cause, 'caller': $scope.cdrResponseArray[i].caller_id_number, 'caller_number': $scope.cdrResponseArray[i].calling_from, 'duration': $scope.cdrResponseArray[i].billing_seconds,'total_duration': $scope.cdrResponseArray[i].duration_seconds, 'time': time, 'call_id':$scope.cdrResponseArray[i].other_leg_call_id});
					    						    }
					                                else
					                                {
					                                    $scope.CallLogs.unshift({'date':ShowDt,'type':$scope.cdrResponseArray[i].hangup_cause, 'caller': $scope.cdrResponseArray[i].caller_id_number, 'caller_number': $scope.cdrResponseArray[i].callee_id_number, 'duration': $scope.cdrResponseArray[i].billing_seconds,'total_duration': $scope.cdrResponseArray[i].duration_seconds, 'time': time, 'call_id':$scope.cdrResponseArray[i].other_leg_call_id});
					                                }
					                            }
				                            }
			                            }
		                            }
		    					}
		    					else if(type == 'outbound')
		    					{                     
		    						if($scope.cdrResponseArray[i].hangup_cause == 'OUTGOING_CALL_BARRED')
		    						{   
		                                if($scope.cdrResponseArray[i].other_leg_call_id.indexOf('@') > -1) 
										{
											if ($scope.cdrResponseArray[i].callee_id_number.match(/[a-z]/i)) {
											}
											else{
												if($scope.cdrResponseArray[i].direction == 'outbound')
												{
					                                if($scope.cdrResponseArray[i].callee_id_number == '')
					                                {	
					    							     $scope.CallLogs.unshift({'date':ShowDt,'type':$scope.cdrResponseArray[i].hangup_cause, 'caller': $scope.cdrResponseArray[i].caller_id_number, 'caller_number': $scope.cdrResponseArray[i].calling_from, 'duration': $scope.cdrResponseArray[i].billing_seconds,'total_duration': $scope.cdrResponseArray[i].duration_seconds, 'time': time, 'call_id':$scope.cdrResponseArray[i].other_leg_call_id});
					    						    }
					                                else
					                                {
					                                    $scope.CallLogs.unshift({'date':ShowDt,'type':$scope.cdrResponseArray[i].hangup_cause, 'caller': $scope.cdrResponseArray[i].caller_id_number, 'caller_number': $scope.cdrResponseArray[i].callee_id_number, 'duration': $scope.cdrResponseArray[i].billing_seconds,'total_duration': $scope.cdrResponseArray[i].duration_seconds, 'time': time, 'call_id':$scope.cdrResponseArray[i].other_leg_call_id});                                    
					                                }
					                            }
				                            }
			                            }
		                            }
		    					}											
		    				}
		    			}
					}
				}

	    		//$scope.callIds.push($scope.cdrResponseArray[i].other_leg_call_id);
	    	//}
    	}
    	//console.log($scope.CallLogs);
    }

$scope.getcdrsMonth=function()
{
	var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
	var firstDate = new Date($scope.date_from);
	var secondDate = new Date($scope.date_to);
	var initialDate=$scope.date_from.substring(3,5);
	var initialMonth=$scope.date_from.substring(0,2);
	var dateInt = parseInt(initialDate);
	if((initialMonth == '01') || (initialMonth == '03') || (initialMonth == '05') || (initialMonth == '07') || (initialMonth == '08') || (initialMonth == '10') || (initialMonth == '12'))
	{
		var splitSize = 31-(dateInt-1);
	}
	else if((initialMonth == '04')|| (initialMonth == '06')|| (initialMonth == '09')|| (initialMonth == '11'))
	{
		var splitSize = 30-(dateInt-1);
	}
	else
	{
		var splitSize = 28-(dateInt-1);
	}




	var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
	var SortWeekWise = [];
	while($scope.cdrDetail.length) {
    		SortWeekWise.push($scope.cdrDetail.splice(0,splitSize));
	}
	for(var k =0;k<=SortWeekWise.length;k++)
	{
		var SortWeek = [];
		var call_answered = 0;
		var call_missed = 0;
		var voice_mail = 0;
		var outbound_call = 0;
		for(var i=0;i<SortWeekWise[k].length;i++)
		{
			var WeekfirstDate = SortWeekWise[k][0].date;
			var WeekLastDate = SortWeekWise[k][SortWeekWise[k].length-1].date
			call_answered = call_answered + SortWeekWise[k][i].call_answered
			call_missed = call_missed + SortWeekWise[k][i].call_missed
			voice_mail = voice_mail + SortWeekWise[k][i].voice_mail
			outbound_call = outbound_call + SortWeekWise[k][i].outbound_call
			

		}
		var SortedWeek = {"date":['', WeekfirstDate[1]+"'"+WeekfirstDate[3], WeekfirstDate[2]+'-'+WeekLastDate[2], ''], "call_missed":call_missed, "call_answered":call_answered, "voice_mail":voice_mail, "outbound_call":outbound_call};
		$scope.cdrDetail.push(SortedWeek)
	}
}


	$scope.show_dateOptions=function()
	{
	  $scope.dateBlock = true;
	}
	$scope.hide_dateOptions=function()
	{
	  $scope.dateBlock = false;
	}


	$scope.exportData=function(value){
	var from = new Date($scope.date_from).getTime()/1000
	var to = new Date($scope.date_to).getTime()/1000
	to = to + 800000;
	from = from+62167219200;
	to = to+62167219200;
	$scope.auth_Id = localStorage.getItem('auth');
	$scope.account_Id = localStorage.getItem('acc');
	$scope.cdrDetail= [];
	$scope.cdrDetailDates=[];
	var data1 = {"auth_token":$scope.auth_Id, "created_from": from, "created_to": to}
    var auth = Restangular.one("accounts/"+$scope.account_Id+"/cdrs")
    auth.data = data1;
	 auth.get(data1,{'X-AUTH-TOKEN': $scope.auth_Id}).then(function(data){
    		var result = data.data;
    		$scope.calls=[];
       		for(var i=0;i<result.length;i++)
    		{
    				if(result[i].other_leg_call_id.indexOf('@') > -1) 
					{
						if(result[i].callee_id_number.match(/[a-z]/i)) {
						}
						else{
							if(result[i].direction == 'outbound')
							{

								var time = result[i].datetime.substr(10,6);
								var dt = result[i].datetime.substr(0,10);
								var d = new Date(dt); 
								d.setHours(0, 0, 0, 0);
								var toStr = d.toString().substr(0,15);
								toStr = toStr.split(' ');
								if($scope.outgoingNumbers.indexOf(result[i].caller_id_number) > -1)
								{
									if(result[i].hangup_cause == 'NORMAL_CLEARING')
									{
										$scope.calls.unshift({'Date':toStr[2]+' '+ toStr[1]+' ' +toStr[3],'Type':'outgoing','Caller': result[i].caller_id_number, 'Time':time, 'User': result[i].callee_id_number, 'Duration': result[i].billing_seconds, 'call_id':result[i].other_leg_call_id});
									}									
								}
								else
								{
									if(result[i].hangup_cause == 'NORMAL_CLEARING')
									{
										$scope.calls.unshift({'Date':toStr[2]+' '+ toStr[1]+' ' +toStr[3],'Type':'answered','Caller': result[i].caller_id_number, 'Time':time, 'User': result[i].callee_id_number, 'Duration': result[i].billing_seconds, 'call_id':result[i].other_leg_call_id});
									}
									else
									{
										$scope.calls.unshift({'Date':toStr[2]+' '+ toStr[1]+' ' +toStr[3],'Type':'missed','Caller': result[i].caller_id_number, 'Time':time, 'User': result[i].callee_id_number, 'Duration': result[i].billing_seconds, 'call_id':result[i].other_leg_call_id});
									}
									
								}
    						}
    					}
    				}
        		}
				
		var data = $scope.calls;
		var export_as = value;
	if(export_as == 'csv')
	{
		var A = [['Date','Time','Caller', 'User', 'Status', 'Duration']];

		for(var j=0; j<=data.length-1; ++j){ 
		    A.push([data[j].Date, data[j].Time, data[j].Caller, data[j].User, data[j].Type, data[j].Duration]);
		}

		var csvRows = [];

		for(var i=0, l=A.length; i<l; ++i){
		    csvRows.push(A[i].join(','));
		}

		var csvString = csvRows.join("%0A");
		var a         = document.createElement('a');
		a.href        = 'data:attachment/csv,' + csvString;
		a.target      = '_blank';
		a.download    = 'call_logs.csv';

		document.body.appendChild(a);
		a.click();
	}
	else if(export_as =='excel'){
        alasql('SELECT Date, Time, Caller, User, Type, Duration INTO XLSX("call_logs.xlsx",{headers:true}) FROM ?',[data]);

	}
    });

}


});



MetronicApp.directive('datepickerfrom', function () {
	return {
		restrict: 'A',
		require: 'ngModel',
		 link: function (scope, element, attrs, ngModelCtrl) {
			element.datepicker({
				dateFormat: 'mm/dd/yy',
				maxDate: '0',
				onSelect: function (date) {
					scope.date_from = date;
					scope.$apply();
				}
			});
		}
	};
});
MetronicApp.directive('datepickerto', function () {
	return {
		restrict: 'A',
		require: 'ngModel',
		 link: function (scope, element, attrs, ngModelCtrl) {
			element.datepicker({
				//dateFormat: 'd  MM, yy',
				dateFormat: 'mm/dd/yy',
				maxDate: '0',
				onSelect: function (date) {
					scope.date_to = date;
					scope.$apply();
				}
			});
		}
	};
});

  MetronicApp.directive('modalDialog', function() {
  return {
    restrict: 'E',
    scope: {
      show: '='
    },
    replace: true, // Replace with the template below
    transclude: true, // we want to insert custom content inside the directive
    link: function(scope, element, attrs) {
      scope.dialogStyle = {};
      if (attrs.width)
        scope.dialogStyle.width = attrs.width;
      if (attrs.height)
        scope.dialogStyle.height = attrs.height;
      scope.hideModal = function() {
        scope.show = false;
      };
    },
    template: "<div class='ng-modal' ng-show='show'><div class='ng-modal-overlay' ng-click='hideModal()'></div><div class='ng-modal-dialog' ng-style='dialogStyle'><!--<div class='ng-modal-close' ng-click='hideModal()'><img src ='../images/close_icon.png'/>X</div>--><div class='ng-modal-dialog-content' ng-transclude></div></div></div>"
  };
});

MetronicApp.directive('dateBlock', function() {
  return {
    restrict: 'E',
    scope: {
      show: '='
    },
    replace: true, // Replace with the template below
    transclude: true, // we want to insert custom content inside the directive
    link: function(scope, element, attrs) {
      scope.dialogStyle = {};
      if (attrs.width)
        scope.dialogStyle.width = attrs.width;
      if (attrs.height)
        scope.dialogStyle.height = attrs.height;
      scope.hideModal = function() {
      scope.show = false;
      };
    },
    template: "<div class='ng-modal' ng-show='show'><div class='ng-modal-overlay' ng-click='hideModal()'></div><div class='ng-modal-dialog' style='height:200px;width:400px;left:70%;top:52%;'><div class='ng-modal-dialog-content' ng-transclude></div></div></div>"
  };
});




//'use strict';
var baseurl = "http://43.252.243.10:8000/v1/";
var fordata;

var userParticular = [{
  'numbers': [
    '10002'
  ],
  'flow': {
    'data': {
      'id': '8837dc709f93865ce2799b706ee20403'
    },
    'module': 'menu',
    'children': {
      '0': {
        'data': {
          'id': '8837dc709f93865ce2799b706ee20403'
        },
        'module': 'menu',
        'children': {
          '1': {
            'data': {
              'id': '48f66436b8703c8c58e26d3f726a2cde'
            },
            'module': 'play',
            'children': {
              '0': {
                'data': {
                  'id': 'd586ca539cb982b86dec3c211244a1e0',
                  'timeout': '20',
                  'can_call_self': false
                },
                'module': 'user',
                'children': {
                }
              }
            }
          },
          '4': {
            'data': {
              'id': '8837dc709f93865ce2799b706ee20403'
            },
            'module': 'menu',
            'children': {
              '0': {
                'data': {
                  'id': 'd586ca539cb982b86dec3c211244a1e0',
                  'timeout': '20',
                  'can_call_self': false
                },
                'module': 'user',
                'children': {
                }
              }
            }
          }
        }
      },
      '6': {
        'data': {
          'id': '05ca6e79398858fc74f6c0de457621ed'
        },
        'module': 'voicemail',
        'children': {
        }
      }
    }
  },
  'contact_list': {
    'exclude': false
  },
  'ui_metadata': {
    'ui': 'kazoo-ui',
    'version': 'v3.16-2'
  },
  'patterns': [
  ],
  'id': '75ef362bb8980440136257c5c7c048e9',
  'metadata': {
    '8837dc709f93865ce2799b706ee20403': {
      'name': '1234Test',
      'pvt_type': 'menu'
    },
    '05ca6e79398858fc74f6c0de457621ed': {
      'name': 'greetings',
      'pvt_type': 'vmbox'
    },
    'd586ca539cb982b86dec3c211244a1e0': {
      'name': 'PulkitNormal SoodNormal',
      'pvt_type': 'user'
    },
    '48f66436b8703c8c58e26d3f726a2cde': {
      'name': '1234-media',
      'pvt_type': 'media'
    }
  }
}];



MetronicApp.controller('SuperRecCallFLowController', function($rootScope, $scope, $http, $timeout, $modal,$stateParams,resourcesService ) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        // Metronic.initAjax();

    console.log($stateParams.id);
    $scope.numberData=[];
    // $scope.getCallFlowData= function(id, event){
    //     $http.get(baseurl+'accounts/'+accountId+'/callflows/'+id, {
    //         headers: {'X-Auth-Token': authId}}).then(function(data) {
    //             $timeout(function(){
    //                 console.log(data);
    //                 $scope.numberData=data.data;
    //                 console.log(data);
    //             },500)   
    //      });
    // };
    resourcesService.getCallflowDetail($stateParams.id).then(function(data) {
            $timeout(function(){
                // console.log(data);
                //$scope.numberData=data.data;
                console.log("Chjascbkasnclasnclasnclasnclacnalscnaslkcnasclkascnlk");
                console.log(data);
                fordata = data.data;
                $scope.flowsCall=data.data;
                console.log($scope.flowsCall);
            },500)   
     });
    // $http.get(baseurl+'accounts/'+accountId+'/callflows/'+$stateParams.id, {
    //     headers: {'X-Auth-Token': authId}}).then(function(data) {
    //         $timeout(function(){
    //             // console.log(data);
    //             //$scope.numberData=data.data;
    //             console.log(data);
    //             $scope.flowsCall=data.data.data;
    //             console.log($scope.flowsCall);
    //         },500)   
    //  });
        
        // $scope.flows=[];
    // $scope.flowsCall=userParticular[0];



    $scope.openAction = function (module,child,a,b) {
        console.log(module);
        console.log(child);
        var levels = a+b;
        var modalInstance = $modal.open({
          templateUrl: 'actionModal.html',
          controller: 'modalActionCtrl',
          resolve: {
            actionModule: function () {
              return module;
              },
              actionLevels: function () {
              return levels;
              },
              resourcesUser:function(){
                  return resourcesService.getAllUser()
              },
              resourcesMedia:function(){
                  return resourcesService.getAllMedia()
              }
          }
        });
    };


        





    });

});


MetronicApp.controller('modalActionCtrl',function( $modalInstance, $scope, $http, actionModule, actionLevels, $timeout, resourcesUser, resourcesMedia) {
    $scope.values = [{
        id: 1,
        label: 'Menu',
        value: 'menu'      
      }, {
        id: 2,
        label: 'User',
        value: 'user'    
      }, {
        id: 3,
        label: 'Play',
        value: 'play'    
      }, {
        id: 4,
        label: 'Voicemail',
        value: 'voicemail'
      }];

    $scope.action={};
    $scope.actionCallData={};
      
    $scope.action.selected={value:actionModule};

    //console.log($scope.agentsAllName) ; 
    if(actionModule === "user"){
        $scope.agentsAllName=[];
        $scope.agentsAllName = resourcesUser.data;
        console.log($scope.flowsCall);
    }else if (actionModule === "play"){
        $scope.mediaAllName=[];
        $scope.mediaAllName = resourcesMedia.data;

    }




    var output = [],
    sNumber = "040"

    for (var i = 0, len = sNumber.length; i < len; i += 1) {
        output.push(+sNumber.charAt(i));
    }

    console.log(output);

    var data =fordata;
    var newData=".flow";
    for(var i=0; i<sNumber.length; i++) {
      newData += ".children["+output[i]+"]";
    }
    var c= JSON.stringify(newData.toString());
    console.log(typeof newData);
    // console.log(data);

    console.log(window['data'+'newData']);
    console.log(window['fordata']+newData);
    // $scope.addAgentFn = function (isValid) {

    //     if (isValid) {
    //         var sendData = {"data":{
    //               'first_name': $scope.newAgent.agentName,
    //               'last_name': $scope.newAgent.agentName,
    //               'caller_id': {
    //                 'internal': {
    //                   'name': $scope.newAgent.agentName,
    //                   'number': $scope.newAgent.agentNumber
    //                 },
    //                 'external': {
    //                   'name': $scope.newAgent.agentName,
    //                   'number': $scope.newAgent.agentNumber
    //                 }
    //               },
    //               'username': $scope.newAgent.agentEmail
    //             }
    //         };

    //         //alert('our form is amazing');
    //         console.log($scope.newAgent);
    //         console.log(sendData);
    //         // $http.put('http://43.252.243.10:8000/v1/'+'accounts/'+accountId+'/users',sendData, {
    //         //     headers: {'X-Auth-Token': authId}}).then(function(data) {
    //         //         console.log(data);
    //         //         mediaData=data;
    //         //  });
    //         $modalInstance.close();
    //     }   
    // };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});





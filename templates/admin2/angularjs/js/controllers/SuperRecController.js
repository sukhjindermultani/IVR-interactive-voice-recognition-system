//'use strict';
var baseurl = "http://43.252.243.10:8000/v1/";
MetronicApp.controller('SuperRecController', function($rootScope, $scope, $http, $timeout, $modal ) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        Metronic.initAjax();

    var call= [{
        'id': 'ecd115f86402aadad4ef64219b19262b',
        'numbers': [
          '7696602451'
        ],
        'patterns': [
        ],
        'featurecode': false
      },
      {
        'id': 'b80805830c7ddb8cb302cbadde222267',
        'numbers': [
          '1001'
        ],
        'patterns': [
        ],
        'featurecode': false
      },
      {
        'id': '75ef362bb8980440136257c5c7c048e9',
        'numbers': [
          '10002'
        ],
        'patterns': [
        ],
        'featurecode': false
      },
      {
        'id': '5e14ebbfd329ded4aeec9056b711be4d',
        'numbers': [
          '5555'
        ],
        'patterns': [
        ],
        'featurecode': false
      },
      {
        'id': '460f1eff06fa0c7e2880f0b45fdbddac',
        'numbers': [
          '1002'
        ],
        'patterns': [
        ],
        'featurecode': false
      },
      {
        'id': '3917a8df8b1a86b874205ec64f665cdd',
        'numbers': [
          '*19737'
        ],
        'patterns': [
        ],
        'featurecode': false
      },
      {
        'id': '2b24adc49fe365dcc8e51b1078cf60ac',
        'numbers': [
          '1817102500'
        ],
        'patterns': [
        ],
        'featurecode': false
      }];

    $scope.callNumbers = [];
    $scope.callNumbers = call;
    // $http.get(baseurl+'accounts/'+accountId+'/callflows', {
    //     headers: {'X-Auth-Token': authId}}).then(function(data) {
    //         console.log(data);
    //         $scope.callNumbers=data.data;
    //  });
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageSidebarClosed = false;

    
    $scope.tabs = [
        { title:'Dynamic Title 1', content:'Select Tab for data' },
        { title:'Dynamic Title 2', content:'Select Tab for data', disabled: true }
    ];

    $scope.numberData=[];;
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

$scope.fortest=[{
  'data': {
    'numbers': [
      '7696602451'
    ],
    'flow': {
      'data': {
        'id': '8837dc709f93865ce2799b706ee20403'
      },
      'module': 'menu',
      'children': {
        '1': {
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
    'ui_metadata': {
      'ui': 'kazoo-ui',
      'version': 'v3.16-2'
    },
    'patterns': [
    ],
    'id': 'ecd115f86402aadad4ef64219b19262b',
    'metadata': {
      '8837dc709f93865ce2799b706ee20403': {
        'name': '1234Test',
        'pvt_type': 'menu'
      },
      'd586ca539cb982b86dec3c211244a1e0': {
        'name': 'PulkitNormal SoodNormal',
        'pvt_type': 'user'
      }
    }
  },
  'revision': '1-210e1500a7df7e5e2a9511a4cfa92f8f',
  'request_id': '01f0003c735cbeab7a6bb4f21b58804f',
  'status'
  : 'success',
  'auth_token': '875331a163a7d07064f10e27f8356e34'
}];

    });

});

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

MetronicApp.controller('modalCtrl',function( $modalInstance, $scope,$http) {
    $scope.newAgent={};

    $scope.addAgentFn = function (isValid) {

        if (isValid) {
            var sendData = {"data":{
                  'first_name': $scope.newAgent.agentName,
                  'last_name': $scope.newAgent.agentName,
                  'caller_id': {
                    'internal': {
                      'name': $scope.newAgent.agentName,
                      'number': $scope.newAgent.agentNumber
                    },
                    'external': {
                      'name': $scope.newAgent.agentName,
                      'number': $scope.newAgent.agentNumber
                    }
                  },
                  'username': $scope.newAgent.agentEmail
                }
            };

            //alert('our form is amazing');
            console.log($scope.newAgent);
            console.log(sendData);
            // $http.put('http://43.252.243.10:8000/v1/'+'accounts/'+accountId+'/users',sendData, {
            //     headers: {'X-Auth-Token': authId}}).then(function(data) {
            //         console.log(data);
            //         mediaData=data;
            //  });
            $modalInstance.close();
        }   
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});





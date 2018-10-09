//'use strict';
var baseurl = "http://43.252.243.10:8000/v1/";
MetronicApp.controller('ResourcesController', function($rootScope, $scope, $http, $timeout,$modal ) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        Metronic.initAjax();




    $scope.sounds = [];
    $http.get(baseurl+'accounts/'+accountId+'/media', {
    headers: {'X-Auth-Token': authId}}).then(function(data) {
        console.log(data);
        $scope.sounds=data.data;
     });
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageSidebarClosed = false;

    $scope.allAgents = [];

    $http.get(baseurl+'accounts/'+accountId+'/users', {
        headers: {'X-Auth-Token': authId}}).then(function(data) {
        //console.log(data);
        allAgents1 = data.data;
        // console.log(data.data);
        $scope.allAgents=data.data;
     });


    $scope.delUser = function(id,$event,at) {
        $http.delete(baseurl+'accounts/'+accountId+'/users/'+id, { //
            headers: {'X-Auth-Token': authId}}).then(function(data) {
            alert('User is deleted');
         });

        angular.element($event.target).parents('tr').remove();
    };


    $scope.downloadFile = function(id,$event,authSound) {
        //window.location.href=baseurl+'accounts/'+accountId+'/media/'+id+'/raw?'+authId;
        // $http.get(baseurl+'accounts/'+accountId+'/media/'+id+'/raw?'+authSound, { // +id+
        //     headers: {'X-Auth-Token': authId,"Accept":" audio/mp3"}}).then(function(data) {
        //         console.log(data);
        //     //alert('User is deleted');
        //  }, function(){
        //     alert('File not found');
        //  });

        $http.get(baseurl+'accounts/'+accountId+'/media/'+id, { // +id+
            headers: {'X-Auth-Token': authId}}).then(function(data) {
                console.log(data);
                window.location.href=baseurl+'accounts/'+accountId+'/media/'+id+'/raw?auth_token='+authId;
                // $http.get(baseurl+'accounts/'+accountId+'/media/'+id+'/raw?auth_token='+data.data.data.auth_token, { // +id+
                //     headers: {'X-Auth-Token': authId,"Accept":" audio/mp3"}}).then(function(data) {
                //         console.log(data);
                //     //alert('User is deleted');
                //  }, function(){
                //     alert('File not found');
                //  });

         }, function(){
            alert('Oops something went wrong');
         });

    };


    $scope.delFile = function(id,$event) {
        console.log(id);
        $http.delete(baseurl+'accounts/'+accountId+'/media/'+id, { 
            headers: {'X-Auth-Token': authId}}).then(function(data) {
            alert('File is deleted');
         });

        angular.element($event.target).parents('tr').remove();
    };


    $scope.open = function (size) {

        var modalInstance = $modal.open({
          templateUrl: 'addAgentModal.html',
          controller: 'modalCtrl',
          size: size
        });
    };


    $scope.AddFile = function (size) {

        var modalInstance = $modal.open({
          templateUrl: 'addSoundModal.html',
          controller: 'modalSoundCtrl',
          size: size
        });
    };





    });

});



MetronicApp.controller('modalCtrl',function( $modalInstance, $scope,$http, $state) {
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
            $http.put('http://43.252.243.10:8000/v1/'+'accounts/'+accountId+'/users',sendData, {
                headers: {'X-Auth-Token': authId}}).then(function(data) {
                    console.log(data);
                    mediaData=data;
                    console.log(mediaData);
                    $state.reload();
             });
            $modalInstance.close();
        }   
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});




MetronicApp.controller('modalSoundCtrl',function( $modalInstance, $scope,$http) {
    $scope.newAgent={};

    $scope.chak;
    // $scope.chak=[];
    
    $scope.addSoundFn=function(theEvt){
        thefile = theEvt.target.files[0];
        console.log(thefile);
        if (thefile != null) {
            reader = new FileReader();
            reader.readAsDataURL(thefile);
            console.log(reader.result);
        };
        $modalInstance.close();
    };
    //document.getElementById("soundBrowse").addEventListener("change", onFileChanged);

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});


// MetronicApp.directive('onchangefile',  function(){
//     // Runs during compile
//     return {
//         // name: '',
//         // priority: 1,
//         // terminal: true,
//         // scope: {}, // {} = isolate, true = child, false/undefined = no change
//         // controller: function($scope, $element, $attrs, $transclude) {},
//         // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
//         // restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
//         // template: '',
//         // templateUrl: '',
//         // replace: true,
//         // transclude: true,
//         // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
//         link: function($scope, iElm, iAttrs, controller) {
//             console.log(iElm);
//             iElm.on("change", onFileChanged);
//             $scope.result= reader.result;
//         }
//     };
// });


// var thefile = null;
// var reader = null;
// function onFileChanged(theEvt) {
//     thefile = theEvt.target.files[0];

//     reader = new FileReader();
//     reader.readAsDataURL(thefile);

    // display the file data 
   // document.getElementById("filename").innerHTML = thefile.name;
// }


MetronicApp.directive('appFilereader', function($q) {
    var slice = Array.prototype.slice;

    return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, element, attrs, ngModel) {
                if (!ngModel) return;
                //console.log(attrs.value);
                ngModel.$render = function() {};

                element.bind('change', function(e) {
                    var element = e.target;

                    $q.all(slice.call(element.files, 0).map(readFile))
                        .then(function(values) {
                            //console.log(thefile);
                            if (element.multiple) ngModel.$setViewValue(values);
                            else ngModel.$setViewValue(values.length ? values[0] : null);
                        });

                    function readFile(file) {
                        var deferred = $q.defer();

                        var reader = new FileReader();  
                        reader.onload = function(e) {
                            //console.log(file);
                            deferred.resolve(e.target.result);
                            //deferred.resolve(e.target.result);
                            scope.$apply(function(){
                                scope.chak=file;
                            });
                        };
                        reader.onerror = function(e) {
                            deferred.reject(e);
                        };
                        reader.readAsDataURL(file);

                        return deferred.promise;
                    }

                }); //change

            } //link
    }; //return
});

    
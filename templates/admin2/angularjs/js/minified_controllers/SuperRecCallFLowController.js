var baseurl="http://43.252.243.10:8000/v1/",fordata,userParticular=[{numbers:["10002"],flow:{data:{id:"8837dc709f93865ce2799b706ee20403"},module:"menu",children:{0:{data:{id:"8837dc709f93865ce2799b706ee20403"},module:"menu",children:{1:{data:{id:"48f66436b8703c8c58e26d3f726a2cde"},module:"play",children:{0:{data:{id:"d586ca539cb982b86dec3c211244a1e0",timeout:"20",can_call_self:!1},module:"user",children:{}}}},4:{data:{id:"8837dc709f93865ce2799b706ee20403"},module:"menu",children:{0:{data:{id:"d586ca539cb982b86dec3c211244a1e0",timeout:"20",can_call_self:!1},module:"user",children:{}}}}}},6:{data:{id:"05ca6e79398858fc74f6c0de457621ed"},module:"voicemail",children:{}}}},contact_list:{exclude:!1},ui_metadata:{ui:"kazoo-ui",version:"v3.16-2"},patterns:[],id:"75ef362bb8980440136257c5c7c048e9",metadata:{"8837dc709f93865ce2799b706ee20403":{name:"1234Test",pvt_type:"menu"},"05ca6e79398858fc74f6c0de457621ed":{name:"greetings",pvt_type:"vmbox"},d586ca539cb982b86dec3c211244a1e0:{name:"PulkitNormal SoodNormal",pvt_type:"user"},"48f66436b8703c8c58e26d3f726a2cde":{name:"1234-media",pvt_type:"media"}}}];MetronicApp.controller("SuperRecCallFLowController",["$rootScope","$scope","$http","$timeout","$modal","$stateParams","resourcesService",function(a,b,c,d,e,f,g){b.$on("$viewContentLoaded",function(){console.log(f.id),b.numberData=[],g.getCallflowDetail(f.id).then(function(a){d(function(){console.log("Chjascbkasnclasnclasnclasnclacnalscnaslkcnasclkascnlk"),console.log(a),fordata=a.data,b.flowsCall=a.data,console.log(b.flowsCall)},500)}),b.openAction=function(a,b,c,d){console.log(a),console.log(b);var f=c+d;e.open({templateUrl:"actionModal.html",controller:"modalActionCtrl",resolve:{actionModule:function(){return a},actionLevels:function(){return f},resourcesUser:function(){return g.getAllUser()},resourcesMedia:function(){return g.getAllMedia()}}})}})}]),MetronicApp.controller("modalActionCtrl",["$modalInstance","$scope","$http","actionModule","actionLevels","$timeout","resourcesUser","resourcesMedia",function(a,b,c,d,e,f,g,h){b.values=[{id:1,label:"Menu",value:"menu"},{id:2,label:"User",value:"user"},{id:3,label:"Play",value:"play"},{id:4,label:"Voicemail",value:"voicemail"}],b.action={},b.actionCallData={},b.action.selected={value:d},"user"===d?(b.agentsAllName=[],b.agentsAllName=g.data,console.log(b.flowsCall)):"play"===d&&(b.mediaAllName=[],b.mediaAllName=h.data);for(var i=[],j="040",k=0,l=j.length;l>k;k+=1)i.push(+j.charAt(k));console.log(i);for(var m=".flow",k=0;k<j.length;k++)m+=".children["+i[k]+"]";JSON.stringify(m.toString());console.log(typeof m),console.log(window.datanewData),console.log(window.fordata+m),b.cancel=function(){a.dismiss("cancel")}}]);
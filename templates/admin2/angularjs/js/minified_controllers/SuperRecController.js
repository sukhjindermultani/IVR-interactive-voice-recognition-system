var baseurl="http://43.252.243.10:8000/v1/";MetronicApp.controller("SuperRecController",["$rootScope","$scope","$http","$timeout","$modal",function(a,b,c,d,e){b.$on("$viewContentLoaded",function(){Metronic.initAjax();var c=[{id:"ecd115f86402aadad4ef64219b19262b",numbers:["7696602451"],patterns:[],featurecode:!1},{id:"b80805830c7ddb8cb302cbadde222267",numbers:["1001"],patterns:[],featurecode:!1},{id:"75ef362bb8980440136257c5c7c048e9",numbers:["10002"],patterns:[],featurecode:!1},{id:"5e14ebbfd329ded4aeec9056b711be4d",numbers:["5555"],patterns:[],featurecode:!1},{id:"460f1eff06fa0c7e2880f0b45fdbddac",numbers:["1002"],patterns:[],featurecode:!1},{id:"3917a8df8b1a86b874205ec64f665cdd",numbers:["*19737"],patterns:[],featurecode:!1},{id:"2b24adc49fe365dcc8e51b1078cf60ac",numbers:["1817102500"],patterns:[],featurecode:!1}];b.callNumbers=[],b.callNumbers=c,a.settings.layout.pageSidebarClosed=!1,b.tabs=[{title:"Dynamic Title 1",content:"Select Tab for data"},{title:"Dynamic Title 2",content:"Select Tab for data",disabled:!0}],b.numberData=[],b.fortest=[{data:{numbers:["7696602451"],flow:{data:{id:"8837dc709f93865ce2799b706ee20403"},module:"menu",children:{1:{data:{id:"d586ca539cb982b86dec3c211244a1e0",timeout:"20",can_call_self:!1},module:"user",children:{}}}},ui_metadata:{ui:"kazoo-ui",version:"v3.16-2"},patterns:[],id:"ecd115f86402aadad4ef64219b19262b",metadata:{"8837dc709f93865ce2799b706ee20403":{name:"1234Test",pvt_type:"menu"},d586ca539cb982b86dec3c211244a1e0:{name:"PulkitNormal SoodNormal",pvt_type:"user"}}},revision:"1-210e1500a7df7e5e2a9511a4cfa92f8f",request_id:"01f0003c735cbeab7a6bb4f21b58804f",status:"success",auth_token:"875331a163a7d07064f10e27f8356e34"}]})}]);var userParticular=[{numbers:["10002"],flow:{data:{id:"8837dc709f93865ce2799b706ee20403"},module:"menu",children:{0:{data:{id:"8837dc709f93865ce2799b706ee20403"},module:"menu",children:{1:{data:{id:"48f66436b8703c8c58e26d3f726a2cde"},module:"play",children:{}},4:{data:{id:"8837dc709f93865ce2799b706ee20403"},module:"menu",children:{0:{data:{id:"d586ca539cb982b86dec3c211244a1e0",timeout:"20",can_call_self:!1},module:"user",children:{}}}}}},6:{data:{id:"05ca6e79398858fc74f6c0de457621ed"},module:"voicemail",children:{}}}},contact_list:{exclude:!1},ui_metadata:{ui:"kazoo-ui",version:"v3.16-2"},patterns:[],id:"75ef362bb8980440136257c5c7c048e9",metadata:{"8837dc709f93865ce2799b706ee20403":{name:"1234Test",pvt_type:"menu"},"05ca6e79398858fc74f6c0de457621ed":{name:"greetings",pvt_type:"vmbox"},d586ca539cb982b86dec3c211244a1e0:{name:"PulkitNormal SoodNormal",pvt_type:"user"},"48f66436b8703c8c58e26d3f726a2cde":{name:"1234-media",pvt_type:"media"}}}];MetronicApp.controller("modalCtrl",["$modalInstance","$scope","$http",function(a,b,c){b.newAgent={},b.addAgentFn=function(c){if(c){var d={data:{first_name:b.newAgent.agentName,last_name:b.newAgent.agentName,caller_id:{internal:{name:b.newAgent.agentName,number:b.newAgent.agentNumber},external:{name:b.newAgent.agentName,number:b.newAgent.agentNumber}},username:b.newAgent.agentEmail}};console.log(b.newAgent),console.log(d),a.close()}},b.cancel=function(){a.dismiss("cancel")}}]);
"use strict";MetronicApp.controller("UserProfileController",["$rootScope","$scope","$http","$timeout",function(a,b,c,d){b.$on("$viewContentLoaded",function(){Metronic.initAjax(),Layout.setSidebarMenuActiveLink("set",$("#sidebar_menu_link_profile"))}),a.settings.layout.pageSidebarClosed=!0}]);
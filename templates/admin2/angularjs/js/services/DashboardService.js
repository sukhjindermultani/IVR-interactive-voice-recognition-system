var dashboard = {};

dashboard.updateSidebar = function() {
	var modules = localStorage.getItem("module");
	var	mod = modules.split(',');
	if(modules)
	{		
		for(var i=0; i<mod.length;i++)
		{
			if(mod[i] == 'DASHBOARD')
			{
				var html = '<li class="start">';
				html +=	'<a href="#/dashboard.html">';
				html +=	'<i class="icon-home"></i>';
				html +=	'<span class="title">Dashboard</span>';
				html +=	'</a>';
				html += '</li>';
				$("#sideMenu").append(html);
			}
			if(mod[i] == 'SUPER_ADMIN_CONSOLE')
			{
				// var html = '<li>';
				// html +=	'<a href="#/superReceptionist.html">';
				// html +=	'<i class="icon-earphones-alt"></i>';
				// html +=	'<span class="title">Super Receptionist</span>';
				// html +=	'</a>';
				// html += '</li>';
				// $("#sideMenu").append(html);
				var html1 = '<li>';
				html1 +=	'<a href="#/manage_plan.html">';
				html1 +=	'<i class="icon-bulb"></i>';
				html1 +=	'<span class="title">Manage Plans</span>';
				html1 +=	'</a>';
				html1 += '</li>';
				$("#sideMenu").append(html1);
			}

			if(mod[i] == 'CALL_FLOW')
			{
				// var html = '<li>';
				// html +=	'<a href="#/test.html">';
				// html +=	'<i class="fa fa-clipboard"></i>';
				// html +=	'<span class="title">Call Logs</span>';
				// html +=	'</a>';
				// html += '</li>';
				// $("#sideMenu").append(html);
			}
			// if(mod[i] == 'RESOURCES')
			// {
			// 	var html = '<li>';
			// 	html +=	'<a href="#/resources.html">';
			// 	html +=	'<i class="icon-briefcase"></i>';
			// 	html +=	'<span class="title">Resources</span>';
			// 	html +=	'</a>';
			// 	html += '</li>';
			// 	$("#sideMenu").append(html);
			// }
			if(mod[i] == 'ACCOUNT')
			{
				if(localStorage.role == 2){
					var html = '<li>';
					html +=	'<a href="#/account.html">';
					html +=	'<i class="icon-user"></i>';
					html +=	'<span class="title">Manage Accounts</span>';
					html +=	'</a>';
					html += '</li>';
					$("#sideMenu").append(html);
				}
				
			}
			if(mod[i] == 'CLIENT')
			{
				var html = '<li>';
				html +=	'<a href="#/manage_client.html">';
				html +=	'<i class="icon-user"></i>';
				html +=	'<span class="title">Manage Clients</span>';
				html +=	'</a>';
				html += '</li>';
				$("#sideMenu").append(html);
			}
		}
	}
	// if(auth == '2833bd8cb0d5c59d4651b4b2d77d72c4')
	// {
	// 	var html = '<li class="start">';
	// 	html +=	'<a href="#/dashboard.html">';
	// 	html +=	'<i class="icon-home"></i>';
	// 	html +=	'<span class="title">Dashboard</span>';
	// 	html +=	'</a>';
	// 	html += '</li>';
	// 	alert('lol');
	// 	$("#sideMenu").html(html);
	// }
};

dashboard.updateAdminMenu = function() {
	var username = localStorage.getItem("nm");
	$(".username").html(username.charAt(0).toUpperCase() + username.slice(1));
	$("#dropdown-user").css("display", "block");
};


dashboard.checkSession = function($location) {
	if(localStorage.getItem('acc') == null)
    {
        window.location = 'index.html';
    }
};

'use strict';
var apiRoot = "/laravel/index.php/v1/";

MetronicApp.controller('receptionistController', function ($rootScope, $scope, $http, $timeout) {
    $scope.callflowIndividual = {};
    $scope.receptionistContentNav = '';
    $scope.receptionistContentTable = '';
    $scope.receptionistModalsHtml = "";
    $scope.receptionistModalsJs = "var reusableVariable;";
    $scope.receptionistContentDataMedia = '';
    $scope.receptionistContentDataAgents = '';
    $scope.receptionistContentDataVoiceMails = '';
    $scope.receptionistContentDataMenu = '';

    $scope.getMenuModalHtml = function (level, module,moduleId,callflowId) {
        //calculations start
        var isMediaSelected = "";
        var isMediaTabActive = "display:none;";
        var isAgentSelected = "";
        var isAgentTabActive = "display:none;";
        var isMenuSelected = "";
        var isMenuTabActive = "display:none;";
        var isVoiceMailSelected = "";
        var isVoiceMailTabActive = "display:none;";


        switch (module){
            case "play":
                isMediaSelected = "selected";
                isMediaTabActive = "display:block;";
                $scope.receptionistModalsJs+='$("#media_select_L'+callflowId+'-'+level+module+'").val("'+moduleId+'");console.log($("#media_select_L'+callflowId+'-'+level+module+'"));';

                break;
            case "user":
                isAgentSelected = "selected";
                isAgentTabActive = "display:block;";
                break;
            case "menu":
                isMenuSelected = "selected";
                isMenuTabActive = "display:block;";
                break;
            case "voicemail":
                isVoiceMailSelected = "selected";
                isVoiceMailTabActive = "display:block;";
                break;
            default:
                console.log("case not found " + module);
        }
        //calculations end


        var menuModalHtml = '<!---------------###################edit modal starts#######################--------------> ' +
            '<div id="editModalL'+level+module+'" class="modal fade" role="dialog" aria-hidden="true"> ' +
                '<div class="modal-dialog modal-lg"> ' +
                    '<div class="modal-content"> ' +
                        '<div class="modal-header"> ' +
                            '<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button> ' +
                            '<h4 class="modal-title">EDI</h4> ' +
                        '</div>' +
                        '<div class="modal-body form"> ' +
                            '<form action="#" class="form-horizontal form-row-seperated"> ' +
                            '<div class="form-group"> ' +
                                '<label class="col-sm-4 control-label">Action</label> ' +
                                '<div class="col-sm-8"> ' +
                                    '<select class="bs-select form-control" id="modalActionL'+level+module+'">'+
                                        '<option value="modal_voice_mailL'+level+module+'" '+ isVoiceMailSelected +'>Voicemail</option>' +
                                        '<option value="modal_phoneL'+level+module+'" '+isAgentSelected+'>Phone</option> ' +
                                        '<option value="modal_soundL'+level+module+'" '+isMediaSelected+'>Sound</option> ' +
                                        '<option value="modal_menuL'+level+module+'" '+isMenuSelected+'>Menu</option> ' +
                                    '</select> ' +
                                '</div> ' +
                                '<br> ' +
                                '<label class="col-sm-4 control-label">Caller</label> ' +
                                '<div class="col-sm-8"> <div class="input-group">' +
                                    '<span class="input-group-addon"> <i class="fa fa-search"></i> </span> ' +
                                    '<input type="text" id="" name="" class="form-control"/> ' +
                                '</div> ' +
                                '</div> ' +
                            '</div>' +
                            '</form> ' +
        '                   <div class="portlet box blue data-divL' + level+module+'"  id="modal_voice_mailL'+level+module+'" style="'+isVoiceMailTabActive+'">' +
                            '<!--################## Voice mail ####################--> ' +
                            '<div class="portlet-title"> ' +
                                '<div class="caption"> ' +
                                    '<i class="fa fa-gift"></i>Voice Mail ' +
                                '</div> ' +
                                '<div class="tools"> ' +
                                '</div> ' +
                            '</div> ' +
                            '<div class="portlet-body"> ' +
                                '<!--################## Voice mail portlet body ####################--> ' +
                                '<div class="row"> ' +
                                    '<div class="col-md-3 col-sm-3 col-xs-4">' +
                                        '<!--################## Voice mail tabs menu ####################--> ' +
                                        '<ul class="nav nav-tabs tabs-left"> ' +
                                            '<li class="active"> <a data-target="#voicemail_action_setting" data-toggle="tab"> Action Setting </a> </li> ' +
                                            '<li> <a data-target="#voicemail_time_slot" data-toggle="tab"> Time Slot </a> </li> ' +
                                        '</ul> ' +
                                    '</div> ' +
                                    '<!--################## Voice mail tabs menu ends ####################-->' +
                                    '<div class="col-md-9 col-sm-9 col-xs-8"><!--################## Voice mail tabs body ####################-->' +
                                        '<div class="tab-content"><!--################## Voice mail tabs content ####################-->' +
                                            '<div class="tab-pane active" id="voicemail_action_setting">' +
                                                '<!--############# Voice mail tab action settings #############-->' +
                                                '<form action="#" class="form-horizontal form-row-seperated">' +
                                                    '<div class="form-group"> ' +
                                                        '<div class="form-group"> ' +
                                                            '<label class="col-sm-3 control-label">VoiceMail</label> ' +
                                                            '<div class="col-sm-8"> ' +
                                                                '<div class="input-group col-sm-9 pull-left"> ' +
                                                                    '<span class="input-group-addon"> <i class="fa fa-child"></i> </span> ' +
            '                                                           <select id="voicemails_select_L'+callflowId+'-'+level+module+'" class="form-control">';

        for (var index = 0; index < $scope.receptionistContentDataVoiceMails.data["data"].length; index++) {
            menuModalHtml += '<option value="'+ $scope.receptionistContentDataVoiceMails.data["data"][index].id +'">'+$scope.receptionistContentDataVoiceMails.data["data"][index].name +'</option>';
        };

        menuModalHtml +=
            '                                           </select>' +
                                                                '</div> ' +
                                                            '</div> ' +
                                                        '</div> ' +
                                                        '<div class="modal-footer"> ' +
                                                            '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button> ' +
                                                            '<button type="button" class="btn btn-primary"><i class="fa fa-check"></i> Add Template</button> ' +
                                                        '</div> ' +
                                                    '</div> ' +
                                                '</form> ' +
                                            '</div>' +
                                                '<!--############# Voice mail tab action settings ends#############--> ' +
                                                '<div class="tab-pane fade" id="voicemail_time_slot">' +
                                                    '<!--############# Voice mail tab time slot starts #############--> <form action="#" class="form-horizontal form-row-seperated"> ' +
                                                    '<div class="form-group"> ' +
                                                        '<label class="col-sm-3 control-label">Type</label> ' +
                                                        '<div class="col-sm-8"> ' +
                                                            '<div class="input-group col-sm-9 pull-left"> ' +
                                                                '<span class="input-group-addon"> <i class="fa fa-child"></i> </span> ' +
                                                                '<select id="email_variables" class="form-control"> ' +
                                                                    '<option value="caller">Date</option> ' +
                                                                    '<option value="c_name">Day</option> ' +
                                                                    '<option value="action">HondiHold.mp3</option> ' +
                                                                    '<option value="time">Weekends</option> ' +
                                                                    '<option value="agent_number">Weekdays</option> ' +
                                                                    '<option value="agent_name">Everyday</option> ' +
                                                                    '<option value="agent_name">Custom</option> ' +
                                                                '</select> ' +
                                                                '</div> ' +
                                                            '</div> ' +
                                                        '</div> ' +
                                                        '<div class="form-group"> ' +
                                                            '<div class="form-group"> ' +
                                                                '<label class="col-sm-3 control-label">Date</label> ' +
                                                                '<div class="col-sm-8"> <div class="input-group col-sm-9 pull-left"> ' +
                                                                    '<span class="input-group-addon"> <i class="fa fa-child"></i> </span> ' +
                                                                    '<input type="text" id="new_agent_name" name="new_agent_name" class="form-control" /> ' +
                                                                '</div> ' +
                                                            '</div> ' +
                                                        '</div> ' +
                                                        '<div class="modal-footer">' +
                                                            '<!--############# Voice mail footer menu#############--> ' +
                                                            '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button> ' +
                                                            '<button type="button" class="btn btn-primary"><i class="fa fa-check"></i> Add Template</button> ' +
                                                        '</div> ' +
                                                    '</div> ' +
                                                    '</form> ' +
                                                '</div>' +
                                                '<!--############# Voice mail tab time slot ends#############-->' +
                                            ' </div>' +
                                            '<!--################## Voice mail tabs content ends ####################-->' +
                                        '</div>' +
                                        '<!--################## Voice mail tabs body div ends ####################--> ' +
                                    '</div>' +
                                '</div>' +
                                '<!--################## Voice mail body ends ####################--> ' +
                            '</div> ' +
                            '<!--######################################################################## Voice mail ends ###########################################################--> ' +


            '<div class="portlet box blue data-divL'+level+module+'" id="modal_phoneL'+level+module+'" style="'+isAgentTabActive+'">'+
            '    <!--################## Phone ####################-->'+
            '    <div class="portlet-title">'+
            '        <div class="caption"><i class="fa fa-gift"></i>Phone</div>'+
            '        <div class="tools"></div>'+
            '    </div>'+
            '    <div class="portlet-body"> <!--################## Phone portlet body ####################-->'+
            '        <div class="row">'+
            '            <div class="col-md-3 col-sm-3 col-xs-4"><!--################## Phone tabs menu ####################-->'+
            '                <ul class="nav nav-tabs tabs-left">'+
            '                    <li class="active"><a data-target="#phone_action_setting" data-toggle="tab"> Action Setting </a>'+
            '                    </li>'+
            '                    <li><a data-target="#phone_time_slot" data-toggle="tab"> Time Slot </a></li>'+
            '                </ul>'+
            '            </div>'+
            '            <!--################## phone tabs menu ends ####################-->'+
            '            <div class="col-md-9 col-sm-9 col-xs-8"><!--################## phone tabs body ####################-->'+
            '                <div class="tab-content"><!--################## phone tabs content ####################-->'+
            '                    <div class="tab-pane active" id="phone_action_setting">'+
            '                        <!--############# phone tab action settings #############-->'+
            '                        <form action="#" class="form-horizontal form-row-seperated">'+
            '                            <div class="form-group">'+
            '                                <div class="form-group"><label class="col-sm-3 control-label">Pre Sound</label>'+
            ''+
            '                                    <div class="col-sm-8">'+
            '                                        <div class="input-group col-sm-9 pull-left">' +
            '                                           <span class="input-group-addon"> <i class="fa fa-child"></i> </span>' +
            '                                           <select id="agents_select_L'+callflowId+'-'+level+module+'" class="form-control">';


                                                        for (var index = 0; index < $scope.receptionistContentDataAgents.data["data"].length; index++) {

                                                            menuModalHtml += '<option value="'+ $scope.receptionistContentDataAgents.data["data"][index].id +'">'+$scope.receptionistContentDataAgents.data["data"][index].first_name + $scope.receptionistContentDataAgents.data["data"][index].last_name +'</option>';
                                                        };

        menuModalHtml +=
            '                                           </select>' +
            '                                       </div>'+
            '                                    </div>'+
            '                                </div>'+
            '                                <div class="modal-footer">'+
            '                                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'+
            '                                    <button type="button" class="btn btn-primary"><i class="fa fa-check"></i> Add'+
            '                                        Template'+
            '                                    </button>'+
            '                                </div>'+
            '                            </div>'+
            '                        </form>'+
            '                    </div>'+
            '                    <!--############# phone tab action settings ends#############-->'+
            '                    <div class="tab-pane fade" id="phone_time_slot">'+
            '                        <!--############# phone tab time slot starts #############-->'+
            '                        <form action="#" class="form-horizontal form-row-seperated">'+
            '                            <div class="form-group"><label class="col-sm-3 control-label">Type</label>'+
            ''+
            '                                <div class="col-sm-8">'+
            '                                    <div class="input-group col-sm-9 pull-left"><span class="input-group-addon"> <i'+
            '                                            class="fa fa-child"></i> </span> <select id="email_variables"'+
            '                                                                                     class="form-control">'+
            '                                        <option value="caller">Date</option>'+
            '                                        <option value="c_name">Day</option>'+
            '                                        <option value="action">HondiHold.mp3</option>'+
            '                                        <option value="time">Weekends</option>'+
            '                                        <option value="agent_number">Weekdays</option>'+
            '                                        <option value="agent_name">Everyday</option>'+
            '                                        <option value="agent_name">Custom</option>'+
            '                                    </select></div>'+
            '                                </div>'+
            '                            </div>'+
            '                            <div class="form-group">'+
            '                                <div class="form-group"><label class="col-sm-3 control-label">Date</label>'+
            ''+
            '                                    <div class="col-sm-8">'+
            '                                        <div class="input-group col-sm-9 pull-left"><span class="input-group-addon"> <i'+
            '                                                class="fa fa-child"></i> </span> <input type="text" id="new_agent_name"'+
            '                                                                                        name="new_agent_name"'+
            '                                                                                        class="form-control"/></div>'+
            '                                    </div>'+
            '                                </div>'+
            '                                <div class="modal-footer"><!--############# phone footer menu#############-->'+
            '                                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'+
            '                                    <button type="button" class="btn btn-primary"><i class="fa fa-check"></i> Add'+
            '                                        Template'+
            '                                    </button>'+
            '                                </div>'+
            '                            </div>'+
            '                        </form>'+
            '                    </div>'+
            '                    <!--############# phone tab time slot ends#############--> </div>'+
            '                <!--################## phone tabs content ends ####################--> </div>'+
            '            <!--################## phone tabs body div ends ####################--> </div>'+
            '    </div>'+
            '    <!--################## phone body ends ####################-->'+
            '</div><!--################## phone ends ####################-->'+
            '<div class="portlet box blue data-divL'+level+module+'" id="modal_soundL'+level+module+'" style="'+isMediaTabActive+'">'+
            '    <!--################## sound ####################-->'+
            '    <div class="portlet-title">'+
            '        <div class="caption"><i class="fa fa-gift"></i>Sound</div>'+
            '        <div class="tools"></div>'+
            '    </div>'+
            '    <div class="portlet-body"> <!--################## sound portlet body ####################-->'+
            '        <div class="row">'+
            '            <div class="col-md-3 col-sm-3 col-xs-4"><!--################## sound tabs menu ####################-->'+
            '                <ul class="nav nav-tabs tabs-left">'+
            '                    <li class="active"><a data-target="#sound_action_setting" data-toggle="tab"> Action Setting </a>'+
            '                    </li>'+
            '                    <li><a data-target="#sound_time_slot" data-toggle="tab"> Time Slot </a></li>'+
            '                </ul>'+
            '            </div>'+
            '            <!--################## sound tabs menu ends ####################-->'+
            '            <div class="col-md-9 col-sm-9 col-xs-8"><!--################## sound tabs body ####################-->'+
            '                <div class="tab-content"><!--################## sound tabs content ####################-->'+
            '                    <div class="tab-pane active" id="sound_action_setting">'+
            '                        <!--############# sound tab action settings #############-->'+
            '                        <form action="#" class="form-horizontal form-row-seperated">'+
            '                                <div class="form-group"><label class="col-sm-3 control-label">Sound</label>'+
            ''+
            '                                    <div class="col-sm-8">'+
            '                                        <div class="input-group col-sm-9 pull-left">' +
            '                                           <span class="input-group-addon"> <i class="fa fa-child"></i> </span> '+
            '                                           <select id="media_select_L'+callflowId+'-'+level+module+'" class="form-control">';

                                                            for (var index = 0; index < $scope.receptionistContentDataMedia.data["data"].length; index++) {

                                                                menuModalHtml += '<option value="'+ $scope.receptionistContentDataMedia.data["data"][index].id +'">'+$scope.receptionistContentDataMedia.data["data"][index].name+'</option>';
                                                            }

            menuModalHtml +=
            '                                           </select>' +
            '                                       </div>'+
            '                                    </div>'+
            '                                </div>'+
            '                                <div class="modal-footer">'+
            '                                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'+
            '                                    <button type="button" class="btn btn-primary"><i class="fa fa-check"></i> Add'+
            '                                        Template'+
            '                                    </button>'+
            '                                </div>'+
            '                            </div>'+
            '                        </form>'+
            '                    </div>'+
            '                    <!--############# sound tab action settings ends#############-->'+
            '                    <div class="tab-pane fade" id="sound_time_slot">'+
            '                        <!--############# sound tab time slot starts #############-->'+
            '                        <form action="#" class="form-horizontal form-row-seperated">'+
            '                            <div class="form-group"><label class="col-sm-3 control-label">Type</label>'+
            ''+
            '                                <div class="col-sm-8">'+
            '                                    <div class="input-group col-sm-9 pull-left"><span class="input-group-addon"> <i'+
            '                                            class="fa fa-child"></i> </span> <select id="email_variables"'+
            '                                                                                     class="form-control">'+
            '                                        <option value="caller">Date</option>'+
            '                                        <option value="c_name">Day</option>'+
            '                                        <option value="action">HondiHold.mp3</option>'+
            '                                        <option value="time">Weekends</option>'+
            '                                        <option value="agent_number">Weekdays</option>'+
            '                                        <option value="agent_name">Everyday</option>'+
            '                                        <option value="agent_name">Custom</option>'+
            '                                    </select></div>'+
            '                                </div>'+
            '                            </div>'+
            '                            <div class="form-group">'+
            '                                <div class="form-group"><label class="col-sm-3 control-label">Date</label>'+
            ''+
            '                                    <div class="col-sm-8">'+
            '                                        <div class="input-group col-sm-9 pull-left"><span class="input-group-addon"> <i'+
            '                                                class="fa fa-child"></i> </span> <input type="text" id="new_agent_name"'+
            '                                                                                        name="new_agent_name"'+
            '                                                                                        class="form-control"/></div>'+
            '                                    </div>'+
            '                                </div>'+
            '                                <div class="modal-footer"><!--############# sound footer menu#############-->'+
            '                                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'+
            '                                    <button type="button" class="btn btn-primary"><i class="fa fa-check"></i> Add'+
            '                                        Template'+
            '                                    </button>'+
            '                                </div>'+
            '                            </div>'+
            '                        </form>'+
            '                    </div>'+
            '                    <!--############# sound tab time slot ends#############--> </div>'+
            '                <!--################## sound tabs content ends ####################--> </div>'+
            '            <!--################## sound tabs body div ends ####################--> </div>'+
            '    </div>'+
            '    <!--################## sound body ends ####################-->'+
            '</div><!--################## sound ends ####################-->'+
            '<div class="portlet box blue data-divL'+level+module+'" id="modal_menuL'+level+module+'" style="'+isMenuTabActive+'">'+
            '    <!--################## menu ####################-->'+
            '    <div class="portlet-title">'+
            '        <div class="caption"><i class="fa fa-gift"></i>Menu</div>'+
            '        <div class="tools"></div>'+
            '    </div>'+
            '    <div class="portlet-body"> <!--################## menu portlet body ####################-->'+
            '        <div class="row">'+
            '            <div class="col-md-3 col-sm-3 col-xs-4"><!--################## menu tabs menu ####################-->'+
            '                <ul class="nav nav-tabs tabs-left">'+
            '                    <li class="active"><a data-target="#menu_action_setting" data-toggle="tab"> Action Setting </a></li>'+
            '                    <li><a data-target="#menu_time_slot" data-toggle="tab"> Time Slot </a></li>'+
            '                </ul>'+
            '            </div>'+
            '            <!--################## menu tabs menu ends ####################-->'+
            '            <div class="col-md-9 col-sm-9 col-xs-8"><!--################## menu tabs body ####################-->'+
            '                <div class="tab-content"><!--################## menu tabs content ####################-->'+
            '                    <div class="tab-pane active" id="menu_action_setting">'+
            '                        <!--############# menu tab action settings #############-->'+
            '                        <form action="#" class="form-horizontal form-row-seperated">'+
            '                                <div class="form-group"><label class="col-sm-3 control-label">Sound</label>'+
            ''+
            '                                    <div class="col-sm-8">'+
            '                                        <div class="input-group col-sm-9 pull-left"><span class="input-group-addon"> <i'+
            '                                                class="fa fa-child"></i> </span> <select id="email_variables"'+
            '                                                                                         class="form-control">'+
            '                                            <option value="caller">None</option>'+
            '                                            <option value="c_name">AOL_Welcome.mp3</option>'+
            '                                            <option value="action">HondiHold.mp3</option>'+
            '                                            <option value="time">Hindi_Error.mp3</option>'+
            '                                            <option value="agent_number">Art Of Living_jan.mp3</option>'+
            '                                            <option value="agent_name">ArtOfLivengg.mp3</option>'+
            '                                        </select></div>'+
            '                                    </div>'+
            '                                </div>'+
            '                                <div class="modal-footer">'+
            '                                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'+
            '                                    <button type="button" class="btn btn-primary"><i class="fa fa-check"></i> Add'+
            '                                        Template'+
            '                                    </button>'+
            '                                </div>'+
            '                            </div>'+
            '                        </form>'+
            '                    </div>'+
            '                    <!--############# menu tab action settings ends#############-->'+
            '                    <div class="tab-pane fade" id="menu_time_slot">'+
            '                        <!--############# menu tab time slot starts #############-->'+
            '                        <form action="#" class="form-horizontal form-row-seperated">'+
            '                            <div class="form-group"><label class="col-sm-3 control-label">Type</label>'+
            ''+
            '                                <div class="col-sm-8">'+
            '                                    <div class="input-group col-sm-9 pull-left"><span class="input-group-addon"> <i'+
            '                                            class="fa fa-child"></i> </span> <select id="email_variables"'+
            '                                                                                     class="form-control">'+
            '                                        <option value="caller">Date</option>'+
            '                                        <option value="c_name">Day</option>'+
            '                                        <option value="action">HondiHold.mp3</option>'+
            '                                        <option value="time">Weekends</option>'+
            '                                        <option value="agent_number">Weekdays</option>'+
            '                                        <option value="agent_name">Everyday</option>'+
            '                                        <option value="agent_name">Custom</option>'+
            '                                    </select></div>'+
            '                                </div>'+
            '                            </div>'+
            '                            <div class="form-group">'+
            '                                <div class="form-group"><label class="col-sm-3 control-label">Date</label>'+
            ''+
            '                                    <div class="col-sm-8">'+
            '                                        <div class="input-group col-sm-9 pull-left"><span class="input-group-addon"> <i'+
            '                                                class="fa fa-child"></i> </span> <input type="text" id="new_agent_name"'+
            '                                                                                        name="new_agent_name"'+
            '                                                                                        class="form-control"/></div>'+
            '                                    </div>'+
            '                                </div>'+
            '                                <div class="modal-footer"><!--############# menu footer menu#############-->'+
            '                                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'+
            '                                    <button type="button" class="btn btn-primary"><i class="fa fa-check"></i> Add'+
            '                                        Template'+
            '                                    </button>'+
            '                                </div>'+
            '                            </div>'+
            '                        </form>'+
            '                    </div>'+
            '                    <!--############# menu tab time slot ends#############--> </div>'+
            '                <!--################## menu tabs content ends ####################--> </div>'+
            '            <!--################## menu tabs body div ends ####################--> </div>'+
            '    </div>'+
            '    <!--################## menu body ends ####################-->'+
            '</div><!--################## menu ends ####################--> </div><!--################## modal body ends ends ####################--> <!-- <div class="modal-footer"> <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> <button type="button" class="btn btn-primary" onclick=""><i class="fa fa-check"></i> Save changes</button> </div>--> </div> </div> </div> <!---------------------------edit modal ends----------------------------->';

        return menuModalHtml;
    };

    $scope.getMenuModalJs = function (level, module) {

        var menuModalJs = '$(document).on("change", "#modalActionL' + level + module + '", function(){$(".data-divL'+level+module+'").hide(); $("#" + $(this).val()).show();});';
        return menuModalJs;
    };

    $scope.appendScriptTag = function(stringToAddAsJS){
        var js = document.createElement("script");
        js.type = "text/javascript";
        var tt = document.createTextNode(stringToAddAsJS);
        js.appendChild(tt);
        document.body.appendChild(js);
    };

    $scope.explodeToHtml = function (level, callflowId, moduleId, module, children, metadata) {
        var result = '';
        if (module == "menu") {

            result += '<div class="portlet box blue">';
            //result += '<button style="display: block;" data-action="collapse" type="button"></button>';
            //result += '<button style="display: none;" data-action="expand" type="button"></button>';
            result += '<div class="portlet-title" id="L'+level+module+'"><div class="caption">' + level + ' ' + module + '</div><div class="tools"><a title="" onclick="addMenuItem(this);" class="reload"></a><a title="" data-original-title="" href="javascript:;" class="expand"></a><a data-target="#editModalL'+level+module+'" data-toggle="modal"><i class="fa fa-wrench" style="color: #FFF"></i></a><a title="" data-original-title="" href="javascript:;" class="remove"></a></div></div>';
            $scope.receptionistModalsHtml += $scope.getMenuModalHtml(level, module,moduleId,callflowId);
            $scope.receptionistModalsJs += $scope.getMenuModalJs(level, module);
            result += '<div id="LBody'+level+module+'" class="portlet-body" style="padding-right: 0px;padding-bottom: 1px;display: none;">';
            for (var key in children) {
                result += $scope.explodeToHtml(level + key, callflowId, children[key]["data"]["id"], children[key]["module"], children[key]["children"], metadata);
            }
            result += '</div>';
            result += '</div>';

            //modal start

            //modal end
        }

        else if (module == "play") {
            result += '<div class="portlet box blue"><div class="portlet-title" id="L'+level+module+'"><div class="caption">' + level + ' ' + module + '</div><div class="tools"><a data-target="#editModalL'+level+module+'" data-toggle="modal"><i class="fa fa-wrench" style="color: #FFF"></i></a><a title="" data-original-title="" href="javascript:;" class="remove"></a></div></div></div>';
            $scope.receptionistModalsHtml += $scope.getMenuModalHtml(level, module,moduleId,callflowId);
            $scope.receptionistModalsJs += $scope.getMenuModalJs(level, module);
        }
        else if (module == "user") {
            result += '<div class="portlet box blue"><div class="portlet-title" id="L'+level+module+'"><div class="caption">' + level + ' ' + module + '</div><div class="tools"><a data-target="#editModalL'+level+module+'" data-toggle="modal"><i class="fa fa-wrench" style="color: #FFF"></i></a></a><a title="" data-original-title="" href="javascript:;" class="remove"></a></div></div></div>';
            $scope.receptionistModalsHtml += $scope.getMenuModalHtml(level, module,moduleId,callflowId);
            $scope.receptionistModalsJs += $scope.getMenuModalJs(level, module);
        }
        else if (module == "voicemail") {
            result += '<div class="portlet box blue"><div class="portlet-title" id="L'+level+module+'"><div class="caption">' + level + ' ' + module + '</div><div class="tools"><a data-target="#editModalL'+level+module+'" data-toggle="modal"><i class="fa fa-wrench" style="color: #FFF"></i></a></a><a title="" data-original-title="" href="javascript:;" class="remove"></a></div></div></div>';
            $scope.receptionistModalsHtml += $scope.getMenuModalHtml(level, module,moduleId,callflowId);
            $scope.receptionistModalsJs += $scope.getMenuModalJs(level, module);
        }
        return result;
    };

    $scope.getAllMedia = function () {
        return $http.get(apiRoot + 'media/all').
            success(function (data, status, headers, config) {
                return data;
            }).
            error(function (data, status, headers, config) {
                console.log(data);
            });
    };

    $scope.getAllAgents = function () {
        return $http.get(apiRoot + 'users/all').
            success(function (data, status, headers, config) {
                $scope.receptionistContentDataAgents = data;
                return data;
            }).
            error(function (data, status, headers, config) {
                console.log(data);
            });
    };

    $scope.getAllVoiceMails = function () {
        return $http.get(apiRoot + 'voicemails/all').
            success(function (data, status, headers, config) {
                $scope.receptionistContentDataVoiceMails = data;
                return data;
            }).
            error(function (data, status, headers, config) {
                console.log(data);
            });
    };

    $scope.$on('$viewContentLoaded', function () {
        Metronic.initAjax(); // initialize core components
        Layout.init(); // init current layout
        Demo.init(); // init demo features
        //Initializers For Data Filler

        $scope.getAllMedia().then(function(result) {
            $scope.receptionistContentDataMedia = result;
        });
        $scope.getAllAgents().then(function(result) {
            $scope.receptionistContentDataAgents = result;
        });

        $scope.getAllVoiceMails().then(function(result) {
            $scope.receptionistContentDataVoiceMails = result;
        });

        //Initializers For Data Filler End
        $http.get(apiRoot + 'callflow/all').
            success(function (data, status, headers, config) {
                $scope.callflowAll = data;
                var individualCallflowDetailCalls = 0;
                for (var count = 0; count < data["data"].length; count++) {
                    $http.get(apiRoot + 'callflow/' + data["data"][count]["id"]).
                        success(function (dataCallflowInner, status, headers, config) {
                            $scope.callflowIndividual[dataCallflowInner["data"]["id"]] = dataCallflowInner;
                            console.log(angular.toJson(dataCallflowInner,true));
                            individualCallflowDetailCalls++;
                            if (individualCallflowDetailCalls === $scope.callflowAll["data"].length) {
                                $scope.receptionistContentNav += '<ul class="nav nav-tabs" id="nav-ivr-numbers">';
                                $scope.receptionistContentTable += '<div class="tab-content" style="display: block">';
                                var counter = 0;
                                for (var key in $scope.callflowIndividual) {
                                    $scope.receptionistContentNav += '<li ';
                                    //if (counter) {
                                    //    break;
                                    //}
                                    if (!counter) {
                                        $scope.receptionistContentNav += 'class="active"';
                                    }
                                    $scope.receptionistContentNav += '>';
                                    $scope.receptionistContentNav += '<a  data-target="#tab_' + counter + '" data-toggle="tab">' + $scope.callflowIndividual[key]["data"]["numbers"][0] + ' </a> </li>';

                                    //tab nav li end

                                    //tab content start

                                    $scope.receptionistContentTable += '<div class="tab-pane fade';
                                    if (!counter) {
                                        $scope.receptionistContentTable += ' active in';
                                    }
                                    $scope.receptionistContentTable += '" id="tab_' + counter + '"><div class="portlet box grey" style="margin-bottom:0px;"><div class="portlet-body">';

                                    //table content start
                                    $scope.receptionistContentTable += $scope.explodeToHtml("", $scope.callflowIndividual[key]["data"]["id"], $scope.callflowIndividual[key]["data"]["id"], $scope.callflowIndividual[key]["data"]["flow"]["module"], $scope.callflowIndividual[key]["data"]["flow"]["children"], $scope.callflowIndividual[key]["data"]["metadata"]);
                                    //table content end
                                    $scope.receptionistContentTable += '</div></div></div>';
                                    //tab content end
                                    counter++;
                                }
                                $scope.receptionistContentNav += '</ul>';
                                $scope.receptionistContentTable += '</div>';
                                $scope.appendScriptTag($scope.receptionistModalsJs);


                            }
                        }).
                        error(function (data, status, headers, config) {
                            console.log("fail");
                            console.log(status);
                        });
                }
            }).
            error(function (data, status, headers, config) {
                console.log("fail");
                console.log(status);
            });
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageBodySolid = true;
    $rootScope.settings.layout.pageSidebarClosed = true;
});
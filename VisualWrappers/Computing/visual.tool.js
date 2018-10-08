

var initCanvas = function(elements) {
    var nodeNames = [];
    var json_data = JSON.parse(elements);

    //currentEl.val('');

    instance, endpoints = null;

    jsPlumb.ready(function() {
        instance = jsPlumb.getInstance({
            Connector: "Bezier",
            DragOptions: {
                cursor: 'pointer',
                zIndex: 2000
            },
            Container: appUi.viewJsPlumb,
            LogEnabled: true
        });
    });


    instance.detachAllConnections();
    instance.removeAllEndpoints();


    appUi.viewJsPlumb.html('');
    endpoints = {};
    
    //$('#global-help').html(json_data[3]);


    //if (json_data[1].length > 0)
    //    appUi.hdnCurntTplId.value = json_data[1][0].TemplateID;

    var htmlViewOptions = '';

    $.each(json_data[0], function(item) {
        htmlViewOptions += '<option data-class="delete-view-list"  val="' + json_data[0][item] + '">' + json_data[0][item] + '</option>'
    });

    //sessionStorage.setItem('currentViewID', json_data[4]);
    //appUi.selectedViews.val(sessionStorage.getItem('currentViewID'));


    //appUi.viewSelect.html(htmlViewOptions)
    //appUi.viewSelect.val(sessionStorage.getItem('currentViewID'));

    for (var i = 0; i < json_data[1].length; i++) {
        developController.elementSetOnView(
            json_data[1][i].ElementID,
            json_data[1][i].ElementName,
            json_data[1][i].Left,
            json_data[1][i].Top,
            json_data[1][i].ItemID,
            'N',
            json_data[1][i].ElementProperties,
            json_data[1][i].ImagePath,
            json_data[1][i].HtmlTemplate,
            json_data[1][i].Operator,
            json_data[1][i].Socket,
            json_data[1][i].Pin,
            json_data[1][i].Tag,
            json_data[1][i].Debug,
            json_data[1][i].HtmlTemplateWidth,
            json_data[1][i].HtmlTemplateHeight,
            json_data[1][i].HasFalseConnection,
            json_data[1][i].IsNewVersionAvailable,
            json_data[1][i].CurrentVersion,
            json_data[1][i].UnregisterEvent,
            json_data[1][i].HelpLink,
            json_data[1][i].IsBeta,
            json_data[1][i].IsExperimental,
            json_data[1][i].HasResult
            );

        nodeNames.push({
            label: json_data[1][i].ElementName,
            category: json_data[4]
        });
    }


    for (var i = 0; i < json_data[1].length; i++) {
        for (var j = 0; j < json_data[1][i].TrueChilds.length; j++) {
            instance.connect({
                source: endpoints[json_data[1][i].ElementID][POS_TRUE_ENDPOINT],
                target: endpoints[json_data[1][i].TrueChilds[j]][POS_INPUT_ENDPOINT]
            });
        }

        for (var j = 0; j < json_data[1][i].FalseChilds.length; j++) {
            instance.connect({
                source: endpoints[json_data[1][i].ElementID][POS_FALSE_ENDPOINT],
                target: endpoints[json_data[1][i].FalseChilds[j]][POS_INPUT_ENDPOINT]
            });
        }
    }

    //CloseProgressAnimation();
    //document.title = json_data[2];
    //$("#lblProjectName").html(json_data[2]);
    //$("#lblBoardName").html($('#hdnWorkstationName').val());


    //  appUi.viewSelect.promise().done(function(){alert(2)});

    // View select template dropdown
    /*appUi.viewSelect
    .developselectmenu({
        width: "160px",
        select: function(event, ui) {
            console.log(ui.item.label)

                //$("#views").val(ui.item.label).change();
            }
        })
    .developselectmenu("menuWidget")
    .addClass("ui-menu-icons  depth-1");

    appUi.viewSelect.developselectmenu("refresh");
    appUi.viewSelect.developselectmenu("instance").menu.append(
        '<li class="add-dropdown-element"><a id="add-view-selectmenu" class="" href="#" class="left-rc primary button prefix">' +
        '<i class="icon-plus button link success"></i> <span>Add New View..</span>' +
        '</a></li>');


    $('#views-menu .ui-menu-item > div').on('click', function() {
        $("#views").val($(this).text()).change();
    });


    miniLoader.hide();
    permissionController.init();


    JSON_byData('Layout.aspx/GetTemplateElements', JSON.stringify({ TemplateID: getUrlParameter('TemplateID') })).done(function(data) {

        data = JSON.parse(data.d);

        $.each(data, function(i, el) {

            if (sessionStorage.currentViewID !== el.ViewID) {
                nodeNames.push({ label: el.ElementName, category: el.ViewID });
            }

        });


        $(function() {
            $.widget("custom.catcomplete", $.ui.autocomplete, {
                _create: function() {
                    this._super();
                    this.widget().menu("option", "items", "> :not(.ui-autocomplete-category)");
                },
                _renderMenu: function(ul, items) {
                    var that = this,
                    currentCategory = "";
                    $.each(items, function(index, item) {
                        var li;
                        if (item.category != currentCategory) {
                            ul.append("<li class='ui-autocomplete-category'><i class='icon-file'></i> View: <srong>" + item.category + "</srong></li>");
                            currentCategory = item.category;
                        }
                        li = that._renderItemData(ul, item);
                        if (item.category) {
                            li.attr("aria-label", item.category + " : " + item.label);
                        }
                    });
                }
            });


            $(document).on('focus', '.autoc', function() {
                $(this).catcomplete({
                    delay: 0,
                    source: nodeNames,
                    
             });
            });
        });
    });*/
};
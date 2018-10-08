/* Globals vars*/


/* HTML Generator */
var htmlGener = {
    compSideMenu: function(Debug, elemId) {
        var debugIcon = Debug == 'False' ? '<li><a data-elementid="' + elemId + '" class="el-help icon-help" href="#"></a></li>' :
        '<li><a data-elementid="' + elemId + '" class="el-config-event icon-cog" href="#"></a></li>';

        var html = '<div class="component-option-panel"><ul>' +
        '<li><br><a class="el-destroy icon-trash" href="#"></a></li>' +
        '</ul></div>';
        return html;
    },
    dashCard: function(tplName, tplID, tplView, tplDate) {
        var html = '<li><div class="card"><div class="project-info">' +
        '<i class="icon icon-folder"></i><h2 class=""><strong>' +
        '<a href="/view/Layout.aspx?TemplateID=' + tplID + '" class="">' + tplName + '</a>' +
        '</strong></h2>' +
        '<p class="date"><span>' + lang[l].lastUpdated + '<strong>' + tplDate + '</strong></span></p>' +
            //'<p class="text-justify project-description"><strong class="text-uppercase">Description:</strong></p>' +
            '</div><footer><div class="row collapse">' +
            '<div class="small-6 columns"><a href="/view/Layout.aspx?TemplateID=' + tplID + '" class="  button small secondary expand">' + tplView.length + (tplView.length <= 1 ? ' View' : ' Views') + '</a></div>' +
            '<div class="small-6 columns"><a href="#" class=" text-right tooltip-menu button small secondary expand"><i class=" icon-ellipsis-vertical"></i> &nbsp; &nbsp;</a></div>' +
            '</div></footer></div></li>';
            return html;
        },
    //Add new card
    addNewCard: function(id, text) {
        var html = '<li ><div  class="card add-new text-center"> ' +
        '<a id="' + id + '" class="action-layer" href="#"></a>' +
        '<i class="icon-file-add"></i>' +
        '<h5>' + text + '</h5></div> </li>';
        return html;
    },
    // Upgraded dashboard card
    templateCard: function(tplID, tplView, board, title, date, description, shared, category, tags, imgUrl) {

        var a = '';
        if (shared == true) {
            a = "shared";
        }

        if (imgUrl == null) {
            imgUrl = '/assets/img/img-placeholder.jpg';
        } else {
            //          http://localhost:49958/images/templateshareimages/mainimage/e14319f6-ac9a-4c17-98ae-a48d2426dc24.PNG
            imgUrl = mainUrl + 'images/templateshareimages/mainimage/' + imgUrl;
        }

        if (category == null || category == typeof undefined)
            category = '';


        var html =
        uiComponents.cards.dashboard({
            classes: 'orange',
            cardId: tplID,
            title: title,
            time: date,
            description: (description == "" ? lang[l].tpl.desc : description),
            total: tplView.length
        });


        return html;
    },
    marketshareCard: function(tplID, author, board, title, date, imgUrl, description, category, tags, numberOfDownloads) {
        var tag = '';
        tags.forEach(function(value, i) {


            tag += value + ', '
        })

        var html = '<li>' +
        '<div class="card depth-1 sh-black" data-template="' + tplID + '">' +
        '<a class="action-layer" href="/view/SharedDetails.aspx?TemplateID=' + tplID + ' "></a>' +
        '<div class="card-header">' +
        '<div  class="left pf rounded"></div>' +
        '<div data-get="' + tplID + '" class="share-badge right">GET</div>' +
        '<h3>' + title + '</h3>' +
        '<time>' + date + '</time></div>' +
        '<div class="card-body">' +
        '<figure><img src="' + imgUrl + '" alt="image-placeholder"></figure>' +
        '<div class="card-content">' +
        '<div class="description">' + (description == "" ? lang[l].tpl.desc : description) + '</div>' +
        '<div class="category"><strong class="left">Category:&nbsp;</strong><p>' + category + '</p>' +
            '<strong class="left">Tags:&nbsp;</strong><p>' + tag + '</p></div></div>' + //end content and body section
            '</div>' +
            '<div class="card-footer">' +
            '<p class="animation-slide-up-1"><span class="author"><span>Author:</span> ' + author + '</span><span class="downloads right"> <span>Downloads:</span> ' + numberOfDownloads + '</span></p>' +
            '<p class="animation-slide-up-2 column"><span class="author"><a href="/view/SharedDetails.aspx?TemplateID=' + tplID + ' ">View project <i style="position: relative; top:4px;" class=" right icon-arrow-right"></i> </a></span></p>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</li>';
            return html;

        },

        experience: {
            graph: function(id, position) {
                var hash = id.Elements[0].TemplateID + "/" + id.Elements[0].ElementName;

                appConsole(togCon, id);
                var graphProp = JSON.parse(id.GraphJsonProperties);


                var defPropCheck = function(defProp, newProp) {
                    if (typeof newProp == typeof undefined || newProp == "") {
                        return defProp;
                    } else {
                        return newProp;
                    }
                };


            // Check for properties


            // Construct html
            var html = graphTpl.defaultChart({
                hash: hash,
                graphId: id.GraphID,
                row: position.dataRow,
                col: position.dataCol,
                sizeX: position.sizeX,
                sizeY: position.sizeY,
                type: id.ContainerType,
                widgetName: stringFn.rplUnd(id.GraphName),
                defPropCheck: defPropCheck(stringFn.rplUnd(id.GraphName), JSON.parse(id.GraphJsonProperties).widgetName),
                chartControllers: chartHelp.render.controller(id.GraphID),
                sliderId: id.GraphID,
                initTreshold: (graphProp.hasOwnProperty('criticalValue') && _.isNumber(graphProp.criticalValue)) ? graphTpl.thresholdSlider({
                    criticalValue: graphProp.criticalValue,
                    style: ""
                }) : '',
                graphContainerClasess: (graphProp.hasOwnProperty('criticalValue') && _.isNumber(graphProp.criticalValue)) ? ' show-threshold ' : ''
            });


            return html;

        },


    },
    ui: {
        switch: function(id, defaultCl, addCl, isSelected, isInExperience) {

            console.log(isSelected);
            var selectedClass = '',
            checkedString = '',
            isChecked = '',
            checkedClass = '';

            if (typeof defaultCl == typeof undefined || defaultCl == '')
                defaultCl = "switch tiny round field"

            if (typeof addCl == typeof undefined)
                addCl = '';
            /* TODO if is already enabled
             if(isInExperience==1){
             appConsole(togCon,"IsAlreadyInCurrentExperience for elements is same for all experiences")
             isChecked = "checked disabled"
             checkedClass = "disabled"
             }else{
             checkedClass="enabled"
             }
             */

             var selectedClass = '';
             var checkedString = '';
             if (isSelected) {
                checkedString = 'checked';
                selectedClass = ' selected ';
            }

            var html = '<div class="' + defaultCl + ' ' + addCl + '  required-field">' +
            '<input ' + checkedString + '  name="element" value="' + id + '" id="chk' + id + '" ' + isChecked + ' type="checkbox" >' +
            '<label class="' + selectedClass + +checkedClass + '" for="chk' + id + '"></label></div>';
            return html;
        }
    }
};

function loadToolbox(container) {
    container.load('/Files/Toolbox/toolbox.new.html', function() {});
};

var uiReact = {
    onFocus: function(level) {
        $('.input-group input, .input-group select').on('focus', function() {
            $(this).parents().eq(level).addClass('focus');
        }).on('blur', function() {
            $(this).parents().eq(level).removeClass('focus');
        });
    }
}


/* New app main js functions*/
/***************************/



///////////////////////////////////////////////////////////////////////////////////////////////////////
// DYNAMIC BAR, DIALOGS
///////////////////////////////////////////////////////////////////////////////////////////////////////
$('.dynamic-bar').on('click', 'a', function(e) {
    e.preventDefault();
    e.stopPropagation();
    var $this = $(this);
    appConsole(togCon, $this.attr('data-modal-open'));
    var url = 'modals/';

    /* Develop page dialogs */
    if (checkElId($this, appUi.shareBtn)) {
        /*sharedTemplatesDialog = ShowDialogHelper('60%', modalConfig.height(),
        appUi.modal, '/Files/Templates/sharedTemplates.html');*/
        appConsole(togCon, 'share button clicked');
    } else if (checkElId($this, appUi.exprtBtn)) {


        if (appUi.hdnCurntTplId.value == '') {
            alert(lang[l].selectTemplate);
            return;
        }
        $("#hdnIsRemoteExport").val("0");
        exportDialog = ShowDialogHelper(500, 'auto',
            appUi.modal, url + 'export.html', lang[l].modals.export.title,
            dialogButtons("Download", "", "lnkModulesExport"));
        appConsole(togCon, 'export button');
    } else if (checkElId($this, appUi.remoteUpdateBtn)) {
        if (!$this.hasClass('disabled')) {
            $("#hdnIsRemoteExport").val("1");
            exportDialog = ShowDialogHelper(500, modalConfig.height(),
                appUi.modal, url + 'export.html?Remote=1', lang[l].modals.export.title,
                dialogButtons("Push Remote", "", "lnkModulesExport"));
        }
    } else if (checkElId($this, appUi.remoteRestartBtn)) {
        if (!$this.hasClass('disabled')) {
            $dialog.confirm(appUi.modal,
                'Restart Gateway', 'Are you sure you want to restart gateway?', restartCallback, null, {
                    buttonText: 'Restart',
                    buttonClass: 'success'
                }
                );


            function restartCallback() {
                notification.show('Restarting...', 1);
                AjaxCallNew('GetRestartUser', '', fGetRestartUser, false);
            }

        }
    } else if (checkElId($this, appUi.verifyBtn)) {
        /*if (appUi.hdnCurntTplId.value === '') {
         alert(lang[l].selectTemplate);
         return;
         }

         verifyDialog = ShowDialogHelper('500', modalConfig.height(),
         appUi.modal, '/Files/Verify/Verify.html', lang[l].modals.verify.title);
         appConsole(togCon, 'verify button');*/

         JSON_byData('Layout.aspx/GetTemplateErrors', JSON.stringify({
            TemplateID: getUrlParameter('TemplateID'),
            Views: appUi.selectedViews.val()
        })).done(function(data) {

            data = JSON.parse(data.d);
            $('#draw-canvas').find('[data-component-on-canvas] > div').removeClass('check-same-element');

            if (data.hasOwnProperty("DUPLICATES")) {
                $.each(data.DUPLICATES, function(i, el) {
                    $('#draw-canvas').find('[data-component-on-canvas="' + el + '"] > div').addClass('check-same-element');

                    var consoleHtml = '<pre class="red-text highlight"><i class="icon-warning-outline" style="position: relative; left: -5px"></i>Elements with duplicate names: <strong>' + el + '</strong></pre>';

                    appUi.debugPanel.prepend(consoleHtml).delay(50).queue(function() {
                        $(this).dequeue().children('pre').removeClass('highlight');
                    });

                    appConsole(togCon, el);
                });

                if (appUi.developConsole.attr('data-open') === "false") {
                    $('[data-controller="minimize-panel"]').trigger('click');
                    appUi.developConsole.attr('data-open', true);
                }
            }
        });

    }

    // Gateway info button
    else if (checkElId($this, appUi.infoBtn)) {
        if (!appUi.infoBtn.hasClass('disabled')) {
            appUi.modal.html('')
            //SendMqttMessage("/info/gatewayRequest");

            if (!$('#console-tmp').hasClass('debug-running')) {}

                $('#gateways-list option:selected').text();
            ShowDialogHelper('500', modalConfig.height() + 48,
                appUi.modal, '/view/modals/gateway.info.html', 'Gateway: ' + appUi.gatewaySelect.find('option:selected').text(), '');

        }
    } else if (checkElId($this, appUi.stopBtn)) {
        AjaxCallNew('StopTemplate', JSON.stringify({
            TemplateID: getUrlParameter('TemplateID')
        }), fStopTemplateCallback, true);
    }

    /* Dashboard page dialogs */
    else if (checkElId($this, appUi.createBtn)) {

        templateDialog = ShowDialogHelper(500, 'auto', appUi.modal, '/Files/Templates/template.html',
            lang[l].modals.tmpNew.title, dialogButtons("Save", "", "lnkSaveTemplate"));
    }

    /* Experience Dashboard page dialogs */
    else if (checkElId($this, appUi.xpCreateBtn)) {


    } else if (checkElId($this, appUi.addView)) {

        if (appUi.hdnCurntTplId.val() == '') {
            alert("Select template first!");
        }
        /*
         else {
         viewsDialog = ShowDialogHelper(500, 'auto',
         appUi.modal, url + 'add.view.html', lang[l].modals.viewNew.title,
         dialogButtons("Add View", "", "insertViewToTemplate", AddViewToTemplate));
     }*/
 } else {
    return false;
}
});

var fGetRestartUser = function(data1) {

    SendMqttMessageWithPayload("/restart", data1);
    $('[data-gateway="connection"]').removeClass('connected');
    appUi.infoBtn.addClass('disabled');
    appUi.consoleDebug.addClass('disabled');
    appUi.remoteUpdateBtn.addClass('disabled');
    appUi.remoteRestartBtn.addClass('disabled');
}


// jsPlumb elements function listeners
var propertyPanel = (function() {


    appUi.viewJsPlumb.on('click', '.jsplumb-draggable', function(e) {
        //e.stopImmediatePropagation();
        var $this = $(this);

        markAcitveNode($this.attr('id'));
        
    });

})();


//  Toolbox Draggable components
function initCompList() {
    $('#component-list .draggable').draggable({
        revert: 'invalid',
        helper: 'clone',
        appendTo: 'main',
        containment: 'window',
        scroll: false
    });


    appConsole('toolbox drop init droppable', togCon);

    appUi.viewJsPlumb.droppable({
        accept: '.draggable',
        activeClass: "draw-canvas-hover",
        hoverClass: "ui-state-active",
        tolerance: "touch",
        drop: function(event, ui) {

            var $this = $(this);


            var $newPosX = ui.offset.left - $this.offset().left,
            $newPosY = ui.offset.top - $this.offset().top,
            $thisId = ui.draggable.attr('id'),
            item = toolboxArr.get(parseInt($thisId));


            $newPosX = ($newPosX <= 0) ? 0 : $newPosX;
            $newPosY = ($newPosY <= 0) ? 0 : $newPosY;


            appUi.viewJsPlumb.find('.active-element').removeClass('active-element');
            if (!$('#elem-property').hasClass('active')) {
                $('#elem-property-link').trigger('click');
            }


            // Automatic element numbering from highest number
            var highNum = 0,
            itemName = '';
            $.each(endpoints, function(key, value) {


                if (value[POS_ELEMENT_STATUS] != 'D' ||
                    (value[POS_ELEMENT_STATUS] == 'N' && _.isNull(value[POS_ELEMENT_PROPERTIES]))) {

                    var getNumbers = value[4].replace(/^\D+/g, ''),
                elementOnCanvas = value[4].replace(/[0-9]/g, '');

                if (elementOnCanvas == item.DefaultTitle && elementOnCanvas.length > 0 && value[6] != "D") {

                    if (_.toNumber(getNumbers) >= highNum) {
                        highNum = _.toNumber(getNumbers);
                    }

                    itemName = item.DefaultTitle + _.toString(highNum + 1);
                }
            }

        });

            //currentEl.val(item.ItemID);

            developController.elementCreateOnView(
                item.ItemID,
                item.ImagePath,
                item.HtmlTemplate,
                (itemName == '') ? item.DefaultTitle : itemName,
                item.HasFalseConnection,
                item.CurrentVersion,
                $newPosX,
                $newPosY,
                item.IsExperimental,
                item.HasResult
                );
        }
    });

    //List search init
    var listSett = {
        valueNames: ['name'],
        page: 8,
        plugins: [ListPagination({})]
    };
    var modulList = new List('component-list-container', listSett);


}


/* App helper function  */
function viewsChange(currView) {
    sessionStorage.setItem('currentViewID', appUi.viewSelect.val());
    appUi.selectedViews.val(sessionStorage.getItem('currentViewID'));
    AjaxCallNew('GetElements', JSON.stringify({
        TemplateID: getUrlParameter('TemplateID'),
        ViewName: appUi.viewSelect.val()
    }), fGetElementsCallback, true);
}


function appConsole(toggle, string) {
    if (typeof string !== typeof undefined) {
        if (toggle) {
            console.log(string);
        } else {
            return;
        }
    }
}

function checkElId($this, $object) {
    var attr = $this.attr('id');
    if (typeof attr === typeof undefined || attr === false) {
        return false;
    } else {
        if ($this.attr('id') === $object.attr('id')) {
            return true;
        } else {
            return false;
        }
    }

}

function deleteEl(el) {
    el.velocity({
        opacity: 0,
        translateY: ['-48px', easingSmooth]
    }, {
        duration: 332,
        complete: function() {
            developController.elementDelete();
            $('a[href="#elem-lib"]').trigger('click');
            $('#divPropertiesDialog').html(uiComponents.toolboxEmptyProp);

        }
    });
}

var cards = {
    load: function(el, html, callbackStart, callbackEnd) {


        $(el).hide().html(html).velocity({
            translateY: [0, easingSmooth, -48],
            opacity: 1
        }, {
            duration: 500,
            display: "block",
            begin: function() {
                if (typeof callbackStart == "function") {
                    callbackStart();
                }
            },
            complete: function() {
                if (typeof callbackEnd == "function") {
                    callbackEnd();
                    console.log('callback start');
                }
            }
        });


    },
    /*
     cards.tooltip([
     {icon: 'icon-trash', refId: 'elem-attribute-2'}
     ], '.tooltip-menu');
     */
     tooltip: function(btns, elem) {
        var array = btns;

        function btnAttr(origin) {
            var html = '';
            for (var key in array) {
                html += '<a href="#" data-card-menu="' + array[key].menuAction + '" class="' + array[key].classes + '" data-id="' + origin + '">' +
                '<i  class="' + array[key].icon + '"></i> ' + array[key].text + '</a>'
            }
            return html;
        }


        $(elem).tooltipster({
            offsetX: -14,
            offsetY: -16,
            theme: 'tooltipster-shadow',
            interactive: true,
            contentAsHTML: true,
            animation: 'fade',
            minWidth: 120,
            speed: 250,
            //trigger:'click',
            delay: 100,
            //interactiveTolerance: 500000,
            position: 'bottom-right',
            content: 'loading',
            functionBefore: function(origin, continueTooltip) {
                continueTooltip();
                origin.tooltipster('content', ('<div class="padding">' + btnAttr(origin.data('id')) + '</div>'));

            }
        });
    }
}


var compSideMenu = (function() {
    var menuState;
    appUi.viewJsPlumb.on('click', '.component .com-icon', function(e) {
        e.stopPropagation();

        var $this = $(this),
        slideMenu = $this.parents().eq(2).children('.component-option-panel');


        markAcitveNode($this.parents().eq(2).attr('id'));

        //appUi.viewJsPlumb.find('.active-element').removeClass('active-element');
        if (!$('#elem-property').hasClass('active')) {
            $('#elem-property-link').trigger('click');
        }

        menuState = slideMenu.attr('data-open');
        if (menuState === undefined) {
            menuState = 'closed';
        }

        if (menuState === 'closed') {
            slideMenu.attr('data-open', 'open').velocity({
                translateX: ["30px", easingSmooth],
                opacity: 1
            }, {
                duration: 250,
                display: "block"
            });
            menuState = slideMenu.attr('data-open');
        } else if (menuState === 'open') {
            slideMenu.attr('data-open', 'closed').velocity({
                translateX: ["0px", easingSmooth],
                opacity: 0
            }, {
                duration: 250,
                display: "none"
            });
            menuState = slideMenu.attr('data-open');
        }

        appConsole(togCon, 'menu icon clicked, menu-state: ' + menuState);


    });

    appUi.viewJsPlumb.on('click', '.component-option-panel .el-config-event', function(event) {
        //event.stopPropagation();
        //event.preventDefault();
        $(this).removeClass("el-config-event");
        $(this).removeClass("icon-cog");
        $(this).addClass("el-help icon-help");
        endpoints[$(this).attr('data-elementid')][POS_ELEMENT_DEBUG] = false;
    });

    appUi.viewJsPlumb.on('click', '.component-option-panel .el-help', function(event) {
        //event.stopPropagation();
        //event.preventDefault();
        $(this).addClass("el-config-event");
        $(this).addClass("icon-cog");
        $(this).removeClass("el-help icon-help");
        endpoints[$(this).attr('data-elementid')][POS_ELEMENT_DEBUG] = true;
    });

    appUi.viewJsPlumb.on('click', '.component-option-panel .el-destroy', function(event) {
        deleteEl($(this).parents().eq(3));
        appConsole(togCon, 'Element deleted: ' + $(this).parents().eq(3).attr('id'));
    });

})();

var fStopTemplateCallback = function(data) {

}

var fGetElementsCallback = function(data1) {

    console.clear();
    console.log(JSON.parse(data1));
    var nodeNames = [];

    miniLoader.show();
    //ShowProgressAnimation();

    currentEl.val('');

    appConsole(togCon, "3. jsPlumb instance callback");
    setTimeout(function() {
        $('.loading-spinner').fadeOut(250);
    }, 2000);

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
    var json_data = JSON.parse(data1);
    $('#global-help').html(json_data[3]);


    if (json_data[1].length > 0)
        appUi.hdnCurntTplId.value = json_data[1][0].TemplateID;

    var htmlViewOptions = '';

    $.each(json_data[0], function(item) {
        htmlViewOptions += '<option data-class="delete-view-list"  val="' + json_data[0][item] + '">' + json_data[0][item] + '</option>'
    });

    sessionStorage.setItem('currentViewID', json_data[4]);
    appUi.selectedViews.val(sessionStorage.getItem('currentViewID'));


    appUi.viewSelect.html(htmlViewOptions)
    appUi.viewSelect.val(sessionStorage.getItem('currentViewID'));

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
    document.title = json_data[2];
    $("#lblProjectName").html(json_data[2]);
    $("#lblBoardName").html($('#hdnWorkstationName').val());


    //  appUi.viewSelect.promise().done(function(){alert(2)});

    // View select template dropdown
    appUi.viewSelect
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
                    /*                        select: function( event, ui ) {

                     this.value = '<result>' +this.value+</result>;

                     return false;
                 }*/
             });

            });

        });


    });


};

///////////////////////////////////////////////////////////////////////////////////////////////////////
// PAGES LOADING
///////////////////////////////////////////////////////////////////////////////////////////////////////
$(window).on('load', function() {
    appConsole('on load');
    $('.app-menu li').removeClass('active');

    var url = window.location.pathname;
    

    if (url === "/view/Layout.aspx") {
        sessionStorage.removeItem('currentViewID');
        $('.app-menu li a[href*="/view/Dashboard.aspx"]').parent().addClass('active');
        
            loadScript("../assets/js/new/app.cloud.dev.env.js");
            loadScript("../assets/js/modules/module.custom.dropdown.js");
            loadScript("../Scripts/Mqtt/mqttws31.js");
            loadScript("../assets/js/modules/module.permission.controller.js");
            loadScript("../assets/js/modules/module.panels.js");
            loadScript("../assets/core/js/nodes.helper.js");
            loadScript("../assets/js/modules/module.gateway.info.js");
            loadScript("../assets/js/controllers/instance.management.controller.js");
            loadScript("../assets/js/views/panels.views.js");
            loadScript("../assets/js/new/layout.js",  pages.develop);


    } else if (url === "/view/Dashboard.aspx") {
        //  $('.app-menu li').removeClass('active');
        $('.app-menu li a[href$="Dashboard.aspx"]').parent().addClass('active');
        pages.dashboard();
    } else if (url === "/view/ExperienceDashboard.aspx") {
        $('.app-menu li a[href*="ExperienceDashboard.aspx"]').parent().addClass('active');
        pages.experience();

    } else if (url === "/view/ExperienceDetails.aspx") {
        $('.app-menu li a[href*="ExperienceDashboard.aspx"]').parent().addClass('active');
        pages.experienceData();
    } else if (url === "/view/ExternalServices.aspx") {
        $('.app-menu li a[href*="ExternalServices.aspx"]').parent().addClass('active');
    } else if (url === "/view/RoleAdmin.aspx") {
        pages.roleAdmin();
    } else if (url === "/view/Downloads.aspx") {
        $('.app-menu li a[href*="Downloads.aspx"]').parent().addClass('active');
    } else if (url === "/view/Administration.aspx") {
        $('.app-menu li a[href*="Administration.aspx"]').parent().addClass('active');
    } else if (url === "/view/userprofile.aspx") {
        $('a[href*="userprofile.aspx"]').parents('.has-dropdown').addClass('active');
    } else if (url === "/view/Instances.aspx") {
        $('.app-menu li a[href*="Instances.aspx"]').parents('li').addClass('active');
    } else if (url === "/view/WebServersDashboard.aspx") {
        $('a[href*="WebServersDashboard.aspx"]').parents('.has-dropdown').addClass('active');
        pages.edgeDashboards();
        /* AJAX PAGE LOADING 
    $("main").load("WebServersDashboard.aspx #ajax-loading", function () {
        $.getScript('../assets/js/modules/module.edge.dashboard.js', function () {
            pages.edgeDashboards();
            window.history.pushState({ href: "WebServersDashboard.aspx" }, '', "WebServersDashboard.aspx");
        });
    });
    */
} else if (url === "/view/WebServerDetails.aspx") {
    $('a[href*="WebServerDetails.aspx"]').parents('.has-dropdown').addClass('active');
    pages.edgeDetails();
}


});


var outJsonDash;
///////////////////////////////////////////////////////////////////////////////////////////////////////
// PAGES PACKET INTO FUNCTIONS FOR LOADING
///////////////////////////////////////////////////////////////////////////////////////////////////////
var pages = {

    // Edge cloud details
    edgeDetails: function() {
        edgeDetails.init();
        edgeDetails.buildElementToolbox();
    },

    // Edge cloud dashboard
    edgeDashboards: function() {
        edgeDashboard.init()
    },

    // Home Dashboarad
    dashboard: function() {

        var fGetTemplatesCallback = function(templates) {
            var data = JSON.parse(templates);

            //            vue(data); testing VUE.js

            var html = '';
            outJsonDash = data;

            html += htmlGener.addNewCard("create-tmp", "New Project");
            appConsole(togCon, data);
            //   htmlGener.templateCard(id,view,board,title,date,description)
            $.each(data, function(i) {
                html += htmlGener.templateCard(
                    data[i].TemplateID,
                    data[i].Views, data[i].Board,
                    data[i].TemplateName,
                    moment(data[i].LastUpdateJsFormat).format("DD MMM YYYY, HH:mm"),
                    data[i].TemplateDescription,
                    data[i].IsShared,
                    data[i].CategoryID,
                    data[i].Tags,
                    data[i].TemplatePicture
                    );
            });

            cards.load('#iot-projects', html);
            cards.tooltip([{
                icon: 'icon-trash',
                refId: 'elem-attribute-2',
                text: 'Delete',
                menuAction: 'deleteTemplate',
                classes: 'red-text'
            }], '.tooltip-menu');
            html = null;

            market.getCategories();

            activityWindow('#iot-projects', '[data-card] [data-option]');


            //$('.card-body .description').matchHeight();


            $('body').on('click', '[data-card-menu="deleteTemplate"]', function(e) {
                e.stopPropagation();
                e.preventDefault();


                var id = $(this).data('id');
                var card = $('[data-id="' + id + '"]');


                $dialog.confirm(appUi.modal, 'Delete Project', lang[l].modals.confirmDelTemplate(card.find('h3').text()), confirmDeleteTemplate, id);


                function confirmDeleteTemplate(templateId) {

                    JSON_byData('Dashboard.aspx/DeleteTemplate', JSON.stringify({ TemplateID: templateId })).done(function() {
                        card.parent().velocity("transition.slideDownOut", {
                            duration: 500,
                            complete: function(el) {
                                $(el).remove();
                            }
                        });
                    });
                }

            });


            $("#create-tmp").on('click', function(el) {
                el.preventDefault();

                if (false) {
                    templateDialog = ShowDialogHelper(500, 'auto', appUi.modal, '/Files/Templates/template.html',
                        lang[l].modals.tmpNew.title, dialogButtons("Save", "", "lnkSaveTemplate"));
                } else {
                    $(appUi.modal).dialog({
                        modal: true,
                        position: {
                            my: "center",
                            at: "top+124",
                            of: window
                        },
                        open: function() {
                            $(this).load('/Files/Templates/template.html');
                            $('.ui-dialog-buttonset').children('button').removeClass("ui-button ui-widget ui-state-default ui-state-active ui-state-focus ui-corner-all ui-button-text-only");
                            $(this).closest('.ui-dialog').find('.ui-dialog-titlebar-close').hide();
                            //appConsole(togCon, 'Dialog loaded from:' + url);

                        },
                        resizable: false,
                        draggable: true,
                        height: 'auto',
                        width: 500,
                        title: 'Create new Project',
                        buttons: [{
                            text: 'Save',
                            id: '#lnkSaveTemplate',
                            class: 'fo-bold text-uppercase button small success radius',
                            click: function() {

                                    // number of fields to validate
                                    var valid = 2,
                                    templateName = $('#txtNewTemplateName'),
                                    viewName = $('#txtNewViewName');


                                    viewName.on('keypress', function() {
                                        var $this = $(this);
                                        if ($this.parent().hasClass('error')) {
                                            if ($this.val().indexOf(' ') == -1 && $this.val().length >= 3) {
                                                $this.parent().removeClass('error');
                                                valid--;
                                            }
                                        } else if ($this.val().indexOf(' ') >= 0 || $this.val().length < 3) {
                                            $this.parent().addClass('error');
                                            valid++;
                                        }
                                    });


                                    templateName.on('keypress', function() {
                                        var $this = $(this);
                                        if ($this.parent().hasClass('error')) {
                                            if ($this.val().length >= 3) {
                                                $this.parent().removeClass('error');
                                                valid--;
                                            }
                                        }
                                    });


                                    if (templateName.val().length < 3) {
                                        templateName.parent().addClass('error');
                                    } else {
                                        templateName.parent().removeClass('error');
                                        valid--;
                                    }


                                    if (viewName.val().indexOf(' ') >= 0 || viewName.val().length < 3) {
                                        viewName.parent().addClass('error');
                                    }

                                    if (viewName.val().indexOf(' ') == -1 & viewName.val().length >= 3) {
                                        viewName.parent().removeClass('error');
                                        valid--;
                                    }


                                    if (valid == 0) {
                                        AjaxCallNew('InsertTemplate', JSON.stringify({
                                            NewTemplateName: $("#txtNewTemplateName").val(),
                                            NewViewName: $("#txtNewViewName").val(),
                                            NewTemplateDescription: $("#txtNewTemplateDescription").val(),
                                            NewTemplateSubBoard: 'RaspberryPi2' /*$("#optNewTemplateSubBoardType").val()*/ ,
                                            NewTemplateMajorVersion: '1.0' /*$("#NewTemplateMajorVersion").val()*/ ,
                                            OS: parseInt($("[data-os]").val())
                                        }), fInsertTemplateCallback, true);
                                        endpoints = {};

                                        //alert('success');
                                        $(this).dialog("close");
                                    }

                                },
                            },
                            {
                                text: 'Close',
                                class: 'fo-bold text-uppercase button small secondary radius',
                                click: function() {
                                    $(this).dialog("close");
                                }
                            }
                            ],
                            show: {
                                effect: "fade",
                                duration: 250
                            },
                            hide: {
                                effect: "fade",
                                duration: 250
                            }
                        });
}
});


            /*cards.tooltip([
             {icon: 'icon-cog', refId: 'elem-attribute-1'},
             {
             icon: 'icon-trash',
             refId: 'elem-attribute-2'
             }
             ], '.tooltip-menu');*/

         };
         AjaxCallNew('GetTemplates', '', fGetTemplatesCallback, false);
         appConsole(togCon, 'You are on Dashboard page');
         appUi.globalHelp.load('help/dashboard.help.html');

         if ($('#openDialogBox').text() === "true") {
            ShowDialogHelper(640, "auto",
                appUi.modal, 'modals/feedback.html', "Hey, you have no idea how to start?",
                dialogButtons("Send", "", "sendFeedbackMessage", '', false));
        }

    },

    develop: function() {

        var config = {

            defaults: {
                size: "auto",
                minSize: 50,
                //paneClass: "pane", // default = 'ui-layout-pane'
                resizerClass: "resizer", // default = 'ui-layout-resizer'
                togglerClass: "toggler", // default = 'ui-layout-toggler'
                buttonClass: "button", // default = 'ui-layout-button'
                //contentSelector: ".content-layout", // inner div to auto-size so only it scrolls, not the entire pane!
                //contentIgnoreSelector: "span", // 'paneSelector' for content to 'ignore' when measuring room for content
                togglerLength_open: 35, // WIDTH of toggler on north/south edges - HEIGHT on east/west edges
                togglerLength_closed: 35, // "100%" OR -1 = full height
                hideTogglerOnSlide: true, // hide the toggler when pane is 'slid open'
                togglerTip_open: "Close This Pane",
                togglerTip_closed: "Open This Pane",
                resizerTip: "Resize This Pane", // effect defaults - overridden on some panes
                fxName: "fade", // none, slide, drop, scale
                fxSpeed_open: 250,
                fxSpeed_close: 250,
                fxSettings_open: {
                    easing: "swing"
                },
                fxSettings_close: {
                    easing: "swing"
                }
            },


            west: {
                size: 256,
                maxSize: 256,
                minSize: 128,
                spacing_closed: 48, // wider space when closed
                togglerLength_closed: 21, // make toggler 'square' - 21x21
                togglerAlign_closed: "top", // align to top of resizer
                togglerLength_open: 0, // NONE - using custom togglers INSIDE west-pane                           
                togglerTip_open: "Close West Pane",
                togglerTip_closed: "Open West Pane",
                resizerTip_open: "Resize West Pane",
                slideTrigger_open: "click", // default                                
                initClosed: false, //  add 'bounce' option to default 'slide' effect

            },
            east: {
                spacing_closed: 48,
                initClosed: false,
                maxSize: 1000,
                minSize: 128
            },
            south: {
                size: 128,
                minSize: 128,
                initClosed: true,
                maxSize: ($(window).height() - 110) / 2,
                fxName: "fade",
                fxSpeed_open: 250,
                fxSpeed_close: 250,
                fxSettings_open: {
                    easing: "swing"
                },
                fxSettings_close: {
                    easing: "swing"
                },
                //spacing_closed: 0, // HIDE resizer & toggler when 'closed
                slidable: true,
                onhide_start: function() {},
                onhide_end: function() {},
                onshow_start: function() {},
                onshow_end: function() {},
                onopen_start: function() {},
                onopen_end: function() {},
                onclose_start: function() {},
                onclose_end: function() {},
                onresize_end: function() {}
            }
        }


        var dfd = new $.Deferred();


        var initLayout = function() {
            // create a layout with default settings
            myLayout = $('#mainContent').layout(config);


            // BIND events to hard-coded buttons in the NORTH toolbar
            myLayout.addOpenBtn("#tbarOpenSouth", "south");
            myLayout.addCloseBtn("#tbarCloseSouth", "south");
            myLayout.addPinBtn("#tbarPinWest", "west");
            myLayout.addPinBtn("#tbarPinEast", "east");

            // save selector strings to vars so we don't have to repeat it
            // must prefix paneClass with "body > " to target ONLY the myLayout panes
            var westSelector = ".ui-layout-west"; // outer-west pane
            var eastSelector = ".ui-layout-east"; // outer-east pane

            // CREATE SPANs for pin-buttons - using a generic class as identifiers
            //$("<span></span>").addClass("pin-button").appendTo(westSelector);
            //$("<span></span>").addClass("pin-button").prependTo(eastSelector);


            // BIND events to pin-buttons to make them functional
            myLayout.addPinBtn("#pin-left-panel", "west");
            myLayout.addPinBtn("#pin-right-panel", "east");

            // CREATE SPANs for close-buttons - using unique IDs as identifiers
            //$("<span></span>").attr("id", "west-closer").prependTo(westSelector);
            //$("<span></span>").attr("id", "east-closer").prependTo(eastSelector);
            // BIND layout events to close-buttons to make them functional
            //myLayout.addCloseBtn("#west-closer", "west");
            //myLayout.addCloseBtn("#east-closer", "east");

            dfd.resolve("done");
            return dfd.promise();

        }

        var promise = initLayout();
        promise.done(function() {
            $('.resizer-west').append(
                '<i class="icon-grid"></i>' +
                '<i class="fa fa-bug"></i>'
                );

            $(".resizer-west .icon-grid").on("click", function() {
                $('a[href$=elem-lib]').trigger("click");
            });


            $(".resizer-west .fa-bug").on("click", function() {
                $('a[href$=elem-console]').trigger("click");
            });

            $('.resizer-east').append(
                '<i class="icon-property-panel"></i>'
                );

            $("footer").append('<small class="toggle-console">Toggle console</small>');
            $('.toggle-console').on("click", function() {
                myLayout.toggle('south');
            });

        });



        setDefaultRemoteSettings();
        gateways.init();
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

            JSON_byData('Layout.aspx/GetElements',
                JSON.stringify({
                    TemplateID: getUrlParameter('TemplateID'),
                    ViewName: sessionStorage.getItem('currentViewID')
                })
                ).then(function(data) {
                    appConsole(togCon, "2. Ajax response");
                    fGetElementsCallback(data.d);

                }).then(function() {

                // Gateway select Dropdown
                appUi.gatewaySelect.gatewayselectmenu({
                    width: "160px",
                    change: function(event, ui) {
                        appUi.infoBtn.addClass('disabled');
                        appUi.consoleDebug.addClass('disabled');
                        appUi.remoteUpdateBtn.addClass('disabled');
                        appUi.remoteRestartBtn.addClass('disabled');
                        sessionStorage.setItem("currentGateway", "{\"Id\":\"" + ui.item.value + "\",\"Name\":\"" + ui.item.label + "\"}");
                        $('[data-gateway="connection"]').removeClass('connected');
                        setDefaultRemoteSettings();
                        unSubscribeTopics();
                        pingGateway();
                        appUi.hdnAttachDebugger.val(false);
                        loadToolbox(appUi.tplToolbox)

                    },
                    focus: function() {
                        sessionStorage.setItem("previousGateway", "{\"Id\":\"" + this.value + "\"}");
                    }
                }).gatewayselectmenu("menuWidget")
                .addClass("ui-menu-icons  depth-1");

                appUi.gatewaySelect.gatewayselectmenu('refresh');
                appUi.gatewaySelect.gatewayselectmenu('instance').menu.append(
                    '<li class="add-dropdown-element"><a id="add-gateway-selectmenu" class="" href="#" class="left-rc primary button prefix">' +
                    '<i class="icon-plus button link success"></i> <span>Add Gateway..</span>' +
                    '</a></li>');

                $(document).foundation('tooltip', 'reflow');
            });

                instance.doWhileSuspended(function() {
                // bind click listener; delete connections on click
                instance.bind("click", function(conn) {
                    instance.detach(conn);
                });

                instance.bind("connection", function(conn) {
                    //instance.detach(conn);
                });

                instance.bind("beforeDetach", function(conn) {
                    return confirm("Delete connection?");
                });

                instance.bind("beforeDrop", function(connection) {
                    if (connection.sourceId == connection.targetId) {
                        alert('Element could not be connected to itself!');
                        return false;
                    } else
                    return true;
                });

                jsPlumb.fire("jsPlumbDemoLoaded", instance);
                CloseProgressAnimation();


                $('[data-template="panel-bottom"]').replaceWith(panelsTpl.developDebug({ id: "develop-debug-panel" }));
                panel.bottom('#debug-panel-controller', '#develop-debug-panel', '#handle');
                $('[data-controller="minimize-panel"]').trigger('click');
                $('#develop-debug-panel').attr('data-open', false);

                appUi.debugPanel = $('[data-debug-panel="output"]');


                $('#show-timestamp').on('change', function() {
                    if ($(this).is(':checked')) {
                        $('[data-console-timestamp]').removeClass('hide');
                    } else {
                        $('[data-console-timestamp]').addClass('hide');
                    }
                });

                $('body').on('click', '[data-console-button]', function() {

                    var $this = $(this),
                    filter = $this.data('console-button');

                    $this.siblings().removeClass('active');
                    $this.addClass('active');
                    //alert($(this).data('console-button'))

                    switch (filter) {
                        case 'all':
                        $('[data-console-display]').removeClass('hide');
                        break;
                        case 'info':
                        $('[data-console-display]').addClass('hide');
                        $('[data-console-display="info"]').removeClass('hide');
                        break;
                        case 'error':
                        $('[data-console-display]').addClass('hide');
                        $('[data-console-display="error"]').removeClass('hide');
                        break;
                        case 'warning':
                        $('[data-console-display]').addClass('hide');
                        $('[data-console-display="warning"]').removeClass('hide');
                        break;
                    }

                });


                $('main').on('click', '[data-debug-panel="clear"]', function(e) {
                    e.stopPropagation();

                    appUi.debugPanel.html('<pre class="highlight">Console cleared</pre>').delay(50).queue(function() {
                        $(this).dequeue().children('pre').removeClass('highlight').delay(500).queue(function() {
                            $(this).dequeue().remove()
                        });
                    });
                });

                //appUi.viewJsPlumb.height($('#pane-container').height());
                //appUi.viewJsPlumb.width($('#pane-container').width());

                $(window).resize(function() {
                    appUi.viewJsPlumb.height($('#pane-container').height());
                });

            });


                $('#elem-console').on('click', '[data-debug-show]', function(e) {
                    e.preventDefault();

                    var $this = $(this);

                    if (!$this.hasClass('disabled')) {
                        consoleDebugResult.result = $this.parent().find('[data-debug-result]').text();
                        consoleDebugResult.id = $this.parent().find('[data-id]').text();

                        ShowDialogHelper(960, 480,
                            appUi.modal, 'modals/debug.modal.html', "Debug Result"
                            );
                    }
                });


                $('#elem-console').on('click', '[data-debug-error]', function(e) {
                    e.preventDefault();
                    var $this = $(this);

                    if (!$this.hasClass('disabled')) {
                        consoleDebugResult.error = $this.data('debug-error');
                        ShowDialogHelper(960, 480,
                            appUi.modal, 'modals/debug.error.modal.html', "Debug Error"
                            );
                    }
                });


                appUi.viewJsPlumb.on('click', 'small.red-text', function(e) {
                    e.stopPropagation();
                    var name = $(this).children('span').text();
                    appConsole(togCon, name);
                    $('#console' + name + ' [data-debug-error]').trigger('click');
                });
            });


        // Gateway settings
        $('#gateway-tmp').on('click', function() {
            ShowDialogHelper(640, 'auto',
                appUi.modal, '/view/modals/gateway.settings.html',
                'Gateway Remote Management',
                dialogButtons("Save Settings", "", "exportGatewayModalSettings", '', false));
        });

        loadToolbox(appUi.tplToolbox);
        appUi.globalHelp.load('help/develop.help.html');

        var viewUrl = window.location.search.split("&")[1];
        if (viewUrl == "ViewID=") {
            $(document).ajaxStop(function() {
                var getView = $('.view-select').find('option').eq(0).val();
                $('.view-select').val(getView);
                window.history.replaceState({}, viewUrl, window.location.href + getView.replace(/\s+/g, '%20'));
            });

        }


        // Attach event listener to get element result and display result in popup
        appUi.tplToolPro.on('click', '[data-element-result]', function() {
            ShowDialogHelper(500, 300,
                appUi.modal, 'modals/element.result.html', 'Element Result(s)',
                '');
        });


        appUi.selectedViews.val(sessionStorage.getItem('currentViewID'));

        // Checkbox view listener
        $('body').on('click', '[data-export-view]', function() {

            var $this = $(this),
            arr = null;

            if (_.isEmpty(appUi.selectedViews.val())) {
                arr = [];
            } else {
                arr = appUi.selectedViews.val().split(',');
            }

            if ($this.is(':checked')) {
                arr.push($this.val());
            } else {
                arr = _.remove(arr, function(string) {
                    return string != $this.val();
                });
            }

            appConsole(togCon, appUi.selectedViews.val(arr.join()));

        });

        appUi.developConsole = $('#develop-debug-panel');


    },


    // Experience Dashboard
    experience: function() {
        AjaxCallNew('GetUserExperiences', '', fGetUserExperiencesCallback, true);

        $('body').on('click', '[data-card-menu="deleteExperience"]', function(e) {
            e.stopPropagation();
            e.preventDefault();


            var id = $(this).data('id');
            var cardName = $('[data-id="' + id + '"]').find('h3').text();

            $dialog.confirm(appUi.modal, 'Confirm', lang[l].modals.confirmDelExperience(cardName), DeleteExperience, id);

        });

        appUi.globalHelp.load('help/experience.dashboard.help.html');

        $('body').on('click', '#create-xp-tmp', function(el) {


            $(appUi.modal).dialog({
                position: {
                    my: "center",
                    at: "top+124",
                    of: window
                },
                modal: true,
                open: function() {
                    $(this).load('modals/create.experience.html');
                    $('.ui-dialog-buttonset').children('button').removeClass("ui-button ui-widget ui-state-default ui-state-active ui-state-focus ui-corner-all ui-button-text-only");
                    $(this).closest('.ui-dialog').find('.ui-dialog-titlebar-close').hide();
                    //appConsole(togCon, 'Dialog loaded from:' + url);
                },
                resizable: false,
                draggable: true,
                height: 'auto',
                width: 500,
                title: 'Create new Experience',
                buttons: [{
                    text: 'Save',
                    id: '#lnkSaveExperienceView',
                    class: 'fo-bold text-uppercase button small success radius',
                    click: function() {

                        var input = $('#txtExperienceViewName');
                        var inputlength = input.val().length;

                        if (inputlength < 3) {
                            input.parent().addClass("error");
                        } else {
                            expFn.refresh();
                            $(this).dialog("close");
                        }
                    },
                },
                {
                    text: 'Close',
                    class: 'fo-bold text-uppercase button small secondary radius',
                    click: function() {
                        $(this).dialog("close");
                    }
                }
                ],
                show: {
                    effect: "fade",
                    duration: 250
                },
                hide: {
                    effect: "fade",
                    duration: 250
                }
            });
        });
    },

    // experience Details
    experienceData: function() {
        // Compile and initialise bottom element panel
        $('[data-template="panel-bottom"]').replaceWith(panelsTpl.experienceWidget({ id: "experience-widget-panel" }));
        panel.bottom('#widget-panel-controller', '#experience-widget-panel', '#handle');
        $('[data-controller="minimize-panel"]').trigger('click');
        $('#develop-debug-panel').attr('data-open', "false");

        $('header').eq(0).css({ height: "64px" });


    },

    // Role Admin
    roleAdmin: function() {
        multiUserModule();
        gatewayAdministration();

        var backButton =
        $('<a>', {
            id: 'back-btn',
            href: '#',

            html: '<i class="icon-reply"></i>Back to Template',
            click: function(e) {
                e.preventDefault();
                window.history.back();
            }
        });

        $('.main-navigation li:last-child').append(backButton);

    }
}

var outerExp;
var fGetUserExperiencesCallback = function(elementProperties) {
    var html = '';

    html += htmlGener.addNewCard("create-xp-tmp", "New Experience");
    $.each(JSON.parse(elementProperties), function(i, date) {
        outerExp = date;

        //html += htmlGener.dashExpList(date.ExperienceViewID, date.ExperienceViewName, dateConv(date.LastUpdateJsFormat), date.WidgetsCount);
        html += uiComponents.cards.experience({
            classes: 'blue',
            cardId: date.ExperienceViewID,
            title: date.ExperienceViewName,
            time: moment(date.LastUpdateJsFormat).format("DD MMM YYYY, HH:mm"),
            total: date.WidgetsCount
        })

    });
    cards.load('#iot-experience', html);

    cards.tooltip([{
        icon: 'icon-trash',
        refId: 'elem-attribute-2',
        text: 'Delete',
        menuAction: 'deleteExperience',
        classes: 'red-text'
    }], '.tooltip-menu');


    $('.card').on('click', '.edit-exp', function(e) {
        e.stopPropagation();
        AddElementsToExperience($(this).attr('data-id'));
    });

};

/////////////////////////////////////////////// TO DO ////////////////////////
var fInsertExperienceViewCallback = function(data1) {
    var json_data = JSON.parse(data1);
    AjaxCallNew('GetUserExperiences', '', fGetUserExperiencesCallback, true);
};

var fDeleteExperienceViewCallback = function(data1) {
    AjaxCallNew('GetUserExperiences', '', fGetUserExperiencesCallback, true);
}

function DeleteExperience(experienceViewID) {

    AjaxCallNew('DeleteExperienceView', JSON.stringify({ ExperienceViewID: experienceViewID }), fDeleteExperienceViewCallback, true);
}

function RedirectToExperienceDetails(experienceViewID) {
    window.location = "ExperienceDetails.aspx?ExperienceID=" + experienceViewID;
}

function AddElementsToExperience(experienceViewID) {
    window.location = "ExperienceElementsEdit.aspx?ExperienceID=" + experienceViewID;
}


//Experience Function need to create bubbling functions NEED TO BE SIMILAR TO DASHBOARD
var expFn = {
    refresh: function() {

        AjaxCallNew('InsertExperienceView', JSON.stringify({
            ExperienceViewName: $("#txtExperienceViewName").val()
        }), fInsertExperienceViewCallback, true);
    },
    delete: function(experienceViewID) {
        AjaxCallNew('DeleteExperienceView', JSON.stringify({ ExperienceViewID: experienceViewID }), fDeleteExperienceViewCallback, true);
    },
    redirect: function(experienceViewID) {
        window.location = "ExperienceDetails.aspx?ExperienceID=" + experienceViewID;
    },
    addEl: function(experienceViewID) {
        window.location = "ExperienceElementsEdit.aspx?ExperienceID=" + experienceViewID;
    }

};


///////////////////////////////////////////////////////////////////////////////////////////////////////
// FEEDBACK WINDOW
///////////////////////////////////////////////////////////////////////////////////////////////////////

$('.open-dialog-feedback-btn').on('click', function() {
    ShowDialogHelper(640, "auto",
        appUi.modal, 'modals/feedback.html', "Hey, you have no idea how to start?",
        dialogButtons("Send", "", "sendFeedbackMessage", '', false));
});


///////////////////////////////////////////////////////////////////////////////////////////////////////
// DASHBOARD ACTIVITY WINDOW
///////////////////////////////////////////////////////////////////////////////////////////////////////


var activityWindow = (function(bubbleParent, bubbleChild) {
    var sideWin = $('#side-window');
    var actWin = $('#activity-window');
    var btnClose = $('#activity-window-btn-close');
    var currentEl, selectedEl, toggleWin, cardInit, speed = 400;
    var html;

    var changes = {
        title: false,
        description: false,
        share: false,
        img: false,
        category: false,
        tags: false
    };


    $('.show-options').on('click', function() {
        options.velocity("slideUp", { duration: 250 });
        options.velocity("reverse");
    });


    btnClose.on('click', function(e) {
        e.preventDefault();
        close();
        reset();
    });

    $('.cancel').on('click', function(e) {
        e.preventDefault();
        reset();
    });

    // activity window change share
    appUi.activityWin.share.on('change', function() {
        if (shareSame(cardInit.share, changes.share)) {
            appConsole(togCon, 'activity window share toggle: ' + shareSame(cardInit.share, changes.share));
            changes.share = !cardInit.share;
            toggleSaveBtn(changes);
            console.log('uguali');
        } else {
            changes.share = !changes.share;
            toggleSaveBtn(changes)
            console.log('divers');
        }
        optionPanel.toggle();
    });


    // On change image upload
    appUi.activityWin.img.on('change', function() {
        changes.img = true;
        toggleSaveBtn(changes);
    });


    $(bubbleParent).on('click', '[data-workstation="open"]', function() {

        // Default gateway
        var selectedGateway = 0,
        selectedGatewayName = 'Default';


        var tplID = $(this).parents().eq(1).find('select').data('workstation');
        sessionStorage.setItem("currentGateway", "{\"Id\":\"" + selectedGateway + "\",\"Name\":\"" + selectedGatewayName + "\"}");

        var $this = $(this),
        tplID = $this.parents('[data-id]').data('id');


        var params = {
            'TemplateID': tplID
        }


        window.location.href = '/view/Layout.aspx?' + $.param(params);
    });


    var cardData = {
        load: function(el) {

            var title = el.find('[data-title]');
            var description = el.find('[data-description]');
            var imgUrl = el.data('img');
            var category = el.data('category');
            var tags = el.data('tags');

            // Load image url
            appUi.activityWin.imgUrl.attr('src', imgUrl);

            // Initial state of card changes AWARE CONTENT
            cardInit = {
                title: el.find('[data-title]').text(),
                description: el.find('[data-description]').text(),
                share: JSON.parse(el.find('[data-share]').attr('data-share')),
                category: appUi.activityWin.category.val(category),
                tags: appUi.activityWin.tags.val(tags)
            };

            appConsole(cardInit.tags, togCon);

            //SET activity window input fields
            $('#activity-window-title').text(title.text());
            appUi.activityWin.title.val(title.text());
            appUi.activityWin.desc.val(description.text());
            appUi.activityWin.share.prop('checked', el.find('[data-share]').data('share'));
            appUi.activityWin.img.val('');
            optionPanel.init(cardInit.share);


            // SET Category
            if (category != '') {
                appUi.activityWin.category.val(category);
            }

            //SET Tags

            if (tags != '') {
                appUi.activityWin.tags.val(tags);
            }


            // Initial state of card changes AWARE CONTENT
            cardInit = {
                title: el.find('[data-title]').text(),
                description: el.find('[data-description]').text(),
                share: JSON.parse(el.find('[data-share]').attr('data-share')),
                category: appUi.activityWin.category.val(),
                tags: ''
            };

            //UPDATE title
            appUi.activityWin.title.on('input', function() {
                if (el.hasClass('selected')) {
                    $('#activity-window-title').text($(this).val());
                    title.text($(this).val());

                    if (cardInit.title === $(this).val()) {
                        changes.title = false;
                        toggleSaveBtn(changes);
                    } else {
                        changes.title = true;
                        toggleSaveBtn(changes);
                    }

                }
            });


            //UDATE description
            appUi.activityWin.desc.on('input', function() {
                if (el.hasClass('selected')) {
                    description.text($(this).val());

                    if (cardInit.description === $(this).val()) {
                        changes.description = false;
                        toggleSaveBtn(changes);
                    } else {
                        changes.description = true;
                        toggleSaveBtn(changes);
                    }
                }
            });

            //UDATE category
            appUi.activityWin.category.on('change', function() {

                if (cardInit.category === $(this).val()) {
                    changes.category = false;
                    toggleSaveBtn(changes);
                } else {
                    changes.category = true;
                    toggleSaveBtn(changes);
                }
            });

            //UDATE tags
            appUi.activityWin.tags.on('input', function() {
                if (cardInit.tags === $(this).val()) {
                    changes.tags = false;
                    toggleSaveBtn(changes);
                } else {
                    changes.tags = true;
                    toggleSaveBtn(changes);
                }
            });


        }
    }


    var cardSave = function(el) {
        appConsole(togCon, 'test save');
        appConsole(togCon, el.attr('data-id'));

        selectedEl = el;


        // Image setup
        var image = {
            name: '',
            result: ''
        };


        // var img = appUi.activityWin.img.files[0];


        appUi.activityWin.saveBtn.on('click', function(e) {

            if (!$(this).hasClass('disabled')) {
                if (el.hasClass('selected')) {
                    el.find('[data-title]').text(appUi.activityWin.title.val());
                    el.find('[data-description]').text(appUi.activityWin.desc.val());
                    var shareStatus = el.find('[data-share]').attr('data-share');


                    var template = {
                        id: el.children().attr('data-id'),
                        title: appUi.activityWin.title.val(),
                        category: appUi.activityWin.category.val(),
                        description: appUi.activityWin.desc.val(),
                        tags: appUi.activityWin.tags.val(),
                        img: "",
                        imgName: ""
                    };


                    appConsole(togCon, template);


                    if (document.getElementById('activity-window-img').files.length == 1) {
                        var f = document.getElementById('activity-window-img').files[0];
                        if (f) {
                            var r = new FileReader();
                            r.readAsDataURL(f);

                            r.onload = function(e) {
                                //Save to database with image
                                market.addTemplate(
                                    template.id,
                                    template.title,
                                    template.description,
                                    appUi.activityWin.share.is(':checked') ? true : false,
                                    template.category,
                                    template.tags,
                                    r.result,
                                    f.name
                                    );
                                document.getElementById("activity-window-picture").src = window.URL.createObjectURL(f);
                            }
                        }
                    } else {
                        //Save to database without image
                        market.addTemplate(
                            template.id,
                            template.title,
                            template.description,
                            appUi.activityWin.share.is(':checked') ? true : false,
                            template.category,
                            template.tags,
                            template.img,
                            template.imgName
                            );
                    }
                }

                //After saving disable SAVE button
                $(this).addClass('disabled');
                $(this).val('Saved')

            } else {
                e.preventDefault();
                e.stopPropagation();
                appConsole(togCon, 'you did not change anything');
            }
        });

    }


    function toggleSaveBtn(obj) {
        appConsole(togCon, obj);
        if (obj.title || obj.description || obj.share || obj.img || obj.category || obj.tags) {
            appUi.activityWin.saveBtn.removeClass('disabled');
            appUi.activityWin.saveBtn.val('Save');
        } else {
            appUi.activityWin.saveBtn.addClass('disabled');
            appUi.activityWin.saveBtn.val('Saved');
        }
    }


    function shareSame(a, b) {
        if (String(a) == String(b)) {
            console.log('string A: ' + a + ' string B: ' + b);
            return true;
        } else {
            return false
        }
    }


    function imageUpload(inputField, callback) {

        var file, read;

        if (inputField.files.length == 1) {
            file = inputField.files[0];

            if (file) {
                read = new FileReader();
                read.readAsDataURL(file);
                read.onload = function(e) {
                    callback();
                }
            }
        }
    }

    var optionPanel = {
        el: function() {
            return $('.additional-options');
        },

        init: function(bool) {
            var options = this.el();
            if (String(bool) == "true") {
                options.velocity("slideDown", { duration: 250 });
                options.attr('data-open', true);
            } else {
                options.velocity("slideUp", { duration: 250 });
                options.attr('data-open', false);
            }
        },
        toggle: function() {
            var options = this.el();


            if (options.attr('data-open') == "true") {
                options.velocity("slideUp", { duration: 250 });
                options.attr('data-open', false);

            } else if (options.attr('data-open') == "false") {
                options.velocity("slideDown", { duration: 250 });
                options.attr('data-open', true);
            }
        }
    }


    function reset() {
        //reset card
        selectedEl.find('[data-title]').text(cardInit.title);
        selectedEl.find('[data-description]').text(cardInit.description);

        //reset activity window button
        appUi.activityWin.title.val(cardInit.title);
        appUi.activityWin.desc.val(cardInit.description);

        //sharing
        appUi.activityWin.share.prop('checked', cardInit.share);
        /*  alert(selectedEl.find('[data-share]').attr('data-share'));
         if (appUi.activityWin.share.prop('checked') ===false) {
         optionPanel.init(cardInit.share);
     }*/

     changes.share = false;
     optionPanel.init(cardInit.share);

        //reset img
        appUi.activityWin.img.val("");

        //reset save
        if (!appUi.activityWin.saveBtn.hasClass('disabled'))
            appUi.activityWin.saveBtn.addClass('disabled');

    }


    function close() {
        toggleWin = actWin.attr('data-window');
        if (toggleWin === "open") {
            sideWin.velocity({
                translateZ: 0,
                width: "100%"
            }, {
                complete: function() {
                    currentEl.parents().eq(2).removeClass('selected');
                }
            }, speed, easingSmooth);
            actWin.velocity({
                translateX: "100%",
                translateZ: 0
            }, {
                begin: function() {


                },
                complete: function() {
                    actWin.attr('data-window', 'close');
                }
            },
            speed, easingSmooth);
        }
    }
});


// Dynamic Breadcumbs
function breadcumbs() {
    var breadcumbs = $('.breadcumbs');
    breadcumbs.addClass('fo-bold project-title');

    var url = document.location.pathname.substring(6); // get rid of view/
    url = url.substring(0, url.length - 5); // get rid of .aspx


    var pages = ['Shared', 'SharedDetails'];
    var menu = [
    { name: 'Marketshare', url: 'Shared.aspx' }
    ];

    var sep = ' > ';


    if (url == pages[0]) {
        breadcumbs.html(menu[0].name);
    } else if (url == pages[1]) {
        breadcumbs.html(makeUrl(0) + sep + $('[data-category-list]').text() + sep + $('[data-title]').text());
    }

    //Go to URL (ovveride prevent default)
    breadcumbs.on('click', 'a', function() {
        window.location = $(this).attr('href');
    });


    function makeUrl(index) {
        return ' <a href="/view/' + menu[index].url + '">' + menu[index].name + '</a>'
    }


}
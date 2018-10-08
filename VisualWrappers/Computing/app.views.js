"user strict";
//Define escape character
_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

// template string compilation example escaped with {{ }}
//var compiled = _.template('hello {{ user }}!');

var formTpl = {
  checkboxNumber: _.template(
    '<div class="row collapse prefix-radius">'+
    '<div class="small-3 columns">'+
    '<span class="prefix"><input type="checkbox" id="{{chkId}}" value="{{value}}" /></span>'+
    '</div>'+
    '<div class="small-9 columns">'+
    '<input type="number" id="{{numberId}}" >'+
    '</div>'+
    '</div>'
    ),

  materialInput: _.template(
    '<div class="material-input">' +
    '<input  class="{{classes}}" type="text" name="{{elementId}}" id="{{elementId}}" value="" required>' +
    '<span class="highlight"></span>' +
    '<span class="bar"></span>' +
    '<label for="{{elementId}}">{{label}}</label></div>'
    ),

  materialInputPermissions: _.template(
    '<div class="material-input">' +
    '<input  class="hide" type="text" name="{{elementId}}" id="{{elementId}}" value="" required>' +
    '<span class="highlight"></span>' +
    '<span class="bar"></span>' +
    '<label for="{{elementId}}">{{label}}</label></div>'
    ),

  inputDropdown: {
    type: _.template(
      '<div class="{{classes}}">' +
      '<select class="dropdwon-select-type">' +
      '<option value="Boolean">Boolean</option>' +
      '<option value="ByteArray">ByteArray</option>' +
      '<option value="Double">Double</option>' +
      '<option value="Float">Float</option>' +
      '<option value="Int8">Int8</option>' +
      '<option value="Int16">Int16</option>' +
      '<option value="Int32">Int32</option>' +
      '<option value="UInt8">UInt8</option>' +
      '<option value="UInt16">UInt16</option>' +
      '<option value="UInt32">UInt32</option>' +
      '<option value="UTF8String">UTF8String</option>' +
      "</select>" +
      '<div class=" button-wrapper">' +
      '<button tabindex="3" class="edit-cancel post-fix secondary tiny text-upper right"><i class="icon-cross icon"></i></button>' +
      '<button tabindex="2" class="edit-update pre-fix success tiny text-upper right"><i class="icon-check icon"></i></button>' +
      "</div></div>"
      ),

    commandTypeEdit: _.template(
      '<div class="{{classes}}">' +
      '<select class="dropdwon-select-type">' +
      '<option value="WRITE_BYTE">WRITE_BYTE</option>' +
      '<option value="READ_BYTE">READ_BYTE</option>' +
      '<option value="READ_USHORT">READ_USHORT</option>' +
      '<option value="WAIT_WHILE_BUSY">WAIT_WHILE_BUSY</option>' +
      '<option value="TOUCH_RESET">TOUCH_RESET</option>' +
      '<option value="TOUCH_BYTE">TOUCH_BYTE</option>' +
      '<option value="TOUCH_BIT">TOUCH_BIT</option>' +
      '<option value="RELEASE">RELEASE</option>' +
      "</select>" +
      '<div class=" button-wrapper">' +
      '<button tabindex="3" class="edit-cancel post-fix secondary tiny text-upper right"><i class="icon-cross icon"></i></button>' +
      '<button tabindex="2" class="edit-update pre-fix success tiny text-upper right"><i class="icon-check icon"></i></button>' +
      "</div></div>"
      )
  },

  addButton: _.template(
    '<button data-table="add-row" class="insert-row button primary radius text-upper text-bold tiny h-v-center">{{text}}</button>'
    ),

  addAttributes: _.template(
    '<a data-element-attributes="{{attributes}}" class="button tiny text-bold text-uppercase no-margin-all radius edit-attributes">Attributes</a>'
    ),

  edit: _.template(
    '<div class="{{classes}}" style="{{style}}">' +
    '<textarea rows="1" tabindex="1" class="textarea-edit" placeholder="{{placeholderText}}">{{text}}</textarea>' +
    '<div class=" button-wrapper">' +
    '<button tabindex="3" class="edit-cancel post-fix secondary tiny text-upper right"><i class="icon-cross icon"></i></button>' +
    '<button tabindex="2" class="edit-update pre-fix success tiny text-upper right"><i class="icon-check icon"></i></button>' +
    "</div></div>"
    ),

  editCode: _.template(
    '<div class="{{classes}}" style="{{style}}">' +
    '<div ><textarea  id="{{id}}"  rows="1" tabindex="1" class="textarea-edit" placeholder="{{text}}">{{text}}</textarea>' +
    "</div>" +
    '<div class=" button-wrapper">' +
    '<button tabindex="3" class="edit-cancel post-fix secondary tiny text-upper right"><i class="icon-cross icon"></i></button>' +
    '<button tabindex="2" class="edit-update pre-fix success tiny text-upper right"><i class="icon-check icon"></i></button>' +
    "</div></div>"
    )
};

var buttonsTpl = {
  btnCondition: _.template(
    '<a href="#" data-element-condition="{{condition}}" class="button tiny text-bold text-uppercase no-margin-all {{classes}}">{{text}}</a>'
    )
};

var graphTpl = {
  defaultChart: _.template(
    "<li " +
    'data-hash="{{hash}}"' +
    'data-row="{{row}}" ' +
    'data-col="{{col}}" ' +
    'data-sizex="{{sizeX}}"' +
    'data-sizey="{{sizeY}}"' +
    'data-type="{{type}}"' +
    'class="">' +
    '<div  class="card no-animation demo-data" id="container_{{graphId}}" >' +
    '<span class="left grip"><div class="gridicon"><div></div></div></span>' +
    '<div class="header-title" data-id="{{graphId}}">' +
    '<span class="widget-name" data-name="{{widgetName}}">{{defPropCheck}}</span>' +
    '<a data-tooltip aria-haspopup="true" class="icon-trash alert right has-tip" title="Delete entire widget" href="#"></a>' +
    '<a data-tooltip aria-haspopup="true" class="icon-cog right has-tip" href="#" title="Configure widget" data-id="{{graphId}}"></a> &nbsp;' +
    "</div>" +
    // vertical range
    //'<div class="range-slider vertical-range round" data-slider data-options="vertical: true;" style="position: absolute; height: 349px;">' +
    //'<span class="range-slider-handle" role="slider" tabindex="0"></span>' +
    //'<span class="range-slider-active-segment"></span>' +
    //'<input type="hidden">' +
    //  '</div>   ' +
    // end vertical range
    '<form class="hidden hide"></form>{{chartControllers}}' +
    '<div id="axis_div{{graphId}}" class="axis"></div>' +
    '<div id="legend_div{{graphId}}" class="legend-data"></div>' +
    '<div class="chart"><p id="choices{{graphId}}"></p>' +
    '<div id="axis_y_div{{graphId}}" class="axis_y"></div>' +
    '<div id="axis_x_{{graphId}}" class="axis_x"></div>' +
    '<div data-treshold id="threshold_{{graphId}}" style="opacity: 0">{{initTreshold}}</div>' +
    '<div id="div{{graphId}}" data-graph class="demo-placeholder load-graph {{graphContainerClasess}}" >' +
    "</div>" +
    '<div class="chart-slider" id="slider_div{{sliderId}}"></div>' +
    '<div class="loading-spinner"></div> </div>' +
    "</div></li>"
    ),

  thresholdSlider: _.template(
    '<div data-slider-ui data-value={{criticalValue}} style="{{style}}"></div>'
    /*+
                 '<div class="range-slider vertical-range round" data-slider data-options="vertical: true; initial: {{criticalValue}};" style="{{style}}">' +
                 '<span class="range-slider-handle" role="slider" tabindex="0"></span>' +
                 '<span class="range-slider-active-segment"></span>' +
                 '<input type="hidden">' +
                 '</div> '*/
                 //jquer ui
                 ),

  widget: _.template(
    "<li " +
    'data-hash="{{hash}}"' +
    'data-widget-id="{{graphId}}"' +
    'data-row="{{row}}" ' +
    'data-col="{{col}}" ' +
    'data-sizex="{{sizeX}}"' +
    'data-sizey="{{sizeY}}"' +
    'data-type="{{type}}"' +
    'data-minx="2" data-miny="2"' +
    'data-visualisation-type="{{visualisationType}}"' +
    'data-elements="{{widgetJsonElements}}"' +
    'class="">' +
    '<div  class="card no-animation demo-data" id="container_{{graphId}}" >' +
    '<span class="left grip">' +
    //'<i class="icon-check"></i>'+
    '<div class="gridicon"><div></div></div></span>' +
    '<div class="header-title" data-id="{{graphId}}">' +
    '<span class="widget-name" data-name="{{widgetName}}">{{widgetName}}</span>' +
    '<a data-tooltip aria-haspopup="true" class="icon-trash alert right has-tip" title="Delete entire widget" href="#"></a>' +
    '<a data-tooltip aria-haspopup="true" class="icon-cog right has-tip" href="#" title="Configure widget" data-id="{{graphId}}"></a> &nbsp;' +
    "</div>" +
    "{{visualisation}}" +
    "</div>" +
    "</div>" +
    "</li>"
    )
};

var visualisationsTpl = {
  controlButtons: _.template(
    '<div class="row collapse">' +
    '<div class="large-12 columns">' +
    '<div class="row collapse prefix-radius">' +
    '<div class="small-3 columns" >' +
    '<button class="button expand radius small prefix no-box-shadow" data-button="add-event-controller" data-element-id="{{elementId}}" data-template-id="{{templateId}}"> Add Event Controller</button>' +
    "</div>" +
    '<div class="small-3 columns">' +
    '<input class=" subscriber-event-label no-box-shadow no-border-all" type="text" style="border-radius: 0; border-color: #ffffff;" value="" placeholder="Button name" />' +
    "<span></span></div>" +
    '<div class="small-6 columns">' +
    '<input class="radius subscriber-event-val no-box-shadow no-border-all" type="text" value="" placeholder="Mqtt message" />' +
    "</div></div></div>" +
    "</div>" +
    '<div class="subscriber-event-list_{{elementId}} row" data-template-id="{{templateId}}" data-element-id="{{elementId}}" data-button-topic="{{topic}}">{{Buttons}}</div>'
    ),

  defaultCharts: _.template(
    '<form class="hidden hide"></form>{{chartControllers}}' +
    '<div id="axis_{{widgetId}}" class="axis"></div>' +
    '<div id="legend_{{widgetId}}" class="legend-data"></div>' +
    '<div class="chart">' +
    '<p class="hide" id="choices{{widgetId}}"></p>' +
    '<div id="axis_y_div{{widgetId}}" class="axis_y"></div>' +
    '<div id="axis_x_{{widgetId}}" class="axis_x"></div>' +
    '<div id="chart_{{widgetId}}" style="" data-graph class="rickshaw_graph {{graphContainerClasess}}" >' +
    "</div>" +
    '<div class="chart-slider" style="height: 48px;" id="slider_{{sliderId}}"></div>'
    )
};

var uiTpl = {
  dropdown: _.template(
    '<div class="no-padding text-center left">' +
    '<a class="button tiny radius text-bold text-upper no-margin-all" data-dropdown="{{dropdownId}}">{{buttonName}}</a>' +
    '<div  data-equalizer id="{{dropdownId}}" class="large f-dropdown content view-list permission-content row collapse " data-dropdown-content tabindex="-1" aria-hidden="true" aria-autoclose="false" tabindex="-1">' +
    "<i>Content is loading..</i>" +
    "</div>" +
    "</div>"
    )
};

var accessRightsTpl = {
  selectRole: _.template(
    '<div class="small-12 columns">' +
    '<table class="large-12 no-border-all">' +
    '<tr><td class="text-center"><input class="no-margin-all" data-roles="administrator" id="{{userRole}}_admin" type="checkbox" value="administrator" ></td><td><label for="{{userRole}}_admin">Administrator</label></td></tr>' +
    '<tr><td class="text-center"><input class="no-margin-all" data-roles type="checkbox" id="{{userRole}}_viewCreator" value="viewCreator" ></td><td> <label for="{{userRole}}_viewCreator">View Creator</label></td></tr>' +
    '<tr><td class="text-center"><input class="no-margin-all" data-roles type="checkbox" id="{{userRole}}_templateEditor" value="templateEditor" ></td><td><label for="{{userRole}}_templateEditor">Template Editor</label></td></tr>' +
    '<tr><td class="text-center"><input class="no-margin-all" data-roles type="checkbox" id="{{userRole}}_experienceEditor" value="experienceEditor" value="experienceEditor" ></td><td><label for="{{userRole}}_experienceEditor"> Experience Editor</label> </td></tr>' +
    '<tr><td class="text-center"><input class="no-margin-all" data-roles="user"          id="{{userRole}}_user" type="checkbox" value="user" ></td><td><label for="{{userRole}}_user">User</label></td></tr>' +
    "</table>" +
    '<div class="small-12 columns" style="padding: 0 15px">' +
    '<button class="save-template-role not-set button success round expand tiny text-upper fo-semibold">Set Role</button>' +
    "</div></div>"
    ),

  removeRole: _.template(
    '<div class="small-12 columns"><table class="large-12 no-border-all"><tr><th>Role(s)</th></tr><tr><td> {{userRole}}</td></tr></table></div>' +
    '<div class="small-12 columns" style="padding: 0 15px">' +
    '<button class="save-template-role revoke button alert tiny text-upper round expand  fo-semibold no-margin-all">Revoke</button>' +
    "</div>"
    )
};

var gatewayMngTpl = {
  gatewayRow: _.template(
    '<tr class="large-12" data-gateway="id@{{gatewayID}}">' +
    "<td >{{gatewayName}}</td>" +
    '<td width="180px" class="text-center"><button data-gateway="delete" class="button radius no-margin-all no-border-all tiny fo-bold text-uppercase alert">Delete</button> </td>' +
    "</tr>"
    )
};

var subscriberEventController = _.template(
  '<div class="columns large-6 end" data-controller-id="{{controllerId}}">' +
  '<div class="row collapse prefix-round"><div class="columns large-8">' +
  '<button class="button expand success radius small prefix" data-button="send-mqtt-subscriber" data-value="{{buttonText}}">{{buttonName}}</button>' +
  "</div>" +
  '<div class="columns large-2">' +
  '<span data-tooltip aria-haspopup="true" class="has-tip controller-tip" title="{{buttonText}}">' +
  '<i class="icon-eye"></i>' +
  "</span>" +
  "</div>" +
  '<div class="columns large-2">' +
  '<button class="button expand default radius  small secondary postfix" style="height: 32px;" data-button="delete-mqtt-subscriber"><i class="icon-cross icon"></i></button>' +
  "</div>" +
  " </div>" +
  "</div>"
  );

var debugTableTpl = {
  table: _.template(
    '<table id="table-{{tableName}}" class="{{cssClass}} large-12 display dataTable no-footer debug-table-copy">' +
    "<thead>" +
    "<tr>" +
    "<th>Column Name</th>" +
    "<th>Type</th>" +
    "</tr>" +
    "</thead>" +
    "<tbody>{{rows}}</tbody>" +
    "</table>"
    ),
  selectCasting: _.template(
    '<select data-debug="manual-casting" class="left large-1 no-border-all no-margin-all"  style="width:80px; height: 100%;">' +
    '<option value="string">string</option>' +
    '<option value="int32">int32</option>' +
    "</select>"
    ),
  noCasing: _.template(
    '&lt;id&gt;{{elementId}}.Tables["{{tableName}}"].Rows[0]["{{colName}}"]&lt;/id&gt;'
    ),
  withCasting: _.template(
    '&lt;id cast="{{castTo}}"&gt;{{elementId}}.Tables["{{tableName}}"].Rows[0]["{{colName}}"]&lt;/id&gt;'
    ),
  error: _.template(
    '<span class="property-name">Error: </span><span data-debug-error="{{error}}" class="property-value">' +
    '<i class="icon-warning-outline"></i>&nbsp;Show</span>'
    )
};

var experiencePanelTpl = {
  elements: _.template(
    '<li class="single-element">' +
    '<div class="card no-animation {{cssClass}}">' +
    '<h5 class="text-upper"> <small>Element Name</small></h5>' +
    "<h6>{{elementName}}</h6>" +
    "{{switchHtml}}" +
    '<div class="">' +
    '<div class="">' +
    '<span class="hide">view name: {{viewID}}</span>' +
    '<input type="hidden" class="radius" id="sel_{{templateID}}_{{elementID}}" val="{{type}}" />' +
    '<ul class="select-type no-bullet inline-list">' +
    '<li data-value="{{type}}" class="">{{type}}</li>' +
    "</ul>" +
    "</div></div></li>"
    )
};

var uiComponents = {
  grip: _.template(
    '<span class="left grip {{classes}}"><div class="gridicon"><div></div></div></span>'
    ),
  loader:
  '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="24px" height="30px" viewBox="0 0 24 30" style="enable-background:new 0 0 50 50;" xml:space="pserve">' +
  '<rect x="0" y="0" width="4" height="20" fill="#333">' +
  '<animate attributeName="opacity" attributeType="XML" values="1; .2; 1" begin="0s" dur="0.6s" repeatCount="indefinite"></animate>' +
  "</rect>" +
  '<rect x="7" y="0" width="4" height="20" fill="#333">' +
  '<animate attributeName="opacity" attributeType="XML" values="1; .2; 1" begin="0.2s" dur="0.6s" repeatCount="indefinite"></animate>' +
  "</rect>" +
  '<rect x="14" y="0" width="4" height="20" fill="#333">' +
  '<animate attributeName="opacity" attributeType="XML" values="1; .2; 1" begin="0.4s" dur="0.6s" repeatCount="indefinite"></animate>' +
  "</rect>" +
  "</svg>",

  listElement: _.template(
    '<li class="row separator collapse">' +
    '<div class="columns large-5"><strong>{{propName}}</strong></div>' +
    '<div class="columns text-right large-7"><span class="subheader fo-bold">{{propVal}}</span></div>' +
    "</li>"
    ),

    multiNotification: _.template(
        '<div data-multi-notification="{{id}}" style="z-index:9999; max-width: 280px" class="{{style}} notification-alert-box depth-1 radius panel-gateway-info" style="width:auto; ">' +
        '<i data-notification="icon" class="{{icon}}"></i>' +
        '<span class="text"><span class="notification-timestamp">{{timestamp}}</span><br/>{{text}}<br/> {{action}}</span>' +
      '<a href="#" class="close">&times;</a>' +
     
    "</div>" +
    "</div>"
    ),

  cards: {
    dashboard: _.template(
      "<li>" +
      '<div class="card depth-1 sh-black no-animation {{classes}}" data-card data-id="{{cardId}}" data-category="" data-tags="" data-img="" >' +
      '<span class="action-layer" data-workstation="open" > </span>' +
      '<div class="card-header">' +
      '<div class="card-menu tooltip-menu right" data-id="{{cardId}}"><i data-option class="icon  icon-ellipsis"></i></div>' +
      "<h3 data-title>{{title}}</h3>" +
      '<p class="time">Last updated<span class="">{{time}}</span></p>' +
      "</div>" +
      '<div class="card-body">' +
      '<div class="card-content">' +
      '<img src="../../../assets/img/dashboard-folder-icon.png">' +
      '<span class="description">' +
      '<br/><br/><span class="text-upper">Open <i class="icon-arrow-right"></i></span>  <br>{{description}}</span>' +
      "</div>" +
      '<div class="card-footer">' +
      '<div class="row">' +
      '<div class="large-12 columns">' +
      '<div class="row collapse postfix-radius">' +
      '<div class="small-12 columns">' +
      '<strong class="left">Views &nbsp;  </strong> <span class="">{{total}}</span>' +
      "</div>" +
      "</div></div></div>" +
      "</div>" +
      "</div>" +
      "</li>"
      ),
    experience: _.template(
      "<li>" +
      '<div class="card depth-1 sh-black no-animation {{classes}}" data-card data-id="{{cardId}}" data-category="" data-tags="" data-img="" >' +
      '<a href="ExperienceDetails.aspx?ExperienceID={{cardId}}" class="action-layer" > </a>' +
      '<div class="card-header">' +
      '<div class="card-menu right tooltip-menu" data-id="{{cardId}}" ><i data-option  class="icon  icon-ellipsis"></i></div>' +
      "<h3 data-title>{{title}}</h3>" +
      '<p class="time">Last updated<span class="">{{time}}</span></p>' +
      "</div>" +
      '<div class="card-body">' +
      '<div class="card-content">' +
      '<img src="../../../assets/img/experience-icon.png">' +
      '<span  class="description">' +
      '<br/><br/><span class="text-upper">Open <i class="icon-arrow-right"></i></span></span>' +
      "</div>" +
      '<div class="card-footer">' +
      '<div class="row">' +
      '<div class="large-12 columns">' +
      '<div class="row collapse postfix-radius">' +
      '<div class="small-12 columns">' +
      '<strong class="left">Widgets &nbsp;  </strong> <span class="">{{total}}</span>' +
      "</div>" +
      "</div></div></div>" +
      "</div>" +
      "</div>" +
      "</li>"
      )
  },
  toolboxEmptyProp: _.template(
    '<div data-alert="" class="message-box secondary radius ">Please select an element from the canvas.</div>'
    ),

  toolbooxElement: _.template(
    '<div class=" draggable container item ui-draggable  {{newEl}}  " data-has-result="{{hasResult}}" data-help="{{helpLink}}" ' +
    'data-component-on-canvas="{{elemName}}" draggable="true" data-item-id="{{itemId}}" id="{{elemId}}">' +
    '<div class="component {{isExperimental}}" data-name="{{dataName}}">' +
    '<img  id="img_{{elemName}}"  src="{{imgUrl}}"/>' +
    '<div id="divCaption_{{elemId}}"><small class="name"><span>{{elemName}}</span>' +
    '<a class="info-popup" href="#"><i class="icon-info"></i></a></small>' +
    '<a class="com-icon icon-ellipsis" href="#"></a></div>' +
    "{{experimentalHtml}}" +
    "</div>{{sideMenu}}</div>"
    ),
  elementExperimental: _.template(
    '<i class="fa fa-flask"  data-tooltip title="Experimental Element" aria-hidden="true"></i>'
    )
};

var modalsTpl = {
  widget: {
    elementList: _.template(
      '<li class="column large-12" >' +
      '<input data-element-template="{{templateId}}" data-element-id="{{elementId}}"' +
      'style="position: relative;top: -1px;" type="checkbox" class="inline left" id="{{templateId}}_{{elementId}}" />' +
      '<label for="{{templateId}}_{{elementId}}"  class="inline">{{elementName}}</label>' +
      '<span class="right hide" style="font-size: 14px; padding: 0.5rem 0;"><strong class="text-bold">Element ID: </strong>{{elementId}}</span>' +
      "</li>"
      )
  }
};

var edgeTpl = {
  dashboardCard: _.template(
    "<li>" +
    '<div class="card edge-card depth-1 sh-black blue no-animation {{classes}}"' +
    'data-card data-id="{{cardId}}" >' +
    '<a href="" data-panel="action-layer" class="action-layer" > </a>' +
    '<div class="card-header">' +
    '<div class="card-menu right tooltip-menu" data-id="{{cardId}}" ></div>' +
    "<h3 data-title>{{title}}</h3>" +
    '<p class="time">Last updated<span class="">...</span></p>' +
    "</div>" +
    '<div class="card-body">' +
    '<div class="card-content">' +
    '<img src="../../../assets/img/experience-icon.png">' +
    '<span  class="description">' +
    '<br/><br/><span class="text-upper">Open <i class="icon-arrow-right"></i></span></span>' +
    "</div>" +
    '<div class="card-footer">' +
    '<div class="row">' +
    '<div class="large-12 columns">' +
    '<div class="row collapse postfix-radius">' +
    '<div class="small-12 columns">' +
    '<strong class="left">Number of edges: &nbsp;  </strong> <span class="">{{total}}</span>' +
    "</div>" +
    "</div></div></div>" +
    "</div>" +
    "</div></div>" +
    '<div style="opacity:0; left:0px; display:none"  class="expand-edges">' +
    '<h5>Edges <a class="close icon-cross right" href="#"></a></h5>' +
    '<ul class="edge-list no-bullet">{{edgeList}}</ul>' +
    "</div>" +
    "</li>"
    ),

  edgeElements: _.template(
    `<li style="float:left;"><div class="component" data-name="webserver">
    <img id="img_WebServer" src="/Images/toolbox/WebServer.png">
    <div id="">
    <span>{{edgeName}}</span><br/>
    <a data-panel="close" class ="link text-upper" href="{{url}}">
    Open</a>
    </div></div></li>`
    ),

  edgeAccordion: _.template(
    '<h3 class="" data-template-id-name="{{templateId}}">{{templateName}} <i style="display:none" class="right fa fa-cog fa-spin fa-fw"></i></h3>' +
    '<div class="edge-accordion-content" data-template-id-load="{{templateId}}" data-loaded="false">' +
    '<ul class="list bg-white small-block-grid-2 text-center"></ul></div>'
    ),

  edgeElement: _.template(
    '<div class=" draggable container item ui-draggable " ' +
    'data-component-on-canvas="{{elemName}}" draggable="true" data-item-id="{{itemId}}" id="{{elemId}}">' +
    '<div class="component">' +
    '<img  id="img_{{elemName}}"  src="{{imgUrl}}"/>' +
    '<div id="divCaption_{{elemId}}"><small class="name"><span>{{elemName}}</span>' +
    '<a class="info-popup" href="#"><i class="icon-info"></i></a></small>' +
    '<a class="com-icon icon-ellipsis" href="#"></a>' +
    "</div>"
    ),

  nodeTable: _.template(
    '<table class="node-table" width="100%" role="grid">' +
    "<thead>" +
    "<tr>" +
    '<th width="150">Nodes</th>' +
    "<th> </th>" +
    //'<th width="150">Data Dependency</th>' +
    //'<th width="48">Tabular</th>' +
    "</tr>" +
    "</thead>" +
    '<tbody class="table-body">' +
    "{{tableRows}}" +
    "</tbody>" +
    "</table>"
    ),

  nodeTableRow_0: _.template(
    '<tr data-node-id="{{elementId}}">' +
    '<td class="">{{elementName}}' +
    '<ul class="node-table-buttons button-group round">' +
    '<li><a href="#" data-node="remove-node" style="height: 34px;' +
    'top: 1px;" class="button tiny alert"><i style="font-size:12px; color:rgba(255,255,255,.87)" class="icon-trash"></i> </a></li>' +
    '<li><a href="#" data-node="update-node" class="button tiny success"> Save</a></li>' +
    '<li><a href="#" data-node="edit-node" class="button tiny"> Edit</a></li>' +
    "</ul>" +
    "</td>" +
    '<td><input data-property="JSONpath" type="text" value="{{jsonPath}}"></td>' +
    '<td><input data-property="nodeDependency" value="{{nodeDependency}}" type="text"></td>' +
    '<td class="text-align-center"><input data-property="isTabular" type="checkbox" {{isTabular}}></td>' +
    "</tr>"
    ),

  nodeTableRow: _.template(
    '<tr data-node-id="{{elementId}}">' +
    '<td >{{elementName}}</td>' +
    '<td>'+
    '<a href="#" data-node="edit-node" class="button radius text-upper secondary tiny right text-bold">Edit</a>'+
    '<a href="#" data-node="remove-node" class="button link alert right"><i class="icon-trash"></i> </a>' +
    //'<li><a href="#" data-node="update-node" class="button tiny success"> Save</a></li>' +
    '</td>' +
    "</tr>"
    ),

  edgeWidget: _.template(
    '<li class="new"' +
    'data-col="{{col}}" data-row="{{row}}" data-sizex="{{sizeX}}" data-sizey="{{sizeY}}"' +
    'data-widget-uiid="{{uiid}}">' +
    '<div class="edge-header-title" >' +
    '<span class="widget-name" data-name="{{widgetName}}">{{widgetName}}<i class="icon-write"></i></span>' +
    '<span><select>{{graphType}}</select></span>' +
    '<a class="right remove-widget icon-trash" href="#"></a>' +
    //'<a class="icon-trash alert right has-tip" title= "Delete entire widget" href= "#" ></a >'+
    //'<a class="icon-cog right has-tip" href= "#" ></a ></div > '+
    '</div>' +
    '<div class="widget-container {{isWidgetDroppable}} {{widgetGraphType}}"><div class="drop-here"><span>Drop here</span></div>{{nodeContent}}</div>' +
    '</li>'
    ),

  widgetElementTable: _.template()
};

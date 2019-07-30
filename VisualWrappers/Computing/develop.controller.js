
// MAIN jsPlumb code
// ***********************START EVENT HANDLERS*******************************//

/*
 * Develop Event Controller
 */

var developController = {
    /**
       * Save current view template
       */
    templateSaveView: function() {
      var _self = this;
      miniLoader.show();
  
      if (appUi.hdnCurntTplId.value === "") {
        alert(lang.en.selectTemplate);
        return;
      }
  
      var objList = [],
        duplicateNodeNames = [],
        nodeNames = [];
  
      $.each(endpoints, function(key, value) {
        var trueConnection = "",
          falseConnection = "",
          iLeft = 0,
          iTop = 0;
  
        if (value[POS_ELEMENT_STATUS] === "D") {
          value[POS_ELEMENT_PROPERTIES] = null;
        }
  
        for (var i = 0; i < value[POS_TRUE_ENDPOINT].connections.length; i++) {
          trueConnection =
            trueConnection +
            value[POS_TRUE_ENDPOINT].connections[i].targetId +
            ",";
        }
  
        if (value[POS_FALSE_ENDPOINT] != null) {
          for (var i = 0; i < value[POS_FALSE_ENDPOINT].connections.length; i++) {
            falseConnection =
              falseConnection +
              value[POS_FALSE_ENDPOINT].connections[i].targetId +
              ",";
          }
        }
  
        if (document.getElementById(key) != null) {
          iLeft = document.getElementById(key).offsetLeft;
          iTop = document.getElementById(key).offsetTop;
        }
  
        /* if (value[POS_ELEMENT_STATUS] != 'D' ||
               (value[POS_ELEMENT_STATUS] == 'N' && _.isNull(value[POS_ELEMENT_PROPERTIES]))) {
               nodeNames.push(value[4]);
               duplicateNodeNames.push(value[4]);
               }*/
  
        if (
          !_.isNull(value[POS_ELEMENT_PROPERTIES]) ||
          value[POS_ELEMENT_STATUS] !== "D"
        ) {
          nodeNames.push(value[4]);
          duplicateNodeNames.push(value[4]);
        }
  
        if (_.isNull(value[POS_ELEMENT_PROPERTIES])) {
          nodeNames = _.remove(nodeNames, function(n) {
            return n !== value[POS_ELEMENT_NAME];
          });
  
          duplicateNodeNames = _.remove(duplicateNodeNames, function(n) {
            return n !== value[POS_ELEMENT_NAME];
          });
        }
  
        console.log(duplicateNodeNames);
  
        // update dom element
        $("#" + key).attr("data-component-on-canvas", value[POS_ELEMENT_NAME]);
  
        var element = new ElementClass(
          key,
          value[POS_ELEMENT_NAME],
          trueConnection,
          falseConnection,
          value[POS_ELEMENT_TYPE],
          iTop,
          iLeft,
          value[POS_ELEMENT_STATUS],
          value[POS_ELEMENT_PROPERTIES],
          value[POS_ELEMENT_OPERATOR],
          value[POS_ELEMENT_SOCKET],
          value[POS_ELEMENT_PIN],
          value[POS_ELEMENT_TAG],
          value[POS_ELEMENT_DEBUG],
          value[POS_ELEMENT_VERSION],
          value[POS_ELEMENT_UNREGISTER_EVENT]
        );
  
        objList.push(element);
      });
  
      // Group by Same names
      duplicateNodeNames = _.groupBy(duplicateNodeNames, function(n) {
        return n;
      });
  
      // Filter out Same names
      duplicateNodeNames = _.uniq(
        _.flatten(
          _.filter(duplicateNodeNames, function(n) {
            return n.length > 1;
          })
        )
      );
  
      // First Check for duplicates in the current View
      if (duplicateNodeNames.length > 0) {
        // Show error
        _self.markDuplicateNodes(duplicateNodeNames);
        return;
      }
  
      // Second Check for duplicate in different views
      if (duplicateNodeNames.length === 0) {
        JSON_byData(
          "Layout.aspx/GetTemplateElements",
          JSON.stringify({ TemplateID: getUrlParameter("TemplateID") })
        ).done(function(data) {
          data = JSON.parse(data.d);
          var duplicateNewNames = [];
  
          if (togCon) {
            console.table(data);
          }
  
          $.each(nodeNames, function(i, name) {
            $.each(data, function(j, obj) {
              if (
                name === obj.ElementName &&
                sessionStorage.currentViewID !== obj.ViewID
              ) {
                duplicateNewNames.push({
                  node: obj.ElementName,
                  view: obj.ViewID
                });
              }
            });
          });
  
          if (duplicateNewNames.length === 0) {
            // Save without duplicated names
  
            var h = {};
            h[
              getUrlParameter("TemplateID") +
                "^" +
                sessionStorage.getItem("currentViewID")
            ] = objList;
  
            JSON_byData(
              "Layout.aspx/SaveElements",
              "{'data':'" + JSON.stringify(h) + "'}"
            ).done(function(data) {
              $("#draw-canvas")
                .find("[data-component-on-canvas] > div")
                .removeClass("check-same-element");
              _self.elementSave(data);
  
              $.each(endpoints, function(key, value) {
                // After deleting from database, delete also from client model
                if (
                  _.isNull(value[POS_ELEMENT_PROPERTIES]) ||
                  value[POS_ELEMENT_STATUS] === "D"
                ) {
                  delete endpoints[key.toString()];
                  console.log("Deleted element: " + key.toString());
                }
  
                // After inserting element update status, from I to N, I = insert, New properties
                if (value[POS_ELEMENT_STATUS] === "I") {
                  value[POS_ELEMENT_STATUS] = "N";
                }
              });
  
              miniLoader.hide();
              console.log(data.d);
            });
          } else {
            _self.markDuplicateNodes(duplicateNewNames);
          }
        });
      }
    },
  
    markDuplicateNodes: function(duplicateNodes) {
      var isObject = false;
      if (_.isObject(duplicateNodes[0])) {
        isObject = true;
      }
  
      // (isObject) ? el.node +'in view: '+ el.view : el
  
      $("#draw-canvas")
        .find("[data-component-on-canvas] > div")
        .removeClass("check-same-element");
      $.each(duplicateNodes, function(i, el) {
        var stringError = "";
        if (isObject) {
          stringError =
            " node name " +
            el.node +
            ", in view " +
            "<span class='label alert round'>" +
            el.view +
            "</span>";
        } else {
          stringError = el;
        }
  
        $("#draw-canvas")
          .find('[data-component-on-canvas="' + el + '"] > div')
          .addClass("check-same-element");
  
        var consoleHtml =
          '<pre class="red-text highlight"><i class="icon-warning-outline" style="position: relative; left: -5px">' +
          "</i>You can't save nodes with same names from different views:" +
          "<strong>" +
          stringError +
          "</strong></pre>";
  
        appUi.debugPanel
          .prepend(consoleHtml)
          .delay(50)
          .queue(function() {
            $(this)
              .dequeue()
              .children("pre")
              .removeClass("highlight");
          });
  
        console.log(el);
        miniLoader.hide();
  
        if (appUi.developConsole.attr("data-open") === "false") {
          $('[data-controller="minimize-panel"]').trigger("click");
          appUi.developConsole.attr("data-open", true);
        }
      });
    },
  
    /**
       * Delete view of template
       * @param viewName
       */
    templateDeleteView: function(viewName) {
      JSON_byData(
        "Layout.aspx/DeleteTemplateView",
        JSON.stringify({
          TemplateID: getUrlParameter("TemplateID"),
          ViewName: viewName
        })
      ).done(function(data) {
        console.log(data);
        data = data.d;
  
        // Check: if all view are deleted redirect to dashboard page
        if (data !== "_EMPTY_") {
          // Set new view in session
          sessionStorage.setItem("currentViewID", data);
          appUi.selectedViews.val(sessionStorage.getItem("currentViewID"));
  
          // Load all elements of this view
          JSON_byData(
            "Layout.aspx/GetElements",
            JSON.stringify({
              TemplateID: getUrlParameter("TemplateID"),
              ViewName: data
            })
          ).done(function(data) {
            fGetElementsCallback(data.d);
          });
        } else {
          window.location = "Dashboard.aspx";
        }
      });
  
      console.log("Deleted view: " + viewName);
    },
    /**
       * Add new Element to view from element toolbox on drop event
       * @param ItemID
       * @param ImagePath
       * @param HtmlTemplate
       * @param DefaultTitle
       * @param HasFalseConnection
       * @param CurrentVersion
       * @param pos_x
       * @param pos_y
       * @param isExperimental
       * @param hasResult
       * @param newEl
       */
    elementCreateOnView: function(
      ItemID,
      ImagePath,
      HtmlTemplate,
      DefaultTitle,
      HasFalseConnection,
      CurrentVersion,
      pos_x,
      pos_y,
      isExperimental,
      hasResult,
      newEl
    ) {
      var left,
        top,
        _self = this,
        g = NewGuid();
  
      if (
        (pos_x === undefined || pos_x === "") &&
        (pos_y === undefined || pos_y === "")
      ) {
        left = "";
        top = "";
      } else {
        left = pos_x;
        top = pos_y;
      }
  
      activeNode = g;
      _self.elementSetOnView(
        g,
        DefaultTitle,
        left,
        top,
        ItemID,
        "I",
        {},
        ImagePath,
        HtmlTemplate,
        "||",
        "",
        "",
        "",
        "0",
        "500",
        "500",
        HasFalseConnection,
        false,
        CurrentVersion,
        0,
        "",
        "",
        isExperimental,
        hasResult,
        newEl + " active-element"
      );
  
      developController.elementPropToolbox(g);
      $(document).foundation("tooltip", "reflow");
    },
    /**
       * Set element on view from databatase
       * @param ElementID
       * @param ElementName
       * @param Left
       * @param Top
       * @param ItemID
       * @param Status
       * @param ElementProperties
       * @param ImagePath
       * @param HtmlTemplate
       * @param Operator
       * @param Socket
       * @param Pin
       * @param Tag
       * @param Debug
       * @param HtmlTemplateWidth
       * @param HtmlTemplateHeight
       * @param HasFalseConnection
       * @param IsNewVersionAvailable
       * @param CurrentVersion
       * @param UnregisterEvent
       * @param helpLink
       * @param isBeta
       * @param isExperimental
       * @param hasResult
       * @param newEl
       */
    elementSetOnView: function(
      ElementID,
      ElementName,
      Left,
      Top,
      ItemID,
      Status,
      ElementProperties,
      ImagePath,
      HtmlTemplate,
      Operator,
      Socket,
      Pin,
      Tag,
      Debug,
      HtmlTemplateWidth,
      HtmlTemplateHeight,
      HasFalseConnection,
      IsNewVersionAvailable,
      CurrentVersion,
      UnregisterEvent,
      helpLink,
      isBeta,
      isExperimental,
      hasResult,
      newEl
    ) {
      var myDiv = uiComponents.toolbooxElement({
        helpLink: helpLink,
        elemName: ElementName,
        elemId: ElementID,
        imgUrl: ImagePath,
        dataName: stringFn.rmSpace(ElementName).toLowerCase(),
        sideMenu: htmlGener.compSideMenu(Debug, ElementID),
        isExperimental: isExperimental ? "experimental-element" : "",
        experimentalHtml: isExperimental
          ? uiComponents.elementExperimental()
          : "",
        itemId: ItemID,
        hasResult: hasResult,
        newEl: newEl || ""
      });
  
      $('#draw-canvas').append(
        $(myDiv)
          .addClass("window")
          .css({
            left: Left + "px",
            top: Top + "px",
            position: "absolute"
          })
      );
  
      var falseEndpintOrNull;
      if (HasFalseConnection) {
        falseEndpintOrNull = instance.addEndpoint(ElementID, FalseEndpoint, {
          anchor: falseAnchors
        });
      }
      
      endpoints[ElementID] = [
        instance.addEndpoint(ElementID, TrueEndpoint, { anchor: trueAnchors }),
        falseEndpintOrNull,
        instance.addEndpoint(ElementID, InputEndpoint, { anchor: "Left" }),
        ElementID,
        ElementName,
        ItemID,
        Status,
        ElementProperties,
        ImagePath,
        HtmlTemplate,
        Operator,
        Socket,
        Pin,
        Tag,
        Debug,
        HtmlTemplateWidth,
        HtmlTemplateHeight,
        CurrentVersion,
        UnregisterEvent
      ];
  
      instance.draggable(jsPlumb.getSelector(".pane-content .window"), {
        containment: "parent",
        option: "stack",
        stack: ".window",
        delay: 100,
        start: function(el, ui) {
          $(el.el)
            .addClass("active-element")
            .siblings()
            .removeClass("active-element");
          $(el.el)
            .children(".component")
            .velocity(
              {
                scaleX: 1.12,
                scaleY: 1.12
              },
              { duration: 166 }
            );
          //$(el.el).children().css({ background:'red'});
        },
        stop: function(el) {
          $(el.el)
            .children(".component")
            .velocity(
              {
                scaleX: 1,
                scaleY: 1
              },
              {
                //   easing: "spring"
                duration: 166
              }
            );
        }
      });
  
      myDiv = null;
    },
    /**
       * Save all element data
       * @param data
       */
    elementSave: function(data) {
      var chatMsg = new Paho.MQTT.Message(
        JSON.stringify({
          userName: JSON.parse(sessionStorage.getItem("userData")).userName
        })
      );
      chatMsg.destinationName =
        "/" +
        getUrlParameter("TemplateID") +
        "/" +
        sessionStorage.getItem("currentViewID") +
        "/refreshElements";
      zenClient.send(chatMsg);
    },
    /**
       *  Delete single element from canvas
       */
    elementDelete: function() {
      var id = currentEl.val(),
        name = $("#" + id)
          .find(".name")
          .text();
  
      instance.detachAllConnections(id);
      instance.removeAllEndpoints(id);
      endpoints[id][POS_ELEMENT_STATUS] = "D";
      //delete endpoints[id];
      $("#" + id + "").remove();
      //currentEl.val('');
  
      /*
           allNodeNames = _.remove(allNodeNames, function (n) {
           return n != name;
           });*/
    },
    /**
       *  Load property of element in left panel
       * @param elementID
       */
    elementPropToolbox: function(elementID) {
      var propHelp = $("#element-property-help"),
        element = $("#" + elementID),
        helpLink = element.data("help");
  
      console.log(element);
      propHelp.addClass("hide");
  
      if (typeof helpLink !== "undefined") {
        propHelp.removeClass("hide").attr("href", helpLink);
      }
  
      if (
        typeof SaveProperties === "function" &&
        typeof endpoints[currentEl.val()] !== "undefined"
      ) {
        SaveProperties();
      }
  
      if (elementID === "") {
        elementID = currentEl.val();
      } else {
        currentEl.val(elementID);
      }
  
      // Load html into left content
      $("#divPropertiesDialog")
        .load(endpoints[elementID][POS_ELEMENT_HTML_TEMPLATE], function() {
          if (element.data("has-result")) {
            $("#dialog-form")
              .children("p")
              .append(
                '<a data-element-result href="#' +
                  element.data("item-id") +
                  "&" +
                  element.data("component-on-canvas") +
                  '" class="right icon-eye"></a>'
              );
          }
        })
        .hide()
        .fadeIn();
    }
  };
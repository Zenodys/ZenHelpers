// Helpers Function
function NewGuid() {
    //graphic user interface unique ID generator
    var d = new Date().getTime();
    var uuid = "xxxxxxxx".replace(/[xy]/g, function(c) {
      var r = ((d + Math.random() * 1) % 4) | 0;
      d = Math.floor(d / 4);
      return (c == "x" ? r : (r & 0x7) | 0x8).toString(16);
    });
    return uuid;
  }
  
  function EncodeScriptArray(inputString) {
    var outputString = "";
    var found = false;
    for (var i = 0, len = inputString.length; i < len; i++) {
      if (inputString[i] == "[") outputString += "_";
      else if (inputString[i] == "]") outputString += "";
      else outputString += inputString[i];
    }
  
    while (outputString.indexOf(" _") !== -1)
      outputString = outputString.replace(" _", "_");
  
    while (outputString.indexOf("_ ") !== -1)
      outputString = outputString.replace("_ ", "_");
  
    return outputString;
  }
  
  function DecodeScriptArray(inputString) {
    var outputString = "";
    var found = false;
    for (var i = 0, len = inputString.length; i < len; i++) {
      if (found) {
        if (!isNaN(inputString[i])) {
          outputString += inputString[i];
        } else {
          outputString += "]";
          i--;
          found = false;
        }
      } else if (inputString[i] == "_") {
        outputString += " [";
        found = true;
      } else outputString += inputString[i];
    }
    return outputString;
  }
  
  function getUrlParameter(name) {
    var searchString = window.location.search.substring(1),
    params = searchString.split("&"),
    hash = {};
  
    if (searchString == "") return "";
    for (var i = 0; i < params.length; i++) {
      var val = params[i].split("=");
      hash[unescape(val[0])] = unescape(val[1]);
    }
    return hash[name];
  }
  /**
   * Generic AJAX function
   * @param pageName
   * @param functionName
   * @param mydata
   * @param pFunction
   * @param DoShowProgressAnimation
   * @constructor
   */
   function AjaxCallGeneric(
    pageName,
    functionName,
    mydata,
    pFunction,
    DoShowProgressAnimation
    ) {
    if (DoShowProgressAnimation) ShowProgressAnimation();
  
    $.ajax({
      type: "POST",
      url: pageName + "/" + functionName,
      cache: true,
      data: mydata,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(msg) {
        if (msg.d && pFunction != null) pFunction(msg.d);
        //else
        CloseProgressAnimation();
      },
      error: function(xhr, errorType, exception) {
        var errorMessage = exception || xhr.statusText;
        alert("There was an error  : " + errorMessage);
      }
    });
  }
  
  function ShowProgressAnimation() {
    if (window.location.href.indexOf("Layout.aspx") > -1) {
    } else {
      appUi.loadingDiv.filter(":not(:animated)").fadeIn();
    }
  }
  
  function CloseProgressAnimation() {
    appUi.loadingDiv.fadeOut();
  }
  
  var beforeClose;
  var $dialog = {
    //Params: Width, Height, Dialog ID, url to load, Title, array button [{... }, {...}]
    init: function(w, h, id, url, title, btns) {
      var allBtn = [];
  
      if (typeof btns !== "undefined") {
        for (var i = 0; i < btns.length; i++) {
          allBtn.push(btns[i]);
        }
      }
      //Add close button to the end
      allBtn.push({
        text: lang[l].close,
        id: "dialog-close-btn",
        class: "fo-bold text-uppercase button small secondary radius",
        click: function() {
          if (typeof CloseDataTableCallback == "function")
            CloseDataTableCallback();
  
          $(this).dialog("close");
        }
      });
  
      var $dialog = $(id).dialog({
        modal: true,
        position: {
          my: "center",
          at: "top+128",
          of: window},
          closeText: "",
        //classes: "",
        open: function() {
          var $this = $(this);
          $(".ui-dialog-buttonset")
          .children("button")
          .removeClass(
           "ui-button ui-widget ui-state-default ui-state-active ui-state-focus ui-corner-all ui-button-text-only"
           );
  
          //$this.closest('.ui-dialog').find('.ui-dialog-titlebar-close');
          $this
          .closest(".ui-dialog")
          .find(".ui-dialog-title")
          .append(uiComponents.grip({ classes: "modal" }));
  
          //appConsole(togCon, 'Dialog loaded from:' + url);
          $this.parent().promise().done(function() {
            $.ajax({
              type: "GET",
              url: url,
              dataType: "html"
            }).done(function(data) {
              $this.html(data);
  
              if ($(".hide-loading").length > 0) {
                setTimeout(function() {
                  $(".hide-loading").velocity("transition.fadeOut", {
                    duration: 500
                  });
                }, 500);
              }
            });
          });
        },
        resizable: false,
        draggable: true,
        height: h,
        width: w,
        title: function() {
          if (title === "" || typeof title == "undefined") {
            return $(this).load(url + " .ui-modalbox-title");
          } else return title;
        },
        buttons: allBtn,
        close: function(event, ui) {
          if (typeof CloseDataTableCallback == "function")
            CloseDataTableCallback();
  
          if (url == "/Files/Experience/experienceDetails.html") {
            ClearIntervals();
          }
          $(this).dialog("close");
          $(this).html("");
          $(this).dialog("destroy");
        },
        show: {
          effect: "fade",
          duration: 250
        },
        hide: {
          effect: "fade",
          duration: 250
        }
      });
  
      return false;
    },
    /**
       *
       * @param id Modal ID
       * @param title Confirm title.
       * @param content
       * @param confirmFn
       * @param fnAtrr
       * @returns {*|jQuery}
       */
       confirm: function(id, title, content, confirmFn, fnAtrr, settings) {
        var defaultSet = {
          buttonText:
          typeof settings == typeof undefined ? "Delete" : settings.buttonText,
          buttonClass:
          typeof settings == typeof undefined ? "alert" : settings.buttonClass
        },
        $buttons = [];
  
        if (confirmFn !== "") {
          $buttons = [
          {
            text: defaultSet.buttonText,
            closeText: "",
            class:
            "fo-bold text-uppercase button small " + defaultSet.buttonClass,
            click: function() {
              if (
                typeof confirmFn !== typeof undefined &&
                typeof fnAtrr !== typeof undefined
                ) {
                confirmFn(fnAtrr);
            } else if (
             typeof confirmFn !== typeof undefined &&
             typeof fnAtrr === typeof undefined
             ) {
              confirmFn();
            }
            $(this).dialog("close");
          }
        },
        {
          text: "No",
          class: "fo-bold text-uppercase button small secondary",
          click: function() {
            $(this).dialog("close").dialog("destroy").remove();
            return false;
          }
        }
        ];
      } else {
        $buttons = [
        {
          text: "Close",
          style: "width: 100%",
          class: "fo-bold text-uppercase button small secondary large-12",
          click: function() {
            $(this).dialog("close").dialog("destroy").remove();
            return false;
          }
        }
        ];
      }
  
      var $dialog = $(id).dialog({
        resizable: false,
        closeText: "",
        draggable: false,
        open: function() {
          var $this = $(this);
  
          $this.parent().addClass("confirm-dialog");
          $this.parent().offset({
            top: 56
          });
  
          $this.css({
            padding: "1rem 0"
          });
  
          $this.html(
           '<div class="row"><div class="column large-12 text-center">' +
           content +
           "</div></div>"
           );
          $(".ui-dialog-buttonset")
          .children("button")
          .removeClass(
           "ui-button ui-widget ui-state-default ui-state-active ui-state-focus ui-corner-all ui-button-text-only"
           );
        },
        modal: true,
        load: "",
        title: title,
        height: "auto",
        width: 500,
        buttons: $buttons
      });
      return $dialog;
    }
  };
  
  /** @name dialgoButtons
   *  @param {string} a Action button text.
   *  @param {string} b Action button custom classes
   *  @param {string} c Button id to bind
   *  @param {function} f Cunction to call
   *  @param {boolean} bool dialog close on click or not
   *  @returns {array}
   */
   var dialogButtons = function(a, b, c, f, bool) {
    return [
    {
      text: a,
      class: function() {
        if (b === "" || typeof b === typeof undefined) {
          return (b = "fo-bold text-uppercase button small success radius");
        } else {
          return b;
        }
      },
      id: c,
      click: function() {
        if (typeof f == "function") {
          f();
        }
  
        if (typeof bool == typeof undefined || bool == true) {
          $(this).dialog("close");
        } else if (bool == false) {
          return;
        }
      }
    }
    ];
  };
  
  //* TO DO merge showDialogHelper with ShowNonModalDialogHelper
  /**
   *
   * @param width
   * @param height
   * @param containerId
   * @param fileName
   * @param title
   * @param btns
   * @constructor
   */
   function ShowDialogHelper(width, height, containerId, fileName, title, btns) {
    if (title === "" || title === undefined) {
      title = "No title: " + fileName;
    }
  
    var appDialog = $dialog.init(
     width,
     height,
     containerId,
     fileName,
     title,
     btns
     );
  }
  
  function ShowNonModalDialogHelper(width, height, containerId, fileName) {
    var appDialog = $dialog.init(width, height, containerId, fileName, title);
    console.log(appDialog);
    return appDialog;
  }
  /**
   * TO FINISH!!
   * @type {{initCommand: Function}}
   */
   var dataTableHelper = {
    /**
       *
       * @param table
       * @param tableCols
       * @param buffer
       * @param split use "/" for oneWire, "!" for I2C
       */
       initCommand: function(table, tableCols, buffer, split) {
        var oTable;
        var columnTitle = [],
        column = [];
  
        for (var i = 0; i < tableCols.length; i++) {
          columnTitle[i] = {
            title: tableCols[i]
          };
  
          column[i] = {
            width: String(Math.round(tableCols.length - 1 / 4)) + "%",
            targets: [i],
            visible: true,
            searchable: false,
            sortable: false
          };
        }
        columnTitle.push({
          title: "Remove"
        });
  
        column.push({
          className: "text-center",
          sDefaultContent: "<a href='#' class='remove-row icon-trash'></strong>",
          width: "16.66667%",
          targets: [tableCols + 1],
          visible: true,
          searchable: false,
          sortable: false
        });
  
        oTable = $(table).DataTable({
          paging: false,
          ordering: false,
          info: false,
          sDom: "rt",
          columns: columnTitle,
          bSort: false,
          columnsDefs: column
        });
  
        var arrOuter = [];
  
        $.each($(buffer).val().split(split), function(index, date) {
          var commandRow = date.split("*");
          var arr = [];
          if (commandRow.length == tableCols.length) {
            arr.push(commandRow[0], commandRow[1], commandRow[2]);
            arrOuter.push(arr);
          }
        });
  
        if (arrOuter.length > 0) this.fillTable($(table), arrOuter);
      },
      fillTable: function(table, data) {
        table.dataTable().fnClearTable();
        table.dataTable().fnAddData(data);
        table.dataTable().fnDraw();
      },
      clearOnclose: function(table) {
        $(".ui-dialog").on("dialogclose", function() {
          table.destroy();
        });
      },
      removeRow: function(table, callback) {
        $(".command-table-wrapper table").on("click", ".remove-row", function(e) {
          e.preventDefault();
          e.stopPropagation();
          table.row($(this).parents("tr")).remove().draw();
          if (callback && typeof callback === "function") {
            callback();
          }
        });
      },
  
      editRow: function(options) {
        options = options || {};
  
  
        var _self = this,
        input = {
          element:$("#ElementToExecute"),
          order:  $("#Order")
        },
        $addRowBtn = $('[data-table="add-row"]');
  
  
      // Added for context broker patch
      if(!_.isUndefined(options.inputs)){
        if (options.inputs.length > 0) {
          input = {
            element: $("#"+options.inputs[0]),
            order: $("#" + options.inputs[1])
          }
        }
      }
  
      _self.isEditing = false;
   
      input.element.keydown(function(e) {
        if (_self.isEditing) {
          e.preventDefault();
        }
      });
  
  
      // Read row
      $(options.table).on("click", "tr", function(e) {
        e.stopImmediatePropagation();
  
        var $row = $(this);
  
        // if row not selected
        if (!$row.hasClass("opened")) {
          globalCodeEditor.updateOptions({ readOnly: true });
  
          if (!$row.hasClass("disabled") && _self.isEditing == false) {
            $row.addClass("opened").siblings().removeClass("opened");
            $row
            .css({ background: "#F9F9F9" })
            .siblings()
            .css({ background: "transparent" });
  
            if ($row.hasClass("opened") == true) {
              input.element.val($row.find("[data-element]").text());
              input.order.val($row.find("[data-order]").text());
              globalCodeEditor.setValue(
                $row
                .find("[data-element-condition]")
                .attr("data-element-condition")
                );
            }
          }
        } else if (_self.isEditing === false) {
          globalCodeEditor.updateOptions({ readOnly: false });
  
          $row.removeClass("opened");
          $row.css({ background: "transparent" });
  
          input.element.val("");
          input.order.val("");
          globalCodeEditor.setValue("");
        }
      });
  
      // Edit function
      $(options.table).on("click", options.listener, function(e) {
        e.stopImmediatePropagation();
  
        globalCodeEditor.updateOptions({ readOnly: false });
  
        if (!$(this).hasClass("disabled")) {
          var $this = $(this),
          $row = $this.parents("tr");
  
          //assign active row to outer scope
          _self.button = $this;
          _self.row = $row;
          _self.isEditing = true;
  
          if ($row.hasClass("opened") == false) {
            input.element.val($row.find("[data-element]").text());
            input.order.val($row.find("[data-order]").text());
            globalCodeEditor.setValue($this.attr("data-element-condition"));
            $row.addClass("opened").siblings().removeClass("opened");
          }
  
          $row
          .children("[data-condition]")
          .html(
            '<a href="#" data-condition-update class=" button success no-margin-all tiny text-uppercase text-bold radius success" >update </a>' +
            '<a href="#" data-condition-cancel class=" button link  no-margin-all tiny text-uppercase text-bold alert" > Cancel</a>'
            );
  
          $row
          .css({ background: "#F9F9F9" })
          .siblings()
          .find("[data-element-condition]")
          .addClass("disabled");
          $addRowBtn.velocity("transition.fadeOut").addClass("disabled");
        }
      });
  
      // Cancel function
      $(options.table).on("click", "[data-condition-cancel]", function(e) {
        e.stopImmediatePropagation();
  
        globalCodeEditor.updateOptions({ readOnly: false });
  
        _self.isEditing = false;
        _self.row.removeClass("opened").css({ background: "transparent" });
        _self.row
        .siblings()
        .find("[data-element-condition]")
        .removeClass("disabled");
        _self.row.children("[data-condition]").html(_self.button[0]);
  
        //reset spaces
        input.element.val("");
        input.order.val("");
        globalCodeEditor.setValue("");
        $addRowBtn.velocity("transition.fadeIn").removeClass("disabled");
      });
  
      // reset if row deleted
      $(options.table).on("click", ".remove-row", function(e) {
        // e.stopImmediatePropagation();
  
        globalCodeEditor.updateOptions({ readOnly: false });
  
        var $this = $(this),
        $row = $this.parents("tr");
  
        if ($row.hasClass("opened") && _self.isEditing == false) {
          //reset spaces
          input.element.val("");
          input.order.val("");
          globalCodeEditor.setValue("");
        } else if ($row.hasClass("opened") && _self.isEditing == true) {
          //reset spaces
          input.element.val("");
          input.order.val("");
          globalCodeEditor.setValue("");
          $addRowBtn.velocity("transition.fadeIn").removeClass("disabled");
  
          $("[data-element-condition]").removeClass("disabled");
          _self.isEditing = false;
        }
      });
  
      // Update function
      $(options.table).on("click", "[data-condition-update]", function(e) {
        e.stopImmediatePropagation();
  
        globalCodeEditor.updateOptions({ readOnly: true });
  
        _self.isEditing = false;
        _self.row
        .siblings()
        .find("[data-element-condition]")
        .removeClass("disabled");
        _self.row.removeClass("opened").css({ background: "transparent" });
  
        options.oTable.row(_self.row.index()).data([
         input.element.val(),
         buttonsTpl.btnCondition({
          condition: chars.encode(`${globalCodeEditor.getValue()}`),
          classes: "radius",
          text: "Edit"
        }),
          //'<a href="#" data-element-condition="' + chars.encode(globalCodeEditor.getValue()) + '" class="button tiny primary">Edit</a>',
          input.order.val()
          ]);
  
        options.save();
  
        //reset spaces
        input.element.val("");
        input.order.val("");
        globalCodeEditor.setValue("");
        $addRowBtn.velocity("transition.fadeIn").removeClass("disabled");
      });
    },
  
    editHttpElementRow: function(options) {
      options = options || {};
  
      var _self = this,
      input = {
        element: $("#HttpHeaderKey")
      },
      $addRowBtn = $('[data-table="add-row"]');
  
      _self.isEditing = false;
      /*
           input.element.keydown(function(e){
           if(_self.isEditing  ){
           e.preventDefault();
           }
           });
           */
  
      // Read row
      $(options.table).on("click", "tr", function(e) {
        e.stopImmediatePropagation();
  
        var $row = $(this);
  
        // if row not selected
        if (!$row.hasClass("opened")) {
          globalCodeEditor.updateOptions({ readOnly: true });
  
          if (!$row.hasClass("disabled") && _self.isEditing == false) {
            $row.addClass("opened").siblings().removeClass("opened");
            $row
            .css({ background: "#F9F9F9" })
            .siblings()
            .css({ background: "transparent" });
  
            if ($row.hasClass("opened") == true) {
              input.element.val($row.find("[data-header-key]").text());
              globalCodeEditor.setValue(
                $row
                .find("[data-element-condition]")
                .attr("data-element-condition")
                );
            }
          }
        } else if (_self.isEditing === false) {
          globalCodeEditor.updateOptions({ readOnly: false });
  
          $row.removeClass("opened");
          $row.css({ background: "transparent" });
  
          input.element.val("");
          globalCodeEditor.setValue("");
        }
      });
  
      // Edit function
      $(options.table).on("click", options.listener, function(e) {
        e.stopImmediatePropagation();
  
        globalCodeEditor.updateOptions({ readOnly: false });
  
        if (!$(this).hasClass("disabled")) {
          var $this = $(this),
          $row = $this.parents("tr");
  
          //assign active row to outer scope
          _self.button = $this;
          _self.row = $row;
          _self.isEditing = true;
  
          if ($row.hasClass("opened") == false) {
            input.element.val($row.find("[data-header-key]").text());
            globalCodeEditor.setValue($this.attr("data-element-condition"));
            $row.addClass("opened").siblings().removeClass("opened");
          }
  
          $row
          .children("[data-header-value]")
          .html(
            '<a href="#" data-condition-update class=" button success no-margin-all tiny text-uppercase text-bold radius success" >update </a>' +
            '<a href="#" data-condition-cancel class=" button link  no-margin-all tiny text-uppercase text-bold alert" > Cancel</a>'
            );
  
          $row
          .css({ background: "#F9F9F9" })
          .siblings()
          .find("[data-element-condition]")
          .addClass("disabled");
          $addRowBtn.velocity("transition.fadeOut").addClass("disabled");
        }
      });
  
      // Cancel function
      $(options.table).on("click", "[data-condition-cancel]", function(e) {
        e.stopImmediatePropagation();
  
        globalCodeEditor.updateOptions({ readOnly: false });
  
        _self.isEditing = false;
        _self.row.removeClass("opened").css({ background: "transparent" });
        _self.row
        .siblings()
        .find("[data-element-condition]")
        .removeClass("disabled");
        _self.row.children("[data-header-value]").html(_self.button[0]);
  
        //reset spaces
        input.element.val("");
        globalCodeEditor.setValue("");
        $addRowBtn.velocity("transition.fadeIn").removeClass("disabled");
      });
  
      // reset if row deleted
      $(options.table).on("click", ".remove-row", function(e) {
        // e.stopImmediatePropagation();
  
        globalCodeEditor.updateOptions({ readOnly: false });
  
        var $this = $(this),
        $row = $this.parents("tr");
  
        if ($row.hasClass("opened") && _self.isEditing == false) {
          //reset spaces
          input.element.val("");
          globalCodeEditor.setValue("");
        } else if ($row.hasClass("opened") && _self.isEditing == true) {
          //reset spaces
          input.element.val("");
          globalCodeEditor.setValue("");
          $addRowBtn.velocity("transition.fadeIn").removeClass("disabled");
  
          $("[data-element-condition]").removeClass("disabled");
          _self.isEditing = false;
        }
      });
  
      // Update function
      $(options.table).on("click", "[data-condition-update]", function(e) {
        e.stopImmediatePropagation();
  
        globalCodeEditor.updateOptions({ readOnly: true });
  
        _self.isEditing = false;
        _self.row
        .siblings()
        .find("[data-element-condition]")
        .removeClass("disabled");
        _self.row.removeClass("opened").css({ background: "transparent" });
  
        options.oTable.row(_self.row.index()).data([
         input.element.val(),
         buttonsTpl.btnCondition({
          condition: chars.encode(`${globalCodeEditor.getValue()}`),
          classes: "radius",
          text: "Edit"
        })
         ]);
  
        options.save();
  
        //reset spaces
        input.element.val("");
        globalCodeEditor.setValue("");
        $addRowBtn.velocity("transition.fadeIn").removeClass("disabled");
      });
    },
  
    /**
       *
       * @param el string table element
       * @param datatable object datatable
       * @param onsavefn  funciton callback on save
       */
  
       edit: function(el, dataTable, onSaveFn) {
        $(el).on("click", "td.edit-input", function() {
          var $this = $(this);
  
          if (!$this.hasClass("edit-code")) {
            if ($this.not(":has(.icon-trash)").length == 1) {
              var thisCell = dataTable.cell(this),
              text = thisCell.data(),
              time = 250,
              positionLeft = $(".dataTable").offset().left - $this.offset().left,
              positionTop =
              $(".dataTable").offset().top - $this.offset().top + 48;
  
              if (!$this.hasClass("on")) {
                $this.addClass("on");
                $this.html("");
                $this
                .append(
                  formTpl.edit({
                    placeholderText: chars.encode(text),
                    text: text,
                    classes: "edit-dialog",
                    style:
                    "left:" + positionLeft + "px; top:" + positionTop + "px;"
                  })
                  )
                .hide()
                .fadeTo(time / 2, 1);
  
                autosize($("textarea"));
  
              ///////////////////////////////////////////////////////////////////
              // click on save event
              $this.find(".edit-update").on("click", function(e) {
                // prevent from unwanted clicks
                e.stopPropagation();
                e.preventDefault();
  
                // update html and save
                thisCell.data($this.find(".textarea-edit").val());
  
                if (_.isFunction(onSaveFn)) {
                  onSaveFn();
                } else {
                  throw "No save function is defined.";
                }
  
                // animate bg on success green
                $this.removeClass("on").addClass("success");
                setTimeout(function() {
                  $this.removeClass("success");
                }, time);
              });
  
              ///////////////////////////////////////////////////////////////////
              // click on cancel event
              $this.find(".edit-cancel").on("click", function(e) {
                e.stopPropagation();
                e.preventDefault();
  
                // set back previous text
                $this.html(text);
                $this.removeClass("on").addClass("cancelled");
  
                // animate bg on cancel red
                setTimeout(function() {
                  $this.removeClass("cancelled");
                }, time);
              });
              ///////////////////////////////////////////////////////////////////
            }
          }
        } else {
          appendScript("../assets/js/new/codemirror/mode/csharp/codemirror.js");
  
          var thisCell = dataTable.cell(this),
          editor,
          text = thisCell.data(),
          time = 250,
          positionLeft = $(".dataTable").offset().left - $this.offset().left,
          positionTop = $(".dataTable").offset().top - $this.offset().top + 48;
  
          if (!$this.hasClass("on")) {
            $this.addClass("on");
            $this.html("");
            $this
            .append(
              formTpl.editCode({
                id: "editor-script",
                text: text,
                classes: "edit-dialog",
                style: "left:" + positionLeft + "px; top:" + positionTop + "px;"
              })
              )
            .hide()
            .fadeTo(time / 2, 1);
  
            editor = CodeMirror.fromTextArea("editor-script", {
              value: text,
              parserfile: ["tokenizecsharp.js", "parsecsharp.js"],
              stylesheet:
              "../../assets/js/new/codemirror/mode/csharp/csharpcolors.css",
              path: "../../assets/js/new/codemirror/mode/csharp/",
              height: "350px",
              indentUnit: 4,
              matchBrackets: true
              //,lineNumbers: true
            });
  
            ///////////////////////////////////////////////////////////////////
            // click on save event
            $this.find(".edit-update").on("click", function(e) {
              // prevent from unwanted clicks
              e.stopPropagation();
              e.preventDefault();
  
              // update html and save
              thisCell.data(editor.getCode());
  
              if (_.isFunction(onSaveFn)) {
                onSaveFn();
              } else {
                throw "No save function is defined.";
              }
  
              // animate bg on success green
              $this.removeClass("on").addClass("success");
              setTimeout(function() {
                $this.removeClass("success");
              }, time);
            });
  
            ///////////////////////////////////////////////////////////////////
            // click on cancel event
            $this.find(".edit-cancel").on("click", function(e) {
              e.stopPropagation();
              e.preventDefault();
  
              // set back previous text
              $this.html(editor.getCode());
              $this.removeClass("on").addClass("cancelled");
  
              // animate bg on cancel red
              setTimeout(function() {
                $this.removeClass("cancelled");
              }, time);
            });
            ///////////////////////////////////////////////////////////////////
          }
        }
      });
  },
  
  editDropdown: function(el, dataTable, onSaveFn, dropdownTemplate) {
    $(el).on("click", "td.edit-input-dropdown", function() {
      var $this = $(this);
  
      var thisCell = dataTable.cell(this),
      text = thisCell.data(),
      time = 250,
      positionLeft = $(".dataTable").offset().left - $this.offset().left,
      positionTop = $(".dataTable").offset().top - $this.offset().top + 48;
  
        // inject top/left position to custom dropdown string
        var dropdownHtml = $(dropdownTemplate).css({
          left: positionLeft,
          top: positionTop
        });
  
        if (!$this.hasClass("on")) {
          $this.addClass("on");
          $this.html("");
          $this.append(dropdownHtml).hide().fadeTo(time / 2, 1);
  
          ///////////////////////////////////////////////////////////////////
          // click on save event
          $this.find(".edit-update").on("click", function(e) {
            // prevent from unwanted clicks
            e.stopPropagation();
            e.preventDefault();
  
            // update html and save
            thisCell.data($this.find(".dropdwon-select-type").val());
  
            if (_.isFunction(onSaveFn)) {
              onSaveFn();
            } else {
              throw "No save function is defined.";
            }
  
            // animate bg on success green
            $this.removeClass("on").addClass("success");
            setTimeout(function() {
              $this.removeClass("success");
            }, time);
          });
  
          ///////////////////////////////////////////////////////////////////
          // click on cancel event
          $this.find(".edit-cancel").on("click", function(e) {
            e.stopPropagation();
            e.preventDefault();
  
            // set back previous text
            $this.html(text);
            $this.removeClass("on").addClass("cancelled");
  
            // animate bg on cancel red
            setTimeout(function() {
              $this.removeClass("cancelled");
            }, time);
          });
          ///////////////////////////////////////////////////////////////////
        }
      });
  },
  
    /**
       *
       * @param el string table element
       * @param datatable object datatable
       * @param onsavefn  funciton callback on save
       */
       editCode: function(el, dataTable, onSaveFn) {
        $(el).on("click", ".edit-input-code", function() {
          var $this = $(this);
  
          if ($this.not(":has(.icon-trash)").length == 1) {
            var thisCell = dataTable.cell(this),
            text = thisCell.data(),
            time = 250;
  
            if (!$this.hasClass("on")) {
              $this.addClass("on");
              $this.html("");
              $this
              .append(
                formTpl.edit({
                  placeholderText: chars.encode(text),
                  text: text,
                  classes: "edit-dialog"
                })
                )
              .hide()
              .fadeTo(time / 2, 1);
  
              autosize($("textarea"));
  
            ///////////////////////////////////////////////////////////////////
            // click on save event
            $this.find(".edit-update").on("click", function(e) {
              // prevent from unwanted clicks
              e.stopPropagation();
              e.preventDefault();
  
              // update html and save
              thisCell.data($this.find(".textarea-edit").val());
  
              if (_.isFunction(onSaveFn)) {
                onSaveFn();
              } else {
                throw "No save function is defined.";
              }
  
              // animate bg on success green
              $this.removeClass("on").addClass("success");
              setTimeout(function() {
                $this.removeClass("success");
              }, time);
            });
  
            ///////////////////////////////////////////////////////////////////
            // click on cancel event
            $this.find(".edit-cancel").on("click", function(e) {
              e.stopPropagation();
              e.preventDefault();
  
              // set back previous text
              $this.html(text);
              $this.removeClass("on").addClass("cancelled");
  
              // animate bg on cancel red
              setTimeout(function() {
                $this.removeClass("cancelled");
              }, time);
            });
            ///////////////////////////////////////////////////////////////////
          }
        }
      });
      },
  
      fixTdWidth: function(el) {
        $(el).each(function(i, element) {
          var $this = $(this);
          $this.css({
            width: $this.width()
          });
        });
      },
      filterInput: function(el) {
        el = el || "[data-filter]";
        var newValueRow = [];
  
        $(el).each(function() {
          var str = $(this).val();
        //str = _.replace(str, '<', '&lt;');
        str = _.replace(_.replace(str, ">", "&gt;"), "<", "&lt;");
  
        newValueRow.push(str);
      });
        return newValueRow;
      },
  
      clearInput: function(el) {
        el = el || '[data-insert-validation] input[type="text"]';
  
        $(el).each(function() {
          $(this).val("");
        });
      },
      validateInput: {
        onSubmit: function(el) {
          el = el || '[data-insert-validation] input[type="text"]';
          var errors = $(el + ":not(.no-validation)").length;
  
          $(el).each(function() {
            if (!$(this).hasClass("no-validation")) {
              if (_.isEmpty($(this).val())) {
                $(this).parents().eq(2).addClass("error");
                errors++;
              } else {
                $(this).parents().eq(2).removeClass("error");
                errors--;
              }
            }
  
            console.log(errors);
          });
  
          if (errors == 0) {
            return true;
          } else {
            return false;
          }
        },
  
        onKeyup: function(el) {
          el = el || '[data-insert-validation] input[type="text"]';
          $(el).keyup(function() {
            if (_.isEmpty($(this).val())) {
              $(this).parents().eq(2).addClass("error");
            } else {
              $(this).parents().eq(2).removeClass("error");
            }
          });
        }
      }
    };
  
  /**
   *
   * @param functionName
   * @param mydata
   * @param pFunction
   * @param DoShowProgressAnimation
   * @param onCompleteFn
   * @constructor
   */
   function AjaxCallNew(
    functionName,
    mydata,
    pFunction,
    DoShowProgressAnimation,
    onCompleteFn
    ) {
    if (DoShowProgressAnimation) ShowProgressAnimation();
  
    $.ajax({
      type: "POST",
      //url: 'Index.aspx/' + functionName,
      url: "Layout.aspx/" + functionName,
      //cache: false,
      //async: false,
      data: mydata,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      beforeSend: function() {},
      success: function(msg) {
        if (msg.d && pFunction != null) {
          pFunction(msg.d);
        }
        //else
        appConsole(togCon, "AjaxCallNew Success");
      },
      error: function(xhr, errorType, exception) {
        var errorMessage = exception || xhr.statusText;
        var errreq = new XMLHttpRequest();
        errreq.open(
          "POST",
          location.href.split("/")[0] +
          "//" +
          location.href.split("/")[2] +
          "/Login.aspx",
          true
          );
        errreq.setRequestHeader(
          "Content-type",
          "application/x-www-form-urlencoded"
          );
        errreq.send(
          "ErrorOccured=1&msg=" + xhr.responseText + "&funct=" + functionName
          );
        alert("An exception occurred!");
      },
      complete: function() {
        if (typeof onCompleteFn == "function") {
          onCompleteFn();
        }
        CloseProgressAnimation();
      }
    });
  }
  
  // Add view to template
  function AddViewToTemplate() {
    var viewInputName = $("#txtAddViewName");
  
    viewInputName.on("keypress", function() {
      var $this = $(this);
  
      if ($this.val().indexOf(" ") == -1 && $this.val().length >= 3) {
        $this.parent().find(".error").addClass("hide");
      } else if ($this.val().indexOf(" ") >= 0 || $this.val().length < 3) {
        $this.parent().find(".error").removeClass("hide");
      }
    });
  
    if (viewInputName.val() != "" && viewInputName.val().indexOf(" ") == -1) {
      var fAddViewCallback = function(viewName) {
        sessionStorage.setItem("currentViewID", viewName);
        appUi.selectedViews.val(sessionStorage.getItem("currentViewID"));
        //AjaxCallNew('GetElements', JSON.stringify({ TemplateID: getUrlParameter('TemplateID'), ViewName: viewName }), fGetElementsCallback, true);
  
        //************************************************************
        //CLEAR View DDL
        appUi.viewSelect.html("");
  
        JSON_byData(
          "Layout.aspx/GetElements",
          JSON.stringify({
            TemplateID: getUrlParameter("TemplateID"),
            ViewName: sessionStorage.getItem("currentViewID")
          })
          )
        .then(function(data) {
          appConsole(togCon, "2. Ajax response");
          fGetElementsCallback(data.d);
        })
        .then(function() {
          permissionController.init();
        })
        .then(function() {
            // View select template dropdown
            appUi.viewSelect
            .developselectmenu({
              width: "160px",
              select: function(event, ui) {
                  //$("#views").val(ui.item.label).change();
                }
              })
            .developselectmenu("menuWidget")
            .addClass("ui-menu-icons  depth-1");
  
            appUi.viewSelect.developselectmenu("refresh");
            appUi.viewSelect
            .developselectmenu("instance")
            .menu.append(
             '<li class="add-dropdown-element"><a id="add-view-selectmenu" class="" href="#" class="left-rc primary button prefix">' +
             '<i class="icon-plus button link success"></i> <span>Add New View..</span>' +
             "</a></li>"
             );
  
            $("#views-menu .ui-menu-item > div").on("click", function() {
              $("#views").val($(this).text()).change();
            });
          });
  
        //*************************************************************
      };
  
      $("#views").append(
       $("<option />").val(viewInputName.val()).text(viewInputName.val())
       );
      $("#views option:last").prop("selected", true);
      AjaxCallNew(
        "AddView",
        JSON.stringify({
          TemplateID: getUrlParameter("TemplateID"),
          ViewID: viewInputName.val()
        }),
        fAddViewCallback,
        false
        );
  
      appUi.modal.dialog({
        beforeClose: function() {
          return true;
        }
      });
    } else {
      appUi.modal.dialog({
        beforeClose: function() {
          return false;
        }
      });
  
      viewInputName.parent().find(".error").removeClass("hide");
    }
  
    $("#dialog-close-btn").on("click", function() {
      appUi.modal.dialog({
        beforeClose: function() {
          return true;
        }
      });
  
      appUi.modal.dialog("close");
    });
  }
  
  //Returns current selected element properties
  function GetElementProperty(key) {
    if (
      endpoints[$("#hdnCurrentElementID").val()] == null ||
      endpoints[$("#hdnCurrentElementID").val()][POS_ELEMENT_PROPERTIES] == null
      )
      return null;
  
    return endpoints[$("#hdnCurrentElementID").val()][POS_ELEMENT_PROPERTIES][
    key
    ];
  }
  
  function GetElementMainProperty(key) {
    return endpoints[$("#hdnCurrentElementID").val()][key];
  }
  
  function GetElementProperties() {
    return endpoints[$("#hdnCurrentElementID").val()][POS_ELEMENT_PROPERTIES];
  }
  
  function SetInputElementPropertyDecoded(htmlId, defaultValue) {
    var propValue = GetElementProperty(htmlId);
    if (propValue != null) {
      if (propValue.indexOf("&amp;gt;") > -1) {
        throw "Invalid string encoding.";
      }
      appConsole(togCon, propValue);
      $("#" + htmlId + "").val(chars.decode(propValue));
    } else $("#" + htmlId + "").val(defaultValue);
  }
  
  function SetInputElementProperty(htmlId, defaultValue) {
    var propValue = GetElementProperty(htmlId);
    if (propValue != null) $("#" + htmlId + "").val(propValue);
    else $("#" + htmlId + "").val(defaultValue);
  }
  
  function SetInputDefault(htmlId, defaultValue) {
    var el = $("#" + htmlId + "");
  
    if (el.val() == "") {
      el.val(defaultValue);
    }
  }
  
  function SetCheckBoxElementProperty(htmlId, defaultValue, trueValue) {
    var val =
    GetElementProperty(htmlId) == null
    ? defaultValue
    : GetElementProperty(htmlId);
    $("#" + htmlId + "").prop("checked", val == trueValue);
  }
  
  function SetNameProperty() {
    $("#name").val(GetElementMainProperty(POS_ELEMENT_NAME));
  }
  
  function fSetHelpPropertiesCallback(data) {
    data = JSON.parse(data);
    $.each(data, function(i) {
      $("#" + data[i].PropertyName + "_HELP").tooltipster({
        animation: "grow",
        content: $("" + data[i].PropertyHelp + ""),
        trigger: "click"
      });
    });
  }
  
  function SetHelpProperties() {
    AjaxCallNew(
      "GetItemPropertiesHelp",
      JSON.stringify({
        TemplateID: getUrlParameter("TemplateID"),
        ElementID: $("#hdnCurrentElementID").val()
      }),
      fSetHelpPropertiesCallback,
      false
      );
  }
  
  function SetSocketPinsProperty() {
    AjaxCallNew(
      "GetElementSocketPins",
      JSON.stringify({
        TemplateID: getUrlParameter("TemplateID"),
        ItemID: endpoints[$("#hdnCurrentElementID").val()][POS_ELEMENT_TYPE],
        ElementID: $("#hdnCurrentElementID").val()
      }),
      fGetElementSocketPinsCallback,
      false
      );
  }
  
  function fGetElementSocketPinsCallback(data) {
    data = JSON.parse(data);
    for (var k in data)
      $("#ddlSocketPins").append(
       $("<option />").val(data[k][0].Value).text(data[k][1].Value)
       );
  
    if (GetElementMainProperty(POS_ELEMENT_SOCKET) != "")
      $("#ddlSocketPins").val(
        GetElementMainProperty(POS_ELEMENT_SOCKET) +
        "_" +
        GetElementMainProperty(POS_ELEMENT_PIN).split("`")[0]
        );
    else $("#ddlSocketPins option:first").attr("selected", "selected");
  }
  
  function SetOperatorProperty() {
    $("#operator").val(GetElementMainProperty(POS_ELEMENT_OPERATOR));
  }
  
  function SaveOperatorProperty() {
    if ($("#operator").length > 0) {
      endpoints[$("#hdnCurrentElementID").val()][POS_ELEMENT_OPERATOR] = $(
       "#operator"
       ).val();
    }
  }
  
  function SaveUnregisterEventProperty() {
    var val = "0";
    if ($("#unregisterEvent") != null)
      val = $("#unregisterEvent").is(":checked") ? "1" : "0";
    endpoints[$("#hdnCurrentElementID").val()][
    POS_ELEMENT_UNREGISTER_EVENT
    ] = val;
  }
  
  function SetUnregisterEventProperty() {
    $("#unregisterEvent").prop(
     "checked",
     GetElementMainProperty(POS_ELEMENT_UNREGISTER_EVENT) == "1"
     );
  }
  
  function SaveNameProperty() {
    if (!_.isUndefined($("#name").val())) {
      endpoints[$("#hdnCurrentElementID").val()][POS_ELEMENT_NAME] = $(
       "#name"
       ).val();
    }
  
    $("#divCaption_" + $("#hdnCurrentElementID").val()).html(
     '<small class="name">' +
     $("#name").val() +
     '</small><a class="com-icon icon-ellipsis" href="#"></a>'
     );
  }
  
  function SavePinProperty() {
    if (
      document.getElementById("ddlSocketPins") instanceof Object &&
      $("#ddlSocketPins").val() != null
      ) {
      endpoints[$("#hdnCurrentElementID").val()][POS_ELEMENT_PIN] = $(
        "#ddlSocketPins"
        )
    .val()
    .split("_")[1];
  }
  }
  
  function SaveSocketProperty() {
    if (
      document.getElementById("ddlSocketPins") instanceof Object &&
      $("#ddlSocketPins").val() != null
      ) {
      endpoints[$("#hdnCurrentElementID").val()][POS_ELEMENT_SOCKET] = $(
       "#ddlSocketPins"
       )
    .val()
    .split("_")[0];
  }
  }
  
  function SaveInputPropertyEncoded(h, htmlId) {
    h[htmlId] = chars.encode($("#" + htmlId).val());
  }
  
  function SaveInputProperty(h, htmlId) {
    h[htmlId] = $("#" + htmlId).val();
  }
  
  function SaveInputPropertyWithValue(h, key, value) {
    h[key] = value;
  }
  
  function SaveCheckboxProperty(h, htmlId, trueValue, falseValue) {
    h[htmlId] = $("#" + htmlId).is(":checked") ? trueValue : falseValue;
  }
  
  //MODULARIZED SAVE FUNCTIONS
  var saveFn = {
    name: function() {
      endpoints[$("#hdnCurrentElementID").val()][POS_ELEMENT_NAME] = $(
       "#name"
       ).val();
      $("#divCaption_" + $("#hdnCurrentElementID").val()).html(
       '<small class="name">' +
       $("#name").val() +
       '</small><a class="com-icon icon-ellipsis" href="#"></a>'
       );
    },
    pin: function() {
      if (
        document.getElementById("ddlSocketPins") instanceof Object &&
        $("#ddlSocketPins").val() != null
        ) {
        endpoints[$("#hdnCurrentElementID").val()][POS_ELEMENT_PIN] = $(
          "#ddlSocketPins"
          )
      .val()
      .split("_")[1];
    }
  },
  socket: function() {
    if (
      document.getElementById("ddlSocketPins") instanceof Object &&
      $("#ddlSocketPins").val() != null
      ) {
      endpoints[$("#hdnCurrentElementID").val()][POS_ELEMENT_SOCKET] = $(
       "#ddlSocketPins"
       )
    .val()
    .split("_")[0];
  }
  },
  input: {
    property: function(h, htmlId) {
      h[htmlId] = $("#" + htmlId).val();
    },
    hasValue: function(h, key, value) {
      h[key] = value;
    }
  },
  checkbox: function(h, htmlId, trueValue, falseValue) {
    h[htmlId] = $("#" + htmlId).is(":checked") ? trueValue : falseValue;
  }
  };
  
  // DATE CONVERSION
  function dateConv(date) {
    var myDate = new Date(date);
    var dateString =
    " " +
    ("0" + myDate.getDate()).slice(-2) +
    "." +
    ("0" + (myDate.getMonth() + 1)).slice(-2) +
    "." +
    myDate.getFullYear();
    return dateString;
  }
  
  // TIME CONVERSION
  function timeConv(date) {
    // test string "0001-01-01T00:00:00"
    var myTime = new Date(date);
    var dateString =
    ("0" + myTime.getHours()).substr(-2) +
    ":" +
    ("0" + myTime.getMinutes()).substr(-2);
    return dateString;
  }
  
  // URL STRING OBJECT
  function QueryString() {
    var query_string = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      // If first entry with this name
      if (typeof query_string[pair[0]] === "undefined") {
        query_string[pair[0]] = decodeURIComponent(pair[1]);
        // If second entry with this name
      } else if (typeof query_string[pair[0]] === "string") {
        var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
        query_string[pair[0]] = arr;
        // If third or later entry with this name
      } else {
        query_string[pair[0]].push(decodeURIComponent(pair[1]));
      }
    }
    return query_string;
    //from ?TemplateId=123&TemplateName=name
    //return objectName.TemplateId, objectName.TemplateName
  }
  
  function GetSelectedViews() {
    appConsole(togCon, appUi.selectedViews.val());
    return appUi.selectedViews.val();
  }
  
  function setDefaultRemoteSettings() {
    appUi.hdnRemoteSettings.val(
      '{"IsRemoteInfoEnabled":true,"IsRemoteDebugEnabled":true,"IsRemoteUpdateEnabled":true,"IsRemoteRestartEnabled":true}'
      );
  }
  
  // GLOBAL HELP
  function globalHelp() {
    $("#btn-global-help").on("click", function(e) {
      e.preventDefault();
      var helpPanel = $("#global-help");
      var panelState = helpPanel.attr("data-open");
      var $this = $(this);
      if (panelState === "close") {
        helpPanel.velocity(
        {
          translateY: ["-256px", easingSmooth],
          opacity: [1, easingSmooth]
        },
        {
          duration: 500
        }
        );
        helpPanel.attr("data-open", "open");
        $this.html('<i class="icon icon-cross"></i>Close Help');
      } else if (panelState === "open") {
        helpPanel.velocity(
        {
          translateY: ["0px", easingSmooth],
          opacity: [0, easingSmooth]
        },
        {
          duration: 500
        }
        );
        helpPanel.attr("data-open", "close");
        $this.html('<i class="icon icon-help"></i> Help');
      }
    });
  }
  
  // STRING HELPER FUNCTIONS
  var stringFn = {
    rplUnd: function(string) {
      //Replace underscore '_' with space ' '
      return string.replace(/_/g, " ");
    },
    rmSpace: function(string) {
      return string.replace(/\s+/g, "");
    }
  };
  
  function appendScript(filepath) {
    if ($('head script[src="' + filepath + '"]').length > 0) return;
  
    var ele = document.createElement("script");
    ele.setAttribute("type", "text/javascript");
    ele.setAttribute("src", filepath);
    $("head").append(ele);
  }
  
  /**
   * Use this function for better control on asynchronous functions,
   * ex: var json = JSON_Reader('some_ajax_web_method').done().fail()
   * @param url
   * @returns {*} promise
   * @constructor
   */
   function JSON_Reader(url) {
    var d = new $.Deferred();
    $.ajax({
      type: "POST",
      url: url,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(data) {
        d.resolve(data);
      },
      error: function() {
        d.reject();
      }
    });
  
    return d.promise();
  }
  
  /**
   *
   * @param url
   * @param params
   * @returns {*}
   * @constructor
   */
   function JSON_byData(url, parameters) {
    var d = new $.Deferred();
    $.ajax({
      type: "POST",
      url: url,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      cache: false,
      data: parameters,
      success: function(data) {
        d.resolve(data);
      },
      error: function() {
        d.reject();
      }
    });
  
    return d.promise();
  }
  
  /**
   * Convert an array like this [1,1,1,1,1,1,1,1] to a decimal number -> 255
   * @param array
   * @returns {Number}
   */
   function toDecimal(array) {
    appConsole(togCon, array);
    appConsole(togCon, parseInt(array, 2));
    return parseInt(array.join(""), 2);
  }
  
  /**
   * From Decimal numbers like 255  to array -> [1,1,1,1,1,1,1,1]
   * @param val
   * @returns {Array}
   */
   function toBinary(val) {
    var bits = [];
    for (var i = 0; i < 8; i++) {
      bits.push(val % 2);
      val = (val - val % 2) / 2;
    }
    bits.reverse();
  
    return bits;
  }
  
  /**
   * Input validation helper
   * @type {{keypress: inputValidation.onKeypress}}
   */
   var inputValidation = {
    /**
       *
       * @param arr ['el_1', 'el_2',..]
       */
       onKeypress: function(arr) {
        _(arr).each(function(el, i) {
          $(el).on("keypress", function() {
            var $this = $(this);
            if ($this.parent().hasClass("error")) {
              if ($this.val().length >= 3) {
                $this.parent().removeClass("error");
              }
            }
          });
        });
      },
  
      onEvent: function(arr) {
        var valid = arr.length;
  
        _(arr).each(function(el, i) {
          var $el = $(el);
  
          if ($(el).val().length < 3) {
            $el.parent().addClass("error");
          } else {
            $el.parent().removeClass("error");
            valid--;
          }
        });
  
        if (valid == 0) {
          return true;
        } else {
          return false;
        }
      }
    };
  
    /**/
    function boardName(name) {
      if (name == "pf-hydra") {
        return "Hydra";
      } else if (name == "pf-cobra") {
        return "Cobra";
      } else if (name == "pf-cloud") {
        return "Cloud";
      } else if (name == "pf-rasperrypi") {
        return "Rasperry Pi";
      } else {
        return "New platform";
      }
    }
  
    var chars = {
      encode: function(str) {
        return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/'/g, "&apos;")
        .replace(/\./g, "&period;")
        .replace(/,/g, "&comma;")
        .replace(/"/g, "&quot;")
        .replace(/\\/g, "&#92;");
      },
      decode: function(str) {
        return String(str)
        .replace(/&#92;/g, "\\")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&apos;/g, "'")
        .replace(/&period;/g, ".")
        .replace(/&comma;/g, ",")
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, "&");
      }
    };
  
    var notification = {
      type: function(type) {
        var icon = "",
        style = "";
  
        switch (type) {
        // spinner icon
        case 1:
        icon = "fa fa-circle-o-notch fa-spin fa-fw";
        break;
        case 2:
        icon = "fa fa-check";
        break;
        case 3:
        icon = "fa fa-info";
        break;
        case 4:
        icon = "icon-warning-outline";
        style = "red-box";
        break;
        case "":
        icon = "";
        break;
        case "debug_on":
        icon = "fa fa-bug";
        style = "red-box";
        break;
        case "debug_off":
        icon = "fa fa-bug";
        style = "green-box";
        break;
        case icon.length > 2:
        icon = icon;
        break;
      }
  
      return {
        icon: icon,
        style: style
      };
    },
  
    multi: function(prop) {
      prop = typeof prop !== "object" ? {} : prop;
      (prop.id = prop.id || null), (prop.text = prop.text || "Default text");
      prop.type = prop.type || 1;
  
      if (_.includes(notificationIndex, prop.id)) {
        // already open
        console.log("notification already exists");
  
        $('[data-multi-notification="' + prop.id + '"]')
        .velocity(
          "callout.shake",
          {
            duration: 750,
            queue: false
          },
          { queue: false }
          )
        .find(".notification-timestamp")
        .text(moment().local().format("h:mm:ss a"));
      } else {
        notificationIndex.push(prop.id);
  
        var self = this,
        type = self.type(prop.type),
        $html = $(
          uiComponents.multiNotification({
            id: prop.id,
            text: prop.text,
            icon: type.icon,
            style: type.style,
            timestamp: moment().local().format("h:mm:ss a"),
            action: (prop.hasOwnProperty('action')) ? prop.action : ''
          })
          );
  
        $html
        .appendTo($("#notification-container"))
        .velocity("transition.slideDownIn", {
          duration: 500
        });
         
        $html.on("click", ".close", function(e) {
          $html.velocity("transition.slideDownOut", {
            duration: 250,
            complete: function(elements) {
              $html.remove();
              notificationIndex = _.remove(notificationIndex, function(n) {
                return n !== prop.id;
              });
  
              console.log(notificationIndex);
            }
          });
        });
      }
    },
  
    expanded: function(prop) {
      var self = this;
      prop = typeof prop !== "object" ? {} : prop;
      prop.introText = prop.introText || "Intro text";
      prop.moreText = prop.moreText || "More text";
      prop.type = prop.type || 2;
  
      appUi.gatewayInfoPanel.removeClass("red-box green-box");
      appUi.gatewayInfoPanel
      .find('[data-notification="icon"]')
      .removeClass()
      .addClass(self.type(prop.type).icon);
      appUi.gatewayInfoPanel
      .addClass(self.type(prop.type).style)
      .children(".text")
      .html(
        "<div>" +
        prop.introText +
        '...<a data-notification-more="false" class="" href="#">more</a></div>' +
        '<div class="more-text" style="display: none">' +
        prop.moreText +
        "</div>"
        );
  
      appUi.gatewayInfoPanel.velocity("transition.slideDownIn", {
        duration: 500
      });
      appUi.gatewayInfoPanel.attr("data-notification-show", true);
  
      appUi.gatewayInfoPanel.on("click", ".close", function() {
        self.hide();
      });
    },
  
    show: function(text, type) {
      var self = this;
  
      appUi.gatewayInfoPanel.removeClass("red-box green-box");
      appUi.gatewayInfoPanel
      .addClass(self.type(type).style)
      .children(".text")
      .html(text);
      appUi.gatewayInfoPanel
      .find('[data-notification="icon"]')
      .removeClass()
      .addClass(self.type(type).icon);
      appUi.gatewayInfoPanel.velocity("transition.slideDownIn", {
        duration: 500
      });
      appUi.gatewayInfoPanel.attr("data-notification-show", true);
  
      appUi.gatewayInfoPanel.on("click", ".close", function() {
        notification.hide();
      });
    },
  
    getStatus: function() {
      return appUi.gatewayInfoPanel.data("notification-show");
    },
  
    setStatus: function(status) {
      appUi.gatewayInfoPanel.data("notification-show", status);
    },
  
    hide: function() {
      if (appUi.gatewayInfoPanel.data("notification-show")) {
        appUi.gatewayInfoPanel.velocity("transition.slideDownOut", {
          duration: 250
        });
        appUi.gatewayInfoPanel.attr("data-notification-show", false);
      }
    }
  };
  
  var miniLoader = {
    show: function() {
      if (appUi.miniLoaderWrapper.children("svg").length == 0) {
        appUi.miniLoaderWrapper
        .html(uiComponents.loader)
        .velocity("fadeIn", { duration: 250 });
      } else {
        appUi.miniLoaderWrapper.velocity("fadeIn", { duration: 250 });
      }
  
      // $('.mini-loader-wrapper').hide().html(uiComponents.loader).velocity('fadeIn', {duration: 250});
    },
    hide: function() {
      setTimeout(function() {
        $(".mini-loader-wrapper").velocity("fadeOut", { duration: 1000 });
      }, 250);
    }
  };
  
  function markAcitveNode(nodeId) {
   /* if (activeNode != nodeId) {
      developController.elementPropToolbox(nodeId);
      activeNode = nodeId;
      $("#elem-property-link").trigger("click");
      $("#" + activeNode)
      .addClass("active-element")
      .siblings()
      .removeClass("active-element");
    }*/
  }

  
  function intersect_arrays(a, b) {
    var sorted_a = a.concat().sort();
    var sorted_b = b.concat().sort();
    var common = [];
    var a_i = 0;
    var b_i = 0;
  
    while (a_i < a.length && b_i < b.length) {
      if (sorted_a[a_i] === sorted_b[b_i]) {
        common.push(sorted_a[a_i]);
        a_i++;
        b_i++;
      } else if (sorted_a[a_i] < sorted_b[b_i]) {
        a_i++;
      } else {
        b_i++;
      }
    }
    return common;
  }
  
  function generateUUID() {
    var d = new Date().getTime();
  
    if (window.performance && typeof window.performance.now === "function") {
      d += performance.now();
    }
  
    var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(
      c
      ) {
      var r = ((d + Math.random() * 16) % 16) | 0;
      d = Math.floor(d / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
  
    return uuid;
  }
  
  var preventClick = function (e) {
    e.stopPropagation();
    e.preventDefault();
  };
  
  function regexClearString(strinToReplace) {
    return strinToReplace.replace(/[^\w\s]/gi, "");
  }
  
  // jQuery plugin on "on enter key pressed"
  $.fn.enterKey = function(fnc) {
    return this.each(function() {
      $(this).keypress(function(ev) {
        var keycode = ev.keyCode ? ev.keyCode : ev.which;
        if (keycode == "13") {
          fnc.call(this, ev);
        }
      });
    });
  };
  
  // Inline edit of field
  $.fn.inlineEdit = function(child, replaceWith) {
    var $this = $(this);
    console.log($this);
  
    var d = new $.Deferred();
  
    $(this).on("click", child, function(e) {
      e.stopImmediatePropagation();
      console.log(e);
  
      var elem = $(this);
  
      elem.hide();
      elem.after(replaceWith.val(elem.text()));
      replaceWith.focus();
  
      //events
      replaceWith.blur(function() {
        update($(this));
      });
  
      replaceWith.enterKey(function() {
        update($(this));
      });
  
      // functions
      function update($this) {
  
        var saveNewName = regexClearString($this.val());
        $this.remove();
  
        elem.text(saveNewName);
        elem.show();
        d.resolve({ newName: saveNewName, firedElement: elem });
        
      }
    });
  
    return d.promise();
  };
  
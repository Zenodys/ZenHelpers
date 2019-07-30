if (window.module) module = window.module;

const ipcRenderer = require('electron').ipcRenderer;
//***********************************//


JSON_Reader("ui-config.json").done(function (data) {
  ControlPanel(data);
})

function ControlPanel(data) {


  // variables
  let 
    $developmentTool = $('#developmentTool');

  // events
  $developmentTool.on('click', function () {
    ipcRenderer.send("showDevelopmentTool");
  });
}

function JSON_Reader(url) {
  var d = new $.Deferred();
  $.ajax({
    type: "POST",
    url: url,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (data) {
      d.resolve(data);
    },
    error: function () {
      d.reject();
    }
  });
  return d.promise();
}
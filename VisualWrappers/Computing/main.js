const {app, BrowserWindow} = require('electron');
const { spawn } = require('child_process');
const {ipcMain} = require('electron');
const path = require('path');

let mainWindow;
let child;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
      height: 600,
      width: 800
  });

  mainWindow.loadURL('file://' + __dirname + '/index.html');
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
  
});

app.on('window-all-closed', () => {
  if (process.platform != 'darwin')
    app.quit();
});

ipcMain.on("showVisualisations",function (event, arg) {
    var newWindow        = new BrowserWindow({ width: 450, height: 300, show: 
                                          false,webPreferences: {webSecurity: false,plugins:
                                          true,nodeIntegration: false} });
    newWindow.loadURL("http://localhost:9999/home/index");
    newWindow.show();
});

ipcMain.on("startEngine",function (event, arg) {
    child = spawn(path.join(__dirname, "ZenEngine\\ZenEngine.exe"),
      {
        cwd: path.join(__dirname, "ZenEngine")
      }
    );

		child.stdout.on('data', (data) => {
      if (isJSON(data.toString())) {
        var cnt = JSON.parse(data);
        sendToRenderer ('onZenEngineCount' , cnt.Data);    
      }
      else{
        console.log(data.toString());
        sendToRenderer('onZenEngineOutput' , data.toString());  
      }
    });

		child.stderr.on('data', (data) => {
      var arg = data != null ? data : '';
      sendToRenderer("onZenEngineError", arg);
		});
		
    child.on('exit',(code, signal)=>{
      sendToRenderer("onZenEngineExit");
    });
});

ipcMain.on("stopEngine",function (event, arg) {
  child.stdin.pause();
	child.kill();
});

function sendToRenderer(topic, arg)
{
  if (mainWindow != null && mainWindow.webContents != null)
    mainWindow.webContents.send(topic, arg);
}

function isJSON(text)
{
  if (/^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@').
    replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
    replace(/(?:^|:|,)(?:\s*\[)+/g, '')))
    return true
  else
    return false;
}


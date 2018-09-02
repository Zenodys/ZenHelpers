const {app, BrowserWindow} = require('electron');
const { spawn } = require('child_process');
const {ipcMain} = require('electron');

let mainWindow;
let child;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
      height: 600,
      width: 800
  });

  mainWindow.loadURL('file://' + __dirname + '/index.html');
});

ipcMain.on("showVisualisations",function (event, arg) {
        var newWindow        = new BrowserWindow({ width: 450, height: 300, show: 
                                              false,webPreferences: {webSecurity: false,plugins:
                                              true,nodeIntegration: false} });
        newWindow.loadURL("http://localhost:9999/home/index");
        newWindow.show();
});

ipcMain.on("startEngine",function (event, arg) {
    child = spawn("Test.exe");

		child.stdout.on('data', (data) => {
			console.log(data.toString());
      mainWindow.webContents.send('onZenEngineOutput' , data.toString());
		});

		child.stderr.on('data', (data) => {
      var arg = data != null ? data : '';
      mainWindow.webContents.send("onZenEngineError", arg);
		});
		
    child.on('exit',(code, signal)=>{
      mainWindow.webContents.send("onZenEngineExit");
    });
});

ipcMain.on("stopEngine",function (event, arg) {
  child.stdin.pause();
	child.kill();
});
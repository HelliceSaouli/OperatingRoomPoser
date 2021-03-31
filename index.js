const { app, BrowserWindow } = require('electron');
app.on('ready', function(){

    var win = new BrowserWindow({ width: 5000, height: 4000 ,         webPreferences: {
        nodeIntegration: true
    }});

    win.loadFile('index.html')
    win.setMenu(null);
    win.fullscreen;
    win.maximize();
    win.webContents.openDevTools();


});
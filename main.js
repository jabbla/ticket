const { app, BrowserWindow, net, session } = require('electron')
const { ipcMain } = require('./src/bus');
const { Uamtk, TranListQuery } = require('./src/Storage');

function createWindow () {   
    // 创建浏览器窗口
    win = new BrowserWindow({ width: 900, height: 800, minWidth: 900});

    session.defaultSession.cookies.set({
        url: 'https://kyfw.12306.cn/',
        name: 'uamtk',
        value: Uamtk.get()
    }, (err) => {
        if(err){
            console.log('设置uamtk session失败');
        }
        win.loadFile('./webapp/dist/index.html');

        win.webContents.openDevTools();
    });

    ipcMain.on('tranListQuery-get', ({event, arg, send}) => {
        send(TranListQuery.get());
    });

    ipcMain.on('userSession', ({event, arg}) => {
        let { uamtk } = arg;
        Uamtk.set(uamtk);
    });

    ipcMain.on('logout', () => {
        Uamtk.set('');
    });

    ipcMain.on('tranListQuery-set', ({event, arg}) => {
        console.log(arg)
        TranListQuery.set(arg);
    });
}

app.on('ready', createWindow);
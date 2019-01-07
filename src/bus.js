const { ipcRenderer, ipcMain } = require('electron');

module.exports = {
    ipcRenderer: {
        on(type){
            return new Promise((resolve, reject) => {
                ipcRenderer.on(type, (event, arg) => {
                    console.log(type);
                    resolve({event, arg});
                    ipcRenderer.removeListener(type, arguments.callee);
                });
            })
        },
        send(type, payload){
            return new Promise((resolve, reject) => {
                ipcRenderer.on(type+'-reply', (event, arg) => {
                    resolve({event, arg});
                    ipcRenderer.removeListener(type+'-reply', arguments.callee);
                });
                ipcRenderer.send(type, payload);
            });
        }
    },
    ipcMain: {
        on(type, callback){
            ipcMain.on(type, (event, arg) => {
                callback({
                    event,
                    arg,
                    send(payload){
                        event.sender.send(type+'-reply', payload);
                    }
                });
            });
        },
        send(type, payload){
            return new Promise((resolve, reject) => {
                ipcMain.on(type+'-reply', (event, arg) => {
                    resolve({event, arg});
                    ipcMain.removeListener(type+'-reply', arguments.callee);
                });
                console.log(ipcMain);
                ipcMain.send(type, payload);
            });
        }
    }
};
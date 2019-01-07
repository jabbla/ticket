const Store = require('electron-store');
const store = new Store();

module.exports = {
    Uamtk: {
        get(){
            let uamtk = store.get('uamtk');
    
            return uamtk;
        },
        set(value){
            store.set('uamtk', value);
        }
    },
    TranListQuery: {
        get(){
            let query = store.get('tranListQuery');

            return query;
        },
        set(value){
            store.set('tranListQuery', value);
        }
    }
}
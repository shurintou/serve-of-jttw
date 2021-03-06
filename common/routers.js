const fs = require('fs');

let files = fs.readdirSync('./routers');

let js_files = files.filter((f)=>{
    return f.endsWith('.js');
}, files);

module.exports = {};

for (let f of js_files) {
    console.log(`import router from file ${f}`);
    let name = f.substring(0, f.length - 3);
    module.exports[name] = require('../routers/' + f);
}
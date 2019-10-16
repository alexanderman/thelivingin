const util = require('util');
const utilOpts = {
    showHidden: true,
    depth: 5,
    getters: true
};

function print(obj, name) {
    if (name) {
        console.log(name, util.inspect(obj, utilOpts));
    }
    else {
        console.log(util.inspect(obj, utilOpts));
    }
}

module.exports = {
    print
}
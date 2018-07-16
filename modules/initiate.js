var vars = require('./vars');
var config = require('./config');

module.exports = {
    check: (curr, prev) => {
        var diff = (curr - prev)/60/60;
        return {
            bool: diff >= config.system.responseTime,
            time: diff,
        }
    },
    save: (sender, saveObj) => {
        vars.initiated[sender].times++;
        vars.initiated[sender].messages.push(saveObj);
    }
}
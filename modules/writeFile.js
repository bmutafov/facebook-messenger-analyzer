var fs = require('fs');

function writeFile(last, first, msgsOnDays) {
    var writeData = [];
    var lastDate = new Date( last * 1000 );
    for(var d = new Date(first * 1000); d < lastDate; d.setDate(d.getDate() + 1)) {
        var date = (d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate());
        var found = msgsOnDays.find(function(el) {
            return el.date === date;
        });
        if(found != null) {
            writeData.push({date : date, msgs: found.msgs});
            var index = msgsOnDays.indexOf(found);
            msgsOnDays.splice(index, 1);
        } else {
            writeData.push({date : date, msgs: 0});
        }
    }
    fs.writeFileSync("msgDays.js", 'var msgDays = ' + JSON.stringify(writeData, null, 2));
}

module.exports = writeFile;
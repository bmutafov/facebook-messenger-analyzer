var fs = require('fs');
var iconv = require('iconv-lite');
var vars = require('./vars');

var parse = {
    fileEncoding: (fileToRead) => {
        console.time('parseFile');
        try{
            var file = fs.readFileSync(fileToRead, 'utf8');
            var obj = JSON.parse(file);
            if(obj.participants > 2) return true;
            var str = JSON.stringify(obj);
            var buff   = Buffer.from(str, 'utf8');
            var DB_str = iconv.encode(buff, 'ISO-8859-1');
            var writeObj = iconv.decode(DB_str, 'utf8');

            var encodedObj = JSON.parse(writeObj);
            vars.personNames.friend.original = encodedObj.title;
            vars.personNames.you.original = encodedObj.messages.find(m => m.sender_name != vars.personNames.friend.original).sender_name;

            encodedObj.messages.forEach(msg => {
                if(msg.sender_name === vars.personNames.friend.original) {
                    msg.sender_name = 1;
                } else {
                    msg.sender_name = 0;
                }
            });

            writeObj = JSON.stringify(encodedObj);
            fs.writeFileSync("output.json", writeObj);
            console.timeEnd('parseFile');
            return false;
        } catch(e) {
            console.timeEnd('parseFile');
            return true; 
        }
    },
    messages: (outputFile) => {
        return JSON.parse(fs.readFileSync(outputFile));
    }
}

module.exports = parse;
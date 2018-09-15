var fileToRead = process.argv[2] || "dummy.json";
var BreakException = {};

console.time('exec');

var writeFile = require('./modules/writeFile');
var parse = require('./modules/parse');
var vars = require('./modules/vars');
var count = require('./modules/count');
var initiate = require('./modules/initiate');
var buildView = require('./modules/buildView');
const { lstatSync, readdirSync } = require('fs')
const { join } = require('path')

// if(fileToRead === '.') {
//     const isDirectory = source => lstatSync(source).isDirectory()
//     const getDirectories = source =>
//       readdirSync(source).map(name => join(source, name)).filter(isDirectory);
//     var directories = getDirectories('msgs/');
//     vars.init();
//     directories.forEach(directory => {
//         parse.fileEncoding(directory + "/message.json");
//         analyse("output.json");
//     });
// } else {
    parse.fileEncoding(fileToRead);
    analyse("output.json");
// }
console.timeEnd('exec');

function analyse(outputFile) {
    var bigData = parse.messages(outputFile);
    if(bigData.participants.length > 2) return;
    var messages = bigData.messages;

    // console.log(JSON.stringify(vars.initiated));

    var last = {
        timestamp_ms : 0,
        sender : '',
        message : ''
    }

    var i = 0;
    messages.forEach(msg => {
        // Set up variables
        var sender = msg.sender_name;
        var msgWordCount = msg.content != undefined ? msg.content.split(' ').length : 1;

        // Count the message
        count.message(sender);
        count.words(sender, msgWordCount);
        count.messagesOnDate(sender, msg.timestamp_ms);
        count.wordUsage(sender, msg.content || '');
        count.emojis(sender, msg.content || '');
        count.perHour(msg.timestamp_ms);

        // Check if and who initated (started) chat
        var initateCheck = initiate.check(last.timestamp_ms, msg.timestamp_ms);
        if(initateCheck.bool) {
            initiate.save(last.sender, {message: last.message, timeDifference: Math.round(initateCheck.time) });
        }

        if(last.sender != sender) {
            // console.log(sender + " lastTs: " + last.timestamp_ms + " nowTS: " + msg.timestamp_ms);
            count.replyTime(last.sender, last.timestamp_ms, msg.timestamp_ms);
        }

        last.message = msg.content;
        last.sender = sender;
        last.timestamp_ms = msg.timestamp_ms;

        i++;
        if(i%1000 === 0) {
            console.log('Analysed msg #' + i);
        }
    });

    count.firstAndLastMessage(messages);
    count.chatDuration(messages);
    count.replyTimeAvg();
    count.messagesPerDay(messages);
    count.consecutiveMsgingDays();

    // Print in console the results
    // buildView.console();
    // console.log(vars.emojis);

    buildView.toFile("web/result.js", true);
    // console.log(vars.replyTime[0]);
    // console.log(vars.replyTime[1]);

    // Show initiate messages
    // console.log(vars.initated[0].messages.concat(vars.initated[1].messages));
    // console.log(vars.initated[1].messages);
    // fs.writeFileSync("dummy2.json", JSON.stringify(vars.initated[0].messages, null, 4));
    // fs.writeFileSync("dummy2.json", JSON.stringify(vars.initated[1].messages, null, 4));
}
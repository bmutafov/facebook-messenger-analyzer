var fileToRead = process.argv[2] || "dummy.json";
var BreakException = {};

console.time('exec');

var writeFile = require('./modules/writeFile');
var parse = require('./modules/parse');
var vars = require('./modules/vars');
var count = require('./modules/count');
var initiate = require('./modules/initiate');
var buildView = require('./modules/buildView');

parse.fileEncoding(fileToRead);
analyse("output.json");
console.timeEnd('exec');

function analyse(outputFile) {
    var messages = parse.messages(outputFile);
    
    var last = {
        timestamp : 0,
        lastSender : '',
        lastMessage : ''
    }

    var i = 0;
    messages.forEach(msg => {
        // Set up variables
        var sender = msg.sender_name;
        var msgWordCount = msg.content != undefined ? msg.content.split(' ').length : 1;

        // Count the message
        count.message(sender);
        count.words(sender, msgWordCount);
        count.messagesOnDate(sender, msg.timestamp);
        count.wordUsage(sender, msg.content || '');
        count.emojis(sender, msg.content || '');
        count.perHour(msg.timestamp);

        // Check if and who initated (started) chat
        var initateCheck = initiate.check(last.timestamp, msg.timestamp);
        if(initateCheck.bool) {
            initiate.save(last.sender, {message: last.message, timeDifference: Math.round(initateCheck.time) });
        }

        if(last.sender != sender) {
            count.replyTime(sender, last.timestamp, msg.timestamp);
        }

        last.message = msg.content;
        last.sender = sender;
        last.timestamp = msg.timestamp;

        i++;
        if(i%1000 === 0) {
            console.log('Analysed msg #' + i);
        }
    });

    count.replyTimeAvg();
    count.messagesPerDay(messages);
    count.consecutiveMsgingDays();

    // Print in console the results
    // buildView.console();
    // console.log(vars.emojis);

    buildView.toFile("web/result.js");
    // console.log(vars.replyTime[0]);
    // console.log(vars.replyTime[1]);

    // Show initiate messages
    // console.log(vars.initated[0].messages.concat(vars.initated[1].messages));
    // console.log(vars.initated[1].messages);
    // fs.writeFileSync("dummy2.json", JSON.stringify(vars.initated[0].messages, null, 4));
    // fs.writeFileSync("dummy2.json", JSON.stringify(vars.initated[1].messages, null, 4));
}
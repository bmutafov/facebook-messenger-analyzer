var vars = require('./vars');
var config = require('./config');
var fs = require('fs');

var result = require('../web/result');

module.exports = {
    console: () => {
        var build = module.exports.object();
        console.log( JSON.stringify(build, null, 4) );
    },
    toFile: (file, beautify) => {
        var build = module.exports.object();
        build.msgPerDays = vars.messagesPerDay;
        var currentData = JSON.parse(fs.readFileSync(file, 'utf8').replace('var data = ', '').replace(';',''));
        currentData.push({data: build});
        fs.writeFileSync(file, "var data = " + (beautify ? JSON.stringify(currentData, null, 4) : JSON.stringify(currentData)));
        console.log("Build to file: success");
    },
    object: () => {
        if(vars.build != null) return vars.build;
        var build = {
            you: {
                name: vars.personNames.you.original,
                messagesCount: vars.personMessages[0].msgCount,
                wordsCount: vars.personMessages[0].wordCount,
                initiated: vars.initiated[0].times,
                avgResponseTime: vars.replyTime[0].avgResponseTime,
            },
            friend: {
                name: vars.personNames.friend.original,
                messagesCount: vars.personMessages[1].msgCount,
                wordsCount: vars.personMessages[1].wordCount,
                initiated: vars.initiated[1].times,
                avgResponseTime: vars.replyTime[1].avgResponseTime,
            },
            allMessages: {
                count: vars.allMessages.count,
                chatDuration: vars.chatDuration,
                perDay: vars.allMessages.averageMessagesPerDay,
                firstMessage: vars.allMessages.firstMessage,
                lastMessage: vars.allMessages.lastMessage,
                consecutiveDaysRecord: vars.consecutiveMsgingDays,
                consecutiveNoMessagingDays: vars.consecutiveNoMsgs,
                mostMessages: vars.mostMessages,
                mostUsedWords: module.exports.topUsedWords(config.system.mostUsedCount.words), 
                mostUsedEmojis: module.exports.topUsedEmojis(config.system.mostUsedCount.emojis),
                perHour: vars.msgsPerHour,
            },
            initiatedMessages: [
                vars.initiated[0].messages,
                vars.initiated[1].messages
            ]
        };
       vars.build = build;
        return build;
    },
    topUsedEmojis: (max) => {
        var top = [];
        for(var i = 0; i < max; i++) {
            try {
                var word = Object.keys(vars.emojis).reduce(function(a, b){ return vars.emojis[a].all > vars.emojis[b].all ? a : b });
                top.push(vars.emojis[word]);
                delete vars.emojis[word];
            } catch (e) {
                return top;
            }
        }
        top.forEach(word => {
            word.perPerson[0].sender = vars.personNames.you.original;
            word.perPerson[1].sender = vars.personNames.friend.original;
        });
        return top;
    },
    topUsedWords: (max) => {
        var top = [];
        for(var i = 0; i < max; i++) {
            try {
                var word = Object.keys(vars.mostUsedWords).reduce(function(a, b){ return vars.mostUsedWords[a].all > vars.mostUsedWords[b].all ? a : b });
                top.push(vars.mostUsedWords[word]);
                delete vars.mostUsedWords[word];
            } catch(e) {
                return top;
            }
        }
        top.forEach(word => {
            word.perPerson[0].sender = vars.personNames.you.original;
            word.perPerson[1].sender = vars.personNames.friend.original;
        });
        return top;
    }
}
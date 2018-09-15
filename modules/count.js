var vars = require('./vars');
var config = require('./config');
var nodemoji = require('node-emoji')

module.exports = {
    message: (sender) => {
        vars.personMessages[sender].msgCount++; 
        vars.allMessages.count++;
    },
    words: (sender, wordCount) => {
        vars.personMessages[sender].wordCount += wordCount;
    },
    messagesOnDate: (sender, timestamp) => {
        var dateRaw = new Date(timestamp);
        var date = config.system.dateFormat(dateRaw.getDate(), dateRaw.getMonth(), dateRaw.getFullYear());
        var foundMsg = vars.messagesPerDay.find(msg => {
            return msg.date === date;
        })
        if(foundMsg != null && foundMsg != undefined) {
            var index = vars.messagesPerDay.indexOf(foundMsg);
            vars.messagesPerDay[index].messages++;
        } else {
            vars.messagesPerDay.push({
                sender: sender,
                date: date,
                messages: 1,
            })
        }
    },
    wordUsage: (sender, msg) => {
        msg = nodemoji.replace(msg, (e) => '');
        var words = msg
                    .replace(/[.,?!;()"'-]/g, " ")
                    .replace(/\s+/g, " ")
                    .toLowerCase()
                    .split(" ")
                    .filter(e => {return e != '' && e.length > 4});
        
        words.forEach(word => {
                if( !vars.mostUsedWords.hasOwnProperty(word) ) {
                    vars.mostUsedWords[word] = {
                        name: word,
                        perPerson: [
                            {
                                count: 0,
                            },
                            {
                                count: 0,
                            }
                        ],
                        all: 0
                    };
                    vars.mostUsedWords[word].all = 0;
                } 
                vars.mostUsedWords[word].perPerson[sender].count++;
                vars.mostUsedWords[word].all++;
            });
    },
    emojis: (sender, msg) => {
        var replacedStr = nodemoji.replace(msg, (e) => `&;!3${e.key}&;!4`);
        var regEx = /(?<=\&;!3)(.*?)(?=\&;!4)/g;
        var emojis = replacedStr.match(regEx);
        if(emojis === null) return;

        emojis.forEach(emojiName => {
            var emoji = nodemoji.find(emojiName);
            if( !vars.emojis.hasOwnProperty(emoji.key) )
            vars.emojis[emoji.key] = {
                name: emoji.emoji,
                perPerson: [
                    {
                        count: 0,
                    },
                    {
                        count: 0,
                    }
                ],
                all: 0,
            };
            vars.emojis[emoji.key].perPerson[sender].count++;
            vars.emojis[emoji.key].all++;
        });

    },
    firstAndLastMessage: (messages) => {
        vars.allMessages.firstMessage = new Date(messages[messages.length - 1].timestamp_ms);
        vars.allMessages.lastMessage = new Date(messages[0].timestamp_ms);
    },
    chatDuration: (messages) => {
        vars.chatDuration = Math.round((messages[0].timestamp_ms - messages[messages.length - 1].timestamp_ms)/1000/60/60/24);
    },
    messagesPerDay: () => {
        vars.allMessages.averageMessagesPerDay = Math.round( (vars.allMessages.count / vars.chatDuration) * 100) / 100;
    },
    consecutiveMsgingDays: () => {
        var lastDateRaw = vars.messagesPerDay[0].date.split('-');
        var startDateRaw = vars.messagesPerDay[vars.messagesPerDay.length - 1].date.split('-');
        
        var startDate = new Date(startDateRaw[2], startDateRaw[1], startDateRaw[0]);
        var lastDate = new Date(lastDateRaw[2], lastDateRaw[1], lastDateRaw[0]);

        var record = 0;
        var recordNoMsg = 0;
        var recordFromMsg;
        var recordFromNoMsg;
        var currentStreak = 0;
        var noMsgStreak = 0;
        var fromDate, fromDateNoMsg;
        var toDate, toDateNoMsg;

        for(;startDate < lastDate; startDate.setDate(startDate.getDate() + 1)) {
            var currDate = config.system.dateFormat(startDate.getDate(), startDate.getMonth(), startDate.getFullYear());
            var found = vars.messagesPerDay.find(msg => {
                return msg.date === currDate;
            })
            if(found != null) {
                {
                    if(noMsgStreak > recordNoMsg) {
                        recordNoMsg = noMsgStreak;
                        recordFromNoMsg = fromDateNoMsg;
                        toDateNoMsg = currDate;
                    }
                    noMsgStreak = 0;
                }
                if(vars.mostMessages.count < found.messages) {
                    vars.mostMessages = {
                        count: found.messages,
                        date: currDate,
                    }
                }

                if(currentStreak === 0) {
                    fromDate = currDate;
                }
                currentStreak++;
                
                if(currentStreak > record) {
                    record = currentStreak;
                    toDate = currDate;
                    recordFromMsg = fromDate;
                }
            } else {
                noMsgStreak++;
                if(noMsgStreak === 1 ) fromDateNoMsg = currDate;
                currentStreak = 0;
            }
        }

        vars.consecutiveNoMsgs = {
            from: recordFromNoMsg,
            to: toDateNoMsg,
            count: recordNoMsg,
        }
        vars.consecutiveMsgingDays = {
            from: recordFromMsg,
            to: toDate,
            count: record,
        }
    },
    perHour: (timestamp) => {
        var date = new Date(timestamp);
        date.setHours(date.getUTCHours() + 3);
        vars.msgsPerHour[date.getUTCHours()].messages++;
    },
    replyTime: (sender, lastTime, currTime) => {
        var diff = (lastTime - currTime)/1000/60;
        if(lastTime === 0 || diff > config.system.responseTime) return;
        vars.replyTime[sender].totalTime += diff;
        vars.replyTime[sender].totalReplies++;
    },
    replyTimeAvg: () => {
        for(var i = 0; i < 2; i++) {
            vars.replyTime[i].avgResponseTime = Math.round((vars.replyTime[i].totalReplies / vars.replyTime[i].totalTime) * 100) / 100;
        }
    }
}
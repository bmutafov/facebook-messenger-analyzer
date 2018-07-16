var config = require('./config');

module.exports = {
    personNames : config.personNames,
    personMessages : config.personMessages,
    initiated: config.initiated,
    messagesPerDay: config.messagesPerDay,
    consecutiveMsgingDays: 0,
    mostMessages: config.mostMessages,
    allMessages: config.allMessages,
    emojis: config.emojis,
    mostUsedWords: config.mostUsedWords,
    msgsPerHour: config.msgsPerHour,
    replyTime: config.replyTime,
    build: null,
}
 
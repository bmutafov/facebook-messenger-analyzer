var config = require('./config');

module.exports = {
    personNames : {
        you : {
            original: "",
            nickname: ""
        },
        friend: {
            original: "",
            nickname: ""
        }
    },
    personMessages: [
        {
            msgCount: 0,
            wordCount: 0,
        },
        {
            msgCount: 0,
            wordCount: 0,
        }
    ],
    initiated: new Array(2).fill().map(u => ({
        times: 0,
        messages: [],
    })),
    messagesPerDay: [],
    consecutiveMsgingDays: 0,
    mostMessages: {
        count: 0,
        date: 0,
    },
    allMessages: {
        count: 0,
        averageMessagesPerDay: 0,
    },
    emojis: {},
    mostUsedWords: {},
    msgsPerHour: new Array(24).fill().map(u => ({
        messages: 0,
    })),
    replyTime: new Array(2).fill().map(u => ({
        totalReplies: 0,
        totalTime: 0,
        avgResponseTime: 0,
    })),
    build: null,
    reset: () => {
        module.exports.personNames = {
            you : {
                original: "",
                nickname: ""
            },
            friend: {
                original: "",
                nickname: ""
            }
        };
        module.exports.personMessages = [
            {
                msgCount: 0,
                wordCount: 0,
            },
            {
                msgCount: 0,
                wordCount: 0,
            }
        ];
        module.exports.initiated = new Array(2).fill().map(u => ({
            times: 0,
            messages: [],
        }));
        module.exports.messagesPerDay = [];
        module.exports.consecutiveMsgingDays = 0;
        module.exports.mostMessages = {
            count: 0,
            date: 0,
        };
        module.exports.allMessages = {
            count: 0,
            averageMessagesPerDay: 0,
        };
        module.exports.emojis = {};
        module.exports.mostUsedWords = {};
        module.exports.msgsPerHour = new Array(24).fill().map(u => ({
            messages: 0,
        }));
        module.exports.replyTime = new Array(2).fill().map(u => ({
            totalReplies: 0,
            totalTime: 0,
            avgResponseTime: 0,
        }));
        module.exports.build = null;
    }
}
 
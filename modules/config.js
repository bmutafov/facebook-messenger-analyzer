module.exports = 
{
    system: {
        dateFormat: (day, month, year) => {
            return day + '-' + month + '-' + year;
        },
        responseTime: 8,
        mostUsedCount: {
            words: 10,
            emojis: 5,
        },
    },
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
    initiated: [
        {
            times: 0,
            messages: [],
        },
        {
            times: 0,
            messages: [],
        }
    ],
    mostMessages: {
        count: 0,
        date: 0,
    },
    messagesPerDay: [],
    emojis: {},
    mostUsedWords: {},
    msgsPerHour: [
        {
            messages: 0,
        },
        {
            messages: 0,
        },
        {
            messages: 0,
        },
        {
            messages: 0,
        },
        {
            messages: 0,
        },
        {
            messages: 0,
        },
        {
            messages: 0,
        },
        {
            messages: 0,
        },
        {
            messages: 0,
        },
        {
            messages: 0,
        },
        {
            messages: 0,
        },
        {
            messages: 0,
        },
        {
            messages: 0,
        },
        {
            messages: 0,
        },
        {
            messages: 0,
        },
        {
            messages: 0,
        },
        {
            messages: 0,
        },
        {
            messages: 0,
        },
        {
            messages: 0,
        },
        {
            messages: 0,
        },
        {
            messages: 0,
        },
        {
            messages: 0,
        },
        {
            messages: 0,
        },
        {
            messages: 0,
        },
    ],
    replyTime: [
        {
            totalReplies: 0,
            totalTime: 0,
            avgResponseTime: 0,
        },
        {
            totalReplies: 0,
            totalTime: 0,
            avgResponseTime: 0,
        }
    ],
    allMessages: {
        count: 0,
        averageMessagesPerDay: 0,
    }
    // personMessages : {
    //     msgCount: {
    //         0: 0,
    //         1: 0
    //     },
    //     wordCount: {},
    //     initiatedChat: {},
    //     initatedMsgs: [],
    //     avgResponseTime: {},
    //     allMsgs: 0
    // }
}
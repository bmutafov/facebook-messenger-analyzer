$(document).ready(function() {
    var personToShow = getUrlParameter('personToShow') || 0;
    if(data.length <= 0) {
        $('.load-container').hide();
        $('.empty-data').show();
    } else if(data.length === 1) {
        $('.ppl-comparison').hide();
    } else {
        var max = {
            index: -1,
            count: 0,
        }
        for(var i = 0; i < data.length; i++) {
            if(data[i].data.allMessages.count > max.count) {
                max.index = i;
                max.count = data[i].data.allMessages.count;
            }
        }
        data.forEach(p => {
            var pplHTML = '<tr>' +
                                '<td class="w-25 text-right">' + p.data.friend.name + '</td>'+
                                '<td class="align-middle">'+
                                    '<div class="progress">'+
                                    ' <div class="progress-bar '+ (p.data.friend.name === data[personToShow].data.friend.name ? ' bg-danger ' : '') +'" role="progressbar" style="width: ' + Math.round((p.data.allMessages.count / max.count ) * 100)+'%" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"></div>'+
                                    '</div>'+
                                '</td>'+
                            '</tr>';
            $('.ppl-comparison tbody:last-child').append(pplHTML);
        });
        
        
    }
    if(personToShow >= data.length) personToShow = 0;

    var parseDaata = data[personToShow].data;

    for(let i = 0; i < data.length; i++) {
        var frName = data[i].data.friend.name;
        var frNameMachine = frName.split(' ').join('-');
        var linkHTML = '<a class="nav-item nav-link' + (parseInt(personToShow) === i ? ' active ' : '') +'" href="index.html?personToShow=' + i +'" id="' + frNameMachine + '">'+ frName +'</a>';
        $('nav').append(linkHTML);
    }

    $('.togglePerHour').click(function() {
        $('#msgPerHour').parent().toggle();
        $('#msgPerHourBar').parent().toggle();
    });

    var interval = 150;
    var startUp = [
        msgsPerHour,
        generalInfo,
        chatInfo,
        messagesCharts,
        wordsInfo,
        emojisInfo,
        initiatedMessages,
    ];

    for(var i = 0; i < startUp.length; i++) {
        setTimeout(startUp[i], interval * i);
    }

    setTimeout(function() {
        $('.load-container').fadeOut(1500, function() {
            $('.container-away').css({'top': '0px'});
            setTimeout(function() {
                $('.container').removeClass('container-away');
            }, 1200);
        });
    }, startUp.length * interval + interval);

    function initiatedMessages() {
        $('#initiatingMessages').dataTable().fnDestroy();
        var you = parseDaata.initiatedMessages[0];
        var friend = parseDaata.initiatedMessages[1];

        var youHTML;
        var friendHTML;

        you.forEach(msg => {
            youHTML += getRowHTML(msg, parseDaata.you.name);
        })
        friend.forEach(msg => {
            friendHTML += getRowHTML(msg, parseDaata.friend.name);
        })

        function getRowHTML(message, sender) {
            var wordHTML = '<tr>' + 
            '<td> <span>' + sender + '</span> </td>' +
            '<td> <span>' + message.timeDifference + ' hrs. </span> </td>' +
            '<td> <span>' + message.message + '</span> </td>'+
            '</tr>'; 
            return wordHTML;
        }

        $('.initiating-messages > tbody:last-child').append(youHTML);
        $('.initiating-messages > tbody:last-child').append(friendHTML);
        
        var dataTable = $('#initiatingMessages').DataTable({
            "columns": [
              { "width": "15%" },
              { "width": "15%" },
              { "width": "70%" },
            ]});


        $('.dataTables_length, .dataTables_filter').wrapAll('<div class=\'flex_wrapper\'></div>');
        $('.dataTables_info, .dataTables_paginate').wrapAll('<div class=\'flex_wrapper\'></div>');
        $('.dataTables_filter input').addClass('form-control');
    }


    function msgsPerHour() {
        var perHour = parseDaata.allMessages.perHour.map(m => m.messages);
        var labels = [];
        for(var i = 0; i < 24; i++) {
            labels.push( (i < 10 ? '0' + i : i) + ':00');
        }
        var ctx = $('#msgPerHour');
        new Chart(ctx, {
            data: {
                labels: labels,
                datasets: [{
                    label: 'test',
                    backgroundColor: [
                        "#0081af", "#00abe7","#2dc7ff","#ead2ac","#eaba6b", "#f5bb00", "#ec9f05", "#d76a03", "#bf3100", "#f48498",
                        "#f2ccc3", "#e78f8e","#ffe6e8","#acd8aa","#cde7be", "#d3e298", "#ecdd7b", "#ce8147", "#561d25", "#4b2142",
                        "#74226c", "#816e94","#8cc7a1","#97ead2",
                    ],
                    data: perHour,
                }]
            },
            type: 'polarArea',
            options: {
                animation: false,
                title: {
                  display: false,
                  text: 'Number of messages per hour'
                }
              }
        });

        var ctx2 = $('#msgPerHourBar');
        new Chart(ctx2, {
            data: {
                labels: labels,
                datasets: [{
                    borderColor: "rgba(255, 99, 132, 0.8)",
                    borderWidth: 1,
                    backgroundColor: "rgba(255, 99, 132, 0.3)",
                    data: perHour,
                }]
            },
            type: 'bar',
            options: {
                animation: false,
                legend: { display: false },
                title: {
                  display: false,
                  text: 'Number of messages per hour'
                }
              }
        });
    }

    function messagesCharts() {
        var fullMsgs = [];

        function parseDate(date) {
            var dArr = date.split('-');
            return {
                day: dArr[0],
                month: dArr[1],
                year: dArr[2],
            }
        }

        function getDate(date) {
            return date.getDate()  + '-' + date.getMonth() + '-' + date.getFullYear();
        }
        var dateRaw = parseDate(parseDaata.msgPerDays[parseDaata.msgPerDays.length - 1].date);
        var endDateRaw = parseDate(parseDaata.msgPerDays[0].date);
        var date = new Date(dateRaw.year, dateRaw.month, dateRaw.day);
        var endDate = new Date(endDateRaw.year, endDateRaw.month, endDateRaw.day);

        while(date < endDate) {
            var found = parseDaata.msgPerDays.find(e => {
                return e.date === getDate(date);
            }) || {date: getDate(date) , messages: 0};
            fullMsgs.push(found);
            
            date.setDate(date.getDate() + 1);
        }    

        var msgPerDays = fullMsgs.map(d => d.messages);
        var msgOnDays = fullMsgs.map(d => displayDate(d.date));

        var ctx = document.getElementById('msgPerDayChart');
        new Chart(ctx, {
            type: 'line',
            data: {
            labels: msgOnDays,
            datasets: [
                { 
                    data: msgPerDays,
                    label: "Messages per day",
                    borderColor: "#3e95cd",
                    fill: 'start',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.3)',
                    pointStyle: 'dash',
                    borderWidth: '1',
                }
            ]
            },
            options: {
                animation: {
                    duration: 0, // general animation time
                },
                hover: {
                    animationDuration: 0, // duration of animations when hovering an item
                },
                responsiveAnimationDuration: 0, // animation duration after a resize
                title: {
                    display: false,
                    text: 'All chat messages per date'
                }
            }
        });

        var msgsOverTime = [msgPerDays[0]];
        for(var i = 1; i < msgPerDays.length; i++) {
            msgsOverTime.push(msgPerDays[i] + msgsOverTime[i - 1]);
        }

        if(msgsOverTime.length > 100) {
            for(var i = 0; i < msgsOverTime.length; i += 5) {
                msgsOverTime.filter((x, i) => i % 5);
                msgOnDays.filter((x, i) => i % 5);
            }
        }

        var ctx2 = document.getElementById('msgCountOverTimeChart');
        new Chart(ctx2, {
            type: 'line',
            data: {
                labels: msgOnDays,
                datasets: [{ 
                    data: msgsOverTime,
                    label: "All messages count",
                    borderColor: "#3e95cd",
                    fill: 'start',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.3)',
                    pointStyle: 'dash',
                    borderWidth: '1',
                    }
                ]
            },
            options: {
                animation: {
                    duration: 0, // general animation time
                },
                hover: {
                    animationDuration: 0, // duration of animations when hovering an item
                },
                responsiveAnimationDuration: 0, // animation duration after a resize
                title: {
                    display: false,
                    text: 'Count of all messages over time'
                },
                elements: {
                    line: {
                        tension: 0, // disables bezier curves
                    }
                }
            }
        });
        
        
    }

    function emojisInfo() {
        var emojis = parseDaata.allMessages.mostUsedEmojis;
        if(emojis.length > 0)
            putInTable('.most-used-emojis', emojis);
        else 
            $('.most-used-emojis > tbody:last-child').append('<tr><td colspan=4> <div class="alert alert-warning" role="alert"> Not enough info </div> </td></tr>');

    }
    function wordsInfo() {
        var words = parseDaata.allMessages.mostUsedWords;
        putInTable('.most-used-words', words);

        var you = words.map(w => w.perPerson[0].count);
        var friend = words.map(w => w.perPerson[1].count);
        var names = words.map(w => w.name);

        var ctx = document.getElementById('mostUsedWordsChart');
        var barChart = new Chart(ctx, {
            type: 'bar',
            data : {
                labels: names,
                datasets: [
                {
                    label: 'You',
                    borderColor: 'rgba(255, 99, 132, 0.8)',
                    borderWidth: 1,
                    backgroundColor: 'rgba(255, 99, 132, 0.3)',
                    data: you,
                },
                {
                    label: 'Friend',
                    borderColor: 'rgba(54, 162, 235, 0.8)',
                    borderWidth: 1,
                    backgroundColor: 'rgba(54, 162, 235, 0.3)',
                    data: friend,
                },
            ]},
            options: {
                animation: false,
                scales: {
                    xAxes: [{
                        stacked: true
                    }],
                    yAxes: [{
                        stacked: true
                    }]
                }
            }
        });

        $('#toggleWords').click(function() {
            $('#wordsInChat').toggle();
            $('#mostUsedWordsChart').parent().toggle();
        });
    }
    function putInTable(tableClass, words) {
        words.forEach(word => pushWord(word));

        function pushWord(word) {
            var moreUsedPerYou = word.perPerson[0].count > word.perPerson[1].count;
            var wordHTML = '<tr>' + 
            '<td> <span>' + word.name + '</span> </td>' +
            '<td> <span' + (moreUsedPerYou ? ' class=\'badge badge-success more\'' : '') + '>' + word.perPerson[0].count + '</span> </td>' +
            '<td> <span' + (!moreUsedPerYou ? ' class=\'badge badge-success more\'' : '') + '>' + word.perPerson[1].count + '</span> </td>' +
            '<td> <span>' + word.all + '</span> </td>' +
            '</tr>'; 
            $(tableClass + ' > tbody:last-child').append(wordHTML);
        }
    }

    function chatInfo() {
        var all = parseDaata.allMessages;
        var fmD = new Date(all.firstMessage);
        var lmD = new Date(all.lastMessage);
        var fm = [fmD.getDate(), fmD.getMonth(), fmD.getFullYear()].join('-');
        var lm = [lmD.getDate(), lmD.getMonth(), lmD.getFullYear()].join('-');

        var rowHTML = '<tr>' +
        '<td><span>' + all.count + '</span></td>' +
        '<td><span>' + all.chatDuration + ' days </span></td>' +
        '<td><span>' + all.perDay + '</span></td>' +
        '<td><span>' + displayDate(fm) + '</span></td>' +
        '<td><span>' + displayDate(lm) + '</span></td>' +
        '<td><span>' + displayDate(all.consecutiveDaysRecord.from) + '</span></td>' +
        '<td><span>' + displayDate(all.consecutiveDaysRecord.to) + '</span></td>' +
        '<td><span class=\'badge badge-info more\'>' + all.consecutiveDaysRecord.count + '</span></td>' +
        '<td><span>' + displayDate(all.mostMessages.date) + '</span></td>' +
        '<td><span class=\'badge badge-info more\'>' + all.mostMessages.count + '</span></td>' +
        '</tr>';
        $('.chat-info > tbody:last-child').append(rowHTML);
    }

    function generalInfo() {
        var you = parseDaata.you;
        var friend = parseDaata.friend;

        var youHTML = buildGeneralInfoHTML(you);
        var friendHTML = buildGeneralInfoHTML(friend);

        $('.general-info > tbody:last-child').append(youHTML);
        $('.general-info > tbody:last-child').append(friendHTML);

        buildCharts("msgCountChart", you.messagesCount, friend.messagesCount);
        buildCharts("wordCountChart", you.wordsCount, friend.wordsCount);
        buildCharts("initiatedChart", you.initiated, friend.initiated);
        buildCharts("responseChart", you.avgResponseTime, friend.avgResponseTime);

        compareAndStyle('.person-msgCount', you.messagesCount, friend.messagesCount, false);
        compareAndStyle('.person-wordCount', you.wordsCount, friend.wordsCount,  false);
        compareAndStyle('.person-initiated', you.initiated, friend.initiated, false);
        compareAndStyle('.person-responseTime', you.avgResponseTime, friend.avgResponseTime, true);
    }

    function compareAndStyle(className, d1, d2, reversed) {
        var elements = $(className);
        var highlightIndex = parseInt(d1) > parseInt(d2) ? !reversed ? 0 : 1 : !reversed ? 1 : 0;
        $(elements[highlightIndex]).find('span').addClass('badge badge-success more');
    }

    function buildCharts(chartId, you, friend) {
        var ctx = document.getElementById(chartId).getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ["You", "Friend"],
                datasets: [{
                    label: '# of Votes',
                    data: [you, friend],
                    backgroundColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                    ],
                }]
            },
            options: {
                animation: false,
            }
        });
    }
    function buildGeneralInfoHTML(person) {
        var responseSeconds = person.avgResponseTime * 60;
        return '<tr>' + 
        '<td class=\'person-name\'>' + person.name + '</td>' +
        '<td class=\'person-msgCount\'> <span>' + person.messagesCount + '</span> </td>' +
        '<td class=\'person-wordCount\'> <span>' + person.wordsCount + '</span> </td>' +
        '<td class=\'person-initiated\'> <span>' + person.initiated + ' times</span> </td>' +
        '<td class=\'person-responseTime\'> <span>' + Math.floor(responseSeconds / 60) + ' min. ' + Math.round(responseSeconds % 60) + 'sec. </span> </td>' +
        '</tr>';
    }

    function getUrlParameter(sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;
    
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');
    
            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    };

    function displayDate(date) {
        var d = date.split('-');
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        d[1] = months[parseInt(d[1])];
        return d.join(' ');
    }
});
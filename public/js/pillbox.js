/**
 * Created by jinyangyu on 2/23/17.
 */

var historyStr;
var username = $("#nameHolder").val();
//var History = Parse.Object.extend("History");
var pairQrcode = new QRCode("pairQrcode");
var publicKey;
var privateKey;
var exclude;
//var testEn = '';
$(document).ready(function () {
    privateKey = sessionStorage.getItem('privateKey');
    historyStr = sessionStorage.getItem('uploadedFile');

    viewHistory();

});

viewHistory();
/*
function getUploadFile() {
    $.ajax({
        type: 'GET',
        url: '/uploadFile',
        //data: JSON.stringify(number), // or JSON.stringify ({name: 'jonas'}),
        success: function(data) {
            console.log('hereGet');
            console.log(data);
            historyStr = data.message;
            exclude = data.exclusive;
            /!*$.ajax({
                type: 'GET',
                url: '/uploadPrivateKey',
                //data: JSON.stringify(number), // or JSON.stringify ({name: 'jonas'}),
                success: function(data) {

                    privateKey = data;
                    console.log(privateKey);
                    viewHistory();

                }, error: function (data) {
                    console.log(data);
                },
                contentType: "application/json",
                dataType: 'text'
            });*!/
            console.log('success get uploaded file.');
            console.log(privateKey);
            viewHistory();
        }, error: function (data) {
            console.log(data);
        },
        contentType: "application/json",
        dataType: 'json'
    });


}
*/

function viewHistory() {

    var queryhistory = historyStr;
    var parsedResults = [];
    var crypt = new JSEncrypt({ default_key_size: 1024 });
    crypt.setPrivateKey(privateKey);
    var parsed = parseHistoryString(historyStr);
    parsedResults = parsedResults.concat(parsed);
    parsedResults = parsedResults.sort(function (a, b) {
        return (+a.timestamp) - (+b.timestamp);
    });
    renderCalendar(combineMsg(parsedResults));

}

function combineMsg(itemList) {
    var finalMessage = [];
    var messageLookup = [
        'Pill intake action, took all pills',
        'Pill intake action, not finish',
        'Did not take pills',
        'Abnormal, container removed',
        'Abnormal, Pills removed',
        'Abnormal, pills refilled',
        'Abnormal, kept open for a long time',
        'Abnormal, not close for a long time',
        'Pill intake action, no pills to take',
        'Pill intake action, refilled pills',
        'Pill intake action, container removed',
        'Abnormal, open and close',
        'No pill to take'
    ];
    var ll = itemList.length;
    var i, j;
    for (i = 0; i < ll; i++) {
        var item1 = itemList[i];
        if (item1.flag == 1) {
            continue;
        }
        else if (item1.errorCode == 3) {
            if (item1.hasPillsInside) {
                // not take pills
                finalMessage.push({
                    cell: item1.cell,
                    ok: false,
                    timestamp: item1.timestamp,
                    msg: messageLookup[2]
                });
                continue;
            }
            else {
                finalMessage.push({
                    cell: item1.cell,
                    ok: false,
                    timestamp: item1.timestamp,
                    msg: messageLookup[12]
                });
                continue;
            }
        }
        else if (item1.errorCode == 2) {
            // not finish all pills
            finalMessage.push({
                cell: item1.cell,
                ok: false,
                timestamp: item1.timestamp,
                msg: messageLookup[1]
            });
            continue;
        }
        else if (item1.isCapClosed && item1.errorCode == 1) {
            // cap closed
            finalMessage.push({
                cell: item1.cell,
                ok: false,
                timestamp: item1.timestamp,
                msg: messageLookup[7]
            });
        }
        else if (item1.isCapClosed && item1.errorCode == 0) {
            // cap closed no error
        }
        else {
            // item1 is cap open , search for cap close
            var item2 = null;
            for (j = i + 1; j < ll; j++) {
                if (itemList[j].cell == item1.cell && itemList[j].isCapClosed) {
                    item2 = itemList[j];
                    itemList[j].flag = 1;
                    break;
                }
            }
            if (item2 == null) {
                finalMessage.push({
                    cell: item1.cell,
                    ok: false,
                    timestamp: item1.timestamp,
                    msg: messageLookup[6]
                });
            }
            else {
                if (item1.errorCode == 0 && item2.errorCode == 0) {
                    if (item1.hasPillsInside && item2.hasPillsInside) {
                        // not finish
                        finalMessage.push({
                            cell: item1.cell,
                            ok: true,
                            timestamp: item1.timestamp,
                            msg: messageLookup[1]
                        });
                    }
                    else if (item1.hasPillsInside && !item2.hasPillsInside) {
                        // finish
                        finalMessage.push({
                            cell: item1.cell,
                            ok: true,
                            timestamp: item1.timestamp,
                            msg: messageLookup[0]
                        });
                    }
                    else if (!item1.hasPillsInside && !item2.hasPillsInside) {
                        // no pills
                        finalMessage.push({
                            cell: item1.cell,
                            ok: false,
                            timestamp: item1.timestamp,
                            msg: messageLookup[8]
                        });
                    }
                    else if (!item1.hasPillsInside && item2.hasPillsInside) {
                        // refill
                        finalMessage.push({
                            cell: item1.cell,
                            ok: false,
                            timestamp: item1.timestamp,
                            msg: messageLookup[9]
                        });
                    }
                    else if (item1.hasPillsInside && !item2.isContainerInside) {
                        // container removed
                        finalMessage.push({
                            cell: item1.cell,
                            ok: false,
                            timestamp: item1.timestamp,
                            msg: messageLookup[10]
                        });
                    }
                }
                else if (item1.errorCode == 1 && item2.errorCode == 1) {
                    if (item1.hasPillsInside && !item2.isContainerInside) {
                        // remove conatiner
                        finalMessage.push({
                            cell: item1.cell,
                            ok: false,
                            timestamp: item1.timestamp,
                            msg: messageLookup[3]
                        });
                    }
                    else if (!item1.isContainerInside && !item2.isContainerInside) {
                        // no container
                        finalMessage.push({
                            cell: item1.cell,
                            ok: false,
                            timestamp: item1.timestamp,
                            msg: messageLookup[3]
                        });
                    }
                    else if (!item2.isContainerInside) {
                        // no container
                        finalMessage.push({
                            cell: item1.cell,
                            ok: false,
                            timestamp: item1.timestamp,
                            msg: messageLookup[3]
                        });
                    }
                    else if (item1.hasPillsInside == item2.hasPillsInside) {
                        // cap open and close
                        finalMessage.push({
                            cell: item1.cell,
                            ok: false,
                            timestamp: item1.timestamp,
                            msg: messageLookup[11]
                        });
                    }
                    else if (item1.hasPillsInside && !item2.hasPillsInside) {
                        // pills removed
                        finalMessage.push({
                            cell: item1.cell,
                            ok: false,
                            timestamp: item1.timestamp,
                            msg: messageLookup[4]
                        });
                    }
                    if (!item1.hasPillsInside && item2.hasPillsInside) {
                        finalMessage.push({
                            cell: item1.cell,
                            ok: false,
                            timestamp: item1.timestamp,
                            msg: messageLookup[5]
                        });
                    }
                }
            }
        }
    }
    return finalMessage;
}


function parseHistoryString(result){
    //historyRecord = result.get('history');

    var encrypted_data = historyStr;
    console.log("raw_data : ", encrypted_data);
    var crypt = new JSEncrypt({ default_key_size: 1024 });
    crypt.setPrivateKey(privateKey);

    var historyRecord = '';
    while (encrypted_data.length > 0) {
        if (encrypted_data.length > 172) {
            var temp = crypt.decrypt(encrypted_data.substring(0, 172));
            historyRecord = historyRecord + temp;
            encrypted_data = encrypted_data.substring(172);
        }
        else {
            var temp = crypt.decrypt(encrypted_data);
            historyRecord = historyRecord + temp;
            encrypted_data = '';
        }
    }

    console.log("decrypt_data : ", historyRecord);
    var historyRecordArray = historyRecord.split(';');
    //console.log(historyRecord, historyRecordArray[1]);
    var formattedHistory=historyRecordArray
        .slice(1,-1)
        .map( function(str){
            // remove tail #
            if(str.charAt(str.length-1)=='#')str=str.substr(0,str.length-1);
            // check format
            if(!/^\d{1,2},\d{4},\d{10}$/.test(str)){console.warn('Unable to parse line:', str);return false;}
            var arr=str.split(',');
            //console.log('parsing line:',arr);
            var conditionByDigit=arr[1].split('');
            var status = parseInt(conditionByDigit[3]);
            var msg = status;
            var pill_n = parseInt(conditionByDigit[2]);
            var container_n = parseInt(conditionByDigit[1]);
            var pill_cont_s = '';
            if (container_n == 1) {
                if (pill_n == 0){
                    pill_cont_s = 'no pill';
                }
                else{
                    pill_cont_s = 'pill present';
                }
            }
            else {
                pill_cont_s = 'no container';
            }
            var cap_s = parseInt(conditionByDigit[0]);
            //var cap_s = '';
            if (cap_s == 1 && msg == 0) { msg = 0;}
            if (cap_s == 0 && msg == 0) { msg = 4;}
            if (cap_s == 1 && msg == 1) { msg = 0;}
            var messageLookup=['Cap closed',
                'Wrong container opened',
                'Pills remained in container',
                'Missed schedule (container not opened during intake window)',
                'Cap Open'
            ];
            return {
                cell: 				parseInt(arr[0]),
                timestamp: 			new Date(parseInt(arr[2])*1000),
                isCapClosed: 		conditionByDigit[0] == '1',
                isContainerInside:	conditionByDigit[1] == '1',
                hasPillsInside:     conditionByDigit[2] == '1',
                errorCode:          parseInt(conditionByDigit[3]),
                extendMsg:          pill_cont_s,
                originalText:       str,
                flag:               0
            };
        }).filter(function(s){return s!==false});
    //console.info('History string parsed successfully:', formattedHistory);
    return formattedHistory;
}

function renderCalendar(parsedResults){
    console.log(parsedResults);
    // 1. Calc start and end date
    var allTimes=parsedResults.map(function(item){
        return item.timestamp;
    });
    var minTime=new Date(Math.min.apply(Math, allTimes)), maxTime=new Date(Math.max.apply(Math, allTimes));
    console.info('Timestamp range:', minTime, maxTime);

    var startTime = new Date(minTime.getFullYear(), minTime.getMonth(), minTime.getDate()).getTime();
    var endTime = new Date(maxTime.getFullYear(), maxTime.getMonth(), maxTime.getDate()).getTime();
    console.info('Day range:', new Date(startTime), new Date(endTime));

    // 2. Fill array for red/yellow days
    var calendarData={};
    var oneDay=86400*1000;
    for(var timePointer=startTime;timePointer<=endTime;timePointer+=oneDay){
        calendarData[timePointer]={
            ok:   		true,
            messages: 	'',
            title: 		'OK' // Show OK by default.
        };
    }

    parsedResults.map(function(item){
        // calc day
        var timePointer=item.timestamp;
        timePointer-=(timePointer-startTime)%oneDay;
        //smoke test
        calendarData[timePointer].ok;

        var message=tm(item.timestamp)+' | Box:'+ item.cell+'<br>'+item.msg;
        // update OK status
        if(!item.ok){
            calendarData[timePointer].ok=false;
            calendarData[timePointer].title='Error';
            message='<span class="red">'+message+'</span>';
        }else{
            message='<span class="green">'+message+'</span>';
        }
        // modify item message
        calendarData[timePointer].messages+=message+'<br><br>';
    });
    console.log('Calendar Data Ready:',calendarData);

    // 3. Tooltip text ready for dates -- use messages
    var makePopover=function(title, message){
        return {
            content: 	message,
            title: 		title,
            html: 		true,
            placement: 	"auto top",
            trigger: 	"click"
        };
    }
    // 4. Apply Calendar Render function.
    // Red: has error, Yellow: no data reported
    $('#historyDiv').html('').calendar({
        customDayRenderer: function(element, date) {
            var timePointer=+date;
            if(timePointer>=+startTime && timePointer<=+endTime ){
                var item=calendarData[timePointer];
                if(timePointer==+startTime)
                    $(element).css('border', '2px solid blue');
                if(timePointer==+endTime){
                    $(element).css('text-decoration', 'underline');
                    $(element).css('border', '2px solid blue');
                }
                // Case 1: data present, status OK
                if(item.ok && item.messages!=''){
                    $(element).css('font-weight', 'bold');
                    $(element).css('font-size', '12px');
                    $(element).css('color', 'green');
                    $(element).popover(makePopover(item.title, item.messages));
                    return;
                }
                // Case 2: missing data
                if(item.ok){
                    $(element).css('background-color', 'yellow');
                    $(element).css('color', 'white');
                    $(element).css('border-radius', '12px');
                    $(element).popover(makePopover('Missing', 'No record reported for this date.'));
                    return;
                }
                // Case 3: error reported.
                console.info('Error report, item:', item, 'OK:', item.ok);
                {
                    $(element).css('background-color', 'red');
                    $(element).css('color', 'white');
                    $(element).css('border-radius', '12px');
                    $(element).popover(makePopover(item.title, item.messages));
                }
            }
        }
    });

    // 5. Activate tooltip. Show on hover?
    // TODO: check if it's not needed.

    return;
    // Render Calendar!!! Plan:
    // 1. Calc start and end date
    // 2. Fill array for red/yellow dates
    // 3. Tooltip text ready for dates?
    // 4. Apply Calendar Render function.
    // 5. apply tooltip.
}
//viewHistory();//debug only

function tm(dt) {
    return (dt.getMonth()+1) + '/' + dt.getDate() + '/' + dt.getFullYear() + ' ' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds();
}


function historyTip(){
    $("#scheduleTipModal").modal('show');
}

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 7; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}


function pair(){
    //var pairURL = 'https://smart-pillbox.parseapp.com/history';
    var crypt = new JSEncrypt({ default_key_size: 1024 });
    crypt.getKey();
    privateKey = crypt.getPrivateKeyB64();
    publicKey = crypt.getPublicKeyB64();

    var rands = makeid();
    //var listn = publicKey.split('\n');
    //var nkey = listn[1] + listn[2] + listn[3] + listn[4];
    //var exclusiveKey2 = CryptoJS.HmacSHA1(nkey, rands).toString();
    var timestamp3 = new Date().getTime();
    exclusiveKey = rands + timestamp3.toString();

    console.log("Public", publicKey);
    console.log("Private", privateKey);
    console.log("exc1", exclusiveKey);

    //var testString = 'abcdefghijklmnopqrstuvwxyz';
    //testEn = crypt.encrypt(testString);
    //var testDe = crypt.decrypt(testEn);
    //console.log("encrypt", testEn);
    //console.log("decrypt", testDe);


    pairQrcode.makeCode(username+publicKey+exclusiveKey);
    $("#pairModal").modal('show');
}

function noDataAlert() {
    $("#noDataModal").modal('show');
}

var timestamps;
$(function () {
    $('.timeInput1').timepicker({ 'timeFormat': 'H:i A' });
    $('.timeInput2').timepicker({ 'timeFormat': 'H:i A' });
    $('.timeInput3').timepicker({ 'timeFormat': 'H:i A' });
    $('.timeInput4').timepicker({ 'timeFormat': 'H:i A' });
    $('#datepicker').datepicker();
});

function calculateTimeStamp() {
    var day1Date = $('#datepicker').val();
    var day1MomentDate = moment(day1Date, "MM-DD-YYYY");
    var timeStampsOutput = "";
    var dateOutput = "";
    var curDate = day1MomentDate.format("MM-DD-YYYY");
    var midnight = moment(curDate, "MM-DD-YYYY hh:mm ap").unix().toString();
    timeStampsOutput += midnight;

    for (var i= 0; i<= 6;i++){
        var timeSlot1 = $('#basicExample' + (1+i*4).toString()).val();
        var timeSlot2 = $('#basicExample' + (2+i*4).toString()).val();
        var timeSlot3 = $('#basicExample' + (3+i*4).toString()).val();
        var timeSlot4 = $('#basicExample' + (4+i*4).toString()).val();
        var timeSlot1Moment = moment(curDate + " " + timeSlot1, "MM-DD-YYYY hh:mm ap").unix();
        var timeSlot2Moment = moment(curDate + " " + timeSlot2, "MM-DD-YYYY hh:mm ap").unix();
        var timeSlot3Moment = moment(curDate + " " + timeSlot3, "MM-DD-YYYY hh:mm ap").unix();
        var timeSlot4Moment = moment(curDate + " " + timeSlot4, "MM-DD-YYYY hh:mm ap").unix();
        timeStampsOutput += timeSlot1Moment.toString()  + timeSlot2Moment.toString()  + timeSlot3Moment.toString()  + timeSlot4Moment.toString() ;
        dateOutput += timeSlot1Moment.toString() + "\n" + timeSlot2Moment.toString() + "\n" + timeSlot3Moment.toString() + "\n" + timeSlot4Moment.toString() + "\n";
        curDate = day1MomentDate.add(1, 'days').format("MM-DD-YYYY");
    }
    UTCtimeStamp = Math.round((new Date()).valueOf()/1000).toString();

    timeStampsOutput+=UTCtimeStamp.toString();
    timestamps = timeStampsOutput;
    console.log(timeStampsOutput);
    console.log(timeStampsOutput.length);
}
function submit() {
    var scheduleQRCode = new QRCode("Qrcode-schedule");
    scheduleQRCode.makeCode(timestamps);
    $("#QRModal-schedule").modal('show');


}

function autoFill() {
    var timeSlot1 = $('#basicExample1').val();
    var timeSlot2 = $('#basicExample2').val();
    var timeSlot3 = $('#basicExample3').val();
    var timeSlot4 = $('#basicExample4').val();
    $('.timeInput1').timepicker('setTime', timeSlot1);
    $('.timeInput2').timepicker('setTime', timeSlot2);
    $('.timeInput3').timepicker('setTime', timeSlot3);
    $('.timeInput4').timepicker('setTime', timeSlot4);
    calculateTimeStamp();
}
$('#QRModal-schedule').on('hidden.bs.modal', function () {
    $('#Qrcode-schedule').html('');
});
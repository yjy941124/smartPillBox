/**
 * Created by jinyangyu on 2/4/17.
 */
var selected;
var publicKey;
var privateKey;
var exclusiveKey = '';
var uploadedFile;
var appname;
function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 7; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
function select(selectedObject) {

    selected = selectedObject;
    console.log(selected);
    var pairQrcode = new QRCode("Qrcode");
    var pairURL = 'abc';
    var crypt = new JSEncrypt({ default_key_size: 1024 });
    crypt.getKey();
    privateKey = crypt.getPrivateKeyB64();
    publicKey = crypt.getPublicKeyB64();
    var rands = makeid();
    var timestamp3 = new Date().getTime();
    exclusiveKey = rands + timestamp3.toString();
    pairQrcode.makeCode(publicKey+exclusiveKey);
/*    console.log(publicKey);
    console.log(rands);
    console.log(timestamp3.toString());*/
    $("#QRModal").modal('show');



}
function upload() {
    var pairQrcode = new QRCode("Qrcode");
    var pairURL = 'abc';
    var crypt = new JSEncrypt({ default_key_size: 1024 });
    crypt.getKey();
    privateKey = crypt.getPrivateKeyB64();
    publicKey = crypt.getPublicKeyB64();
    var rands = makeid();
    var timestamp3 = new Date().getTime();
    exclusiveKey = rands + timestamp3.toString();
    pairQrcode.makeCode(publicKey+exclusiveKey);
    console.log(publicKey);
    console.log(exclusiveKey);

    $("#QRModal").modal('show');
}
$('#QRModal').on('hidden.bs.modal', function () {
    $('#Qrcode').html('');
});
function redirect(selectedApp) {
    window.location.href = '/'+selectedApp;
}
function redirectAutoRecognition() {
    window.location.href = '/'+ appname;
}
function accept() {
    console.log(uploadedFile == '001');
    $('#QRModal').modal('toggle');
    $("#appModal").modal('show');

    if (uploadedFile == '001') appname = 'pillbox';
    document.getElementById('recognized-app').innerHTML = appname;

}
//test function not truly implemented.
function uploadTest() {
    number = {"value" : '001'};

    /*$.post('/schedule',{value:number}, function(data, status){
     console.log(data);
     },'json');*/
    $.ajax({
        type: 'POST',
        url: '/uploadFile',
        data: JSON.stringify(number), // or JSON.stringify ({name: 'jonas'}),
        success: function(data) {
            uploadedFile = data.value;
            console.log('here');
            console.log(data);

        }, error: function (data) {
            console.log(data);
        },
        contentType: "application/json",
        dataType: 'JSON'
    });
}
/*
$(document).ready(function () {


    $('#'+selected).click(function () {

    });
});*/

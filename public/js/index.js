/**
 * Created by jinyangyu on 2/4/17.
 */
var selected;
var publicKey;
var privateKey;
var exclusiveKey = '';
var uploadedFile;
var appname;
$(document).ready(function () {
    renderUploadQRCode();
    sessionStorage.setItem('privateKey',privateKey);
    getUploadedFile();
});
function getUploadedFile() {
    $.ajax({
        type: 'GET',
        url: '/getUploadedFile/'+exclusiveKey,
        //data: JSON.stringify(number), // or JSON.stringify ({name: 'jonas'}),
        success: function(data) {

            uploadedFile = data;

            console.log('Incoming uploadedFile....');
            console.log(uploadedFile);
            if (uploadedFile != "") {
                sessionStorage.setItem('uploadedFile', uploadedFile);
                window.location.href = '/pillbox';
            }


        }, error: function (err) {
            console.log(err);
        },
        contentType: "application/json",
        dataType: 'text'
    });
    setTimeout(getUploadedFile, 5000);
}

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 7; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

/**
 *
 * @param selectedObject
 */
function select(selectedObject) {
    selected = selectedObject;
    console.log(selected);
    var crypt = new JSEncrypt({ default_key_size: 1024 });
    crypt.getKey();
    privateKey = crypt.getPrivateKeyB64();
    publicKey = crypt.getPublicKeyB64();
    exclusiveKey = makeid() + (new Date()).getTime().toString();
    var pairQrcode = new QRCode("Qrcode");
    pairQrcode.makeCode(publicKey+exclusiveKey);
/*    console.log(publicKey);
    console.log(rands);
    console.log(timestamp3.toString());*/
    $("#QRModal").modal('show');
}

function renderUploadQRCode() {
    var pairQrcode = new QRCode("Qrcode-fileupload");
    var pairURL = 'abc';
    var crypt = new JSEncrypt({ default_key_size: 1024 });
    crypt.getKey();
    privateKey = crypt.getPrivateKeyB64();
    publicKey = crypt.getPublicKeyB64();
    var rands = makeid();
    var timestamp3 = new Date().getTime();
    exclusiveKey = rands + timestamp3.toString();
    pairQrcode.makeCode(publicKey+exclusiveKey);
    console.log(privateKey);
    $.ajax({
        type: 'POST',
        url: '/uploadPrivateKey',
        data: JSON.stringify({"value" : privateKey}), // or JSON.stringify ({name: 'jonas'}),
        success: function(data) {

            console.log('here');
            console.log(data);

        }, error: function (data) {
            console.log(data);
        },
        contentType: "application/json",
        dataType: 'json'
    });
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
    $.ajax({
        type: 'POST',
        url: '/uploadPrivateKey',
        data: JSON.stringify({"value" : privateKey}), // or JSON.stringify ({name: 'jonas'}),
        success: function(data) {

            console.log('here');
            console.log(data);

        }, error: function (data) {
            console.log(data);
        },
        contentType: "application/json",
        dataType: 'json'
    });
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
    $("#appListModal").modal('show');

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

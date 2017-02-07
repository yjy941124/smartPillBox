/**
 * Created by jinyangyu on 2/4/17.
 */
var selected;
var publicKey;
var privateKey;
var exclusiveKey = '';
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
$('#QRModal').on('hidden.bs.modal', function () {
    $('#Qrcode').html('');
});
function redirect() {
    window.location.href = '/'+selected;
}
/*
$(document).ready(function () {


    $('#'+selected).click(function () {

    });
});*/

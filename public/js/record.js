/**
 * Created by jinyangyu on 2/3/17.
 */
$(document).ready(function () {
    var pairQrcode = new QRCode("Qrcode");

    $('#upload-btn').click(function () {
        var pairURL = 'abc';
        pairQrcode.makeCode(pairURL);
        $("#QRModal").modal('show');
    });
});

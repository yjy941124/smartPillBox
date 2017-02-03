var number;
function submit() {
    number = {"value" : document.getElementById('number').value};

    /*$.post('/schedule',{value:number}, function(data, status){
        console.log(data);
    },'json');*/
    $.ajax({
        type: 'POST',
        url: '/schedule',
        data: JSON.stringify(number), // or JSON.stringify ({name: 'jonas'}),
        success: function(data) {


        },
        contentType: "application/json",
        dataType: 'json'
    });


}
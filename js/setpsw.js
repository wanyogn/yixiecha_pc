$(function () {
    var status = getStorage("user");
    if(status == "noLogin"){
        $(".home_h").before($(".login_register").html());
    }else if(status == "outTime"){
        $(".home_h").before($(".login_register").html());
    }else{
    }
    var name = getQueryVariable("username");
    if(name == false){//无参
        window.location.href = to_login
    }else {
        $("#ver_username_input").val(name);
    }

    $("#skip_login_button").click(function () {
        //window.location.href = "";
        getReferURL("referTo");
    });
});
//判断是否为手机号码
function IsPhone(num){
    return /(^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)/.test(num);
}
function sureForget(){
    var username = $("#ver_username_input").val();
    var pass = $("#register_password_input").val();
    var rpass = $("#repeat_password_input").val();
    if(!IsPhone(username)){
        $("#danger_tip").html("邮箱输入不合法");
        $("#danger_div").show();
        $("#ver_username_input").parent().parent().css("border","1px solid #e73d4a");
        $("#ver_username_input").parent().parent().css("box-shadow", "inset 0 1px 1px rgba(0,0,0,.075), 0 0 6px #f2989f");
        return;
    }
    if(pass.length < 8){
        $("#danger_tip").html("密码不能小于8位数");
        $("#danger_div").show();
        $("#register_password_input").parent().parent().css("border","1px solid #e73d4a");
        $("#register_password_input").parent().parent().css("box-shadow", "inset 0 1px 1px rgba(0,0,0,.075), 0 0 6px #f2989f");
        return;
    }
    if (!/([a-zA-Z]+[0-9]+|[0-9]+[a-zA-Z])/.exec(pass)) {
        $("#danger_tip").html("密码必须由英文和数字组成");
        $("#danger_div").show();
        $("#register_password_input").parent().parent().css("border","1px solid #e73d4a");
        $("#register_password_input").parent().parent().css("box-shadow", "inset 0 1px 1px rgba(0,0,0,.075), 0 0 6px #f2989f");
        return;
    }
    if (pass != rpass) {
        $("#danger_tip").html("两次输入密码不同，请重新输入");
        $("#danger_div").show();
        $("#repeat_password_input").parent().parent().css("border","1px solid #e73d4a");
        $("#repeat_password_input").parent().parent().css("box-shadow", "inset 0 1px 1px rgba(0,0,0,.075), 0 0 6px #f2989f");
        return;
    }
    $.ajax({
        type: 'post',
        url: url_prex + '/method/updatePsw',
        data: {"username": username, "password": hex_md5(pass)},
        async: false,
        success: function (result) {
            if(result == "fail"){
                $("#danger_tip").html("操作异常");
                $("#danger_div").show();
            }else{
                getReferURL("referTo");
            }
        },
        error:function(error){
            alert("系统繁忙。。");
        }
    });

}
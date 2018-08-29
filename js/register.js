var jsonObj = '';
$(function () {
    var status = getStorage("user");
    if(status == "noLogin"){
        $(".home_h").before($(".login_register").html());
        }else if(status == "outTime"){
        $(".home_h").before($(".login_register").html());
    }else{
        location.href = "../";
    }
   initRegister();
});

//#e0e3ec 原始框(灰色)  #51d1f4 正确框(蓝色)  #e73d4a 错误框(红色)
function IsPhone(num){
    return /(^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)/.test(num);
}
function isPsw(num){
    return /([a-zA-Z]+[0-9]+|[0-9]+[a-zA-Z])/.test(num);
}
//初始化免费注册页面
function initRegister() {
    $("#danger_icon").click(function () {
        $("#danger_div").hide();
    });
    var uflag = true;
    var pflag = true;
    var rflag = true;
    /*start用户名输入*/
    $("#ver_username_input").focus(function(){
        uflag = true;
        $("#ver_username_input").parent().parent().css("border","1px solid #51d1f4");
        $("#ver_username_input").parent().parent().css("box-shadow", "inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(81,209,244,.6)");
    });
    $("#ver_username_input").blur(function(){
        var val = $("#ver_username_input").val();
        if($.trim(val) == ""){
            $("#danger_tip").html("邮箱不能为空");
            $("#danger_div").show();
            $("#ver_username_input").focus();
            return;
        }
        if (!/(^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)/.exec(val)) {
            $("#danger_tip").html("邮箱输入有误");
            $("#danger_div").show();
            $("#ver_username_input").focus();
            return;
        }
        $("#danger_div").hide();
    });
    $("#ver_username_input").keyup(function(){
        if(IsPhone($("#ver_username_input").val()) && $("#ver_username_input").val()!=""){
            $("#ver_username_input").parent().parent().css("border","1px solid #51d1f4");
            $("#ver_username_input").parent().parent().css("box-shadow", "inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(81,209,244,.6)");
        }else{
            $("#ver_username_input").parent().parent().css("border","1px solid #e73d4a");
            $("#ver_username_input").parent().parent().css("box-shadow", "inset 0 1px 1px rgba(0,0,0,.075), 0 0 6px #f2989f");
        }
    });
    /*end用户名输入*/
    /*start注册密码*/
    $("#register_password_input").focus(function(){
        pflag = true;
        $("#register_password_input").parent().parent().css("border","1px solid #51d1f4");
        $("#register_password_input").parent().parent().css("box-shadow", "inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(81,209,244,.6)");
    });
    $("#register_password_input").blur(function(){
        var val = $("#register_password_input").val();
        if(val.length < 8){
            $("#danger_tip").html("密码不能小于8位数");
            $("#danger_div").show();
            $("#register_password_input").focus();
            return;
        }
        if (!/([a-zA-Z]+[0-9]+|[0-9]+[a-zA-Z])/.exec(val)) {
            $("#danger_tip").html("密码必须由英文和数字组成");
            $("#danger_div").show();
            $("#register_password_input").focus();
            return;
        }
        $("#danger_div").hide();
    });
    $("#register_password_input").keyup(function(){
        if(isPsw($("#register_password_input").val()) && $("#register_password_input").val()!=""){
            $("#register_password_input").parent().parent().css("border","1px solid #51d1f4");
            $("#register_password_input").parent().parent().css("box-shadow", "inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(81,209,244,.6)");
        }else{
            $("#register_password_input").parent().parent().css("border","1px solid #e73d4a");
            $("#register_password_input").parent().parent().css("box-shadow", "inset 0 1px 1px rgba(0,0,0,.075), 0 0 6px #f2989f");
        }
    })
    /*end注册密码*/
    /*start重复输入密码*/
    $("#repeat_password_input").focus(function(){
        rflag = true;
        $("#repeat_password_input").parent().parent().css("border","1px solid #51d1f4");
        $("#repeat_password_input").parent().parent().css("box-shadow", "inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(81,209,244,.6)");
    });
    $("#repeat_password_input").blur(function(){
        var pval = $("#register_password_input").val();
        var rval = $("#repeat_password_input").val();
        if (pval != rval) {
            $("#danger_tip").html("两次输入密码不同，请重新输入");
            $("#danger_div").show();
            $("#repeat_password_input").focus();
            return;
        }
        $("#danger_div").hide();
    });
    $("#repeat_password_input").keyup(function(){
        var pval = $("#register_password_input").val();
        var rval = $("#repeat_password_input").val();
        if (pval == rval && rval !="") {
            $("#repeat_password_input").parent().parent().css("border","1px solid #51d1f4");
            $("#repeat_password_input").parent().parent().css("box-shadow", "inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(81,209,244,.6)");
        }else{
            $("#repeat_password_input").parent().parent().css("border","1px solid #e73d4a");
            $("#repeat_password_input").parent().parent().css("box-shadow", "inset 0 1px 1px rgba(0,0,0,.075), 0 0 6px #f2989f");
        }
    })
    /*end重复输入密码*/
    $("#ver_username_input").focus();


    $("#register_login_button").click(function () {
        var f = true;
        var uval = $("#ver_username_input").val();
        var pval = $("#register_password_input").val();
        var rval = $("#repeat_password_input").val();
        var cval = $("#register_code_input").val();
        /*if(uval.length < 8){
            $("#danger_tip").html("用户名不能小于8位数");
            $("#danger_div").show();
            $("#ver_username_input").parent().parent().css("border","1px solid #e73d4a");
            $("#ver_username_input").parent().parent().css("box-shadow", "inset 0 1px 1px rgba(0,0,0,.075), 0 0 6px #f2989f");
            f = false;
        }*/
        if(f) {
            if (!/(^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)/.exec(uval)) {
                $("#danger_tip").html("邮箱输入有误");
                $("#danger_div").show();
                $("#ver_username_input").parent().parent().css("border","1px solid #e73d4a");
                $("#ver_username_input").parent().parent().css("box-shadow", "inset 0 1px 1px rgba(0,0,0,.075), 0 0 6px #f2989f");
                f = false;
            }
        }
        if(f){
            if(pval.length < 8){
                $("#danger_tip").html("密码不能小于8位数");
                $("#danger_div").show();
                $("#register_password_input").parent().parent().css("border","1px solid #e73d4a");
                $("#register_password_input").parent().parent().css("box-shadow", "inset 0 1px 1px rgba(0,0,0,.075), 0 0 6px #f2989f");
                f = false;
            }
        }
        if(f){
            if (!/([a-zA-Z]+[0-9]+|[0-9]+[a-zA-Z])/.exec(pval)) {
                $("#danger_tip").html("密码必须由英文和数字组成");
                $("#danger_div").show();
                $("#register_password_input").parent().parent().css("border","1px solid #e73d4a");
                $("#register_password_input").parent().parent().css("box-shadow", "inset 0 1px 1px rgba(0,0,0,.075), 0 0 6px #f2989f");
                f = false;
            }
        }
        if(f){
            if (pval != rval) {
                $("#danger_tip").html("两次输入密码不同，请重新输入");
                $("#danger_div").show();
                $("#repeat_password_input").parent().parent().css("border","1px solid #e73d4a");
                $("#repeat_password_input").parent().parent().css("box-shadow", "inset 0 1px 1px rgba(0,0,0,.075), 0 0 6px #f2989f");
                f = false;
            }
        }
        if(f){
            if(cval == ""){
                $("#danger_tip").html("验证码不能为空");
                $("#danger_div").show();
                $("#register_code_input").parent().parent().css("border","1px solid #e73d4a");
                $("#register_code_input").parent().parent().css("box-shadow", "inset 0 1px 1px rgba(0,0,0,.075), 0 0 6px #f2989f");
                f = false;
            }
        }
        if(f){
            if(jsonObj != ''){
                if(uval != jsonObj.name){
                    $("#danger_tip").html("请勿修改邮箱");
                    $("#danger_div").show();
                    $("#ver_username_input").parent().parent().css("border","1px solid #e73d4a");
                    $("#ver_username_input").parent().parent().css("box-shadow", "inset 0 1px 1px rgba(0,0,0,.075), 0 0 6px #f2989f");
                    f = false;
                }
            }
        }
        if(f){var timestamp = Date.parse(new Date());
            if(jsonObj != ''){
                if(Date.parse(new Date()) - jsonObj.time > 1000*60*3){//超过三分钟
                    $("#danger_tip").html("验证码输入有误,请重新获取");
                    $("#danger_div").show();
                    $("#register_code_input").parent().parent().css("border","1px solid #e73d4a");
                    $("#register_code_input").parent().parent().css("box-shadow", "inset 0 1px 1px rgba(0,0,0,.075), 0 0 6px #f2989f");
                    f = false;
                }else{
                    if(cval != jsonObj.code){
                        $("#danger_tip").html("验证码输入有误");
                        $("#danger_div").show();
                        $("#register_code_input").parent().parent().css("border","1px solid #e73d4a");
                        $("#register_code_input").parent().parent().css("box-shadow", "inset 0 1px 1px rgba(0,0,0,.075), 0 0 6px #f2989f");
                        f = false;
                    }
                }
                
            }else{
                $("#danger_tip").html("请获取验证码");
                $("#danger_div").show();
                $("#register_code_input").parent().parent().css("border","1px solid #e73d4a");
                $("#register_code_input").parent().parent().css("box-shadow", "inset 0 1px 1px rgba(0,0,0,.075), 0 0 6px #f2989f");
                f = false;
            }
        }
        if(f){
            $("#danger_div").hide();
            $.ajax({
                type: 'post',
                //url:'/method/commonUserRegister',
                url:url_prex + '/method/commonUserRegister',
                data: {username: uval, password: hex_md5(pval),code:cval},
                async:false,
                success: function(data) {
                    if(data == "exist"){
                        $("#danger_tip").html("账号已存在");
                        $("#danger_div").show();
                        $("#register_password_input").val("");
                        $("#repeat_password_input").val("");
                        $("#ver_username_input").focus();
                    }else if(data == "fail"){
                        $("#danger_tip").html("注册失败，请重新注册");
                        $("#danger_div").show();
                        $("#register_password_input").val("");
                        $("#repeat_password_input").val("");
                        $("#ver_username_input").focus();
                    }else{
                        var json = JSON.parse(data);
                        setStorage('user',json);
                        location.href = "../";
                    }
                }
            });
        }
    });
}

function sendMsg1(){
    var mail = $("#ver_username_input").val();
    if($.trim(mail) == ""){
        $("#danger_tip").html("邮箱不能为空");
        $("#danger_div").show();
        $("#ver_username_input").parent().parent().css("border","1px solid #e73d4a");
        $("#ver_username_input").parent().parent().css("box-shadow", "inset 0 1px 1px rgba(0,0,0,.075), 0 0 6px #f2989f");
        return;
    }
    if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.exec(mail)) {
        $("#danger_tip").html("邮箱输入不合法");
        $("#danger_div").show();
        $("#ver_username_input").parent().parent().css("border","1px solid #e73d4a");
        $("#ver_username_input").parent().parent().css("box-shadow", "inset 0 1px 1px rgba(0,0,0,.075), 0 0 6px #f2989f");
        return;
    }
    $('#mpanel4').html("");
    contentCode();
    $(".code_cov").show();
}
function contentCode(){
    $('#mpanel4').slideVerify({
        type : 2,       //类型
        vOffset : 5,    //误差量，根据需求自行调整
        vSpace : 5, //间隔
        imgName : ['1.jpg', '2.jpg'],
        imgSize : {
            width: '400px',
            height: '200px',
        },
        blockSize : {
            width: '40px',
            height: '40px',
        },
        barSize : {
            width : '400px',
            height : '40px',
        },
        ready : function() {
            // 
        },
        success : function() {
            $(".code_cov").hide();
            sendAjax(url_prex + "/method/checkUserExist",{"username":$("#ver_username_input").val()},function(result){
                if(result > 0){
                    $("#danger_tip").html("该邮箱已被注册");
                    $("#danger_div").show();
                    $("#ver_username_input").parent().parent().css("border","1px solid #e73d4a");
                    $("#ver_username_input").parent().parent().css("box-shadow", "inset 0 1px 1px rgba(0,0,0,.075), 0 0 6px #f2989f");
                }else{
                    sendCode();
                }
            })
        },
        error : function() {
        }
    });
}
    
function timerStart(){
    var timer = null;
    var i = 60;
    timer = setInterval(function () {
        i = i - 1;
        if (i < 1) {
            clearInterval(timer);
            $('.sendMsg').html("发送");
            $('.sendMsg').removeAttr("disabled");
            return;
        }
        $('.sendMsg').html("(" + i + ")s");
        $('.sendMsg').attr("disabled","disabled");
    }, 1000);
}
function sendCode(){
    var mail = $("#ver_username_input").val();
    $.ajax({
        type: 'post',
        url: url_prex + '/method/sendCode',
        //url: '/method/sendCode',
        data: {
            "mail":mail
        },
        async: false,
        beforeSend:function(e){
            timerStart();
        },
        success: function (result) {
            var json = JSON.parse(result);
            jsonObj = json;
            console.log(jsonObj.time);
        },
        error:function(error){
            alert("系统繁忙。。");
        }
    });
}

function sendAjax(url,data,callback){
    $.ajax({
        type: 'post',
        url: url,
        data: data,
        async: false,
        success: function (result) {
            callback(result);
        },
        error:function(error){
            alert("系统繁忙。。");
        }
    });
}

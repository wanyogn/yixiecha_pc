var jsonObj = '';
$(function () {
    initLoginHead();
    var status = getStorage("user");
    if(status == "noLogin"){
        $(".home_h").before($(".login_register").html());
    }else if(status == "outTime"){
        $(".home_h").before($(".login_register").html());
    }else{
        location.href = "../";
    }
    initPasswordLogin();

   

});
/**确认修改密码*/
function sureForget(){
    var username = $("#for_username_input").val();
    var code = $("#for_info_input").val();
    var pass = $("#for_password_input").val();

    if(!IsPhone(username)){
        $("#danger_tip").html("邮箱输入不合法");
        $("#danger_div").show();
        $("#ver_username_input").parent().parent().css("border","1px solid #e73d4a");
        $("#ver_username_input").parent().parent().css("box-shadow", "inset 0 1px 1px rgba(0,0,0,.075), 0 0 6px #f2989f");
        return;
    }
    if($.trim(code) == ""){
        $("#danger_tip").html("验证码不能为空");
        $("#danger_div").show();
        $("#ver_username_input").parent().parent().css("border","1px solid #e73d4a");
        $("#ver_username_input").parent().parent().css("box-shadow", "inset 0 1px 1px rgba(0,0,0,.075), 0 0 6px #f2989f");
        return;
    }
    if(jsonObj != ""){
        if(Date.parse(new Date()) - jsonObj.time > 1000*60*3){//超过三分钟
            $("#danger_tip").html("验证码输入有误,请重新获取");
            $("#danger_div").show();
            $("#ver_username_input").parent().parent().css("border","1px solid #e73d4a");
            $("#ver_username_input").parent().parent().css("box-shadow", "inset 0 1px 1px rgba(0,0,0,.075), 0 0 6px #f2989f");
            return;
        }else{
            if(code != jsonObj.code){
                $("#danger_tip").html("验证码错误");
                $("#danger_div").show();
                $("#ver_username_input").parent().parent().css("border","1px solid #e73d4a");
                $("#ver_username_input").parent().parent().css("box-shadow", "inset 0 1px 1px rgba(0,0,0,.075), 0 0 6px #f2989f");
                return;
            }
        }
        
    }else{
        $("#danger_tip").html("验证码错误");
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
                /*getReferURL("referTo");*/
                //var json = JSON.parse(result);
                //setStorage('user',json);
                window.location.href="../newWeb/login.html";
               // window.location.href="../newWeb/";
            }
        },
        error:function(error){
           alert("系统繁忙。。");
        }
    });
    
}
//判断是否为数字
function IsNum(num){
    return /^\d+$/.test(num);
}
//判断是否为手机号码
function IsPhone(num){
    return /(^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)/.test(num);
}
//初始化登录页面head
function initLoginHead() {
    $(".active").removeClass("active");
    $("#password_tab").addClass("active");
    $("#password_tab").click(function () {
        $(".active").removeClass("active");
        $(this).addClass("active");
        initPasswordLogin();
    });
    $("#verify_tab").click(function () {
        $(".active").removeClass("active");
        $(this).addClass("active");
        initVerifyLogin();
    });

}
function forget(){
    jsonObj = "";
    $("#content_div").html("");
    $("#content_div").html($("#forget_template").html());
}
//初始化密码登录页面
function initPasswordLogin(){

    $("#danger_icon").click(function () {
        $("#danger_div").hide();
    });

    $(".content_content").html("");
    $(".content_content").html($("#password_login_templete").html());

    var uflag = true;
    var pflag = true;

    $("#pw_username_input").focus(function(){
        uflag = true;
        $("#pw_username_input").parent().parent().css("border","1px solid #51d1f4");
        $("#pw_username_input").parent().parent().css("box-shadow", "inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(81,209,244,.6)");
    });
    $("#pw_username_input").blur(function(){
        if(uflag) {
            uflag = false;
            $("#pw_username_input").parent().parent().css("border", "1px solid #e0e3ec");
            $("#pw_username_input").parent().parent().css("box-shadow", "none");
        }
    });

    $("#pw_password_input").focus(function(){
        pflag = true;
        $("#pw_password_input").parent().parent().css("border","1px solid #51d1f4");
        $("#pw_password_input").parent().parent().css("box-shadow", "inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(81,209,244,.6)");
    });
    $("#pw_password_input").blur(function(){
        if(pflag) {
            pflag = false;
            $("#pw_password_input").parent().parent().css("border", "1px solid #e0e3ec");
            $("#pw_password_input").parent().parent().css("box-shadow", "none");
        }
    });
    $("#pw_password_input").bind('keypress', function (event) {
        if (event.keyCode == "13") {
            $("#pw_password_input").blur();
            $("#pw_login_button").click();
        }
    });

    $("#pw_username_input").focus();

    $("#pw_login_button").click(function () {

        var f = true;
        var uval = $("#pw_username_input").val();
        var pval = $("#pw_password_input").val();
        
        /*if(uval.length < 8){
            $("#danger_tip").html("用户名不能小于8位数");
            $("#danger_div").show();
            $("#pw_username_input").parent().parent().css("border","1px solid #e73d4a");
            $("#pw_username_input").parent().parent().css("box-shadow", "inset 0 1px 1px rgba(0,0,0,.075), 0 0 6px #f2989f");
            f = false;
        }*/
       /* if(f) {
           if (!/(^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)/.exec(uval)) {
                $("#danger_tip").html("邮箱输入有误");
                $("#danger_div").show();
                $("#pw_username_input").parent().parent().css("border","1px solid #e73d4a");
                $("#pw_username_input").parent().parent().css("box-shadow", "inset 0 1px 1px rgba(0,0,0,.075), 0 0 6px #f2989f");
                f = false;
            }
        }*/
        if(f){
            if(pval.length < 8){
                $("#danger_tip").html("密码不能小于8位数");
                $("#danger_div").show();
                $("#pw_password_input").parent().parent().css("border","1px solid #e73d4a");
                $("#pw_password_input").parent().parent().css("box-shadow", "inset 0 1px 1px rgba(0,0,0,.075), 0 0 6px #f2989f");
                f = false;
            }
        }
        if(f){
            if (!/([a-zA-Z]+[0-9]+|[0-9]+[a-zA-Z])/.exec(pval)) {
                $("#danger_tip").html("密码必须由英文和数字组成");
                $("#danger_div").show();
                $("#pw_password_input").parent().parent().css("border","1px solid #e73d4a");
                $("#pw_password_input").parent().parent().css("box-shadow", "inset 0 1px 1px rgba(0,0,0,.075), 0 0 6px #f2989f");
                f = false;
            }
        }
        if(f){
            $("#danger_div").hide();
             $.ajax({
                type: 'post',
                url: url_prex + '/method/commonUserLogin',
                data: {"username": uval, "password": hex_md5(pval)},
                async: false,
                success: function (result) {
                    if(result == "fail"){
                        $("#danger_tip").html("用户名或密码错误");
                        $("#danger_div").show();
                    }else{
                        getReferURL("referTo");
                        var json = JSON.parse(result);
                        setStorage('user',json);
                    }
                },
                error:function(error){
                   alert("系统繁忙。。");
                }
            });
        }
    });
}
//初始化验证码登录页面
function initVerifyLogin() {
    $(".content_content").html("");
    $(".content_content").html($("#verify_login_templete").html());
    $("#ver_username_input").focus(function(){
        if(IsPhone($("#ver_username_input").val()) || $("#ver_username_input").val()==""){
            $("#ver_username_input").parent().parent().css("border","1px solid #51d1f4");
            $("#ver_username_input").parent().parent().css("box-shadow", "inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(81,209,244,.6)");
        }else{
            $("#ver_username_input").parent().parent().css("border","1px solid #e73d4a");
            $("#ver_username_input").parent().parent().css("box-shadow", "inset 0 1px 1px rgba(0,0,0,.075), 0 0 6px #f2989f");
        }
    });
    $("#ver_username_input").blur(function(){
        if(IsPhone($("#ver_username_input").val()) || $("#ver_username_input").val()==""){
            $("#ver_username_input").parent().parent().css("border","1px solid #e0e3ec");
            $("#ver_username_input").parent().parent().css("box-shadow","none");
        }else{
            $("#ver_username_input").parent().parent().css("border","1px solid #e73d4a");
            $("#ver_username_input").parent().parent().css("box-shadow", "inset 0 1px 1px rgba(0,0,0,.075), 0 0 6px #f2989f");
        }
    });

    $("#verify_info_input").focus(function(){
        $("#verify_info_input").css("border","1px solid #51d1f4");
        $("#verify_info_input").css("box-shadow", "inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(81,209,244,.6)");
    });
    $("#verify_info_input").blur(function(){
        $("#verify_info_input").css("border","0px solid #e0e3ec");
        $("#verify_info_input").css("box-shadow","none");
    });
    $("#ver_username_input").focus();

    $("#ver_username_input").keyup(function(){
        if(IsPhone($("#ver_username_input").val()) || $("#ver_username_input").val()==""){
            $("#ver_username_input").parent().parent().css("border","1px solid #51d1f4");
            $("#ver_username_input").parent().parent().css("box-shadow", "inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(81,209,244,.6)");
        }else{
            $("#ver_username_input").parent().parent().css("border","1px solid #e73d4a");
            $("#ver_username_input").parent().parent().css("box-shadow", "inset 0 1px 1px rgba(0,0,0,.075), 0 0 6px #f2989f");
        }
    });
    $("#vf_login_button").click(function () {
        var mail = $("#ver_username_input").val();
        var code = $("#verify_info_input").val();
        if(!IsPhone(mail)){
            $("#ver_username_input").parent().parent().css("border","1px solid #e73d4a");
            $("#ver_username_input").parent().parent().css("box-shadow", "inset 0 1px 1px rgba(0,0,0,.075), 0 0 6px #f2989f");
            return;
        }
        if(code==""){
            $("#verify_info_input").css("border","1px solid #e73d4a");
            $("#verify_info_input").css("box-shadow", "inset 0 1px 1px rgba(0,0,0,.075), 0 0 6px #f2989f");
            return;
        }
        if(Date.parse(new Date()) - jsonObj.time > 1000*60*3){//超过三分钟
            $("#danger_tip").html("验证码错误,请重新获取");
            $("#danger_div").show();
            $("#verify_info_input").parent().parent().css("border","1px solid #e73d4a");
            $("#verify_info_input").parent().parent().css("box-shadow", "inset 0 1px 1px rgba(0,0,0,.075), 0 0 6px #f2989f");
            return;
        }
        if(code != jsonObj.code){
            $("#danger_tip").html("验证码错误");
            $("#danger_div").show();
            $("#verify_info_input").parent().parent().css("border","1px solid #e73d4a");
            $("#verify_info_input").parent().parent().css("box-shadow", "inset 0 1px 1px rgba(0,0,0,.075), 0 0 6px #f2989f");
            return;
        }
        $("#danger_div").hide();
        $.ajax({
            type: 'post',
            url: url_prex + '/method/fastUserLogin',
            data: {"username": mail},
            async: false,
            success: function (result) {
                if(result == "fail"){
                    $("#danger_tip").html("登录失败");
                    $("#danger_div").show();
                }else{
                    getReferURL("referTo");
                    var json = JSON.parse(result);
                    setStorage('user',json);
                }
            },
            error:function(error){
               alert("系统繁忙。。");
            }
        });

    });

}
/*忘记密码发送*/
function sendMsgFor(){
    var mail = $("#for_username_input").val();
    if($.trim(mail) == ""){
        $("#danger_tip").html("邮箱不能为空");
        $("#danger_div").show();
        $("#for_username_input").parent().parent().css("border","1px solid #e73d4a");
        $("#for_username_input").parent().parent().css("box-shadow", "inset 0 1px 1px rgba(0,0,0,.075), 0 0 6px #f2989f");
        return;
    }
    if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.exec(mail)) {
        $("#danger_tip").html("邮箱输入不合法");
        $("#danger_div").show();
        $("#for_username_input").parent().parent().css("border","1px solid #e73d4a");
        $("#for_username_input").parent().parent().css("box-shadow", "inset 0 1px 1px rgba(0,0,0,.075), 0 0 6px #f2989f");
        return;
    }
    $('#mpanel4').html("");
    contentCode(mail);
    $(".code_cov").show();
}
/*快捷登录*/
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
    contentCode(mail);
    $(".code_cov").show();
}
function contentCode(mail){
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
            //timerStart();
            sendCode(mail);
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
function sendCode(mail){
    jsonObj = '';
    //var mail = $("#ver_username_input").val();
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
        },
        error:function(error){
            alert("系统繁忙。。");
        }
    });
}

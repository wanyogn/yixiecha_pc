var jsonObj = '';
$(function(){
    var flag = false;
    var status = getStorage("user");
    if(status == "noLogin"){
        alert("您还未登录，请先进行登录!","", function () {
            setStorage('referTo',window.location.href);
            top.location.href = to_login;
        }, {type: 'warning', confirmButtonText: '确定'});
    }else if(status == "outTime"){
        alert("您的登录状态已超时，请重新进行登录!","", function () {
            setStorage('referTo',window.location.href);
            top.location.href = to_login;
        }, {type: 'warning', confirmButtonText: '确定'});
    }else{
        flag = true;
    }
    if(flag){
        userid = status.userid;
        $.getJSON(getUserCenter(userid), function (result) {
            contentActive(result.userinfo);
        });
    }
    $(".form-control").focus(function () {
        $("#danger_tip").hide()
    })
    $(".ui-dialog-submit").click(function () {
        bindLogin();
    })
});
/*填充个人信息*/
function contentActive(json) {
    if(json.nickname == undefined || json.nickname == ""){
        if(json.email == undefined || json.email == ""){
            if(json.username == undefined || json.username == ""){
                $("#username").val("未知用户");
            }else{
                $("#username").val(json.username);
                $("#email").val(json.username);
            }
            $("#bindEmail").show();
        }else{
            $("#username").html(json.email);
            $("#email").val(json.email);
            $("#change_pwd").show();
        }
    }else{
        if(json.email == undefined || json.email == ""){
            $("#bindEmail").show();
        }else{
            $("#change_pwd").show();
        }
        $("#username").html(json.nickname);
        $("#email").val(json.email);
    }
    if(json.headimg == undefined || json.headimg == ""){
        $(".user-pic").html("<span class=\"glyphicon glyphicon-user\"></span>");
        $(".user-pic").addClass("no-pic");
    }else{
        $(".user-pic").html("<img src=\""+json.headimg+"\" class=\"head-img\">")
    }
}

/**
 * 发送验证码
 * @param mail
 */
function sendCode(){
    jsonObj = '';
    var mail = $("#email").val();
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
function timerStart(){
    var timer = null;
    var i = 60;
    timer = setInterval(function () {
        i = i - 1;
        if (i < 1) {
            clearInterval(timer);
            $('.scode').html("发送");
            $('.scode').removeAttr("disabled");
            return;
        }
        $('.scode').html("(" + i + ")s");
        $('.scode').attr("disabled","disabled");
    }, 1000);
}

/**
 * 确认修改
 */
function sureEvent(){
    var username = $("#email").val();
    var code = $(".code").val();
    var pass = $(".password_input").val();
    var rpass = $(".repeat_password_input").val();
    if($.trim(code) == ""){
        $("#danger_tip").html("验证码不能为空");
        $("#danger_tip").show();
        return;
    }
    if(jsonObj != ""){
        if(Date.parse(new Date()) - jsonObj.time > 1000*60*3){//超过三分钟
            $("#danger_tip").html("验证码输入有误,请重新获取");
            $("#danger_tip").show();
            return;
        }else{
            if(code != jsonObj.code){
                $("#danger_tip").html("验证码错误");
                $("#danger_tip").show();
                return;
            }
        }
    }else{
        $("#danger_tip").html("验证码错误");
        $("#danger_tip").show();
        return;
    }
    if(pass.length < 8){
        $("#danger_tip").html("密码不能小于8位数");
        $("#danger_tip").show();
        return;
    }
    if (!/([a-zA-Z]+[0-9]+|[0-9]+[a-zA-Z])/.exec(pass)) {
        $("#danger_tip").html("密码必须由英文和数字组成");
        $("#danger_tip").show();
        return;
    }
    if (pass != rpass) {
        $("#danger_tip").html("两次输入密码不同，请重新输入");
        $("#danger_tip").show();
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
                alert("密码重置成功！","", function () {
                    location.reload();
                }, {type: 'success', confirmButtonText: '确定'});
            }
        },
        error:function(error){
            alert("系统繁忙。。");
        }
    });
}
/*确认绑定事件*/
function bindLogin(){
    var uval = $(".ui-dialog-input-username").val();
    var pval = $(".ui-dialog-input-password").val();
    if($.trim(uval) == "" ){
        $(".tip").html("邮箱账户不能为空！");
        return;
    }
    if($.trim(pval) == ""){
        $(".tip").html("密码不能为空！");
        return;
    }
    $.ajax({
        type: 'post',
        url: url_prex + '/method/commonUserLogin',
        data: {"username": uval, "password": hex_md5(pval)},
        async: false,
        success: function (result) {
            if(result == "fail"){
                $(".tip").html("用户名或密码错误");
            }else{
                var json = JSON.parse(result);
                if(json.openid == "" || json.openid == undefined){
                    var currentUser = getStorage("user");//当前微信的的用户
                    var bindObj = JSON.parse(result);//需要被绑定账号的用户
                    /*采取删除账号的信息，保留微信的信息。防止影响小程序*/
                    updateWxInfo(bindObj.userid,currentUser.userid);
                }else{
                    $(".tip").html("输入的账号已被绑定，请换一个账号！");
                }
            }
        },
        error:function(error){
            alert("系统繁忙。。");
        }
    });
}
/*微信用户的信息与账户信息的整合*/
function updateWxInfo(binduserid,wxuserid){
    $.ajax({
        type: 'post',
        url: url_prex + '/method/updateInfo',
        data: {"binduserid": binduserid, "wxuserid": wxuserid},
        async: false,
        success: function (result) {
            var json = JSON.parse(result);
            clearStorage('user');
            setStorage('user',json);
            hideDialog();
            window.location.reload(true);
        },
        error:function(error){
            alert("系统繁忙。。");
        }
    });
}
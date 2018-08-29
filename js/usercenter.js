$(function(){
    var resultData = '';
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
        $.getJSON(getUserCenter(status.userid), function (result) {
            contentActive(result);

            resultData = result;
        });
    }

    $("#makeCode").click(function () {
        /*if(resultData.email == undefined || resultData.email == ""){
            if(resultData.openid == undefined || resultData.openid == ""){
                alert("请先绑定邮箱，再生成二维码");
                return;
            }

        }*/
        if(resultData.openid == undefined || resultData.openid == ""){
            confirm("是否前往为该账号绑定微信？", "二维码生成失败，该账号未绑定微信！", function (isConfirm) {
                if (isConfirm) {
                    window.location.href="wxQrcodeLogin.html";
                } else {

                }
            }, {confirmButtonText: '是, 前往!', cancelButtonText: '不, 谢谢!'});
        }else{
            makeCode(resultData.id);
        }
    });
    $("#saveInfo").click(function () {
        if(resultData.openid == undefined || resultData.openid == ""){
            confirm("是否前往为该账号绑定微信？", "修改失败，该账号未绑定微信！", function (isConfirm) {
                if (isConfirm) {
                    window.location.href="wxQrcodeLogin.html";
                } else {

                }
            }, {confirmButtonText: '是, 前往!', cancelButtonText: '不, 谢谢!'});
        }else{
            updateInfo();
        }

    });
    $(".ui-dialog-submit").click(function () {
        bindLogin();
    })
})

/*$("#regitserForm input").each(function () {
    params += $(this).serialize() + "&";
});*/
/*填充信息*/
function contentActive(json) {
    if(json.username == undefined || json.username == ""){
        if(json.email == undefined || json.email == ""){
            if(json.nickname == undefined || json.nickname == ""){
            }else{
                $("#username").html(json.nickname);
            }
           // $("#email").removeAttr("disabled");
        }else{
            $("#username").html(json.email);
            $("#email").val(json.email);
        }
    }else{
        if(json.email == undefined || json.email == ""){
            //$("#email").removeAttr("disabled");
            $("#username").html(json.username);
            $("#email").val(json.username);
        }else{
            $("#username").html(json.email);
            $("#email").val(json.email);
        }
    }
    if(json.openid == undefined || json.openid == ""){
        $("#wechat").val("未绑定微信");
        $("#wechat").css({
            "color":"red",
        });
    }else{
        if((json.email == "" || json.email == undefined) && json.username == "" || json.username == undefined){
            $("#wx").after("<a href=\"javascript:showDialog();\" style='color: red;text-decoration: underline'>绑定账号</a>");
        }else{
            if(json.email != undefined || json.email != ""){
                $("#wx").after("<a style='color: red;text-decoration: underline'>已绑定账号"+json.email+"</a>");
            }else{
                $("#wx").after("<a style='color: red;text-decoration: underline'>已绑定账号"+json.username+"</a>");
            }
        }
        $("#wechat").val("已绑定微信");
    }
    $("#userid").val(json.id);
    //$("#email").val(json.email);
    $("#realname").val(json.realname);
    $("#mobile").val(json.mobilephone);

    $("#companyname").val(json.companyname);
    $("#companyaddress").val(json.companyaddress);
    $("#department").val(json.department);
    $("#job").val(json.job);
}
/*生成企业二维码*/
function makeCode (id) {
    $("#qrcode").html("");
    var qrcode = new QRCode("qrcode");
    qrcode.makeCode("https://www.yixiecha.cn/cardCode/card?id="+id);
}
/*验证手机号是否合法*/
function IsPhone(num){
    return /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/.test(num);
}
/*修改用户信息*/
function updateInfo() {
    var userid = $("#userid").val();
    var realname = $("#realname").val();
    var mobile = $("#mobile").val();
    var companyname = $("#companyname").val();
    var companyaddress = $("#companyaddress").val();
    var department = $("#department").val();
    var job = $("#job").val();
     var email = $("#email").val();
    $.ajax({
        type: 'post',
        url: url_prex + '/method/updateUserInfo',
        //url: '/method/updateUserInfo',
        data: {
            userid    : userid,
            realname : realname,
            mobile  : mobile,
            companyname : companyname,
            companyaddress : companyaddress,
            department : department,
            job : job,
            email:email
        },
        async: false,
        success: function (result) {
            if(result == "success"){
                alert("修改成功");
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
           // console.log(result);
            console.log(result);
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


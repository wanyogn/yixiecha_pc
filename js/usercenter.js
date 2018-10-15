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
    var index_url = window.location.search;//格式是【例：?code=*&state=*】
    var code = getQueryVariable("code");
    var state = getQueryVariable("state");
    if(code != "") {
        $.ajax({
            type: 'post',
            url: url_prex + '/method/wxtoken',
            data: {"code": code},
            async: false,
            success: function (result) {
                var json = JSON.parse(result);
                if (json != "" && json != null) {
                        $.ajax({
                            type: 'post',
                            url: url_prex + '/method/queryUserInfo',
                            data: {"unionid": json.unionid},
                            async: false,
                            success: function (res) {
                                if(res == "fail"){//没有存在数据库中
                                    $.ajax({
                                        type: 'post',
                                        url: url_prex + '/method/wxBindUser',
                                        data: {
                                            "openid": json.openid,
                                            "unionid": json.unionid,
                                            "nickname": json.nickname,
                                            "sex": json.sex,
                                            "headimgurl": json.headimgurl,
                                            state: state
                                        },
                                        async: false,
                                        success: function (res) {
                                            console.log("绑定成功");
                                        }
                                    })
                                }else{
                                    var json1 = JSON.parse(res);
                                    if ((json1.username == "" || json1.username == undefined || json1.username == null) && (json1.email == "" || json1.email == undefined || json1.email == null)) {
                                        $.ajax({
                                            type: 'post',
                                            url: url_prex + '/method/wxBindUserInfo',
                                            data: {state: state, wxid: json1.id,openid:json.openid},//有可能是只关注了小程序、这时openID为空
                                            async: false,
                                            success: function (res) {
                                                console.log("成功");
                                            }
                                        })
                                    } else {
                                        alert("该微信已绑定账号");
                                    }
                                }
                            },
                            error: function (error) {
                                alert("系统繁忙。。");
                            }
                        });

                }
            }
        })
    }

    if(flag){
        $.getJSON(getUserCenter(status.userid), function (result) {
            contentActive(result.userinfo,result.userCard);

            resultData = result.userinfo;
        });
    }

    $("#makeCode").click(function () {
        if(resultData.unionid == undefined || resultData.unionid == ""){
            confirm("是否前往为该账号绑定微信？", "二维码生成失败，该账号未绑定微信！", function (isConfirm) {
                if (isConfirm) {
                   // window.location.href="wxQrcodeLogin.html";
                    bindWX(status.userid);
                } else {

                }
            }, {confirmButtonText: '是, 前往!', cancelButtonText: '不, 谢谢!'});
        }else{
            makeCode(resultData.id);
        }
    });
    $("#saveInfo").click(function () {
        if(resultData.unionid == undefined || resultData.unionid == ""){
            confirm("是否前往为该账号绑定微信？", "修改失败，该账号未绑定微信！", function (isConfirm) {
                if (isConfirm) {
                    bindWX(status.userid);
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
function contentActive(json,json2) {
    /*if(json.username == undefined || json.username == ""){
        if(json.email == undefined || json.email == ""){
            if(json.nickname == undefined || json.nickname == ""){
            }else{
                $("#username").html(json.nickname);
            }
        }else{
            $("#username").html(json.email);
            $("#email").val(json.email);
        }
    }else{
        if(json.email == undefined || json.email == ""){
            $("#username").html(json.username);
            $("#email").val(json.username);
        }else{
            $("#username").html(json.email);
            $("#email").val(json.email);
        }
    }*/
    if(json.nickname == undefined || json.nickname == ""){
        if(json.email == undefined || json.email == ""){
            if(json.username == undefined || json.username == ""){
                $("#username").val("未知用户");
            }else{
                $("#username").val(json.username);
                $("#email").val(json.username);
            }
        }else{
            $("#username").html(json.email);
            $("#email").val(json.email);
        }
    }else{
        $("#username").html(json.nickname);
        $("#email").val(json.email);
    }

    if(json.unionid == undefined || json.unionid == ""){
        $("#wechat").val("未绑定微信");
        $("#wechat").css({
            "color":"red",
        });
        $("#wx").after("<a href=\"javascript:bindWX("+json.id+");\" style='color: red;text-decoration: underline'>绑定微信</a>");
    }else{
        if((json.email == "" || json.email == undefined) && (json.username == "" || json.username == undefined)){
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
    if(json.headimg == undefined || json.headimg == ""){
        $(".user-pic").html("<span class=\"glyphicon glyphicon-user\"></span>");
        $(".user-pic").addClass("no-pic");
    }else{
        $(".user-pic").html("<img src=\""+json.headimg+"\" class=\"head-img\">")
    }
    if(json2 == undefined){

    }else{
        $("#realname").val(json2.realname);
        $("#mobile").val(json2.mobilephone);

        $("#companyname").val(json2.companyname);
        $("#companyaddress").val(json2.companyaddress);
        $("#department").val(json2.department);
        $("#job").val(json2.job);
        makeCode(json2.userid,json.headimg);
    }
}
/*生成企业二维码*/
function makeCode (id,headimg) {
    $("#qrcode").html("");
    $("#qrcode").qrcode({
        render: "canvas", // 渲染方式有table方式（IE兼容）和canvas方式
        width: 200, //宽度
        height: 200, //高度
        text: utf16to8("https://www.yixiecha.cn/cardCode/card?id="+id), //内容
        typeNumber: -1,//计算模式
        correctLevel: 2,//二维码纠错级别
        background: "#ffffff",//背景颜色
        foreground: "#000000"  //二维码颜色
    });
    $("#qrCodeIco").attr("src",headimg);
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

/**
 * 账号绑定微信
 */
function bindWX(userid){
    $.ajax({
        type: 'post',
        url: url_prex + '/method/wxbindopenCode',
        //url: '/method/wxbindopenCode',
        data: {
            userid    : userid,
        },
        async: false,
        success: function (result) {
            //openwindow(result,"微信绑定",900,500)
            window.open(result,'_self')
        },
        error:function(error){
            alert("系统繁忙。。");
        }
    });
}

/**
 *
 * @param url  转向网页的地址;
 * @param name  网页名称，可为空;
 * @param iWidth 弹出窗口的宽度;
 * @param iHeight 弹出窗口的高度;
 */
function openwindow(url,name,iWidth,iHeight)
{
    var iTop = (window.screen.height-30-iHeight)/2;       //获得窗口的垂直位置;
    var iLeft = (window.screen.width-10-iWidth)/2;        //获得窗口的水平位置;
    window.open(url,name,'height='+iHeight+',,innerHeight='+iHeight+',width='+iWidth+',innerWidth='+iWidth+',top='+iTop+',left='+iLeft+',toolbar=no,menubar=no,scrollbars=auto,resizeable=no,location=no,status=no');
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

/**
 * utf16转utf8
 * @param str
 * @returns {string}
 */
function utf16to8(str) {
    var out, i, len, c;
    out = "";
    len = str.length;
    for (i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if ((c >= 0x0001) && (c <= 0x007F)) {
            out += str.charAt(i);
        } else if (c > 0x07FF) {
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
            out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        } else {
            out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        }
    }
    return out;
};




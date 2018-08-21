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
        makeCode(resultData.id);
    });
    $("#saveInfo").click(function () {
        updateInfo();
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
            $("#email").removeAttr("disabled");
        }else{
            $("#username").html(json.email);
        }
    }else{
        if(json.email == undefined || json.email == ""){
            $("#email").removeAttr("disabled");
            $("#username").html(json.username);
        }else{
            $("#username").html(json.email);
        }
    }
    $("#userid").val(json.id);
    $("#email").val(json.email);
    $("#realname").val(json.realname);
    $("#mobile").val(json.mobilephone);
    $("#wechatnum").val(json.wechatnum);
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
    var wechatnum = $("#wechatnum").val();
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
            wechatnum:wechatnum,
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

var file = '';
var beforeurl = '';//由哪个页面传过来
var delId = '';//需要删除的图片ID

$(function() {

    var flag = false;
    var status = getStorage("user");
    if(status == "noLogin"){
        setStorage('referTo',window.location.href);
        alert("您还未登录，请先进行登录!","", function () {
            location.href = to_login;
        }, {type: 'warning', confirmButtonText: '确定'});
    }else if(status == "outTime"){
        setStorage('referTo',window.location.href);
        alert("您的登录状态已超时，请重新进行登录!","", function () {
            location.href = to_login;
        }, {type: 'warning', confirmButtonText: '确定'});
    }else{
        flag = true;
    }
    if(!flag) return;

    $(".info_picture_div").click(function () {
        $("#chooseImage").click();
        $("#pic").remove();
    });
    $('#chooseImage').on('change', function () {
        var filePath = $(this).val(),         //获取到input的value，里面是文件的路径
            fileFormat = filePath.substring(filePath.lastIndexOf(".")).toLowerCase(),
            src = window.URL.createObjectURL(this.files[0]); //转成可以在本地预览的格式

        // 检查是否是图片
        if (!fileFormat.match(/.png|.jpg|.jpeg/)) {
            //error_prompt_alert('上传错误,文件格式必须为：png/jpg/jpeg');
            return;
        }

        $('#pictureImage').attr('src', src);
    });
    $(".info_picture_div").hover(function () {
        $(this).append("<p id='pic'><img src='" + $("#pictureImage").attr("src") + "' id='pic1'></p>");
        $(".info_picture_div").mousemove(function (e) {
            $("#pic").css({
                "top": (e.pageY + 10) + "px",
                "left": (e.pageX + 20) + "px"
            }).fadeIn("fast");
            // $("#pic").fadeIn("fast");
        });
    }, function () {
        $("#pic").remove();
    });

    $(".close_img").click(function () {
        $("#company_name_input").val("");
    });
    beforeurl = decodeURI(document.referrer);
    if(beforeurl.endsWith("usercenter_audit.html")){
        let companyName = decodeURI(getQueryVariable("companyname"));
        delId = getQueryVariable("delId");
        $("#company_name_input").val(companyName);
    }
});
function gen_base64(_this) {

    file = _this.files[0];
    if(file.size > 5*1024*1024 ){
        alert( "文件太大！" );
        $("#chooseImage").val("");
        return;
    }else {
        var r = new FileReader();  //本地预览
        r.onload = function (e) {
            file = e.target.result;
        };
        r.readAsDataURL(file);    //Base64
    }
}
function submit() {
    var flag = false;
    var status = getStorage("user");
    if(status == "noLogin"){
        setStorage('referTo',window.location.href);
        alert("您还未登录，请先进行登录!","", function () {
            top.location.href = to_login;
        }, {type: 'warning', confirmButtonText: '确定'});
    }else if(status == "outTime"){
        setStorage('referTo',window.location.href);
        alert("您的登录状态已超时，请重新进行登录!","", function () {
            top.location.href = to_login;
        }, {type: 'warning', confirmButtonText: '确定'});
    }else{
        flag = true;
    }
    if(!flag) return;

    var company_name = $("#company_name_input").val();
    if (company_name == "") {
        alert("请填写有效的公司名称!");
        return;
    }
    if (file == "") {
        alert("请选择有效的图片!");
        return;
    }
    var type = "";
    var radio = document.getElementsByName("radio");
    for (var i = 0; i < radio.length; i++) {
        if (radio[i].checked == true) {
            type = radio[i].value;
            break;
        }
    }
    if (type == ""){
        alert("请选择资质!");
        return;
    }
    if(beforeurl.endsWith("usercenter_audit.html")){
        againUploadByCondition(file,status.userid,company_name,type);
    }else{
        uploadPic(file,status.userid,company_name,type);
    }
}
function uploadPic(file,userid,company_name,type) {
    var formdata=new FormData();
    formdata.append("file",file);
    formdata.append("userid",userid);
    formdata.append("company_name",company_name);
    formdata.append("type",type);

    $.ajax({
        url: url_prex+'/method/uploadCompanyCertificate',
        type: 'post',
        data: formdata,
        processData : false,
        contentType : false,
        async: true,
        success: function (result) {
            $(".content_center").empty();
            $(".content_center").append($("#success_template").html())
        }
    });
}
/**
 * 删除图片
 */
function againUploadByCondition(file,userid,company_name,type) {
    $.ajax({
        url : url_prex+'/method/againUploadByCondition',
        type : 'POST',
        data : {id:delId,classtype:'com'},
        async : true,
        success : function(data) {
            //uploadFile(file);
            uploadPic(file,userid,company_name,type)
        },
        error:function(error){
            alert("系统异常..");
        }
    });
}
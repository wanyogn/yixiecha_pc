var key = '';
var count = 0;//同名产品的总数量
var size = 5;//每页的数量
var start_page = 1;
var person_page=0;
var person_num=1;
var person_size=3;
var person_key='';

$(document).ready(function(){

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
    if(flag){
        var keyword_from_url = window.location.search;//格式是【例：?class=pro&id=*】
        person_key = keyword_from_url.substring(14);
        $.getJSON(getProURL(person_key), function (json) {
            data = json;
            setHeader(data);
            detailContentActive(data);
            getSamePro(key,0);

            var beforeurl = decodeURI(document.referrer);
            var afterurl = decodeURI(document.location.href);
            getInsertUserurljumpURL(status.userid,beforeurl,afterurl,data.datas[0].product_name_ch);
        });
        queryRecommendPerson(person_key,0,person_size);
    }
})
/**
 * 绑定点击事件
 * @param obj
 */
function bindClick(obj) {
    var userid = $(obj).find(".userid").val();
    makeCode(userid);
    $(obj).find(".person_bottom").slideDown();
    $(obj).siblings().find(".person_bottom").slideUp();

}
function makeCode(id){
    $(".qrcode"+id).html("");
    $(".qrcode"+id).qrcode({
        render: "canvas", // 渲染方式有table方式（IE兼容）和canvas方式
        width: 100, //宽度
        height: 100, //高度
        text: utf16to8("https://www.yixiecha.cn/cardCode/card?id="+id), //内容
        typeNumber: -1,//计算模式
        correctLevel: 2,//二维码纠错级别
        background: "#ffffff",//背景颜色
        foreground: "#000000"  //二维码颜色
    });
}
/**
 * 根据产品的ID获的医械推荐人
 */
function queryRecommendPerson(productid,num,size) {
    $.ajax({
        type: 'post',
        url: url_prex + '/method/selectUsersByProductId',
        data: {"productid":productid,"num":num,"size":size},
        async: false,
        success: function (result) {
            var json = JSON.parse(result);

            $(".person_count").html(json.matchCount);
            person_page = Math.ceil(json.matchCount/person_size);
            if(json.matchCount > person_size){
                $(".pages_main").show();
            }
            contentRecommendPerson(json);
        },
        error:function () {

        }
    })
}

/**
 * 填充推荐人
 */
function contentRecommendPerson(data) {
    $(".person_main").html("");
    var json = data.datas;
    if(json.length > 0){
        for(let i = 0;i<json.length;i++){
            $(".person_main").append($("#person_template").html())
        }
        $('.pages_main').pagination({
            currentPage: person_num,
            totalPage: person_page,
            isShow: false,
            count: 5,
            prevPageText: "<",
            nextPageText: ">",
            callback:function(current){
                person_num = current;
                sendAjax(url_prex +'/method/selectUsersByProductId',{"productid":person_key,"num":current-1,"size":person_size},function (result) {
                    var json = JSON.parse(result);
                    contentRecommendPerson(json);
                })
            }
        });
        var data_list = $(".person");
        for(var j = 0;j < json.length;j++) {
            $(data_list[j].getElementsByClassName("userid")).val(json[j].id);
            $(data_list[j].getElementsByClassName("qrcode")).addClass("qrcode"+json[j].id);
            $(data_list[j].getElementsByTagName("img")).attr("src",json[j].headimg);
            $(data_list[j].getElementsByTagName("h4")).html(json[j].realname);
            $(data_list[j].getElementsByClassName("person_company")).html(json[j].department+"-"+json[j].job);
            $(data_list[j].getElementsByClassName("person_address")).html(json[j].companyname);
        }

    }else{
        $(".person_main").html($("#none_info").html());
    }
}

function detailContentActive(data){
    if(data.datas.length > 0){
        var obj = data.datas[0];
        key = obj.product_name_ch;
        $(".general_product_name_ch").html(obj.product_name_ch);
        $(".general_ivd").html(getIVD(obj.product_ivd));
        $(".general_register_code").html(obj.register_code);
        var maker_name = obj.maker_name_ch;
        if(maker_name == ''){
            maker_name = obj.agent;
        }
        $(".general_maker_name_ch").html(maker_name);
        $(".general_product_mode").html(obj.product_mode);
        $(".general_src_loc_revised").html(getSrc_Loc(obj.src_loc));
        var fan = obj.product_scope;
        if(fan == ""){
            fan = obj.purpose;
        }
        $(".general_product_scope").html(fan);
        $(".general_main_class_revised").html(getMain_Class(obj.main_class));
        $(".general_class_code_revised").html(getClass_Code(obj.class_code));
        $(".general_valid_state").html(obj.manage_type);
        $(".general_deptFlagsCH").append(getDeptAndDisease(obj.deptFlagsCH));
        $(".general_diseaseFlagsCH").append(getDeptAndDisease(obj.diseaseFlagsCH));

        if(obj.main_class == 1){//I类备案
            $(".left_two").append($("#product_ba").html());
            DetailForBA(obj);
        }else{
            if(obj.src_loc == 0){//国产
                $(".left_two").append($("#product_gc").html());
                DetailForGC(obj);
            }else if(obj.src_loc == 1){//进口
                $(".left_two").append($("#product_jk").html());
                DetailForJK(obj);
            }else{//其他的利用国产来解析
                $(".left_two").append($("#product_gc").html());
                DetailForGC(obj);
            }
        }
    }
	

    if(obj.picture_addr == undefined){
       $(".product_image").append($("#no_pic").html());
    }else{
        $(".product_image").append($("#pic").html());
        $(".product_image img").attr("src","../upload/product/"+obj.picture_addr);
    }
}
/*国产*/
function DetailForGC(obj){
    $(".table_gc_register_code").html(obj.register_code);
    $(".table_gc_maker_name").html(obj.maker_name_ch);
    $(".table_gc_maker_address").html(obj.maker_addr_ch);
    $(".table_gc_production_site").html(obj.production_site_ch);
    $(".table_gc_agent_name").html(obj.agent);
    $(".table_gc_agent_addr").html(obj.agent_addr);
    $(".table_gc_product_name").html(obj.product_name_ch);
    $(".table_gc_product_mode").html(obj.product_mode);
    $(".table_gc_product_struct").html(obj.product_struct);
    $(".table_gc_product_scope").html(obj.product_scope);
    $(".table_gc_main_component").html(obj.main_component);
    $(".table_gc_expected_use").html(obj.purpose);
    $(".table_gc_storage_condition").html(obj.storage_condition);
    $(".table_gc_product_standard").html(obj.product_standard);
    $(".table_gc_other_thing").html(obj.others);
    $(".table_gc_attachment").html(obj.attachment);
    $(".table_gc_remark").html(obj.remarks);
    $(".table_gc_change_date").html(obj.change_date);
    $(".table_gc_change_condition").html(obj.change_content);
    $(".table_gc_approval_dept").html(obj.approval_dept);

    if (obj.approval_complete_mark == 0){
        $(".table_gc_approval_date").html(obj.approval_date.substring(0,10));
    }else if(obj.approval_complete_mark == 1){
        $(".table_gc_approval_date").html(obj.approval_date.substring(0,4));
    }else{
        $(".table_gc_approval_date").html(obj.approval_date.substring(0,7));
    }

    if (obj.expiry_complete_mark == 0){
        $(".table_gc_expiry_date").html(obj.expiry_date.substring(0,10));
    }else if(obj.expiry_complete_mark == 1){
        $(".table_gc_expiry_date").html(obj.expiry_date.substring(0,4));
    }else{
        $(".table_gc_expiry_date").html(obj.expiry_date.substring(0,7));
    }

    if (obj.vacancy_mark == 0){
    }else if(obj.vacancy_mark == 1){
        $(".table_gc_approval_date").html("");
    }else if(obj.vacancy_mark == 2){
        $(".table_gc_expiry_date").html("");
    }else{
        $(".table_gc_approval_date").html("");
        $(".table_gc_expiry_date").html("");
    }
}
/*进口详情*/
function DetailForJK(obj){
    $(".table_jk_register_code").html(obj.register_code);
    $(".table_jk_maker_name").html(obj.maker_name_en);
    $(".table_jk_maker_name_ch").html(obj.maker_name_ch);
    $(".table_jk_maker_area_ch").html(obj.maker_area_ch);
    $(".table_jk_maker_area_en").html(obj.maker_area_en);
    $(".table_jk_maker_address").html(obj.maker_addr_en);
    $(".table_jk_production_site").html(obj.production_site_en);
    $(".table_jk_agent_name").html(obj.agent);
    $(".table_jk_agent_addr").html(obj.agent_addr);
    $(".table_jk_service_agency").html(obj.service_agency);
    $(".table_jk_product_name").html(obj.product_name_en);
    $(".table_jk_product_name_ch").html(obj.product_name_ch);
    $(".table_jk_product_mode").html(obj.product_mode);
    $(".table_jk_product_struct").html(obj.product_struct);
    $(".table_jk_product_scope").html(obj.product_scope);
    $(".table_jk_main_component").html(obj.main_component);
    $(".table_jk_expected_use").html(obj.purpose);
    $(".table_jk_storage_condition").html(obj.storage_condition);
    $(".table_jk_product_standard").html(obj.product_standard);
    $(".table_jk_other_thing").html(obj.others);
    $(".table_jk_attachment").html(obj.attachment);
    $(".table_jk_remark").html(obj.remarks);
    $(".table_jk_change_date").html(obj.change_date);
    $(".table_jk_change_condition").html(obj.change_content);
    $(".table_jk_approval_dept").html(obj.approval_dept);

    if (obj.approval_complete_mark == 0){
        $(".table_jk_approval_date").html(obj.approval_date.substring(0,10));
    }else if(obj.approval_complete_mark == 1){
        $(".table_jk_approval_date").html(obj.approval_date.substring(0,4));
    }else{
        $(".table_jk_approval_date").html(obj.approval_date.substring(0,7));
    }

    if (obj.expiry_complete_mark == 0){
        $(".table_jk_expiry_date").html(obj.expiry_date.substring(0,10));
    }else if(obj.expiry_complete_mark == 1){
        $(".table_jk_expiry_date").html(obj.expiry_date.substring(0,4));
    }else{
        $(".table_jk_expiry_date").html(obj.expiry_date.substring(0,7));
    }

    if (obj.vacancy_mark == 0){
    }else if(obj.vacancy_mark == 1){
        $(".table_jk_approval_date").html("");
    }else if(obj.vacancy_mark == 2){
        $(".table_jk_expiry_date").html("");
    }else{
        $(".table_jk_approval_date").html("");
        $(".table_jk_expiry_date").html("");
    }
}
/*备案详情*/
function DetailForBA(obj){
    $(".table_ba_register_code").html(obj.register_code);
    $(".table_ba_maker_name").html(obj.maker_name_ch);
    $(".table_ba_maker_address").html(obj.maker_addr_ch);
    $(".table_ba_production_site").html(obj.production_site_ch);
    $(".table_ba_agent_name").html(obj.agent);
    $(".table_ba_agent_addr").html(obj.agent_addr);
    $(".table_ba_product_name").html(obj.product_name_ch);
    $(".table_ba_product_level").html(obj.architectural_feature);
    $(".table_ba_product_mode").html(obj.product_mode);
    $(".table_ba_product_struct").html(obj.product_struct);
    $(".table_ba_product_scope").html(obj.product_scope);
    $(".table_ba_main_component").html(obj.main_component);
    $(".table_ba_expected_use").html(obj.purpose);
    $(".table_ba_storage_condition").html(obj.storage_condition);
    $(".table_ba_remark").html(obj.remarks);
    //$(".table_ba_approval_date").html(obj.approval_date);
    $(".table_ba_current_state").html(obj.current_state);
    $(".table_ba_change_condition").html(obj.change_content);
    $(".table_ba_approval_dept").html(obj.approval_dept);

    if (obj.approval_complete_mark == 0){
        $(".table_ba_approval_date").html(obj.approval_date.substring(0,10));
    }else if(obj.approval_complete_mark == 1){
        $(".table_ba_approval_date").html(obj.approval_date.substring(0,4));
    }else{
        $(".table_ba_approval_date").html(obj.approval_date.substring(0,7));
    }

    if (obj.vacancy_mark == 0){
    }else if(obj.vacancy_mark == 1){
        $(".table_ba_approval_date").html("");
    }else if(obj.vacancy_mark == 2){

    }else{
        $(".table_ba_approval_date").html("");
    }
}
/*适用科室*/
function getDeptAndDisease(data){
	var _html = '';
	if(data > 0){
		var arr = data.split(" ");
		for(var i = 0;i < arr.length;i++){
			_html += "<p>"+arr[i]+"</p>"
		}
	}else{
		_html +="<p>无</p>"
	}
	return _html;
}

/*赋值搜索栏的信息*/
function setHeader(data){
	var obj = data.datas[0];
	var header = $(window.frames["iframe_top_name"].document).find("#header_search_input");
	header.val(obj.product_name_ch);
}

/**
 * 同名产品
 * @param key
 * @param num
 */
function getSamePro(key,num){
    $.getJSON(getSameProURL(num,key,size,person_key), function (json) {
        count = json.matchCount;
        $(".count").html(count);
        if(count > 0){
            contentActivePro(json);
            $("#same_product").show();
        }else{
            //$("#same_product").remove();
        }
    });
}
function contentActivePro(json){
    $(".same_product_page").prevAll().remove();
    var dataSize = json.datas.length;
    if(size > 0){
        for(var i = 0;i < dataSize;i++){
            $(".same_product_page").before($(".same_product_template").html());
        }
        page_total = Math.ceil(count/size);
        $('.page').pagination({
            currentPage: start_page,
            totalPage: page_total,
            isShow: false,
            count: 5,
            isShow: false,// 是否显示首尾页
            prevPageText: "<",
            nextPageText: ">",
            callback:function(current){
                start_page = current;
                $.getJSON(getSameProURL(current-1,key,size,person_key), function (json) {
                    contentActivePro(json);
                })
            }
        });
        var data_list = $(".product");
        for(var j = 0;j < dataSize;j++){
            var obj = json.datas[j];
            $(data_list[j].getElementsByTagName("h3")).html(getText(obj.product_name_ch,10));
            $(data_list[j].getElementsByClassName("name_a")).attr("href",$(data_list[j].getElementsByClassName("name_a")).attr("href")+obj.id);
            var company_name = obj.maker_name_ch;
            if(company_name == ''){
                company_name = obj.agent;
            }
            $(data_list[j].getElementsByClassName("company_name")).html(getText(company_name,15));
            $(data_list[j].getElementsByClassName("company_a")).attr("href",$(data_list[j].getElementsByClassName("company_a")).attr("href")+company_name);

            $(data_list[j].getElementsByClassName("register_code")).html(getText(obj.register_code,15));

            $(data_list[j].getElementsByClassName("register_a")).attr("href",$(data_list[j].getElementsByClassName("register_a")).attr("href")+obj.id);
        }    
    }
}

//弹出框水平垂直居中
(window.onresize = function () {
    var win_height = $(window).height();
    var win_width = $(window).width();
    if (win_width <= 768){
        $(".tailoring-content").css({
            "top": (win_height - $(".tailoring-content").outerHeight())/2,
            "left": 0
        });
    }else{
        $(".tailoring-content").css({
            "top": (win_height - $(".tailoring-content").outerHeight())/2,
            "left": (win_width - $(".tailoring-content").outerWidth())/2
        });
    }
})();
//弹出图片裁剪框
$(".product_image").on("click","#replaceImg",function () {
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
        $.ajax({
            type: 'post',
            url: url_prex+'/method/selectAuditCountByCondition',
            data: {"objectid":person_key, userid: status.userid},
            async: false,
            success: function (data) {
                if(data == 0) flag = true;
                else alert("该产品你已提交过图片，并处于审核中");
            }
        })
    }

    if(flag) $(".tailoring-cropper").toggle();

});
//图像上传
function selectImg(file) {
    if (!file.files || !file.files[0]){
        return;
    }
    var reader = new FileReader();
    reader.onload = function (evt) {
        var replaceSrc = evt.target.result;
        var image = new Image();
        image.onload=function(){
            var width = image.width;
            var height = image.height;
            if(width < 200 || height < 200){
                alert("图片最短边至少为200px！");
                return;
            }else{
                $('#tailoringImg').cropper('replace', replaceSrc,false);//默认false，适应高度，不失真
            }
        };
        image.src= replaceSrc;
        //更换cropper的图片

    }
    reader.readAsDataURL(file.files[0]);
}
//cropper图片裁剪
$('#tailoringImg').cropper({
    aspectRatio: 1/1,//默认比例
    preview: '.previewImg',//预览视图
    guides: false,  //裁剪框的虚线(九宫格)
    autoCropArea: 1,  //0-1之间的数值，定义自动剪裁区域的大小，默认0.8
    movable: false, //是否允许移动图片
    dragCrop: true,  //是否允许移除当前的剪裁框，并通过拖动来新建一个剪裁框区域
    movable: true,  //是否允许移动剪裁框
    resizable: true,  //是否允许改变裁剪框的大小
    zoomable: false,  //是否允许缩放图片大小
    mouseWheelZoom: false,  //是否允许通过鼠标滚轮来缩放图片
    touchDragZoom: false,  //是否允许通过触摸移动来缩放图片
    rotatable: true,  //是否允许旋转图片
    viewMode: 1,
    minCropBoxWidth: 150,
    minCropBoxHeight: 150,
    crop: function(e) {
        // 输出结果数据裁剪图像。
    }
});
//旋转
$(".cropper-rotate-right").on("click",function () {
    $('#tailoringImg').cropper("rotate", 90);
});
$(".cropper-rotate-left").on("click",function () {
    $('#tailoringImg').cropper("rotate", -90);
});
//复位
$(".cropper-reset-btn").on("click",function () {
    $('#tailoringImg').cropper("reset");
});
//裁剪后的处理
$("#sureCut").on("click",function () {
    if ($("#tailoringImg").attr("src") == null ){
        alert("未选择有效图片！");
        return false;
    }else{
        var cas = $('#tailoringImg').cropper('getCroppedCanvas');//获取被裁剪后的canvas
        var base64url = cas.toDataURL('image/jpeg'); //转换为base64地址形式
        $("#finalImg").prop("src",base64url);//显示为图片的形式
        uploadFile(encodeURIComponent(base64url));
        //关闭裁剪框
        closeTailor();

    }
});
//关闭裁剪框
function closeTailor() {
    $(".tailoring-cropper").toggle();
}
function operSuccessTip() {
    $(".tailoring-tip").toggle();
}
function uploadFile(file) {
    var userid = getStorage("user").userid;
    $.ajax({
        url : url_prex+'/method/uploadPicture',
        type : 'POST',
        data : "file=" + file+"&name="+key+"&id="+person_key+"&userid="+userid,
        async : true,
        success : function(data) {
            //alert("上传成功！请耐心等待，审核结果将在个人信息->审核信息中查看");
            if(data == "success"){
                operSuccessTip();
            }
        },
        error:function(error){
            alert("系统异常..");
        }
    });
}


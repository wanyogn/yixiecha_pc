var key = '';
var count = 0;//同名产品的总数量
var size = 5;//每页的数量
var num = 0;
var page = 0;

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
        var keyword_sub = keyword_from_url.substring(14);
        $.getJSON(getProURL(keyword_sub), function (json) {
            data = json;
            setHeader(data);
            detailContentActive(data);
            getSamePro(key,0);

            var beforeurl = decodeURI(document.referrer);
            var afterurl = decodeURI(document.location.href);
            getInsertUserurljumpURL(status.userid,beforeurl,afterurl,data.datas[0].product_name_ch);
        });
        queryRecommendPerson(keyword_sub);
    }
    
    $(".page_before").mouseover(function(){
    	$(this).css("background","#f49f11");
    	$(this).find("img").attr("src","images/left_hover.png");
    }).mouseout(function(){
    	$(this).css("background","#fff");
    	$(this).find("img").attr("src","images/left.png");
    });
    $(".page_after").mouseover(function(){
    	$(this).css("background","#f49f11");
    	$(this).find("img").attr("src","images/right_hover.png");
    }).mouseout(function(){
    	$(this).css("background","#fff");
    	$(this).find("img").attr("src","images/right.png");
    });

    $(".page_before").click(function(){
        
        if(num > 0){
            num--;
            contentSamePro(key,num);
        }
    });
     $(".page_after").click(function(){
        
        if(num < page-1){
            num++;
            contentSamePro(key,num);
        }
        
     });
})

/**
 * 根据产品的ID获的医械推荐人
 */
function queryRecommendPerson(id) {
    /*$.getJSON(url_prex+"/method/selectUsersByProductId", function (json) {
        console.log(json);
    })*/
    $.ajax({
        type: 'post',
        url: url_prex + '/method/selectUsersByProductId',
        data: {"productid":id},
        async: false,
        success: function (result) {
            var json = JSON.parse(result);
            contentRecommendPerson(json);
        },
        error:function () {

        }
    })
}

/**
 * 填充推荐人
 */
function contentRecommendPerson(json) {
    if(json.length > 0){
        for(let i = 0;i<json.length;i++){
            $(".person_main").append($("#person_template").html())
        }
        var data_list = $(".person");
        for(var j = 0;j < json.length;j++) {
            $(data_list[j].getElementsByTagName("img")).attr("src",json[j].userinfo.headimg);
            $(data_list[j].getElementsByTagName("h4")).html(json[j].userCard.realname);
            $(data_list[j].getElementsByClassName("person_company")).html(json[j].userCard.job+"-"+json[j].userCard.companyname);
            $(data_list[j].getElementsByClassName("person_address")).html(json[j].userCard.companyaddress);
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
       $(".product_image_main").html($("#no_pic").html());
    }else{
        $(".product_image_main").html($("#pic").html());
        $(".product_image_main img").attr("src","../upload/"+obj.picture_addr);
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

function getSamePro(key,num){
    $.getJSON(getSameProURL(num,key,size), function (json) {
        count = json.matchCount;
        $(".count").html(count);
        if(count > 0){
            contentActivePro(json);
            if(count > size){
                $(".same_product_page").show();
                page = Math.ceil(count/size)
            }
        }
    });
}
function contentSamePro(key,num){
    $(".same_product_page").prevAll().remove();
    $.getJSON(getSameProURL(num,key,size), function (json) {
        contentActivePro(json);
    });
}
function contentActivePro(json){
    var size = json.datas.length;
    if(size > 0){
        for(var i = 0;i < size;i++){
            $(".same_product_page").before($(".same_product_template").html());
        }
        var data_list = $(".product");
        for(var j = 0;j < size;j++){
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


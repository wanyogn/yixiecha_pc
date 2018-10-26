var keyword = '';
var all_Count = '';
var ZB_Count = '';
var page_size = 3;
var start_page = 1;
var start_page_zb = 1;

$(document).ready(function(){
	var scxk = 0,scba = 0,jyxk = 0,jyba = 0,xxfw = 0,jyfw = 0;
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
    	var keyword_from_url = window.location.search;//格式是【例：?class=pro&keyword=*】
	    var keyword_sub = keyword_from_url.substring(19);
	    keyword = decodeURI(keyword_sub);
	    $.getJSON(getComURL(keyword), function (json) {
	    	data = json;
	    	detailContentActive(data);
	    	var beforeurl = decodeURI(document.referrer);
            var afterurl = decodeURI(document.location.href);
            getInsertUserurljumpURL(status.userid,beforeurl,afterurl,keyword);
	    });
	    $.getJSON(getProByCom(0,keyword,page_size), function (json) {
	    	data = json;
	    	all_Count = data.matchCount;
	    	contentProductActive(data);
	    });
	    $.getJSON(getZBGGByCom(0,keyword,page_size), function (json) {
	    	data = json;
	    	ZB_Count = data.matchCount;
	    	contentZBActive(data);
	    });
    }
	
function detailContentActive(data){
	
	var produce_xuke = new Array();
	var produce_beian = new Array();
	var salary_xuke = new Array();
	var salary_beian = new Array();
	var service_jiaoyi = new Array();
	var service_xinxi = new Array();
	var datas = data.datas;
	var size = datas.length;
    $(".company_name").html(keyword);
    searchKey=keyword;
	if(size > 0){
		//$(".company_name").html(data.datas[0].company_name);
		for(var i = 0;i < size ; i++){
			var obj = datas[i];
			if(obj.regulation_type == "生产"){
				if(obj.regulation_way == "许可"){
					produce_xuke.push(obj);
				}else if(obj.regulation_way == "备案"){
					produce_beian.push(obj);
				}
			}else if(obj.regulation_type == "经营"){
				if(obj.regulation_way == "许可"){
					salary_xuke.push(obj);
				}else if(obj.regulation_way == "备案"){
					salary_beian.push(obj);
				}
			}else if(obj.regulation_type == "交易服务"){
				service_jiaoyi.push(obj);
			}else if(obj.regulation_type == "信息服务"){
				service_xinxi.push(obj);
			}
		}
	}else{
	}
    $(".main_right").load("right_iframe.html");
	if(produce_xuke.length > 0){
		scxk = 1;
		var index = getMaxIndex(produce_xuke);
		var obj = produce_xuke[index];
		$(".scxk_register_code").html(obj.register_code);
		$(".scxk_approval_dept").html(obj.approval_dept);
		$(".scxk_company_name").html(obj.company_name);
		$(".scxk_legal_person").html(obj.legal_person);
		$(".scxk_company_address").html(obj.company_address);
		$(".scxk_business_owner").html(obj.business_owner);
		$(".scxk_production_address").html(obj.production_address);
		$(".scxk_production_scope").html(obj.production_scope);
		//对批准和到期日期进行处理
        if (obj.approval_complete_mark == 0){
            $(".scxk_approval_date").html(obj.approval_date.substring(0,10));
        }else if(obj.approval_complete_mark == 1){
            $(".scxk_approval_date").html(obj.approval_date.substring(0,4));
        }else{
            $(".scxk_approval_date").html(obj.approval_date.substring(0,7));
        }

        if (obj.expiry_complete_mark == 0){
            $(".scxk_expiry_date").html(obj.expiry_date.substring(0,10));
        }else if(obj.expiry_complete_mark == 1){
            $(".scxk_expiry_date").html(obj.expiry_date.substring(0,4));
        }else{
            $(".scxk_expiry_date").html(obj.expiry_date.substring(0,7));
        }
        if(obj.vacancy_mark == 0){

        }else if(obj.vacancy_mark == 1){
			$(".scxk_approval_date").html("");
        }else if(obj.vacancy_mark == 2){
        	$(".scxk_expiry_date").html("");
        }else{
        	$(".scxk_approval_date").html("");
        	$(".scxk_expiry_date").html("");
        }
        $(".left_two .tip01").after($(".scxk").html());
	}else{
		$(".no_info_tip > .no_info").attr("id","sc_xuke");
		$(".left_two .tip01").after($(".no_info_tip").html());
	}
	if(produce_beian.length > 0){
		scba = 1;
		var index = getMaxIndex(produce_beian);
		var obj = produce_beian[index];
		$(".scba_register_code").html(obj.register_code);
		$(".scba_approval_dept").html(obj.approval_dept);
		$(".scba_approval_date").html();
		$(".scba_company_name").html(obj.company_name);
		$(".scba_legal_person").html(obj.legal_person);
		$(".scba_company_address").html(obj.company_address);
		$(".scba_business_owner").html(obj.business_owner);
		$(".scba_production_address").html(obj.production_address);
		$(".scba_production_scope").html(obj.production_scope);
		//对批准和到期日期进行处理
        if (obj.approval_complete_mark == 0){
            $(".scba_approval_date").html(obj.approval_date.substring(0,10));
        }else if(obj.approval_complete_mark == 1){
            $(".scba_approval_date").html(obj.approval_date.substring(0,4));
        }else{
            $(".scba_approval_date").html(obj.approval_date.substring(0,7));
        }

        if(obj.vacancy_mark == 0){

        }else if(obj.vacancy_mark == 1){
			$(".scba_approval_date").html("");
        }else if(obj.vacancy_mark == 2){
        	
        }else{
        	$(".scba_approval_date").html("");	
        }
        $(".left_two .tip01").after($(".scba").html());
	}else{
		$(".no_info_tip > .no_info").attr("id","sc_beian");
		$(".left_two .tip01").after($(".no_info_tip").html());
	}
	

	if(scxk == 0 && scba == 1){
		$("div[data-type=sc_beian]").addClass("active");
		$("#sc_xuke").hide();
	}else{
		$("div[data-type=sc_xuke]").addClass("active");
		$("#sc_beian").hide();
	}

	if(salary_xuke.length > 0){
		jyxk = 1;
		var index = getMaxIndex(salary_xuke);
		var obj = salary_xuke[index];
		$(".jyxk_register_code").html(obj.register_code);
		$(".jyxk_approval_dept").html(obj.approval_dept);
		$(".jyxk_company_name").html(obj.company_name);
		$(".jyxk_legal_person").html(obj.legal_person);
		$(".jyxk_manage_mode").html(obj.manage_mode);
		$(".jyxk_business_owner").html(obj.business_owner);
		$(".jyxk_company_address").html(obj.production_address);
		$(".jyxk_production_address").html(obj.production_address);

		$(".jyxk_warehouse_address").html(obj.warehouse_address);
		$(".jyxk_production_scope").html(obj.production_scope);
		//对批准和到期日期进行处理
        if (obj.approval_complete_mark == 0){
            $(".jyxk_approval_date").html(obj.approval_date.substring(0,10));
        }else if(obj.approval_complete_mark == 1){
            $(".jyxk_approval_date").html(obj.approval_date.substring(0,4));
        }else{
            $(".jyxk_approval_date").html(obj.approval_date.substring(0,7));
        }

        if (obj.expiry_complete_mark == 0){
            $(".jyxk_expiry_date").html(obj.expiry_date.substring(0,10));
        }else if(obj.expiry_complete_mark == 1){
            $(".jyxk_expiry_date").html(obj.expiry_date.substring(0,4));
        }else{
            $(".jyxk_expiry_date").html(obj.expiry_date.substring(0,7));
        }
        if(obj.vacancy_mark == 0){

        }else if(obj.vacancy_mark == 1){
			$(".jyxk_approval_date").html("");
        }else if(obj.vacancy_mark == 2){
        	$(".jyxk_expiry_date").html("");
        }else{
        	$(".jyxk_approval_date").html("");
        	$(".jyxk_expiry_date").html("");
        }
        $(".left_three .tip01").after($(".jyxk").html());
	}else{
		$(".no_info_tip > .no_info").attr("id","jy_xuke");
		$(".left_three .tip01").after($(".no_info_tip").html());
	}
	if(salary_beian.length > 0){
		jyba = 1;
		var index = getMaxIndex(salary_beian);
		var obj = salary_beian[index];
		$(".jyba_register_code").html(obj.register_code);
		$(".jyba_approval_dept").html(obj.approval_dept);

		$(".jyba_company_name").html(obj.company_name);
		$(".jyba_legal_person").html(obj.legal_person);
		$(".jyba_manage_mode").html(obj.manage_mode);
		$(".jyba_business_owner").html(obj.business_owner);
		$(".jyba_company_address").html(obj.production_address);
		$(".jyba_production_address").html(obj.production_address);

		$(".jyba_warehouse_address").html(obj.warehouse_address);
		$(".jyba_production_scope").html(obj.production_scope);
		//对批准和到期日期进行处理
        if (obj.approval_complete_mark == 0){
            $(".jyba_approval_date").html(obj.approval_date.substring(0,10));
        }else if(obj.approval_complete_mark == 1){
            $(".jyba_approval_date").html(obj.approval_date.substring(0,4));
        }else{
            $(".jyba_approval_date").html(obj.approval_date.substring(0,7));
        }

        if(obj.vacancy_mark == 0){

        }else if(obj.vacancy_mark == 1){
			$(".jyba_approval_date").html("");
        }else if(obj.vacancy_mark == 2){
        	
        }else{
        	$(".jyba_approval_date").html("");	
        }
        $(".left_three .tip01").after($(".jyba").html());
	}else{
		$(".no_info_tip > .no_info").attr("id","jy_beian");
		$(".left_three .tip01").after($(".no_info_tip").html());
	}
	//$("#jy_beian").hide();
	if(jyxk == 0 && jyba == 1){
		$("div[data-type=jy_beian]").addClass("active");
		$("#jy_xuke").hide();
	}else{
		$("div[data-type=jy_xuke]").addClass("active");
		$("#jy_beian").hide();
	}

	if(service_xinxi.length > 0){
		xxfw = 1;
		var index = getMaxIndex(service_xinxi);
		var obj = service_xinxi[index];
		$(".xxfw_register_code").html(obj.register_code);
		$(".xxfw_approval_dept").html(obj.approval_dept);

		$(".xxfw_company_name").html(obj.company_name);
		$(".xxfw_legal_person").html(obj.legal_person);
		$(".xxfw_service_nature").html(obj.service_nature);
		$(".xxfw_business_owner").html(obj.business_owner);
		$(".xxfw_company_address").html(obj.company_address);
		$(".xxfw_zipcode").html(obj.zipcode);
		$(".xxfw_ip_address").html(obj.ip_address);
		$(".xxfw_domain_name").html(obj.domain_name);
		//对批准和到期日期进行处理
        if (obj.approval_complete_mark == 0){
            $(".xxfw_approval_date").html(obj.approval_date.substring(0,10));
        }else if(obj.approval_complete_mark == 1){
            $(".xxfw_approval_date").html(obj.approval_date.substring(0,4));
        }else{
            $(".xxfw_approval_date").html(obj.approval_date.substring(0,7));
        }

        if (obj.expiry_complete_mark == 0){
            $(".xxfw_expiry_date").html(obj.expiry_date.substring(0,10));
        }else if(obj.expiry_complete_mark == 1){
            $(".xxfw_expiry_date").html(obj.expiry_date.substring(0,4));
        }else{
            $(".xxfw_expiry_date").html(obj.expiry_date.substring(0,7));
        }
        if(obj.vacancy_mark == 0){

        }else if(obj.vacancy_mark == 1){
			$(".xxfw_approval_date").html("");
        }else if(obj.vacancy_mark == 2){
        	$(".xxfw_expiry_date").html("");
        }else{
        	$(".xxfw_approval_date").html("");
        	$(".xxfw_expiry_date").html("");
        }
        $(".left_four .tip01").after($(".xxfw").html());

	}else{
		$(".no_info_tip > .no_info").attr("id","fw_xx");
		$(".left_four .tip01").after($(".no_info_tip").html());
	}
	if(service_jiaoyi.length > 0){
		jyfw = 1;
		var index = getMaxIndex(service_jiaoyi);
		var obj = service_jiaoyi[index];
		$(".jyfw_register_code").html(obj.register_code);
		$(".jyfw_approval_dept").html(obj.approval_dept);

		$(".jyfw_company_name").html(obj.company_name);
		$(".jyfw_legal_person").html(obj.legal_person);
		$(".jyfw_service_scope").html(obj.service_scope);
		$(".jyfw_business_owner").html(obj.business_owner);
		$(".jyfw_company_address").html(obj.company_address);
		$(".jyfw_zipcode").html(obj.zipcode);
		$(".jyfw_web_name").html(obj.web_name);
		$(".jyfw_ip_address").html(obj.ip_address);
		$(".jyfw_domain_name").html(obj.domain_name);

		//对批准和到期日期进行处理
        if (obj.approval_complete_mark == 0){
            $(".jyfw_approval_date").html(obj.approval_date.substring(0,10));
        }else if(obj.approval_complete_mark == 1){
            $(".jyfw_approval_date").html(obj.approval_date.substring(0,4));
        }else{
            $(".jyfw_approval_date").html(obj.approval_date.substring(0,7));
        }

        if (obj.expiry_complete_mark == 0){
            $(".jyfw_expiry_date").html(obj.expiry_date.substring(0,10));
        }else if(obj.expiry_complete_mark == 1){
            $(".jyfw_expiry_date").html(obj.expiry_date.substring(0,4));
        }else{
            $(".jyfw_expiry_date").html(obj.expiry_date.substring(0,7));
        }
        if(obj.vacancy_mark == 0){

        }else if(obj.vacancy_mark == 1){
			$(".jyfw_approval_date").html("");
        }else if(obj.vacancy_mark == 2){
        	$(".jyfw_expiry_date").html("");
        }else{
        	$(".jyfw_approval_date").html("");
        	$(".jyfw_expiry_date").html("");
        }
        $(".left_four .tip01").after($(".jyfw").html());
	}else{
		$(".no_info_tip > .no_info").attr("id","fw_jy");
		$(".left_four .tip01").after($(".no_info_tip").html());
	}
	//$("#fw_xx").hide();
	if(jyfw == 0 && xxfw == 1){
		$("div[data-type=fw_xx]").addClass("active");
		$("#fw_jy").hide();
	}else{
		$("div[data-type=fw_jy]").addClass("active");
		$("#fw_xx").hide();
	}
}


/*获的时间最大值的下标*/
function getMaxIndex(arr){
	var max = arr[0].approval_date;
	var index = 0;
	for(var j = 0; j < arr.length;j++){
		if(ToDate(arr[j].approval_date) > ToDate(max)){
			max = arr[j].approval_date;
		}
	}
	for(var j = 0; j < arr.length;j++){
		if(max == arr[j].approval_date){
			index = j;
		}
	}
	return index;
}

function ToDate(date1){
	var time = new Date(Date.parse(date1));
	return time;
}





//
	$(".left_two .tip01 div,.left_three .tip01 div,.left_four .tip01 div").click(function(){
		$(this).addClass("active");
		$(this).siblings().removeClass("active");
		var type = $(this).attr("data-type");
		$(this).parent(".tip01").nextAll("#"+type).show();
		$(this).parent(".tip01").nextAll("#"+type).siblings(".result").hide();

	});
});
/*装配产品模板*/
function contentProductActive(data){
	$(".cp_num").html(all_Count);
	$("#product_content").html("");
	var match_count = data.datas.length;

 	if(match_count <= 0){
 		$("#product_content").html($(".no_info_tip").html());
 	}
	for(var i = 0;i < match_count;i++){
		$("#product_content").append($("#product_template").html());
	}
	var page_total = Math.ceil(all_Count/page_size);
	if(page_total > 1000){page_total =1000}
	$('.produce_page').pagination({  
       	currentPage: start_page,
        totalPage: page_total,
        isShow: true,
        count: 5,
        homePageText: "首页",
        endPageText: "尾页",
        prevPageText: "上一页",
        nextPageText: "下一页",
        callback:function(current){
        	start_page = current;
        	var url = getProByCom(current-1,keyword,page_size);
        	$.getJSON(url, function (json) {
        		data = json;
		    	contentProductActive(data);
        	});

        }
    });

	var data_list = $(".data_list");
	for (var i = 0; i < match_count; i++) {
		var obj = data.datas[i];
		$(data_list[i].getElementsByTagName("h4")).html(obj.product_state);//有效无效
		if($(data_list[i].getElementsByTagName("h4")).text() == "无效"){
			$(data_list[i].getElementsByTagName("h4")).css({
				"background":"#b2aea7",
				"color"     :"#fff"
			})
		}
		$(data_list[i].getElementsByClassName("result_src_loc_revised")).html(getSrc_Loc(obj.src_loc));//产品归属地
		$(data_list[i].getElementsByClassName("result_main_class_revised")).html(getMain_Class(obj.main_class));//管理类别
		$(data_list[i].getElementsByClassName("result_class_code_revised")).html(getClass_Code(obj.class_code));//分类目录


		var product_name_ch = obj.product_name_ch;
		var product_mode = obj.product_mode;
        var mode_highlighted_html = "";
        var name_highlighted_html = "";

		if(product_name_ch.length > 20){
        	product_name_ch = (product_name_ch.substring(0,20)+"...");
        }

        if(product_mode.length > 45){
        	product_mode = (product_mode.substring(0,45)+"...")
        }
      
        $(data_list[i].getElementsByTagName("h3")).html(product_name_ch);//名称
        $(data_list[i].getElementsByClassName("product_name")).attr("href",$(data_list[i].getElementsByClassName("product_name")).attr("href")+obj.id);
		$(data_list[i].getElementsByClassName("result_product_mode")).html(product_mode);//mode

        var ele_register_code = $(data_list[i].getElementsByClassName("result_register_code"));//注册证号
        ele_register_code.html(obj.register_code);
        ele_register_code.attr("href",ele_register_code.attr("href")+obj.id);

        var ele_company_name = $(data_list[i].getElementsByClassName("result_company"));//公司
        var maker_name = obj.maker_name_ch;
        if(maker_name == ''){
        	maker_name = obj.agent;
        }
        ele_company_name.html(getText(maker_name));

        if(obj.picture_addr == undefined){
	       $(data_list[i].getElementsByClassName("product_img_main")).attr("src","images/produce.png");
	    }else{
	        $(data_list[i].getElementsByClassName("product_img_main")).attr("src","../upload/product/"+obj.picture_addr);
	    }
	}
}

function contentZBActive(data){
	$(".zb_num").html(ZB_Count);
	$("#zbgg_content").html("");
	var match_count = data.datas.length;
	if(match_count <= 0){
 		$("#zbgg_content").html($(".no_info_tip").html());
 	}
	for(var i = 0;i < match_count;i++){
		$("#zbgg_content").append($("#zbgg_template").html());
	}

	var page_total = Math.ceil(ZB_Count/page_size);
	if(page_total > 1000){page_total =1000}
	$('.zbgg_page').pagination({  
       	currentPage: start_page_zb,
        totalPage: page_total,
        isShow: true,
        count: 5,
        homePageText: "首页",
        endPageText: "尾页",
        prevPageText: "上一页",
        nextPageText: "下一页",
        callback:function(current){
        	start_page_zb = current;
        	var url = getZBGGByCom(current-1,keyword,page_size);
        	$.getJSON(url, function (json) {
        		data = json;
		    	contentZBActive(data);
        	});

        }
    });

	var data_list = $(".zbxi");
	for (var i = 0; i < match_count; i++) {
		var obj = data.datas[i];
		var title = obj.title;
		if(title.length > 40){title = title.substring(0,40)+"...";}
		$(data_list[i].getElementsByTagName("a")).html(title);
		$(data_list[i].getElementsByTagName("a")).attr("href",obj.url);
		$(data_list[i].getElementsByTagName("p")).append(parseDate(obj.date));

	}
}


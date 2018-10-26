var keyword = '';
var page_size = 10;
var all_Count = '';
var start_page = 1;
var src_loc = -1;//产品归属
var product_state = '全部';//注册状态
var main_class = -1;//管理类别
$(document).ready(function(){

	var flag = false;
	var status = getStorage("user");
	if(status == "noLogin"){
		
	}else if(status == "outTime"){
		
	}else{
		flag = true;
	}
	//if(flag){
		var keyword_from_url = window.location.search;//格式是【例：?class=pro&keyword=*】
	    var classify = keyword_from_url.substring(7, 10);
	    var keyword_sub = keyword_from_url.substring(19);
	    keyword = decodeURI(keyword_sub);
	    $(".key").html(keyword);
	    $(".cli_re ul li:first-child").html("模糊搜索："+keyword);
	    //var url_request = "";
	    var url_after = getSearch_ProURL(0,keyword);
	    $.getJSON(url_after, function (json) {
	    	data = json;
	    	all_Count = data.matchCount;
	    	contentProductActive(data);
	    	contentProductTable(data);
	    	ifFind(data);
	    	if(flag){
	    		getInsertUsersearchURL(status.userid,"pro",keyword,all_Count);
	    	}else{
	    		getInsertUsersearchURL(-1,"pro",keyword,all_Count);
	    	}
	    	
	    });
	   
	//}
	$(".left_one table tr a").click(function(){
		var children = $(this).parents("tr").find("a");
		for (var i = 0; i < children.length; i++) { 
			$(children[i]).removeClass("click_on");
		}
		$(this).addClass("click_on");


		//组URL
		start_page = 1;//第一页
		var url_after = getSearch_ProURL(0,keyword);
    	var clickeds = document.getElementsByClassName("click_on");
    	if(clickeds[0].id >= 0){
    		src_loc = clickeds[0].id
    	}else{
    		src_loc = -1;
    	}
    	if(clickeds[1].innerHTML != "全部"){
    		product_state = clickeds[1].innerHTML;
    	}else{
    		product_state = '全部'
    	}
    	if(clickeds[2].id > 0){
    		main_class = clickeds[2].id
    	}else{
    		main_class = -1;
    	}
    	url_after = url_after + getAllUrl();
    	$.getJSON(url_after, function (json) {
			data = json;
			all_Count = data.matchCount;
			contentProductActive(data);
			contentProductTable(data);
			TableFull(data);
		});	
    	
	});
	/*展开收起筛选*/
	$(".choose").click(function(){
		var value = $(".choose_tip").text();
		$(".left_one").slideToggle("slow");
		if(value == "收起筛选条件"){
			$(".choose_img").attr("src","images/icon_down.png");
			$(".choose_tip").text("展开筛选条件");
		}else{
			$(".choose_img").attr("src","images/icon_up.png");
			$(".choose_tip").text("收起筛选条件");
		}
	});
	$(".dT a").click(function(){
		addTip($(this).text());
	});
});

/*是不是想找*/
function ifFind(data){
	var bottom_main = $(window.frames["iframe_top_name"].document).find(".search_need");
	bottom_main.next().html("");
	var other = $(window.frames["iframe_top_name"].document).find("#isFind");
	bottom_main.after(other.html());


	var other_thing = $(window.frames["iframe_top_name"].document).find(".bottom_main_content .other div");
	
	var find_count = data.aggList.length;
	if(find_count > 5){
		find_count = 5;
	}
	var _html = '';
	for(var i = 0;i < find_count;i++){
		var obj = data.aggList[i];
		var name = obj.product_name;
		if(name.length > 10){name = name.substring(0,10)+"..";}
		_html += ('<a onclick="toView(this)" title='+obj.product_name+'>'
					+name
				+'</a>');
	}
	other_thing.append(_html);
}

/*装配产品模板*/
function contentProductActive(data){
	//$(".third_main").html("");
	$(".num").html(all_Count);
	$("#product_content").html("");
	var match_count = data.datas.length;
 
 	if(match_count <= 0){
 		$("#product_content").html('<p style="text-align:center;color:#bfc0c0;">抱歉...医械查未能搜索到相关数据...</p>');
 	}
	for(var i = 0;i < match_count;i++){
		$("#product_content").append($("#product_template").html());
		//$("#product_content > .data_list").show();
	}
	var page_total = Math.ceil(all_Count/page_size);
	if(page_total > 1000){page_total =1000}
	$('.page').pagination({  
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
        	document.documentElement.scrollTop = document.body.scrollTop = $(".third_main").offset().top;
        	var url = getSearch_ProURL(current-1,keyword)+getAllUrl();
        	$.getJSON(url, function (json) { 
        		data = json;
		    	contentProductActive(data);
		    	//contentProductTable(data);
        	});

        }
    });  

	var data_list = $(".data_list")
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

		if(product_name_ch.length > 30){
        	product_name_ch = (product_name_ch.substring(0,30)+"...");
        }

        for(var j = 0;j < product_name_ch.length;j++){
            var val = product_name_ch.substring(j,j+1);
            if(keyword.indexOf(val) >= 0){
                name_highlighted_html = name_highlighted_html + "<em style='color:#f39800;font-style: normal;'>" + val + "</em>";
            }else{
                name_highlighted_html = name_highlighted_html + val;
            }
        }
        if(product_mode.length > 45){
        	product_mode = (product_mode.substring(0,45)+"...")
        }
        for(var j = 0;j < product_mode.length;j++){
            var val = product_mode.substring(j,j+1);
            if(keyword.indexOf(val) >= 0){
                mode_highlighted_html = mode_highlighted_html + "<em style='color:f39800;font-style: inherit;'>" + val + "</em>";
            }else{
                mode_highlighted_html = mode_highlighted_html + val;
            }
        }

        $(data_list[i].getElementsByTagName("h3")).html(name_highlighted_html);//名称
        $(data_list[i].getElementsByClassName("product_name")).attr("href",$(data_list[i].getElementsByClassName("product_name")).attr("href")+obj.id);
		$(data_list[i].getElementsByClassName("result_product_mode")).html(mode_highlighted_html);//mode

        var ele_register_code = $(data_list[i].getElementsByClassName("result_register_code"));//注册证号
        ele_register_code.html(obj.register_code);
        ele_register_code.attr("href",ele_register_code.attr("href")+obj.id);

        var ele_company_name = $(data_list[i].getElementsByClassName("result_company"));//公司
        var maker_name = obj.maker_name_ch;
        if(maker_name == ''){
        	maker_name = obj.agent;
        }
        ele_company_name.html(getText(maker_name,17));
        ele_company_name.attr("href",ele_company_name.attr("href")+maker_name);

        if(obj.picture_addr == undefined){
	       $(data_list[i].getElementsByClassName("product_img_main")).attr("src","images/produce.png");
	    }else{
	        $(data_list[i].getElementsByClassName("product_img_main")).attr("src","../upload/product/"+obj.picture_addr);
	    }
	}
}
function TableFull(data){
	var id = $(".cli_re ul li:last").attr("class");
	if(id == 0){
		contentProductTable(data);
	}else if(id == 1){
		contentCompanyTable(data);
	}else if(id == 2){
		contentMuluTable(data);
	}
	
}
/*产品填充表格*/
function contentProductTable(data){
		var aggList_count = data.aggList.length;
		addTable_Produce_Name();
		if(aggList_count != ''){
			for (var i = 0; i < aggList_count; i++) {
				var obj = data.aggList[i];
				addTr_Produce_Name(obj);   
			}
		}else{
			//alert("抱歉...医械查未能搜索到相关数据...");
			var tip = '<p>抱歉...医械查未能搜索到相关数据...</p>'
			$(".dT table").after(tip);
		}
}
function contentCompanyTable(data){
		var aggList_count = data.aggList.length;
		addTable_Company_Name();
		if(aggList_count != ''){
			for (var i = 0; i < aggList_count; i++) {
				var obj = data.aggList[i];
				addTr_Company_Name(obj);
			}
		}else{
			var tip = '<p>抱歉...医械查未能搜索到相关数据...</p>'
			$(".dT table").after(tip);
		}
	
	
}
function contentMuluTable(data){
		var aggList_count = data.aggList.length;
		addTable_Mulu_Name();
		if(aggList_count != ''){
			for (var i = 0; i < aggList_count; i++) {
				var obj = data.aggList[i];
				addTr_Mulu_Name(obj);
			}
		}else{
			var tip = '<p>抱歉...医械查未能搜索到相关数据...</p>'
			$(".dT table").after(tip);
		}
	
	
}
/*添加表格及表头----点击产品名称*/
function addTable_Produce_Name(){
	$(".dT div").html("");
	var _table = '<table class="table" id="0">'
					+'<tr>'
						+'<th style="width: 25%;">产品名称</th>'
						+'<th style="width: 15%;">品种数量</th>'
						+'<th style="width: 15%;">生产企业数量</th>'
						+'<th style="width: 15%;">分类目录数量</th>'
						+'<th style="width: 15%;">最早注册时间</th>'
						+'<th style="width: 15%;">最新注册时间</th>'
					+'</tr>'
				+'</table>'
	$(".dT div").append(_table);
}
/*/*添加表格及表头----点击企业数量*/
function addTable_Company_Name(){
	$(".dT div").html("");
	var _table = '<table class="table" id="1">'
					+'<tr>'
						+'<th style="width: 40%;">企业名称</th>'
						+'<th style="width: 10%;">品种数量</th>'
						+'<th style="width: 25%;">最早注册时间</th>'
						+'<th style="width: 25%;">最新注册时间</th>'
					+'</tr>'
				+'</table>'
	$(".dT div").append(_table);
}
/*添加表格及表头----点击分类目录数量*/
function addTable_Mulu_Name(){
	$(".dT div").html("");
	var _table = '<table class="table" id="2">'
					+'<tr>'
						+'<th style="width: 40%;">分类目录</th>'
						+'<th style="width: 10%;">品种数量</th>'
						+'<th style="width: 25%;">最早注册时间</th>'
						+'<th style="width: 25%;">最新注册时间</th>'
					+'</tr>'
				+'</table>'
	$(".dT div").append(_table);
}
/*添加表格的主体部分---点击产品的名称
count:记录数
*/
function addTr_Produce_Name(data){
	var _html = '<tr>'
					+'<td><a onclick="getTable_Result(this,0)">'+data.product_name+'</a></td>'
					+'<td>'+data.product_count+'</td>'
					+'<td><a onclick="getTable_Result(this,1)">'+data.company_count+'</a></td>'
					+'<td><a onclick="getTable_Result(this,2)">'+data.code_count+'</a></td>'
					+'<td>'+data.old_date+'</td>'
					+'<td>'+data.new_date+'</td>'
				+'</tr>';
	$(".dT table").append(_html);
}
/*添加表格的主体部分---点击企业数量*/
function addTr_Company_Name(data){
	var _html = '<tr>'
					+'<td><a onclick="getTable_Result(this,1)">'+data.company_name+'</a></td>'
					+'<td>'+data.product_count+'</td>'
					+'<td>'+data.old_date+'</td>'
					+'<td>'+data.new_date+'</td>'
				+'</tr>';
	$(".dT table").append(_html);
}
/*添加表格的主体部分---点击分类目录*/
function addTr_Mulu_Name(data){
	var _html = '<tr>'
					+'<td><a onclick="getTable_Result(this,2)" id="'+data.code_name+'">'+getClass_Code(data.code_name)+'</a></td>'
					+'<td>'+data.product_count+'</td>'
					+'<td>'+data.old_date+'</td>'
					+'<td>'+data.new_date+'</td>'
				+'</tr>';
	$(".dT table").append(_html);
	
}
/*判断是否是数字*/
function isNumber(val){
	var flag = false;
	if(!isNaN(val)){
		flag = true;
	}else{
		flag = false;
	}
	return flag;
}

/**
点击表格列发送请求至服务端
obj：当前点击的对象
num:点击的类型--->：0：产品名称   1：公司名称   2：分类目录
*/
var product_name = '';
var company_name = '';
var class_code   = '';
var isFlag = -1;//判断点击的企业数量还是企业名称   //-1不是   1是
function getTable_Result(obj,num){
	var id = $(obj).parents(".table").attr("id");//
	var content = $(obj).text();
	
	var url_after = getSearch_ProURL(0,keyword);
	if(num == 0 ){
		//url_after = url_after +"&product_name="+$(obj).text();
		product_name = $(obj).text();
		content = "品名："+content;
	}else if(num == 1){
		var product_name_ch = $(obj).parents("tr").find("td:first-child").children("a").text();
		if(isNumber($(obj).text())){
			product_name = product_name_ch;
			company_name = 'yes';
			content = "品名："+product_name;
			
		}else{
			content = "企业："+content;
			company_name = $(obj).text();
		}
		//url_after = url_after+"&product_name="+product_name+"&company_name="+company_name;
	}else if(num == 2){
		var product_name_ch = $(obj).parents("tr").find("td:first-child").children("a").text();
		
		if(isNumber($(obj).text())){
			product_name = product_name_ch;
			class_code = 'yes';
			content = "品名："+product_name;
		}else{
			content = "目录："+content;
			class_code = $(obj).attr("id");
		}
		//url_after = url_after+"&product_name="+product_name+"&class_code="+class_code;
	}
	url_after = url_after+getAllUrl();console.log(url_after);
	$.getJSON(url_after, function (json) {
    	data = json;
    	if(num == 0){
    		contentProductTable(data);
    	}else if(num == 1){
			contentCompanyTable(data);
    	}else if(num == 2){
    		contentMuluTable(data);
    	}
    	all_Count = data.matchCount;
    	contentProductActive(data);
    });

	if($(".cli_re ul li").length > 1){
		if(content != $(".cli_re ul li:last").text()){
			addTip(content,num);
		}
	}else{
		addTip(content,num);
	}
	
}



function deleteTip(obj){
	var pre = $(obj).prev();
	var table_id = '';
	$(obj).remove();//
	var li_length = $(".cli_re li").length;//

	var url_after = getSearch_ProURL(0,keyword);
	var delete_type = $(obj).attr("class");//0 
	if(delete_type == 0){
		product_name = '';
		company_name = '';
		class_code = '';
	}else if(delete_type == 1){
		if(company_name == 'yes'){
			company_name = '';
			if(li_length == 1){
				product_name = '';
			}
		}else{
			company_name = 'yes';
			pre.attr("class",'1');
		}
	}else if(delete_type == 2){
		if(class_code == 'yes'){
			class_code = '';
			if(li_length == 1){
				product_name = '';
			}
		}else{
			class_code = 'yes';
			pre.attr("class",'2');
		}
	}
	url_after = url_after+getAllUrl();
	table_id = $(obj).prev().attr("class");
	$.getJSON(url_after, function (json) {
    	data = json;
    	if(table_id == 0){
    		contentProductTable(data);
    	}else if(table_id == 1){
			contentCompanyTable(data);
    	}else if(table_id == 2){
    		contentMuluTable(data);
    	}
    	TableFull(data);
    	all_Count = data.matchCount;
    	contentProductActive(data);
    });
    changeColor();

}



function addTip(content,num){
	var _html = '<li class="'+num+'">'
					+ content
					+'<div class="closed">'
						+'<img src="images/x.png" />'
					+'</div>'
				+'</li>';
	$(".cli_re ul").append(_html);
	changeColor();
}
function changeColor(){
	var size = $(".cli_re ul li").length;//获的li长度
	if(size > 1){
		$(".cli_re ul li:last").css({
			"border"     : "1px solid #f39800",
			"cursor"     : "pointer"
		});
		$(".cli_re ul li:not(.cli_re ul li:last)").css({
			"border"     : "1px solid #c5c5c5",
			"cursor"     : "default"
		});
		$(".cli_re ul li:last .closed").css({
			"background" : "#f39800",
		});
		$(".cli_re ul li:not(.cli_re ul li:last) .closed").css({
			"background" : "#c5c5c5",
		});
		$(".cli_re ul li:not(.cli_re ul li:last)").unbind("click");
		$(".cli_re ul li:last").click(function(){
			deleteTip(this);
		});
	}
}
/*
获的第一个的链接
**/
function getChoice(){
	var choice = '';
	if(src_loc > 0){
		choice += ("&src_loc="+src_loc);
	}
	if(product_state != '全部'){
		choice +=("&product_state="+product_state);
	}
	if(main_class > 0){
		choice += ("&main_class="+main_class);
	}
	return choice;
}
function getAllUrl(){
	var choice = '';
	if(src_loc >= 0){
		choice += ("&src_loc="+src_loc);
	}
	if(product_state != '全部'){
		choice +=("&product_state="+product_state);
	}
	if(main_class > 0){
		choice += ("&main_class="+main_class);
	}
	if(product_name != ''){
		choice += ("&product_name="+product_name);
	}
	if(company_name != ''){
		choice += ("&company_name="+company_name);
	}
	if(class_code != ''){
		choice += ("&class_code="+class_code);
	}
	return choice;
}
/*变量清空*/
function cleanup(){
	$(".cli_re ul li:not('.cli_re ul li:first')").remove();//清空table上面的tip
	product_name = '';
	company_name = '';
	class_code   = '';
}

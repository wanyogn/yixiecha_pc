var keyword = '';
var page_size = 10;
var all_Count = '';
var start_page = 1;
var production_type = -1;
var manage_type = -1;
var web_type = -1;
var page_total = 0;
$(document).ready(function(){

	var flag = false;
	var status = getStorage("user");
	if(status == "noLogin"){
	}else if(status == "outTime"){
	}else{
		flag = true;
	}
	var keyword_from_url = window.location.search;//格式是【例：?class=pro&keyword=*】
    var classify = keyword_from_url.substring(7, 10);
    var keyword_sub = keyword_from_url.substring(19);
    keyword = decodeURI(keyword_sub);
    $(".key").html(keyword);
    var url_after = getSearch_ComURL(0,keyword);
	$.getJSON(url_after, function (json) {
    	data = json;
    	all_Count = data.matchCount;
    	contentCompanyActive(data);
    	ifFind(data);
    	if(flag){
    		getInsertUsersearchURL(status.userid,"com",keyword,all_Count);
    	}else{
    		getInsertUsersearchURL(-1,"com",keyword,all_Count);
    	}
    	
    });
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
	$(".left_one table tr a").click(function(){
		var children = $(this).parents("tr").find("a");
		for (var i = 0; i < children.length; i++) { 
			$(children[i]).removeClass("click_on");
		}
		$(this).addClass("click_on");

		var clickeds = document.getElementsByClassName("click_on");

		if(clickeds[0].id >= 0){
			production_type = clickeds[0].id;
		}else{
			production_type = -1;
		}
		if(clickeds[1].id >= 0){
			manage_type = clickeds[1].id;
		}else{
			manage_type = -1;
		}
		if(clickeds[2].id >= 0){
			web_type = clickeds[2].id;
		}else{
			web_type = -1;
		}
		start_page = 1;//第一页
		var url_after = getSearch_ComURL(0,keyword) + getAllUrl();
		$.getJSON(url_after, function (json) {
			data = json;
			all_Count = data.matchCount;
			contentCompanyActive(data);
		});
		
	});
	function contentCompanyActive(data){
		$(".num").html(all_Count);
		$("#product_content").html("");
		var size = data.datas.length;
	
		for(var i = 0;i < size;i++){
			$("#product_content").append($("#product_template").html());
			//$("#product_content > .data_list").show();
		}

		page_total = Math.ceil(all_Count/page_size);
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
	        	document.documentElement.scrollTop = document.body.scrollTop = $(".left_three").offset().top;
	        	var url = getSearch_ComURL(current-1,keyword)+getAllUrl();
	        	$.getJSON(url, function (json) {
	        		data = json;
			    	contentCompanyActive(data);
	        	});
	        }
	    });
        if(start_page == page_total || page_total == 0){
            $("#product_content").append("<div class='comList' id='add_company' onclick='add_company()'><img src='images/add_company.jpg'></div>");
        }
		var data_list = $(".comList");
		for(var i = 0;i < size;i++){
			var obj = data.datas[i];
			$(data_list[i].getElementsByClassName("com_name")).html(getText(obj.company_name,14));//公司名称
			$(data_list[i].getElementsByClassName("com_name_a")).attr("href",$(data_list[i].getElementsByClassName("com_name_a")).attr("href")+obj.company_name);

			/*$(data_list[i].getElementsByClassName("com_oldName")).html(getText("曾用名："+obj.company_name,17));*///曾用名

			$(data_list[i].getElementsByClassName("product_count")).html(obj.product_count);//产品数量
			$(data_list[i].getElementsByClassName("tenderbid_count")).html(obj.tenderbid_count);//中标数量

			if(obj.production_type != undefined){
                if(obj.production_type.length > 0){//生产资质
                    var production_type_arr = obj.production_type.split(",");
                    for(var j = 0;j < production_type_arr.length;j++){
                        $(data_list[i].getElementsByClassName("product_zi")).children("#"+production_type_arr[j]).removeClass("ti_none");
                        $(data_list[i].getElementsByClassName("product_zi")).children("#"+production_type_arr[j]).addClass("ti");
                    }
                }
			}
			if(obj.manage_type != undefined){
                if(obj.manage_type.length > 0){//经营资质
                    var manage_type_arr = obj.manage_type.split(",");
                    for(var j = 0;j < manage_type_arr.length;j++){
                        $(data_list[i].getElementsByClassName("salary_zi")).children("#"+manage_type_arr[j]).removeClass("ti_none");
                        $(data_list[i].getElementsByClassName("salary_zi")).children("#"+manage_type_arr[j]).addClass("ti");
                    }
                }
			}
			if(obj.web_type != undefined){
                if(obj.web_type.length > 0){//经营资质
                    var web_type_arr = obj.web_type.split(",");
                    for(var j = 0;j < web_type_arr.length;j++){
                        $(data_list[i].getElementsByClassName("service_zi")).children("#"+web_type_arr[j]).removeClass("ti_none");
                        $(data_list[i].getElementsByClassName("service_zi")).children("#"+web_type_arr[j]).addClass("ti");
                    }
                }
			}
		}
	}
});

function ifFind(data){
	var bottom_main = $(window.frames["iframe_top_name"].document).find(".search_need");
	var other = $(window.frames["iframe_top_name"].document).find("#isFind");
	bottom_main.after(other.html());

	var other_thing = $(window.frames["iframe_top_name"].document).find(".bottom_main_content .other div");
	var find_count = data.datas.length;
	if(find_count > 3){
		find_count = 3;
	}
	var _html = '';
	for(var i = 0;i < find_count;i++){
		var obj = data.datas[i];
		_html += ('<a onclick="toView(this)" title='+obj.company_name+'>'
					+obj.company_name
				+'</a>');
	}
	other_thing.append(_html);
}

function getAllUrl(){
	var choice = '';
	if(production_type > 0){
		choice += ("&production_type="+production_type);
	}
	if(manage_type > 0){
		choice +=("&manage_type="+manage_type);
	}
	if(web_type > 0){
		choice += ("&web_type="+web_type);
	}
	return choice;
}
function add_company() {
    window.location.href="perfect_cominfo.html";
}

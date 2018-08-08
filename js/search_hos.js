var keyword = '';
var all_Count = 0;
var page_size = 10;
var start_page = 1;
var level = '';//医院评级
var grade = '';//医院评等
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
    $.getJSON(getSearch_HosURL(0,keyword), function (json) {
    	data = json;
    	all_Count = data.matchCount;
    	contentHospitalActive(data);
    	ifFind(data);
    	if(flag){
    		getInsertUsersearchURL(status.userid,"hos",keyword,all_Count);
    	}else{
    		getInsertUsersearchURL(-1,"hos",keyword,all_Count);
    	}
    	
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
	$(".left_one table tr a").click(function(){
		var children = $(this).parents("tr").find("a");
		for (var i = 0; i < children.length; i++) { 
			$(children[i]).removeClass("click_on");
		}
		$(this).addClass("click_on");

		var clickeds = document.getElementsByClassName("click_on");
		if(clickeds[0].innerHTML != "全部"){
			level = clickeds[0].innerHTML;
		}else{
			level = '';
		}
		if(clickeds[1].innerHTML != "全部"){
			grade = clickeds[1].innerHTML;
		}else{
			grade = '';
		}
		var url_after = getSearch_HosURL(0,keyword)+getExtraURL();
		$.getJSON(url_after, function (json) {
			data = json;
			all_Count = data.matchCount;
			contentHospitalActive(data);
		});
	});
});
/*医院内容填充*/
function contentHospitalActive(data){
	$(".num").html(all_Count);
	$("#hospital_content").html("");
	var size = data.datas.length;

	for(var i = 0;i < size;i++){
		$("#hospital_content").append($("#hospital_template").html());
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
        	document.documentElement.scrollTop = document.body.scrollTop = $(".left_three").offset().top;
        	var url = getSearch_HosURL(current-1,keyword)+getExtraURL();
        	$.getJSON(url, function (json) {
        		data = json;
		    	contentHospitalActive(data);
        	});
        }
    }); 

	var data_list = $(".comList");
	for(var i = 0;i < size;i++){
		var obj = data.datas[i];
		$(data_list[i].getElementsByClassName("hos_name")).html(getText(obj.hospital_name,14));
		$(data_list[i].getElementsByClassName("hos_name_a")).attr("href",$(data_list[i].getElementsByClassName("hos_name_a")).attr("href")+obj.id);

		//$(data_list[i].getElementsByClassName("hos_oldName")).html(getText("别名："+obj.hospital_name,17));//别名

		var text = obj.hospital_grade;
		if(text.length > 0 && text != ''){
			var level_t = '';
			var grade_t = '';
			if((grade_t = text.indexOf("等")) > 0){
				$(data_list[i].getElementsByClassName("hos_grade")).html(text.substring(grade_t-1));
			}
			if((level_t = text.indexOf("级")) > 0){
				$(data_list[i].getElementsByClassName("hos_level")).html(text.substring(level_t-1,2));
			}
			
		}

		$(data_list[i].getElementsByClassName("hos_type")).html(obj.type_nature);//经济类型
		$(data_list[i].getElementsByClassName("hos_adress")).html(obj.hospital_address);
		$(data_list[i].getElementsByClassName("hos_tel")).html(obj.hospital_phone);

	}
}
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
		_html += ('<a onclick="toView(this)" title='+obj.hospital_name+'>'
					+obj.hospital_name
				+'</a>');
	}
	other_thing.append(_html);

}
/*筛选的条件*/
function getExtraURL(){
	var extraURL = '';
	if(level != ''){
		extraURL += ("&level="+level);
	}
	if(grade != ''){
		extraURL += ("&grade="+grade);
	}
	return extraURL;
}

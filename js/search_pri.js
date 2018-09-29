var keyword    	= '';
var page_size  	= 10;
var all_Count  	= '';
var start_page 	= 1;
var productName	= '';//搜索框的产品名称
var companyName	= '';//企业名称
var begin      	= '';
var end        	= '';
var province   	= '无';
var city       	= '无';
var product_name = '';//聚合使用的产品名称
var company_name = '';//聚合使用的companyname

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
	    $(".productName").val(keyword)
	    $(".cli_re ul li:first-child").html("模糊搜索："+keyword);

	    $(".province_select").append(getProvinceById(0));//填充省份内容
		$.getJSON(getPriceURL(keyword,0,page_size), function (json) {
			data = json;packageLine(data);
			all_Count = data.matchCount;
			contentPriceActive(data);
			contentProductTable(data);
			if(flag){
	    		getInsertUsersearchURL(status.userid,"pri",keyword,all_Count);
	    	}else{
	    		getInsertUsersearchURL(-1,"pri",keyword,all_Count);
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

/*装配集中采购价格模板*/
function contentPriceActive(data){
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
        	var url = getPriceURL(keyword,current-1,page_size)+getAllUrl();
        	$.getJSON(url, function (json) { 
        		data = json;
		    	contentPriceActive(data);
        	});

        }
    });  

	var data_list = $(".data_list")
	for (var i = 0; i < match_count; i++) {
		var obj = data.datas[i];

		var name_highlighted_html = "";
		var product_name = obj.product_name;
		for(var j = 0;j < product_name.length;j++){
            var val = product_name.substring(j,j+1);
            if(keyword.indexOf(val) >= 0){
                name_highlighted_html = name_highlighted_html + "<em style='color:#f39800;font-style: normal;'>" + val + "</em>";
            }else{
                name_highlighted_html = name_highlighted_html + val;
            }
        }
        $(data_list[i].getElementsByTagName("h3")).html(name_highlighted_html);//名称
		$(data_list[i].getElementsByClassName("product_name")).attr("href",$(data_list[i].getElementsByClassName("product_name")).attr("href")+obj.id);
       
		$(data_list[i].getElementsByClassName("unit")).html(obj.unit_account);//单位
		$(data_list[i].getElementsByClassName("price")).html(obj.bid_price);//价格
		$(data_list[i].getElementsByClassName("product_company")).html(obj.product_company);//生产企业
		$(data_list[i].getElementsByClassName("product_company")).attr("href",$(data_list[i].getElementsByClassName("product_company")).attr("href")+obj.product_company);

		$(data_list[i].getElementsByClassName("declare_company")).html(obj.declare_company);//申报企业
		$(data_list[i].getElementsByClassName("declare_company")).attr("href",$(data_list[i].getElementsByClassName("declare_company")).attr("href")+obj.declare_company);

		var product_model = getText(obj.product_model,50);
		$(data_list[i].getElementsByClassName("product_model")).html(product_model);//规格
		var prodcut_specification = getText(obj.prodcut_specification,50);
		$(data_list[i].getElementsByClassName("prodcut_specification")).html(prodcut_specification);//型号
	}
}
/**开始检索的事件*/
function startSearch(){
	productName = $.trim($(".productName").val());
	companyName = $.trim($(".companyName").val());
	begin       = $(".begin").val();
	end         = $(".end").val();
	province    = $(".province_select option:selected").text();
	city        = $(".city_select option:selected").text();
	if(productName == "" && companyName == ""){
		alert("产品名称与公司名称不能都为空！");
	}else{
		keyword = productName;
	}
	var url_after = getPriceURL(keyword,0,page_size)+getAllUrl();
	$.getJSON(url_after, function (json) {
		data = json;
		all_Count = data.matchCount;
		contentPriceActive(data);
		contentProductTable(data);
		packageLine(data);
	});
	if(keyword == ""){
		$(".key").html(companyName);
		$(".cli_re ul li:first-child").html("模糊搜索："+companyName);
	}
	
	var input = $(window.frames["iframe_top_name"].document).find("#header_search_input");
	input.val(keyword);
}
function TableFull(data){
	var id = $(".cli_re ul li:last").attr("class");
	if(id == 0){
		contentProductTable(data);
	}else if(id == 1){
		contentCompanyTable(data);
	}
	
}

function packageLine(data){
	var name  = new Array();
	var value_max = new Array();
	var value_min = new Array();
	var value_minus = new Array();
	var aggList_count = data.aggList.length;
	if(aggList_count > 0){
		for (var i = 0; i < aggList_count; i++) {
			var obj = data.aggList[i];
			var product_name_ch = obj.product_name;
			name.push(obj.product_name);
			value_max.push(obj.max_price);
			value_min.push(obj.min_price);
			value_minus.push(obj.max_price-obj.min_price);
		}
	}
	contentLine(name,Math.max.apply(null, value_max),Math.min.apply(null, value_min),value_max,value_min,value_minus);
}
/*图表*/
function contentLine(name,max,min,value_max,value_min,value_minus){
	var myChart = echarts.init(document.getElementById('myChart'));
	var option = {
    title :{
        text : '产品价格数据',
        subtext : '高低价比较'
    },
    tooltip : {
        trigger: 'axis',
        formatter: function (params){
            return params[0].name + '<br/>'
                   + params[2].seriesName + ' : ' + params[2].value + '<br/>'
                   + params[3].seriesName + ' : ' + params[3].value + '<br/>'
        }
    },
    xAxis : [
        {
            type : 'category',
            data : name
        }
    ],
    yAxis : [
        {
            type : 'value',
            min : min,
            max : max
        }
    ],
    series : [
        {
            name:'最高价格',
            type:'line',
            itemStyle:{
                normal:{
                  lineStyle: {
                    width:0,
                    type:'dashed'
                  }
                }
            },
            data:value_max
        },
        {
            name:'最低价格',
            type:'line',
            symbol:'none',
            itemStyle:{
                normal:{
                  lineStyle: {
                    width:0,
                    type:'dashed'
                  }
                }
            },
            data:value_min
        },
        {
            name:'低值',
            type:'bar',
            stack: '1',
            barWidth: 6,
            itemStyle:{
                normal:{
                    color:'rgba(0,0,0,0)'
                },
                emphasis:{
                    color:'rgba(0,0,0,0)'
                }
            },
            data:value_min
        },
        {
            name:'变化',
            type:'bar',
            stack: '1',
            data:value_minus
        }
    ]
};
myChart.setOption(option);
                    
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
/*添加表格及表头----点击产品名称*/
function addTable_Produce_Name(){
	$(".dT .dT_table").html("");
	var _table = '<table class="table" id="0">'
					+'<tr>'
						+'<th style="width: 37%;">产品名称</th>'
						+'<th style="width: 12%;">记录条数</th>'
						+'<th style="width: 15%;">生产企业数量</th>'
						+'<th style="width: 12%;">最高价格</th>'
						+'<th style="width: 12%;">最低价格</th>'
						+'<th style="width: 12%;">平均价格</th>'
					+'</tr>'
				+'</table>'
	$(".dT .dT_table").append(_table);
}
/*/*添加表格及表头----点击企业数量*/
function addTable_Company_Name(){
	$(".dT .dT_table").html("");
	var _table = '<table class="table" id="1">'
					+'<tr>'
						+'<th style="width: 40%;">企业名称</th>'
						+'<th style="width: 20%;">最高价格</th>'
						+'<th style="width: 20%;">最低价格</th>'
						+'<th style="width: 20%;">平均价格</th>'
					+'</tr>'
				+'</table>'
	$(".dT .dT_table").append(_table);
}
/*添加表格的主体部分---点击产品的名称
count:记录数
*/
function addTr_Produce_Name(data){
	var _html = '<tr>'
					+'<td><a onclick="getTable_Result(this,0)">'+data.product_name+'</a></td>'
					+'<td>'+data.product_count+'</a></td>'
					+'<td><a onclick="getTable_Result(this,1)">'+data.company_count+'</a></td>'
					+'<td>'+data.max_price+'</a></td>'
					+'<td>'+data.min_price+'</td>'
					+'<td>'+data.avg_price+'</td>'
				+'</tr>';
	$(".dT table").append(_html);
}
/*添加表格的主体部分---点击企业数量*/
function addTr_Company_Name(data){
	var _html = '<tr>'
					+'<td><a onclick="getTable_Result(this,1)">'+data.company_name+'</a></td>'
					+'<td>'+data.max_price+'</td>'
					+'<td>'+data.min_price+'</td>'
					+'<td>'+data.avg_price+'</td>'
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
num:点击的类型--->：0：产品名称   1：公司名称
*/

var isFlag = -1;//判断点击的企业数量还是企业名称   //-1不是   1是
function getTable_Result(obj,num){
	var id = $(obj).parents(".table").attr("id");//
	var content = $(obj).text();
	
	var url_after = getPriceURL(keyword,0,page_size);
	if(num == 0 ){
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
	}
	url_after = url_after+getAllUrl();
	$.getJSON(url_after, function (json) {
    	data = json;
    	if(num == 0){
    		contentProductTable(data);
    	}else if(num == 1){
			contentCompanyTable(data);
    	}
    	all_Count = data.matchCount;
    	contentPriceActive(data);
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

	var url_after = getPriceURL(keyword,0,page_size);
	var delete_type = $(obj).attr("class");//0 
	if(delete_type == 0){
		product_name = '';
		company_name = '';
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
	}
	url_after = url_after+getAllUrl();
	table_id = $(obj).prev().attr("class");
	$.getJSON(url_after, function (json) {
    	data = json;
    	if(table_id == 0){
    		contentProductTable(data);
    	}else if(table_id == 1){
			contentCompanyTable(data);
    	}
    	TableFull(data);
    	all_Count = data.matchCount;
    	contentPriceActive(data);
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
*/
function getAllUrl(){
	var choice = '';
	/*if(productName != ''){
		choice += ("&product_name="+productName);
	}*/
	if(companyName != ''){
		choice +=("&declare_company="+companyName);
	}
	if(begin != ''){
		choice += ("&start_time="+begin);
	}
	if(end != ''){
		choice += ("&end_time="+end);
	}
	if(province != '无'){
		choice += ("&province="+province);
	}
	if(city != '无'){
		choice += ("&city="+city);
	}

	//聚合
	if(product_name != ''){
		choice += ("&product_name="+product_name);
	}
	if(company_name != ''){
		choice += ("&company_name="+company_name);
	}
	return choice;
}

//通过ID 查找省份或者市区
function getProvinceById(id){
	var result = '';
	$.ajax({
        type: 'post',
        url: area_prex +'/daemon/selectAdministrativeRegion',
        //url: '/daemon/selectAdministrativeRegion',
        data: {
        		id    : id, 
        	},
        async: false,
        success: function (res) {
           var json = JSON.parse(res);
           var _html = "<option value='-1'>无</option>";
           for(var i = 0; i < json.datas.length; i++){
           	var data = json.datas[i]; 
           	_html += ("<option value="+ data.id +">"+data.name+"</option>");
           }
           result = _html;
        },
        error:function(error){
            alert("系统繁忙。。");
        }
    });
    return result;
}
/*通过省份关联市区*/
function provinceSelectChange(){
	$(".city_select").empty();
	var id = $('.province_select option:selected').val();
	$(".city_select").append(getProvinceById(id));
}

function getPriceURL(keyword,num,size){
	var url = url_prex+"/method/search_acquisitebid_filter_condition?keyword="+keyword+"&num="+num+"&size="+size;
	return url;
}

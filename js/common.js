var url_prex = "http://localhost:9001";
var area_prex = "http://localhost:9090";
var to_login = "../newWeb/login.html";
var to_index = "../newWeb";
var searchKey = "";
$(function(){
	var lr_systembtn = $("#lr_systembtn");
	var lr_menu = $("#lr_menu");
	lr_systembtn.mouseenter(function(){
		t_delay= setTimeout(function(){
			lr_menu.fadeIn();
		},200);
	});
	lr_systembtn.mouseleave(function(){
		clearTimeout(t_delay);
		lr_menu.fadeOut();
	});
	$(document).mouseover(function(){
        //lastTime = new Date().getTime(); //更新操作时间getSearch_ComURL
        var data = localStorage.getItem("user");
        var dataObj = JSON.parse(data);
        if(dataObj != null){
        	dataObj.time = new Date().getTime();
        }
    });
});
$(document).ready(function(){
	/*app*/
	$(".xcx").mouseover(function(){
		$($(this).find("img")).attr("src","images/xcx_hover.png");
		$($(this).find("p")).css("color","#0084ff");
        $(".wxcontent").show();

	}).mouseout(function(){
		$($(this).find("img")).attr("src","images/xcx.png");
		$($(this).find("p")).css("color","#7d8292");
        $(".wxcontent").hide();
	});
	/*微信*/
	$(".wx").mouseover(function(){
		$($(this).find("img")).attr("src","images/wx_hover.png");
		$($(this).find("p")).css("color","#0084ff");
        $(".gzcontent").show();
	}).mouseout(function(){
		$($(this).find("img")).attr("src","images/wx_03.png");
		$($(this).find("p")).css("color","#7d8292");
        $(".gzcontent").hide();
	});
	/*反馈*/
	$(".fk").mouseover(function(){
		$($(this).find("img")).attr("src","images/fankui_hover.png");
		$($(this).find("p")).css("color","#0084ff");
	}).mouseout(function(){
		$($(this).find("img")).attr("src","images/fankui.png");
		$($(this).find("p")).css("color","#7d8292");
	});
	$(".fk").click(function(){
		//alert("该模块在建设中,敬请期待。。。^_^");
        $('#identifier').modal('show')
	});

	/*置顶*/
	$(".zd").mouseover(function(){
		$($(this).find("img")).attr("src","images/zhiding_hover.png");
		$($(this).find("p")).css("color","#0084ff");
	}).mouseout(function(){
		$($(this).find("img")).attr("src","images/zhiding_07.png");
		$($(this).find("p")).css("color","#7d8292");
	});
	$(".zd").click(function(){
		
		Topfun();
	});
});
var four;
function Topfun(){
	four=setInterval(FourscrollBy,10);
}
function FourscrollBy(eachHeight){
	if(document.documentElement && document.documentElement.scrollTop) {
		if(document.documentElement.scrollTop<=0){
			clearInterval(four);
		}else{
			window.scrollBy(0,-30);
		}
	}else{ //Chrome不支持documentElement.scrollTop
		if(document.body.scrollTop<=0){
			clearInterval(four);
		}else{
			window.scrollBy(0,-30);
		}
	}
}

/*原产地*/
function getSrc_Loc(id){
	var src_loc = '';
	if(id == 0){
		src_loc = "国产"
	}else if(id == 1){
		src_loc = "进口";
	}else if(id == 2){
		src_loc = "港澳台";
	}
	return src_loc;
}
/*管理类别*/
function getMain_Class(id){
	var main_class = '';
	if(id == 1){
		main_class = "I类";
	}else if(id == 2){
		main_class = "II类";
	}else if(id == 3){
		main_class = "III类";
	}
	return main_class;
}
function getIVD(ivd){
	var result = '';
	if(ivd == "ivd"){
		result = "IVD"
	}else if(ivd == "noivd"){
		result = "非IVD"
	}
	return result;
}
///获得分类目录
function getClass_Code(id){
	var class_code = '';
	if(id == "01"){
		class_code = "基础外科手术器械";
	}else if(id == "02"){
		class_code = "显微外科手术器械";
	}else if(id == "03"){
		class_code = "神经外科手术器械";
	}else if(id == "04"){
		class_code = "眼科手术器械";
	}else if(id == "05"){
		class_code = "耳鼻喉科手术器械";
	}else if(id == "06"){
		class_code = "口腔科手术器械";
	}else if(id == "07"){
		class_code = "胸腔心血管外科手术器械";
	}else if(id == "08"){
		class_code = "腹部外科手术器械";
	}else if(id == "09"){
		class_code = "泌尿肛肠外科手术器械";
	}else if(id == "10"){
		class_code = "矫形外科（骨科）手术器械";
	}else if(id == "12"){
		class_code = "妇产科用手术器械";
	}else if(id == "13"){
		class_code = "计划生育手术器械";
	}else if(id == "15"){
		class_code = "注射穿刺器械";
	}else if(id == "16"){
		class_code = "烧伤（整形）科手术器械";
	}else if(id == "20"){
		class_code = "普通诊察器械";
	}else if(id == "21"){
		class_code = "医用电子仪器设备";
	}else if(id == "22"){
		class_code = "医用光学器具、仪器及内窥镜设备";
	}else if(id == "23"){
		class_code = "医用超声仪器及有关设备";
	}else if(id == "24"){
		class_code = "医用激光仪器设备";
	}else if(id == "25"){
		class_code = "医用高频仪器设备";
	}else if(id == "26"){
		class_code = "物理治疗及康复设备";
	}else if(id == "27"){
		class_code = "中医器械";
	}else if(id == "28"){
		class_code = "医用磁共振设备";
	}else if(id == "30"){
		class_code = "医用X射线设备";
	}else if(id == "31"){
		class_code = "医用X射线附属设备及部件";
	}else if(id == "32"){
		class_code = "医用高能射线设备";
	}else if(id == "33"){
		class_code = "医用核素设备";
	}else if(id == "34"){
		class_code = "医用射线防护用品、装置";
	}else if(id == "40"){
		class_code = "临床检验分析仪器";
	}else if(id == "41"){
		class_code = "医用化验和基础设备器具";
	}else if(id == "45"){
		class_code = "体外循环及血液处理设备";
	}else if(id == "46"){
		class_code = "植入材料和人工器官";
	}else if(id == "54"){
		class_code = "手术室、急救室、诊疗室设备及器具";
	}else if(id == "55"){
		class_code = "口腔科设备及器具";
	}else if(id == "56"){
		class_code = "病房护理设备及器具";
	}else if(id == "57"){
		class_code = "消毒和灭菌设备及器具";
	}else if(id == "58"){
		class_code = "医用冷疗、低温、冷藏设备及器具";
	}else if(id == "63"){
		class_code = "口腔科材料";
	}else if(id == "64"){
		class_code = "医用卫生材料及敷料";
	}else if(id == "65"){
		class_code = "医用缝合材料及粘合剂";
	}else if(id == "66"){
		class_code = "医用高分子材料及制品";
	}else if(id == "70"){
		class_code = "医用软件";
	}else if(id == "77"){
		class_code = "介入器材";
	}else{
		class_code = "未知";
	}
	return class_code;
}
function getQueryVariable(variable)
{
    var query = window.location.search.substring(1);
    console.log(query);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return(false);
}
window.onbeforeunload=function(){
};

function getCurrentTime(){
	var now = new Date();
	var year = now.getFullYear();       //年  
    var month = now.getMonth() + 1;     //月  
    var day = now.getDate();            //日  
      
    var hh = now.getHours();            //时  
    var mm = now.getMinutes();          //分  
    var ss = now.getSeconds();           //秒 
    month = month<10?"0"+month:month;
    day   = day<10?"0"+day:day;
    hh    = hh<10?"0"+hh:hh;
    mm    = mm<10?"0"+mm:mm;
    ss    = ss<10?"0"+ss:ss;
    return (year+"-"+month+"-"+day+" "+hh+":"+mm+":"+ss); 
}

/*截取字符串*/
function getText(text,size){
	if(text.length > size){
		text = text.substring(0,size)+"...";
	}
	return text;
}

/*给localstorage赋值*/
function setStorage(key,value){
    var curTime = new Date().getTime();
    value["time"] = curTime;
   	localStorage.setItem(key,JSON.stringify(value));
}
var timeLogin = 1000*60*15;
/*localstory取值*/
function getStorage(key){
	var curTime = new Date().getTime();
    var data = localStorage.getItem(key);
    var dataObj = JSON.parse(data);
    if(dataObj == null){
    	return "noLogin";
    }else{
    	if (new Date().getTime() - dataObj.time>timeLogin) {
    		clearStorage(key);
	        return "outTime";
	    }else{
	    	setStorage("user",dataObj);
	        return dataObj;
	    }
    }
}

/*获取登录未成功的地址*/
function getReferURL(key){
	var data = localStorage.getItem(key);
	if(data == null){
		window.location.href = to_index;
	}else{
		var url = data.substring(1,data.length-1);
		window.location.href = url ;
	}

	clearStorage(key);
}

function clearStorage(key){
	localStorage.removeItem(key);
}
/*获的用户的状态*/
function getCurrentStatus(key){
	var flag = false;
	var status = getStorage("user");
	if(status == "noLogin"){
		alert("您还未登录，请先进行登录!","", function () {
            location.href = "../login.html";
        }, {type: 'warning', confirmButtonText: '确定'});
        return  "noLogin";
	}else if(status == "outTime"){
		alert("您的登录状态已超时，请重新进行登录!","", function () {
            location.href = "../login.html";
             }, {type: 'warning', confirmButtonText: '确定'});
		return "outTime";
	}else{
		return "loginIn";
	}
}
function loginout(){
	clearStorage("user");
	window.location.href = to_index+"/index.html";
}
function parseDate(timestamp){
    var d      = new Date(timestamp);
    var year   = d.getFullYear();
    var month  = d.getMonth()+1 < 10?"0"+(d.getMonth()+1):(d.getMonth()+1);
    var day    = d.getDate() < 10?"0"+d.getDate():d.getDate();
    var hour   = d.getHours()<10?"0"+d.getHours():d.getHours();
    var minute = d.getMinutes()<10?"0"+d.getMinutes():d.getMinutes();
    var second = d.getSeconds()<10?"0"+d.getSeconds():d.getSeconds();
    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
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
/*产品搜索的url*/
function getSearch_ProURL(num,key){
	//var url = "/method/search_product_filter_condition?num="+num+"&keyword="+key;
	var url = url_prex + "/method/search_product_filter_condition?num="+num+"&keyword="+key;
	return url;
}
/*根据ID查找产品*/
function getProURL(id){
	//var url_request = "/method/search_product_id?id=" + id;
	var url_request = url_prex + "/method/search_product_id?id="+id;
	return url_request;
}
/*企业搜索的url*/
function getSearch_ComURL(num,key){
	//var url = "/method/search_company_filter_condition?num="+num+"&keyword="+key;
	var url = url_prex +  "/method/search_company_filter_condition?num="+num+"&keyword="+key;
	return url;
}

/*根据企业名称查找企业*/
function getComURL(name){
	//var url_request = "/method/search_company_specific_name?keyword=" + name;
    var url_request = url_prex + "/method/search_company_specific_name?keyword="+name;
	return url_request;
}
/*根据企业名称查看产品*/
function getProByCom(num,com,size){
	//var url = "/method/search_product_company_name?keyword="+com+"&num="+num+"&size="+size;
	var url = url_prex + "/method/search_product_company_name?keyword="+com+"&num="+num+"&size="+size;
	return url;
}
/*根据公司名称查看招标公告*/
function getZBGGByCom(num,com,size){
	//var url = "/method/search_tenderbid_name?keyword="+com+"&num="+num+"&size="+size;
	var url = url_prex + "/method/search_tenderbid_name?keyword="+com+"&num="+num+"&size="+size;
	return url;
}
/*医院搜索url*/
function getSearch_HosURL(num,keyword){
	//var url = "/method/search_hospital_name?num="+num+"&keyword="+keyword;
	var url = url_prex + "/method/search_hospital_name?num="+num+"&keyword="+keyword;
	return url;
}
/*医院信息*/
function getHosURL(id){
	//var url = "/method/search_hospital_id?id="+id;
	var url = url_prex + "/method/search_hospital_id?id="+id
	return url;
}
/*根据产品名称查找同名产品信息*/
function getSameProURL(num,keyword,size,id){
	//var url = "/method/search_product_same_name?keyword="+keyword+"&num="+num+"&size="+size;
	var url = url_prex + "/method/search_product_same_name?keyword="+keyword+"&num="+num+"&size="+size+"&id="+id;
	return url;
}
function getUserCenter(userid){
    var url = url_prex + "/method/userCenterInfo?userid="+userid;
    //var url = /method/userCenterInfo?userid="+userid;
    return url;
}

/*插入用户的搜索记录*/
function getInsertUsersearchURL(user_id,class_type,key_word,result_count){
	$.ajax({
        type: 'post',
        url: url_prex + '/method/insertUsersearchInfo',
        //url: '/method/insertUsersearchInfo',
        data: {
        		userid    : user_id, 
        		classtype : class_type,
        		keyword  : key_word,
        		resultcount : result_count,
            	searchtype:"YXC_PC"
        	},
        async: false,
        success: function (result) {
            //alert(result);
        },
        error:function(error){
            alert("系统繁忙。。");
        }
    });

}
/*跳转页面的信息记载*/
function getInsertUserurljumpURL(user_id,before_url,after_url,click_name){
	$.ajax({
        type: 'post',
        url: url_prex + '/method/insertUserurljumpInfo',
        //url: '/method/insertUserurljumpInfo',
        data: {
        		userid    : user_id, 
        		beforeurl : before_url,
        		afterurl  : after_url,
        		clickname : click_name
        	},
        async: false,
        success: function (result) {
            //alert(result);
        },
        error:function(error){
            alert("系统繁忙。。");
        }
    });
}


var map = '';
$(document).ready(function(){
	var flag = false;
    var status = getStorage("user");
    /*if(status == "noLogin"){
    	alert("您还未登录，请先进行登录!","", function () {
    		setStorage('referTo',window.location.href);
            top.location.href = "../login.html";
        }, {type: 'warning', confirmButtonText: '确定'});
    }else if(status == "outTime"){
        alert("您的登录状态已超时，请重新进行登录!","", function () {
        	setStorage('referTo',window.location.href);
            top.location.href = "../login.html";
             }, {type: 'warning', confirmButtonText: '确定'});
    }else{
        flag = true;
    }*/
    //if(flag){
    	var keyword_from_url = window.location.search;//格式是【例：?class=pro&id=*】
	    var keyword_sub = keyword_from_url.substring(14);
	    $.getJSON(getHosURL(keyword_sub), function (json) {
	    	data = json;
	    	setHeader(data);
	    	detailContentActive(data);
	    	geocoder(data.datas[0].hospital_name);
	    	var beforeurl = decodeURI(document.referrer);
            var afterurl = decodeURI(document.location.href);
            getInsertUserurljumpURL(status.userid,beforeurl,afterurl,data.datas[0].hospital_name);
	    })
   // }
	
})
/*$("").html();*/
function detailContentActive(data){
	var obj = data.datas[0];
	$(".general_hospital_name_ch").html(obj.hospital_name);
	$(".general_old_name").html("");
	$(".general_register_code").html("");

	var hospital_grade = obj.hospital_grade;
	if(hospital_grade.length > 0 && hospital_grade != ''){
		var level = '';
		var grade = '';
		if((level=hospital_grade.indexOf("级")) > 0){
			$(".general_level").html(hospital_grade.substring(level-1,2));
		}
		if((grade=hospital_grade.indexOf("等")) > 0){
			$(".general_grade").html(hospital_grade.substring(grade-1));
		}
	}
	$(".general_type_nature").html(obj.type_nature);
	$(".general_isYB").html("");//是否有医保
	$(".general_website").html(obj.website);
	$(".general_hospital_address").html(obj.hospital_address);
	$(".general_hospital_phone").html(obj.hospital_phone);

	$(".table_hospital_name").html(obj.hospital_name);
	$(".table_province").html(obj.province);
	$(".table_area").html(obj.area);
	$(".table_hospital_address").html(obj.hospital_address);
	$(".table_zipcode").html(obj.zipcode);
	$(".table_area_code").html(obj.area_code);
	$(".table_hospital_phone").html(obj.hospital_phone);
	$(".table_facsimile").html(obj.facsimile);
	$(".table_website").html(obj.website);
	$(".table_hospital_grade").html(obj.hospital_grade);
	$(".table_type_nature").html(obj.type_nature);
	$(".table_build_hospital_date").html(obj.build_hospital_date);
	$(".table_legal_person").html(obj.legal_person);
	$(".table_worker_number").html(obj.worker_number);
	$(".table_sickbed_count").html(obj.sickbed_count);
	$(".table_outpatient_number_year").html(obj.outpatient_number_year);
	$(".table_hospital_number_year").html(obj.hospital_number_year);
	$(".table_cha_special_sub").html(obj.cha_special_sub);
	$(".table_main_equipment").html(obj.main_equipment);
	$(".table_brief_intro").html(obj.brief_intro);
}

function setHeader(data){
	var obj = data.datas[0];
	var header = $(window.frames["iframe_top_name"].document).find("#header_search_input");
	var other = $(window.frames["iframe_top_name"].document).find(".other");
	header.val(obj.hospital_name);
	other.hide();
}

function geocoder(data) {
	map = new AMap.Map("container", {
        resizeEnable: true
    });
    var geocoder = new AMap.Geocoder({
        city: "", //城市，默认：“全国”
        radius: 1000 //范围，默认：500
    });
    //地理编码,返回地理编码结果
    geocoder.getLocation(data, function(status, result) {
        if (status === 'complete' && result.info === 'OK') {
            geocoder_CallBack(result);
        }
    });
}
function addMarker(i, d) {
    var marker = new AMap.Marker({
        map: map,
        position: [ d.location.getLng(),  d.location.getLat()]
    });
    var infoWindow = new AMap.InfoWindow({
        content: d.formattedAddress,
        offset: {x: 0, y: -30}
    });
    marker.on("mouseover", function(e) {
        infoWindow.open(map, marker.getPosition());
    });
}
//地理编码返回结果展示
function geocoder_CallBack(data) {
    var resultStr = "";
    //地理编码结果数组
    var geocode = data.geocodes;
    for (var i = 0; i < geocode.length; i++) {
        //拼接输出html
        
        addMarker(i, geocode[i]);
    }
    map.setFitView();
}
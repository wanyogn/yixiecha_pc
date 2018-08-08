var map = '';
$(document).ready(function(){
	var flag = true;
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
    if(flag){
        var keyword_from_url = window.location.search;
        var arr = keyword_from_url.split("&");
        var url = arr[1].substring(4);
        var word = arr[2].substring(5);
        url = Base64.decode(decodeURI(url));
        $(".main iframe").attr("src",url)
        $(".content_tip_main_right a").attr("href",url)
        $(".zbgg").html(getText(Base64.decode(word),35));
    }
});
 

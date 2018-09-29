$(document).ready(function(){
	$(".choice div").click(function(){
		$(this).addClass("active");
		$(this).siblings().removeClass("active");
	});
	
var index_url = window.location.search;//格式是【例：?code=*&state=*】
if(index_url != ""){
    var count = index_url.indexOf("&");
    var code = "";
    if(count > 6) {
        code = index_url.substring(6, count);
    }
    if(code != ""){
      $.ajax({
        type: 'post',
        url: '/method/wxtoken',
        data: {"code": code},
        async: false,
        success: function (result) {
            var json = JSON.parse(result);
            if(json != ""){
              $.ajax({
                type: 'post',
                url: '/method/wechatUserLogin',
                data: {"openid":json.openid,"unionid":json.unionid,"nickname":json.nickname,"sex":json.sex,"headimgurl":json.headimgurl},
                async: false,
                success: function (result) {
                   if(result == "fail"){
                      alert("异常！");
                  }else{
                      var json = JSON.parse(result);
                      setStorage('user',json);
                      getReferURL("referTo");
                  }
                },
                error:function(error){
                    alert("系统繁忙。。");
                }
              });
            }
           
        },
        error:function(error){
            alert("系统繁忙。。");
        }
      });
    }
}

	var status = getStorage("user");
	if(status == "noLogin"){
    $(".home").before($(".login_register").html());
	}else if(status == "outTime"){
    $(".home").before($(".login_register").html());
	}else{
		$(".home").after($(".welcome").html());
        if(status.nickname == undefined || status.nickname == ""){
            if(status.email == undefined || status.email == ""){
                if(status.username == undefined || status.username == ""){
                    $(".username_h").html("用户异常");
                }else{
                    $(".username_h").html(status.username);
                }
            }else{
                $(".username_h").html(status.email);
            }
        }else{
            $(".username_h").html(status.nickname);
        }
	}

	var url_jump = "search_pro.html?class=pro&keyword=";
    queryHotSearch("pro");
	/*首页搜索事件*/
   $("#main_search_button").click(function(){
        var keyword_input = $("#main_search_input").val();
        if (!keyword_input) {
            alert("请输入关键字！", "", function () {

            }, {type: 'question', confirmButtonText: '确定'});
            return false;
        }
        url_jump = url_jump + keyword_input;
        window.location.href = url_jump;
        return false;
    });
   $("#pro").click(function(){
   		$(".input").attr("placeholder","请输入您希望搜索的 产品名称/型号...");
   		url_jump = "search_pro.html?class=pro&keyword=";
       queryHotSearch("pro");
   });
   $("#com").click(function(){
   		$(".input").attr("placeholder","请输入您希望搜索的 企业名称...");
   		url_jump = "search_com.html?class=com&keyword=";
       queryHotSearch("com");
   });
   $("#hos").click(function(){
   		$(".input").attr("placeholder","请输入您希望搜索的 医疗机构名称...");
   		url_jump = "search_hos.html?class=hos&keyword=";
       queryHotSearch("hos");
   });
   $("#buy").click(function(){
      $(".input").attr("placeholder","请输入您希望搜索的 产品名称...");
      url_jump = "search_pri.html?class=pri&keyword=";
       queryHotSearch("pri");
   });
   $("#bid").click(function(){
   		$(".input").attr("placeholder","请输入您希望搜索的 中标产品...");
      url_jump = "search_bid.html?class=bid&keyword=";
       queryHotSearch("bid");
   });
   $(".header_main_right > .user").click(function(){
		$(".loginout").slideToggle();
	});
});

/**
 * 热词展示
 * @param classtype 热词的分类
 */
function queryHotSearch(classtype){
    $(".hot_key").siblings("a").remove();
    $.getJSON(url_prex+"/method/selectUsersearchWordByCondition?classtype="+classtype, function (res) {
        for(var i = 0;i < res.reverse().length;i++){
            $(".hot_key").after("<a href=\"search_"+classtype+".html?class="+classtype+"&keyword="+res[i]+"\">"+res[i]+"</a>");
        }
    })
}



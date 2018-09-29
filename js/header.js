$(function() {

    var status = getStorage("user");
    if(status == "noLogin"){
        $(".home_h").before($(".login_register_h").html());
    }else if(status == "outTime"){
        $(".home_h").before($(".login_register_h").html());
    }else{
        $(".home_h").after($(".welcome_h").html());
        /*if(status.username == undefined || status.username == ""){
          if(status.email == undefined || status.email == ""){
            if(status.nickname == undefined || status.nickname == ""){
            }else{
              $(".username_h").html(status.nickname);
            }
          }else{
            $(".username_h").html(status.email);
          }
        }else{
            if(status.email == undefined || status.email == ""){
                $(".username_h").html(status.username);
            }else{
                $(".username_h").html(status.email);
            }

        }*/
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

	var keyword_from_url = top.window.location.search;//格式是【例：?class=pro&keyword=*】
	var classify = keyword_from_url.substring(7, 10);

    var keyword_sub = keyword_from_url.substring(19);
    var keyword = decodeURI(keyword_sub);
    $("#header_select").find("option[value = '"+classify+"']").attr("selected","selected");
    if (keyword_from_url.indexOf("keyword") >= 0) {
        $("#header_search_input").val(keyword);
    }

	var url_jump = "search_pro.html?class=";
    $("#header_search_button").click(function () {
        var keyword_input = $("#header_search_input").val();
        if (keyword_input == "") {
            top.alert("请输入关键字！", "", function () {

            }, {type: 'question', confirmButtonText: '确定'});
            return false;
        }
        var flag = false;
        var status = getStorage("user");
        if(status == "noLogin"){
        }else if(status == "outTime"){
        }else{
            flag = true;
        }
        var header_select =  $("#header_select").val();
        if(header_select == 'pro'){
            url_jump = "search_pro.html?class=pro";
        }else if(header_select == 'com'){
            url_jump = "search_com.html?class=com";
        }else if(header_select == 'hos'){
            url_jump = "search_hos.html?class=hos";
        }else if(header_select == 'pri'){
            url_jump = "search_pri.html?class=pri";
        }else if(header_select == 'bid'){
            url_jump = "search_bid.html?class=bid";
        }
        url_jump = url_jump+"&keyword="+keyword_input
        top.window.location.href = url_jump;

    });
    
    $("#header_logo").click(function () {
        top.window.location.href = "index.html";
    });
    $(".wx_xcx").mouseover(function(){
        $(".weixin_content").show();
    }).mouseout(function(){
        $(".weixin_content").hide();
    });

});
function toView(obj){
    var keyword_input = $(obj).attr("title");
    var header_select =  $("#header_select").val();
    var url_jump = '';
    if(header_select == 'pro'){
        url_jump = "search_pro.html?class=pro";
    }else if(header_select == 'com'){
        url_jump = "search_com.html?class=com";
    }else if(header_select == 'hos'){
        url_jump = "search_hos.html?class=hos";
    }
    url_jump = url_jump+"&keyword="+keyword_input

    top.window.location.href = url_jump;
    return false;
}
function toIndex(){
        top.window.location.href = "index.html";
     }
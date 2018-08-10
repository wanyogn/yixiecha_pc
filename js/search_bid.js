var page_size = 10;
var start_page = 1;
var all_Count = 0;
$(function(){
    var flag = false;
    var status = getStorage("user");
    if(status == "noLogin"){
        
    }else if(status == "outTime"){
        
    }else{
        flag = true;
    }
    var keyword_from_url = window.location.search;
    classify = keyword_from_url.substring(7, 10);
    var keyword_sub = keyword_from_url.substring(19);
    keyword = decodeURI(keyword_sub);
    $(".key").html(keyword);

    $.getJSON(getURL(keyword,0), function (data) {
        all_Count = data.matchCount;
        $(".num").html(all_Count);
        contentTenderBidActive(data);
        if(flag){
            getInsertUsersearchURL(status.userid,"bid",keyword,all_Count);
        }else{
            getInsertUsersearchURL(-1,"bid",keyword,all_Count);
        }
    });
});
//装配招标中标信息
function contentTenderBidActive(data){

    $("#product_content").html("");

    var data_count = data.datas.length;//数据总数量

    for(var i = 0;i < data_count;i++){
        $("#product_content").append($("#tender_bid_template").html());
    }
    var data_list = $(".data_list")
    for(var i = 0;i < data_count;i++){
        var obj = data.datas[i];
        $(data_list[i].getElementsByClassName("bid_name_val")).html(getText(obj.title,35));
        $(data_list[i].getElementsByClassName("bid_name_val_a")).attr("href",$(data_list[i].getElementsByClassName("bid_name_val_a")).attr("href")+Base64.encode(obj.url)+"&word="+Base64.encode(obj.title));
       // $(data_list[i].getElementsByClassName("bid_name_val")).attr("data-url",$(data_list[i].getElementsByClassName("bid_name_val")).attr("data-url")+obj.web_url);
        $(data_list[i].getElementsByClassName("tender_release_date")).html(parseDate(obj.date));

        $(data_list[i].getElementsByClassName("bid_web_content")).html(getText(obj.content,100));
    }
    var page_total = Math.ceil(all_Count/page_size);
    if(page_total > 1000){page_total =1000}
    $(".page").pagination({
        currentPage: start_page,
        totalPage: page_total,
        isShow: true,
        count: 5,
        homePageText: "首页",
        endPageText: "尾页",
        prevPageText: "上一页",
        nextPageText: "下一页",
        callback: function(current) {
            start_page = current;
            document.documentElement.scrollTop = document.body.scrollTop = $(".left_three").offset().top;
            $.getJSON(getURL(keyword,current-1), function (json) { 
                data = json;
                contentTenderBidActive(data);
            });
        }
    });
}
function getURL(keyword,num){
    var url = url_prex + "/method/search_tenderbid_name?keyword="+keyword+"&num="+num;
    return url;
}

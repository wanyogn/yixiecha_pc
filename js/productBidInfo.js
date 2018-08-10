
$(function(){
    var flag = false;
    var status = getStorage("user");
    if(status == "noLogin"){
        alert("您还未登录，请先进行登录!","", function () {
            setStorage('referTo',window.location.href);
            top.location.href = to_login;
        }, {type: 'warning', confirmButtonText: '确定'});
    }else if(status == "outTime"){
        alert("您的登录状态已超时，请重新进行登录!","", function () {
            setStorage('referTo',window.location.href);
            top.location.href = to_login;
             }, {type: 'warning', confirmButtonText: '确定'});
    }else{
        flag = true;
    }
    if(flag){
        var keyword_from_url = window.location.search;//
        var keyword_sub = keyword_from_url.substring(14);
        var url_request = getProductBidInfoURL(keyword_sub);
        $.getJSON(url_request, function (json) {
            detailContentActive(json);
        });
    }
});

window.onscroll = function(){

    var distance = document.documentElement.scrollTop || document.body.scrollTop;
    if( distance >= 300 ) {
        $(".right_bottom_second").css("display","");
    } else {
        $(".right_bottom_second").css("display","none");
    }

    $(".right_bottom_second").click(function(){
        document.documentElement.scrollTop = document.body.scrollTop = 0;
    });
};

function detailContentActive(data){
    var obj = data.datas[0];

    $(".general_product_name").html(obj.product_name);
    $(".general_register_code").html("");
    /*if(obj.production_company.substring(0,1) == "\""){
        obj.production_company = obj.production_company.substring(1,obj.production_company.length-1);
    }
    if(obj.bid_company.substring(0,1) == "\""){
        obj.bid_company = obj.bid_company.substring(1,obj.bid_company.length-1);
    }*/
    $(".general_production_company").html(obj.product_company);
    $(".general_production_company").attr("href",$(".general_production_company").attr("href") + obj.product_company);
    $(".general_bid_company").html(obj.declare_company);
    $(".general_bid_company").attr("href",$(".general_bid_company").attr("href") + obj.declare_company);
    $(".general_acquisite_class").html(obj.directory_type);
    $(".general_city").html(obj.city);
    $(".general_publish_date").html(obj.publish_date);
    $(".general_project_name").html(obj.project_name);
    $(".general_price_type").html(obj.price_type);
    $(".general_unit_account").html(obj.unit_account);
    obj.purchase_price = changeTwoDecimal_f(obj.purchase_price);
    $(".general_purchase_price").html(obj.bid_price);
    $(".table_city").html(obj.province);
    $(".table_project_name").html(obj.project_name);
    $(".table_publish_date").html(obj.publish_date);
    $(".table_project_state").html(obj.project_state);
    $(".table_source_info").html(obj.source_info);
    $(".table_price_type").html(obj.price_type);
    $(".table_product_name").html(obj.product_name);
    $(".table_register_code").html("");
    $(".table_production_company").html(obj.product_company);
    $(".table_bid_company").html(obj.declare_company);
    $(".table_specification").html(obj.prodcut_specification);
    $(".table_model_number").html(obj.product_model);
    $(".table_acquisite_class").html(obj.directory_type);
    $(".table_belong_directory").html(obj.belong_directory);
    $(".table_unit_account").html(obj.unit_account);
    $(".table_purchase_price").html(obj.bid_price);
}

function changeTwoDecimal_f(x) {
    var f_x = parseFloat(x);
    if (isNaN(f_x)) {
        //alert('function:changeTwoDecimal->parameter error');
        return false;
    }
    var f_x = Math.round(x * 100) / 100;
    var s_x = f_x.toString();
    var pos_decimal = s_x.indexOf('.');
    if (pos_decimal < 0) {
        pos_decimal = s_x.length;
        s_x += '.';
    }
    while (s_x.length <= pos_decimal + 2) {
        s_x += '0';
    }
    return s_x;
}

function getProductBidInfoURL(id){
    var url = url_prex + "/method/search_acquisitebid_id?id="+id;
    return url;
}


var myinfoCount = 0;
var productCount = 0;
var companyCount = 0;
var currentItem=0;//当前的item
var userid = '';
var num = 0;

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
        userid = status.userid;
        $.getJSON(getUserCenter(userid), function (result) {
            contentActive(result.userinfo);
        });
        showContent(0,0,"");//默认第一页
        $(".body-head .pull-left span").click(function () {
            $(this).addClass("bluetip");
            $(this).siblings().removeClass("bluetip");

            currentItem = $(".body-head .pull-left span").index($(this)[0]);//获的当前选择的索引值
            showContent(currentItem,0,"");
            $(".bgContent .bg_div").eq(currentItem).show();
            $(".bgContent .bg_div").eq(currentItem).siblings().hide();
            $(".keyword").val("");
        })
    }
});
/*填充个人信息*/
function contentActive(json) {
    if(json.nickname == undefined || json.nickname == ""){
        if(json.email == undefined || json.email == ""){
            if(json.username == undefined || json.username == ""){
                $("#username").val("未知用户");
            }else{
                $("#username").val(json.username);
                $("#email").val(json.username);
            }
        }else{
            $("#username").html(json.email);
            $("#email").val(json.email);
        }
    }else{
        $("#username").html(json.nickname);
        $("#email").val(json.email);
    }

    if(json.headimg == undefined || json.headimg == ""){
        $(".user-pic").html("<span class=\"glyphicon glyphicon-user\"></span>");
        $(".user-pic").addClass("no-pic");
    }else{
        $(".user-pic").html("<img src=\""+json.headimg+"\" class=\"head-img\">")
    }
}
/*发送请求
* 根据索引判断*/
function  showContent(index,currentNum,keyword) {
    var classtype = 'all';
    if(index == 0){//消息中心
        classtype = 'all'
    }else if(index == 1){//产品图片
        classtype = 'pro'
    }else if(index == 2){//企业资质
        classtype = 'com'
    }
    $.ajax({
        type: 'post',
        url: url_prex+"/method/selectAuditByCondition",
        data: {userid:userid,num:currentNum,classtype:classtype,keyword:keyword},
        async: false,
        success: function (data) {
            contentContent(classtype,data,currentNum);
        }
    });
}

/**
 * 装配信息
 * @param classify 类型
 * @param num 数量
 */
function contentContent(classify,data,num) {
    var json = JSON.parse(data);
    if(classify == "all"){//我的消息
        let _html = `<div id="myinfo"></div>
                    <div class="page pagination pull-right" id="page1"></div>`;
        $("#div_one").html("");
        if(num == 0){myinfoCount = json.count;}
        if(myinfoCount > 0){
            $("#div_one").html(_html);
            for(var index in json.datas){
                if(json.datas[index].classtype == "pro"){
                    json.datas[index].title = `"${json.datas[index].name}"产品图片上传审核结果`;
                }else if(json.datas[index].classtype == "com"){
                    json.datas[index].title = `"${json.datas[index].name}"企业资质上传审核结果`;
                }
                json.datas[index].date = json.datas[index].createdate.substring(0,json.datas[index].createdate.length-2)
                let ele = `<div class="item clearfix">
								<span class="title">${json.datas[index].title}</span>
								<span class="time">${json.datas[index].date}</span>
								<a href="javascript:void(0)" onclick="toDetail('${json.datas[index].classtype}')" class="detail">详情</a>
							</div>`;
                $("#myinfo").append(ele);
            }
            new Page({
                id: 'page1',
                pageTotal: Math.ceil(myinfoCount/5), //必填,总页数
                pageAmount: 5,  //每页多少条
                dataTotal: myinfoCount, //总共多少条数据
                curPage:num+1, //初始页码,不填默认为1
                pageSize: 5, //分页个数,不填默认为5
                showPageTotalFlag:true, //是否显示数据统计,不填默认不显示
                showSkipInputFlag:true, //是否支持跳转,不填默认不显示
                getPage: function (page) {
                    //获取当前页数
                    showContent(0,page-1)
                }
            })
        }else{
            let _html = `<div class="none_main">
								<img src="images/usercenter/none_info.png">
								<p>您暂无任何信息哦~</p>
							</div>`;
            $("#div_one").html(_html);
        }

    }else if(classify == "pro"){//产品图片上传
        if(num == 0){productCount = json.count;}
        $("#div_two").empty();
        if(productCount > 0){
            fillAuditInfo(data,num);
            new Page({
                id: 'page2',
                pageTotal: Math.ceil(productCount/5), //必填,总页数
                pageAmount: 5,  //每页多少条
                dataTotal: productCount, //总共多少条数据
                curPage:num+1, //初始页码,不填默认为1
                pageSize: 5, //分页个数,不填默认为5
                showPageTotalFlag:true, //是否显示数据统计,不填默认不显示
                showSkipInputFlag:true, //是否支持跳转,不填默认不显示
                getPage: function (page) {
                    //获取当前页数
                    showContent(1,page-1)
                }
            })
        }else{
            let _html = `<div class="none_main">
								<img src="images/usercenter/none_info.png">
								<p>您暂无任何信息哦~</p>
							</div>`;
            $("#div_two").html(_html);
        }
    }else if(classify == "com"){//企业资质上传
        if(num == 0){companyCount = json.count;}
        $("#div_three").empty();
        if(companyCount > 0){
            fillCompanyInfo(data,num);
            new Page({
                id: 'page3',
                pageTotal: Math.ceil(companyCount/5), //必填,总页数
                pageAmount: 5,  //每页多少条
                dataTotal: companyCount, //总共多少条数据
                curPage:num+1, //初始页码,不填默认为1
                pageSize: 5, //分页个数,不填默认为5
                showPageTotalFlag:true, //是否显示数据统计,不填默认不显示
                showSkipInputFlag:true, //是否支持跳转,不填默认不显示
                getPage: function (page) {
                    //获取当前页数
                    showContent(2,page-1)
                }
            })
        }else{
            let _html = `<div class="none_main">
								<img src="images/usercenter/none_info.png">
								<p>您暂无任何信息哦~</p>
							</div>`;
            $("#div_three").html(_html);
        }
    }
}

/*填充产品审核信息*/
function fillAuditInfo(data,num) {
    let _html = `<table id="audit_table" cellpadding="10px">
                    <tr>
                        <th>序号</th>
                        <th>产品名称</th>
                        <th>上传内容</th>
                        <th>审核</th>
                        <th>操作</th>
                        <th>创建时间</th>
                    </tr>
                </table>
                <div class="bottom clearfix">
                    <button class="btn btn-primary pull-left mt20" onclick="delPro()">删除</button>
                    <div class="page pagination pull-right" id="page2"></div>
                </div>`;
    $("#div_two").html(_html);
    var obj = JSON.parse(data);
    //if(dataCount == -1) dataCount = obj.count;
    for(var i = 0; i < obj.datas.length; i++){
        var data = obj.datas[i];
        var tr = $("<tr class='audit_table_tr'></tr>");

        var td = $("<td></td>");
        if(data.state != 1){
            var div = $("<input type='checkbox' name='product' style='vertical-align: top;margin-right: 10px;' value='"+data.id+"'/>");
            td.append(div);
        }
        td.append(5*num+i+1);
        tr.append(td);

        var td = $("<td></td>");
        var div = $("<div class=\"audit_name_div\"></div>");
        var a = $("<a class=\"audit_td_a\" target=\"_blank\" href='http://www.yixiecha.cn/product.html?class=pro&id="+data.objectid+"'>"+data.objectname+"</a>");
        div.append(a);
        td.append(div);
        tr.append(td);

        var td = $("<td></td>");
        var a = $("<a class=\"audit_img_a\" href='../upload/product/"+data.objectid+"\\"+data.picturename+"'></a>");
        var img = $("<img class=\"audit_td_img\" src='../upload/product/"+data.objectid+"\\"+data.picturename+"' >");
        a.append(img);
        td.append(a);
        tr.append(td);

        var state = data.state;
        if(state == "1"){
            var td = $("<td></td>");
            var div = $("<div>等待审核</div>");
            td.append(div);
            tr.append(td);
            var td = $("<td></td>");
            var div = $("<div class=\"audit_td_recall\" onclick=\"auditRecall("+data.id+",'pro')\">撤回</div>");
            td.append(div);
            tr.append(td);
        }else if(state == "2"){
            var td = $("<td></td>");
            var div = $("<div>已撤回</div>");
            td.append(div);
            tr.append(td);
            var td = $("<td></td>");
            tr.append(td);
        }else if(state == "3"){
            var td = $("<td></td>");
            var div = $("<div>通过</div>");
            td.append(div);
            tr.append(td);
            var td = $("<td></td>");
            tr.append(td);
        }else if(state == "4"){
            var td = $("<td></td>");
            var div = $("<div>未通过审核</div>");
            td.append(div);
            tr.append(td);
            var td = $("<td></td>");
            var div1 = $("<div class=\"audit_td_reason\" onclick='auditReason(\""+data.reason.trim()+"\")'>查看详情</div>");
            var div2 = $("<div class=\"audit_td_reason reupload\" onclick='reUploadPro(\""+data.objectid+"\",\""+data.id+"\")'>重新上传</div>");
            td.append(div1);
            td.append(div2);
            tr.append(td);
        }
        tr.append(td);

        var td = $("<td>"+data.createdate.substring(0,data.createdate.length-2)+"</td>");
        tr.append(td);

        $("#audit_table").append(tr);
    }
    $(".audit_img_a").hover(function(){
        $(this).append("<p id='pic'><img src='"+this.href+"' id='pic1'></p>");
        $(".audit_img_a").mousemove(function(e){
            $("#pic").css({
                "top":(e.pageY+10)+"px",
                "left":(e.pageX+20)+"px"
            }).fadeIn("fast");
            // $("#pic").fadeIn("fast");
        });
    },function(){
        $("#pic").remove();
    });
}

/**
 * 填充公司信息
 * @param data
 */
function fillCompanyInfo(data) {
    let _html = `<table id="company_table" cellpadding="10px">
                    <tr>
                        <th>序号</th>
                        <th>企业名称</th>
                        <th>资证类型</th>
                        <th>上传内容</th>
                        <th>审核</th>
                        <th>操作</th>
                        <th>创建时间</th>
                    </tr>
                </table>
                <div class="bottom clearfix">
                    <button class="btn btn-primary pull-left mt20" onclick="delCom()">删除</button>
                    <div class="page pagination pull-right" id="page3"></div>
                </div>`;
    $("#div_three").html(_html);
    var obj = JSON.parse(data);
    for(var i = 0; i < obj.datas.length; i++){
        var data = obj.datas[i];
        var tr = $("<tr class='company_table_tr'></tr>");

        var td = $("<td></td>");
        if(data.state != 1){
            var div = $("<input type='checkbox' name='company' style='vertical-align: top;margin-right: 10px;' value='"+data.id+"'/>");
            td.append(div);
        }
        td.append(5*num+i+1);
        tr.append(td);

        var td = $("<td></td>");
        var div = $("<div class=\"audit_name_div\"></div>");
        var a = $("<a class=\"audit_td_a\" target=\"_blank\" href='http://www.yixiecha.cn/company.html?class=com&keyword=="+data.companyname+"'>"+data.companyname+"</a>");
        div.append(a);
        td.append(div);
        tr.append(td);

        var td = $("<td></td>");
        var state = data.type;
        if(state == 1){
            state = "医疗器械生产备案凭证";
        }else if(state == 2){
            state = "医疗器械生产许可证";
        }else if(state == 3){
            state = "医疗器械经营备案凭证";
        }else if(state == 4){
            state = "医疗器械经营许可证";
        }else if(state == 5){
            state = "营业执照";
        }
        td.append(state);
        tr.append(td);

        var td = $("<td></td>");
        var a = $("<a class=\"audit_img_a\" href='../upload/company/"+userid+"\\"+data.picturename+"'></a>");
        var img = $("<img class=\"audit_td_img\" src='../upload/company/"+userid+"\\"+data.picturename+"' >");
        a.append(img);
        td.append(a);
        tr.append(td);

        var state = data.state;
        if(state == "1"){
            var td = $("<td></td>");
            var div = $("<div>等待审核</div>");
            td.append(div);
            tr.append(td);
            var td = $("<td></td>");
            var div = $("<div class=\"audit_td_recall\" onclick=\"auditRecall("+data.id+",'com')\">撤回</div>");
            td.append(div);
            tr.append(td);
        }else if(state == "2"){
            var td = $("<td></td>");
            var div = $("<div>已撤回</div>");
            td.append(div);
            tr.append(td);
            var td = $("<td></td>");
            tr.append(td);
        }else if(state == "3"){
            var td = $("<td></td>");
            var div = $("<div>通过</div>");
            td.append(div);
            tr.append(td);
            var td = $("<td></td>");
            tr.append(td);
        }else if(state == "4"){
            var td = $("<td></td>");
            var div = $("<div>未通过审核</div>");
            td.append(div);
            tr.append(td);
            var td = $("<td></td>");
            var div1 = $("<div class=\"audit_td_reason\" onclick='auditReason(\""+data.reason.trim()+"\")'>查看详情</div>");
            var div2 = $("<div class=\"audit_td_reason reupload\" onclick='reUploadCom(\""+data.companyname+"\",\""+data.id+"\")'>重新上传</div>");
            td.append(div1);
            td.append(div2);
            tr.append(td);
        }
        tr.append(td);

        var td = $("<td>"+data.createdate.substring(0,data.createdate.length-2)+"</td>");
        tr.append(td);

        $("#company_table").append(tr);
    }
    $(".audit_img_a").hover(function(){
        $(this).append("<p id='pic'><img src='"+this.href+"' id='pic1'></p>");
        $(".audit_img_a").mousemove(function(e){
            $("#pic").css({
                "top":(e.pageY+10)+"px",
                "left":(e.pageX+20)+"px"
            }).fadeIn("fast");
            // $("#pic").fadeIn("fast");
        });
    },function(){
        $("#pic").remove();
    });
}
/*搜索*/
$(".searchBtn").click(function () {
    var keyword = $(".keyword").val();
    showContent(currentItem,0,keyword);
});
$(".keyword").keydown(function(e) {
    if (e.keyCode == 13) {
        $(".searchBtn").click();
    }
});

/**
 * 详情
 */
function toDetail(classtype) {
    if(classtype == 'pro'){
        $(".body-head .pull-left span").eq(1).click();
    }else if(classtype == 'com'){
        $(".body-head .pull-left span").eq(2).click();
    }
}

/**
 * 重新上传产品
 * @param id 产品ID
 * @param delId 删除的信息ID
 */
function reUploadPro(id,delId) {
    window.open("product.html?class=pro&id="+id+"&delId="+delId);
}

/**
 * 重新上传企业
 * @param companyname  公司名称
 * @param delId 删除的信息id
 */
function reUploadCom(companyname,delId) {
    window.open(encodeURI("perfect_cominfo.html?companyname="+companyname+"&delId="+delId));
}

/**
 * 撤回操作
 * @param id  id
 * @param classtype 类型
 */
function auditRecall(id,classtype) {
    confirm("确定撤回嘛?", "", function (isConfirm) {
        if (isConfirm) {
            $.ajax({
                type: 'post',
                url: url_prex+"/method/recallAuditById",
                data: {
                    id: id,
                    classtype:classtype
                },
                async: false,
                success: function () {
                    if(classtype == 'pro'){
                        showContent(1,0,"");
                    }else if(classtype == 'com'){
                        showContent(2,0,"");
                    }

                }

            });
        } else {
            //after click the cancel
        }
    }, {confirmButtonText: '确定', cancelButtonText: '返回'});
}

/**
 * 删除产品
 */
function delPro() {
    var products=$("input[name='product']:checked");
    if(products.length > 0){
        var delIds = '';
        products.each(function(i){
            delIds += $(this).val();
        })
        handlerDel(delIds,"pro",function () {
            showContent(1,0,"");
        })
    }else{
        alert("请勾选需要删除的信息！");
    }
}

/**
 * 删除公司
 */
function delCom() {
    var companys = $("input[name='company']:checked");
    if(companys.length > 0){
        var delIds = '';
        companys.each(function(i){
            delIds += $(this).val();
        })
        console.log(delIds);
        handlerDel(delIds,"com",function () {
            showContent(2,0,"");
        })
    }else{
        alert("请勾选需要删除的信息！");
    }
}

/**
 * 执行删除操作
 * @param ids  删除的ids
 * @param classtype 类型
 */
function handlerDel(ids,classtype,callback){
    $.ajax({
        type: 'post',
        url: url_prex+"/method/deleteAuditById",
        data: {
            ids: ids,
            classtype:classtype
        },
        async: false,
        success: function () {
            callback();
        }

    });
}

//查看驳回原因
function auditReason(reason) {
    alert(reason,"", function () {

    }, {type: 'warning', confirmButtonText: '确定'});
}




var dataCount = -1;
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
    var index_url = window.location.search;//格式是【例：?code=*&state=*】

    if(flag){
        userid = status.userid;
        $.getJSON(getUserCenter(userid), function (result) {
            contentActive(result.userinfo);
        });

        //获得审核信息
        $.ajax({
            type: 'post',
            url: "/method/selectAuditByCondition",
            data: {
                userid: userid,
                num: num
            },
            async: false,
            success: function (data) {
                fillAuditInfo(data);
                pageConfig();
            }

        });
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

/*填充审核信息*/
function fillAuditInfo(data) {
    $(".audit_table_tr").remove();
    var obj = JSON.parse(data);
    if(dataCount == -1) dataCount = obj.count;
    for(var i = 0; i < obj.datas.length; i++){
        var data = obj.datas[i];
        var tr = $("<tr class='audit_table_tr'></tr>");

        var td = $("<td></td>");
        var a = $("<a class=\"audit_img_a\" href='../upload/product/"+data.objectid+"\\"+data.picturename+"'></a>");
        var img = $("<img class=\"audit_td_img\" src='../upload/product/"+data.objectid+"\\"+data.picturename+"' >");
        a.append(img);
        td.append(a);
        tr.append(td);

        var td = $("<td></td>");
        var div = $("<div class=\"audit_name_div\"></div>");
        var a = $("<a class=\"audit_td_a\" target=\"_blank\" href='http://www.yixiecha.cn/product.html?class=pro&id="+data.objectid+"'>"+data.objectname+"</a>");
        div.append(a);
        td.append(div);
        tr.append(td);

        var td = $("<td></td>");
        var state = data.state;
        if(state == "1"){
            var div = $("<div>等待审核</div>");
            td.append(div);
            var div = $("<div class=\"audit_td_recall\" onclick=\"auditRecall("+data.id+")\">撤回</div>");
            td.append(div);
        }else if(state == "2"){
            var div = $("<div>已撤回</div>");
            td.append(div);
        }else if(state == "3"){
            var div = $("<div>通过</div>");
            td.append(div);
        }else if(state == "4"){
            var div = $("<div>未通过审核</div>");
            td.append(div);
            var div = $("<div class=\"audit_td_reason\" onclick='auditReason(\""+data.reason+"\")'>查看原因</div>");
            td.append(div);
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

/*装配分页信息*/
function pageConfig() {

    $(".page").pagination({
        currentPage: 1,
        totalPage: Math.ceil(dataCount/10),
        isShow: true,
        count: 5,
        homePageText: "首页",
        endPageText: "尾页",
        prevPageText: "上一页",
        nextPageText: "下一页",
        callback: function(current) {
            dataSelectCondition(current);
        }
    });
}

function dataSelectCondition(current) {
    num = current - 1;
    //获得审核信息
    $.ajax({
        type: 'post',
        url: "/method/selectAuditByCondition",
        data: {
            userid: userid,
            num: num
        },
        async: false,
        success: function (data) {
            fillAuditInfo(data);
        }

    });
}

//撤回操作
function auditRecall(id) {
    confirm("确定撤回嘛?", "", function (isConfirm) {
        if (isConfirm) {
            $.ajax({
                type: 'post',
                url: "/method/recallAuditById",
                data: {
                    id: id,
                },
                async: false,
                success: function () {
                    dataSelectCondition(num + 1)
                }

            });
        } else {
            //after click the cancel
        }
    }, {confirmButtonText: '确定', cancelButtonText: '返回'});
}

//查看驳回原因
function auditReason(reason) {
    alert(reason,"", function () {

    }, {type: 'warning', confirmButtonText: '确定'});
}




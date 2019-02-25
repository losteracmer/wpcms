$(function () {
    $.ajax({
        url: "/login/getadminmsg",
        success: function (data) {
            if (data.code == 200) {
                $("#adminAvatarUrl").attr('src', data.adminMsg.avatarUrl);
                $("#adminNickName").html(data.adminMsg.nickname);
                $("#adminAvatarUrl2").attr('src', data.adminMsg.avatarUrl);
                $("#adminNickName2").html(data.adminMsg.nickname);
                $("#adminAccount").html(data.adminMsg.account);

            } else {
                toastr.error(data.msg)
            }
        },
        error: function (error) {
            toastr.error('网络异常');
        }
    })
    $("#logoutBtn").on('click', function () {


        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        //var admin = getCookie('admin')
        document.cookie = "admin=null"+";expires=" + exp.toGMTString();
        window.location.reload();
    })
})
//  navigation 模板 请求
// $(function(){
//     $.ajax({
//         url: '/navigation/getnavigation',
//         data: {
            
//         },
//         success: function (data, textStatus) {
//             console.log("navi:"+JSON.stringify(data));
//             if (data.code == 200) {
//                 var feStr = template('naviListTemplate', data);
//                     $("#sidebarnav").html(feStr);
//             } else{
//                 toastr.error(data.msg);
//             }
//         },
//         error: function (error) {
//             toastr.error('网络故障...')
//         },
//         complate:function(){}
//     })  
// })
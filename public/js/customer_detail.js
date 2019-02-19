

function doBolckUI() {
    $.blockUI({
        message: '<i class="fas fa-spin fa-sync text-white"></i><i class="text-white">提交请求中...</i>',
        overlayCSS: {
            backgroundColor: '#000',
            opacity: 0.5,
            cursor: 'wait'
        },
        css: {
            color: '#333',
            border: 0,
            padding: 0,
            backgroundColor: 'transparent'
        },
    })
}

function getorder(pars) {
    $.ajax({
        url: '/sales/customerorder',
        data: pars,
        success: function (data, textStatus) {
            var orderlistStr = template('orderListTemplate', data);
            $("#choseorderselect").html(orderlistStr);
        },
        error: function (xhr, textStatus) {
            alert('网络异常')
        }
    })
}

function getaccmaintain(pars) {
    //获取配件列表
    //console.log("getaccmaintain");
    $.ajax({
        url: '/accessories/getlist',
        success: function (data, textStatus) {
            //console.log('accessories list 请求成功' + JSON.stringify(data));

            var accessorieslistStr = template('accessoriesListTemplate', data);
            $("#choseaccessoriesselect").html(accessorieslistStr);
        },
        error: function (xhr, textStatus) {
            alert('网络异常')
        }
    })
}

//修改用户状态：
function changeCustomerStatus(that) {
    let status = $(that).html();
    console.log(status);
    alert(status);
}

function getCustomerFestatus(pars) {
    $.get("/customer/getfestatus", pars, function (data) {
        console.log("festatus:",data)
        /**
         * 将传来的滤芯按照不同的机器码区分，分别渲染到前台
         * */
        let allMachine = [];
        let sale_id = null;
        let machineIndex = 0;
        let oneMachine = [];
        for (let item of data.festatus) {
            console.log("其中一个item:",item)
            if (sale_id == null) {
                sale_id = item.sale_id;
            } else if (item.sale_id != sale_id) {
                machineIndex++;
                sale_id = item.sale_id;
                allMachine.push(oneMachine);
                oneMachine = [];
            } 
                console.log("push 成功");
                
                oneMachine.push(item);
            
            
        }
        if(oneMachine.length != 0)
        allMachine.push(oneMachine);
        console.log(allMachine);
        let templateStr = "";
        for (let oneMachine of allMachine) {
            templateStr += template("festatusTableTemplate", {
                festatus: oneMachine,
                machine_model: oneMachine[0].machine_model
            })
        }
        $("#festatusTable").html(templateStr)
    })
}

$(document).ready(function () {
    var pars = window.location.href.split('?')[1];
    //console.log('参数:' + pars);
    $.ajax({
        url: '/customer/getdetail' + '?' + pars,
        success: function (data, textStatus) {
            //console.log('get data: ' + JSON.stringify(data))
            if (data.code == 200) {
                var badge;
                if (data.detail.customer_status == 0) {
                    badge = '<span id="customerStatus" class="badge badge-success badge-pill" click=changeCustomerStatus(this)> 正常</span>';
                } else {
                    badge = '<span id="customerStatus" class="badge badge-danger badge-pill"> 僵尸</span>';
                }
                $("#real_name").html(data.detail.real_name + badge);
                $("#address").html(data.detail.address);
                $("#mobile_1").html(data.detail.mobile_1);
                $("#mobile_2").html(data.detail.mobile_2);
                $("#address").html(data.detail.address);
                $("#customer_avatarUrl").attr('src', data.detail.customer_avatarUrl);
                //input 内容更新
                $("#p_real_name").val(data.detail.real_name);
                $("#p_mobile_1").val(data.detail.mobile_1)
                $("#p_mobile_2").val(data.detail.mobile_2)
                $("#p_address").val(data.detail.address)
                $("#p_customer_area").val(data.detail.customer_area)
                $("#p_customer_from").val(data.detail.customer_from)
                $("#p_remark").val(data.detail.remark)
                $(`input[name='customer_star'][value=${data.detail.customer_star}]`).attr('checked', true)

            } else if (data.code == 302) {
                window.location.href = data.href;
            } else {
                toastr.error(data.msg);
            }
        }
    });
    //滤芯维修记录
    $.ajax({
        url: '/customer/maintenance' + '?' + pars,
        success: function (data, textStatus) {
            if (data.code == 200) {

                var maintenanceStr = template('maintenanceTemplate', data);
                $("#maintenance").html(maintenanceStr);
            } else {
                toastr.warning(data.msg);
            }
        }
    })
    //配件维修记录
    $.ajax({
        url: '/customer/accmaintenance' + '?' + pars,
        success: function (data, textStatus) {
            if (data.code == 200) {

                var accmaintainStr = template('accmaintainTemplate', data);
                $("#accmaintain").html(accmaintainStr);
            } else {
                toastr.warning(data.msg);
            }
        }
    })
    //用户订单
    $.ajax({
        url: '/sales/customerorder' + '?' + pars,
        success: function (data, textStatus) {
            if (data.code == 200) {
                var orderTemplateStr = template('orderTemplate', data);
                $("#orderList").html(orderTemplateStr);
            } else {
                toastr.warning(data.msg);
            }
        }
    })
    //获取工人列表
    $.ajax({
        url: '/labour/getlist',
        success: function (data, textStatus) {
            //console.log('labour list 请求成功' + data);

            var lobourlistStr = template('labourListTemplate', data);
            $("#choselabourselect").html(lobourlistStr);
        },
        error: function (xhr, textStatus) {
            alert('网络异常')
        }
    })

    getCustomerFestatus(pars);
    // 获取 用户滤芯状态

    getaccmaintain(pars);
    //获取此用户全部订单
    getorder(pars);
})
$(document).ready(function () {
    var pars = window.location.href.split('?')[1];

    $("#updatebtn").on('click', function () {
        doBolckUI();
        var formStr = $("#customerDetailForm").serialize();
        console.log(typeof formStr);
        var pars = window.location.href.split('?')[1]
        console.log(formStr);
        $.ajax({
            url: '/customer/change',
            type: "POST",
            data: formStr + "&" + pars,
            success: (data, textStatus) => {
                if (data.code == 200) {
                    toastr.success(data.msg)
                } else {
                    toastr.error(data.msg)
                }
            },
            error: (error) => {
                toastr.error(JSON.stringify(error));
            },
            complete: () => {
                setTimeout(() => {
                    $.unblockUI()
                }, 300);
            }
        })
    })
    $("#addAccmaintainBtn").on('click', function (that) {
        var addaccFormObj = $("#addAccmaintainForm").serialize();
        $.ajax({
            url: '/accessories/addmaintain',
            data: addaccFormObj,
            success: function (data, textStatus) {
                if (data.code == 200) {
                    toastr.success(data.msg);
                    getaccmaintain(window.location.href.split('?')[1]);
                } else {
                    toastr.error(data.msg)
                }
            },
            error: function (error) {
                alert('网络错误')
            }
        })
    })
    $("#accmaintain").on("click", ".doitbtn-makesucess", function (that) {
        var accmaintain_id = $(this).data('accmaintain_id');

        $.ajax({
            url: '/accessories/setaccmaintainfinish',
            data: {
                accmaintain_id: accmaintain_id
            },
            success: function (data) {
                if (data.code == 200) {
                    toastr.success(data.msg);
                    //getaccmaintain(window.location.href.split('?')[1]);
                    setTimeout(() => {
                        window.location.reload();
                    }, 1300);

                } else {
                    toastr.error(data.msg);
                }
            },
            error: function (error) {
                toastr.error('网络异常');
            }
        })
    })
    //修改客户状态
    $("#real_name").on("click", "#customerStatus", function () {
        let status = $(this).text();
        console.log(status)
        let setUrl = "";
        //注意这里有一个空格
        if(status == " 正常"){
            setUrl = "/customer/setlazy";
        }else {
            setUrl = "/customer/setunlazy"
        }
            let _confirm = confirm("确定将此客户设为"+(status == " 正常"?"僵尸":"正常")+"客户吗？");
            if(_confirm){
                doBolckUI();
                $.ajax({
                    url:setUrl,
                    data:pars,
                    success:function(data){
                        if(data.code ==200){
                            toastr.success(data.msg);
                        }else {
                            toastr.error(data.msg);
                        }
                    },
                    complete:function(){
                        $.unblockUI();
                    }
                })
            }
        
    })
    //注册 input type date 事件
    $("#festatusTable").on("input", "input", function () {
        let finishtime = $(this).val()
        let _confim = confirm("确定更改时间:" + finishtime);
        if (_confim) {
            let festatus_id = $(this).attr("data-festatusId");
            doBolckUI();
            $.ajax({
                url: '/customer/finished',
                data: {
                    finishtime: finishtime,
                    fesid: festatus_id
                },
                success: function (data) {
                    if (data.code == 200) {
                        toastr.success(data.msg);
                    } else {
                        toastr.error(data.msg);
                    }
                    getCustomerFestatus(window.location.href.split('?')[1]);
                },
                complete: function () {
                    $.unblockUI();
                }
            })
        }
    })
})
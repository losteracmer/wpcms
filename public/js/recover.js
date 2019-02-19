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
function getCustomerList() {
    $.ajax({
        url: '/customer/getlist',
        success: function (data) {
            if (data.code == 200) {
                var customerListStr = template('customerListTemplate', data);
                $("#customerList").html(customerListStr);
            } else {
                toastr.error(data.msg)
            }
        }
    })
}

function getmachineList() {
    $.ajax({
        url: '/machine/getmachinelist',
        success: function (data) {
            if (data.code == 200) {
                var machineListStr = template('machineListTemplate', data);
                $("#machineList").html(machineListStr);
            } else {
                toastr.error(data.msg)
            }
        }
    })
}
function format(timeStr){
    let timeArr = timeStr.split("-");
    if(timeArr[1].length ==1){
        timeArr[1] = "0"+timeArr[1];
    }
    if(timeArr[2].length ==1){
        timeArr[2] = "0"+timeArr[2];
    }
    return timeArr[0]+"-"+timeArr[1]+"-"+timeArr[2];
}
$(function () {

    getCustomerList();
    getmachineList();

    $("#submit").on("click", function () {
        let titleStr = $("#titleStr").val();
        let valueStr = $("#valueStr").val();
        let a_machine_id = $("#a_machine_id").val();
        let a_machine_model = $("#a_machine_model").val();
        let a_sale_time = $("#a_sale_time").val();
        doBolckUI();
        $.ajax({
            url: '/parsecustomer/parsemsg',
            data: {
                titleStr,
                valueStr,
                machine_id:a_machine_id,
                machine_model:a_machine_model,
                sale_time:a_sale_time
            },
            success: function (data, textStatus) {
                if (data.code == 200) {
                    console.log(data);

                    //input 内容更新
                    $("#p_real_name").val(data.real_name);
                    $("#p_mobile_1").val(data.mobile_1)
                    $("#p_mobile_2").val(data.mobile_2)
                    $("#p_address").val(data.address)
                    $("#p_customer_area").val(data.customer_area)
                    $("#p_customer_from").val(data.customer_from)
                    $("#p_remark").val(data.remark)
                    $(`input[name='customer_star']`).attr('checked', false);
                    $(`input[name='customer_star'][value=${data.customer_star}]`).attr('checked', true);
                    $("#machine_code").val(data.machine_code)
                    $("#machine_id").val(data.machine_id)
                    $("#machine_model").val(data.machine_model)
                    $("#sale_time").val(format(data.sale_time));
                    
                    //处理festatus
                    let fe_last_time = data.fe_last_time;
                    $("#festatusTable").html(template("festatusTableTemplate",{festatus:fe_last_time}));
                    $("#confirmAndSubmit").removeAttr("disabled")
                } else if (data.code == 405) {
                    toastr.warning(data.msg);
                    $("#machine_model_div").show();
                } else if(data.code == 406){
                    toastr.warning(data.msg);
                    $("#sale_time_div").show();
                } else {
                    toastr.error(data.msg)
                }
            },
            error: function (error) {
                toastr.error('网络故障...')
            },
            complete: function () {
                $.unblockUI();
            }
        })
    })
})

//绑定事件
$(function () {

    $("#chooseMachineModel").on("click", function () {
        $("#choseMachineModal").modal("show");
    })

    $("#savaChoseMachine").on("click", function () {
        
        var choseMachine_msg = $("#machineList").val();
        var machine_id = choseMachine_msg.split("|")[0];
        var machine_model = choseMachine_msg.split("|")[1];
        console.log(choseMachine_msg)
        $("#a_machine_model").val(machine_model)
        $("#a_machine_id").val(machine_id)
        $("#choseMachineModal").modal("hide");
    })

    //删除valueStr 后 清空 a_value
    $("#valueStr").on("input propertychange",function(){
        $("#sale_time_div").hide();
        $("#a_sale_time").val("");
        $("#machine_model_div").hide();
        $("#a_machine_model").val("");
        $("#a_machine_id").val("");
    })
    $("#titleStr").on("input propertychange",function(){
        $("#valueStr").val("");
        $("#sale_time_div").hide();
        $("#a_sale_time").val("");
        $("#machine_model_div").hide();
        $("#a_machine_model").val("");
        $("#a_machine_id").val("");
    })
    //确认提交后
    $("#confirmAndSubmit").on("click",function(){
        doBolckUI();
        let customerDetailObj = $("#customerDetailForm").serialize();
        let orderObj = $("#orderForm").serialize();
        let festatusObj = $("#festatusForm").serialize();
        $.ajax({
            url: '/parsecustomer/submit',
            type:"POST",
            data: customerDetailObj+"&"+orderObj+"&"+festatusObj,
            success: function (data, textStatus) {
                if (data.code == 200) {
                    //显示信息，清空数据
                    toastr.success(data.msg);
                    $("#sale_time_div").hide();
                    $("#a_sale_time").val("");
                    $("#machine_model_div").hide();
                    $("#a_machine_model").val("");
                    $("#a_machine_id").val("");
                }else{
                    toastr.error(data.msg);
                }
            },
            error: function (error) {
                toastr.error('网络故障...')
            },
            
            complete:function(){
                $.unblockUI()
            }
        })
    })
})
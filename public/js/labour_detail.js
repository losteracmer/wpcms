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

//全局 记录变量
var G_fe_id;

function showAddNumberModel(fe_id) {
    console.log(fe_id);
    $("#addQuantityModal").modal("show");
    G_fe_id = fe_id;
}

function addNewFE() {

    var pars = window.location.href.split('?')[1];

    var objTo = document.getElementById('labourstragecontainter')
    var divtest = document.createElement("div");
    divtest.setAttribute("class", "form-group");

    $.ajax({
        url:"/labour/getnotstoragefelist",
        data:pars,
        success:function (data) {
            if (data.code == 200) {
                let felistStr = "";
                for (let i = 0; i < data.felist.length; i++) {
                    felistStr += `<option value="${data.felist[i].fe_id}" selected>${data.felist[i].fe_model}</option>`
                }
                divtest.innerHTML = `
        <form class="row">
            <div class="col-sm-3">
                <div class="form-group">
                    <select name="fe_model"
                            class="select2 form-control custom-select"
                            style="width: 100%; height:36px;">

                        ${felistStr}

                    </select>
                </div>
            </div>
            <div class="col-sm-2">
                <div class="form-group">
                    <input type="number" class="form-control" name="quantity" value="<%=item.quantity%>"
                           name="quantity" placeholder="数量">
                </div>
            </div>
            <div class="col-sm-1">
                <div class="form-group">
                    <button class="btn btn-success" type="button" onclick="confirmNew(this)">
                        确定
                    </button>
                </div>
            </div>

        </form>
    `
                objTo.appendChild(divtest)
            }
        },
        error: function (xhr, textStatus) {
            alert('网络异常')
        }
    })

}

function confirmNew(that) {
    var pars = window.location.href.split('?')[1];
    let labour_id = pars.split("=")[1];
    let fe_id = $(that).parents("form.row").find(".select2").val();
    let number = $(that).parents("form.row").find("input[name='quantity']").val();
    console.log(fe_id);
    console.log(number);
    if(!number){
        alert("请输入添加数量");
        return ;
    }
    $.ajax({
        url:"/labour/setLabourStorage",
        data:{
            fe_id:fe_id,
            number:number,
            labour_id:labour_id
        },

        success:function (data) {
            if (data.code == 200) {
                getLabourStorage(pars);
            }
        }
    })
}

function getLabourStorage(pars) {

    $.ajax({
        url: '/labour/storage',
        data: pars,
        success: function (data, textStatus) {
            if (data.code == 200) {
                var labourstorageListStr = template('labourstorageTemplate', data);
                $("#labourstragecontainter").html(labourstorageListStr);
            } else {
                alert(data.msg);
            }

        },
        error: function (xhr, textStatus) {
            alert('网络异常')
        }
    })
}

$(document).ready(function () {
    var pars = window.location.href.split('?')[1];
    var labour_id = pars.split("=")[1];
    console.log('参数:' + pars);
    //获取库存
    getLabourStorage(pars);
    $.ajax({
        url: '/labour/getdetail' + '?' + pars,
        success: function (data, textStatus) {
            console.log('get data: ' + JSON.stringify(data))
            if (data.code == 200) {
                $("#labour_name").html(data.detail.labour_name);
                $("#labour_avatarUrl").attr('src', data.detail.labour_avatarUrl);
                //input 内容更新
            } else if (data.code == 302) {

                window.location.href = data.href;
            } else {
                toastr.error(data.msg);
            }
        }
    });
    //滤芯维修记录
    $.ajax({
        url: '/labour/maintenance' + '?' + pars,
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
        url: '/labour/accmaintenance' + '?' + pars,
        success: function (data, textStatus) {
            if (data.code == 200) {

                var accmaintainStr = template('accmaintainTemplate', data);
                $("#accmaintain").html(accmaintainStr);
            } else {
                toastr.warning(data.msg);
            }
        }
    })


});
$(document).ready(function () {
    var pars = window.location.href.split('?')[1];
    var labour_id = pars.split("=")[1];

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

    $("#addQuantityBtn").on("click","",function (e) {
        let addRecord = $("#addRecord").val();
        let addNumber = $("#addNumber").val();

        console.log("addrecord:" + addRecord);
        console.log("addNumber:" + addNumber);
        $.ajax({
            url: "/labour/addstorage",
            data:{
                addRecord,addNumber,labour_id,
                fe_id: G_fe_id
            },
            success:function (data) {
                if (data.code === 200) {
                    toastr.success(data.msg);
                    $("#addQuantityModal").modal("hide");
                    getLabourStorage(pars);
                }else {
                    toastr.warning(data.msg);
                }

            },
            error:function (err) {
                toastr.error("网络故障");
            }
        })

    })
});
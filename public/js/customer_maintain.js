var Gsale_id = null;
var Gindex_table = null;
var Goption = {
	validshow: true,
	allotshow: false,
	lazyshow: true
};

function setDelayTime() {

	//延迟提醒 ，就是更新 lastMaintain 时间，达到延迟提醒的作用
	var delaytime = $("#delaytimeid").val();
	//alert(delaytime)
	var sale_id = Gsale_id;
	$.ajax({
		url: '/customermaintain/delayremind',
		data: {
			sale_id: sale_id,
			delaytime: delaytime
		},
		success: function (data, textStatus) {
			if (data.code == 200) {
				//alert(data.msg)
				$("#delayremind").modal("hide");
				toastr.success(data.msg);
				Gindex_table.ajax.reload();

			} else {
				toastr.error(data.msg);
			}
		},
		error: function (xhr, textStatus) {
			alert(JSON.stringify(xhr));
		}
	})

}

function setFinishTime() {

	var finishtime = $("#finishtimeid").val();
	//alert(delaytime)
	var sale_id = Gsale_id;
	$.ajax({
		url: '/customermaintain/finished',
		data: {
			sale_id: sale_id,
			finishtime,
			finishtime
		},
		success: function (data, textStatus) {
			if (data.code == 200) {
				toastr.success(data.msg);
				Gindex_table.ajax.reload();
				$("#setFinishTime").modal("hide");
			} else {
				toastr.warning(data.msg)
			}
		},
		error: function (error) {
			alert(error)
		}
	})

}

function setDistribution() {
	var choseLabourObj = $("#choseLabourForm").serialize();
	$.ajax({
		url: '/customermaintain/setlabour' + "?" + choseLabourObj,
		data: {
			sale_id: Gsale_id
		},
		success: function (data, textStatus) {
			if (data.code == 200) {
				toastr.success(data.msg);
				$("#choselabour").modal("hide");
				Gindex_table.ajax.reload();
			} else {
				toastr.error(data.msg);
			}

		},
		error: function (xhr, textStatus) {
			console.error(xhr)
		}
	})
}

function setEvent() {
	//console.log('设置事件');
	//console.log($(".dropdown-item"))
	$("a.event").off(); //清空所有事件...
	$("a[data-event='delay']").bind('click', function () {

		var sale_id = $(this).parent().data('sale_id');
		Gsale_id = sale_id;
		console.log("sale_id: " + sale_id);
		$("#delayremind").modal("show");
	})
	$("a[data-event='distribution']").bind('click', function () {

		var sale_id = $(this).parent().data('sale_id');
		Gsale_id = sale_id;
		console.log("sale_id: " + sale_id);
		$.ajax({
			url: '/labour/getlist',
			success: function (data, textStatus) {
				console.log('labour list 请求成功' + data);

				var lobourlistStr = template('labourListTemplate', data);
				$("#choselabourselect").html(lobourlistStr);
			},
			error: function (xhr, textStatus) {

			}
		})
		$("#choselabour").modal("show");
	})

	$("a[data-event='detail']").bind('click', function () {
		var sale_id = $(this).parent().data('sale_id');
		$.ajax({
			url: '/customermaintain/getcustomerid',
			data: {
				sale_id: sale_id
			},
			success: function (data, textStatus) {
				if (data.code == 200) {
					toastr.success('正在跳转...')
					window.open('/customer_detail.html?customer_id=' + data.customer_id)
					//window.location.href = '/customer_detail.html?customer_id=' + data.customer_id;
				} else {
					toastr.warning(data.msg)
				}
			},
			error: function (error) {
				alert(error)
			}
		})

	})
	$("a[data-event='finished']").bind('click', function () {
		var sale_id = $(this).parent().data('sale_id');
		Gsale_id = sale_id;
		$("#setFinishTime").modal("show");

	})
}

function createButton(id) {
	//console.log('渲染完成')
	return `<td class="hidden-print">
						<div class="btn-group">
							<button type="button" class="btn btn-dark dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onclick=setEvent()>
							<i class="ti-settings"></i>
						</button>
							<div data-sale_id='${id}' class="dropdown-menu animated slideInUp" x-placement="bottom-start" style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(0px, 35px, 0px);">
								<a class="dropdown-item detail event" href="javascript:void(0)"  data-event='detail' data-etitle='客户详情'><i class='ti-eye'></i> </a>
								<a class="dropdown-item distribution event" href="javascript:void(0)"  data-event='distribution' data-etitle='派工'><i class="ti-pencil-alt"></i> </a>
								<a class="dropdown-item delayevent event" href="javascript:void(0)" data-event='delay' id='delayevent' data-etitle='推迟半年'><i class="ti-na"></i> </a>
							</div>
						</div>
					</td>`
};

function TableInit() {



	Gindex_table = $("#index_list_table").DataTable({
		//dom: 'Bfrtip',
		//columnDefs:[{"targets":[11],"visible":false}],
		// buttons: [
		// 	'copy', 'csv', 'excel', 'pdf', 'print'
		// ],
		//分页效果
		//"sPaginationType": "extStyle",
		processing: true,
		"destroy": true,
		buttons: [{
			extend: 'print',
			text: '打印',
			exportOptions: {
				columns: [1, 2, 3, 4, 5, 6, 7]
				//visible:true
				//columns:$(".odd")
			}
		}, {
			extend: 'excel',
			text: '导出表格'
		}],
		ajax: {
			url: `/customermaintain/getlistajax?validshow=${Goption.validshow}&allotshow=${Goption.allotshow}&lazyshow=${Goption.lazyshow}`,

		},
		//data: data.list,
		oLanguage: {
			"sSearch": "搜索",
			"sProcessing": "正在获取数据，请稍后...",
			"sLengthMenu": "显示 _MENU_ 条",
			"sZeroRecords": "没有内容",
			"sInfo": "从 _START_ 到  _END_ 条记录 总记录数为 _TOTAL_ 条",
			"sInfoEmpty": "记录数为0",
			"sInfoFiltered": "(全部记录数 _MAX_ 条)",
			"sInfoPostFix": "",
			"oPaginate": {
				"sFirst": "第一页",
				"sPrevious": "上一页",
				"sNext": "下一页",
				"sLast": "最后一页",

			}
		},
		columns: [{
			title: "星级",
			data: "customer_star"
		},
		{
			title: "机器型号",
			data: "machine_model"
		}, {
			title: "更换次数",
			data: "maintain_sum"
		},
		{
			title: "最近维护",
			data: "last_maintain"
		},
		{
			title: "用户姓名",
			data: "real_name"
		}, {
			title: "联系方式",
			data: "mobile_1"
		}, {
			title: "地址",
			data: "address"
		}, {
			title: "派工",
			data: "labour_name"
		}, {
			title: '操作',
			data: 'sale_id',
			render: (data, type, full) => {
				return createButton(data)
			}
		}
		]
	})
	$('.buttons-copy, .buttons-csv, .buttons-print, .buttons-pdf, .buttons-excel').addClass(
		'btn btn-cyan text-white mr-1');
	//document.getElementById("list_body").innerHTML =lists;
	//customermaintain_list_table.rows.add(data.list);


}
$(document).ready(function () {

	//这里为了前台显示方便，设置的对调了一下
	$("#validshow").bootstrapSwitch({
		onSwitchChange: function (event, data) {
			console.log('switch change' + data);
			if (data) {
				$("#validshow").removeAttr("checked");
				Goption.validshow = false;
			} else {
				$("#validshow").attr("checked", "checked");
				Goption.validshow = true;
			}
			var allotshowStatus = $('#allotshow').attr('checked');
			//Gindex_table.ajax.data = Goption;
			//console.log('重新加载url；'+`/customermaintain/getlistajax?validshow=${Goption.validshow}&allotshow=${Goption.allotshow}`)
			Gindex_table.ajax.url(`/customermaintain/getlistajax?validshow=${Goption.validshow}&allotshow=${Goption.allotshow}&lazyshow=${Goption.lazyshow}`).load();


		}
	})

	$("#allotshow").bootstrapSwitch({
		onSwitchChange: function (event, data) {
			console.log('switch change' + data);
			if (data) {
				$("#allotshow").removeAttr("checked");
				Goption.allotshow = true;
			} else {
				$("#allotshow").attr("checked", "checked");
				Goption.allotshow = false;
			}
			var allotshowStatus = $('#allotshow').attr('checked');
			//Gindex_table.ajax.data = Goption;
			//console.log('重新加载url；'+`/customermaintain/getlistajax?validshow=${Goption.validshow}&allotshow=${Goption.allotshow}`)
			Gindex_table.ajax.url(`/customermaintain/getlistajax?validshow=${Goption.validshow}&allotshow=${Goption.allotshow}&lazyshow=${Goption.lazyshow}`).load();


		}
	})
	$("#lazyshow").bootstrapSwitch({
		onSwitchChange: function (event, data) {
			console.log('switch change' + data);
			if (data) {
				$("#lazyshow").removeAttr("checked");
				Goption.lazyshow = false;
			} else {
				$("#lazyshow").attr("checked", "checked");
				Goption.lazyshow = true;
			}
			var lazyshowStatus = $('#lazyshow').attr('checked');
			//Gindex_table.ajax.data = Goption;
			//console.log('重新加载url；'+`/customermaintain/getlistajax?validshow=${Goption.validshow}&lazyshow=${Goption.allotshow}`)
			Gindex_table.ajax.url(
				`/customermaintain/getlistajax?validshow=${Goption.validshow}&allotshow=${Goption.allotshow}&lazyshow=${Goption.lazyshow}`
			).load();


		}
	})
	// var validshowStatus = $('#validshow').attr('checked');
	// console.log(validshowStatus)

	TableInit({
		validshow: true,
		allotshow: true
	});
	// $("input[name='delytime']").TouchSpin();
	// var index_list_table = $("#index_list_table")


})
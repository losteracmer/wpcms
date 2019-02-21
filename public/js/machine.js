var Gmachine_id = null;
		function getAllMachine() {
			$.ajax({
				url: '/machine/getmachinelist',
				success: function (data, textStatus) {
					if (data.code == 200) {
						var machineListStr = template('machineListTemplate', data);
						$("#machineList").html(machineListStr);
					} else {
						toastr.error(data.msg);
					}
				},
				error: function (error) {
					toastr.error('网络连接失败...');
				}
			})
		}

		function getAllFe() {
			$.ajax({
				url: '/machine/getfelist',
				success: function (data, textStatus) {
					console.log(JSON.stringify(data))
					if (data.code == 200) {
						var feStr = template('feListTemplate', data);
						$("#feList").html(feStr);
					} else {
						toastr.error(data.msg);
					}
				},
				error: function (error) {
					toastr.error('网络连接失败...');
				}
			})
		}
		function getMachineFe(machine_id){
			$.ajax({
					url: '/machine/getmachinefe',
					data: {
						machine_id: machine_id
					},
					success: function (data, textStatus) {
						if (data.code == 200) {
							var feStr = template('machineFeListTemplate', data);
							$("#machineFeList").html(feStr);

						} else if(data.code==403){
							var feStr = template('machineFeListTemplate', data);
							$("#machineFeList").html(feStr);
							toastr.warning(data.msg);
						}
					},
					error: function (error) {
						toastr.error('网络故障...')
					}
                })
                
		}
		function deleteFe(machine_id ,fe_id){
			$.ajax({
				url: 'machine/deletemachinefe',
				data: {
					machine_id,
					fe_id
				},
				success: function (data, textStatus) {
					if (data.code == 200) {
						getMachineFe(machine_id);
						toastr.success(data.msg);
					} else{
						toastr.error(data.msg);
					}
				},
				error: function (error) {
					toastr.error('网络故障...')
				},
				complete:function(){}
			})
		}
		$(document).ready(function () {
			getAllMachine();
			getAllFe();

            //获取机器滤芯
			$('#machineCardList .card-body').on('click', '.card', function () {
				var machine_id = $(this).data('machine_id');
				$(this).prevAll().removeClass('card-active');
				$(this).nextAll().removeClass('card-active');
				$(this).addClass('card-active');
				Gmachine_id = machine_id;

				getMachineFe(machine_id);
            })
            $("#machineFeList").on("click",".deleteBtn",function(){
				let _confirm = confirm("确定删除这个滤芯？");
				let fe_id = $(this).attr("data-fe_id");
				deleteFe(Gmachine_id,fe_id);
				
			})
			$("#saveAddFeBtn").on('click', function () {
				console.log('click');

				var fe_model = $("#p_fe_model").val();
				var fe_periodicity = $("#p_fe_periodicity").val();
				$.ajax({
					url: '/machine/addfe',
					data: {
						fe_model,
						fe_periodicity
					},
					success: function (data) {
						if (data.code == 200) {
							toastr.success(data.msg)
							$("#addFeModal").modal('hide');
							getAllFe();
						} else {
							toastr.error(data.msg)
						}
					},
					error: function (data) {
						toastr.error('网络异常！');
					}
				})
			})
			$("#saveAddMachineBtn").on('click', function () {
				console.log('click');

				var machine_model = $("#p_machine_model").val();
				var machine_price = $("#p_machine_price").val();
				$.ajax({
					url: '/machine/addmachine',
					data: {
						machine_model,
						machine_price
					},
					success: function (data) {
						if (data.code == 200) {
							toastr.success(data.msg)
							$("#addMachineModal").modal('hide');
							getAllMachine();
						} else {
							toastr.error(data.msg)
						}
					},
					error: function (data) {
						toastr.error('网络异常！');
					}
				})
			})
			$("#addMachineFe").on('click',function(){
				if(Gmachine_id == null){
					toastr.warning("请选点击左侧机器，再进行添加操作");
					return ;
				}
				var machine_id = Gmachine_id;
				$.ajax({
					url:'/machine/getaddfelist',
					data:{
						machine_id:machine_id
					},
					success:function(data,textStatus){
						//console.log(JSON.stringify(data));
						
						if (data.code == 200) {
							var feListStr = template('MfeListTemplate',data);
							$("#chosefeselect").html(feListStr);
							$("#addMachineFeModal").modal('show');
							
						} else {
							toastr.error(data.msg)
						}
					}
				})
			})
			$("#saveAddMachineFeBtn").on('click',function(){
				var machine_id = Gmachine_id;
				var fe_id = $("#chosefeselect").val();
				if(!fe_id){
					return;
				}
				$.ajax({
					url:"/machine/addmachinefe",
					data:{
						machine_id,
						fe_id
					},
					success:function(data){
						if(data.code == 200){
							toastr.success(data.msg);
							$("#addMachineFeModal").modal('hide');
							getMachineFe(machine_id);
						}else {
							toastr.error(data.msg);
						}
					},
					error:function(error){
						toastr.error(data.msg);
					}
				})
			})
		})
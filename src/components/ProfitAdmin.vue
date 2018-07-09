<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;text-align: left">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="客户名称"></el-input>	
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.name" placeholder="所属团队"></el-input>	
				</el-form-item>
				<el-form-item>
					<el-button-group>
						<el-button type="primary" @click="getCusts" icon="el-icon-search">查询</el-button>
						<el-button type="primary" @click="" icon="el-icon-search">查询全部</el-button>
					</el-button-group>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table 
			:data="custs" 
			stripe
			highlight-current-row 
			v-loading="listLoading" 
			@selection-change="selsChange" 
			style="width: 100%;text-align:left"
			height="530"
		>
			<el-table-column fixed type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="bankid" label="开户行号" width="150" sortable>
			</el-table-column>
			<el-table-column prop="bankname" label="开户行名称" width="150"  sortable>
			</el-table-column>
			<el-table-column prop="custid" label="客户号" width="200" sortable>
			</el-table-column>
			<el-table-column prop="custname" label="客户名称" width="200" sortable>
			</el-table-column>
			<!-- <el-table-column prop="custtype" label="客户类型" width="200" sortable>
			</el-table-column> -->
			<el-table-column prop="custnetincome" label="营业净收入(￥)" width="200" sortable>
			</el-table-column>
			<el-table-column prop="team" label="所属团队" sortable>
			</el-table-column>
			<el-table-column fixed="right" label="操作" width="120">
				<template slot-scope="scope">						
						<el-button type="primary"
							:disabled="scope.row.profitdistributed"
							size="small" 
							@click="profitAlloc(scope.$index, scope.row)"
						>制定分润方案</el-button>	
						<!-- <el-button type="success"
							v-if="scope.row.profitdistributed"
							size="small" 
							@click="profitAlloc(scope.$index, scope.row)"
						>查看分润方案</el-button>	 -->				
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar" style="text-align:left">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--分润界面-->
		<el-dialog 
				title="分润方案" 
				:visible.sync="profitSharePlanSubmitDialogVisible" 
				center
		>
			<el-col :span="24" style="text-align:left">
				<el-button type="primary" @click="handleAdd" icon="el-icon-search">选择分润人员</el-button>
			</el-col>
			<el-table
					:data="selusers" 
					stripe
					highlight-current-row 
					v-loading="listLoading"  
					style="width: 100%;text-align:left"
					height="300"
			>
				<el-table-column type="index" width="60">
				</el-table-column>
				<el-table-column prop="id" label="一事通ID" width="150">
				</el-table-column>
				<el-table-column prop="name" label="姓名" width="150">
				</el-table-column>
				<el-table-column prop="team" label="所属团队">
				</el-table-column>
				<el-table-column prop="propotion" label="分润比例(%)">
					<template slot-scope="scope">
  						<el-input-number 
  							v-model="scope.row.propotion" 
  							@change="handlePropotionChange(scope)" 
  							:min="1" 
  							:max="100"
  							:step="1" 
  							label="分润比例"
  							size="mini"
  							></el-input-number>
				    </template>
				</el-table-column>
			</el-table>
			<span slot="footer" class="dialog-footer">
				<el-alert
				    title="分润比例之和不为100%"
				    type="error"
				    :closable="false"
				    v-if="totalPropotion !== 100 && selusers.length !== 0"
				    show-icon
				    center
				    description="所有人员的分润比例之和必须为100%"
				>
				</el-alert>
				
				<el-alert
				    title="无分润人员，请选择"
				    type="error"
				    :closable="false"
				    v-if="selusers.length === 0"
				    show-icon
				    center
				    description="制定分润方案前，请先选择分润人员"
				>
				</el-alert>

				<el-button 
					type="primary" 
					@click="profitSharePlanSubmit" 
					:disabled="this.selusers.length===0||this.totalPropotion !== 100"
					:loading="profitSharePlanLoading"
				>确定分润方案</el-button>
			</span>
		</el-dialog>

		<!--选择分润人员界面-->
		<el-dialog 
				title="选择分润人员" 
				:visible.sync="addFormVisible" 
				center
		>
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px;text-align: left">
				<el-form :inline="true" :model="filters">
					<el-form-item>
						<el-input 
							v-model="filters.name" 
							placeholder="一事通ID"
							size="mini"
						></el-input>
					</el-form-item>
					<el-form-item>
						<el-input 
							v-model="filters.name" 
							placeholder="姓名"
							size="mini"
						></el-input>	
					</el-form-item>
					<el-form-item>
						<el-input 
							v-model="filters.name" 
							placeholder="所属团队"
							size="mini"
						></el-input>	
					</el-form-item>
					<el-form-item>
						<el-button-group>
							<el-button 
								type="primary" 
								@click="getUsers" 
								icon="el-icon-search"
								size="mini"
							>查询</el-button>	
						</el-button-group>
					</el-form-item>
				</el-form>
			</el-col>

			<!--人员列表-->
			<el-table 
				:data="users" 
				stripe
				highlight-current-row 
				v-loading="listLoading" 
				@selection-change="selUserchange" 
				style="width: 100%;text-align:left"
				height="300"
			>
				<el-table-column type="selection" width="55">
				</el-table-column>
				<el-table-column type="index" width="60">
				</el-table-column>
				<el-table-column prop="id" label="一事通ID" width="150" sortable>
				</el-table-column>
				<el-table-column prop="name" label="姓名" width="150"  sortable>
				</el-table-column>
				<el-table-column prop="team" label="所属团队"  sortable>
				</el-table-column>
			</el-table>

			<!--工具条-->
			<!-- <el-col :span="24" class="toolbar" style="text-align:left"> -->
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="batchSelectUser" :disabled="this.selusers.length===0">确定选择</el-button>
				<!-- <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
				</el-pagination> -->
			</span>
			<!-- </el-col> -->
		</el-dialog>

	</section>
</template>

<script>
	// import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import FileSaver from 'file-saver'
    import XLSX from 'xlsx'

	import { getUserListPage,getCustListPage, removeUser, batchRemoveUser, editCust, addUser, addProfitShareResult } from '@/api/api';

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				users: [],
				custs: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列
				selusers: [],
				currentProfitShareCust: {},  //当前分润客户
				profitSharePlanSubmitDialogVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					bankid: '',
					bankname: '',
					custid: '',
					custname: '',
					custtype: '',
					custnetincome: 0.0,
					team: ''
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {   //新增表单验证
					id: [
						{ required: true, message: '请输入一事通ID', trigger: 'blur' }
					],
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					],
					role: [
						{ required: true, message: '请选择角色', trigger: 'blur' }
					],
					team: [
						{ required: true, message: '请选择所属团队', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					bankid: '',
					bankname: '',
					custid: '',
					custname: '',
					custtype: '',
					custnetincome: 0.0,
					team: ''
				},
				//角色
				Roles: [
							{
								id: 1,
							 	value:'系统管理员'
							},
							{
								id: 2,
								value:'批发条线领导'
							},
							{
								id: 3,
								value: '团队负责人'
							},
							{
								id: 4,
								value: '客户经理'
							}
						],
				//团队
				Teams: [
							{
								id: 1,
								value:'机构客户一部'
							}, 
							{
								id: 2,
								value:'机构客户二部'
							}, 
							{
								id: 3,
								value:'机构客户三部'
							}, 
							{
								id: 4,
								value:'机构客户四部'
							}, 
							{
								id: 5,
								value:'机构客户五部'
							}, 
							{
								id: 6,
								value:'机构客户六部'
							}, 
							{
								id: 7,
								value:'机构客户七部'
							}
						],
				uploadFormVisible: false,
				totalPropotion: 0,
				profitSharePlan: [],  //分润方案
				profitSharePlanLoading: false  //确定分润方案加载标识

			}
		},
		methods: {
			//性别显示转换
			formatSex: function (row, column) {
				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getCusts();
			},
			handlePropotionChange(value){
				console.log("value:",value)
				console.log("this.selusers:",this.selusers)
				//重新计算分润比例之和
				this.totalPropotion = 0
				for(var i = 0; i<this.selusers.length; i++){
					this.totalPropotion += this.selusers[i].propotion
				}
				console.log("this.totalPropotion:",this.totalPropotion)
			},
			//获取用户列表
			getCusts() {
				let para = {
					page: this.page,
					name: this.filters.name
				};
				this.listLoading = true;
				//NProgress.start();
				getCustListPage(para).then((res) => {
					this.total = res.data.total;
					this.custs = res.data.custs;
					this.listLoading = false;
					//NProgress.done();
				});
			},
			//创建分润方案对象profitSharePlan
			profitSharePlanCreate(custmers){
				
				for(var i=0; i<custmers.length;i++){
					let subplan = {

					}
				}
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { bankid: row.bankid, custid: row.custid };
					removeUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getCusts();
					});
				}).catch(() => {

				});
			},
			//显示分润界面
			profitAlloc: function (index, row) {
				if(row.allocated){
					this.selusers = []

					this.profitSharePlanSubmitDialogVisible = true;
					//重新计算分润比例之和
					this.totalPropotion = 0
					for(var i = 0; i<this.selusers.length; i++){
						this.totalPropotion += this.selusers[i].propotion
					}
					//初始化当前操作客户
					this.currentProfitShareCust = row 
					console.log("this.currentProfitShareCust:",this.currentProfitShareCust)
				}else{
					this.$message({
			          message: '未归户，请先归户！',
			          type: 'error'
			        });
				}
			},
			//显示新增界面
			handleAdd: function () {
				this.selusers = []
				this.addFormVisible = true;
				this.addForm = {
					bankid: '',
					bankname: '',
					custid: '',
					custname: '',
					custtype: '',
					custnetincome: 0.0,
					team: ''
				};
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
							// para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							console.log("para:",para);
							editCust(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.profitSharePlanSubmitDialogVisible = false;
								this.getCusts();
							});
						});
					}
				});
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addForm);
							addUser(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getCusts();
							});
						});
					}
				});
			},
			selUserchange(sels){
				//将选择人员填入selusers对象

				this.selusers = sels
				
				console.log("this.selusers:",this.selusers)
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					batchRemoveUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getCusts();
					});
				}).catch(() => {

				});
			},
			batchSelectUser(){
				//处理选择的用户
				this.$confirm('确认选中人员吗？', '提示', {
					type: 'warning'
				}).then(() => {
						//初始化propotion值
						for(var i = 0; i<this.selusers.length; i++){
							this.selusers[i].propotion = 1;
						}

						this.$message({
							message: '选择成功',
							type: 'success'
						});
						this.addFormVisible = false;
				}).catch(() => {

				});
			},
			handleUpload(){
				this.uploadFormVisible = true;       

			},
			handleUploadData(obj){
				var files = obj.files
				var fileReader = new FileReader();
	            fileReader.onload = function(ev) {
	                try {
	                    var data = ev.target.result,
	                        workbook = XLSX.read(data, {
	                            type: 'binary'
	                        }), // 以二进制流方式读取得到整份excel表格对象
	                        persons = []; // 存储获取到的数据
	                } catch (e) {
	                    console.log('文件类型不正确');
	                    return;
	                }

	                // 表格的表格范围，可用于判断表头是否数量是否正确
	                var fromTo = '';
	                // 遍历每张表读取
	                for (var sheet in workbook.Sheets) {
	                    if (workbook.Sheets.hasOwnProperty(sheet)) {
	                        fromTo = workbook.Sheets[sheet]['!ref'];
	                        console.log(fromTo);
	                        persons = persons.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
	                        // break; // 如果只取第一张表，就取消注释这行
	                    }
	                }

	                console.log(persons);
	            };

	            // 以二进制方式打开文件
	            fileReader.readAsBinaryString(files[0]);
			},
			getUsers() {
				let para = {
					page: this.page,
					name: this.filters.name
				};
				this.listLoading = true;
				//NProgress.start();
				getUserListPage(para).then((res) => {
					this.users = res.data.users;
					this.listLoading = false;
					//NProgress.done();
				});
			},
			//确定分润方案
			profitSharePlanSubmit(){		

				//处理选择的用户
				this.$confirm('确认制定的分润方案吗？', '提示', {
					type: 'warning'
				}).then(() => {
						this.profitSharePlanLoading = true
						console.log("方案确定：","this.selusers:",this.selusers)
						//设置当前操作客户是否分润标志
						this.currentProfitShareCust.profitdistributed = true
						//设置客户列表是否分润标志
						// this.custs.some(u => {
					 //        if (u.bankid === this.currentProfitShareCust.bankid && u.custid === this.currentProfitShareCust.custid) {
					 //          u.profitdistributed = true
					 //          return true;
					 //        }
					 //    });

					    editCust(this.currentProfitShareCust).then((res) => {
								console.log("客户是否分润更新成功")
								this.getCusts();
						});
						//保存分润结果
						//分润结果对象
                        let para = {
                        	cust: this.currentProfitShareCust,
                        	plan: this.selusers
                        }

      //                   let para = []

      //                   //处理分润结果，将客户和分润人一一对应
						// for(var i=0; i<this.selusers.length; i++){
						// 	para.push({
						// 		cust: this.currentProfitShareCust,
						// 		plan: this.selusers[i]
						// 	})
						// }

                        console.log("para:",para)
						addProfitShareResult(para).then((res) => {
							this.profitSharePlanLoading = false

							this.$message({
								message: '分润方案制定成功',
								type: 'success'
							});
							this.profitSharePlanSubmitDialogVisible = false;
						});

				}).catch(() => {

				});
			}
		},
		mounted() {
			this.getCusts();
			this.getUsers();
		}
	}

</script>

<style scoped>

</style>
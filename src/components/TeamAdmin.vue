<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;text-align: left">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="所属团队"></el-input>	
				</el-form-item>
				<el-form-item>
					<el-button-group>
						<el-button type="primary" @click="getUsers" icon="el-icon-search">查询</el-button>
						<el-button type="primary" @click="" icon="el-icon-search">查询全部</el-button>
						<el-button type="primary" @click="handleAdd" icon="el-icon-plus">新增</el-button>	
					</el-button-group>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table 
			:data="users" 
			stripe
			highlight-current-row 
			v-loading="listLoading" 
			@selection-change="selsChange" 
			style="width: 100%;text-align:left"
		>
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="id" label="一事通ID" width="150" sortable>
			</el-table-column>
			<el-table-column prop="name" label="姓名" width="150"  sortable>
			</el-table-column>
			<el-table-column prop="role" label="角色" width="200" sortable>
			</el-table-column>
			<el-table-column prop="team" label="所属团队"  sortable>
			</el-table-column>
			<el-table-column label="操作" width="200">
				<template slot-scope="scope">
					<el-button-group>						
						<el-button type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
						<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
					</el-button-group>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar" style="text-align:left">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog 
				title="编辑" 
				:visible.sync="editFormVisible" 
		>
			<el-form 
					:model="editForm" 
					label-width="80px" 
					:rules="editFormRules" 
					ref="editForm"
			>
				<el-form-item label="一事通ID" prop="id">
					<el-input v-model="editForm.id" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="姓名">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="角色">
					<el-input v-model="editForm.role" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="所属团队">
					<el-input v-model="editForm.team" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog 
				title="新增" 
				:visible.sync="addFormVisible" 
		>
			<el-form 
					:model="addForm" 
					label-width="100px" 
					:rules="addFormRules" 
					ref="addForm"
					size="medium"
					label-position="right"
			>
				<el-form-item label="一事通ID" prop="id">
					<el-input v-model="addForm.id" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="姓名"  prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="角色"  prop="role" style="text-align:left">
					<el-select 
						v-model="addForm.role" 
						placeholder="请选择角色"
						clearable
						filterable
					>
						<el-option
							v-for="item in Roles"
							:key="item.id"
							:label="item.value"
							:value="item.value"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="所属团队"  prop="team" style="text-align:left">
					<!-- <el-input v-model="editForm.team" auto-complete="off"></el-input> -->
					<el-select 
						v-model="addForm.team" 
						placeholder="请选择所属团队"
						clearable
						filterable
					>
						<el-option
							v-for="item in Teams"
							:key="item.id"
							:label="item.value"
							:value="item.value"
						></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	// import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '@/api/api';

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				users: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					id: '',
					name: '',
					role: '',
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
					id: '',
					name: '',
					role: '',
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
						]

			}
		},
		methods: {
			//性别显示转换
			formatSex: function (row, column) {
				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
			//获取用户列表
			getUsers() {
				let para = {
					page: this.page,
					name: this.filters.name
				};
				this.listLoading = true;
				//NProgress.start();
				getUserListPage(para).then((res) => {
					this.total = res.data.total;
					this.users = res.data.users;
					this.listLoading = false;
					//NProgress.done();
				});
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { id: row.id };
					removeUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					id: '',
					name: '',
					role: '',
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
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							editUser(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getUsers();
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
								this.getUsers();
							});
						});
					}
				});
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
						this.getUsers();
					});
				}).catch(() => {

				});
			}
		},
		mounted() {
			this.getUsers();
		}
	}

</script>

<style scoped>

</style>
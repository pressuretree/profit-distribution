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
						<el-button type="primary" @click="handleAdd" icon="el-icon-plus">新增</el-button>
						<el-button type="primary" @click="handleUpload" icon="el-icon-upload">导入</el-button>	
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
			<el-table-column prop="custtype" label="客户类型" width="200" sortable>
			</el-table-column>
			<el-table-column prop="custnetincome" label="营业净收入(￥)" width="200" sortable>
			</el-table-column>
			<el-table-column prop="team" label="所属团队" width="200" sortable>
			</el-table-column>
			<el-table-column fixed="right" label="操作" width="200">
				<template slot-scope="scope">
					<el-button-group>						
						<el-button 
							type="primary" 
							size="small" 
							@click="handleEdit(scope.$index, scope.row)"
							v-show="!scope.row.allocated"
						>归户</el-button>
						<el-button 
							type="success" 
							size="small" 
							@click="handleEdit(scope.$index, scope.row)"
							v-show="scope.row.allocated"
						>修改</el-button>
						<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
					</el-button-group>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar" style="text-align:left">
			<el-button 
				type="danger" 
				@click="batchRemove" 
				:disabled="this.sels.length===0"
				size="small"
			>批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--归户界面-->
		<el-dialog 
				title="归户及编辑" 
				:visible.sync="editFormVisible" 
		>
			<el-form 
					:model="editForm" 
					label-width="120px" 
					:rules="editFormRules" 
					ref="editForm"
			>
				<el-form-item label="开户行号" prop="bankid">
					<el-input v-model="editForm.bankid" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="开户行名称" prop="bankname">
					<el-input v-model="editForm.bankname" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="客户号" prop="custid">
					<el-input v-model="editForm.bankid" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="客户名称" prop="custname">
					<el-input v-model="editForm.custname" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="客户类型">
					<el-input v-model="editForm.custtype" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="营业净收入(￥)">
					<el-input v-model="editForm.custnetincome" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="所属团队" style="text-align:left" prop="team">
					<el-select 
						v-model="editForm.team" 
						placeholder="请选择所属团队"
						clearable
						filterable
						@change="teamChange"
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
			<div slot="footer" class="dialog-footer" style="text-align: center">
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
			<div slot="footer" class="dialog-footer" style="text-align:center">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

		<!-- 导入数据对话框 -->
		<el-dialog 
				title="导入客户数据" 
				:visible.sync="uploadFormVisible" 
		>
			<el-upload
				  class="upload-demo"
				  ref="upload"
				  action="https://jsonplaceholder.typicode.com/posts/"
				  :on-preview="handlePreview"
				  :on-remove="handleRemove"
				  :on-change="handleUploadData"
				  :file-list="fileList"
				  :auto-upload="false">
				  <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
			  <div slot="tip" class="el-upload__tip">只能上传Excel文件</div>
			</el-upload>
			
		</el-dialog>

	</section>
</template>

<script>
	// import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import FileSaver from 'file-saver'
    import XLSX from 'xlsx'

	import { getCustListPage, removeUser, batchRemoveUser, editCust, addUser, addCusts } from '@/api/api';

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				custs: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					team: [
						{ required: true, message: '请选择所属团队', trigger: 'blur' }
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
				fileList: []

			}
		},
		methods: {
			submitUpload() {
				console.log("this.fileList:",this.fileList)
				console.log("this.$refs:",this.$refs)
		        this.$refs.upload.submit();

		    },
		    handleRemove(file, fileList) {
		        console.log("file",file,"fileList", fileList);
		    },
		    handlePreview(file) {
		        console.log("file",file);
		    },
			//性别显示转换
			formatSex: function (row, column) {
				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getCusts();
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
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
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
								this.editFormVisible = false;
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
			handleUpload(){
				this.uploadFormVisible = true;       

			},
			handleUploadData(file, fileList){
				console.log("file:",file,"fileList:",fileList)
				// var files = file
				// var fileReader = new FileReader();
	   //          fileReader.onload = function(ev) {
	   //              try {
	   //                  var data = ev.target.result,
	   //                      workbook = XLSX.read(data, {
	   //                          type: 'binary'
	   //                      }), // 以二进制流方式读取得到整份excel表格对象
	   //                      persons = []; // 存储获取到的数据
	   //              } catch (e) {
	   //                  console.log('文件类型不正确');
	   //                  return;
	   //              }

	   //              // 表格的表格范围，可用于判断表头是否数量是否正确
	   //              var fromTo = '';
	   //              // 遍历每张表读取
	   //              for (var sheet in workbook.Sheets) {
	   //                  if (workbook.Sheets.hasOwnProperty(sheet)) {
	   //                      fromTo = workbook.Sheets[sheet]['!ref'];
	   //                      console.log(fromTo);
	   //                      persons = persons.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
	   //                      // break; // 如果只取第一张表，就取消注释这行
	   //                  }
	   //              }

	   //              console.log(persons);
	            // };

	            // // 以二进制方式打开文件
	            // fileReader.readAsBinaryString(file.raw);

	            this.uploadButtonLoading = true
	            const fileReader = new FileReader(); 

	            //读数据
	            fileReader.readAsBinaryString(file.raw); 

	            //处理数据 
	            fileReader.onload = (ev) => { 
	            	try{ 
	            		const data = ev.target.result; 
	            		console.log("data:",data)
	            		const workbook = XLSX.read(data, { type: 'binary' }); 
	            		console.log("workbook:",workbook)
	            		const sheetArray = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1']);
	            		console.log("sheetArray:",sheetArray) 
	            		// for (let sheet in workbook.Sheets) { 
	            		// 	const sheetArray = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]); 
	            		// 	console.log("sheet:",sheet)
	            		// 	console.log("sheetArray:",sheetArray)
	            	 //    }

	            	    //数据转换，表头转换为英文
	            	    let para = []
	            	    for(var i=0; i<sheetArray.length; i++){
	            	        let element = 
		            	    {
								bankid: sheetArray[i]['开户行号'],
								bankname: sheetArray[i]['开户行名称'],
								custid: sheetArray[i]['客户号'],
								custname: sheetArray[i]['客户名称'],
								custtype: sheetArray[i]['客户类型'],
								custnetincome: sheetArray[i]['营业净收入'],
								team: '',
								allocated: false,
								profitdistributed: false
							}
							para.push(element)
	            	    }
	            	    
	            	    //导入数据
	            	    addCusts(para).then((resp) => {
	            	    	console.log("resp:",resp)
	            	    	this.uploadButtonLoading = false
	            	    	this.uploadFormVisible = false
	            	    	this.getCusts()
	            	    	this.$message.success('导入成功！')
	            	    });



	            	    

	            	}catch(e){ 
	            		this.uploadButtonLoading = false
	            		this.$message.warning('文件类型不正确！'); 
	            		return false; 
	            	} 
	            
		        }


			},
			teamChange(){
				this.editForm.allocated = true
			}
		},
		mounted() {
			this.getCusts();
		}
	}

</script>

<style scoped>

</style>
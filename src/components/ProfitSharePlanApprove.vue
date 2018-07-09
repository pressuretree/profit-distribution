<template>
	<div>
		<!-- 查询表单 -->
		<el-col :span="24" style="text-align:left">
			<el-form 
				:inline="true"
				:model="searchForm"
				class="demo-form-inline"
				style="margin: auto 0px;"
			>
				<el-form-item >
					<el-input 
						v-model="searchForm.custname" 
						placeholder="客户" 
						size="small"
					></el-input>
				</el-form-item>
				<el-form-item >
					<el-input 
						v-model="searchForm.team" 
						placeholder="团队" 
						size="small"
					></el-input>
				</el-form-item>
				<el-form-item >
					<el-input 
						v-model="searchForm.name" 
						placeholder="分润人员" 
						size="small"
					></el-input>
				</el-form-item>
				<el-form-item>
					<el-button-group>
						<el-button 
							type="primary" 
							@click="searchPlan" 
							size="small"
							icon="el-icon-search"
						>查询</el-button>

						<el-button
							type="primary"
							@click="downloadProfitShareResult"
							size="small"
							icon="el-icon-download"
							:disabled="!allapproved"
						>下载分润结果</el-button>
						
					</el-button-group>
				</el-form-item>
			</el-form>
		</el-col>

		<!-- 复杂表头表格方式 -->
		<!-- <el-table
			:data="profitShareResult"
			style="width:100%;text-align:left"
			:header-row-class-name="Headerstyle"
			stripe
			height="530"
		>
			<el-table-column
				prop="cust.custname"
				label="客户名称"
				width="180"
				sortable
			></el-table-column>

			<el-table-column
				prop="cust.bankname"
				label="开户行"
				width="180"
				sortable
			></el-table-column>

			<el-table-column
				prop="cust.custtype"
				label="客户类型"
				width="180"
				sortable
			></el-table-column>

			
			<el-table-column label="分润结果">				
				<el-table-column
					prop="plan.name"
					label="姓名"
				></el-table-column>

				<el-table-column
					prop="plan.team"
					label="所属团队"
				></el-table-column>

				<el-table-column
					prop="plan.propotion"
					label="分润比例(%)"
				></el-table-column>
			</el-table-column>
		</el-table> -->

		<!-- 可展开列方式 -->
		<el-table
			:data="profitShareResult"
			style="width:100%;text-align:left"
			
			stripe
			height="530"
			v-loading="profitShareResultLoading"
			@selection-change="selsChange"
		>
			<!-- <el-table-column
		      type="selection"
		      width="55">
		    </el-table-column> -->
			<el-table-column
				prop="cust.custname"
				label="客户名称"
				min-width="180"
				sortable
			></el-table-column>

			<el-table-column
				prop="cust.bankname"
				label="开户行"
				min-width="180"
				sortable
			></el-table-column>

			<el-table-column
				prop="cust.custtype"
				label="客户类型"
				min-width="180"
				sortable
			></el-table-column>

			<el-table-column
				label="状态"
				min-width="180"
				sortable
			>
				<template slot-scope="props">				
					<el-tag 
						type="success"
						v-if="props.row.approved"
					>已通过</el-tag>
					<el-tag 
						type="warning"
						v-if="!props.row.approved && !props.row.rejected"
					>待审批</el-tag>
					<el-tag 
						type="danger"
						v-if="props.row.rejected"
					>已驳回</el-tag>
				</template>
			</el-table-column>

			
			<el-table-column 
				label="分润结果" 
				type="expand"
				width="380"			
			>
				<template slot-scope="props">
					<el-table
						:data="props.row.plan"
						
					>					
						<el-table-column
							prop="name"
							label="姓名"
						></el-table-column>

						<el-table-column
							prop="team"
							label="所属团队"
						></el-table-column>

						<el-table-column
							prop="propotion"
							label="分润比例(%)"
						></el-table-column>
						<el-table-column
							label="操作"
						>
							
						</el-table-column>
					</el-table>
					<el-col :span="24" style="padding-top: 5px">
						<el-button-group>							
							<el-button 
								icon="el-icon-success" 
								type="success"
								size="small"
								:disabled="props.row.approved || props.row.rejected"
								@click="handleApprove(props)"
							>通过</el-button>
							<el-button 
								icon="el-icon-edit" 
								type="primary"
								size="small"
								@click="handleEdit(props)"
								:disabled="props.row.approved || props.row.rejected"
							>修改</el-button>
							<el-button 
								icon="el-icon-error" 
								type="danger" 
								size="small"
								:disabled="props.row.approved || props.row.rejected"
								@click="handleReject(props)" 
							>驳回</el-button>
						</el-button-group>
					</el-col>				
				</template>				
			</el-table-column>

		</el-table>

		<!--分页工具条-->
		<el-col :span="24" class="toolbar" style="text-align:left">
			<!-- <el-button-group style="padding: 2px 0px;">				
				<el-button 
					type="success" 
					@click="batchApprove" 
					:disabled="this.sels.length===0"
					size="small"
					icon="el-icon-success"
				>批量通过</el-button>
				<el-button 
					type="danger" 
					@click="batchReject" 
					:disabled="this.sels.length===0"
					size="small"
					icon="el-icon-error"
				>批量驳回</el-button>
			</el-button-group> -->
			<el-pagination 
				layout="prev, pager, next" 
				@current-change="handleCurrentChange" 
				:page-size="pageInfo.pageSize" 
				:total="pageInfo.total" 
				style="float:right; padding: 2px 0px;"
			></el-pagination>
		</el-col>

		<!-- 修改对话框 -->
		<el-dialog
			title="修改分润信息"
			:visible.sync="editDialogVisible"
			style="width:100%;text-align:left"
		>
			<el-table
				:data="tmpProfitPlan"
				height="300"
			>
				<el-table-column
					prop="name"
					label="姓名"
				></el-table-column>

				<el-table-column
					prop="team"
					label="所属团队"
				></el-table-column>

				<el-table-column
					prop="propotion"
					label="分润比例(%)"
				>
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

			<el-alert
			    title="分润比例之和不为100%"
			    type="error"
			    :closable="false"
			    v-if="totalPropotion !== 100 && tmpProfitPlan.length !== 0"
			    show-icon
			    center
			    description="所有人员的分润比例之和必须为100%"
			>
			</el-alert>

			<div slot="footer" class="dialog-footer" style="text-align:center">
				<el-button @click.native="editDialogVisible = false">取消</el-button>
				<el-button 
					type="primary" 
					@click.native="editProfitSubmit" 
					:loading="editLoading"
					icon="el-icon-success"
				>提交</el-button>
			</div>

		</el-dialog>


	</div><!-- 结束 -->
</template>

<script >
import util from '@/api/util'
import {getProfitShareResult, editProfitShareResult} from '@/api/api';

import FileSaver from 'file-saver'
import XLSX from 'xlsx'

	export default{
		data(){
			return {
				searchForm: {
					custname: '',
					team: '',
					name: ''
				},
				profitShareResult: [],
				profitShareResultHandled: [],
				pageInfo: {
					page: 1,
					pageSize: 20,
					total: 0
				},
				profitShareResultLoading: false,   	//表格加载动画
				sels: [],    						//多选中项目
				editDialogVisible: false,   		//编辑对话框控制标志      
				tmpProfitPlan: [],					//编辑框数据暂存
				editLoading: false,	
				totalPropotion: 0,
				currentRow: {},						//当前编辑的分润结果	
				// allapproved: false			
			}
		},
		methods: {
			showprops(props){
				console.log("props:",props)
			},
			searchPlan(){

			},
			getProfitShareResult(){
				//获取分润结果
				let para = {
					pageinfo: this.pageInfo,
					searchform: this.searchForm
				}

				this.profitShareResultLoading = true
				getProfitShareResult(para).then((resp) => {
					this.profitShareResultLoading = false

					this.pageInfo.total = resp.data.total
					this.profitShareResult = resp.data.profitShareResult

					console.log("this.pageInfo.total:",this.pageInfo.total)
					console.log("this.profitShareResult:",this.profitShareResult)
				});
			},
			Headerstyle({row, rowIndex}){
				return 'table-header'
			},
			handleCurrentChange(val){
				this.pageInfo.page = val
				this.getProfitShareResult()
			},
			//批量审核通过
			batchApprove(){

			},

			//批量驳回
			batchReject(){

			},
			//多选改变时触发
			selsChange: function (sels) {
				this.sels = sels;
				console.log("this.sels:",this.sels)
			},
			handleEdit(props){
				console.log("props:",props)
				this.currentRow = props.row
				this.tmpProfitPlan = props.row.plan
				this.totalPropotion = 0
				for(var i = 0; i<this.tmpProfitPlan.length; i++){
					this.totalPropotion += this.tmpProfitPlan[i].propotion
				}
				console.log("this.tmpProfitPlan:",this.tmpProfitPlan)
				this.editDialogVisible = true
			},
			handleApprove(props){
				this.currentRow = props.row
				this.tmpProfitPlan = props.row.plan
				this.$confirm('确认通过?', '分润方案审批', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {

		        	this.currentRow.plan = this.tmpProfitPlan
		        	this.currentRow.approved = true					
		          //修改通过标志位
		          	let para = {
							code: 200,
							message: '编辑成功',
							data: this.currentRow
					}
					editProfitShareResult(para).then((resp) => {
						console.log("resp:",resp)

						this.$message({
							message: '审批通过成功',
							type: 'success'
						});
						//重新加载分润结果数据
						this.getProfitShareResult()
					})
		          
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消！'
		          });          
		        });
			},
			handleReject(props){
				this.currentRow = props.row
				this.tmpProfitPlan = props.row.plan
				this.$confirm('确认驳回?', '分润方案审批', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		          	this.currentRow.plan = this.tmpProfitPlan
		        	this.currentRow.rejected = true					
		          //修改驳回标志位
		          	let para = {
							code: 200,
							message: '编辑成功',
							data: this.currentRow
					}
					editProfitShareResult(para).then((resp) => {						
						console.log("resp:",resp)

						this.$message({
							message: '审批驳回成功',
							type: 'success'
						});
						//重新加载分润结果数据
						this.getProfitShareResult()
					})
		          
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消！'
		          });          
		        });
			},
			editProfitSubmit(){
				this.editLoading = true

				console.log("this.currentRow:",this.currentRow)
				this.currentRow.plan = this.tmpProfitPlan

				let para = {
					code: 200,
					message: '编辑成功',
					data: this.currentRow
				}
				editProfitShareResult(para).then((resp) => {
					this.editLoading = false
					console.log("resp:",resp)

					this.$message({
						message: '分润方案编辑成功',
						type: 'success'
					});

					this.editDialogVisible = false
					this.getProfitShareResult()
				})
			},
			handlePropotionChange(value){
				console.log("value:",value)
				//重新计算分润比例之和
				this.totalPropotion = 0
				for(var i = 0; i<this.tmpProfitPlan.length; i++){
					this.totalPropotion += this.tmpProfitPlan[i].propotion
				}
				console.log("this.totalPropotion:",this.totalPropotion)
			},
			downloadProfitShareResult(){
				this.$confirm('确认导出分润结果吗？', '提示', {}).then(() => {

					console.log("this.profitShareResult:",this.profitShareResult)

				        //英文表头转为中文
				        //汇总数据转换
				        var tempResult = [];
						
						for(var i = 0 ; i<this.profitShareResult.length; i++){			
							for( var j=0; j<this.profitShareResult[i].plan.length; j++){

								var jsonObj = {};
								
								jsonObj['开户行号'] = this.profitShareResult[i].cust['bankid']				
								jsonObj['开户行名称'] = this.profitShareResult[i].cust['bankname']				
								jsonObj['客户号'] = this.profitShareResult[i].cust['custid']				
								jsonObj['客户名称'] = this.profitShareResult[i].cust['custname']			
								jsonObj['客户类型'] = this.profitShareResult[i].cust['custtype']	
								jsonObj['营业净收入'] = this.profitShareResult[i].cust['custnetincome']	

								jsonObj['归户团队'] = this.profitShareResult[i].cust['team']				
								jsonObj['员工号'] = this.profitShareResult[i].plan[j]['id']				
								jsonObj['员工姓名'] = this.profitShareResult[i].plan[j]['name']				
								jsonObj['分润比例'] = this.profitShareResult[i].plan[j]['propotion']			
								jsonObj['所属团队'] = this.profitShareResult[i].plan[j]['team']
							
								
								
								tempResult.push(jsonObj)
							}
						}

						console.log("tempResult:",tempResult)
						

				        var wb = {SheetNames: ['分润结果'], Sheets: {}, Props: {}};
				        wb.Sheets['分润结果'] = XLSX.utils.json_to_sheet(tempResult)
				        console.log("workbook:",wb);

				        /* get binary string as output */
				        var filename = '分润结果_' + util.formatDate.format(new Date(), 'yyyy-MM-dd') + '.xlsx';
				        var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
				        try {
				            FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), filename)
				        } catch (e) {
				        	if (typeof console !== 'undefined') 
				        		console.log(e, wbout) 
				        }
				        return wbout

				    });	
			}
		},
		mounted(){
			this.getProfitShareResult()
		},
		computed: {
			allapproved: function(){
				for(var i=0; i<this.profitShareResult.length; i++){
					let temp = this.profitShareResult[i]
					if(!(temp.approved || temp.rejected)){
						return false
					}
				}
				return true
			}
		}
	}

</script>

<style scoped>
.el-table .table-header{
	color: #409EFF
}
</style>
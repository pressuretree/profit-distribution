<template>
	<div>
		<!-- 查询表单 -->
		<el-col :span="24" style="text-align:left">
			<el-form 
				:inline="true"
				:model="searchForm"
				class="demo-form-inline"
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
					<el-button 
						type="primary" 
						@click="searchPlan" 
						size="small"
					>查询</el-button>
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
					<!-- <el-col :span="24" style="padding-top: 5px">
						<el-button-group>							
							<el-button type="success" size="small">通过</el-button>
							<el-button type="primary" size="small">修改</el-button>
						</el-button-group>
					</el-col> -->				
				</template>				
			</el-table-column>
		</el-table>

		<!--分页工具条-->
		<el-col :span="24" class="toolbar" style="text-align:left">
			<!-- <el-button 
				type="danger" 
				@click="batchRemove" 
				:disabled="this.sels.length===0"
				size="small"
			>批量删除</el-button> -->
			<el-pagination 
				layout="prev, pager, next" 
				@current-change="handleCurrentChange" 
				:page-size="pageInfo.pageSize" 
				:total="pageInfo.total" 
				style="float:right;"
			></el-pagination>
		</el-col>


	</div><!-- 结束 -->
</template>

<script >
import {getProfitShareResult} from '@/api/api';

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
				profitShareResultLoading: false
			}
		},
		methods: {
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
			}

		},
		mounted(){
			this.getProfitShareResult()
		}
	}

</script>

<style scoped>
.el-table .table-header{
	color: #409EFF
}
</style>
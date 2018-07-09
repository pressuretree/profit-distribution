<template>
	<el-container style="height: 100vh;">
		<el-header height="60px">
			<el-col :span="4" :class="collapsed?'menu-collapsed':'logo'" v-if="!collapsed">
				{{collapsed?'':sysName}}
			</el-col>
			<el-col :span="1" v-if="collapsed">
				<div class="logoimage">
					<img :src="this.sysLogo" class="img"/>
				</div>
			</el-col>
			<el-col :span="12">
				<div class="tools" @click.prevent="menuShow">
					<i class="el-icon-caret-left" v-show="!collapsed" title="收缩菜单"></i>
					<i class="el-icon-caret-right" v-show="collapsed" title="展开菜单"></i>
				</div>
			</el-col>
			<el-col :span="6" class="userinfo">
				<el-dropdown trigger="hover">
					<span class="header"><img :src="this.sysUser" class="img"/> {{sysUserName}}</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item>我的消息</el-dropdown-item>
						<el-dropdown-item>设置</el-dropdown-item>
						<el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</el-col>
		</el-header><!-- 头部结束 -->
		<el-container>				
			<el-aside :width="collapsed?'64px':'230px'">
			    <el-menu
			      :default-active="$route.path"
			      class="el-menu-vertical-demo"
			      @open="handleOpen"
			      @close="handleClose"
			      background-color="#545c64"
			      text-color="#73E7EB"
			      router
			      unique-opened
			      :collapse="collapsed"
			      active-text-color="#ffd04b"
			    >
			      <template v-for="(issue,index) in $router.options.routes">
			        <!-- <template v-if="issue.name === $store.state.leftNavState"> -->
			          <template v-for="(item,index) in issue.children">
			            <el-submenu 
			            		v-if="!item.meta.leaf" 
			            		:index="index+''" 
			            		v-show="item.menuShow">
			              <template slot="title">
			              	<i :class="item.iconCls"></i>
			              	<span slot="title">{{item.name}}</span>
			              </template>
			              <el-menu-item 
			              		v-for="term in item.children" 
			              		:key="term.path" 
			              		:index="term.path"
			              		:route="term.path" 
			              		v-if="term.menuShow"
			                    :class="$route.path==term.path?'is-active':''">
			                <i :class="term.iconCls"></i>
			                <span slot="title">{{term.name}}</span>
			              </el-menu-item>
			            </el-submenu>
			            <el-menu-item 
			            	v-else-if="item.meta.leaf" 
			            	:index="item.path"
			            	:route="item.path" 
			                :class="$route.path==item.path?'is-active':''" 
			                v-show="item.menuShow">
			              <i :class="item.iconCls "></i>
			              <span slot="title">{{item.name}}</span>
			            </el-menu-item>
			          </template>
			        <!-- </template> -->
			      </template>

			    </el-menu>
			</el-aside><!-- 左侧菜单栏结束 -->
			<el-container>			
				<el-main>
					<transition>						
						<router-view></router-view>
					</transition>
				</el-main>
			</el-container><!-- 内容区 -->
		</el-container>
		<el-footer height="60px" style="color: #CCC;">
			Copyright &copy 招商银行兰州分行信息技术部
		</el-footer>
	</el-container>
	
</template>



<script>
import admin from '@/assets/admin.png'
import logo from '@/assets/logo.png'
export default {
	data(){
		return {
			sysName: '归户分润管理系统',
			sysUserName: '张三',
			sysUser: admin,
			sysLogo: logo,
			collapsed: false
		}
	},
	methods: {
		logout(){

		},
		handleClose(){

		},
		handleOpen(){
			return {}
		},
		menuShow(){
			this.collapsed = !this.collapsed
		}

	},
	mounted(){
		console.log("路由：",this.$router.options.routes)
	}
}
	
</script>

<style scoped>
  .el-header{
    background-color: #20a0ff;
    color: #333;
    text-align: center;
    height: 60px;
    padding-left: 0px;
  }

  .el-footer {
    background-color: #20a0ff;
    color: #333;
    text-align: center;
    line-height: 60px;
    margin-bottom: 0px;
    height: 60px;
  }
  
  .el-aside {
  	width: 230px;
    background-color: #545c64;
    color: #73E7EB;
    text-align: left;
  }
  .el-menu{
  	border-right: 0px;
  }  
  
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
  }

  .el-submenu__title i{
    color: #73E7EB;
  }
  .el-menu-item i{
  	color: #73E7EB;
  }
  .el-menu-item.is-active i{
  	color: rgb(255, 208, 75);
  }
  .el-icon-edit{
  	color: #73E7EB;
  }
  
  body > .el-container {
    margin-bottom: 40px;
    padding-bottom: 0px;
    height: 100vh;
    width: 100%;
    background-color: #F81A1A;
  }

  .logo {
  	text-align: center;
  	width: 230px;
  	line-height: 60px;
  	font-size: 23px;
  	color: #FFF;
  	border-color: rgba(238,241,146,0.3);
	border-right-width: 1px;
	border-right-style: solid;
  }

  .userinfo {
		text-align: right;
		padding-right: 35px;
		float: right;		
	}
  .userinfo-inner {
		cursor: pointer;
		color:#fff;
		
	}
  .img {
		width: 54px;
		height: 54px;
		border-radius: 30px;
		margin: 3px;
		float: right;		
	}
	.logoimage{
		border-color: rgba(238,241,146,0.3);
		border-right-width: 1px;
		border-right-style: solid;
	}
	.header {
		height: 60px;
		line-height: 60px;
		background: $color-primary;
		color:#fff;
		font-size: 20px;
	}
    .tools{
    	line-height:60px;
    	float: left;
    	color:#fff;
    	font-size: 50px;
    	padding-left: 0px;
    	text-shadow: 0.01em 0em 0.3em #53B5EF;
    	background-color: #33B0FB;
    }
    .logo-width{
		width:230px;
	}
	.logo-collapse-width{
		width:60px
	}
	.menu-collapsed{
		
		width: 60px;
	}
	.menu-expanded{
		
		width: 230px;
	}
</style>
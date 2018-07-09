import Login from '@/components/Login'
import MainPage from '@/components/MainPage'
import EmpAdmin from '@/components/EmpAdmin'
import SubMenuNav from '@/components/SubMenuNav'
import CustAdmin from '@/components/CustAdmin'
import ProfitAdmin from '@/components/ProfitAdmin'
import Visualization from '@/components/Visualization'
import Help from '@/components/Help'
import RoleAdmin from '@/components/RoleAdmin'
import TeamAdmin from '@/components/TeamAdmin'
import ProfitSharePlanSearch from '@/components/ProfitSharePlanSearch'
import ProfitSharePlanApprove from '@/components/ProfitSharePlanApprove'

let routes = [
	{
        path: '/',
        component: Login,
        name: '',
        hidden: true,
        menuShow: false
    },
    {
    	path: '/main',
    	name: '主页',
    	component: MainPage,
    	children:[
    		{
    			path: '/sysmanage',
    			component: SubMenuNav,
    			name: '系统管理',
    			hidden: false,
    			meta: {
    				leaf: false
    			},
    			menuShow: true,
    			iconCls: 'el-icon-menu',
    			children:[
	    			{
	    				path: '/empadmin',
	    				component: EmpAdmin,
	    				name: '人员管理',
	    				hidden: false,
	    				meta: {},
	    				leaf: true,
	    				menuShow: true,
	    				iconCls: 'el-icon-edit'			
	    			},
	    			{
	    				path: '/roleadmin',
	    				component: RoleAdmin,
	    				name: '角色管理',
	    				hidden: false,
	    				meta: {},
	    				leaf: true,
	    				menuShow: true,
	    				iconCls: 'el-icon-edit'			
	    			},
	    			{
	    				path: '/teamadmin',
	    				component: TeamAdmin,
	    				name: '团队管理',
	    				hidden: false,
	    				meta: {},
	    				leaf: true,
	    				menuShow: true,
	    				iconCls: 'el-icon-edit'			
	    			}
    			]
    		},
    		{
    			path: '/custmanage',
    			component: SubMenuNav,
    			name: '归户管理',
    			hidden: false,
    			meta: {
    				leaf: false
    			},
    			menuShow: true,
    			iconCls: 'el-icon-menu',
    			children:[
	    			{
	    				path: '/custadmin',
	    				component: CustAdmin,
	    				name: '客户归户管理',
	    				hidden: false,
	    				meta: {},
	    				leaf: true,
	    				menuShow: true,
	    				iconCls: 'el-icon-edit'			
	    			}
    			]
    		},
    		{
    			path: '/profitmanage',
    			component: SubMenuNav,
    			name: '分润管理',
    			hidden: false,
    			meta: {
    				leaf: false
    			},
    			menuShow: true,
    			iconCls: 'el-icon-menu',
    			children:[
	    			{
	    				path: '/profitadmin',
	    				component: ProfitAdmin,
	    				name: '制定分润方案',
	    				hidden: false,
	    				meta: {},
	    				leaf: true,
	    				menuShow: true,
	    				iconCls: 'el-icon-edit'			
	    			},
                    {
                        path: '/profitsharesearch',
                        component: ProfitSharePlanSearch,
                        name: '查看分润方案',
                        hidden: false,
                        meta: {},
                        leaf: true,
                        menuShow: true,
                        iconCls: 'el-icon-edit'         
                    },
                    {
                        path: '/profitshareapprove',
                        component: ProfitSharePlanApprove,
                        name: '审批分润方案',
                        hidden: false,
                        meta: {},
                        leaf: true,
                        menuShow: true,
                        iconCls: 'el-icon-edit'         
                    }
    			]
    		},
    		{
    			path: '/visualization',
    			component: SubMenuNav,
    			name: '数据展示',
    			hidden: false,
    			meta: {
    				leaf: false
    			},
    			menuShow: true,
    			iconCls: 'el-icon-picture',
    			children:[
	    			{
	    				path: '/visualadmin',
	    				component: Visualization,
	    				name: '统计展示',
	    				hidden: false,
	    				meta: {},
	    				leaf: true,
	    				menuShow: true,
	    				iconCls: 'el-icon-edit'			
	    			}
    			]
    		},
    		{
    			path: '/help',
    			component: Help,
    			name: '帮助',
    			hidden: false,
    			meta: {
    				leaf: true
    			},
    			menuShow: true,
    			iconCls: 'el-icon-bell'
    		}
    	]
    }
];

export default routes;



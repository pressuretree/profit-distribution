import Mock from 'mockjs';
import admin from '@/assets/admin.png'

const LoginUsers = [
  {
    id: 1,
    username: 'admin',
    password: '123456',
    avatar: admin,
    name: '张某某'
  }
];
//模拟用户数据
const Users = [];

for (let i = 0; i < 100; i++) {
  Users.push(Mock.mock({
    id: Mock.Random.string('number',6,6),   //生成一事通ID
    name: Mock.Random.cname(),
    role: Mock.Random.pick(['系统管理员','批发条线领导','团队负责人','客户经理']),
    team: Mock.Random.pick([
                              '机构客户一部',
                              '机构客户二部',
                              '机构客户三部',
                              '机构客户四部',
                              '机构客户五部',
                              '机构客户六部',
                              '机构客户七部'])
  }));
}

//模拟角色数据
const Roles = [
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
              ];

//模拟团队数据
const Teams = [
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
            ];

//模拟对公客户信息
const CompCusts = []

for (let i = 0; i < 100; i++) {
  CompCusts.push(Mock.mock({
    bankid: Mock.Random.string('number',6,6),   //开户行ID
    bankname: Mock.Random.pick([                //开户行名称
                                '西站支行',
                                '七里河支行',
                                '东口支行',
                                '中央广场支行',
                                '中山路支行'
                                ]),
    custid: Mock.Random.string('number',6,6),   //客户号
    custname: Mock.Random.cname()+'股份有限公司',              //客户姓名
    custtype: Mock.Random.pick(['存量非信贷及项目类','存量信贷及项目类','新客户']),  //客户类型
    custnetincome: Mock.Random.float(10000,200000,2,2), //营业净收入
    team: '',       //所属团队
    allocated: false,   //是否归户
    profitdistributed: false    //是否分润
  }));
}

const ProfitShareResult = []


export { LoginUsers, Users ,Roles, Teams, CompCusts, ProfitShareResult};
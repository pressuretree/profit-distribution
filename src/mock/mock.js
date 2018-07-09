import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { LoginUsers, Users ,Roles, Teams, CompCusts, ProfitShareResult} from './data/data';
let _Users = Users;
let _Roles = Roles;
let _Teams = Teams;
let _Custs = CompCusts;
let _ProfitShareResult = ProfitShareResult;

export default {
  /**
   * mock bootstrap
   */
  bootstrap() {
    let mock = new MockAdapter(axios);

    // mock success request
    mock.onGet('/success').reply(200, {
      msg: 'success'
    });

    // mock error request
    mock.onGet('/error').reply(500, {
      msg: 'failure'
    });

    //登录
    mock.onPost('/login').reply(config => {
      let {username, password} = JSON.parse(config.data);
      return new Promise((resolve, reject) => {
        let user = null;
        setTimeout(() => {
          let hasUser = LoginUsers.some(u => {
            if (u.username === username && u.password === password) {
              user = JSON.parse(JSON.stringify(u));
              user.password = undefined;
              return true;
            }
          });

          if (hasUser) {
            resolve([200, { code: 200, msg: '请求成功', user }]);
          } else {
            resolve([200, { code: 500, msg: '账号或密码错误' }]);
          }
        }, 1000);
      });
    });

    //用户管理

    //获取用户列表
    mock.onGet('/user/list').reply(config => {
      let {name} = config.params;
      let mockUsers = _Users.filter(user => {
        if (name && user.name.indexOf(name) == -1) return false;
        return true;
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            users: mockUsers
          }]);
        }, 1000);
      });
    });

    //获取用户列表（分页）
    mock.onGet('/user/listpage').reply(config => {
      let {page, name} = config.params;
      let mockUsers = _Users.filter(user => {
        if (name && user.name.indexOf(name) == -1) return false;
        return true;
      });
      let total = mockUsers.length;
      mockUsers = mockUsers.filter((u, index) => index < 20 * page && index >= 20 * (page - 1));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            total: total,
            users: mockUsers
          }]);
        }, 1000);
      });
    });

    //删除用户
    mock.onGet('/user/remove').reply(config => {
      let { id } = config.params;
      _Users = _Users.filter(u => u.id !== id);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '删除成功'
          }]);
        }, 500);
      });
    });

    //批量删除用户
    mock.onGet('/user/batchremove').reply(config => {
      let { ids } = config.params;
      ids = ids.split(',');
      _Users = _Users.filter(u => !ids.includes(u.id));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '删除成功'
          }]);
        }, 500);
      });
    });

    //编辑用户
    mock.onGet('/user/edit').reply(config => {
      let { id, name, addr, age, birth, sex } = config.params;
      _Users.some(u => {
        if (u.id === id) {
          u.name = name;
          u.addr = addr;
          u.age = age;
          u.birth = birth;
          u.sex = sex;
          return true;
        }
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '编辑成功'
          }]);
        }, 500);
      });
    });

    //新增用户
    mock.onGet('/user/add').reply(config => {
      let { id, name, role, team} = config.params;
      _Users.push({
        id: id,
        name: name,
        role: role,
        team: team
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '新增成功'
          }]);
        }, 500);
      });
    });


    //角色管理
    //获取角色列表
    mock.onGet('/role/list').reply(config => {
      let {name} = config.params;
      let mockRoles = _Roles.filter(user => {
        if (name && user.name.indexOf(name) == -1) return false;
        return true;
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            users: mockRoles
          }]);
        }, 1000);
      });
    });

    //获取角色列表（分页）
    mock.onGet('/role/listpage').reply(config => {
      let {page, name} = config.params;
      let mockRoles = _Roles.filter(user => {
        if (name && user.name.indexOf(name) == -1) return false;
        return true;
      });
      let total = mockRoles.length;
      mockRoles = mockRoles.filter((u, index) => index < 20 * page && index >= 20 * (page - 1));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            total: total,
            users: mockRoles
          }]);
        }, 1000);
      });
    });

    //删除角色
    mock.onGet('/role/remove').reply(config => {
      let { id } = config.params;
      _Roles = _Roles.filter(u => u.id !== id);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '删除成功'
          }]);
        }, 500);
      });
    });

    //批量删除角色
    mock.onGet('/role/batchremove').reply(config => {
      let { ids } = config.params;
      ids = ids.split(',');
      _Roles = _Roles.filter(u => !ids.includes(u.id));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '删除成功'
          }]);
        }, 500);
      });
    });

    //编辑角色
    mock.onGet('/role/edit').reply(config => {
      let { id, name, addr, age, birth, sex } = config.params;
      _Roles.some(u => {
        if (u.id === id) {
          u.name = name;
          u.addr = addr;
          u.age = age;
          u.birth = birth;
          u.sex = sex;
          return true;
        }
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '编辑成功'
          }]);
        }, 500);
      });
    });

    //新增角色
    mock.onGet('/role/add').reply(config => {
      let { id, name, role, team} = config.params;
      _Roles.push({
        id: id,
        name: name,
        role: role,
        team: team
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '新增成功'
          }]);
        }, 500);
      });
    });


    //客户管理
    //获取角色列表（分页）
    mock.onGet('/cust/listpage').reply(config => {
      let {page, name} = config.params;
      let mockCusts = _Custs.filter(user => {
        if (name && user.name.indexOf(name) == -1) return false;
        return true;
      });
      let total = mockCusts.length;
      mockCusts = mockCusts.filter((u, index) => index < 20 * page && index >= 20 * (page - 1));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            total: total,
            custs: mockCusts
          }]);
        }, 1000);
      });
    });

    //编辑客户信息
    mock.onGet('/cust/edit').reply(config => {
      let { bankid, bankname, custid, custname, custtype, custnetincome, team , allocated, profitdistributed} = config.params;
      console.log("config.params:",config.params)
      _Custs.some(u => {
        if (u.bankid === bankid && u.custid === custid) {
          u.team = team
          u.allocated = allocated
          u.profitdistributed = profitdistributed
          return true;
        }
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '编辑成功'
          }]);
        }, 500);
      });
    });

    //删除客户
    mock.onGet('/cust/remove').reply(config => {
      let { bankid, custid } = config.params;
      _Custs = _Custs.filter(u => u.bankid !== bankid && u.custid !== custid);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '删除成功'
          }]);
        }, 500);
      });
    });

    //新增客户
    mock.onPost('/cust/add').reply(config => {
        console.log("config:",config)
        let paramtype = typeof(config.data)
        let param = JSON.parse(config.data)
        console.log("param:",param)
        if(Object.prototype.toString.call(param) === '[object Array]'){
          console.log("参数是数组")
          for(var i=0; i<param.length; i++){
            _Custs.push(
                {
                    bankid: param[i].bankid,
                    bankname: param[i].bankname,
                    custid: param[i].custid,
                    custname: param[i].custname,
                    custtype: param[i].custtype,
                    custnetincome: param[i].custnetincome,
                    team: '',
                    allocated: false,
                    profitdistributed: false
                }
            )
          }
        }
        else{
          console.log("参数是对象")
          _Custs.push(
              {
                    bankid: param.bankid,
                    bankname: param.bankname,
                    custid: param.custid,
                    custname: param.custname,
                    custtype: param.custtype,
                    custnetincome: param.custnetincome,
                    team: '',
                    allocated: false,
                    profitdistributed: false
              }
          )
        }
  
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '新增成功'
          }]);
        }, 500);
      });
    });


    //分润结果管理

    //增加分润结果
    mock.onPost('/profitshareresult/add').reply(config => {

      console.log("config.data:",JSON.parse(config.data))
      let result = JSON.parse(config.data)
      // for(var i=0; i<result.length; i++){
      //   _ProfitShareResult.push(result[i]);
      // }

      //添加审批标志位
      for(var i=0; i<result.plan.length; i++){
        result.approved = false
        result.rejected = false
      }


        _ProfitShareResult.push(result);

      console.log("_ProfitShareResult:",_ProfitShareResult)

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '新增成功'
          }]);
        }, 500);
      });
    });

    //获取分润结果信息
    mock.onGet('/profitshareresult/list').reply(config => {
      let {pageinfo, searchform} = config.params;
      console.log("pageinfo:",pageinfo,"searchform:",searchform)
      let mockProfitShareResult = _ProfitShareResult.filter(plan => {
        if (searchform.custname && plan.cust.custname.indexOf(searchform.custname) == -1) 
          return false;
        return true;
      });
      console.log("mockProfitShareResult:",mockProfitShareResult)
      let total = mockProfitShareResult.length;
      let pagesize = pageinfo.pageSize
      let page = pageinfo.page
      console.log("pagesize:",pagesize,"page:",page)
      mockProfitShareResult = mockProfitShareResult.filter((u, index) => index < pagesize * page && index >= pagesize * (page - 1));
      console.log("mockProfitShareResult:",mockProfitShareResult)
      console.log("_ProfitShareResult",_ProfitShareResult)
      
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            total: total,
            profitShareResult: mockProfitShareResult
          }]);
        }, 1000);
      });
    });

    //编辑分润结果
    mock.onPost('/profitshareresult/edit').reply(config => {
      let result = JSON.parse(config.data)
      console.log("config.data:",result)
// debugger
      console.log("修改前_ProfitShareResult:",_ProfitShareResult)
      //更新分润结果信息
      //  _ProfitShareResult.some(u => {
      //   if (u.cust.bankid === result.data.cust.bankid && u.cust.custid === result.data.cust.custid) {
      //     u = result.data          
      //     return true;
      //   }
      // });
      for(var i=0; i<_ProfitShareResult.length; i++){
        if(_ProfitShareResult[i].cust.bankid === result.data.cust.bankid &&
           _ProfitShareResult[i].cust.custid === result.data.cust.custid)
        {
            _ProfitShareResult[i] = result.data
        }
      }


      console.log("修改后_ProfitShareResult:",_ProfitShareResult)



      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '编辑成功'
          }]);
        }, 500);
      });
    });



  }
};
import axios from 'axios';

let base = '';

//人员管理

export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };

export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };

export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };

export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };

export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };

export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };


//角色管理


export const getRoleList = params => { return axios.get(`${base}/role/list`, { params: params }); };

export const getRoleListPage = params => { return axios.get(`${base}/role/listpage`, { params: params }); };

export const removeRole = params => { return axios.get(`${base}/role/remove`, { params: params }); };

export const batchRemoveRole = params => { return axios.get(`${base}/role/batchremove`, { params: params }); };

export const editRole = params => { return axios.get(`${base}/role/edit`, { params: params }); };

export const addRole = params => { return axios.get(`${base}/role/add`, { params: params }); };


//客户管理
export const getCustListPage = params => { return axios.get(`${base}/cust/listpage`, { params: params }); };

export const editCust = params => { return axios.get(`${base}/cust/edit`, { params: params }); };

export const removeCust = params => { return axios.get(`${base}/cust/remove`, { params: params }); };

export const addCusts = params => { return axios.post(`${base}/cust/add`, params); };

//分润结果管理

export const addProfitShareResult = params => { return axios.post(`${base}/profitshareresult/add`, params); };

export const getProfitShareResult = params => { return axios.get(`${base}/profitshareresult/list`, { params: params }); };

export const editProfitShareResult = params => { return axios.post(`${base}/profitshareresult/edit`, params); };
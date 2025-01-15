import request from '@/utils/request'


export const getUsersByRole = (perm) =>{
  return request({
    method:'GET',
    url:'/role/getUsersByPerm',
    params:{
      perm
    }
  })
}

export const getAllRoles = () =>{
  return request({
    method:'GET',
    url:'/role'
  })
}

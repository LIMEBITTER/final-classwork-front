import request from '@/utils/request'

export const findUserById = (id) =>{
  return request({
    method:'GET',
    url:`/user/${id}`
  })
}

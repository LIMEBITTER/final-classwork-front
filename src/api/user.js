import request from '@/utils/request'

export const findUserById = (id) =>{
  return request({
    method:'GET',
    url:`/user/${id}`
  })
}

export const findUserAndAvatar = () =>{
  return request({
    method:'GET',
    url:'/user/findUserAndAvatar'
  })
}

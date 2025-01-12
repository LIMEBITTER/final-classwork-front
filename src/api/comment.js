import request from '@/utils/request'



export const getAllComments = (orderId) =>{
  return request({
    method:'GET',
    url:`/comment/${orderId}`
  })
}

//
export const getCommentList = (orderId) =>{
  return request({
    method:'GET',
    url:`/comeback/list/${orderId}`
  })
}

export const doComment = (comebackForm) =>{
  return request({
    method:'POST',
    url:'/comeback/add',
    data:comebackForm
  })
}

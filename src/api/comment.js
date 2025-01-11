import request from '@/utils/request'

export const doComment = (commentForm) =>{
  return request({
    method:'POST',
    url:'/comment',
    data:commentForm
  })
}

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

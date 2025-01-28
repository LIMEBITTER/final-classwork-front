import request from '@/utils/request'

export const uploadImageBatch = (formData,orderId) =>{
  return request({
    url:`/file/uploadBatch/${orderId}`,
    method:'POST',
    data:formData
  })
}

export const getOrderImages = (orderId)=>{
  return request({
    url:`/file/getOrderImages/${orderId}`,
    method:'GET'
  })
}

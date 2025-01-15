import request from '@/utils/request'

export const findNoticePage = (title,pageNum,pageSize) =>{
  return request({
    method:'GET',
    url:'/notice/page',
    params:{
      title,pageNum,pageSize
    }
  })
}

export const getOneNotice = (id) =>{
  return request({
    method:'GET',
    url:`/notice/${id}`
  })
}

export const updateNotice = (id,noticeForm) =>{
  return request({
    method:'PUT',
    url:`/notice/${id}`,
    data:noticeForm
  })
}

export const saveNotice = (noticeForm) =>{
  return request({
    method:'POST',
    url:'/notice/save',
    data:noticeForm
  })
}

export const publishNotice = (id,status) =>{
  return request({
    method:'POST',
    url:'/notice/publish',
    params:{
      id,status
    }
  })
}

export const deleteOneNotice = (id) =>{
  return request({
    method:'DELETE',
    url:`/notice/${id}`
  })
}

export const deleteBatchByIds = (ids) =>{
  return request({
    method:'DELETE',
    url:`/notice/batch/${ids}`
  })
}

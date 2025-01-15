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

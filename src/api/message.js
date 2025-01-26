import request from '@/utils/request'

export const findMessageBySendAndReceive = (sendUserId,receiveUserId) =>{
  return request({
    url:'/message/findMsgByTwoPerson',
    method:'GET',
    params:{
      sendUserId,
      receiveUserId
    }
  })
}

export const searchUserForm = (loginUserId) =>{
  return request({
    url:'/message/searchUserForm',
    method:'GET',
    params:{
      loginUserId
    }
  })
}

export const sendMessageTo = (data) =>{
  return request({
    url:'/message/sendMessage',
    method:'POST',
    data:data
  })
}

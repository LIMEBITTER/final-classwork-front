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

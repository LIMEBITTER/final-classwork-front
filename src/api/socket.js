import request from '@/utils/request'

// 发送信息
export const sendMessageTo = (data) =>{
  return request({
    url:'/webSocket/sendMessageTo',
    method:'POST',
    data:data
  })
}

//获取在线人数
export const getOnLineUser = () =>{
  return request({
    url:'/webSocket/getOnLineUser',
    method:'GET'
  })
}

//发消息给所有人
export const sendMessageAll = (message) =>{
  return request({
    url:'/webSocket/sendMessageAll',
    method:'GET',
    params:{
      message
    }
  })
}



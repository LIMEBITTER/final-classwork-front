import request from '@/utils/request'

//新增工单
export const saveOrder = (submit_form) =>{
    return request({
        method:'POST',
        url:'/order/save',
        data:submit_form
    })
}

//获取随机工单id
export const getRandomOrderId = () =>{
    return request({
        method:'GET',
        url:'/order/getRandomId'
    })
}

//联合分页模糊查询 order history
export const getOrderPage = (title,pageNum,pageSize) => {
    return request({
        method:'GET',
        url:'/order/findOrderPage',
        params:{
            title,
            pageNum,
            pageSize
        }
    })
}

//通过orderId 获取当前审核工单
export const findByOrderId = (orderId)=>{
    return request({
        method:'GET',
        url:'/order/findByOrderId',
        params:{
            orderId
        }
    })
}

//审核工单
export const auditOrder = (formData) =>{
    return request({
        method:'POST',
        url:'/order/audit',
        data:formData
    })
}

export const getHistoryOrder = (orderId) =>{
    return request({
        method:'GET',
        url:'/order/getHistoryOrder',
        params:{
            orderId
        }
    })
}

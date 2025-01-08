// 引入mitt
import mitt from 'mitt'

// 调用mitt得到emitter，可以绑定、触发事件
const emitter = mitt()

// 暴露emitter
export default emitter

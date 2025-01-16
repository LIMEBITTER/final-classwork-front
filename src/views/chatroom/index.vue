<template>
  <div>
    <el-row>
      <el-col :span="8">
        <el-card style="width: 100%; min-height: 300px; color: #333">
          <div style="padding-bottom: 10px; border-bottom: 1px solid #ccc">在线用户<span style="font-size: 12px">（点击聊天气泡开始聊天）</span></div>
          <div style="padding: 10px 0" v-for="user in users" :key="user.username">
            <span>{{ user.username }}</span>
            <i @click="setChatUser(user.username)">
              <ChatDotRound style="width:20px;height:20px;margin-left: 20px; font-size: 16px; cursor: pointer"/>
            </i>
            <span style="font-size: 12px;color: limegreen; margin-left: 5px" v-if="user.username === chatUser">chatting...</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <div style="width: 800px; margin: 0 auto; background-color: white;
                    border-radius: 5px; box-shadow: 0 0 10px #ccc">
          <div style="text-align: center; line-height: 50px;">
            Web聊天室（{{ chatUser }}）
          </div>
          <div style="height: 350px; overflow:auto; border-top: 1px solid #ccc" v-html="content">

          </div>
          <div style="height: 200px">
            <textarea v-model="text" style="height: 160px; width: 100%; padding: 20px; border: none; border-top: 1px solid #ccc;
             border-bottom: 1px solid #ccc; outline: none"></textarea>
            <div style="text-align: right; padding-right: 10px">
              <el-button type="primary" size="mini" @click="send">发送</el-button>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script setup>

import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import useSystemStore from '@/stores/system'
import settings from '@/utils/settings'
import { ChatDotRound } from '@element-plus/icons-vue'

const systemStore = useSystemStore()

const user = ref({})
const users = ref([])
const chatUser = ref('')
const text = ref('')
const messages = ref([])
const content = ref('')
let socket

const send = () =>{
  if (!chatUser.value){
    ElMessage.warning('请选择聊天对象')
    return
  }
  if (!text.value){
    ElMessage.warning('请输入内容')
  }else {
    if (typeof (WebSocket) === 'undefined'){

    }else {
      let message = {from:user.value.userName,to:chatUser.value,text:text.value}
      socket.send(JSON.stringify(message))
      messages.value.push({user:user.value.userName,text:text.value})
      createContent(null,user.value.userName,text.value)
      text.value=''

    }
  }
}

const createContent = (remoteUser,nowUser,text) =>{
  let html;
  // 当前用户消息
  if (nowUser) { // nowUser 表示是否显示当前用户发送的聊天消息，绿色气泡
    html = "<div class=\"el-row\" style=\"padding: 5px 0\">\n" +
      "  <div class=\"el-col el-col-22\" style=\"text-align: right; padding-right: 10px\">\n" +
      "    <div class=\"tip left\">" + text + "</div>\n" +
      "  </div>\n" +
      "  <div class=\"el-col el-col-2\">\n" +
      "  <span class=\"el-avatar el-avatar--circle\" style=\"height: 40px; width: 40px; line-height: 40px;\">\n" +
      "    <img src=\"https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png\" style=\"object-fit: cover;\">\n" +
      "  </span>\n" +
      "  </div>\n" +
      "</div>";
  } else if (remoteUser) {   // remoteUser表示远程用户聊天消息，蓝色的气泡
    html = "<div class=\"el-row\" style=\"padding: 5px 0\">\n" +
      "  <div class=\"el-col el-col-2\" style=\"text-align: right\">\n" +
      "  <span class=\"el-avatar el-avatar--circle\" style=\"height: 40px; width: 40px; line-height: 40px;\">\n" +
      "    <img src=\"https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png\" style=\"object-fit: cover;\">\n" +
      "  </span>\n" +
      "  </div>\n" +
      "  <div class=\"el-col el-col-22\" style=\"text-align: left; padding-left: 10px\">\n" +
      "    <div class=\"tip right\">" + text + "</div>\n" +
      "  </div>\n" +
      "</div>";
  }
  console.log(html)
  content.value += html;

}

const initEnv = () =>{
  console.log('init')
  user.value = systemStore.userInfo
  let username = systemStore.userInfo.userName

  if (typeof (WebSocket) === 'undefined'){
    console.log('不支持websocket')

  }else {
    let socketUrl = settings.socket_url+username
    console.log(socketUrl)
    if (socket!=null){
      socket.close()
      socket = null
    }

    socket = new WebSocket(socketUrl)
    socket.onopen = () =>{
      console.log('websocket已打开')
    }

    socket.onmessage = (msg) =>{
      console.log('收到数据，'+msg.data)
      let data = JSON.parse(msg.data)
      if (data.users){
        users.value = data.users.filter(user=> user.userName !== username)
      }else {
        if (data.from === chatUser.value){
          messages.value.push(data)
          createContent(data.from,null,data.text)
        }
      }
    }

    socket.onclose = () =>{
      console.log('websocket已关闭')
    }
    socket.onerror = (error) =>{
      console.log('websocket发生了错误',error)
    }
  }

}

const setChatUser = (username) =>{
  console.log(33434)
  chatUser.value = username
}

initEnv()
</script>

<style lang="scss" scoped>
:deep(.tip) {
  color: white;
  text-align: center;
  border-radius: 10px;
  font-family: sans-serif;
  padding: 10px;
  width:auto;
  display:inline-block !important;
}
:deep(.tip.right) {
  background-color: deepskyblue;

}
:deep(.tip.left){
  background-color: forestgreen;
}
</style>

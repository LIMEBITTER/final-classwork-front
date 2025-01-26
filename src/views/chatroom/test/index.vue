<template>
  <div class="chat-container">
    <!-- Left side: User list -->
    <div class="left-side">
      <!-- Search input (moved outside) -->
      <div class="search-wrapper">
        <el-input v-model="searchUserName" placeholder="回车搜索用户" class="search-input" @keydown.enter="searchUserForForm"></el-input>
      </div>
      <!-- User list (with scroll) -->
      <el-scrollbar class="user-list-scroll">
        <el-row>
          <el-col :span="24"  v-for="form in messageForm" :key="form.sendUser.userId" @click="chooseUser(form.sendUser)" class="user-item"  >
            <div class="user-avatar-wrapper" v-if="messageForm.length!==0">
              <div :class="{ 'online-dot': form.isOnline }"></div>
              <!-- Element UI Badge for showing unread messages -->
              <el-badge :value="form.noReadMessageLength" class="message-badge" v-if="form.noReadMessageLength > 0">
                <img :src="form.sendUser.avatar" class="user-avatar">
              </el-badge>
              <img :src="form.sendUser.avatar" class="user-avatar" v-else>
            </div>
            <div class="user-details">
              <div class="user-name">{{ form.sendUser.userName }}</div>
              <div class="user-last-message">{{ form.lastMessage }}&nbsp;</div>
            </div>
          </el-col>
        </el-row>
      </el-scrollbar>
    </div>
    <!-- Right side: Chat box -->
    <div class="right-side">
      <!-- Chat header -->
      <div class="chat-header">
        <span v-if="currentUser">{{ currentUser.userName }}</span>
      </div>
      <!-- Chat messages -->
      <el-scrollbar class="chat-messages" ref="messageContainer">
        <div class="messageBox" v-for="message in messages" :key="message.id" :class="{ ownMessage: message.sendUser === loginUser.id.toString(), otherMessage: message.sendUser !== loginUser.id.toString() }">

          <div><img :src="message.sendUser === loginUser.id.toString() ? loginUser.avatar : currentUser.avatar" alt="" style="border: 1px solid #70c1fa;"></div>
          <div class="messageContent">{{ message.content }}</div>
          <div class="messageTime">{{ message.createTime.replace('T', ' ') }}</div>
        </div>
      </el-scrollbar>
      <div class="chat-input">
        <el-input v-model="newMessage.content" placeholder="请输入聊天内容" autosize class="message-input" @keydown.enter="sendMessage"></el-input>
        <el-button type="primary" @click="sendMessage" class="send-button">发送</el-button>
      </div>
    </div>
  </div>
</template>


<script setup>

import { nextTick, onMounted, ref } from 'vue'
import useSystemStore from '@/stores/system'
import { ElMessage } from 'element-plus'
import websocket from '@/utils/websocket'
// import { sendMessageTo } from '@/api/socket'
import { findMessageBySendAndReceive, searchUserForm } from '@/api/message'
import { sendMessageTo } from '@/api/message'

const systemStore = useSystemStore()

const currentUser = ref(null) //当前聊天的人
const loginUser = systemStore.userInfo
const messages = ref([])
const messageForm = ref([])  //所有聊天的人

const newMessage = ref({})

const searchUserName = ref('')
const messageContainer = ref(null)

const receiverMessages = ref([])
const senderMessages = ref([])


const fetchMessages = async (userId) => {

  console.log(userId)

  if (!userId){
    console.log('gjgjgjgjgg')
    await searchAllForm()
    return
  }
  const res = await findMessageBySendAndReceive(userId,loginUser.id)


  let loginId = loginUser.id.toString()

  messages.value = res.data
  console.log('eee',messages.value)
  receiverMessages.value = messages.value.filter(msg=>{
    return msg.receiveUser === loginId
  })
  senderMessages.value = messages.value.filter(msg=>{
    return msg.sendUser === loginId
  })

  //聊天记录拉至最下方
  await nextTick(() => {
    scrollToBottom()
  })
}

const sendMessage = async () =>{
  if (newMessage.value.content===undefined){
    ElMessage.warning('请输入聊天内容')
    return
  }

  if (loginUser.id === currentUser.value.id){
    ElMessage.error('不能给自己发送信息!')
    return
  }

  newMessage.value.sendUser = loginUser.id
  newMessage.value.receiveUser = currentUser.value.id
  // const res = await sendMessageTo(newMessage.value)

  console.log(newMessage.value)
  const res = await sendMessageTo(newMessage.value)

  await sendWebSocketMessage(newMessage.value)

  await chooseUser(currentUser.value)




  newMessage.value.content = ''





}

//消息过多，滚动至最新消息位置
const scrollToBottom = () => {
  messageContainer.value.scrollTop = messageContainer.value.scrollHeight
}

const checkAvatar = (avatar) => {
  if (avatar){
    return avatar
  }
  return ''
}

const chooseUser = async (user) => {
  currentUser.value = user
  await fetchMessages(user.id)  //获取当前要聊天用户的聊天记录
}

//获取所有信息
const searchAllForm = async () =>{
  // if (loginUser.id!==null){
  console.log('44444444555555')

  const res = await searchUserForm(loginUser.id)

    console.log('34344343')

    messageForm.value = res.data

  // }
}

const connectWebSocket = async (userId) =>{
  await new Promise((resolve) =>{
    websocket.Init(userId)

    // 在 WebSocket 连接成功时调用 resolve
    websocket.getWebSocket().onopen = () =>{
      console.log('WebSocket连接成功')
      resolve()
    }


  })
}

//发送消息
const sendWebSocketMessage = async (message) =>{
  await websocket.Send(message)
}

const handleMessage = async (message) => {
  const parsedMessage = JSON.parse(message)
  console.log('收到消息：',parsedMessage)
  //当前用户是否存在，
  if (currentUser.value) {
    console.log('啊收到消息了')
    await fetchMessages(currentUser.value.id)

    await searchAllForm()

  } else {
    await fetchMessages()
  }
}

onMounted(()=>{
  websocket.setMessageCallback((res)=>{
    handleMessage(res)
  })
})




connectWebSocket(loginUser.id)

searchAllForm()
</script>

<style lang="scss" scoped>
.chat-container {
  display: flex;
  height: 100vh;
  background: linear-gradient(to bottom right, #FFFFFF, #ECEFF1);
}

.left-side {
  position: relative; /* Position relative for absolute positioning */
  flex: 1;
  padding: 20px;
  border-right: 1px solid #eaeaea;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.search-input {
  position: absolute;
  top: 20px;
  left: 20px;
  width: calc(100% - 40px);
  max-width: 300px;
}

.user-list-scroll {
  top: 40px;
  height: calc(100% - 40px);
  overflow-y: auto;
}

.user-avatar-wrapper {
  position: relative;
  display: inline-block;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  border: 1px solid #74ffd2;
}

.user-name {
  font-weight: 800;
  white-space: nowrap; /* 不换行 */
  overflow: hidden; /* 溢出隐藏 */
  padding-left: 15px;
  text-overflow: ellipsis; /* 超出显示省略号 */
  text-align: left; /* 添加左对齐属性 */
}

.user-last-message {
  color: #a19f9f;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  padding-left: 15px;
  text-overflow: ellipsis;
  text-align: left; /* 添加左对齐属性 */
}

.right-side {
  flex: 3;
  display: flex;
  flex-direction: column;
}

.chat-header {
  padding: 20px;
  border-bottom: 1px solid #eaeaea;
  font-size: 1.2em;
  color: #37474F;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.chat-input {
  padding: 20px;
  display: flex;
  align-items: center;
}

.message-input {
  flex: 1;
  margin-right: 10px;
}

.send-button {
  flex-shrink: 0;
}

.user-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #f0f0f2;
}

.user-item:hover {
  background-color: #E0E0E0;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.user-details {
  flex-grow: 1; /* 填充剩余空间 */
}

.messageBox {
  display: flex;
  align-items: flex-start; /* 将头像和文本第一行对齐 */
  margin-bottom: 10px;
}

.messageBox img {
  width: 40px; /* 调整头像大小 */
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  margin-left: 10px;
}

.messageContent {
  max-width: 70%; /* 调整发送信息宽度 */
  padding: 10px;
  border-radius: 8px;
  background-color: #f0f0f0;
  text-align: left; /* 文本左对齐 */
  word-wrap: break-word; /* 当文本过长时自动换行 */
}

.messageTime {
  font-size: 12px;
  color: #999;
  margin-left: 10px;
  margin-top: 5px; /* 将发送时间与文本分隔开 */
}

.ownMessage {
  flex-direction: row-reverse;
  align-items: flex-end; /* 将发送时间放置在最下方的贴右位置 */
}

.otherMessage {
  flex-direction: row;
  align-items: flex-end; /* 将发送时间放置在最下方的贴左位置 */
}

.online-dot {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: 10px;
  height: 10px;
  background-color: #01c201;
  border-radius: 50%;
}
.message-badge .el-badge__content {
  position: absolute;
  bottom: 5px; /* Adjust to your desired position */
  left: 5px; /* Adjust to your desired position */
  background-color: #f56c6c; /* Red background for visibility */
  color: white; /* White text color */
}

</style>

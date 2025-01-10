<template>
  <div>

    <el-card>

      <!--        评论样式-->
      <div class="detail-title">评论信息</div>
      <!--        首条评论框-->
      <div class="detail-comment">
        <div style="margin-bottom: 50px">
          <el-input type="textarea" placeholder="请输入内容" v-model="content" rows="4"></el-input>
          <div style="margin-top: 10px; text-align: right">
            <el-button type="primary" @click="submitComment(0,content)">提 交</el-button>
          </div>
        </div>
        <!--          评论列表-->
        <div>
          <el-row v-for="item in comments" :key="item.id" style="margin-bottom: 10px">

            <el-col :span="3">
              <div style="display: flex;align-items: center">
                <img :src="item.avatar" style="width: 50px; height: 50px; border-radius: 50%;">
                <div style="margin-left: 10px" >{{item.userName}}</div>
              </div>
            </el-col>
            <el-col :span="21">
              <el-row>
                <el-col :span="18" style="height: 50px; line-height: 50px">{{item.content}}</el-col>
                <el-col :span="6" style="height: 50px; line-height: 50px; text-align: right">{{item.createTime}}</el-col>
              </el-row>
              <el-row :span="3" style="margin-top: 20px" v-for="child in item.children" :key="child.id">
                <el-col :span="5" style="display: flex; align-items: center;">
                  <img :src="child.avatar" style="width: 50px; height: 50px; border-radius: 50%;">
                  <div style="margin-left: 10px; flex: 1" class="overflowShow">{{child.userName}} 回复：{{item.userName}}</div>
                </el-col>
                <el-col :span="14" style="height: 50px; line-height: 50px">{{child.content}}</el-col>
                <el-col :span="5" style="height: 50px; line-height: 50px; text-align: right">{{child.createTime}}</el-col>
              </el-row>

              <el-row :span="3" style="margin-top: 20px">
                <el-col :span="15">
                  <el-input v-model="item.reply"></el-input>
                </el-col>
                <el-col :span="4" style="margin-left: 10px">
                  <el-button type="primary" @click="submitComment(item.id, item.reply)">回复</el-button>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-card>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import useSystemStore from '@/stores/system'
import { useRoute } from 'vue-router'
import { doComment, getAllComments } from '@/api/comment'
import { ElMessage } from 'element-plus'

const content = ref('')
const systemStore = useSystemStore()
const route = useRoute()
const comments = ref([])

const commentForm = ref({
  orderId:'',
  userId:systemStore.userInfo.id,
  parentId:'',
  content:'',
  userName:systemStore.userInfo.userName,
  avatar:systemStore.userInfo.avatar

})

const submitComment = async (parentId,contentValue) =>{
  commentForm.value.parentId = parentId
  commentForm.value.content = contentValue
  commentForm.value.orderId = route.query.orderId

  console.log(commentForm.value)

  const res = await doComment(commentForm.value)
  if (res.code === 200){
    ElMessage.success("评论成功")
    content.value = ''
  }


}
const loadComment = async () =>{
  const res = await getAllComments(route.query.orderId)
  console.log('获取所欲评论',res)
  comments.value = res.data
}


loadComment()
</script>

<style lang="scss" scoped>


</style>

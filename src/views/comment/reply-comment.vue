<template>
  <div>
    <el-collapse v-model="activeName" class="custom-collapse" accordion>
      <el-collapse-item :name="comment.id" :title="comment.content">
        <div class="add-reply">
          <el-input
            v-model="newReply.content"
            placeholder="回复此评论"
            class="reply-input"
            @keyup.enter="addReply(comment.id)"
          />
          <el-button type="primary" @click="addReply(comment.id,rootParentId)">提交回复</el-button>
        </div>
      </el-collapse-item>
    </el-collapse>

  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  rootParentId:{
    type:Number,
    default:null
  },
  comment:{
    type:Object,
    default:null
  }
})

const activeName = ref('1')

const newReply = ref({
  content: '',
  parentId: null, // 用于存储当前回复所针对的评论ID
  author: '匿名', // 可以在提交时从用户信息中获取
  role: '普通用户', // 可以在提交时从用户信息中获取
  date: new Date()
})
const addReply = (id,rootParentId) =>{
  console.log('当前的评论id',id,rootParentId)

}
</script>

<style lang="scss" scoped>
.add-reply, .add-comment {
  margin-top: 20px;
}

.reply-input, .comment-input {
  width: 100%;
  margin-bottom: 10px;
}
</style>

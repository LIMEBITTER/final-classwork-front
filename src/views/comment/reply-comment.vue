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
import { inject, ref } from 'vue'
import useSystemStore from '@/stores/system'
import { useRoute } from 'vue-router'
import { doComment } from '@/api/comment'
import { ElMessage } from 'element-plus'
import emitter from '@/utils/emitter'

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
const route = useRoute()

const systemStore = useSystemStore()

const activeName = ref('1')

const reload = inject('reLoadComments')


const newReply = ref({
  content: '',
  parentId: null,
  rootParentId:null,
  userId:systemStore.userInfo.id,
  userName: systemStore.userInfo.nickName,
  orderId:route.query.orderId
})
const addReply = async (id,rootParentId) =>{
  newReply.value.parentId = id
  newReply.value.rootParentId = rootParentId
  await doComment(newReply.value)

  newReply.value.content = ''

  ElMessage.success("评论成功")


  await reload()

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

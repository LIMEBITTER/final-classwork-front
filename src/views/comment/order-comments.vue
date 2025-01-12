<template>
  <div class="comment-section">
    <el-card class="comment-card">
      <div class="add-comment">
        <el-input
          v-model="newComment.content"
          placeholder="添加评论"
          class="comment-input"
          @keyup.enter="addComment"
        />
        <el-button type="primary" @click="addComment">提交评论</el-button>
      </div>
    </el-card>

    <el-card v-for="comment in comments" :key="comment.id" class="comment-card">

      <root-comments :comment="comment"/>

      <child-comments :child-comments="comment.children" :parent-comment="comment" :root-parent-id="comment.id"/>

    </el-card>


    <el-empty description="当前暂无评论" v-show="commentNum===0"/>







  </div>

</template>

<script setup>
import { ref } from 'vue'
import RootComments from '@/views/comment/root-comments.vue'
import ChildComments from '@/views/comment/child-comments.vue'
import { doComment, getCommentList } from '@/api/comment'
import { useRoute } from 'vue-router'
import useSystemStore from '@/stores/system'
import { ElMessage } from 'element-plus'
import { provide } from 'vue'


const comments = ref([])

const route = useRoute()

const systemStore = useSystemStore()

const newComment = ref({
  content: '',
  parentId: null,
  rootParentId:null,
  userId:systemStore.userInfo.id,
  userName: systemStore.userInfo.nickName,
  orderId:route.query.orderId
})

const commentNum = ref(0)

const loadComments = async () =>{
  const { data } = await getCommentList(route.query.orderId)
  comments.value = data.comebackList
  commentNum.value = data.total
}

const addComment = async () =>{
  await doComment(newComment.value)
  newComment.value.content = ''
  ElMessage.success("评论成功")

  await loadComments()
}

provide('reLoadComments',loadComments)

loadComments()
</script>

<style lang="scss" scoped>

.comment-card, .reply-card {
  margin-bottom: 20px;
}

.reply-section {
  margin-top: 20px;
  padding-left: 50px; /* 子评论缩进 */
}

:deep(.el-collapse-item__arrow){
  transform: rotate(-270deg);
}
:deep(.el-collapse-item__header.is-active .el-collapse-item__arrow) {
  transform: rotate(270deg);
}
:deep(.el-collapse-item__arrow){
  display:none;
}
</style>

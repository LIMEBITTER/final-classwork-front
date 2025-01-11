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




  </div>

</template>

<script setup>
import { ref } from 'vue'
import RootComments from '@/views/comment/root-comments.vue'
import ChildComments from '@/views/comment/child-comments.vue'

const comments = ref([
  // 我重新给你一个数据，其中parentId是父评论对应的id，而rootParentId则是根评论的id（即我嵌套了多层children，但是他最顶层的评论id就是rootParentId），我感觉这样就不需要前端再处理了，可以还是像先前一样递归组件，请你改进
  {
    id: 1,
    avatar: '', // 可以是URL或者null以使用默认头像
    author: '用户A',
    role: '管理员',
    date: new Date(),
    content: '用户A评论',
    parentId:null,
    rootParentId:null,
    children: [
      {
        id: 2,
        avatar: '',
        author: '用户B',
        role: '普通用户',
        date: new Date(),
        content: '用户B回复',
        replyToAuthor: '用户A',
        parentId:1,
        rootParentId:1,
        children:[
          {
            id: 3,
            avatar: '',
            author: '用户C',
            role: '普通用户',
            date: new Date(),
            content: '这是一个用户c回复',
            replyToAuthor: '用户B',
            parentId:2,
            rootParentId:1,
            children:[]
          },
        ]
      },
      {
        id: 4,
        avatar: '',
        author: '用户D',
        role: '普通用户',
        date: new Date(),
        content: '这是一个评论',
        replyToAuthor: '用户A',
        parentId:null,
        rootParentId:null,
        children:[]

      }
    ]
  },
  {
    id: 5,
    avatar: '',
    author: '用户E',
    role: '管理员',
    date: new Date(),
    content: '这是一个评论',
    replyToAuthor: '用户A',
    parentId:1,
    rootParentId:1,
    // children:[
    //   {
    //     id: 6,
    //     avatar: '',
    //     author: '用户F',
    //     role: '普通用户',
    //     date: new Date(),
    //     content: '这是一个回复',
    //     replyToAuthor: '用户E',
    //     parentId:5,
    //     rootParentId:5,
    //     children:[]
    //
    //   }
    // ]
  }


])

const newComment = ref({
  content: '',
  author: '匿名', // 可以在提交时从用户信息中获取
  role: '普通用户', // 可以在提交时从用户信息中获取
  date: new Date()
})

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

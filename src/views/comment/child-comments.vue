<template>

    <div v-for="childComment in childComments" class="comment-card" :key="childComment.id">

      <el-card class="comment-card">
        <div class="reply-header">
          <el-avatar :src="childComment.avatar" class="avatar"></el-avatar>
          <div class="reply-meta">
                <span class="username">
                  {{ childComment.userName }}
<!--                  <el-tag type="success">{{ roleName }}</el-tag>-->
                  <span v-for="roleName in childComment.role">
                    <el-tag type="success">{{ roleName }}</el-tag>
                  </span>

                </span>
            <span class="reply-to">回复 {{ parentComment.userName }}</span>
            <span class="date">{{ childComment.createTime }}</span>

          </div>

        </div>

        <div class="reply-content">
          <reply-comment :comment="childComment" :root-parent-id="rootParentId"/>
        </div>
      </el-card>

      <child-comments :child-comments="childComment.children" :parent-comment="childComment" :root-parent-id="rootParentId"/>

    </div>

</template>

<script setup>
import { ref } from 'vue'
import ReplyComment from '@/views/comment/reply-comment.vue'

defineProps({
  childComments:{
    type:Array,
    default:null
  },
  parentComment:{
    type:Object,
    default:null,
  },
  rootParentId:{
    type:Number,
    default:null
  }
})

</script>

<style lang="scss" scoped>

.comment-card, .reply-card {
  margin-bottom: 20px;
}

.avatar {
  margin-right: 10px;
  width: 40px;
  height: 40px;
}

.comment-header, .reply-header {
  display: flex;
  align-items: center;
}

.comment-meta, .reply-meta {
  display: flex;
  flex-direction: column;
}

.username {
  font-weight: bold;
}

.date {
  font-size: 0.9em;
  color: #999;
}

.reply-to {
  margin-top: 2px;
  font-size: 0.9em;
  color: #666;
}

.comment-content, .reply-content {
  margin-top: 10px;
}

</style>

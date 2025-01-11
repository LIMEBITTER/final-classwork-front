<template>
  <div>
      <div class="comment-header">
        <el-avatar :src="comment.avatar" class="avatar"></el-avatar>
        <div class="comment-meta">
          <span class="username">{{ comment.author }}
           <el-tag type="success" v-if="comment.role">{{ comment.role }}</el-tag>

          </span>
          <span class="date">{{ comment.date }}</span>
        </div>
      </div>
      <div class="comment-content">
        <reply-comment :root-parent-id="comment.id" :comment="comment"/>

      </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ReplyComment from '@/views/comment/reply-comment.vue'

defineProps({
  comment:{
    type:Object,
    default:null
  }

})


</script>

<style lang="scss" scoped>

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

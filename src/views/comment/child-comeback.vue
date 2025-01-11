<template>
  <div>
    <div class="comment-line-box" v-for="childComment in childComments">
      <div class="comment-list-item">
        <el-avatar icon="el-icon-user-solid" :size="35" style="width: 38px;"></el-avatar>
        <div class="right-box">
          <div class="new-info-box clearfix">
            <div class="comment-top">
              <div class="user-box">
                <span class="comment-name">{{ childComment.userName }}</span>
                <el-tag size="mini" type="danger" v-show="childComment.userName === blog.authorName" style="margin-left: 5px;">作者</el-tag>
                <span class="text">回复</span>
                <span class="nick-name">{{ parentComment.userName }}</span>
                <span class="date">{{ childComment.createTime }}</span>
                <div class="opt-comment">
                  <i class="el-icon-delete"></i>
                  <span style="margin-left: 3px;" @click="deleteComment(childComment)">删除</span>
                  <i class="el-icon-chat-round" style="margin-left: 10px;"></i>
                  <span style="margin-left: 3px;" @click="showReplay = !showReplay">回复</span>
                </div>
              </div>
            </div>
            <div class="comment-center">
              <div class="new-comment">{{ childComment.content }}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 回复框 -->
      <reply :rootParentId="rootParentId" :comment="childComment" :showReplay="showReplay" :blogId="blogId" :getCommentList="getCommentList" style="margin-top: 5px;"></reply>
      <!-- 嵌套递归 -->
      <ChildComeback :childComments="childComment.child" :parentComment="childComment" :blog="blog" :rootParentId="rootParentId" :getCommentList="getCommentList"></ChildComeback>
    </div>

  </div>
</template>

<script setup>


import Reply from '@/views/comment/reply.vue'
</script>

<style lang="scss" scoped>
.comment-line-box {
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  flex-direction: column;
  position: relative;
  margin-top: 8px;
}
.comment-line-box .comment-list-item {
  display: flex;
  width: 100%;
}
.comment-line-box .right-box {
  padding-top: 5px;
  padding-bottom: 5px;
  width: 100%;
  margin-left: 8px;
}
.comment-line-box .right-box .new-info-box {
  width: 100%;
}
.comment-line-box .right-box .new-info-box .comment-top {
  display: flex;
  -webkit-box-pack: end;
  justify-content: flex-end;
  margin-bottom: 4px;
  line-height: 20px;
  font-size: 14px;
}
.comment-line-box .right-box .new-info-box .user-box {
  -webkit-box-flex: 1;
  flex: 1;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  position: relative;
  right: 0;
  top: 0;
  padding-right: 8px;
}
.comment-name {
  display: flex;
  -webkit-box-align: center;
  align-items: center;
}
.date {
  font-size: 14px;
  color: #777888;
  margin-left: 5px;
}
.opt-comment {
  line-height: 20px;
  height: 20px;
  // display: none;
  position: absolute;
  right: 0;
  top: 0;
  padding-left: 16px;
  background: #fff;
}
.opt-comment:hover {
  cursor: pointer;
}
.new-comment {
  font-size: 14px;
  color: #222226;
  line-height: 22px;
  word-break: break-word;
}
.replay-box {
  padding-left: 32px;
}
.comment-top .text {
  color: #999aaa;
  margin: 0 6px;
  min-width: 28px;
}
.comment-top .nick-name {
  color: #777888;
  max-width: 105px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

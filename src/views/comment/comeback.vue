<template>
  <div>
    <!-- 显示评论 -->
    <div class="comment-list-container">

      <div class="comment-list-box comment-operate-item">
        <ul class="comment-list" v-for="comment in commentList">
          <!-- 评论根目录 -->
          <root :comment="comment" :blog="blog" :getCommentList="getCommentList"></root>
          <!-- 评论子目录 -->
          <li class="replay-box" style="display: block;">
            <ul class="comment-list">
              <!-- 子组件递归实现 -->
              <child-comeback :childComments="comment.child" :parentComment="comment" :blog="blog" :rootParentId="comment.id" :getCommentList="getCommentList" v-if="comment.child != null"></child-comeback>
            </ul>
          </li>
        </ul>
      </div>
    </div>


  </div>
</template>

<script setup>

import ChildComeback from '@/views/comment/child-comeback.vue'
import Root from '@/views/comment/root.vue'
</script>

<style lang="scss" scoped>
.comment-box.comment-box-new2.login-comment-box-new {
  padding: 16px 24px;
}
.comment-box.comment-box-new2 {
  margin-bottom: 8px;
  border-radius: 2px;
  background-color: #fff;
  width: 100%;
  height: max-content;
}
.comment-box.comment-box-new2.login-comment-box-new .has-comment .has-comment-tit {
  height: 32px;
  font-size: 18px;
  font-weight: 600;
  color: #222226;
  line-height: 32px;
}
.comment-box.comment-box-new2.login-comment-box-new .has-comment .has-comment-tit .count {
  font-size: 14px;
  color: #555666;
  line-height: 20px;
  margin-left: 12px;
  cursor: pointer;
}
.comment-box.comment-box-new2.login-comment-box-new .has-comment .has-comment-tit .text {
  font-size: 14px;
  color: #555666;
  line-height: 20px;
  margin-left: 4px;
  cursor: pointer;
}
.has-comment-tit .has-comment-bt-right {
  float: right;
  width: 82px;
  height: 32px;
  border-radius: 16px;
  text-align: center;
  padding-top: 5px;
  padding-bottom: 5px;
  font-size: 14px;
  color: #fff;
}
.has-comment .has-comment-con {
  color: #222226;
}
.hot-comment-box {
  display: flex;
  -webkit-box-pack: start;
  justify-content: flex-start;
  -webkit-box-align: start;
  align-items: flex-start;
  padding-top: 8px;
}
.hot-comment-box .hot-comment-con {
  width: 100%;
  margin-left: 8px;
  font-size: 14px;
  color: #222226;
  line-height: 22px;
  word-break: break-word;
  padding-top: 4px;
}
.hot-comment-box .hot-comment-user {
  margin-left: 8px;
  margin-right: 8px;
  font-size: 14px;
  color: #222226;
  line-height: 22px;
  padding-top: 3px;
}
.comment-box.comment-box.comment-box-new2 .comment-edit-box {
  -webkit-box-pack: justify;
  justify-content: space-between;
}
.comment-box.comment-box.comment-box-new2 .user-img {
  margin-right: 8px;
  padding-top: 5px;
}
.comment-box.comment-box-new2 .comment-form {
  width: 100%;
  position: relative;
  background: rgba(245, 246, 247, 0.8);
  border-radius: 8px;
  padding: 14px 0;
}
.d-flex {
  display: flex !important;
}
.comment-box.comment-box-new2 .comment-content {
  display: block;
  width: 100%;
  background: rgba(248, 249, 251, 0.8);
  border: none;
  padding: 0 16px;
  border-radius: 4px;
  resize: none;
  height: 88px;
  font-size: 14px;
  line-height: 22px;
  box-sizing: border-box;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  overflow: auto;
  outline: none;
}
.comment-box.comment-box-new2 .comment-operate-box {
  display: flex;
  -webkit-box-pack: justify;
  justify-content: space-between;
  padding: 8px 16px 0 16px;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  transition: display .3s ease-in-out;
}
.comment-box.comment-box-new2 .comment-operate-l, .comment-box.comment-box-new2 .comment-operate-r {
  display: flex;
  -webkit-box-align: center;
  align-items: center;
}
.comment-box.comment-box-new2 .comment-operate-l .tip {
  font-size: 12px;
  color: #999aaa;
  line-height: 17px;
}
.comment-box.comment-box-new2 .tip em {
  color: #222226;
  margin: 0 4px;
  font-style: normal;
}
.comment-box.comment-box-new2 .comment-list-container {
  padding-top: 12px;
}
.comment-box.comment-box-new2 .comment-list .comment-line-box, .comment-list .comment-line-box {
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  flex-direction: column;
  position: relative;
  margin-top: 8px;
}
.comment-box.comment-box-new2 .comment-list .comment-line-box .comment-list-item, .comment-list .comment-line-box .comment-list-item {
  display: flex;
  width: 100%;
}
.comment-box.comment-box-new2 .comment-list .comment-line-box .right-box {
  padding-top: 5px;
  padding-bottom: 5px;
  width: 100%;
  margin-left: 8px;
}
.comment-box.comment-box-new2 .comment-list .comment-line-box .right-box .new-info-box {
  width: 100%;
}
.comment-box.comment-box-new2 .comment-list .comment-line-box .right-box .new-info-box .comment-top {
  display: flex;
  -webkit-box-pack: end;
  justify-content: flex-end;
  margin-bottom: 4px;
  line-height: 20px;
  font-size: 14px;
}
.comment-box.comment-box-new2 .comment-list .comment-line-box .right-box .new-info-box .user-box {
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
.comment-box.comment-box-new2 .comment-name {
  display: flex;
  -webkit-box-align: center;
  align-items: center;
}
.comment-box.comment-box-new2 .date {
  font-size: 14px;
  color: #777888;
  margin-left: 5px;
}
.comment-box.comment-box-new2 .opt-comment {
  line-height: 20px;
  height: 20px;
  // display: none;
  position: absolute;
  right: 0;
  top: 0;
  padding-left: 16px;
  background: #fff;
}
.comment-box.comment-box-new2 .opt-comment:hover {
  cursor: pointer;
}
.comment-box.comment-box-new2 .new-comment {
  font-size: 14px;
  color: #222226;
  line-height: 22px;
  word-break: break-word;
}
.comment-box.comment-box-new2 .replay-box {
  padding-left: 32px;
}
.comment-box.comment-box-new2 .comment-top .text {
  color: #999aaa;
  margin: 0 6px;
  min-width: 28px;
}
.comment-box.comment-box-new2 .comment-top .nick-name {
  color: #777888;
  margin-right: 10px;
  max-width: 105px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.comment-box.comment-box-new2 .comment-list .comment-line-box .comment-edit-box {
  padding-left: 40px;
  margin-bottom: 16px;
  margin-top: -8px;
}
.comment-box.comment-box-new2 .comment-edit-box form {
  width: 100%;
  position: relative;
  background: rgba(245, 246, 247, 0.8);
  border-radius: 8px;
  padding: 14px 0;
}
</style>

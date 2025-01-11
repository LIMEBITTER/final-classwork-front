<template>
  <div>
    <el-collapse-transition>
      <div v-show="showReplay">
        <div class="comment-edit-box d-flex">
          <form>
            <textarea class="comment-content" v-model="commentContent" placeholder="回复: " maxLength="1000" @keyup="countNum()"></textarea>
            <div class="comment-operate-box">
              <div class="comment-operate-l">
						<span class="tip">
							还能输入
							<em>{{ countWordNum }}</em>
							个字符
						</span>
              </div>
              <div class="comment-operate-r">
                <el-button type="danger" size="mini" style="border-radius: 20px;" @click="addComment()">评论</el-button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </el-collapse-transition>

  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.comment-edit-box {
  -webkit-box-pack: justify;
  justify-content: space-between;
}
.d-flex {
  display: flex !important;
}
.comment-operate-box {
  display: flex;
  -webkit-box-pack: justify;
  justify-content: space-between;
  padding: 8px 16px 0 16px;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  transition: display .3s ease-in-out;
}
.comment-operate-l, .comment-operate-r {
  display: flex;
  -webkit-box-align: center;
  align-items: center;
}
.comment-operate-l .tip {
  font-size: 12px;
  color: #999aaa;
  line-height: 17px;
}
.tip em {
  color: #222226;
  margin: 0 4px;
  font-style: normal;
}
.comment-edit-box {
  padding-left: 40px;
  margin-bottom: 16px;
  margin-top: -8px;
}
.comment-edit-box form {
  width: 100%;
  position: relative;
  background: rgba(245, 246, 247, 0.8);
  border-radius: 8px;
  padding: 14px 0;
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
</style>

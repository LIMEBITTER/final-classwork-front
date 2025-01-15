<template>
  <div>
    <el-dialog
      :model-value="dialogTableVisible"
      title="详细信息"
      :before-close="handleClose"


    >
      <el-descriptions :column="1">
        <el-descriptions-item label="标题：">
          {{noticeTable.title}}
        </el-descriptions-item>
        <el-descriptions-item label="发布状态：">
          <el-tag v-if="noticeTable.publishStatus == 0" type="info">未发布</el-tag>
          <el-tag v-else-if="noticeTable.publishStatus == 1" type="success">已发布</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="发布人：">
          {{noticeTable.publisherName}}
        </el-descriptions-item>

        <el-descriptions-item label="创建时间：">
          {{noticeTable.createTime}}
        </el-descriptions-item>
        <el-descriptions-item label="更新时间：">
          {{noticeTable.updateTime}}
        </el-descriptions-item>
        <el-descriptions-item label="公告内容：">
          <div v-html="noticeTable.content"/>
        </el-descriptions-item>

      </el-descriptions>


    </el-dialog>

  </div>
</template>

<script setup name="NoticeDetail">

import { getOneNotice } from '@/api/notice'
import { reactive, ref } from 'vue'

const props = defineProps(['dialogTableVisible'])
// 子组件向父组件传递数据
const emit = defineEmits(['changeTableDialog'])
const noticeTable = reactive({})

const getNoticeTable = async (id) =>{
  const {data} = await getOneNotice(id)
  Object.assign(noticeTable,data)

}

const handleClose = () => {
  emit('changeTableDialog', false)
}

defineExpose({
  getNoticeTable
})

</script>

<style lang="scss" scoped>

</style>

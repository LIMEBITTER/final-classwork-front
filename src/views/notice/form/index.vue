<template>
  <div>
    <el-dialog
      :modelValue="dialogVisible"
      :before-close="handleClose"
      title="Tips" width="30%"
      draggable
    >

      <el-form
        :model="noticeForm"
        :rules="rules"
        ref="ruleFormRef"
      >
        <el-form-item label="通知标题" prop="title">
          <el-input v-model="noticeForm.title" />
        </el-form-item>
        <el-form-item label="通知内容" prop="content">
          <el-input v-model="noticeForm.content" type="textarea" />
        </el-form-item>

        <el-form-item label="通知等级" prop="publish_status">
          <el-select
            v-model="value"
            class="m-2"
            placeholder="Select"
            size="large"
            style="width: 240px"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="目标类型" prop="target_type">
          <el-radio-group v-model="noticeForm.resource">
            <el-radio label="Sponsor" />
            <el-radio label="Venue" />
          </el-radio-group>
        </el-form-item>



      </el-form>

      <template #footer>
      <span class="dialog-footer">
      <span class="dialog-footer">
        <el-button @click="handleResetForm(ruleFormRef)">取消</el-button>
        <el-button type="primary" @click="handleSubmitForm(ruleFormRef)"> 提交 </el-button>
      </span>
      </span>
      </template>
    </el-dialog>

  </div>
</template>

<script setup name="NoticeForm">
import { getOneNotice, saveNotice, updateNotice } from '@/api/notice'
import { reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const noticeForm = reactive({})

const props = defineProps(['dialogVisible'])
// 子组件向父组件传递数据
const emit = defineEmits(['changeDialog'])
const ruleFormRef = ref()


// 表单规则
const rules = reactive({
  title: [{ required: true, message: '必选项不能为空', trigger: 'blur' }],
  content: [{ required: true, message: '必选项不能为空', trigger: 'blur' }],
  // publish_status: [{ required: true, message: '必选项不能为空', trigger: 'change' }],
  // target_type: [{ required: true, message: '必选项不能为空', trigger: 'change' }],

})

// 关闭弹框提示
const handleClose = (done) => {
  ElMessageBox.confirm('确定关闭窗口?')
    .then(() => {
      handleResetForm(ruleFormRef.value)
    })
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}

const getNoticeForm = async (id) =>{
  const {data} = await getOneNotice(id)
  Object.assign(noticeForm,data)

}


// 取消弹框
const handleResetForm = (formEl) => {
  if (!formEl) return
  formEl.resetFields()
  formEl.id = undefined
  emit('changeDialog', false)
}

const handleSubmitForm = async (formEl) =>{
  if (!formEl) return

  await formEl.validate(async (valid,fields) =>{
    if (valid){

      console.log(noticeForm)
      //不为空，更新操作
      // if (noticeForm.id!=null){
      //   await updateNotice(noticeForm.id, noticeForm)
      // }else {
      //   await saveNotice(noticeForm)
      // }

      ElMessage({
        showClose: true,
        message: '操作成功',
        type: 'success'
      })
      // window.location.reload()


    }else {
      ElMessage.error(`提交失败：${JSON.stringify(fields)}`)
    }
  })
}


defineExpose({
  getNoticeForm
})
</script>

<style lang="scss" scoped>

</style>

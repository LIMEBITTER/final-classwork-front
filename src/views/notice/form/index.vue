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

        <el-form-item label="通知等级" prop="level">
          <el-select
            v-model="noticeForm.level"
            placeholder="选择通知等级"
            size="large"
            style="width: 240px"
          >
            <el-option label="低" :value="1"/>
            <el-option label="中" :value="2"/>
            <el-option label="高" :value="3"/>

          </el-select>
        </el-form-item>
        <el-form-item label="目标类型" prop="target_type">
          <el-radio-group v-model="selectedTargetType">
            <el-radio label="全体" :value="0" />
            <el-radio label="指定" :value="1"/>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="指定角色" prop="target_type" v-show="selectedTargetType===1">
          <el-select
            v-model="noticeForm.targetRoleIds"
            placeholder="选择指定角色"
            size="large"
            style="width: 240px"
            multiple
          >
            <el-option
              v-for="item in rolesData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />

          </el-select>
        </el-form-item>



      </el-form>

      <template #footer>
      <span class="dialog-footer">
      <span class="dialog-footer">
        <el-button @click="handleResetForm(ruleFormRef)" >取消</el-button>
        <el-button type="primary" @click="handleSubmitForm(ruleFormRef)"> 提交 </el-button>
      </span>
      </span>
      </template>
    </el-dialog>

  </div>
</template>

<script setup name="NoticeForm">
import { getOneNotice, saveNotice, updateNotice } from '@/api/notice'
import { reactive, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import useSystemStore from '@/stores/system'
import { getAllRoles } from '@/api/role'

const systemStore = useSystemStore()

const noticeForm = reactive({
  publishStatus:0,
  publisherName:systemStore.userInfo.userName
})

const props = defineProps(['dialogVisible'])
// 子组件向父组件传递数据
const emit = defineEmits(['changeDialog'])
const ruleFormRef = ref()

const roles = ref([])
const selectedTargetType = ref(0)
const rolesData = ref([])

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
      noticeForm.targetType = selectedTargetType

      console.log(noticeForm)
      //不为空，更新操作
      if (noticeForm.id!=null){
        console.log('更新')
        await updateNotice(noticeForm.id, noticeForm)
      }else {
        console.log('保存吗')
        await saveNotice(noticeForm)
      }

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

//监听
watch(selectedTargetType,async (value)=>{
  if (value===1){
    const {data} = await getAllRoles()
    console.log(data)

    rolesData.value = data

  }else {
    rolesData.value = []
  }
})


defineExpose({
  getNoticeForm
})
</script>

<style lang="scss" scoped>

</style>

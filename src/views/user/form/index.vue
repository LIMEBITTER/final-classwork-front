<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { nextTick, reactive, ref } from 'vue'
import request from '@/utils/request'
import { CircleCloseFilled } from '@element-plus/icons-vue'
import useSystemStore from '@/stores/system'
import router from '@/router'

const systemStore = useSystemStore()
const $route = router
// 组件传值
const props = defineProps(['dialogVisible', 'id'])
// 子组件向父组件传递数据
const emit = defineEmits(['changeDialog'])
// 表单数据
const form = reactive({
  status: 1,
  avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
  roleIds: [],
  password: '123456'
})
// 定义树形组件ref标识
const treeRef = ref()
// 定义树形组件结构数据
const defaultProps = {
  children: 'children',
  label: 'name'
}
// 定义树形组件数据
const treeData = ref([])
// 表单样式
const formSize = ref('default')
// 表单ref标识数据
const ruleFormRef = ref()
// 是否展开
const isExpandAll = ref(false)
// 刷新trees
const refreshTree = ref(true)
const isCheckStrictly = ref(false)
// 是否全选
const isCheckAllKeys = ref(false)
// 表单规则
const rules = reactive({
  userName: [{ required: true, message: '必选项不能为空', trigger: 'blur' }],
  nickName: [{ required: true, message: '必选项不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '必选项不能为空', trigger: 'change' }],
  avatar: [{ required: true, message: '必选项不能为空', trigger: 'change' }]
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
// 提交表单
const handleSumbmitForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      form.roleIds = getCheckedKeys().length > 0 ? getCheckedKeys() : [6]

      await request({
        method: form.id ? 'put' : 'post',
        url: form.id ? `/user/${form.id}` : '/user',
        data: form
      })
      ElMessage({
        showClose: true,
        message: '操作成功',
        type: 'success'
      })
      handleResetForm(formEl)
    } else {
      console.log('error submit!', fields)
    }
  })
}

// 取消弹框
const handleResetForm = (formEl) => {
  if (!formEl) return
  formEl.resetFields()
  resetChecked()
  isCheckAllKeys.value = false
  isExpandAll.value = false
  form.id = undefined
  form.roleIds = []
  emit('changeDialog', false)
}
// 初始化数据
const handleGetForm = async (id) => {
  const res = await request.get(`/user/${id}`)
  await handleGetTrees()
  Object.assign(form, res.data)
  await handleSetCheckKeys()
}
/**
 * 添加选中
 * @returns {Promise<void>}
 */
const handleSetCheckKeys = async () => {
  isCheckStrictly.value = true
  nextTick(() => {
    setCheckedKeys(form.roleIds)
    isCheckStrictly.value = false
  })
}
// 权限树形组件数据的获取
const handleGetTrees = async () => {
  const res = await request.get('/role')
  treeData.value = res.data
}
handleGetTrees()
// 获取树形ids
const getCheckedKeys = () => {
  return treeRef.value.getCheckedKeys(false).concat(treeRef.value.getHalfCheckedKeys(true))
}
// 基于node进行设置添加选中
const setCheckedNodes = async () => {
  treeRef.value.setCheckedNodes(treeData.value, false)
}
//设置树形ids
const setCheckedKeys = (ids) => {
  treeRef.value.setCheckedKeys(ids, false)
}
/**
 * 重置选中
 */
const resetChecked = () => {
  treeRef.value.setCheckedKeys([], false)
}
// 展开折叠处理方案
const handleDefaultExpandAll = async () => {
  form.roleIds = getCheckedKeys()
  refreshTree.value = false
  isCheckStrictly.value = true
  nextTick(async () => {
    refreshTree.value = true
    await handleSetCheckKeys()
  })
}
// 确定全选/不全选
const handleCheckedTreesAll = () => {
  if (isCheckAllKeys.value) {
    setCheckedKeys(treeData.value.map((row) => row.id))
  } else {
    resetChecked()
  }
}

// 暴露方法
defineExpose({
  handleGetForm,
  handleGetTrees
})
</script>
<script>
export default {
  name: 'UserForm'
}
</script>
<template>
  <el-dialog
    :modelValue="dialogVisible"
    width="30%"
    :show-close="false"
    :before-close="handleClose"
  >
    <template #header="{ close, titleId, titleClass }">
      <div class="my-header">
        <h4 :id="titleId" :class="titleClass">编辑数据</h4>
        <el-button type="danger" plain size="small" :icon="CircleCloseFilled" @click="handleClose">
          关闭弹框
        </el-button>
      </div>
    </template>
    <el-form
      ref="ruleFormRef"
      :model="form"
      :rules="rules"
      label-width="120px"
      class="ruleForm"
      :size="formSize"
      statuss-icon
    >
      <el-form-item label="用户昵称" prop="nickName">
        <el-input v-model="form.nickName" />
      </el-form-item>
      <el-form-item label="账户名" prop="userName">
        <el-input v-model="form.userName" />
        <el-alert title="默认密码为12345" type="success" :closable="false" />
      </el-form-item>
      <el-form-item label="角色信息">
        <div>
          <el-checkbox
            v-model="isExpandAll"
            @change="handleDefaultExpandAll"
            label="折叠/展开"
            size="default"
          />
          <el-checkbox
            v-model="isCheckAllKeys"
            @change="handleCheckedTreesAll"
            label="全选/全不选"
            size="default"
          />
        </div>

        <div style="border: 1px #d4d7de solid; width: 100%; border-radius: 4px">
          <el-tree
            ref="treeRef"
            :data="treeData"
            v-if="refreshTree"
            :default-expand-all="isExpandAll"
            show-checkbox
            node-key="id"
            highlight-current
            :check-strictly="isCheckStrictly"
            :props="defaultProps"
          />
          <el-alert title="默认角色为普通用户" type="success" :closable="false" />
        </div>
      </el-form-item>

      <el-form-item label="当前状态" prop="status">
        <el-switch
          v-model="form.status"
          :active-value="1"
          :inactive-value="0"
          inline-prompt
          active-text="正常"
          inactive-text="禁用"
          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleResetForm(ruleFormRef)">取消</el-button>
        <el-button type="primary" @click="handleSumbmitForm(ruleFormRef)"> 提交 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.my-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>

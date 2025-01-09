<template>
  <div>

    <el-dialog v-model="dialogFormVisible" title="选择转单角色" width="500">
      <el-form :model="allocForm">
        <el-select
          v-model="allocForm.allocUserId"
          placeholder="分配维修人员"
          size="large"
          style="width: 240px"
        >
          <el-option
            v-for="item in filteredOptions"
            :key="item.id"
            :label="item.nickName"
            :value="item.id"
            :disabled="item.disabled"
          >
          </el-option>
        </el-select>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="onSubmit">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script setup>


import { computed, ref } from 'vue'
import useSystemStore from '@/stores/system'
import { allocServiceman } from '@/api/business'
import { ElMessage } from 'element-plus'

const dialogFormVisible = ref(false)
const usersData = ref([])
const allocForm = ref({
  allocUserId:null,
  orderId:'',
  operatorName:'',
  allocUserName:''
})

const systemStore = useSystemStore()
const disabledId = ref([])

const initAndShow = (servicemen,orderId) =>{
  usersData.value = servicemen
  allocForm.value.orderId = orderId
  allocForm.value.operatorName = systemStore.userInfo.nickName
  disabledId.value = systemStore.userInfo.id

  dialogFormVisible.value = true

}

const filteredOptions = computed(() => {
  return usersData.value.map(item =>{
    if (item.id === disabledId.value){
      return {...item,disabled:true}
    }
    return item
  })
})

const onSubmit = async () =>{
  allocForm.value.allocUserName = usersData.value.find(user=>user.id === allocForm.value.allocUserId).nickName

  await allocServiceman(allocForm.value)
  ElMessage.success("转交成功")

  setTimeout(()=>{
    window.location.reload()

  },1000)

}


defineExpose({
  initAndShow
})

</script>

<style lang="scss" scoped>

</style>

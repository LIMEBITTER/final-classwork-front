<template>
  <div>
    <div class="submit-header">
      <el-card class="box-card">
        <el-steps :active="active" finish-status="success">
          <el-step title="提交工单" />
          <el-step title="物业审核"/>
          <el-step title="分配维修员"/>
          <el-step title="维修上门" :description="currentNickName===''?'当前还未分配人员':'工单派发给：'+currentNickName"/>
          <el-step title="结束工单"/>
        </el-steps>
      </el-card>
    </div>

    <div class="submit-main">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>工单基本信息</span>
          </div>
        </template>
        <el-form>
          <el-row>
            <el-col :span="12">
              <el-form-item label="标题：">
                {{tableData.title}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="工单ID：">
                {{tableData.orderId}}
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="创建时间：">
                {{tableData.createTime}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="优先级：">
                <el-tag v-if="tableData.priority===1" type="success">正常</el-tag>
                <el-tag v-else-if="tableData.priority===2" type="warning">紧急</el-tag>
                <el-tag v-else type="danger">非常紧急</el-tag>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>


      </el-card>

      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>
              {{active===1?"审核工单":"分配维修人员"}}
            </span>
          </div>
        </template>

        <el-row>
          <el-col>
            <el-form-item label="问题描述：">
              {{tableData.complaint}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="图片：">
            </el-form-item>
          </el-col>
        </el-row>
        <template #footer>
          <div v-if="active===1">
            <el-form v-permission="'biz:detail:audit'" :model="auditData">
              <el-input
                v-model="auditData.remark"
                :rows="2"
                type="textarea"
                placeholder="请输入处理意见"
              />
              <div class="buttons">
                <el-button type="primary" @click="nextStep">同意</el-button>

                <el-button type="info">拒绝</el-button>
              </div>
            </el-form>
          </div>


          <div v-if="active===2">
            <el-form v-permission="'biz:detail:alloc'"
                     :model="allocForm"
                     style="display: flex;align-items: center;justify-content: center">
              <el-select

                v-model="allocForm.allocUserId"
                placeholder="分配维修人员"
                size="large"
                style="width: 240px"
              >
                <el-option
                  v-for="item in usersData"
                  :key="item.id"
                  :label="item.nickName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
              <el-button type="primary" @click="handleAlloc()" style="margin-left: 20px">分配</el-button>
            </el-form>
          </div>


          <div v-permission="'biz:detail:acc-rej-order'" v-if="active===3&&isShow===true" style="display: flex;justify-content: center;margin-top: 15px">
            <el-button type="primary" @click="confirmOrder(tableData.orderId)">接受</el-button>
            <el-button type="info" @click="digAllocOrder.initAndShow(usersData,tableData.orderId)" >转单</el-button>
          </div>

          <div v-permission="'biz:detail:orderEnding'" v-if="active===4&&isShow===true" style="display: flex;justify-content: center;margin-top: 15px">
            <el-button type="primary" @click="endOrder(tableData.orderId)">结束工单</el-button>
          </div>

        </template>
      </el-card>



      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>操作历史</span>
          </div>
        </template>

        <el-table :data="historyData" border style="width: 100%">
          <el-table-column prop="currentNode" label="节点名称"  />
          <el-table-column prop="circulation" label="流转" >
            <template v-slot="{row}">
              <el-tag v-if="row.circulation===1" type="success">同意</el-tag>
              <el-tag v-else-if="row.circulation===2" type="warning">转交</el-tag>
              <el-tag v-else-if="row.circulation===3" >结束工单</el-tag>
              <el-tag v-else type="danger">拒绝</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="operatorName" label="处理人"  />
          <el-table-column prop="createTime" label="处理时间"  />
          <el-table-column prop="remark" label="备注" />
        </el-table>


        <dig-alloc-order ref="digAllocOrder"/>





      </el-card>

<!--      <test-commenet/>-->
      <order-comments/>




    </div>

  </div>
</template>

<script setup>

import { ref, watch } from 'vue'
import {useRoute} from 'vue-router'
import {
  allocServiceman,
  auditOrder,
  findAllocUser,
  findByOrderId,
  getHistoryOrder,
  updateOrderState
} from '@/api/business'
import useSystemStore from '@/stores/system'
import { getUsersByRole } from '@/api/role'
import { findUserById } from '@/api/user'
import DigAllocOrder from '@/views/order/detail/form/DigAllocOrder.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

import OrderComments from '@/views/comment/order-comments.vue'

const digAllocOrder = ref()
const historyData = ref([])
const systemStore = useSystemStore()
const active = ref(1)
const tableData = ref({})
const allocForm = ref({
  allocUserId:null,
  orderId:'',
  operatorName:'',
  allocUserName:'',
})
const usersData = ref([])
const perm = ref('serviceman')
const currentNickName = ref('')
const auditData = ref({
  orderId:'',
  operatorName:'',
  state:2,
  remark:''
})
const isShow = ref(false)


//todo 步骤条控制
const nextStep = async () => {
  auditData.value.orderId = tableData.value.orderId
  auditData.value.operatorName = systemStore.userInfo.userName

  await auditOrder(auditData.value)

  ElMessage.success("审核成功")

  setTimeout(()=>{
    window.location.reload()
  },500)


}

const orderId = ref('')


const route = useRoute()

//根据工单id获取单个工单
const getOneOrder = async () =>{
  orderId.value = route.query.orderId
  //获取单个工单
  const { data } = await findByOrderId(orderId.value)
  tableData.value = data
  active.value = data.state

  //获取当前工单操作历史
  const res = await getHistoryOrder(orderId.value)
  historyData.value = res.data
}



const load = async () =>{
  const ress = await getUsersByRole(perm.value)
  usersData.value = ress.data

  if (active.value===3||active.value===4){
    let loginUserId = systemStore.userInfo.id
    const { data } = await findAllocUser(tableData.value.orderId)
    console.log(data)
    if (data!=null){
      const res = await findUserById(data.allocUserId)
      currentNickName.value = res.data.nickName
      if (loginUserId === res.data.id){
        isShow.value = true
      }

    }
  }

}


//实时监听步骤条
watch(active,async (value)=>{
  console.log('当前active',value)
  if (value===2||value===3||value===4){
    await load()
  }
})


//todo 执行分配维修人员操作
const handleAlloc = async () =>{
  allocForm.value.orderId = tableData.value.orderId
  allocForm.value.operatorName = systemStore.userInfo.userName
  allocForm.value.allocUserName = usersData.value.find(user=>user.id === allocForm.value.allocUserId).nickName
  await allocServiceman(allocForm.value)

  ElMessage.success("分配成功")

  setTimeout(()=>{
    window.location.reload()

  },1000)
}

//确认接单
const confirmOrder = async (orderId) =>{

  await ElMessageBox.confirm(
    '确定接下当前工单?',
    '注意',{
      confirmButtonText:'确定',
      cancelButtonClass:'取消',
      type:'warning'
    }).catch(()=>{
    ElMessage.info('取消接单')
    return new Promise(()=>{})
  })

  await updateOrderState(orderId,4,systemStore.userInfo.nickName)

  ElMessage.success("接单成功")
  setTimeout(()=>{
    window.location.reload()

  },500)

}

const endOrder = async (orderId) =>{
  console.log('eeee',orderId)

  await updateOrderState(orderId,5,systemStore.userInfo.nickName)

  ElMessage.success("结束工单")
  setTimeout(()=>{
    window.location.reload()
  },500)


}

getOneOrder()

load()

</script>

<style lang="scss" scoped>
.submit-main{
  margin-top: 10px;
}
.box-card{
  margin-bottom: 10px;
}
.buttons{
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}



</style>

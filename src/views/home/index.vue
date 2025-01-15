<script setup>
import { reactive, ref } from 'vue'
import useSystemStore from '@/stores/system'
import { findOrderByUserId } from '@/api/business'
import router from '@/router'
import { findNoticeByRole } from '@/api/notice'
import NoticeDetail from '@/views/notice/detail/index.vue'
// 系统参数
const systemInformation = reactive({})

const systemStore = useSystemStore()

const orderData = ref([])

const noticeData = ref([])

const dialogTableVisible = ref(false)

const childTable = ref(null)


const handleChangeTableDialog = async (value) => {
  dialogTableVisible.value = value
}

const noticeInfo = async (id) =>{
  dialogTableVisible.value = true
  await childTable.value.getNoticeTable(id)
}

const findOrders = async () =>{
  const {data} = await findOrderByUserId(systemStore.userInfo.id)
  orderData.value = data
}

findOrders()

const handleInfo = (orderId) =>{
  router.push({ name:"biz:detail",query:{orderId}})
}

const getNotices = async () =>{

  const {data} = await findNoticeByRole(systemStore.userInfo.roleIds)
  noticeData.value = data

}
getNotices()

</script>

<template>

  <NoticeDetail
    :dialogTableVisible="dialogTableVisible"
    @changeTableDialog="handleChangeTableDialog"
    ref="childTable"
  />


  <el-card>
    晚上好，xxxxx
  </el-card>

  <el-row>
    <el-col :span="12">
      <el-card class="announcement-card">
        <template #header>
          <div class="card-header">
            <span>工单详情</span>
          </div>
        </template>

        <el-table :data="orderData" style="width: 100%">
          <el-table-column prop="orderId" label="工单ID" width="180" />
          <el-table-column prop="priority" label="优先级" width="180">
            <template #default="scope">
              <el-tag class="ml-2" type="success" v-if="scope.row.priority === 1">正常</el-tag>
              <el-tag class="ml-2" type="warning" v-if="scope.row.priority === 2">紧急</el-tag>
              <el-tag class="ml-2" type="danger" v-if="scope.row.priority === 3">非常紧急</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="state" label="状态">
            <template #default="scope">
              <el-tag class="ml-2"  v-if="scope.row.state === 1">审核中</el-tag>
              <el-tag class="ml-2" type="success" v-if="scope.row.state === 2">待分配</el-tag>
              <el-tag class="ml-2" type="warning" v-if="scope.row.state === 3">待上门</el-tag>
              <el-tag class="ml-2" type="danger" v-if="scope.row.state === 4">维修中</el-tag>
              <el-tag class="ml-2" type="info" v-if="scope.row.state === 5">已结束</el-tag>
            </template>
          </el-table-column>

          <el-table-column>
            <template #default="scope">
              <el-icon class="view-icon" @click="handleInfo(scope.row.orderId)">
                <View />
              </el-icon>
            </template>

          </el-table-column>
        </el-table>

      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card class="announcement-card">
        <template #header>
          <div class="card-header">
            <span>公告列表</span>
          </div>
        </template>
        <el-table :data="noticeData" style="width: 100%">
          <el-table-column prop="title" label="标题" width="180" />
          <el-table-column prop="publisherName" label="发布者" width="180" />
          <el-table-column prop="level" label="通知等级">
            <template #default="scope">
              <el-tag class="ml-2" type="success" v-if="scope.row.level === 1">低</el-tag>
              <el-tag class="ml-2" type="warning" v-if="scope.row.level === 2">中</el-tag>
              <el-tag class="ml-2" type="danger" v-if="scope.row.level === 3">高</el-tag>
            </template>
          </el-table-column>
          <el-table-column>
            <template #default="scope">
              <el-icon class="view-icon" @click="noticeInfo(scope.row.id)">
                <View />
              </el-icon>
            </template>

          </el-table-column>
        </el-table>
      </el-card>
    </el-col>
  </el-row>



</template>

<style scoped lang="scss">
h1 {
  color: #333;
  font-size: 24px;
  padding: 5px;
}
.statistic {
  text-align: center;
}


.announcement-card {
  margin-top: 20px;
  width: 600px;

}

</style>

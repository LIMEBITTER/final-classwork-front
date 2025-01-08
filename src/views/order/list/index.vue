<template>
  <div>

    <el-card class="box-card">
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="title" placeholder="点击输入角色名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="load(1)">查询</el-button>
          <el-button type="warning" :icon="Refresh" @click="title=''">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>




    <el-card class="box-card">
      <el-button class="add-order" type="primary"  @click="load">新增工单</el-button>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="orderId" label="工单ID" />
        <el-table-column prop="currentNode" label="当前节点" />
        <el-table-column prop="operatorName" label="当前处理人" />
        <el-table-column prop="priority" label="优先级">
          <template v-slot="{row}">
            <el-tag v-if="row.priority===1" type="success">正常</el-tag>
            <el-tag v-else-if="row.priority===2" type="warning">紧急</el-tag>
            <el-tag v-else type="danger">非常紧急</el-tag>
          </template>


        </el-table-column>

        <el-table-column prop="state" label="状态">
          <template v-slot="{row}">
            <el-tag v-if="row.state===1" type="success">进行中</el-tag>
            <el-tag v-else-if="row.state===2">已结束</el-tag>
            <el-tag v-else type="warning">手动结束</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="creatorName" label="创建人" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="updateTime" label="更新时间" />
        <el-table-column label="操作" v-slot="{row}">
          <el-dropdown>
            <span class="el-dropdown-link">
              更多操作
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="checkOrder(row.orderId)">查看</el-dropdown-item>
                <el-dropdown-item command="v"></el-dropdown-item>
                <el-dropdown-item command="c">Action 3</el-dropdown-item>

              </el-dropdown-menu>
            </template>
          </el-dropdown>

        </el-table-column>


      </el-table>

      <el-pagination
          v-model:current-page="pageNum.value"
          v-model:page-size="pageSize.value"
          :page-sizes="[5, 10, 20, 30]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="(size)=>{load(1,size)}"
          @current-change="(current)=>{load(current,1)}"
      />
    </el-card>


  </div>
</template>

<script setup>

import {Refresh, Search} from "@element-plus/icons-vue";
import {getOrderPage} from "@/api/business";
import {ref} from "vue";
import router from '@/router'

const title = ref('')

const pageNum = ref(1)
const pageSize = ref(5)
const total = ref(0)
const tableData = ref([])

const load = async (pageNum,pageSize) =>{
  const res = await getOrderPage(title.value,pageNum,pageSize)
  tableData.value = res.data.records
  total.value =  res.data.total
}

const checkOrder = (orderId) =>{
  router.push({ name:"biz:detail",query:{orderId}})
}

load()
</script>

<style lang="scss" scoped>
.box-card{
  margin-bottom: 10px;
}
.add-order{
  margin-bottom: 10px;
}
.el-pagination{
  margin-top: 10px;
}
</style>

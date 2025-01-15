<template>
  <!--  编辑弹框-->
  <NoticeForm
    :dialogVisible="dialogVisible"
    @changeDialog="handleChangeDialog"
    ref="childComp"
  ></NoticeForm>

  <NoticeDetail
    :dialogTableVisible="dialogTableVisible"
    @changeTableDialog="handleChangeTableDialog"
    ref="childTable"
  >

  </NoticeDetail>


  <el-row>
    <!--  分页查询表单按钮-->
    <el-col>
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="title" placeholder="输入标题名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="load">查询</el-button>
          <el-button type="warning" :icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!-- 批量按钮 -->
    <el-col style="margin-bottom: 10px; display: flex; gap: 10px">
      <div v-permission="'sys:role:add'">
        <el-button type="primary" :icon="Plus" @click="handleAdd" size="small" plain
        >新增
        </el-button>
      </div>
      <div v-permission="'sys:role:batch:delete'">
        <el-popconfirm
          confirm-button-text="确定"
          cancel-button-text="取消"
          :icon="InfoFilled"
          icon-color="#626AEF"
          title="确认要批量删除吗？"
          @confirm="handleBatchDel"
          @cancel="load"
        >
          <template #reference>
            <el-button type="danger" :disabled="disabled" :icon="Delete" size="small" plain
            >批量删除
            </el-button>
          </template>
        </el-popconfirm>
      </div>


    </el-col>
    <!--  分页页面-->
    <el-col>
      <el-table
        :data="tableData"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" />
        <el-table-column type="index" sortable label="编号" width="60px"/>
        <el-table-column prop="title" label="通知标题"  width="300px" />
        <el-table-column prop="publisherName" label="发布人" width="200px"/>
        <el-table-column prop="level" label="通知等级" width="100px">
          <template #default="{row}">
            <el-tag class="ml-2" type="success" v-if="row.level === 1">低</el-tag>
            <el-tag class="ml-2" type="warning" v-if="row.level === 2">中</el-tag>
            <el-tag class="ml-2" type="danger" v-if="row.level === 3">高</el-tag>

          </template>
        </el-table-column>
        <el-table-column prop="targetType" label="目标类型" width="100px">
          <template #default="{row}">
            <el-tag class="ml-2" type="success" v-if="row.targetType === 0">全体</el-tag>
            <el-tag class="ml-2" type="warning" v-if="row.targetType === 1">指定</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="publishStatus" label="发布状态" width="100px" >
          <template #default="{row}">
            <el-tag class="ml-2" type="info" v-if="row.publishStatus === 0">待发布</el-tag>
            <el-tag class="ml-2" type="success" v-if="row.publishStatus === 1">已发布</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作时间">
          <template #default="{row}">
            <div>创建时间：{{row.createTime}}</div>
            <div>修改时间：{{row.updateTime}}</div>

          </template>
        </el-table-column>
        <el-table-column label="操作" >
          <template #default="scope">
            <div style="display: flex; gap: 10px">
              <div v-permission="'sys:role:update'" v-show="scope.row.publishStatus===0">
                <el-button
                  type="primary"
                  :icon="Edit"
                  size="small"
                  @click="handleUpdate(scope.row.id)"
                >修改
                </el-button>
              </div>
              <div v-permission="'sys:role:update'" v-show="scope.row.publishStatus===0">
                <el-button
                  type="primary"
                  :icon="Edit"
                  size="small"
                  @click="handlePublish(scope.row.id,1)"
                >发布
                </el-button>
              </div>
              <div v-permission="'sys:role:update'" v-show="scope.row.publishStatus===1">
                <el-button
                  type="primary"
                  :icon="Edit"
                  size="small"
                  @click="handleCheckDetail(scope.row.id)"
                >查看
                </el-button>
              </div>
              <div v-permission="'sys:role:update'" v-show="scope.row.publishStatus===1">
                <el-button
                  type="primary"
                  :icon="Edit"
                  size="small"
                  @click="handlePublish(scope.row.id,0)"
                >撤回
                </el-button>
              </div>

            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          :current-page="pageNum"
          :page-size="pageSize"
          :page-sizes="[5, 10, 20, 30]"
          small="small"
          layout="total, sizes, prev, pager, next, jumper"
          :total="Number(total)"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-col>
  </el-row>
</template>

<script setup>

import { Delete, Edit, InfoFilled, Plus, Refresh, Search } from '@element-plus/icons-vue'
import NoticeForm from '@/views/notice/form/index.vue'
import NoticeDetail from '@/views/notice/detail/index.vue'
import { ref } from 'vue'
import { deleteBatchByIds, deleteOneNotice, findNoticePage, publishNotice } from '@/api/notice'
import { ElMessage } from 'element-plus'

const title = ref('')
// 当前页数
const pageNum = ref(1)
// 每页展示量
const pageSize = ref(10)
// 分页数据总数
const total = ref(0)
// 批量选择的数组
const multipleSelection = ref([])
// 是否禁用按钮
const disabled = ref(true)

const tableData = ref([])
// 是否展示弹框
const dialogVisible = ref(false)
const dialogTableVisible = ref(false)
// 获取子组件对象
const childComp = ref(null)
const childTable = ref(null)

// 修改每页展示的数据量
const handleSizeChange = (size) => {
  pageSize.value = size
  load()
}
// 翻页方法
const handleCurrentChange = (current) => {
  pageNum.value = current
  load()
}

// 清空查询数据重置
const handleReset = () => {
  title.value = ''
  load()
}

const handleAdd = async () => {
  dialogVisible.value = true
  await childComp.value.loadRoles()
}
//子组件传值给父组件,更改显示状态
const handleChangeDialog = async (value) => {
  dialogVisible.value = value
  await load()
}
const handleChangeTableDialog = async (value) => {
  dialogTableVisible.value = value
  await load()
}
// 多选按钮处理
const handleSelectionChange = (val) => {
  multipleSelection.value = val
  disabled.value = val.length === 0
}

// 修改
const handleUpdate = async (id) => {
  dialogVisible.value = true
  await childComp.value.getNoticeForm(id)
  await load()
}


const handleCheckDetail = async (id) =>{
  dialogTableVisible.value = true
  await childTable.value.getNoticeTable(id)
  await load()
}


const handlePublish = async (id,status) =>{
  await publishNotice(id,status)
  ElMessage.success(status===1?'发布成功':'撤回成功')
  await load()
}


// 批量删除
const handleBatchDel = async () => {
  const ids = []
  multipleSelection.value.forEach((row) => {
    ids.push(row.id)
  })
  await deleteBatchByIds(ids)
  ElMessage.success('批量删除成功')

  await load()
}


const load = async () =>{

  const {data} = await findNoticePage(title.value,pageNum.value,pageSize.value)

  pageNum.value = data.current
  pageSize.value = data.size
  total.value = data.total
  tableData.value = data.records

}

load()

</script>

<style lang="scss" scoped>

</style>

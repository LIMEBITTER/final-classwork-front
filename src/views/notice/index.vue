<template>
  <!--  编辑弹框-->
  <NoticeForm
    :dialogVisible="dialogVisible"
    @changeDialog="handleChangeDialog"
    ref="childComp"
  ></NoticeForm>

  <el-row>
    <!--  分页查询表单按钮-->
    <el-col>
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="title" placeholder="点击输入角色名称"></el-input>
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
        style="width: 100%"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" sortable label="编号" align="center" />
        <el-table-column prop="name" label="通知标题" align="center" />
        <el-table-column prop="description" label="发布人" align="center" />
        <el-table-column prop="perms" label="通知等级" align="center" />
        <el-table-column prop="perms" label="通知目标类型" align="center" />
        <el-table-column prop="status" label="发布状态" align="center"/>
        <el-table-column prop="createTime" label="操作时间" align="center" />
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <div style="display: flex; gap: 10px">
              <div v-permission="'sys:role:update'">
                <el-button
                  type="primary"
                  :icon="Edit"
                  size="small"
                  @click="handleUpdate(scope.row.id)"
                >编辑
                </el-button>
              </div>
              <div v-permission="'sys:role:delete'">
                <el-popconfirm
                  confirm-button-text="确定"
                  cancel-button-text="取消"
                  :icon="InfoFilled"
                  icon-color="#626AEF"
                  title="确认要删除吗？"
                  @confirm="handleDel(scope.row.id)"
                  @cancel="load"
                >
                  <template #reference>
                    <el-button type="danger" :icon="Delete" size="small">删除</el-button>
                  </template>
                </el-popconfirm>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          :current-page="pageNum"
          :page-size="pageSize"
          :page-sizes="[10, 20, 30, 50, 100, 500, 1000]"
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
import { ref } from 'vue'
import { findNoticePage } from '@/api/notice'

const title = ref('')
// 当前页数
const pageNum = ref(1)
// 每页展示量
const pageSize = ref(10)
// 分页数据总数
const total = ref(0)

const tableData = ref([])
// 是否展示弹框
const dialogVisible = ref(false)
// 获取子组件对象
const childComp = ref(null)

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
}
//子组件传值给父组件,更改显示状态
const handleChangeDialog = (value) => {
  dialogVisible.value = value
  load()
}
// 修改
const handleUpdate = async (id) => {
  dialogVisible.value = true
  await childComp.value.getNoticeForm(id)
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

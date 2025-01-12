<template>
  <!--  编辑弹框-->
  <RoleForm
    :dialogVisible="dialogVisible"
    @changeDialog="handlechangeDialog"
    ref="childComp"
  ></RoleForm>

  <el-row>
    <!--  分页查询表单按钮-->
    <el-col>
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="name" placeholder="点击输入角色名称"></el-input>
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
import RoleForm from '@/views/role/form/index.vue'
</script>

<style lang="scss" scoped>

</style>

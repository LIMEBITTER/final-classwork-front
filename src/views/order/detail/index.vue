<template>
  <div>
    <div class="submit-header">
      <el-card class="box-card">
        <el-steps :active="active" finish-status="success">
          <el-step title="提交工单" />
          <el-step title="物业审核并分配" description="管理员1审核中"/>

          <el-step title="维修上门" description="维修员:XXX上门服务"/>
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
        <el-row>
          <el-col :span="12">
            <el-form-item label="标题：">
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工单ID：">
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="创建时间：">
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="优先级：">
            </el-form-item>
          </el-col>
        </el-row>

      </el-card>

      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>表单信息</span>
          </div>
        </template>
        <el-row>
          <el-col :span="12">
            <el-form-item label="提交人员：">
            </el-form-item>
          </el-col>

        </el-row>

        <el-row>
          <el-col>
            <el-form-item label="问题描述：">
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
          <el-input
              v-model="textarea"
              :rows="2"
              type="textarea"
              placeholder="请输入处理意见"
          />

          <div class="buttons">
            <el-button type="primary" @click="nextStep">同意</el-button>

            <el-button type="info">拒绝</el-button>
          </div>

        </template>


      </el-card>


      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>操作历史</span>
          </div>
        </template>

        <el-table :data="tableDat" border style="width: 100%">
          <el-table-column prop="name" label="节点名称"  />
          <el-table-column prop="circulation" label="流转"  />
          <el-table-column prop="operator" label="处理人"  />
          <el-table-column prop="handle_time" label="处理时间"  />
          <el-table-column prop="remark" label="备注" />
        </el-table>




      </el-card>


    </div>

  </div>
</template>

<script setup>

import {ref} from "vue";

const textarea = ref('')
const active = ref(1)
const tableData = ref({})

const nextStep = () => {
  if (active.value++ > 2) active.value = 0
}

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

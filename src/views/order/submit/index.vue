<template>
  <div>
    <el-form :model="orderForm" :rules="rules" ref="orderFormRef">

      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>工单基本信息</span>
          </div>
        </template>
        <el-row>
          <el-col>
            <el-form-item label="标题：" prop="title">
              <el-input v-model="orderForm.title"/>
            </el-form-item>
          </el-col>

        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="工单ID：" prop="order_id" style="width: 400px">
              <el-input v-model="orderForm.order_id" disabled/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="优先级：" prop="priority">
              <el-radio-group v-model="orderForm.priority">
                <el-radio :value="1">
                  <el-tag type="success">正常</el-tag>
                </el-radio>
                <el-radio :value="2">
                  <el-tag type="warning">紧急</el-tag>
                </el-radio>
                <el-radio :value="3">
                  <el-tag type="danger">非常紧急</el-tag>
                </el-radio>
              </el-radio-group>
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
          <el-col>
            <el-form-item label="问题描述：" prop="complaint">
              <el-input
                  v-model="orderForm.complaint"
                  :rows="2"
                  type="textarea"
                  placeholder="请详细说明问题"
              />
            </el-form-item>
          </el-col>

        </el-row>

        <el-row>
          <el-col>
            <el-form-item label="图片：">
<!--              <el-upload-->
<!--                  v-model:file-list="fileList"-->
<!--                  action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"-->
<!--                  list-type="picture-card"-->
<!--                  :on-preview="handlePictureCardPreview"-->
<!--                  :on-remove="handleRemove"-->
<!--                  :auto-upload="false"-->
<!--              >-->
<!--                <el-icon><Plus /></el-icon>-->
<!--              </el-upload>-->
            </el-form-item>
          </el-col>

        </el-row>



        <div class="buttons">
          <el-button type="primary" @click="onSubmit">提交审核</el-button>

        </div>



      </el-card>

    </el-form>




  </div>
</template>

<script setup>
import {reactive, ref} from 'vue'
import useSystemStore from "@/stores/system";
import pinia from "@/stores/store";
import {getRandomOrderId, saveOrder} from "@/api/business";

const systemStore = useSystemStore(pinia)

const creator_id = systemStore.userInfo.id
const username = systemStore.userInfo.userName

const orderFormRef = ref()

const orderForm = reactive({
  title:"",
  priority:1,
  order_id:"",
  complaint:"",
  creator_id:creator_id,
  related_person:1,
  username:username

})

const rules = reactive({
  title:[
    {required:true,message:"请输入标题",trigger:"blur"}
  ],
  complaint:[
    {required:true,message:"请描述问题",trigger:"blur"}
  ]
})

const onSubmit = async () =>{

  //表单校验
  await orderFormRef.value?.validate().catch((err)=>{
    throw err
  })

  console.log('此时的表单',orderForm)

  //提交表单
  const res = await saveOrder(orderForm)

  console.log(res)

}

const getRandomId = async () =>{
  const res = await getRandomOrderId()
  orderForm.order_id = res.data
}

getRandomId()
</script>

<style lang="scss" scoped>
.box-card{
  margin-bottom: 10px;
}
</style>

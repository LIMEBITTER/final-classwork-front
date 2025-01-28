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
            <el-form-item label="图片：" prop="file">
              <el-upload
                  v-model:file-list="files"
                  list-type="picture-card"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="handleRemove"
                  :auto-upload="false"
                  :on-change="handleChange"
                  ref="uploadImgRef"

              >
                <el-icon><Plus /></el-icon>
              </el-upload>
            </el-form-item>
          </el-col>

        </el-row>



        <div class="buttons">
          <el-button type="primary" @click="onSubmit">提交审核</el-button>

        </div>



      </el-card>

    </el-form>

    <el-dialog v-model="dialogVisible">
      <img w-full :src="dialogImageUrl" alt="预览图片"/>
    </el-dialog>




  </div>
</template>

<script setup>
import {reactive, ref} from 'vue'
import useSystemStore from "@/stores/system";
import pinia from "@/stores/store";
import {getRandomOrderId, saveOrder} from "@/api/business";
import { ElMessage } from 'element-plus'
import settings from '@/utils/settings'
import { uploadImageBatch } from '@/api/file'

const systemStore = useSystemStore(pinia)

const creator_id = systemStore.userInfo.id
const username = systemStore.userInfo.userName

const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const orderFormRef = ref()
const uploadImgRef = ref(null)

const orderForm = reactive({
  title:"",
  priority:1,
  order_id:"",
  complaint:"",
  creator_id:creator_id,
  related_person:1,
  username:username

})

const files = ref([])
const fileSet = ref(new Set())

const rules = reactive({
  title:[
    {required:true,message:"请输入标题",trigger:"blur"}
  ],
  complaint:[
    {required:true,message:"请描述问题",trigger:"blur"}
  ],

})

// const customUpload = async (options) => {
//   const {file} = options
//   console.log('@@@file',file)
//   console.log('@@@options',options)
//
//   const formData = new FormData()
//   formData.append('files',files.value)
//   await uploadImageBatch(formData)
//
// }

const uploadBatchImage = async () =>{
  let formData = new FormData()
  files.value.forEach(file=>{
    console.log('@file',file)
    formData.append("files",file.raw)
  })
  await uploadImageBatch(formData,orderForm.order_id)

}

const onSubmit = async () =>{



  //表单校验
  await orderFormRef.value?.validate().catch((err)=>{
    throw err
  })

  // await uploadImgRef.value.submit()

  await uploadBatchImage()
  //提交表单
  await saveOrder(orderForm)

}

const getRandomId = async () =>{
  const res = await getRandomOrderId()
  orderForm.order_id = res.data
}

const handlePictureCardPreview = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url
    dialogVisible.value = true
}

const handleRemove = (file,fileList) => {
  fileSet.value.delete(file.name)
  files.value = fileList
}
const handleChange = (file,fileList) => {
  //文件是否重复
  if (fileSet.value.has(file.name)){
    ElMessage.error('不能上传重复图片!')
    files.value.pop()
    return
  }
  console.log('@@@',file)
  //是否为图片
  if (!file.raw.type.startsWith('image/')){
    ElMessage.error('只能提交图片类型!')
    files.value.pop()
    return
  }

  fileSet.value.add(file.name)

  files.value = fileList
}



getRandomId()
</script>

<style lang="scss" scoped>
.box-card{
  margin-bottom: 10px;
}
</style>

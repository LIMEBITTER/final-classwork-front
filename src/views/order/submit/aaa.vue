<template>
  <div class="right-container radius-md">
    <div class="u-header el-row is-justify-space-between t-config filter flex radius-md q-pa-md">
      <div class="header-font">上传列表</div>
      <div class="right-fun el-row is-justify-space-between flex">
        <el-upload
          class="upload-s"
          :action="flgs.uploadUrl"
          :show-file-list="false"
          multiple
          :auto-upload="false"
          ref="uploadRef"
          :on-change="waitFileChange"
          accept=".jpg, .png, .JPG, .PNG, .jpeg, .JPEG"
        >
          <el-button :icon="Plus"></el-button>
        </el-upload>
      </div>
    </div>
    <!-- 文件列表 -->
    <el-table
      class="u-table"
      @selection-change="handleSelectionChange"
      stripe
      :data="waitFileList"
      v-show="flgs.isDone"
      width="100%"
    >
      <el-table-column type="selection" align="center" width="50" />
      <el-table-column
        prop="name"
        label="文件名"
        align="center"
        show-overflow-tooltip
        width="100"
      />

      <el-table-column
        prop="newSize"
        label="文件大小"
        align="center"
        width="100"
        show-overflow-tooltip
      />
      <el-table-column label="" align="center" width="60">
        <template #default="scope">
          <el-icon @click="deleteRow(scope.row.uid, uploadRef)" class="adpIcon cursor-p">
            <svg-icon name="delete"></svg-icon>
          </el-icon>
        </template>
      </el-table-column>
    </el-table>
    <!-- loading -->
    <div
      class="el-loading-mask"
      style="background-color: rgb(122, 122, 122, 0.8); z-index: 1026"
      v-if="flgs.processFlgs"
    >
      <div class="el-loading-spinner">
        <el-progress
          color=" #B0C4DE"
          type="circle"
          :show-text="false"
          :stroke-width="5"
          :percentage="flgs.processNum"
          status="exception"
        ></el-progress>
        <p class="el-loading-text" style="color: #b0c4de">正在上传...</p>
      </div>
    </div>
    <!-- 拖拽上传区域 -->
    <el-upload
      class="upload-s"
      :drag="flgs.isDrag"
      v-show="flgs.isDrag"
      :action="flgs.uploadUrl"
      :show-file-list="false"
      multiple
      :auto-upload="false"
      ref="uploadRef"
      :on-change="waitFileChange"
      accept=".jpg, .png, .JPG, .PNG, .jpeg, .JPEG"
    >
      <el-icon class="el-icon--upload" v-show="flgs.isDrag"><upload-filled /></el-icon>
      <div class="el-upload__text" v-show="flgs.sDrag">
        Drop file here or
        <em>click to upload</em>
      </div>
      <template #tip>
        <div class="el-upload__tip"></div>
      </template>
    </el-upload>
    <div class="r-bottom">
      <el-select clearable v-model="flgs.projectId" placeholder="请选择批次" class="pa-md">
        <el-option
          v-for="item in projectList"
          :key="item.id"
          :label="item.companyName"
          :value="item.id"
        />
      </el-select>
      <div class="right-fun pa-md">
        <el-button @click="uploadBegin(uploadRef)">开始上传</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, defineAsyncComponent } from 'vue';
import { postData, postFormData } from '@/api/http';
import { DataM } from '@/api/api-list';
import { alertMsg, deWeight, deepCopy } from '@/util';
import { Plus, UploadFilled } from '@element-plus/icons-vue';

const props = defineProps({
  projectList:Array,
  default:[]
})
const uploadRef = ref();
const waitFileList = ref([] as any[]);
const selectedFile = ref([] as any[]);
const flgs = ref({
  isDone: false,
  isDrag: true,
  uploadUrl: '',
  projectId: null,
  maxLength: null,
  selectedFile:[],
  processNum: 0,
  processFlgs: false,
  count:0
});

watch(
  () => waitFileList.value,
  () => {
    flgs.value.isDone = waitFileList.value.length > 0 ? true : false;
    flgs.value.isDrag = !flgs.value.isDone;
  }
);

// 文件变化Handle
const waitFileChange = async (file: any, fileList: any[]) => {
  let cLength = fileList.length;
  flgs.value.maxLength = Math.max(cLength, flgs.value.maxLength);
  // 防止多次执行change
  setTimeout(() => {
    if (cLength !== flgs.value.maxLength) return;
    flgs.value.maxLength = null;
    if (fileList.length > 300) {
      alertMsg('error', '单次上传文件最大数量为300');
      waitFileList.value = fileList.splice(0, 300);
    } else {
      waitFileList.value = fileList;
    }
    fileList = fileList.map(x => ({
      ...x,
      newSize: `${(x.size / Math.pow(1024, 2)).toFixed(2)}M`
    }));

  }, 0);
};
// 删除列表
function deleteRow(uid: number, uploadRef: any) {
  waitFileList.value = waitFileList.value.filter(x => x.uid != uid);
  uploadRef.handleRemove(waitFileList.value);
}
// 表格选中的数据
function handleSelectionChange(fileList: any[]) {
  selectedFile.value = fileList;
  // 预防分割导致数据变化
  flgs.value.selectedFile = deepCopy(fileList)
}
// 开始上传
async function uploadBegin(uploadRef: any) {
  // 前置条件
  if (!flgs.value.projectId) return alertMsg('warning', '请选择批次');
  if (selectedFile.value.length == 0) return alertMsg('warning', '请选择要上传的文件');
  // loading
  flgs.value.processFlgs = true;
  // 十五张图片一次请求
  for (let i: number = 0; i < flgs.value.selectedFile.length; i += 1) {
    // 每次添加后删除原有数据
    let uploadFile: any[] = selectedFile.value.splice(0,selectedFile.value.length<1 ? selectedFile.value.length : 1);
    uploadAPI(uploadFile,uploadRef)
  }
}
function uploadAPI(list: any[], uploadRef: any) {
  const formData = new FormData();
  formData.append('projectId', flgs.value.projectId);
  list.forEach(x => {
    formData.append('files', x.raw);
  });
  postFormData(DataM.upload, formData).then(res => {
    flgs.value.count++
    // 进度条数据
    flgs.value.processNum = ((flgs.value.count) / flgs.value.selectedFile.length) * 100;
    // 上传完成时初始化数据
    if (flgs.value.processNum == 100) {
      flgs.value.processFlgs = false;
      flgs.value.count = 0
      waitFileList.value = deWeight(waitFileList.value,flgs.value.selectedFile)
      uploadRef.handleRemove(flgs.value.selectedFile);
      alertMsg('success', '上传成功' || res.message);
    }
  });
}
</script>

<style lang="less" scoped>
.right-container {
  margin: 5px;
  .u-header {
    width: 100%;
    padding: 10px;
    .header-font {
      line-height: 32px;
    }
    .right-fun {
      width: 15%;
      .check-menu {
        color: rgb(174, 174, 174);
        font-size: 14px;
      }
    }
    .el-button {
      border-radius: 5px;
    }
  }
  .u-table {
    height: calc(100vh - 180px);
    overflow-y: auto;
    .el-table__header-wrapper {
      .cell {
        text-align: right;
      }
    }
  }
  .upload-s {
    width: 100%;
  }
  .r-bottom {
    width: 100%;
    position: relative;
    display: flex;
    justify-content: space-between;
    .pa-md{
      padding: 10px;
    }
  }

}
</style>

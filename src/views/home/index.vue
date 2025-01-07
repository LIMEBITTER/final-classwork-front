<script setup>
import request from '@/utils/request'
import { reactive, ref } from 'vue'
// 系统参数
const systemInformation = reactive({})
// 用户总数
const userSize = ref(0)
// 角色总数
const roleSize = ref(0)
// 权限（菜单）总数
const permissionSize = ref(0)
// 公告内容
const notices = ref([
  {
    "name": "前端技术栈",
    "url": "https://vitejs.cn/",
    "content": "前端部分使用了最新的 Node.js 18.20.4 搭配 Vite 4.3.1 构建项目，主要框架为 Vue 3.3.4，配合 Element-Plus 2.3.12 提供优雅的 UI 组件库，并通过 Axios 1.5.0 进行高效的 API 请求管理。"
  },
  {
    "name": "后端技术栈",
    "url": "https://spring.io/projects/spring-boot",
    "content": "后端部分采用了 JDK 20 和 Springboot 3.1.4 搭建，利用 Mybatis-Plus 3.5.3.2 进行高效的数据访问，Sa-token 1.36.0 负责用户认证与权限管理，Hutool 5.8.9 则提供了丰富的工具类库以简化开发流程。"
  },
  {
    "name": "数据库配置",
    "url": "https://www.mysql.com/",
    "content": "项目的数据库选择了 MySQL 5.7，作为核心数据存储，结合 Redis 3.2.1 作为缓存系统，提升了数据访问的速度和系统的整体性能。"
  },
  {
    "name": "开发与编译环境",
    "url": "https://www.jetbrains.com.cn/idea/",
    "content": "在开发环境方面，使用了最新版本的 IDEA 2024 作为主要的开发工具，同时搭配 Navicat 16 进行数据库管理，使得开发和调试工作更加便捷高效。"
  }
])
// 获取用户总数
const handleGetUserSize = async () => {
  const res = await request.get('/user')
  userSize.value = res.data.length
}
handleGetUserSize()
// 获取角色总数
const handleGetRoleSize = async () => {
  const res = await request.get('/role')
  roleSize.value = res.data.length
}
handleGetRoleSize()
// 获取权限（菜单）总数
const handleGetPermissionSize = async () => {
  const res = await request.get('/permission')
  console.log('@@@',res)
  permissionSize.value =res.data.length
}
handleGetPermissionSize()



</script>

<template>
  <el-row>
    <el-col :span="8" class="statistic">
      <el-statistic :value="userSize">
        <template #title>
          <div
            style="display: inline-flex; align-items: center; font-size: 16px; text-align: center"
          >
            <el-icon :size="16">
              <User />
            </el-icon>
            用户总数
          </div>
        </template>
      </el-statistic>
    </el-col>
    <el-col :span="8" class="statistic">
      <el-statistic :value="roleSize">
        <template #title>
          <div style="display: inline-flex; align-items: center; font-size: 16px">
            <el-icon :size="16">
              <UserFilled></UserFilled>
            </el-icon>
            角色总数
          </div>
        </template>
      </el-statistic>
    </el-col>
    <el-col :span="8" class="statistic">
      <el-statistic :value="permissionSize">
        <template #title>
          <div style="display: inline-flex; align-items: center; font-size: 16px">
            <el-icon :size="16">
              <Menu />
            </el-icon>
            权限总数
          </div>
        </template>
      </el-statistic>
    </el-col>

  </el-row>


  <el-divider />
  <el-row>
    <el-col>
      <h1>技术简介</h1>
      <div>
        <el-collapse accordion>
          <el-collapse-item v-for="item in notices" :title="item.name" :name="item.id">
            <div>{{ item.url }}</div>
            <div v-html="item.content"></div>
          </el-collapse-item>
        </el-collapse>
      </div>
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
</style>

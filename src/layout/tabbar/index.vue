<script setup>
import { ref } from 'vue'
import useSystemStore from '@/stores/system'
import router from '@/router'
import pinia from '@/stores/store'
import request from '@/utils/request'
import {Expand, Fold, FullScreen, Loading} from "@element-plus/icons-vue";
const isFullScreen = ref(false)
const systemStore = useSystemStore(pinia)
const $route = router
// 修改图标
const changeIcon = () => {
  systemStore.fold = !systemStore.fold
}
//修改全屏
const changeFullScreen = () => {
  isFullScreen.value = !isFullScreen.value
  if (isFullScreen.value) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}
//刷新页面
const refsh = () => {
  window.location.reload()
}
// 退出登录
const handleLogOut = async () => {
  await request.post('/auth/logout')
  await $route.replace('/login')
  systemStore.reset()
}
// 修改个人信息
const handleInformation = async () => {
  await $route.replace('/information')
}


</script>
<script>
export default {
  name: 'Tabbar'
}
</script>
<template>
  <el-row>
    <el-col  style="display: flex; align-items: center;margin-top: 12px">

      <el-icon size="20" style="margin: 0 10px;">
        <component :is="systemStore.fold ? Expand : Fold" @click="changeIcon"></component>
      </el-icon>
      <el-breadcrumb separator="/" style="font-family: -apple-system">
        <el-breadcrumb-item
            v-for="(item, index) in $route.currentRoute.value.matched"
            v-show="item.name"
            :key="index.toString()"
            :to="item.path"
        >
          <el-icon>
            <component :is="item.meta.icon"></component>
          </el-icon>
          {{ item.meta.title }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col :offset="20"  style="display: flex; align-items: center;margin-top: -40px">



      <el-button type="primary" @click="refsh" :icon="Loading" circle />
      <el-button type="success" @click="changeFullScreen" :icon="FullScreen" circle />

      <el-avatar :src="systemStore.userInfo.avatar" :size="33" style="margin: 0 8px"> </el-avatar>
      <el-dropdown style="margin: 0 10px; cursor: pointer">
        <span class="el-dropdown-link">
          {{ systemStore.userInfo.userName }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleInformation">个人信息</el-dropdown-item>
          </el-dropdown-menu>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleLogOut">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-col>
  </el-row>


</template>

<style scoped lang="scss">
.el-row {
  height: 100%;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.1); /* 阴影效果 */
}
.el-button{
  display: flex;
  justify-content: center;
}
</style>

<script setup>
import {RouterView} from 'vue-router'

import useSystemStore from '@/stores/system'

import {onBeforeUnmount, onMounted} from 'vue'

const systemStore = useSystemStore()
// 监听窗口大小变化
const handleResize = () => {
  systemStore.fold = window.innerWidth < 768
}

// 在组件挂载时开始监听
onMounted(() => {
  handleResize() // 初始化调用一次以确保初始状态设置正确
  window.addEventListener('resize', handleResize)
})

// 在组件销毁时移除事件监听器，以免内存泄漏
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})


</script>

<template>
    <div>
      <RouterView/>
    </div>
</template>

<style scoped lang="scss"></style>

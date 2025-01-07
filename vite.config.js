import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
// https://vitejs.dev/config/
export default defineConfig({

  // server:{
  //   proxy:{
  //     '/api':{
  //       target:"http://127.0.0.1:90",
  //       changeOrigin:true
  //     }
  //   }
  // },


  plugins: [
    vue(),
    Pages({
      dirs: 'src/views',  // 需要生成路由的文件的目录
      exclude: ['**/components/*.vue']  // 排除在外的目录，将所有 components 目录下的 .vue 文件排除
    })

  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})

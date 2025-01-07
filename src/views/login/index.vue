<script setup>
import { reactive, ref } from 'vue'
import request from '@/utils/request'
import { ElNotification } from 'element-plus'
import useSystemStore from '@/stores/system'
import router from '@/router'



const $route = router
const systemStore = useSystemStore()
const formSize = ref('default')
const ruleFormRef = ref()
const captchaImg = ref()
const activeName = ref('first')
const ruleForm = reactive({
  userName: '',
  password: '',
  code: '',
  token: ''
})
// 校验规则
const rules = reactive({
  userName: [
    { required: true, message: '请输入账户名', trigger: 'blur' },
    { min: 5, max: 10, message: '账户名在5到10位', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 5, max: 10, message: '密码在5到10位', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { min: 5, max: 5, message: '验证码为长度为5', trigger: 'blur' }
  ]
})
//登录方法
const submitForm = async (formEl) => {
  if (!formEl) return
  formEl.validate(async (valid, fields) => {
    if (valid) {
      try {
        console.log('dfdffdffdf',ruleForm)
        const res = await request.post('/auth/login', ruleForm)
        systemStore.setToken(res.data.tokenValue)
        ElNotification({
          title: '登录成功',
          message: `${ruleForm.userName} 欢迎您!`,
          type: 'success'
        })

        $route.replace('/')
      } catch (error) {
        getCaptcha()
      }
    }
  })
}
//重置方法
const resetForm = (formEl) => {
  if (!formEl) return
  formEl.resetFields()
  getCaptcha()
}
//获取验证码
const getCaptcha = async () => {
  const res = await request.get('/auth/captcha')
  console.log('aaaaa',res)

  captchaImg.value = res.data.captchaImg
  ruleForm.token = res.data.token
  ruleForm.code = ''
}
getCaptcha()
</script>

<template>
  <div class="app_login">

    <div class="login_main">

          <div class="main_form">
            <el-card>
              <el-tabs v-model="activeName">
                <el-tab-pane label="后台管理系统" name="first">
                  <el-form
                    ref="ruleFormRef"
                    :model="ruleForm"
                    :rules="rules"
                    label-width="100px"
                    class="demo-ruleForm"
                    :size="formSize"
                    statuss-icon
                  >
                    <el-form-item label="账户名" prop="userName">
                      <el-input v-model="ruleForm.userName" prefix-icon="User" />
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                      <el-input
                        v-model="ruleForm.password"
                        prefix-icon="Lock"
                        type="password"
                        show-password
                      />
                    </el-form-item>
                    <el-form-item label="验证码" prop="code">
                      <el-row>
                        <el-col :span="12">
                          <el-input v-model="ruleForm.code" prefix-icon="Crop" />
                        </el-col>
                        <el-col :span="10" :offset="1" style="display: flex; align-items: center;justify-content: center">
                          <img
                            :src="captchaImg"
                            @click="getCaptcha"
                            style="border-radius: 5px"
                          />
                        </el-col>
                      </el-row>
                    </el-form-item>

                    <br />
                    <div style="display: flex; justify-content: center">
                      <el-button type="primary" @click="submitForm(ruleFormRef)"> 登录</el-button>
                      <el-button @click="resetForm(ruleFormRef)">重置</el-button>
                    </div>
                  </el-form>
                </el-tab-pane>

              </el-tabs>


            </el-card>
          </div>

    </div>
  </div>
</template>

<style scoped lang="scss">
.app_login {
  width: 100vw;
  height: 100vh;
  background-image: url("/public/bg3.jpg");
  background-size: cover;
  .login_main {
    width: 100vw;
    height: 96vh;
    display: flex;
    justify-content: center;
    align-items: center;
      .main_form {
        min-width: 400px;
      }

  }
  .login_footer{

    color: white;
    text-align: center;
    font-size: 15px;
    line-height: 4vh;
  }
}
</style>

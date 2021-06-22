<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="@/assets/logo.png" alt="">
      </div>
      <el-form ref="loginRef" :rules="loginRules" :model="loginForm" label-width="70px" class="login_form">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-phone"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" prefix-icon="el-icon-s-goods" type="password"></el-input>
        </el-form-item>
        <el-form-item class="buttons">
          <el-button type="primary" @click="loginClick">登录</el-button>
          <el-button type="danger" @click="resetClick">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      // 登录数据
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginRules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 11,
            message: '请输入合法的用户名',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 18,
            message: '密码长度为6到18位',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 登录按钮
    loginClick () {
      this.$refs.loginRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('登录失败')
        this.$message.success('登录成功')
        console.log(res)
        window.sessionStorage.setItem('token', res.data.token)
        await this.$router.push('/home')
      })
    },
    // 重置输入框
    resetClick () {
      this.$refs.loginRef.resetFields()
    }
  }
}
</script>

<style lang='less' scoped>
.login_container {
  height: 100%;
  background-color: #2b4b6b;

  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .avatar_box {
      width: 130px;
      height: 130px;
      border-radius: 50%;
      box-shadow: 0 0 10px #ddd;
      background: #EBEEF5;
      padding: 5px;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: #EBEEF5;
      }
    }

    .login_form {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 0 10px;
      box-sizing: border-box;

      .buttons {
        display: flex;
        justify-content: center;
      }
    }
  }
}
</style>

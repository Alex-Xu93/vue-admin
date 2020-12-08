<template>
  <!-- 登录页面的容器 -->
  <div class="login_container">
    <!-- 登录框 -->
    <div class="login_box">
      <!-- 头像 -->
      <div class="avatar_box">
        <img src="../../assets/logo.png" alt="" />
      </div>

      <!-- 表单 -->
      <!-- 绑定表单数据到loginForm对象上 -->
      <!-- 指定一个验证规则对象 -->
      <el-form
        ref="login_form"
        :model="loginForm"
        :rules="rules"
        class="login_form"
      >
        <!-- 用户名
        1. 把el-input和loginForm对象的属性做双重数据绑定
        2. 验证规则字段prop为验证规则对象rules的username
         -->
        <el-form-item class="login_form_username" prop="username">
          <!-- 前置图标 -->
          <el-input
            prefix-icon="iconfont icon-user"
            v-model="loginForm.username"
          >
          </el-input>
        </el-form-item>

        <!-- 密码
        验证规则字段prop为验证规则对象rules的password
         -->
        <el-form-item prop="password">
          <el-input
            prefix-icon="iconfont icon-3702mima"
            v-model="loginForm.password"
            type="password"
          ></el-input>
        </el-form-item>

        <!-- 确认/重置按钮表单Item
        1. 当用户点击登录后, 通过绑定el-form的ref找到表单, 进行表单验证, 验证通过后再发送请求到接口
        2. 当用户点击重置按钮后, 通过绑定el-form的ref找到该表单,进行表单重置
        -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  // 数据
  data() {
    return {
      // 登录表单数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },

      // 登录表单的验证规则对象
      rules: {
        // 验证用户名
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
        ],

        // 验证密码
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
        ]
      }
    }
  },

  // 方法
  methods: {
    login() {
      // 找到表单对象, 再次做验证
      this.$refs.login_form.validate(async valid => {
        // 不合法, 到此为止, 提示信息
        if (!valid) {
          return this.$message({
            type: 'info',
            message: '登录失败, 账户/密码输入不合法',
            duration: 800
          })
        }

        // 合法的表单
        const res = await this.$http.post('login', this.loginForm)

        // 判断得到的结构
        if (res.data.meta.status !== 200) {
          // 登陆失败
          return this.$message({
            type: 'danger',
            message: '登陆失败, 用户名/密码错误',
            duration: 800
          })
        }

        // 登录成功 - 1: 往浏览器的sessionStorage中添加服务器传递来的token
        sessionStorage.setItem('token', res.data.data.token)

        // 2. 调转到home页面
        this.$router.push('home')
      })
    },

    // 重置表单
    resetLoginForm() {
      this.$refs.login_form.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
// 登录页容器
.login_container {
  background-color: #2b4b6b;
  height: 100%;

  // 登录框
  .login_box {
    position: absolute;

    // 左/上移动父盒子的50%
    left: 50%;
    top: 50%;
    // 移动自身宽高的一半, 居中的效果
    transform: translate(-50%, -50%);
    border-radius: 5px;
    width: 450px;
    height: 300px;
    background-color: #fff;

    // 头像;
    .avatar_box {
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      width: 130px;
      height: 130px;
      // background: pink;
      border-radius: 50%;
      padding: 0 10px 0 10px;
      box-shadow: 0 0 15px #eee;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }

    // 登录的表单
    .login_form {
      position: absolute;
      bottom: 0;
      // 设置宽高
      width: 100%;
      height: 200px;
      padding: 0 30px 0 30px;
      box-sizing: border-box;

      .login_form_username {
        margin-bottom: 30px;
      }

      // 登录重置按钮区域
      .btns {
        // 伸缩布局, 居右
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>

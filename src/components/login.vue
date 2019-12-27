<template>
  <div class="container">
    <div class="login-box">
      <div class="logo">
        <img src="../assets/logo.jpg"/>
      </div>
      <el-form class="loginInfo" :model="loginForm">
        <el-form-item>
          <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            prefix-icon="iconfont icon-3702mima"
            v-model="loginForm.password"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item class="loginBtn">
          <el-button type="primary">登录</el-button>
          <el-button type="info">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  background-color: #2b4b6b;
  position: relative;
  .login-box {
    width: 500px;
    height: 350px;
    background-color: #fff;
    border-radius: 5px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .logo {
      width: 110px;
      height: 110px;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      border: 1px solid #eee;
      padding: 10px;
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .loginInfo {
      padding: 0 20px;
      margin-top: 120px;
      .loginBtn {
        width: 100%;
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}

/deep/ .el-input__prefix {
  left: 15px;
}
/deep/ .el-input--prefix .el-input__inner {
  padding-left: 40px;
}
</style>

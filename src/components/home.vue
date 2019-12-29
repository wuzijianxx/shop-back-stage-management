<template>
  <el-container class="container">
    <el-header height="70px">
      <div class="title">
        <img src="../assets/logo.jpg" alt />
        <h2>电商后台管理系统</h2>
      </div>
      <el-button @click="out" round>退出</el-button>
    </el-header>
    <el-container class="main-box">
      <el-aside width="200px">
        <el-menu default-active="2" class="el-menu-vertical-demo">
          <el-submenu :index="item.order+''" v-for="(item,index) in menulist" :key="index">
            <template slot="title">
              <i :class="icons[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="item.id+''" v-for="(item,index) in item.children" :key="index">
              <i class="el-icon-menu"></i>
              {{item.authName}}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menulist: [],
      icons: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      }
    }
  },
  created() {
    this.getMenuList()
  },
  methods: {
    out() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      console.log(res)
      if (res.meta.status == 200) {
        this.menulist = res.data
      } else {
        return this.$message.error(res.meta.msg)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  header {
    background-color: #1f74d0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 260px;
      img {
        width: 50px;
        border-radius: 50%;
      }
      h2 {
        color: #fff;
      }
    }
  }
  .main-box {
    aside {
      background-color: #97baec;
      .iconfont {
        margin-right: 10px;
      }
    }
  }
}
</style>
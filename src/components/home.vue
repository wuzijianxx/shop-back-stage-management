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
      <el-aside :width="isCollapse?'65px':'200px'">
        <div class="toggel" @click="toggelCollapse">|||</div>
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          :collapse="isCollapse"
          router
          :default-active="activePath"
        >
          <el-submenu :index="item.id+''" v-for="(item,index) in menulist" :key="index">
            <template slot="title">
              <i :class="icons[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item
              :index="'/'+item.path"
              @click="saveNavState('/'+item.path)"
              v-for="(item,index) in item.children"
              :key="index"
            >
              <i class="el-icon-menu"></i>
              {{item.authName}}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
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
      },
      isCollapse: false,
      activePath: ''
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    //退出主页 清除token
    out() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    //获取用户列表信息
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status == 200) {
        this.menulist = res.data
      } else {
        return this.$message.error(res.meta.msg)
      }
    },
    toggelCollapse() {
      this.isCollapse = !this.isCollapse
    },
    //用户列表路径
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
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
      .toggel {
        height: 30px;
        background-color: #005dfd;
        color: white;
        text-align: center;
        line-height: 30px;
        letter-spacing: 3px;
        cursor: pointer;
      }
    }
  }
}
/deep/ .el-menu--collapse{
  width: 64px;
}
</style>
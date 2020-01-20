<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon :closable="false"></el-alert>
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            clearable
            v-model="selectedKeys"
            :options="catelist"
            :props="{ expandTrigger: 'hover',value:'cat_id',label:'cat_name',children:'children'}"
            @change="parentCateChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="first">
          <el-button type="primary" :disabled="isBtnDisaled">添加参数</el-button>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="second">
          <el-button type="primary" :disabled="isBtnDisaled">添加属性</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      catelist: [],
      selectedKeys: [],
      activeName: 'first'
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get(`categories`)
      if (res.meta.status == 200) {
        this.catelist = res.data
      } else {
        this.$message.error('获取商品分类失败')
      }
    },
    //父级分类选项发生改变
    parentCateChange() {
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = []
      } else {
        this.isBtn = true
      }
    }
  },
  computed:{
      //判断按钮禁用
      isBtnDisaled(){
          if(this.selectedKeys.length !== 3){
              return true
          }
          return false
      }
  }
}
</script>

<style lang="scss" scoped>
.cat_opt {
  margin: 25px 0 15px 0;
}
</style>
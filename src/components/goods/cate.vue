<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-button type="primary">添加分类</el-button>
      <tree-table :data="catelist" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="#" border ></tree-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      catelist: [],
      total: 0,
      querInfo: { type: 3, pagenum: 1, pagesize: 5 },
      columns: [{ label: '分类名称', prop: 'cat_name' }]
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get(`categories`, {
        params: this.querInfo
      })
      if (res.meta.status == 200) {
        this.catelist = res.data.result
        this.total = res.data.total
      } else {
        this.$message.error('获取商品分类失败')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  .el-breadcrumb {
    margin-bottom: 20px;
  }
  .el-table,
  .el-pagination {
    margin-top: 20px;
  }
  .el-tag {
    margin: 10px;
  }
}
</style>
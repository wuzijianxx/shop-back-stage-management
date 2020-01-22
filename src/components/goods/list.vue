<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            clearable
            v-model="queryInfo.query"
            @clear="getGoodsList"
            placeholder="请输入搜索内容"
            class="input-with-select"
          >
            <el-button @click="getGoodsList" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodslist" border style="width: 100%">
        <el-table-column type="index" width="50" align="center" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" width="180" label="商品价格(元)"></el-table-column>
        <el-table-column prop="goods_weight" width="150" label="商品重量"></el-table-column>
        <el-table-column width="200" label="创建时间">
            <template slot-scope="scope">
                {{scope.row.add_time | dateFormat}}
            </template>
        </el-table-column>
        <el-table-column  label="操作" width="220">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" ></el-button>
            <el-button type="danger" icon="el-icon-delete"  @click="removeUserById(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
       <el-pagination
        :current-page="queryInfo.pagenum"
        :page-sizes="[10,20, 50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: { query: '', pagenum: 1, pagesize: 10 },
      goodslist: [],
      total: 1
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      if (res.meta.status == 200) {
        this.total = res.data.total
        // this.goodslist = res.data.goods_name
        this.goodslist = res.data.goods
        console.log(res.data)
      } else {
        return this.$message.error('获取商品列表失败')
      }
    },
    //当前页数
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getGoodsList()
    },
    //总页数
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val    
      this.getGoodsList()
    },
    //删除
    async removeUserById(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }

      const { data: res } = await this.$http.delete(`goods/${id}`)
      if (res.meta.status == 200) {
        this.$message.success('删除成功')
        this.getGoodsList()
      } else {
        this.$message.error('删除失败')
      }
    },
    //添加商品
    goAddPage(){
        this.$router.push('/goods/add')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
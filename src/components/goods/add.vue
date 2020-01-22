<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon></el-alert>
      <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form :model="addForm" :rules="addFormrules" ref="addFormRef" label-position="top">
        <el-tabs v-model="activeIndex" :tab-position="tabPosition" :before-leave="beforeTabsLeave">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input type="number" v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input type="number" v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input type="number" v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                clearable
                v-model="addForm.goods_cat"
                :options="catelist"
                :props="{ expandTrigger: 'hover',value:'cat_id',label:'cat_name',children:'children'}"
                @change="parentCateChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">配置管理</el-tab-pane>
          <el-tab-pane label="商品信息" name="2">角色管理</el-tab-pane>
          <el-tab-pane label="商品图片" name="3">定时任务补偿</el-tab-pane>
          <el-tab-pane label="商品内容" name="4">角色管理</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeIndex: '0',
      tabPosition: 'left',
      addForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat:[]
      },
      addFormrules: {
        goods_name: [{ required: true, message: '请输入商品名称' }],
        goods_price: [{ required: true, message: '请输入商品价格' }],
        goods_weight: [{ required: true, message: '请输入商品重量' }],
        goods_number: [{ required: true, message: '请输入商品数量' }],
        goods_cat: [{ required: true, message: '请输入商品分类' }]
      },
      catelist:[]
    }
  },
  created() {
    this.getCateList()
  },
  methods:{
      //获取商品列表数据
      async getCateList() {
      const { data: res } = await this.$http.get(`categories`, {
        params: this.queryInfo
      })
      if (res.meta.status == 200) {
        this.catelist = res.data
      } else {
        this.$message.error('获取商品分类失败')
      }
    },
    //级联选择器 发生改变  触发这个函数
    parentCateChange(){
        if(this.addForm.goods_cat.length!==3){
            this.addForm.goods_cat=[]
        }
    },
    //阻止tabs切换
    beforeTabsLeave(activeName, oldActiveName){
        if(this.addForm.goods_cat.length!==3 ){
            this.$message.error('请填写完整基本信息')
            return false
        }
    }
     
  }
}
</script>

<style lang="scss" scoped>
.container {
  .el-steps {
    margin: 20px 0 35px;
  }
}
</style>
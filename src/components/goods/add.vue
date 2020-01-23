<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form :model="addForm" :rules="addFormrules" ref="addFormRef" label-position="top">
        <el-tabs
          @tab-click="tabClicked"
          v-model="activeIndex"
          :tab-position="tabPosition"
          :before-leave="beforeTabsLeave"
        >
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
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="(item, index) in manyTableData"
              :key="index"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  :label="item"
                  v-for="(item, index) in item.attr_vals"
                  :key="index"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品信息" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="(item, index) in onlyTableData"
              :key="index"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="upload-demo"
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="hanleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" class="addGoodsList" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览 -->
    <el-dialog title="提示" :visible.sync="previewVisble" width="30%">
      <img :src="previewPath" alt class="previewImg" />
    </el-dialog>
  </div>
</template>
<script>
import _ from 'lodash'
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
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      addFormrules: {
        goods_name: [{ required: true, message: '请输入商品名称' }],
        goods_price: [{ required: true, message: '请输入商品价格' }],
        goods_weight: [{ required: true, message: '请输入商品重量' }],
        goods_number: [{ required: true, message: '请输入商品数量' }],
        goods_cat: [{ required: true, message: '请输入商品分类' }]
      },
      catelist: [],
      manyTableData: [],
      onlyTableData: [],
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewPath: '',
      previewVisble: false
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
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
    parentCateChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    //阻止tabs切换
    beforeTabsLeave(activeName, oldActiveName) {
      if (this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    //tab 被选中时触发0.3
    async tabClicked() {
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'many' }
          }
        )
        if (res.meta.status == 200) {
          res.data.forEach(item => {
            item.attr_vals =
              item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
          })
          this.manyTableData = res.data
        } else {
          this.$message.error('获取商品分类失败')
        }
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'only' }
          }
        )
        if (res.meta.status == 200) {
          this.onlyTableData = res.data
        } else {
          this.$message.error('获取商品分类失败')
        }
      }
    },
    //处理图片预览效果
    handlePreview(file) {
      this.previewPath = file.response.data.url
      this.previewVisble = true
    },
    //处理移除图片的操作
    handleRemove(file) {
      //获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path
      //从pics数组中  找到索引值
      const i = this.addForm.pics.findIndex(x => x.pic === filePath)
      //splice方法  从pics中删除
      this.addForm.pics.splice(i, 1)
    },
    //监听图片上传成功的事件
    hanleSuccess(response) {
      //拼接得到一个图片信息对象
      const picInfo = { pic: response.data.tmp_path }
      //将图片信息对象，push到pics数组中
      this.addForm.pics.push(picInfo)
    },
    //添加商品
    add() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请填写必填的表单项')
        //lodash 深拷贝addForm _.cloneDeep
        const cloneAddForm = _.cloneDeep(this.addForm)
        cloneAddForm.goods_cat = cloneAddForm.goods_cat.join(',')
        //处理动态参数
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        //处理静态属性
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        cloneAddForm.attrs = this.addForm.attrs

        const { data: res } = await this.$http.post(`goods`,cloneAddForm)
        if (res.meta.status == 201) {
          this.$message.success('添加商品成功')
          this.$router.push('/goods')
        } else {
          this.$message.error('添加商品失败')
        }
      })
    }
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  .el-steps {
    margin: 20px 0 35px;
  }
  .el-checkbox {
    margin-left: 20px;
  }
  .previewImg {
    width: 100%;
  }
  .addGoodsList {
    margin-top: 20px;
  }
}
</style>
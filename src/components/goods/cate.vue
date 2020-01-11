<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
      <tree-table
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        class="tree-table"
      >
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted===false"
            style="color:lightgreen;font-size:18px"
          ></i>
          <i class="el-icon-error" v-else style="color:red;font-size:18px"></i>
        </template> -->
        <template slot="sort" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" @click="showCateDialog(scope.row.cat_id)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="removeCateById(scope.row.cat_id)">删除</el-button>
        </template>
      </tree-table>
      <el-pagination
        :current-page="queryInfo.pagenum"
        :page-sizes="[3,5,10,15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </el-card>

    <!-- 添加分类 -->
    <el-dialog
      title="添加分类"
      @close="addCateDialogClosed"
      :closeOnClickModal="false"
      :visible.sync="addCateDialogVisible"
      width="30%"
    >
      <el-form
        label-width="80px"
        :model="addCateruleForm"
        :rules="addCaterules"
        ref="addCateFormRef"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateruleForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            clearable
            v-model="selectedKeys"
            :options="parentCateList"
            :props="{ expandTrigger: 'hover',value:'cat_id',label:'cat_name',children:'children',checkStrictly: true }"
            @change="parentCateChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

<!-- 修改分类 -->
    <el-dialog
      title="修改分类"
      @close="aditCateDialogClosed"
      :closeOnClickModal="false"
      :visible.sync="editCateDialogVisible"
      width="30%">
      <el-form
        label-width="80px"
        :model="editCateruleForm"
        :rules="editCaterules"
        ref="editCateFormRef"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateruleForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      catelist: [],
      total: 0,
      queryInfo: { type: 3, pagenum: 1, pagesize: 5 },
      columns: [
        { label: '分类名称', prop: 'cat_name' },
        { label: '是否有效', type: 'template', template: 'isok' },
        { label: '排序', type: 'template', template: 'sort' },
        { label: '操作', type: 'template', template: 'opt' }
      ],
      addCateDialogVisible: false,
      editCateDialogVisible:false,
      addCateruleForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      editCateruleForm:{},
      addCaterules: {
        cat_name: [{ required: true, message: '请输入分类名称' }]
      },
      editCaterules:{cat_name: [{ required: true, message: '请输入分类名称' }]},
      parentCateList: [],
      selectedKeys: []
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get(`categories`, {
        params: this.queryInfo
      })
      if (res.meta.status == 200) {
        this.catelist = res.data.result
        this.total = res.data.total
      } else {
        this.$message.error('获取商品分类失败')
      }
    },
    //当前页数
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getCateList()
    },
    //总页数
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getCateList()
    },
    //添加分类
    showAddCateDialog() {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    //关闭表单重置表单
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateruleForm.cat_pid = 0
      this.addCateruleForm.cat_level = 0
    },
    //获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get(`categories`, {
        params: { type: 2 }
      })
      if (res.meta.status == 200) {
        this.parentCateList = res.data
      } else {
        this.$message.error('获取父级分类数据失败')
      }
    },
    //父级分类选项发生改变
    parentCateChange() {
      if (this.selectedKeys.length > 0) {
        this.addCateruleForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ]
        this.addCateruleForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateruleForm.cat_pid = 0
        this.addCateruleForm.cat_level = 0
      }
    },
    //提交添加分类表单
    addCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          `categories`,
          this.addCateruleForm
        )
        if (res.meta.status == 201) {
          this.addCateDialogVisible = false
          this.$message.success('添加分类成功')
          this.getCateList()
        } else {
          this.$message.error('添加分类失败')
        }
      })
    },
    //删除添加分类
    async removeCateById(id){
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

      const { data: res } = await this.$http.delete(`categories/${id}`)
      if (res.meta.status == 200) {
        this.$message.success('删除成功')
        this.getCateList()
      } else {
        this.$message.error('删除失败')
      }
    },
    //根据ID查询分类
    async showCateDialog(id){
      this.editCateDialogVisible = true
      const { data: res } = await this.$http.get(`categories/${id}`)
      if (res.meta.status == 200) {
        this.editCateruleForm = res.data
      } else {
        this.$message.error('修改分类失败')
      }
    },
    //修改分类重置表单
    aditCateDialogClosed(){
      this.$refs.editCateFormRef.resetFields()
    },
    //提交修改用户
    editCate(){
      this.$refs.editCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `categories/${this.editCateruleForm.cat_id}`,
          {
            cat_name: this.editCateruleForm.cat_name
          }
        )
        if (res.meta.status == 200) {
          this.$message.success('修改分类成功')
          this.editCateDialogVisible = false
          this.getCateList()
        } else {
          this.$message.error('修改分类失败')
          console.log(this.editCateruleForm)
        }
      })
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
  .tree-table {
    margin-top: 20px;
  }
  .el-cascader {
    width: 100%;
  }
}
</style>
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
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="isBtnDisaled" @click="addDialogVisible=true">添加参数</el-button>
          <el-table :data="manyTableData" border style="width: 100%">
            <el-table-column type="expand" align="center">
              <template slot-scope="scope">
                <el-tag closable  @close="handleClose(index,scope.row)" v-for="(item, index) in scope.row.attr_vals" :key="index">{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" align="center" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作" width="250">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeEditDialog(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" :disabled="isBtnDisaled" @click="addDialogVisible=true">添加属性</el-button>
          <el-table :data="onlyTableData" border style="width: 100%">
            <el-table-column type="expand" align="center">
              <template slot-scope="scope">
                <el-tag closable  @close="handleClose(index,scope.row)" v-for="(item, index) in scope.row.attr_vals" :key="index">{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" align="center" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称"></el-table-column>
            <el-table-column label="操作" width="250">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeEditDialog(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <!-- 添加动态参数和静态属性 -->
      <el-dialog
        :title="'添加'+titleText"
        @close="addDialogClosed"
        :closeOnClickModal="false"
        :visible.sync="addDialogVisible"
        width="30%"
      >
        <el-form label-width="80px" :model="addForm" :rules="addFormRules" ref="addFormRef">
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="addForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addParams">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改动态参数和静态属性 -->
      <el-dialog
        :title="'修改'+titleText"
        @close="editDialogClosed"
        :closeOnClickModal="false"
        :visible.sync="editDialogVisible"
        width="30%"
      >
        <el-form label-width="80px" :model="editForm" :rules="editFormRules" ref="editFormRef">
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="editForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editParams">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      catelist: [],
      selectedKeys: [],
      activeName: 'many',
      manyTableData: [],
      onlyTableData: [],
      addDialogVisible: false,
      editDialogVisible: false,
      addForm: {
        attr_name: ''
      },
      addFormRules: {
        attr_name: [{ required: true, message: '请输入参数名称' }]
      },
      editForm: {
        attr_name: '',
        attr_id: ''
      },
      editFormRules: {
        attr_name: [{ required: true, message: '请输入参数名称' }]
      },
      inputVisible: false
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
      this.getParamsDate()
    },
    //tab 页签点击事件的处理函数
    handleClick() {
      this.getParamsDate()
    },
    //点击按钮，显示文本框
    showInput(row) {
      row.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    //获取参数列表的数据
    async getParamsDate() {
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = []
        this.manyTableData=[]
        this.onlyTableData=[]
      }
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      )
      if (res.meta.status == 200) {
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
          item.inputVisible = false
          item.inputValue = ''
        })
        if (this.activeName === 'many') {
          this.manyTableData = res.data
        } else {
          this.onlyTableData = res.data
        }
        console.log(res.data)
      } else {
        this.$message.error('获取参数列表失败')
      }
    },
    //提交添加动态参数和静态属性关闭重置表单
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    //提交修改动态参数和静态属性关闭重置表单
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    //提交添加动态参数和静态属性
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status == 201) {
          this.$message.success('添加成功')
          this.addDialogVisible = false
          this.getParamsDate()
        } else {
          this.$message.error('添加失败')
        }
      })
    },
    //编辑动态参数和静态属性按钮
    async showEditDialog(attr_id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attr_id}`,
        {
          params: { attr_sel: this.activeName }
        }
      )
      if (res.meta.status == 200) {
        if (this.activeName === 'many') {
          this.editForm.attr_name = res.data.attr_name
        } else {
          this.editForm.attr_name = res.data.attr_name
        }
        this.editForm = res.data
      } else {
        this.$message.error('查询参数失败')
      }
    },
    //提交修改动态参数和静态属性
    editParams() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status == 200) {
          this.$message.success('修改成功')
          this.getParamsDate()
          this.editDialogVisible = false
        } else {
          this.$message.error('修改失败')
        }
      })
    },
    //删除动态参数和静态属性
    async removeEditDialog(id) {
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

      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${id}`
      )
      if (res.meta.status == 200) {
        this.$message.success('删除成功')
        this.getParamsDate()
      } else {
        this.$message.error('删除失败')
      }
    },
    //文本失去焦点 Enter会触发事件
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.saveAttrVals(row)
    },
    //将对attr_als的操作，保存到数据库
    async saveAttrVals(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(',')
        }
      )
      if (res.meta.status == 200) {
        this.$message.success('修改参数项成功')
      } else {
        this.$message.error('修改参数项失败')
      }
    },
      //删除attr_als
      handleClose(index,row){
        row.attr_vals.splice(index,1)
        this.saveAttrVals(row)
      }
  },
  computed: {
    //判断按钮禁用
    isBtnDisaled() {
      if (this.selectedKeys.length !== 3) {
        return true
      }
      return false
    },
    //获取所选三级分类的ID
    cateId() {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[2]
      }
      return null
    },
    //动态计算标题的文本
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>

<style lang="scss" scoped>
.cat_opt {
  margin: 25px 0 15px 0;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 120px;
}
</style>
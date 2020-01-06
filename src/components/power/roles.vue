<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-button type="primary" @click="addRoles=true">添加角色</el-button>
      <el-table :data="rolesList" border style="width: 100%">
        <el-table-column type="expand" align="center"></el-table-column>
        <el-table-column type="index" align="center" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column prop="level" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="showEditRoles(scope.row.id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="removeRolesById(scope.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-setting">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色 -->
    <el-dialog
      title="添加角色"
      @close="addDialogClosed"
      :closeOnClickModal="false"
      :visible.sync="addRoles"
      width="30%"
    >
      <el-form
        label-width="80px"
        :model="addrolesForm"
        :rules="addroles"
        ref="addrolesFormRef"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addrolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addrolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoles = false">取 消</el-button>
        <el-button type="primary" @click="addSubmitForm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改角色 -->
    <el-dialog
      title="修改角色"
      @close="editDialogClosed"
      :closeOnClickModal="false"
      :visible.sync="editRoles"
      width="30%"
    >
      <el-form
        label-width="80px"
        :model="editrolesForm"
        :rules="editroles"
        ref="editrolesFormRef"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editrolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editrolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoles = false">取 消</el-button>
        <el-button type="primary" @click="editSubmitForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      addRoles: false,
      editRoles: false,
      addrolesForm: {
        roleName: '',
        roleDesc: ''
      },
      addroles: {
        roleName: [{ required: true, message: '请输入角色名称' }],
        roleDesc: [{ required: true, message: '请输入角色描述' }]
      },
      editrolesForm: {},
      editroles: {
        roleName: [{ required: true, message: '请输入角色名称' }],
        roleDesc: [{ required: true, message: '请输入角色描述' }]
      }
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    //获取角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status == 200) {
        this.rolesList = res.data
      } else {
        this.$message.error('获取角色列表失败')
      }
    },
    //提交验证添加角色表单
    addSubmitForm() {
      this.$refs.addrolesFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('roles', this.addrolesForm)
        if (res.meta.status == 201) {
          this.$message.success('添加成功')
          this.addRoles = false
          this.getRolesList()
        } else {
          this.$message.error('添加失败')
          console.log(res)
        }
      })
    },
    //添加角色关闭重置表单
    addDialogClosed() {
      this.$refs.addrolesFormRef.resetFields()
    },
    //提交添加角色关闭重置表单
    editDialogClosed() {
      this.$refs.editrolesFormRef.resetFields()
    },
    //修改角色信息 根据ID查询角色
    async showEditRoles(id) {
      this.editRoles = true
      const { data: res } = await this.$http.get(`roles/${id}`)
      if (res.meta.status == 200) {
        this.editrolesForm = res.data
        console.log(id)
      } else {
        this.$message.error('修改失败')
      }
    },
    //修改角色信息 提交角色
    editSubmitForm() {
      this.$refs.editrolesFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `roles/${this.editrolesForm.roleId}`,
          this.editrolesForm
        )
        if (res.meta.status == 200) {
          this.$message.success('修改成功')
          this.editRoles = false
          this.getRolesList()
        } else {
          this.$message.error('修改失败')
          console.log(this.editrolesForm)
        }
      })
    },
     //删除角色
    async removeRolesById(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        if(confirmResult!=='confirm'){
          return  this.$message.info('已取消删除')
        }

      const { data: res } = await this.$http.delete(`roles/${id}`)
      if (res.meta.status == 200) {
        this.$message.success('删除成功')
        this.getRolesList()
      } else {
        this.$message.error('删除失败')
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
}
</style>
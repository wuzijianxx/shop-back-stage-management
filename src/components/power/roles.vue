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
        <el-table-column type="expand" align="center">
          <template slot-scope="scope">
            <el-row class="alginCenter" v-for="(item, index) in scope.row.children" :key="index">
              <el-col :span="5" class="minwidthTag">
                <el-tag closable @close="removeRightById(scope.row,item.id)">{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row class="alginCenter" v-for="(item1, index1) in item.children" :key="index1">
                  <el-col :span="6" class="minwidthTag">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row,item1.id)"
                    >{{item1.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(item2, index2) in item1.children"
                      :key="index2"
                      closable
                      @close="removeRightById(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" align="center" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column prop="level" label="操作" width="340">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="showEditRoles(scope.row.id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="removeRolesById(scope.row.id)">删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
            >分配权限</el-button>
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
      title="分配角色权限"
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

    <!-- 展示分配权限-->
    <el-dialog
      title="修改角色"
      @close="setRightDialogClosed"
      :closeOnClickModal="false"
      :visible.sync="setRightDialogVisible"
      width="30%"
    >
      <el-tree
        :data="rightsList"
        show-checkbox
        :props="treeProps"
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="setRightrolesFormRef"
      ></el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
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
      },
      setRightDialogVisible: false,
      rightsList: [],
      treeProps: { children: 'children', label: 'authName' },
      defKeys: [],
      roleId:''
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
    //清空分配角色权限数组
    setRightDialogClosed() {
      this.defKeys = []
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
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }

      const { data: res } = await this.$http.delete(`roles/${id}`)
      if (res.meta.status == 200) {
        this.$message.success('删除成功')
        this.getRolesList()
      } else {
        this.$message.error('删除失败')
      }
    },
    //删除第三级标签
    async removeRightById(roleId, rightId) {
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
        `roles/${roleId.id}/rights/${rightId}`
      )
      if (res.meta.status == 200) {
        this.$message.success('删除成功')
        roleId.children = res.data
      } else {
        this.$message.error('删除失败')
      }
    },
    //展示分配角色权限
    async showSetRightDialog(role) {
      this.roleId=role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status == 200) {
        this.rightsList = res.data
        this.getLeafKeys(role, this.defKeys)
        this.setRightDialogVisible = true
      } else {
        this.$message.error('获取权限列表失败')
      }
    },
    //获取角色权限下所有三级权限的ID，并保存在defKeys数组中
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    //点击为角色分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.setRightrolesFormRef.getCheckedKeys(),
        ...this.$refs.setRightrolesFormRef.getHalfCheckedKeys()
      ]
      const idStr=keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
      if (res.meta.status == 200) {
        this.$message.success('分配权限列表成功')
        this.getRolesList()
        this.setRightDialogVisible = false
      } else {
        this.$message.error('分配权限列表失败')
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
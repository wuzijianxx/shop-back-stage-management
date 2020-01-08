<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            clearable
            v-model="queryInfo.query"
            @clear="getUserList"
            placeholder="请输入内容搜索内容"
            class="input-with-select"
          >
            <el-button @click="getUserList" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userList" border style="width: 100%">
        <el-table-column type="index" width="50" align="center" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="180"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              @change="userStateChanged(scope.row)"
              v-model="scope.row.mg_state"
              active-color="#1f74d0"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="operation" label="操作" width="220">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" @click="removeUserById(scope.row.id)"></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top-start" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" @click="setRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="queryInfo.pagenum"
        :page-sizes="[1,2, 4, 6, 100]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </el-card>

    <!-- 添加用户 -->
    <el-dialog
      title="添加用户"
      @close="addDialogClosed"
      :closeOnClickModal="false"
      :visible.sync="addDialogVisible"
      width="30%"
    >
      <el-form
        label-width="70px"
        :model="addruleForm"
        :rules="addrules"
        ref="addruleFormRef"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addruleForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addruleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addruleForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSubmitForm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户 -->
    <el-dialog
      title="修改用户信息"
      @close="aditDialogClosed"
      :closeOnClickModal="false"
      :visible.sync="editDialogVisible"
      width="30%"
    >
      <el-form
        label-width="70px"
        :model="editruleForm"
        :rules="editrules"
        ref="editruleFormRef"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editruleForm.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editruleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editruleForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="aditSubmitForm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色 -->
    <el-dialog
      title="分配角色"
      @close="setRoleDialogClosed"
      :closeOnClickModal="false"
      :visible.sync="setRoleDialogVisible"
      width="30%"
    >
      <div>
        <p>当前的用户:{{userInfo.username}}</p>
        <p>当前的角色:{{userInfo.role_name}}</p>
        <p>
          分配新角色:
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    //验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/
      if (regEmail.test(value)) {
        return cb()
      }
      //返回一个错误提示
      cb(new Error('请输入合法的邮箱'))
    }
    //验证手机号码的规则
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^1[34578]\d{9}$/
      if (regMobile.test(value)) {
        return cb()
      }
      //返回一个错误提示
      cb(new Error('请输入合法的手机号码'))
    }
    return {
      queryInfo: { query: '', pagenum: 1, pagesize: 100 },
      userList: [],
      total: 1,
      addDialogVisible: false,
      editDialogVisible: false,
      setRoleDialogVisible: false,
      addruleForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addrules: {
        username: [{ required: true, message: '请输入用户名' }],
        password: [
          { required: true, message: '请输入密码' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址' },
          { validator: checkEmail }
        ],
        mobile: [
          { required: true, message: '请输入手机号码' },
          { validator: checkMobile }
        ]
      },
      editrules: {
        username: [{ required: true, message: '请输入用户名' }],
        email: [
          { required: true, message: '请输入邮箱地址' },
          { validator: checkEmail }
        ],
        mobile: [
          { required: true, message: '请输入手机号码' },
          { validator: checkMobile }
        ]
      },
      editruleForm: {},
      userInfo: {},
      rolesList: [],
      selectedRoleId: ''
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    //获取用户
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status == 200) {
        this.userList = res.data.users
        this.total = res.data.total
      } else {
        return this.$message.error('获取用户列表失败')
      }
    },
    //当前页数
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getUserList()
    },
    //总页数
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getUserList()
    },
    //监听 switch 状态
    async userStateChanged(userinfo) {
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      )
      if (res.meta.status == 200) {
        // return this.$message.success('更新用户列表成功')
      } else {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('更新用户列表失败')
      }
    },
    //提交验证添加用户表单
    addSubmitForm() {
      this.$refs.addruleFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('users', this.addruleForm)
        if (res.meta.status == 201) {
          this.$message.success('添加成功')
          this.addDialogVisible = false
          this.getUserList()
        } else {
          this.$message.error('添加失败')
        }
      })
    },
    //添加用户关闭重置表单
    addDialogClosed() {
      this.$refs.addruleFormRef.resetFields()
    },
    //修改用户关闭重置表单
    aditDialogClosed() {
      this.$refs.editruleFormRef.resetFields()
    },
    //监听分配角色对话框的关闭事件
    setRoleDialogClosed() {
      this.selectedRoleId=''
      this.userInfo={}
    },
    //修改用户信息对话框
    async showEditDialog(id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get(`users/${id}`)
      if (res.meta.status == 200) {
        this.editruleForm = res.data
      } else {
        this.$message.error('修改失败')
      }
    },
    //提交验证修改用户信息
    aditSubmitForm() {
      this.$refs.editruleFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `users/${this.editruleForm.id}`,
          {
            email: this.editruleForm.email,
            mobile: this.editruleForm.mobile
          }
        )
        if (res.meta.status == 200) {
          this.$message.success('修改成功')
          this.editDialogVisible = false
          this.getUserList()
        } else {
          this.$message.error('修改失败')
        }
      })
    },
    //删除用户
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

      const { data: res } = await this.$http.delete(`users/${id}`)
      if (res.meta.status == 200) {
        this.$message.success('删除成功')
        this.getUserList()
      } else {
        this.$message.error('删除失败')
      }
    },
    //展示分配角色对话框
    async setRole(userInfo) {
      this.userInfo = userInfo
      this.setRoleDialogVisible = true
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status == 200) {
        this.rolesList = res.data
      } else {
        this.$message.error('获取角色列表失败')
      }
    },
    //点击按钮 确定分配角色
    async saveRoleInfo(){
      if(!this.selectedRoleId){
       return this.$message.error('请选择要分配的角色')
      }
      const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.selectedRoleId})
      if (res.meta.status == 200) {
        this.$message.success('更新角色成功')
        this.getUserList()
      this.setRoleDialogVisible = false
      } else {
        this.$message.error('更新角色失败')
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
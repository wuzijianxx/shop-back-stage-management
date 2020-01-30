<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-input
        clearable
        v-model="queryInfo.query"
        @clear="getOrderList"
        placeholder="请输入内容搜索内容"
        class="input-with-select"
      >
        <el-button @click="getOrderList" slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-table :data="orderlist" border style="width: 100%">
        <el-table-column type="index" width="50" align="center" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="120"></el-table-column>
        <el-table-column label="是否付款" width="120">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status==='1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="120"></el-table-column>
        <el-table-column label="下单时间" width="250">
          <template slot-scope="scope">{{scope.row.create_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="250">
          <el-button type="primary" icon="el-icon-edit" @click="showBox"></el-button>
          <el-button type="success" icon="el-icon-location" @click="showProgressBox"></el-button>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="queryInfo.pagenum"
        :page-sizes="[10,20, 40, 100]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </el-card>

    <!-- 修改地址对话框 -->
    <el-dialog
      title="修改地址"
      @close="addressClosed"
      :closeOnClickModal="false"
      :visible.sync="addressDialogVisible"
      width="30%"
    >
      <el-form label-width="100px" :model="addressForm" :rules="addressRules" ref="addressRef">
        <el-form-item label="省市区\县" prop="address1">
          <el-cascader
            clearable
            v-model="addressForm.address1"
            :options="cityData"
            :props="{ expandTrigger: 'hover'}"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressOrders">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 物流进度对话框 -->
    <el-dialog
      title="修改地址"
      @close="progressClosed"
      :closeOnClickModal="false"
      :visible.sync="progressDialogVisible"
      width="30%"
    >
      <el-form label-width="100px" :model="progressForm" :rules="progressRules" ref="progressRef">
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in progressInfo"
            :key="index"
            :timestamp="activity.time"
          >{{activity.context}}</el-timeline-item>
        </el-timeline>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="progressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="progressOrders">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata.js'
export default {
  data() {
    return {
      queryInfo: { query: '', pagenum: 1, pagesize: 10 },
      orderlist: [],
      total: 0,
      addressDialogVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      addressRules: {
        address1: [{ required: true, message: '请选择省市区县' }],
        address2: [{ required: true, message: '请填写详细地址' }]
      },
      cityData,
      progressDialogVisible: false,
      progressForm: {},
      progressRules: {},
      progressInfo: []
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status == 200) {
        this.orderlist = res.data.goods
        this.total = res.data.total
      } else {
        return this.$message.error('获取订单数据列表失败')
      }
    },
    //当前页数
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getOrderList()
    },
    //总页数
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getOrderList()
    },
    //修改地址
    showBox() {
      this.addressDialogVisible = true
    },
    //关闭修改地址 重置表单
    addressClosed() {
      this.$refs.addressRef.resetFields()
    },
    //提交修改地址
    addressOrders() {},
    //提交物理进度
    progressOrders() {},
    //物流进度
    async showProgressBox() {
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      if (res.meta.status == 200) {
        this.progressDialogVisible = true
        this.progressInfo = res.data
        console.log(res.data)
      } else {
        return this.$message.error('获取订单数据列表失败')
      }
    },
    //关闭物理进度 重置表单
    progressClosed() {
      this.$refs.progressRef.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.el-cascader {
  width: 100%;
}
</style>
<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class='el-icon-arrow-right'>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片-->
    <el-card class='box-card'>
      <el-row :gutter='20'>
        <el-col :span='8'>
          <el-input placeholder='请输入内容'>
            <el-button slot='append' icon='el-icon-search'></el-button>
          </el-input>
        </el-col>
      </el-row>

      <el-table :data='orders' border stripe>
        <el-table-column label='#' type='index'></el-table-column>
        <el-table-column label='订单编号' prop='order_number'></el-table-column>
        <el-table-column label='订单价格' prop='order_price'></el-table-column>
        <el-table-column label='是否付款' type='error'>
          <template slot-scope='scope'>
            <!--{{ scope.row.pay_status === '0' ? '未付款' : scope.row.pay_status === '1' ? '已付款' : '未填写' }}-->
            <el-tag v-if="scope.row.pay_statu==='1'" type='success'>已付款</el-tag>
            <el-tag v-else type='danger'>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label='是否发货' prop='is_send'></el-table-column>
        <el-table-column label='下单时间'>
          <template slot-scope='scope'>
            {{ $moment(scope.row.create_time, 'X').format('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column label='操作' width='180px'>
          <template slot-scope='scope'>
            <el-button icon='el-icon-edit' size='mini' type='primary'
                       @click='modifyOrderDialog(scope.row.user_id)'></el-button>
            <el-button icon='el-icon-delete' size='mini' type='danger' @click='showBox'></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页-->
      <el-pagination
        :current-page='queryInfo.pagenum'
        :page-size='queryInfo.pagesize'
        :page-sizes='[2, 5, 10, 15]'
        :total='total'
        layout='total, sizes, prev, pager, next, jumper'
        @size-change='handleSizeChange'
        @current-change='handleCurrentChange'>
      </el-pagination>
    </el-card>

    <el-dialog
      :visible.sync='dialogVisible'
      title='修改地址'
      width='50%'>
      <el-form ref='queryAddressInfoRef' :model='queryAddressInfo' label-width='90px'>
        <el-form-item label='省市区/县' prop='address1'>
          <el-cascader v-model='queryAddressInfo.address1' :options='cityData' style='width: 100%;'></el-cascader>
        </el-form-item>
        <el-form-item label='详细地址' prop='address2'>
          <el-input v-model='queryAddressInfo.address2' prefix-icon='el-icon-s-goods'></el-input>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
    <el-button @click='dialogVisible = false'>取 消</el-button>
    <el-button type='primary' @click='dialogVisible = false'>确 定</el-button>
  </span>
    </el-dialog>

    <el-dialog
      :visible.sync='progressDialogVisible'
      title='物流进度'
      width='50%'>
      <el-form :model='queryAddressInfo' label-width='90px'>
        <el-form-item label='详细地址' prop='address2'>
          <el-input v-model='queryAddressInfo.address2' prefix-icon='el-icon-s-goods'></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import { _getOrderList, _getProgress } from '@/network/order'
import cityData from '@/views/order/cityData'

export default {
  name: 'Orders',
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5,
        user_id: '',
        pay_status: '',
        consignee_addr: ''
      },
      total: 0,
      orders: [],
      dialogVisible: false,
      progressDialogVisible: false,
      queryAddressInfo: {
        address1: [],
        address2: ''
      },
      cityData
    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    getOrderList () {
      _getOrderList(this.queryInfo).then(res => {
        this.total = res.data.total
        this.orders = res.data.goods
      })
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    modifyOrderDialog (id) {
      this.dialogVisible = true
    },
    showBox () {
      this.progressDialogVisible = true
      _getProgress().then(res => {
        console.log(res)
      })
    }
  }
}
</script>

<style lang='less' scoped>

</style>

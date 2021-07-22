<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class='el-icon-arrow-right'>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片-->
    <el-card class='box-card'>
      <el-row :gutter='20'>
        <el-col :span='8'>
          <el-input placeholder='请输入内容' v-model='queryInfo.query' clearable @clear='getGoodsList'>
            <el-button slot='append' icon='el-icon-search' @click='getGoodsList'></el-button>
          </el-input>
        </el-col>
        <el-col :span='4'>
          <el-button type='primary' @click='addGoods'>添加商品</el-button>
        </el-col>
      </el-row>

      <el-table :data='goods' stripe border>
        <el-table-column label='#' type='index'></el-table-column>
        <el-table-column label='商品名称' prop='goods_name'></el-table-column>
        <el-table-column label='商品价格' prop='goods_price'></el-table-column>
        <el-table-column label='商品重量' prop='goods_weight'></el-table-column>
        <el-table-column label='创建时间' prop='add_time'>
          <template slot-scope='scope'>
            {{ $moment(scope.row.add_time, 'X').format('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column label='操作' width='190px'>
          <template slot-scope='scope'>
            <el-button icon='el-icon-edit' size='mini' type='primary' @click='modifyGoodsDialog(scope.row.goods_id)'>
              编辑
            </el-button>
            <el-button type='danger' icon='el-icon-delete' size='mini' @click='delGoods(scope.row.goods_id)'>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页-->
      <el-pagination
        @size-change='handleSizeChange'
        @current-change='handleCurrentChange'
        :current-page='queryInfo.pagenum'
        :page-sizes='[2, 5, 10, 15]'
        :page-size='queryInfo.pagesize'
        layout='total, sizes, prev, pager, next, jumper'
        :total='total'>
      </el-pagination>
    </el-card>

    <el-dialog :visible.sync='GoodsDialog'
               title='修改商品信息'
               width='50%'>
      <el-form ref='queryGoodsInfoRef' :model='queryGoodsInfo' label-width='70px'>
        <el-form-item label='商品名称' prop='goods_name'>
          <el-input v-model='queryGoodsInfo.goods_name' prefix-icon='el-icon-user-solid'></el-input>
        </el-form-item>
        <el-form-item label='价格' prop='goods_price'>
          <el-input v-model='queryGoodsInfo.goods_price' prefix-icon='el-icon-user-solid' type='number'></el-input>
        </el-form-item>
        <el-form-item label='数量' prop='goods_number'>
          <el-input v-model='queryGoodsInfo.goods_number' prefix-icon='el-icon-user-solid' type='number'></el-input>
        </el-form-item>
        <el-form-item label='重量' prop='goods_weight'>
          <el-input v-model='queryGoodsInfo.goods_weight' prefix-icon='el-icon-user-solid' type='number'></el-input>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
        <el-button @click='GoodsDialog = false'>取 消</el-button>
        <el-button type='primary' @click='modifyGoods'>确 定</el-button>
       </span>
    </el-dialog>
  </div>
</template>

<script>
import { _delGoods, _getGoods, _getGoodsInfo, _modifyGoods } from '../../network/goods'

export default {
  name: 'Goods',
  data () {
    return {
      goods: [],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      GoodsDialog: false,
      queryGoodsInfo: {}
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    getGoodsList () {
      _getGoods(this.queryInfo).then(res => {
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.goods = res.data.goods
        this.total = res.data.total
      })
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },

    //添加商品
    addGoods () {
      this.$router.push('/goods/addgoods')
    },

    //修改商品
    modifyGoodsDialog (id) {
      this.GoodsDialog = true
      _getGoodsInfo(id).then(res => {
        console.log(res)
        this.queryGoodsInfo = res.data
      })
    },
    modifyGoods () {
      this.$refs.queryGoodsInfoRef.validate(valid => {
        if (!valid) return
        _modifyGoods(this.queryGoodsInfo.goods_id, {
          goods_name: this.queryGoodsInfo.goods_name,
          goods_price: this.queryGoodsInfo.goods_price,
          goods_number: this.queryGoodsInfo.goods_number,
          goods_weight: this.queryGoodsInfo.goods_weight
        }).then(res => {
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg + '：此处接口文档有bug')
          this.$message.success('修改成功')
          this.getGoodsList()
        })
      })
    },

    //根据id删除商品
    delGoods (id) {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _delGoods(id).then(res => {
          if (res.meta.status !== 200) return this.$message.error('删除商品失败')
          this.$message.success('已删除该商品')
          this.getGoodsList()
        })
      }).catch(action => {
        this.$message({
          type: 'info',
          message: action === 'cancel'
            ? '已取消删除'
            : '停留在当前页面'
        })
      })
    }
  }
}
</script>

<style lang='less' scoped>

</style>

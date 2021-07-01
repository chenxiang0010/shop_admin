<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class='el-icon-arrow-right'>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片-->
    <el-card class='box-card'>
      <el-button type='primary' @click='addCateDialog'>添加分类</el-button>

      <tree-table style='margin-top: 15px' :data='category' :columns='columns' :selection-type='false'
                  :expand-type='false'
                  show-index index-text='#' border>
        <!--是否有效-->
        <template slot='isok' slot-scope='scope'>
          <i v-if='scope.row.cat_deleted === false' class='el-icon-success'
             style='color: lightgreen; font-size: 22px'></i>
          <i v-else class='el-icon-error' style='color: red; font-size: 22px'></i>
        </template>
        <!--排序-->
        <template slot='sort' slot-scope='scope'>
          <el-tag v-if='scope.row.cat_level === 0'>一级</el-tag>
          <el-tag type='success' v-else-if='scope.row.cat_level === 1 '>二级</el-tag>
          <el-tag type='danger' v-else>三级</el-tag>
        </template>
        <!--操作按钮-->
        <template slot='set' slot-scope='scope'>
          <el-button type='primary' icon='el-icon-edit' size='mini' @click='modifyCateDialog(scope.row.cat_id)'>编辑
          </el-button>
          <el-button type='danger' icon='el-icon-delete' size='mini' @click='deleteCate(scope.row.cat_id)'>删除
          </el-button>
        </template>

      </tree-table>

      <!--分页-->
      <el-pagination
        @size-change=' handleSizeChange'
        @current-change='handleCurrentChange'
        :current-page='queryCategory.pagenum'
        :page-sizes='[5,10]'
        :page-size='queryCategory.pagesize'
        layout='total, sizes, prev, pager, next, jumper'
        :total='total'>
      </el-pagination>
    </el-card>

    <!--添加分类-->
    <el-dialog
      title='添加分类'
      :visible.sync='addCateDialogVisible'
      width='50%'
      @close='addCateDialogClose'>
      <el-form label-width='90px' :model='addCateForm' ref='addCateRef'>
        <el-form-item label='分类名称' prop='cat_name'>
          <el-input v-model='addCateForm.cat_name' prefix-icon='el-icon-phone'></el-input>
        </el-form-item>
        <el-form-item label='分类层级' prop='cat_level'>
          <el-cascader style='width: 100%' clearable :props='cascaderProps' v-model='selectedKeys'
                       :options='parentCateList' @change='parentCateChanged'></el-cascader>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
        <el-button @click='addCateDialogVisible = false'>取 消</el-button>
        <el-button type='primary' @click='addCate'>确 定</el-button>
       </span>
    </el-dialog>

    <!--修改分类-->
    <el-dialog title='编辑分类'
               :visible.sync='modifyCateDialogVisible'
               width='50%'
               @close='modifyCateDialogClose'>
      <el-form label-width='90px' :model='queryCateForm' ref='modifyCateRef'>
        <el-form-item label='编辑分类' prop='cat_name'>
          <el-input v-model='queryCateForm.cat_name' prefix-icon='el-icon-phone'></el-input>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
        <el-button @click='modifyCateDialogVisible = false'>取 消</el-button>
        <el-button type='primary' @click='modifyCate'>确 定</el-button>
       </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  _addCate,
  _deleteCate,
  _getCategoryList,
  _getCateInfo,
  _getModifyCateInfo,
  _modifyCate
} from '@/network/categories'

export default {
  name: 'Categories',
  data () {
    return {
      queryCategory: {
        type: '',
        pagenum: 1,
        pagesize: 5
      },
      category: [],
      total: 0,
      columns: [
        { label: '分类名称', prop: 'cat_name' },
        { label: '是否有效', type: 'template', template: 'isok' },
        { label: '排序', type: 'template', template: 'sort' },
        { label: '操作', type: 'template', template: 'set' }
      ],
      addCateDialogVisible: false,
      modifyCateDialogVisible: false,
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      parentCateList: [],
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedKeys: [],
      queryCateForm: {}
    }
  },
  created () {
    this.getCategoryList()
  },
  methods: {
    //获取分类列表
    getCategoryList () {
      _getCategoryList(this.queryCategory).then(res => {
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.category = res.data.result
        this.total = res.data.total
      })
    },
    handleSizeChange (newSize) {
      this.queryCategory.pagesize = newSize
      this.getCategoryList()
    },
    handleCurrentChange (newPage) {
      this.queryCategory.pagenum = newPage
      this.getCategoryList()
    },

    //添加分类
    addCateDialog () {
      _getCateInfo({ type: 2 }).then(res => {
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.parentCateList = res.data
        this.addCateDialogVisible = true
      })
    },
    parentCateChanged () {
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    addCate () {
      this.$refs.addCateRef.validate(async valid => {
        if (!valid) return
        _addCate(this.addCateForm).then(res => {
          if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
          this.$message.success('创建分类成功')
          this.getCategoryList()
          this.addCateDialogVisible = false
        })
      })
    },
    addCateDialogClose () {
      this.$refs.addCateRef.resetFields()
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
      this.selectedKeys = []
    },

    //修改商品分类
    modifyCateDialog (id) {
      _getModifyCateInfo(id).then(res => {
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.queryCateForm = res.data
        this.modifyCateDialogVisible = true
      })
    },
    modifyCate () {
      this.$refs.modifyCateRef.validate(validate => {
        if (!validate) return
        console.log(this.queryCateForm)
        _modifyCate(this.queryCateForm.cat_id, { cat_name: this.queryCateForm.cat_name }).then(res => {
          console.log(this.queryCateForm.cat_name)
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          this.$message.success('修改成功')
          this.getCategoryList()
          this.modifyCateDialogVisible = false
        })
      })
    },
    modifyCateDialogClose () {
      this.$refs.modifyCateRef.resetFields()
    },
    //删除分类
    deleteCate (id) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _deleteCate(id).then(res => {
          if (res.meta.status !== 200) return this.$message.error('删除分类失败')
          this.$message.success('已删除该分类')
          this.getCategoryList()
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

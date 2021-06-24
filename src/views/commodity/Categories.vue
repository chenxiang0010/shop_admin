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
    <el-dialog title='编辑分类' :visible.sync='modifyCateDialogVisible' width='50%' @close='modifyCateDialogClose'>
      <el-form label-width='90px' ref='modifyCateRef'>
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
    async getCategoryList () {
      const { data: res } = await this.$http.get(`categories`, { params: this.queryCategory })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.category = res.data.result
      this.total = res.data.total
    },
    handleSizeChange (newSize) {
      this.queryCategory.pagesize = newSize
      this.getCategoryList()
    },
    handleCurrentChange (newPage) {
      this.queryCategory.pagenum = newPage
      this.getCategoryList()
    },
    async addCateDialog () {
      const { data: res } = await this.$http.get(`categories`, { params: { type: 2 } })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.parentCateList = res.data
      this.addCateDialogVisible = true
    },
    addCateDialogClose () {
      this.$refs.addCateRef.resetFields()
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
      this.selectedKeys = []
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
        const { data: res } = await this.$http.post(`categories`, this.addCateForm)
        console.log(res)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success('创建分类成功')
        await this.getCategoryList()
        this.addCateDialogVisible = false
      })
    },
    //修改商品分类
    async modifyCateDialog (id) {
      const { data: res } = await this.$http.get(`categories/` + id)
      console.log(res)
      this.queryCateForm = res.data
      this.modifyCateDialogVisible = true
    },
    async modifyCate () {
      const { data: res } = await this.$http.put(`categories/` + this.queryCateForm.cat_id, { cat_name: this.queryCateForm.cat_name })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success('修改成功')
      await this.getCategoryList()
      this.modifyCateDialogVisible = false
    },
    modifyCateDialogClose () {
      this.$refs.modifyCateRef.resetFields()
    },
    //删除分类
    async deleteCate (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete(`categories/` + id)
      if (res.meta.status !== 200) return this.$message.error('删除分类失败')
      this.$message.success('已删除该分类')
      await this.getCategoryList()
    }
  }
}
</script>

<style lang='less' scoped>

</style>

<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class='el-icon-arrow-right'>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片-->
    <el-card>
      <!--警告条-->
      <el-alert
        title='注意：只允许为第三级分类设置相关参数！'
        type='warning'
        show-icon
        :closable='false'>
      </el-alert>
      <!--文字-->
      <el-row style='margin: 15px 0'>
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model='selectedCateKeys'
            :options='categoryList'
            :props='cateProps'
            @change='handleChange'></el-cascader>
        </el-col>
      </el-row>
      <!--tabs标签-->
      <el-tabs v-model='activeName' @tab-click='handleTabClick'>
        <el-tab-pane label='动态参数' name='many'>
          <el-button type='primary' :disabled='this.selectedCateKeys.length!==3'
                     @click='addValueDialogVisible=true'>添加参数
          </el-button>
          <el-table :data='manyData' stripe border>
            <el-table-column type='expand'>
              <template slot-scope='scope'>
                <el-tag closable v-for='(item,index) in scope.row.attr_vals' :key='index'
                        @close='handleClose(index,scope.row)'>{{ item }}
                </el-tag>
                <el-input
                  class='input-new-tag'
                  v-if='scope.row.inputVisible'
                  v-model='scope.row.inputValue'
                  ref='saveTagInput'
                  size='small'
                  @keyup.enter.native='handleInputConfirm(scope.row)'
                  @blur='handleInputConfirm(scope.row)'
                >
                </el-input>
                <el-button v-else class='button-new-tag' size='small' @click='showInput(scope.row)'>+ New Tag
                </el-button>
              </template>
            </el-table-column>
            <el-table-column label='#' type='index'></el-table-column>
            <el-table-column label='参数名称' prop='attr_name'></el-table-column>
            <el-table-column label='操作'>
              <template slot-scope='scope'>
                <el-button type='primary' icon='el-icon-edit' size='mini' @click='modifyValueDialog(scope.row.attr_id)'>
                  编辑
                </el-button>
                <el-button type='danger' icon='el-icon-delete' size='mini' @click='deleteParams(scope.row.attr_id)'>删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label='静态属性' name='only'>
          <el-button type='primary' :disabled='this.selectedCateKeys.length!==3'
                     @click='addValueDialogVisible=true'>添加属性
          </el-button>
          <el-table :data='onlyData' stripe border>
            <el-table-column type='expand'>
              <template slot-scope='scope'>
                <el-tag closable v-for='(item,index) in scope.row.attr_vals' :key='index'
                        @close='handleClose(index,scope.row)'>{{ item }}
                </el-tag>
                <el-input
                  class='input-new-tag'
                  v-if='scope.row.inputVisible'
                  v-model='scope.row.inputValue'
                  ref='saveTagInput'
                  size='small'
                  @keyup.enter.native='handleInputConfirm(scope.row)'
                  @blur='handleInputConfirm(scope.row)'
                >
                </el-input>
                <el-button v-else class='button-new-tag' size='small' @click='showInput(scope.row)'>+ New Tag
                </el-button>
              </template>
            </el-table-column>
            <el-table-column label='#' type='index'></el-table-column>
            <el-table-column label='参数名称' prop='attr_name'></el-table-column>
            <el-table-column label='操作'>
              <template slot-scope='scope'>
                <el-button type='primary' icon='el-icon-edit' size='mini' @click='modifyValueDialog(scope.row.attr_id)'>
                  编辑
                </el-button>
                <el-button type='danger' icon='el-icon-delete' size='mini' @click='deleteParams(scope.row.attr_id)'>删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!--添加属性-->
    <el-dialog
      :title="'添加'+titleText"
      :visible.sync='addValueDialogVisible'
      width='50%'
      @close='addValueDialogClose'>
      <el-form label-width='70px' :model='addValueForm' ref='addValueRef'>
        <el-form-item :label='titleText' prop='attr_name'>
          <el-input v-model='addValueForm.attr_name' prefix-icon='el-icon-phone'></el-input>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
    <el-button @click='addValueDialogVisible = false'>取 消</el-button>
    <el-button type='primary' @click='addValue'>确 定</el-button>
  </span>
    </el-dialog>

    <!--修改属性-->
    <el-dialog
      :title="'添加'+titleText"
      :visible.sync='modifyValueDialogVisible'
      width='50%'
      @close='modifyValueDialogClose'>
      <el-form label-width='70px' :model='queryData' ref='modifyValueRef'>
        <el-form-item :label='titleText' prop='attr_name'>
          <el-input v-model='queryData.attr_name' prefix-icon='el-icon-phone'></el-input>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
    <el-button @click='modifyValueDialogVisible = false'>取 消</el-button>
    <el-button type='primary' @click='modifyValue'>确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import { _getCategoryList } from '@/network/categories'
import { _getParams, _addValue, _getValue, _modifyValue, _delParams } from '@/network/params'

export default {
  name: 'Params',
  data () {
    return {
      categoryList: [],
      selectedCateKeys: [],
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      activeName: 'many',
      manyData: [],
      onlyData: [],
      addValueDialogVisible: false,
      modifyValueDialogVisible: false,
      addValueForm: {
        attr_name: '',
        attr_sel: '',
        attr_vals: ''
      },
      queryData: {}
    }
  },
  created () {
    this.getCategoryList()
  },
  computed: {
    cateId () {
      if (this.selectedCateKeys.length === 3) return this.selectedCateKeys[2]
      return null
    },
    titleText () {
      if (this.activeName === 'many') return '动态参数'
      return '静态属性'
    }
  },
  methods: {
    getCategoryList () {
      _getCategoryList().then(res => {
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.categoryList = res.data
      })
    },
    handleChange () {
      if (this.selectedCateKeys.length !== 3) {
        this.$message.warning('只能设置三级分类！')
        this.selectedCateKeys = []
        this.manyData = []
        this.onlyData = []
        return
      }
      this.getParams()
    },
    handleTabClick () {
      if (this.selectedCateKeys.length === 0) {
        this.$message.warning('请选择商品分类！')
        return this.selectedCateKeys = []
      }
      this.getParams()
    },

    getParams () {
      _getParams(this.cateId, { sel: this.activeName }).then(res => {
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        res.data.forEach(item => {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
            item.inputVisible = false
            item.inputValue = ''
          }
        )
        if (this.activeName === 'many') {
          this.manyData = res.data
        } else {
          this.onlyData = res.data
        }
      })
    },

    //添加属性
    addValue () {
      _addValue(this.cateId, {
        attr_name: this.addValueForm.attr_name,
        attr_sel: this.activeName
      }).then(res => {
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success('添加' + this.titleText + '成功')
        this.getParams()
        this.addValueDialogVisible = false
      })
    },
    addValueDialogClose () {
      this.$refs.addValueRef.resetFields()
    },

    //修改之前需要获取属性参数
    modifyValueDialog (attrId) {
      _getValue(this.cateId, attrId, { attr_sel: this.activeName }).then(res => {
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.queryData = res.data
        this.modifyValueDialogVisible = true
      })
    },
    modifyValue () {
      _modifyValue(this.cateId, this.queryData.attr_id, {
        attr_name: this.queryData.attr_name,
        attr_sel: this.activeName
      }).then(res => {
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success('修改' + this.titleText + '成功')
        this.getParams()
        this.modifyValueDialogVisible = false
      })
    },
    modifyValueDialogClose () {
      this.$refs.modifyValueRef.resetFields()
    },

    //根据id删除属性
    deleteParams (id) {
      this.$confirm('此操作将永久删除该' + this.titleText + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _delParams(this.cateId, id).then(res => {
          if (res.meta.status !== 200) return this.$message.error('删除' + this.titleText + '失败')
          this.$message.success('已删除该' + this.titleText)
          this.getParams()
        })
      }).catch(action => {
        this.$message({
          type: 'info',
          message: action === 'cancel'
            ? '已取消删除'
            : '停留在当前页面'
        })
      })
    },
    handleInputConfirm (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.saveValue(row)
    },
    showInput (row) {
      row.inputVisible = true
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    saveValue (row) {
      _modifyValue(this.cateId, row.attr_id, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(',')
      }).then(res => {
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success('添加成功')
        this.getParams()
      })
    },
    handleClose (index, row) {
      row.attr_vals.splice(index, 1)
      this.saveValue(row)
    }
  }
}
</script>

<style lang='less' scoped>
.el-tag {
  margin: 5px;
}

.input-new-tag {
  width: 120px
}
</style>

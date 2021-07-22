../..
<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class='el-icon-arrow-right'>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card>
      <el-alert
        title='添加商品信息'
        type='info'
        show-icon
        :closable='false'
        center>
      </el-alert>
      <el-steps :active='activeIndex-0' finish-status='success' align-center>
        <el-step title='基本信息'></el-step>
        <el-step title='商品参数'></el-step>
        <el-step title='商品属性'></el-step>
        <el-step title='商品图片'></el-step>
        <el-step title='商品内容'></el-step>
        <el-step title='完成'></el-step>
      </el-steps>
      <el-form :model='addForm' :rules='addRules' ref='addFormRef' label-width='100px' label-position='top'>
        <el-tabs tab-position='left' v-model='activeIndex' :before-leave='bfHandle' @tab-click='tabClick'>
          <el-tab-pane label='基本信息' name='0'>
            <el-form-item label='活动名称' prop='goods_name'>
              <el-input v-model='addForm.goods_name'></el-input>
            </el-form-item>
            <el-form-item label='商品价格' prop='goods_price'>
              <el-input v-model='addForm.goods_price' type='number'></el-input>
            </el-form-item>
            <el-form-item label='商品重量' prop='goods_weight'>
              <el-input v-model='addForm.goods_weight' type='number'></el-input>
            </el-form-item>
            <el-form-item label='商品数量' prop='goods_number'>
              <el-input v-model='addForm.goods_number' type='number'></el-input>
            </el-form-item>
            <el-form-item label='商品分类' prop='goods_number'>
              <span>选择商品分类：</span>
              <el-cascader
                v-model='addForm.goods_cat'
                :options='categoryList'
                :props='cateProps'
                @change='handleChange'>
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label='商品参数' name='1'>
            <el-form-item :label='item.attr_name' v-for='item in manyTable' :key='item.attr_id'>
              <el-checkbox-group v-model='item.attr_vals'>
                <el-checkbox border :label='list' v-for='(list,i) in item.attr_vals' :key='i'></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label='商品属性' name='2'>
            <el-form-item :label='item.attr_name' v-for='item in onlyTable' :key='item.attr_id'>
              <el-input v-model='item.attr_vals.toString()'></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label='商品图片' name='3'>
            <el-upload
              class='upload-demo'
              :action='upLoadUrl'
              :on-preview='handlePreview'
              :on-remove='handleRemove'
              :on-success='handleSuccess'
              list-type='picture'
              :headers='sToken'>
              <el-button size='small' type='primary'>点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label='商品内容' name='4'>
            <quill-editor v-model='addForm.goods_introduce'>
            </quill-editor>
            <el-button type='primary' style='margin-top: 15px;' @click='addGoods'>添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!--图片预览-->
    <el-dialog
      title='图片预览'
      :visible.sync='dialogVisible'
      width='50%'
      :before-close='handleClose'>
      <img :src='previewPath' alt='' style='width: 100%'>
    </el-dialog>
  </div>
</template>

<script>
import { _getCategoryList } from '../../network/categories'
import { _addGoods } from '../../network/goods'
import { _getParams } from '../../network/params'
import _ from 'lodash'

export default {
  name: 'AddGoods',
  data() {
    return {
      activeIndex: '0',
      addForm: {
        goods_name: '',
        goods_cat: [],
        goods_price: 0,
        goods_number: 1,
        goods_weight: 0,
        goods_introduce: '',
        pics: [],
        attrs: []
      },
      addRules: {},
      categoryList: [],
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      manyTable: [],
      onlyTable: [],
      upLoadUrl: 'https://test.qhhz.xyz:8888/api/private/v1/upload',
      sToken: { Authorization: window.sessionStorage.getItem('token') },
      dialogVisible: false,
      previewPath: ''
    }
  },
  created() {
    this.getCategoryList()
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) return this.addForm.goods_cat[2]
      return null
    }
  },
  methods: {
    getCategoryList() {
      _getCategoryList().then(res => {
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.categoryList = res.data
      })
    },
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.$message.warning('只能设置三级分类！')
        this.addForm.goods_cat = []
      }
    },
    bfHandle(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.warning('参数未填写完整')
        return false
      }
    },
    tabClick() {
      if (this.activeIndex === '1') {
        //console.log(this.addForm.goods_cat[2] === this.cateId)
        _getParams(this.cateId, { sel: 'many' }).then(res => {
          res.data.forEach(item => {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
          })
          this.manyTable = res.data
        })
      } else if (this.activeIndex === '2') {
        _getParams(this.cateId, { sel: 'only' }).then(res => {
          res.data.forEach(item => {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
          })
          this.onlyTable = res.data
        })
      }
    },
    handlePreview(file) {
      this.dialogVisible = true
      this.previewPath = file.response.data.url
    },
    handleClose() {
      this.dialogVisible = false
    },
    handleRemove(file) {
      const filePath = file.response.data.tmp_path
      const i = this.addForm.pics.find(x => {
        x.pic = filePath
      })
      this.addForm.pics.splice(i, 1)
    },
    handleSuccess(res) {
      const picInfo = { pic: res.data.tmp_path }
      this.addForm.pics.push(picInfo)
    },
    addGoods() {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) return thid.$message.error('请填写必要的表单项')
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.toString()
        this.manyTable.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.toString()
          }
          this.addForm.attrs.push(newInfo)
        })
        this.onlyTable.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.toString()
          }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        _addGoods(form).then(res => {
          if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
          this.$message.success('创建商品成功')
          this.$router.push('/goods')
        })

      })
    }
  }
}
</script>

<style lang='less' scoped>
.el-steps {
  margin-top: 20px;
}

.el-checkbox {
  margin: 0 5px 0 0;
}
</style>

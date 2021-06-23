<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class='el-icon-arrow-right'>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片-->
    <el-card class='box-card'>
      <el-row :gutter='20'>
        <el-col :span='8'>
          <el-input placeholder='请输入内容' v-model='queryInfo.query' clearable @clear='getUserList'>
            <el-button slot='append' icon='el-icon-search' @click='getUserList'></el-button>
          </el-input>
        </el-col>
        <el-col :span='4'>
          <el-button type='primary' @click='addUserDialogVisible=true'>添加用户</el-button>
        </el-col>
      </el-row>

      <el-table :data='users' stripe border>
        <el-table-column label='#' type='index'></el-table-column>
        <el-table-column label='姓名' prop='username'></el-table-column>
        <el-table-column label='邮箱' prop='email'></el-table-column>
        <el-table-column label='电话' prop='mobile'></el-table-column>
        <el-table-column label='角色' prop='role_name'></el-table-column>
        <el-table-column label='状态'>
          <!--作用域插槽-->
          <template slot-scope='scope'>
            <el-switch v-model='scope.row.mg_state' @change='userStateChanged(scope.row)'></el-switch>
          </template>
        </el-table-column>
        <el-table-column label='操作' width='180px'>
          <template slot-scope='scope'>
            <el-button type='primary' icon='el-icon-edit' size='mini'
                       @click='reviseUserDialog(scope.row.id)'></el-button>
            <el-button type='danger' icon='el-icon-delete' size='mini' @click='deleteUser(scope.row.id)'></el-button>
            <el-tooltip effect='dark' content='分配角色' placement='top' :enterable='false'>
              <el-button type='warning' icon='el-icon-setting' size='mini'></el-button>
            </el-tooltip>
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
    <!--添加用户-->
    <el-dialog
      title='添加用户'
      :visible.sync='addUserDialogVisible'
      width='50%'
      @close='addUserDialogClose'>
      <el-form label-width='70px' :model='addForm' :rules='addFormRules' ref='addFormRef'>
        <el-form-item label='用户名' prop='username'>
          <el-input v-model='addForm.username' prefix-icon='el-icon-phone'></el-input>
        </el-form-item>
        <el-form-item label='密码' prop='password'>
          <el-input v-model='addForm.password' prefix-icon='el-icon-s-goods'></el-input>
        </el-form-item>
        <el-form-item label='邮箱' prop='email'>
          <el-input v-model='addForm.email' prefix-icon='el-icon-s-goods'></el-input>
        </el-form-item>
        <el-form-item label='手机号' prop='mobile'>
          <el-input v-model='addForm.mobile' prefix-icon='el-icon-s-goods'></el-input>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
        <el-button @click='addUserDialogVisible = false'>取 消</el-button>
        <el-button type='primary' @click='addUser'>确 定</el-button>
       </span>
    </el-dialog>
    <!--修改用户信息-->
    <el-dialog title='修改用户信息'
               :visible.sync='reviseUserDialogVisible'
               width='50%'
               @close='reviseUserDialogClose'>
      <el-form label-width='70px' :model='queryUserInfo' :rules='addFormRules' ref='queryUserInfoRef'>
        <el-form-item label='用户名' prop='username'>
          <el-input v-model='queryUserInfo.username' prefix-icon='el-icon-phone' disabled></el-input>
        </el-form-item>
        <el-form-item label='邮箱' prop='email'>
          <el-input v-model='queryUserInfo.email' prefix-icon='el-icon-s-goods'></el-input>
        </el-form-item>
        <el-form-item label='手机号' prop='mobile'>
          <el-input v-model='queryUserInfo.mobile' prefix-icon='el-icon-s-goods'></el-input>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
        <el-button @click='reviseUserDialogVisible = false'>取 消</el-button>
        <el-button type='primary' @click='reviseUser'>确 定</el-button>
       </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Users',
  data() {
    // 自定义邮箱规则
    let checkEmail = (rule, value, callback) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/
      if (regEmail.test(value)) {
        // 合法邮箱
        return callback()
      }
      callback(new Error('请输入合法邮箱'))
    }
    // 自定义手机号规则
    let checkMobile = (rule, value, callback) => {
      const regMobile = /^1[34578]\d{9}$/
      if (regMobile.test(value)) {
        return callback()
      }
      // 返回一个错误提示
      callback(new Error('请输入合法的手机号码'))
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
        //  这里的数字不能加引号F
      },
      users: [],
      total: 0,
      // 控制对话框显示
      addUserDialogVisible: false,
      reviseUserDialogVisible: false,
      queryUserInfo: {},
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名长度在3到10位', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '密码长度在6到18位', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.users = res.data.users
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    //修改用户状态
    async userStateChanged(userInfo) {
      const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('修改用户状态失败')
      }
      this.$message.success('更新用户状态成功')
    },
    //重置dialog
    addUserDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    reviseUserDialogClose() {
      this.$refs.queryUserInfoRef.resetFields()
    },
    //添加用户
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201 || res.meta.status == 400) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success('添加用户成功')
        this.addUserDialogVisible = false
        await this.getUserList()
      })
    },
    //修改用户
    async reviseUserDialog(id) {
      this.reviseUserDialogVisible = true
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.queryUserInfo = res.data
      console.log(res)
    },
    reviseUser() {
      this.$refs.queryUserInfoRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`users/` + this.queryUserInfo.id, {
          email: this.queryUserInfo.email,
          mobile: this.queryUserInfo.mobile
        })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success('修改成功')
        this.reviseUserDialogVisible = false
        await this.getUserList()
      })
    },
    //根据id删除用户
    async deleteUser(id) {
      const confirmResult = await this.$confirm('此操作将删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')

      const { data: res } = await this.$http.delete(`users/` + id)
      if (res.meta.status !== 200) return this.$message.error('删除用户失败')
      this.$message.success('已删除该用户')
      await this.getUserList()

    }
  }
}
</script>

<style lang='less' scoped>

</style>

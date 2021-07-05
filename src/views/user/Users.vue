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
            <el-switch v-model='scope.row.mg_state' @change='modifyUserState(scope.row)'></el-switch>
          </template>
        </el-table-column>
        <el-table-column label='操作' width='180px'>
          <template slot-scope='scope'>
            <el-button type='primary' icon='el-icon-edit' size='mini'
                       @click='modifyUserDialog(scope.row.id)'></el-button>
            <el-button type='danger' icon='el-icon-delete' size='mini' @click='deleteUser(scope.row.id)'></el-button>
            <el-tooltip effect='dark' content='分配角色' placement='top' :enterable='false'>
              <el-button type='warning' icon='el-icon-setting' size='mini'
                         @click='setRoleDialog(scope.row)'></el-button>
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
               :visible.sync='modifyUserDialogVisible'
               width='50%'
               @close='modifyUserDialogClose'>
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
        <el-button @click='modifyUserDialogVisible = false'>取 消</el-button>
        <el-button type='primary' @click='modifyUser'>确 定</el-button>
       </span>
    </el-dialog>

    <!--分配角色-->
    <el-dialog title='分配角色'
               :visible.sync='setRoleDialogVisible'
               width='50%'
               @close='setRoleClose'>
      <div>
        <p>当前的用户：{{ userInfo.username }}</p>
        <!--suppress JSUnresolvedVariable -->
        <p>当前的角色：{{ userInfo.role_name }}</p>
        <p>分配新角色：
          <el-select v-model='selectedId' placeholder='请选择'>
            <el-option
              v-for='item in rolesList'
              :key='item.id'
              :label='item.roleName'
              :value='item.id'>
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot='footer' class='dialog-footer'>
        <el-button @click='setRoleDialogVisible = false'>取 消</el-button>
        <el-button type='primary' @click='setRole()'>确 定</el-button>
       </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  _userList,
  _getUserInfo,
  _modifyUserInfo,
  _modifyUserState,
  _addUser,
  _delUser,
  _getUserRole,
  _setUserRole
} from '@/network/user'

export default {
  name: 'Users',
  data () {
    // 自定义邮箱规则
    let checkEmail = (rule, value, callback) => {
      const regEmail = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
      if (regEmail.test(value)) {
        // 合法邮箱
        return callback()
      }
      callback(new Error('请输入合法邮箱'))
    }
    // 自定义手机号规则
    let checkMobile = (rule, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return callback()
      }
      // 返回一个错误提示
      callback(new Error('请输入合法的手机号码'))
    }
    return {
      //获取用户数据列表参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
        //这里的数字不能加引号
      },
      //用户数据列表
      users: [],
      //总页数
      total: 0,
      //添加用户对话框显示与关闭
      addUserDialogVisible: false,
      //修改用户对话框显示与关闭
      modifyUserDialogVisible: false,
      //分配角色对话框显示与关闭
      setRoleDialogVisible: false,
      //查询用户信息数据
      queryUserInfo: {},
      //添加用户数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      //添加用户验证规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名长度应为3~11个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '密码长度应为6~18个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      userInfo: {},
      //所有角色列表
      rolesList: {},
      //已选择角色id
      selectedId: ''
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    //获取用户列表
    getUserList () {
      _userList(this.queryInfo).then(res => {
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.users = res.data.users
        this.total = res.data.total
      })
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },

    //修改用户状态
    modifyUserState (userInfo) {
      _modifyUserState(userInfo).then(res => {
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success('更新用户状态成功')
      })
    },

    //添加用户以及对话框重置
    addUser () {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) return
        _addUser(this.addForm).then(res => {
          if (res.meta.status !== 201) {
            return this.$message.error(res.data.meta.msg)
          }
          this.$message.success('添加用户成功')
          this.addUserDialogVisible = false
          this.getUserList()
        })
      })
    },
    addUserDialogClose () {
      this.$refs.addFormRef.resetFields()
    },

    //修改用户信息、对话框信息获取以及对话框重置
    modifyUserDialog (id) {
      this.modifyUserDialogVisible = true
      _getUserInfo(id).then(res => {
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success('获取用户信息成功')
        this.queryUserInfo = res.data
      })
    },
    modifyUser () {
      this.$refs.queryUserInfoRef.validate(valid => {
        if (!valid) return
        _modifyUserInfo(this.queryUserInfo.id, {
          email: this.queryUserInfo.email,
          mobile: this.queryUserInfo.mobile
        }).then(res => {
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          this.$message.success('修改用户信息成功')
          this.getUserList()
        })

        this.modifyUserDialogVisible = false
        this.getUserList()
      })
    },
    modifyUserDialogClose () {
      this.$refs.queryUserInfoRef.resetFields()
    },

    //根据id删除用户
    deleteUser (id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _delUser(id).then(res => {
          if (res.meta.status !== 200) return this.$message.error('删除用户失败')
          this.$message.success('已删除该用户')
          this.getUserList()
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

    //分配角色
    setRoleDialog (userInfo) {
      this.userInfo = userInfo
      _getUserRole().then(res => {
        this.rolesList = res.data
        this.setRoleDialogVisible = true
      })
    },
    setRole () {
      if (!this.selectedId) {
        return this.$message.error('请选择要分配的角色')
      }
      _setUserRole(this.userInfo.id, { rid: this.selectedId }).then(res => {
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success('分配角色成功')
        this.getUserList()
        this.setRoleDialogVisible = false
      })
    },
    setRoleClose () {
      this.selectedId = ''
      this.userInfo = {}
    }
  }
}
</script>

<style lang='less' scoped>

</style>

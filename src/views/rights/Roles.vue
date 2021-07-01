<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class='el-icon-arrow-right'>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片-->
    <el-card class='box-card'>
      <el-button type='primary' @click='addRolesDialogVisible=true'>添加角色</el-button>
      <el-table :data='roles' stripe border>
        <el-table-column type='expand'>
          <template slot-scope='scope'>
            <el-row :class="['bdbottom',i1===0?'bdtop':'']" v-for='(item1,i1) in scope.row.children' :key='item1.id'>
              <el-col :span='5'>
                <el-tag closable @close='deleteRights(scope.row,item1.id)'>{{ item1.authName }}</el-tag>
                <i class='el-icon-caret-right'></i>
              </el-col>
              <el-col :span='19'>
                <el-row :class='{bdtop:i2!==0}' v-for='(item2,i2) in item1.children' :key=item2.id>
                  <el-col :span='6'>
                    <el-tag closable @close='deleteRights(scope.row,item2.id)' type='success'>{{ item2.authName }}
                    </el-tag>
                    <i class='el-icon-caret-right'></i>
                  </el-col>
                  <el-col :span='18'>
                    <el-tag closable @close='deleteRights(scope.row,item3.id)' type='warning'
                            v-for='item3 in item2.children'
                            :key='item3.id'>
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label='#' type='index'></el-table-column>
        <el-table-column label='角色名称' prop='roleName'></el-table-column>
        <el-table-column label='角色描述' prop='roleDesc'></el-table-column>
        <el-table-column label='操作' width='300px'>
          <template slot-scope='scope'>
            <el-button type='primary' icon='el-icon-edit' size='mini' @click='modifyRolesDialog(scope.row.id)'>编辑
            </el-button>
            <el-button type='danger' icon='el-icon-delete' size='mini' @click='deleteRoles(scope.row.id)'>删除</el-button>
            <el-button type='warning' icon='el-icon-setting' size='mini' @click='setRightsDialog(scope.row)'>分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!--添加角色-->
    <el-dialog
      title='添加角色'
      :visible.sync='addRolesDialogVisible'
      width='50%'
      @close='addRolesDialogClose'>
      <el-form label-width='70px' :model='addRolesForm' :rules='addRolesRules' ref='addRolesRef'>
        <el-form-item label='角色名称' prop='roleName'>
          <el-input v-model='addRolesForm.roleName' prefix-icon='el-icon-phone'></el-input>
        </el-form-item>
        <el-form-item label='角色描述' prop='roleDesc'>
          <el-input v-model='addRolesForm.roleDesc' prefix-icon='el-icon-s-goods'></el-input>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
        <el-button @click='addRolesDialogVisible = false'>取 消</el-button>
        <el-button type='primary' @click='addRoles'>确 定</el-button>
       </span>
    </el-dialog>

    <!--修改用户信息-->
    <el-dialog title='修改角色信息'
               :visible.sync='modifyRolesDialogVisible'
               width='50%'
               @close='modifyRolesDialogClose'>
      <el-form label-width='70px' :model='queryRolesInfo' :rules='addRolesRules' ref='queryRolesInfoRef'>
        <el-form-item label='角色名称' prop='roleName'>
          <el-input v-model='queryRolesInfo.roleName' prefix-icon='el-icon-phone'></el-input>
        </el-form-item>
        <el-form-item label='角色描述' prop='roleDesc'>
          <el-input v-model='queryRolesInfo.roleDesc' prefix-icon='el-icon-s-goods'></el-input>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
        <el-button @click='modifyRolesDialogVisible = false'>取 消</el-button>
        <el-button type='primary' @click='modifyRoles'>确 定</el-button>
       </span>
    </el-dialog>

    <!--分配权限-->
    <el-dialog title='分配权限'
               :visible.sync='setRightsDialogVisible'
               width='50%'
               @close='rightsClosed'>
      <el-tree :data='rightsList' :props='treeProps' show-checkbox node-key='id'
               :default-checked-keys='defKeys' ref='treeRef'></el-tree>

      <span slot='footer' class='dialog-footer'>
        <el-button @click='setRightsDialogVisible = false'>取 消</el-button>
        <el-button type='primary' @click='setRights'>确 定</el-button>
       </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  _getRoleList,
  _addRole,
  _getRoleInfo,
  _modifyRoleInfo,
  _delRole,
  _getUserRight,
  _setUserRight, _delRight
} from '@/network/roles'

export default {
  name: 'Roles',
  data () {
    return {
      roles: [],
      rightsList: [],
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      defKeys: [],
      roleId: '',
      addRolesDialogVisible: false,
      modifyRolesDialogVisible: false,
      setRightsDialogVisible: false,
      addRolesForm: {
        roleName: '',
        roleDesc: ''
      },
      addRolesRules: {
        roleName: [
          { message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名长度在3到10位', trigger: 'blur' }
        ]
      },
      queryRolesInfo: {}
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    //获取角色列表
    getRolesList () {
      _getRoleList().then(res => {
        this.roles = res.data
      })
    },

    //添加角色
    addRoles () {
      this.$refs.addRolesRef.validate(valid => {
        if (!valid) return
        _addRole(this.addRolesForm).then(res => {
          if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
          this.$message.success('添加角色成功')
          this.addRolesDialogVisible = false
          this.getRolesList()
        })
      })
    },
    addRolesDialogClose () {
      this.$refs.addRolesRef.resetFields()
    },

    //修改角色信息
    async modifyRolesDialog (id) {
      this.modifyRolesDialogVisible = true
      _getRoleInfo(id).then(res => {
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.queryRolesInfo = res.data
      })
    },
    modifyRoles () {
      this.$refs.queryRolesInfoRef.validate(valid => {
        if (!valid) return
        _modifyRoleInfo(this.queryRolesInfo.roleId, {
          roleName: this.queryRolesInfo.roleName,
          roleDesc: this.queryRolesInfo.roleDesc
        }).then(res => {
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          this.$message.success('修改成功')
          this.modifyRolesDialogVisible = false
          this.getRolesList()
        })
      })
    },
    modifyRolesDialogClose () {
      this.$refs.queryRolesInfoRef.resetFields()
    },

    //根据id删除角色
    deleteRoles (id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '已删除角色'
        })
        _delRole(id).then(res => {
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          this.getRolesList()
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

    //分配权限
    setRightsDialog (role) {
      this.roleId = role.id
      _getUserRight(role).then(res => {
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.rightsList = res.data
        this.getDefKeys(role, this.defKeys)
        this.setRightsDialogVisible = true
      })
    },
    getDefKeys (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      //递归调用，不懂
      node.children.forEach(item => this.getDefKeys(item, arr))
    },
    rightsClosed () {
      //重置数组
      this.defKeys = []
    },
    setRights () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idArr = keys.join(',')
      _setUserRight(this.roleId, { rids: idArr }).then(res => {
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success('分配权限成功')
        this.getRolesList()
        this.setRightsDialogVisible = false
      })
    },

    //删除权限
    async deleteRights (role, rightId) {

      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '已删除权限'
        })
        _delRight(role.id, rightId).then(res => {
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          role.children = res.data
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
.el-tag {
  margin: 7px;
}

.el-row {
  display: flex;
  align-items: center;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}
</style>

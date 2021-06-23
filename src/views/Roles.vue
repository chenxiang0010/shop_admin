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
                <el-tag closable @close='deleteRight(scope.row,item1.id)'>{{ item1.authName }}</el-tag>
                <i class='el-icon-caret-right'></i>
              </el-col>
              <el-col :span='19'>
                <el-row :class='{bdtop:i2!=0}' v-for='(item2,i2) in item1.children' :key=item2.id>
                  <el-col :span='6'>
                    <el-tag closable @close='deleteRight(scope.row,item2.id)' type='success'>{{ item2.authName }}
                    </el-tag>
                    <i class='el-icon-caret-right'></i>
                  </el-col>
                  <el-col :span='18'>
                    <el-tag closable @close='deleteRight(scope.row,item3.id)' type='warning'
                            v-for='(item3,i3) in item2.children'
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
            <el-button type='primary' icon='el-icon-edit' size='mini' @click='reviseRolesDialog(scope.row.id)'>编辑
            </el-button>
            <el-button type='danger' icon='el-icon-delete' size='mini' @click='deleteRoles(scope.row.id)'>删除</el-button>
            <el-button type='warning' icon='el-icon-setting' size='mini' @click='distributionDialog(scope.row)'>分配权限
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
               :visible.sync='reviseRolesDialogVisible'
               width='50%'
               @close='reviseRolesDialogClose'>
      <el-form label-width='70px' :model='queryRolesInfo' :rules='addRolesRules' ref='queryRolesInfoRef'>
        <el-form-item label='角色名称' prop='roleName'>
          <el-input v-model='queryRolesInfo.roleName' prefix-icon='el-icon-phone'></el-input>
        </el-form-item>
        <el-form-item label='角色描述' prop='roleDesc'>
          <el-input v-model='queryRolesInfo.roleDesc' prefix-icon='el-icon-s-goods'></el-input>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
        <el-button @click='reviseRolesDialogVisible = false'>取 消</el-button>
        <el-button type='primary' @click='reviseRoles'>确 定</el-button>
       </span>
    </el-dialog>

    <!--分配权限-->
    <el-dialog title='分配权限'
               :visible.sync='distributionDialogVisible'
               width='50%'
               @close='rightsClosed'>
      <el-tree :data='rightsList' :props='treeProps' show-checkbox node-key='id'
               :default-checked-keys='defKeys' ref='treeRef'></el-tree>

      <span slot='footer' class='dialog-footer'>
        <el-button @click='distributionDialogVisible = false'>取 消</el-button>
        <el-button type='primary' @click='distribution()'>确 定</el-button>
       </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  data() {
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
      reviseRolesDialogVisible: false,
      distributionDialogVisible: false,
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
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.roles = res.data
    },
    addRolesDialogClose() {
      this.$refs.addRolesRef.resetFields()
    },
    addRoles() {
      this.$refs.addRolesRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('roles', this.addRolesForm)
        if (res.meta.status !== 201 || res.meta.status == 400) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success('添加角色成功')
        this.addRolesDialogVisible = false
        await this.getRolesList()
      })
    },
    async deleteRoles(id) {
      //根据id删除用户
      const confirmResult = await this.$confirm('此操作将删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete(`roles/` + id)
      if (res.meta.status !== 200) return this.$message.error('删除角色失败')
      this.$message.success('已删除该角色')
      await this.getRolesList()
    },
    reviseRolesDialogClose() {
      this.$refs.queryRolesInfoRef.resetFields()
    },
    async reviseRolesDialog(id) {
      this.reviseRolesDialogVisible = true
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.queryRolesInfo = res.data
    },
    reviseRoles() {
      this.$refs.queryRolesInfoRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`roles/` + this.queryRolesInfo.roleId, {
          roleName: this.queryRolesInfo.roleName,
          roleDesc: this.queryRolesInfo.roleDesc
        })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success('修改成功')
        this.reviseRolesDialogVisible = false
        await this.getRolesList()
      })
    },
    async distributionDialog(role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rightsList = res.data
      this.getDefKeys(role, this.defKeys)
      this.distributionDialogVisible = true
    },
    getDefKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      //递归调用，不懂
      node.children.forEach(item => this.getDefKeys(item, arr))
    },
    rightsClosed() {
      //重置数组
      this.defKeys = []
    },
    async distribution() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]

      const idArr = keys.join(',')

      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idArr })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success('分配权限成功')
      await this.getRolesList()
      this.distributionDialogVisible = false
    },
    async deleteRight(role, rightId) {
      const confirmResult = await this.$confirm('此操作将删除该角色权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')

      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) return this.$message.error('删除权限失败')
      this.$message.success('已删除该权限')
      role.children = res.data
      // await this.getRolesList()
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

<template>
  <el-container class='home_container'>
    <!--头部区-->
    <el-header>
      <div>
        <img src='@/assets/logo.png' alt='顶部logo'>
        <span>电商后台管理系统</span>
      </div>
      <el-button type='info' @click='logout'>退出</el-button>
    </el-header>
    <!--页面主体区-->
    <el-container>
      <!--侧边栏-->
      <el-aside :width="isCollapse?'64px':'200px'">
        <div class='toggle_button' @click='toggleCollapse'><i class='iconfont icon-toggle-verticle'></i></div>
        <el-menu background-color='#545c72' text-color='#fff' active-text-color='#2B7CDA' unique-opened
                 :collapse='isCollapse' :collapse-transition='false' router :default-active='$route.path'>
          <!--一级菜单-->
          <el-submenu :index="item.id+''" v-for='item in menuList' :key='item.id'>
            <template slot='title'>
              <i :class='iconObj[item.id]'></i>
              <span>{{ item.authName }}</span>
            </template>
            <!--二级菜单-->
            <el-menu-item :index="'/'+subItem.path" v-for='subItem in item.children' :key='subItem.id'>
              <template slot='title'>
                <i class='el-icon-menu'></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--右侧内容区-->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { menuList } from '@/network/home'

export default {
  name: 'Home',
  data () {
    return {
      menuList: [],
      iconObj: {
        125: 'iconfont icon-UserService',
        103: 'iconfont icon-bd-',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-icon-mark1',
        145: 'iconfont icon-baobiaoguanli'
      },
      isCollapse: false
    }
  },
  created () {
    this.getMenuList()
  },
  methods: {
    //退出登录
    logout () {
      this.$store.dispatch('LogOut').then(() => {
        this.$router.push('/login')
      })
    },
    //获取左侧菜单
    getMenuList () {
      menuList().then(res => {
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.menuList = res.data
      })
    },
    //是否折叠左侧菜单
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style lang='less' scoped>
.home_container {
  height: 100%;
}

.el-header {
  background-color: #4a5061;
  display: flex;
  justify-content: space-between;
  align-items: center;

  div {
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      height: 50px;
    }

    span {
      margin-left: 15px;
      color: white;
      font-size: 20px;
    }
  }
}

.el-aside {
  background-color: #545c72;

  .toggle_button {
    background-color: #4a5064;
    font-size: 10px;
    color: white;
    text-align: center;
    cursor: pointer !important;
  }

  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #EAEDF2;
}

.iconfont {
  margin-right: 10px;
}

</style>

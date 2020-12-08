<template>
  <!-- home页的布局容器 -->
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <!-- 行/列的布局结构 -->
      <el-row>
        <!-- 左中右三列 -->
        <!-- 头像列 -->
        <el-col :span="8">
          <img src="../../assets/heima.png" alt="" />
        </el-col>
        <!-- 文字列 -->
        <el-col :span="8">
          <h1>后台管理系统</h1>
        </el-col>
        <!-- 退出列 -->
        <el-col :span="8">
          <el-button @click="logout">退出</el-button>
        </el-col>
      </el-row>
    </el-header>
    <!-- 下侧区域 -->
    <el-container>
      <!-- 侧边栏区域
      侧边栏区域的宽度根据数据中的切换菜单的isMenuCollapse值做关联, 当值为false的时候, 宽度为200px, 反之为64px;
       -->
      <el-aside :width="isMenuCollapse ? '64px' : '200px'">
        <!-- 菜单 -->
        <el-menu
          :default-active="activePath"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          :collapse="isMenuCollapse"
          :collapse-transition="false"
          router
        >
          <!-- 菜单的打开/关闭按钮
          1. 注册点击事件, 点击后, 让el-menu的collapse变为true;
           -->
          <div class="toggle-button" @click="toggleMenu">|||</div>

          <!-- 一级菜单
          1: 遍历数据中的menus数组
          2: index为唯一值, 采用item.id
           -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menusList"
            :key="item.id"
          >
            <template slot="title">
              <!-- 一级菜单模板 -->
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单
            1: 遍历一级菜单的children生成二级菜单
             -->
            <el-menu-item
              :index="'/' + subMenu.path"
              v-for="subMenu in item.children"
              :key="subMenu.id"
              @click="saveNavState('/' + subMenu.path)"
            >
              <!-- 二级菜单模板 -->
              <i class="el-icon-menu"></i>
              <span slot="title">{{ subMenu.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体区域
      子组件的出口/显示
       -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 列表数据;
      menusList: [],

      // 设置一个字体图标对象, key为当前一级菜单的id, 值为字体图标的类名, 每遍历一次一级菜单, 通过当前一级菜单的id, 取出iconsObj字体图标的每一项;
      iconsObj: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },

      // 储存菜单的打开/收起的布尔值
      isMenuCollapse: false,

      // 储存想要激活高亮的菜单路径
      activePath: ''
    }
  },
  created() {
    // 请求左侧菜单栏;
    this.loadAsideMenu()

    // 当页面刷新的时候, 从sessionStorage中取出储存的需要激活的路径, 赋值给数据中的defaultActivePath
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    // 请求左侧菜单栏数据
    async loadAsideMenu() {
      // 页面初始化, 请求左侧菜单数据;
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) {
        // 获取失败
        return this.$message.error(res.meta.msg)
      }
      // console.log(res)
      // 把获取到的列表保存到数据中;
      this.menusList = res.data
    },

    // 退出用户
    async logout() {
      // 1. 先弹框, 和用户确认是否退出
      try {
        const confirmRes = await this.$confirm(
          '确认退出当前用户吗? 是否继续?',
          '提示',
          {
            confirmButtonText: '退出',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )

        // 2. 点击确认后, 从seesionStorage中删除token信息, 并跳转到登录页
        if (confirmRes) {
          window.sessionStorage.removeItem('token')
          this.$message({
            type: 'success',
            message: '已退出当前用户',
            duration: 800
          })
          this.$router.push('/login')
        }
      } catch (error) {
        this.$message({
          type: 'info',
          message: '已取消退出',
          duration: 800
        })
      }
    },

    // 切换菜单的打开和收起
    toggleMenu() {
      // 当点击的时候, 把数据中isMenuCollapse的值取反;
      this.isMenuCollapse = !this.isMenuCollapse
    },

    // 当用户点击二级菜单后, 在sessionStorage中保存当前点击的二级菜单的path
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)

      // 当用户点击不同的path的时候, 再给数据中的activePath赋值新的路径
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
// home页的布局容器
.el-container {
  height: 100%;

  // 头部
  .el-header {
    padding-left: 0;
    background-color: #b3c1cd;
  }

  // 侧边栏
  .el-aside {
    background-color: #545c64;

    // 侧边菜单
    .el-menu {
      border-right: none;
      .toggle-button {
        height: 25px;
        line-height: 25px;
        font-size: 10px;
        text-align: center;
        letter-spacing: 8px;
        background-color: gray;
        cursor: pointer;
      }

      // 字体图标
      .iconfont {
        margin-right: 10px;
        vertical-align: middle;
      }
    }
  }

  // 主体
  .el-main {
    background-color: #eaeef1;
  }

  .el-row {
    line-height: 60px;
    .el-col {
      height: 60px;
    }
  }

  h1 {
    margin: 0;
    font-size: 26px;
    color: #fff;
    text-align: center;
  }

  .el-col:nth-child(3) {
    text-align: right;
  }
}
</style>

<template>
  <div>
    <el-container class="home-container">
      <!-- 头部 -->
      <el-header>
        <div>
          <span>员工管理系统</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
      </el-header>
      <el-container>
        <!-- 左侧导航栏 -->
        <el-aside :width="isCollapse?'64px':'200px'">
          <div class="toggle-button" @click="toggleCollapse">|||</div>
          <!-- collapse-transition:折叠动画关闭,unique-opened:一次只允许打开一个,router:启用路由,default-active:激活菜单的index -->
          <el-menu
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409EFF"
            unique-opened
            router
            :collapse="isCollapse"
            :collapse-transition="false"
            :default-active="activePath"
          >
            <!-- 一级菜单 -->
            <el-submenu
              :index="item.operationId+''"
              v-for="item in menulist"
              :key="item.operationId"
            >
              <template slot="title">
                <i :class="iconsObj[item.operationId]"></i>
                <span>{{item.authName}}</span>
              </template>
              <!-- 二级菜单,以path为索引 -->
              <el-menu-item
                :index="'/'+subItem.path"
                v-for="subItem in item.children"
                :key="subItem.operationId"
                @click="saveNavState('/'+subItem.path)"
              >
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{subItem.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 右侧主体区 -->
        <el-main>
          <!-- 占位符 -->
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //左侧菜单数据
      menulist: [],
      //是否折叠
      isCollapse: false,
      //被激活的链接地址
      activePath: "",
      //动态绑定一级菜单的图标
      iconsObj: {
        "1": "iconfont icon-users",
        "2": "iconfont icon-tijikongjian",
        "3": "iconfont icon-baobiao",
        "8": "iconfont icon-user"
      }
    };
  },
  created() {
    this.activePath = window.sessionStorage.getItem("activePath");
    this.getRights();
  },
  methods: {
    //退出:sessionStorage
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    //获取左侧的操作列表
    async getRights() {
      const { data: result } = await this.$http.get(
        "admin/getOperationsByAdmin"
      );
      if (result.status === 200) {
        this.menulist = result.obj;
      } else {
        return this.$message.error("管理员获取操作失败！");
      }
    },
    //点击按钮切换左侧菜单栏的折叠功能
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    //保存链接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
    }
  }
};
</script>
<style lang='less' scoped>
.home-container {
  height: 817.33px;
  margin: 0;
  padding: 0;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.3em;
  cursor: pointer;
}
</style>
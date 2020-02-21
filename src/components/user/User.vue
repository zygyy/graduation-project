<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- gutter:间距 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index" fixed></el-table-column>
        <el-table-column label="员工编号" prop="empId" fixed width="110px"></el-table-column>
        <el-table-column label="姓名" prop="chineseName" fixed></el-table-column>
        <el-table-column label="性别" prop="gender"></el-table-column>
        <el-table-column label="级别" prop="grade"></el-table-column>
        <el-table-column label="就职日期" prop="hireDate" width="100px"></el-table-column>
        <el-table-column label="部门" prop="department" width="100px"></el-table-column>
        <el-table-column label="工作地点" prop="workingLocation"></el-table-column>
        <el-table-column label="手机号码" prop="phone" width="120px"></el-table-column>
        <el-table-column label="家庭住址" prop="address" width="180px"></el-table-column>
        <el-table-column label="邮箱" prop="email" width="180px"></el-table-column>
        <el-table-column label="毕业学校" prop="school" width="100px"></el-table-column>
        <el-table-column label="专业" prop="marjor"></el-table-column>
        <el-table-column label="文凭" prop="degree"></el-table-column>
        <el-table-column label="毕业时间" prop="graduationTime" width="100px"></el-table-column>
        <el-table-column label="离职日期" prop="leaveDate" width="100px"></el-table-column>
        <el-table-column label="离职原因" prop="terminationReason" width="200px"></el-table-column>
        <el-table-column label="生日" prop="birthday" width="100px"></el-table-column>
        <el-table-column label="创建人" prop="createUser"></el-table-column>
        <el-table-column label="创建时间" prop="createTime" width="100px"></el-table-column>
        <el-table-column label="修改者" prop="updateUser"></el-table-column>
        <el-table-column label="修改时间" prop="updateTime" width="100px"></el-table-column>
        <el-table-column label="是否有效" >
          <template slot-scope="scope">

          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px" fixed="right">
           <el-button
              type="primary"
              icon="el-icon-edit"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
            ></el-button>
        </el-table-column>
      </el-table>

       <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //获取用户列表参数
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5
      },
      userlist: [],
      total: 0
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    //获取用户信息列表
    async getUserList() {
      const { data: result } = await this.$http.post(
        "admin/users",
        this.queryInfo
      );
      if (result.status !== 200) {
        return this.$message.error("获取用户数据失败！");
      } else {
        this.userlist = result.obj.employees;
        this.total = result.obj.totalpage;
      }
    },
    // 监听pagesize改变事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    //监听页码改变事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    }
  }
};
</script>
<style lang="less" scoped>
</style>
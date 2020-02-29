<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>职位管理</el-breadcrumb-item>
      <el-breadcrumb-item>职位列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加职位</el-button>
        </el-col>
      </el-row>
      <!-- 职位列表区域 -->
      <el-table :data="departmentAndGrade" stripe border>
        <el-table-column type="expand"></el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="职位名称" prop="name"></el-table-column>
        <el-table-column label="等级" prop="scale">
          <template slot-scope="scope">
            <el-tag type="primary" v-if="scope.row.scale==='高'">高</el-tag>
            <el-tag type="success" v-else-if="scope.row.scale==='中'">中</el-tag>
            <el-tag type="info" v-else-if="scope.row.scale==='低'">低</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="deleteGrade(scope.row.id,scope.row.level)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //部门以及职位信息
      departmentAndGrade: []
    };
  },
  created() {
    this.getDepartments();
  },
  methods: {
    //获取部门以及职位等信息
    async getDepartments() {
      const { data: res } = await this.$http.get("admin/getGrades");
      if (res.status === 200) {
        this.departmentAndGrade = res.obj;
      } else {
        return this.$message.error("加载失败！");
      }
    },
    //删除职位
    async deleteGrade(id, level) {
      if (level !== 2) {
        return this.$message.error("非职位不可删除!");
      } else {
        const res = await this.$confirm(
          "此操作将删除该职位(请先确保该职位下无员工),是否继续?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        ).catch(err => {
          return err;
        });
        if (res !== "confirm") {
          return this.$message.info("已取消该操作！");
        } else {
          const { data: result } = await this.$http.delete(
            "grade/deleteGrade/" + id
          );
          if (result.status !== 200) {
            return this.$message.error(result.msg);
          } else {
            this.$message.success(result.msg);
            this.getDepartments();
          }
        }
      }
    }
  }
};
</script>
<style lang="less" scoped>
</style>
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
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row>
              <!-- 渲染一级部门 -->
              <el-col :span="7">
                <el-tag>{{scope.row.department.department.name}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级部门 -->
              <el-col :span="7">
                <el-tag type="success">{{scope.row.department.name}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染对该职位的描述 -->
              <el-col :span="10">
                <el-tag
                  type="warning"
                  v-for="(item,i) in scope.row.describesSplit"
                  :key="i"
                  closable
                  @close="removeDescribe(scope.row,i)"
                >{{item}}</el-tag>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
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
      departmentAndGrade: [],
      //
      deleteDescribe: {
        id: "",
        describes: ""
      }
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
    },
    //删除对该职位的描述
     async removeDescribe(grade, i) {
      //弹框提示是否删除
      const confirmResult = await this.$confirm(
        "此操作将永久删除该描述, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => {
        return err;
      });
      if (confirmResult !== "confirm") {
        return this.$message.info("取消删除！");
      } else {
         grade.describesSplit.splice(i, 1);
         grade.describes = grade.describesSplit.join("，");
         this.deleteDescribe.describes = grade.describes;
         this.deleteDescribe.id = grade.id;
         const { data: res } = await this.$http.put(
           "grade/deleteDescribe",
          this.deleteDescribe
        );
        if (res.status !== 200) {
          return this.$message.error(res.msg);
        } else {
          this.$message.success(res.msg);
           grade=res.obj.obj
        }
      }
    }
  }
};
</script>
<style lang="less" scoped>
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.el-tag {
  margin: 7px;
}
</style>
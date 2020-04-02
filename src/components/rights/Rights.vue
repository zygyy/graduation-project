<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>分配权限</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- gutter:间距 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGradeList">
            <el-button slot="append" icon="el-icon-search" @click="getGradeList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="gradeList" border stripe>
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column label="部门" prop="department.department.name"></el-table-column>
        <el-table-column label="分部门" prop="department.name"></el-table-column>
        <el-table-column label="职位" prop="name"></el-table-column>
        <el-table-column label="等级" prop="scale">
          <template slot-scope="scope">
            <el-tag type="primary" v-if="scope.row.scale==='高'">高</el-tag>
            <el-tag type="success" v-else-if="scope.row.scale==='中'">中</el-tag>
            <el-tag type="info" v-else-if="scope.row.scale==='低'">低</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="success"
              icon="el-icon-s-tools"
              plain
              @click="assignRights(scope.row.id)"
            >分配权限</el-button>
          </template>
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

    <el-dialog
      title="分配权限中 . . . . ."
      :visible.sync="rightsDialogVisible"
      width="30%"
      :before-close="closeVisible"
    >
      <el-tree
        :data="operationList"
        :props="treeProps"
        show-checkbox
        node-key="operationId"
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeVisible">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
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
      //职位
      gradeList: [],
      //职位总数
      total: 0,
      //可以给员工分配的权限
      operationList: [],
      //控制分配权限对话框
      rightsDialogVisible: false,
      //树形控件
      treeProps: {
        label: "authName"
      },
      //默认选中的权限的id
      defKeys: [],
      //分配权限
      updateRightsRequest: {
        gradeId: "",
        operationId: ""
      }
    };
  },
  created() {
    this.getGradeList();
  },
  methods: {
    //获取职位列表
    async getGradeList() {
      const { data: result } = await this.$http.post(
        "rights/getGrades",
        this.queryInfo
      );
      if (result.status !== 200) {
        return this.$message.error("获取数据失败！");
      } else {
        this.gradeList = result.obj.departmentList;
        this.total = result.obj.total;
      }
    },
    // 监听pagesize改变事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGradeList();
    },
    //监听页码改变事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getGradeList();
    },
    //获取所有的用户权限列表
    async getUserRightsList() {
      const { data: result } = await this.$http.get("rights/getOperations");
      if (result.status !== 200) {
        return this.$message.error(result.msg);
      } else {
        this.operationList = result.obj;
      }
    },
    //分配权限对话框
    async assignRights(gradeId) {
      this.updateRightsRequest.gradeId = gradeId;
      this.getUserRightsList();
      //获取已经分配到的权限列表
      const { data: res } = await this.$http.get(
        "rights/getAchieveRights/" + gradeId
      );
      if (res.status !== 200) {
        return this.$message.error("获取失败！");
      } else {
        if (res.obj !== null) {
          //把默认选中的权限id塞进去
          this.defKeys = res.obj.operationId.split(",");
          this.rightsDialogVisible = true;
        } else {
          this.rightsDialogVisible = true;
        }
      }
    },
    //分配权限的关闭事件
    closeVisible() {
      //置空
      this.defKeys = [];
      this.updateRightsRequest.gradeId = "";
      this.updateRightsRequest.operationId = "";
      this.rightsDialogVisible = false;
    },
    //分配权限的确定按钮
    async allotRights() {
      const keys = [...this.$refs.treeRef.getCheckedKeys()];
      console.log(keys);
      if (keys.length !== 0) {
        this.updateRightsRequest.operationId = keys.join(",");
        const { data: res } = await this.$http.post(
          "rights/updateRights",
          this.updateRightsRequest
        );
        if (res.status !== 200) {
          return this.$message.error(res.msg);
        } else {
          this.$message.success(res.msg);
          //置空
          this.defKeys = [];
          this.updateRightsRequest.gradeId = "";
          this.updateRightsRequest.operationId = "";
          this.rightsDialogVisible = false;
        }
      } else {
        return this.$message.error("请选择所要分配的权限！");
      }
    }
  }
};
</script>
<style lang="less" scoped>
</style>
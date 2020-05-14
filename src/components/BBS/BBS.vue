<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>空间管理</el-breadcrumb-item>
      <el-breadcrumb-item>文章管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-input
        placeholder="请输入搜索内容"
        v-model="queryInfo.query"
        clearable
        @clear="getBBSList"
        style="width:400px"
      >
        <el-button slot="append" icon="el-icon-search" @click="getBBSList"></el-button>
      </el-input>
    </el-card>

    <el-card v-for="item in allBBSList" :key="item.id" style="margin-top:20px">
      <div>
        <span>工号:</span>
        <el-tag effect="plain" type="info">{{item.empId}}</el-tag>
        <span style="margin-left:100px">作者:</span>
        <el-tag effect="plain" type="success">{{item.chineseName}}</el-tag>
        <span style="position:absolute;left:650px;">文章标题:</span>
        <el-tag effect="plain" type="warning" style="position:absolute;left:720px;">{{item.title}}</el-tag>
        <span style="position:absolute;left:900px;">发布时间:</span>
        <el-tag effect="plain" style="position:absolute;left:970px;">{{item.publishTime}}</el-tag>

        <el-tag style="position:absolute;left:1200px;" type="success" v-if="item.isDeleted===1">有效</el-tag>
        <el-tag
          style="position:absolute;left:1200px;"
          type="warning"
          v-else-if="item.isDeleted===0"
        >无效</el-tag>

        <el-tooltip effect="dark" content="删除文章" placement="top">
          <i
            class="el-icon-delete"
            style=" position:absolute;left:1350px"
            @click="deletedBBSByAdmin(item.id)"
          ></i>
        </el-tooltip>
      </div>
      <hr style="height:1px;border:none;border-top:1px dashed #0066CC;" />
      <div class="contentClass" v-html="item.content"></div>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //查询条件
      queryInfo: {
        query: ""
      },
      //按照员工工号从小到大显示文章
      allBBSList: []
    };
  },
  created() {
    this.getBBSList();
  },
  methods: {
    //获取所有BBS列表
    async getBBSList() {
      const { data: res } = await this.$http.post(
        "bbs/getAllBBS",
        this.queryInfo
      );
      if (res.status === 200) {
        this.allBBSList = res.obj;
      } else {
        return this.$message.error("获取数据失败！");
      }
    },
    //管理员删除文章(永久删除)
    async deletedBBSByAdmin(id) {
      //弹框提示是否删除
      const res = await this.$confirm(
        "此操作将永久删除该段文字, 是否继续?",
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
        return this.$message.info("已取消删除！");
      } else {
        const { data: result } = await this.$http.delete(
          "bbs/deletedBBSByAdmin/" + id
        );
        if (result.status === 200) {
          this.$message.success(result.msg);
          this.getBBSList();
        } else {
          return this.$message.error(result.msg);
        }
      }
    }
  }
};
</script>
<style lang='less' scoped>
.contentClass {
  //font-style: italic;
  line-height: 30px;
  text-indent: 4%;
}
</style>
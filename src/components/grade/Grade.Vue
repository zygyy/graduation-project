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
          <el-button type="primary" @click="openAddDialog">添加职位</el-button>
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
                <el-tag type="warning">{{scope.row.department.name}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染对该职位的描述 -->
              <el-col :span="10">
                <el-tag
                  type="success"
                  v-for="(item,i) in scope.row.describesSplit"
                  :key="i"
                  closable
                  @close="removeDescribe(scope.row,i)"
                >{{item}}</el-tag>
                <!-- 输入框和按钮之间的切换 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  size="small"
                  ref="saveTagInput"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
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
            <el-button type="primary" icon="el-icon-edit" @click="openEditDialog(scope.row)">编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="deleteGrade(scope.row.id,scope.row.level)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 编辑职位的对话框 -->
    <el-dialog
      title="职位名称修改中..."
      :visible.sync="editDialogVisible"
      width="30%"
      @close="editDialogClosed"
    >
      <el-form :model="editRuleForm" :rules="editRules" ref="editRuleRef" label-width="100px">
        <el-form-item label="职位名称" prop="name">
          <el-input v-model="editRuleForm.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEditDialog">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 新增职位的对话框 -->
    <el-dialog
      title="新增职位中..."
      :visible.sync="addDialogVisible"
      width="40%"
      @close="addDialogClosed"
    >
      <el-form :model="addRuleForm" :rules="addRules" ref="addRuleRef" label-width="100px">
        <el-form-item label="职位名称" prop="name">
          <el-input v-model="addRuleForm.name" style="width: 300px;"></el-input>
        </el-form-item>
        <el-form-item label="职位描述" prop="describes">
          <el-input
            v-model="addRuleForm.describes"
            style="width: 300px;"
            placeholder="以中文状态的'，'分隔开"
          ></el-input>
        </el-form-item>
        <el-form-item label="部门">
          <el-cascader
            v-model="departmentDefault"
            :options="selectdepartments"
            :props="cascaderProps"
            style="width:300px;"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="等级">
          <el-select v-model="addRuleForm.scale" style="width:300px;">
            <el-option
              v-for="item in degreeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveAddDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //部门以及职位信息
      departmentAndGrade: [],
      //根据id修改职位的描述
      deleteDescribe: {
        id: "",
        describes: ""
      },
      //用于控制编辑职位的对话框的显示和隐藏
      editDialogVisible: false,
      editRules: {
        name: [
          {
            required: true,
            message: "请输入职位名称",
            trigger: "blur"
          }
        ]
      },
      editRuleForm: {},
      //用户控制新增职位对话框的显示
      addDialogVisible: false,
      //新增职位的验证规则
      addRules: {
        name: [
          {
            required: true,
            message: "请输入职位名称",
            trigger: "blur"
          }
        ],
        describes: [
          {
            required: true,
            message: "请输入职位名称",
            trigger: "blur"
          }
        ]
      },
      addRuleForm: {
        name: "",
        describes: "",
        scale: ""
      },
      //获取部门信息
      selectdepartments: {},
      //新增职位的时候双向绑定的部门
      departmentDefault: [],
      //指定级联选择器对象
      cascaderProps: {
        value: "id",
        label: "name",
        children: "firstChildren",
        expandTrigger: "hover"
      },
      //职位等级选择
      degreeOptions: [
        {
          value: "高",
          label: "高"
        },
        {
          value: "中",
          label: "中"
        },
        {
          value: "低",
          label: "低"
        }
      ]
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
          grade = res.obj.obj;
        }
      }
    },
    //文本框失去焦点
   async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }
      row.describesSplit.push(row.inputValue.trim())
      console.log(row);
      row.inputValue = "";
      row.inputVisible = false;
      //发起请求，保存这次操作
      this.deleteDescribe.id=row.id;
      this.deleteDescribe.describes=row.describesSplit.join('，')
      console.log(this.deleteDescribe);
      const {data:res}=await this.$http.put("grade/deleteDescribe",
          this.deleteDescribe);
      if(res.status!==200){
        return this.$message.error("新增失败！")
      }else{
        this.$message.success("新增成功！")
      }

    },
    //点击按钮展示文本输入框
    showInput(row) {
      row.inputVisible = true;
      //nextTick方法的作用:就是当页面上的元素被重新渲染之后,才会执行回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //打开编辑职位的对话框
    async openEditDialog(row) {
      if (row.level !== 2) {
        return this.$message.error("非职位不可修改！");
      } else {
        this.editDialogVisible = true;
        this.editRuleForm = row;
      }
    },
    //编辑职位的对话框的确定按钮
    saveEditDialog() {
      this.$refs.editRuleRef.validate(async valid => {
        if (!valid) {
          return;
        } else {
          const { data: res } = await this.$http.put(
            "grade/updateGrade",
            this.editRuleForm
          );
          if (res.status !== 200) {
            return this.$message.error(res.msg);
          } else {
            this.$message.success(res.msg);
            this.editDialogVisible = false;
            this.getDepartments();
          }
        }
      });
    },
    //监听修改对话框的关闭事件
    editDialogClosed() {
      this.$refs.editRuleRef.resetFields();
    },
    //打开添加职位对话框
    async openAddDialog() {
      const { data: res } = await this.$http.get(
        "grade/getDepartmentsNotlevel2"
      );
      if (res.status !== 200) {
        return this.$message.error("获取部门信息失败！");
      } else {
        this.selectdepartments = res.obj;
        this.addDialogVisible = true;
      }
    },
    //添加职位的确定按钮
    saveAddDialog() {
      this.$refs.addRuleRef.validate(async valid => {
        if (!valid) {
          return;
        } else {
          if (this.departmentDefault.length === 2) {
            const { data: res } = await this.$http.post(
              "grade/addGrade/" + this.departmentDefault[1],
              this.addRuleForm
            );
            if (res.status !== 200) {
              return this.$message.error(res.msg);
            } else {
              this.$message.success(res.msg);
              this.departmentDefault=[],
              this.addRuleForm.grade=''
              this.addDialogVisible = false;
              this.getDepartments();
            }
          } else {
            return this.$message.error("请先选择部门,再保存！");
          }
        }
      });
    },
    //监听添加对话框的关闭事件
    addDialogClosed() {
      this.$refs.addRuleRef.resetFields();
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
.input-new-tag {
  width: 150px;
}
</style>
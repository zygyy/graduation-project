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
          <el-button type="primary" @click="openAddDialog">添加用户</el-button>
        </el-col>
        <el-col :span="4">
          <el-button type="success" @click="excel">导出数据</el-button>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">更多搜索</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe @selection-change="handleSelectionChange">
        >
        <el-table-column type="selection" fixed></el-table-column>
        <el-table-column label="员工编号" prop="empId" fixed width="110px"></el-table-column>
        <el-table-column label="姓名" prop="chineseName" fixed></el-table-column>
        <el-table-column label="性别" prop="gender"></el-table-column>
        <el-table-column label="级别" prop="grade" width="160px"></el-table-column>
        <el-table-column label="就职日期" prop="hireDate" width="100px"></el-table-column>
        <el-table-column label="部门" prop="department" width="260px"></el-table-column>
        <el-table-column label="工作地点" prop="workingLocation" width="280px"></el-table-column>
        <el-table-column label="手机号码" prop="phone" width="120px"></el-table-column>
        <el-table-column label="家庭住址" prop="address" width="280px"></el-table-column>
        <el-table-column label="邮箱" prop="email" width="220px"></el-table-column>
        <el-table-column label="毕业学校" prop="school" width="140px"></el-table-column>
        <el-table-column label="专业" prop="marjor" width="140px"></el-table-column>
        <el-table-column label="文凭" prop="degree"></el-table-column>
        <el-table-column label="毕业时间" prop="graduationTime" width="100px"></el-table-column>
        <el-table-column label="离职日期" prop="leaveDate" width="100px"></el-table-column>
        <el-table-column label="离职原因" prop="terminationReason" width="200px"></el-table-column>
        <el-table-column label="生日" prop="birthday" width="100px"></el-table-column>
        <el-table-column label="创建人" prop="createUser"></el-table-column>
        <el-table-column label="创建时间" prop="createTime" width="100px"></el-table-column>
        <el-table-column label="修改者" prop="updateUser"></el-table-column>
        <el-table-column label="修改时间" prop="updateTime" width="100px"></el-table-column>
        <el-table-column label="是否有效">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.isDeleted===1">有效</el-tag>
            <el-tag type="warning" v-else-if="scope.row.isDeleted===0">无效</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px" fixed="right">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="修改操作" placement="top">
              <el-button
                type="primary"
                icon="el-icon-edit"
                @click="openUpdatedDialog(scope.row.empId,scope.row.isDeleted)"
              ></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除操作" placement="top">
              <el-button
                type="danger"
                icon="el-icon-delete"
                @click="deleted(scope.row.empId,scope.row.isDeleted)"
              ></el-button>
            </el-tooltip>
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

    <!-- 修改用户的对话框 -->
    <el-dialog title="修改员工" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form
        ref="editFormRef"
        :inline="true"
        :model="editForm"
        :rules="editFormRules"
        label-width="70px"
      >
        <el-form-item label="员工编号">
          <el-input v-model="editForm.empId" disabled></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="chineseName">
          <el-input v-model="editForm.chineseName"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="editForm.gender">
            <el-option
              v-for="item in genderOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入职日期">
          <el-date-picker v-model="editForm.hireDate" type="date" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="部门职位">
          <el-cascader
            v-model="selectedGrade"
            :options="departments"
            :props="cascaderProps"
            class="addressClass"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="editForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="家庭住址">
          <el-cascader :options="cityData" v-model="addressCascader" class="addressClass"></el-cascader>
        </el-form-item>
        <el-form-item label="工作地点">
          <el-cascader :options="cityData" v-model="workingLocationCascader" class="addressClass"></el-cascader>
        </el-form-item>
        <el-form-item label="学校" prop="school">
          <el-input v-model="editForm.school"></el-input>
        </el-form-item>
        <el-form-item label="专业" prop="marjor">
          <el-input v-model="editForm.marjor"></el-input>
        </el-form-item>
        <el-form-item label="学位">
          <el-select v-model="editForm.degree">
            <el-option
              v-for="item in degreeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="毕业时间">
          <el-date-picker value-format="yyyy-MM-dd" v-model="editForm.graduationTime" type="date"></el-date-picker>
        </el-form-item>
        <el-form-item label="生日">
          <el-date-picker value-format="yyyy-MM-dd" v-model="editForm.birthday" type="date"></el-date-picker>
        </el-form-item>
        <el-form-item label="离职日期">
          <el-date-picker value-format="yyyy-MM-dd" v-model="editForm.leaveDate" type="date"></el-date-picker>
        </el-form-item>
        <el-form-item label="辞职原因">
          <el-input type="textarea" v-model="editForm.terminationReason" class="addressClass"></el-input>
        </el-form-item>
        <el-form-item label="创建人">
          <el-input v-model="editForm.createUser" disabled></el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker v-model="editForm.createTime" type="date" disabled></el-date-picker>
        </el-form-item>
        <el-form-item label="修改者">
          <el-input v-model="editForm.updateUser" disabled></el-input>
        </el-form-item>
        <el-form-item label="修改时间">
          <el-date-picker v-model="editForm.updateTime" disabled type="date"></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialog">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加员工对话框 -->
    <el-dialog title="添加员工" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <el-form
        ref="addFormRef"
        :inline="true"
        :model="addForm"
        :rules="addFormRules"
        label-width="70px"
      >
        <el-form-item label="姓名" prop="chineseName">
          <el-input v-model="addForm.chineseName"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="addForm.gender" placeholder="请选择">
            <el-option
              v-for="item in genderOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入职日期">
          <el-date-picker v-model="addForm.hireDate" type="date" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="生日">
          <el-date-picker v-model="addForm.birthday" type="date"></el-date-picker>
        </el-form-item>
        <el-form-item label="部门职位">
          <el-cascader
            v-model="gradeDefault"
            :options="departments"
            :props="cascaderProps"
            class="addressClass"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="addForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="家庭住址">
          <el-cascader :options="cityData" v-model="addForm.address" class="addressClass"></el-cascader>
        </el-form-item>
        <el-form-item label="工作地点">
          <el-cascader :options="cityData" v-model="addForm.workingLocation" class="addressClass"></el-cascader>
        </el-form-item>
        <el-form-item label="学校" prop="school">
          <el-input v-model="addForm.school"></el-input>
        </el-form-item>
        <el-form-item label="专业" prop="marjor">
          <el-input v-model="addForm.marjor"></el-input>
        </el-form-item>
        <el-form-item label="学位">
          <el-select v-model="addForm.degree">
            <el-option
              v-for="item in degreeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="毕业时间">
          <el-date-picker v-model="addForm.graduationTime" type="date"></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import cityData from "./citydata.js";
export default {
  data() {
    //邮箱的验证规则
    var checkEmail = (rule, value, cb) => {
      const regEamil = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (regEamil.test(value)) {
        return cb();
      } else {
        cb(new Error("请输入合法的邮箱"));
      }
    };

    //手机号验证规则
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        return cb();
      } else {
        cb(new Error("请输入合法的手机号码"));
      }
    };
    return {
      //获取用户列表参数
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5
      },
      //用户信息
      userlist: [],
      //总条数
      total: 0,
      //控制修改用户对话框的显示和隐藏
      editDialogVisible: false,
      //把根据id查询到的数据保存到editForm中
      editForm: {},
      editFormRules: {
        chineseName: [
          {
            required: true,
            message: "请输入姓名",
            trigger: "blur"
          }
        ],
        email: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: "blur"
          },
          {
            validator: checkEmail,
            trigger: "blur"
          }
        ],
        phone: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: "blur"
          },
          {
            validator: checkMobile,
            trigger: "blur"
          }
        ],
        school: [
          {
            required: true,
            message: "请输入毕业学校",
            trigger: "blur"
          }
        ],
        marjor: [
          {
            required: true,
            message: "请输入专业",
            trigger: "blur"
          }
        ]
      },
      //部门以及职位信息
      departments: [],
      //指定级联选择器对象
      cascaderProps: {
        value: "name",
        label: "name",
        children: "firstChildren",
        expandTrigger: "hover"
      },
      //级联选择器的职位
      selectedGrade: [],
      //级联选择器的家庭地址
      addressCascader: [],
      //工作地点
      workingLocationCascader: [],
      //获取城区地址
      cityData: cityData,
      //性别选择
      genderOptions: [
        {
          value: "Male",
          label: "Male"
        },
        {
          value: "Female",
          label: "Female"
        }
      ],
      //学位选择
      degreeOptions: [
        {
          value: "大专",
          label: "大专"
        },
        {
          value: "本科",
          label: "本科"
        },
        {
          value: "硕士",
          label: "硕士"
        },
        {
          value: "博士",
          label: "博士"
        }
      ],
      //添加用户
      addDialogVisible: false,
      //添加员工的数据集合
      addForm: {
        chineseName: "",
        gender: "",
        grade: "",
        hireDate: "",
        department: "",
        workingLocation: "",
        phone: "",
        address: "",
        email: "",
        school: "",
        marjor: "",
        degree: "",
        graduationTime: "",
        birthday: ""
      },
      //临时存储部门与职位信息
      gradeDefault: [],
      //添加员工的数据集合的校验规则
      addFormRules: {
        chineseName: [
          {
            required: true,
            message: "请输入姓名",
            trigger: "blur"
          }
        ],
        email: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: "blur"
          },
          {
            validator: checkEmail,
            trigger: "blur"
          }
        ],
        phone: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: "blur"
          },
          {
            validator: checkMobile,
            trigger: "blur"
          }
        ],
        school: [
          {
            required: true,
            message: "请输入学校",
            trigger: "blur"
          }
        ],
        marjor: [
          {
            required: true,
            message: "请输入专业",
            trigger: "blur"
          }
        ]
      },
      multipleSelection: []
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
    },
    //删除离职,过期员工
    async deleted(id, isDeleted) {
      //弹框提示是否删除
      const res = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
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
        if (isDeleted === 0) {
          return this.$message.info("该员工已被删除,不可重复再删！");
        } else {
          const { data: result } = await this.$http.delete(
            "admin/deleteUser/" + id
          );
          if (result.status !== 200) {
            return this.$message.error("删除失败！");
          } else {
            this.$message.success(result.msg);
            this.getUserList();
          }
        }
      }
    },
    //修改用户信息得对话框
    async openUpdatedDialog(empId, isDeleted) {
      if (isDeleted === 0) {
        return this.$message.error("用户已失效,不可再次更改信息！");
      } else {
        const { data: result } = await this.$http.get(
          "admin/getUserByEmpId/" + empId
        );
        if (result.status === 200) {
          this.editForm = result.obj;
          //部门和职位合并,并赋值给级联选择器
          this.editForm.grade =
            this.editForm.department + "/" + this.editForm.grade;
          this.selectedGrade = this.editForm.grade.split("/");
          //给家庭住址和工作地址的级联选择器赋值
          this.workingLocationCascader = this.editForm.workingLocation.split(
            "/"
          );
          this.addressCascader = this.editForm.address.split("/");
          this.editDialogVisible = true;
          this.getDepartments();
        } else {
          return this.$message.error("修改用户消息失败！");
        }
      }
    },
    //监听修改对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    //修改对话框的确定按钮
    async editDialog() {
      //对editForm数据的处理
      this.editForm.department =
        this.selectedGrade[0] + "/" + this.selectedGrade[1];
      this.editForm.grade = this.selectedGrade[2];
      this.editForm.address = this.addressCascader.join("/");
      this.editForm.workingLocation = this.workingLocationCascader.join("/");
      //当离职日期和离职原因都为空默认该员工在职
      console.log(this.editForm)
      if (
        this.editForm.leaveDate === null &&
        (this.editForm.terminationReason === null)
      ) {
          this.$refs.editFormRef.validate(async valid => {
          if (!valid) {
            return;
          } else {
            const { data: res } = await this.$http.put(
              "admin/updateEmployee",
              this.editForm
            );
            if (res.status !== 200) {
              return this.$message.error("员工信息更新失败！");
            } else {
              this.$message.success(res.msg);
              //关闭对话框
              this.editDialogVisible = false;
              //刷新员工列表
              this.getUserList();
            }
          }
        });
      }else{
         //当离职日期和离职原因都填写完毕默认该员工离职
        //弹框提示是否离职
        const res = await this.$confirm(
          "此操作将默认该员工离职, 是否继续?",
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
          this.editForm.leaveDate = null;
          this.editForm.terminationReason = null;
          return this.$message.info("已取消该操作！");
        } else {
          if (
            this.editForm.terminationReason === null ||
            this.editForm.leaveDate === null
          ) {
            this.editForm.leaveDate = null
            this.editForm.terminationReason =null;
            return this.$message.info("离职日期和离职原因必填！");
          } else {
              //更改员工为离职
            const { data: res } = await this.$http.put(
              "admin/updateEmployee",
              this.editForm
            );
            if (res.status !== 200) {
              return this.$message.error("员工信息更新失败！");
            } else {
              this.$message.success(res.msg);
              //关闭对话框
              this.editDialogVisible = false;
              //刷新员工列表
              this.getUserList();
            }
          }
        }
      }
    },
    //获取部门以及职位等信息
    async getDepartments() {
      const { data: res } = await this.$http.get("admin/getDepartments");
      if (res.status === 200) {
        this.departments = res.obj;
      } else {
        return this.$message.error("加载失败！");
      }
    },
    //打开添加员工信息对话框
    openAddDialog() {
      this.getDepartments();
      this.addDialogVisible = true;
    },
    //添加员工对话框的关闭事件
    addDialogClosed() {
      this.addForm.birthday = "";
      this.addForm.hireDate = "";
      this.addForm.graduationTime = "";
      this.addForm.address = "";
      this.addForm.workingLocation = "";
      this.gradeDefault = "";
      this.addForm.degree = "";
      this.$refs.addFormRef.resetFields();
    },
    //添加员工对话框的确认按钮
    addDialog() {
      if (
        this.addForm.gender !== "" &&
        this.addForm.hireDate !== "" &&
        this.gradeDefault !== "" &&
        this.addForm.address !== "" &&
        this.addForm.workingLocation !== "" &&
        this.addForm.degree !== "" &&
        this.addForm.graduationTime !== "" &&
        this.addForm.birthday !== ""
      ) {
        //重新封装addForm
        this.addForm.grade = this.gradeDefault[2];
        this.addForm.department =
          this.gradeDefault[0] + "/" + this.gradeDefault[1];
        this.addForm.workingLocation = this.addForm.workingLocation.join("/");
        this.addForm.address = this.addForm.address.join("/");
        this.$refs.addFormRef.validate(async valid => {
          if (!valid) {
            return;
          } else {
            const { data: res } = await this.$http.post(
              "admin/addEmployee",
              this.addForm
            );
            if (res.status === 200) {
              this.$message.success(res.msg);
              this.addDialogVisible = false;
              this.getUserList();
            } else {
              return this.$message.error("新增员工失败！");
            }
          }
        });
      } else {
        return this.$message.error("请将信息填写完整！");
      }
    },
    //导出员工数据
    async excel() {
      if (this.multipleSelection.length !== 0) {
        const { data: res } = await this.$http.get(
          "admin/excel/"+this.multipleSelection.join(",")
        );
        if (res.status === 200) {
          this.$message.success("员工信息导出成功！");
        } else {
          return this.$message.error("信息导出失败！");
        }
      } else {
        return this.$message.error("请先选择需要导出的员工！");
      }
    },
    //监听复选
    handleSelectionChange(val) {
      this.multipleSelection = [];
      val.forEach(item => {
        this.multipleSelection.push(item.empId);
      });
    }
  }
};
</script>
<style lang="less" scoped>
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 208.67px;
}
.el-cascader {
  width: 208.67px;
}
.addressClass {
  width: 500px;
}
.el-form-item__label {
  width: 80px;
}
.el-select {
  width: 208.67px;
}
</style>
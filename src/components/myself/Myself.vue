<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>个人中心</el-breadcrumb-item>
      <el-breadcrumb-item>个人信息</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 个人卡片视图区域 -->
    <el-card>
      <div>
        <el-avatar style="margin-left:70px" :size="200" :src="imageUrl"></el-avatar>

        <!-- 图片上传  :action="admin/file/upload"-->
        <el-upload
          :action="uploadURL"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          style="float:right;margin-left: 8px"
        >
          <el-tooltip effect="dark" content="修改头像" placement="top">
            <i class="el-icon-picture-outline-round"></i>
          </el-tooltip>
        </el-upload>

        <div style="float:right">
          <el-tooltip effect="dark" content="修改信息" placement="top">
            <i class="el-icon-edit" @click="disabledJudge===true?update():noupdate()"></i>
          </el-tooltip>
          <el-tooltip effect="dark" content="修改密码" placement="top">
            <i class="iconfont icon-3702mima" @click="updatePasswordDialog"></i>
          </el-tooltip>
        </div>

        <div>
          <el-collapse v-model="activeName" accordion>
            <el-collapse-item name="1">
              <template slot="title">个人信息</template>
              <div>
                <el-form
                  :model="informationForm"
                  :rules="informationRules"
                  ref="informationFormRef"
                >
                  <el-form-item label="管理员账户：">
                    <el-input style="width:200px" v-model="informationForm.empId" disabled></el-input>
                  </el-form-item>
                  <el-form-item label="管理员姓名：">
                    <el-input style="width:200px" v-model="informationForm.name" disabled></el-input>
                  </el-form-item>
                  <el-form-item label="管理员地址：">
                    <el-cascader
                      style="width:200px"
                      :options="cityData"
                      v-model="informationForm.address"
                      :disabled="disabledJudge"
                    ></el-cascader>
                  </el-form-item>
                  <el-form-item label="管理员电话：" prop="phone">
                    <el-input
                      style="width:189.62px"
                      v-model="informationForm.phone"
                      :disabled="disabledJudge"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="管理员昵称：" prop="username">
                    <el-input
                      style="width:189.62px"
                      v-model="informationForm.username"
                      :disabled="disabledJudge"
                    ></el-input>
                  </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                  <el-button
                    size="small"
                    type="primary"
                    v-if="disabledJudge===false"
                    @click="editInformation"
                  >确 定</el-button>
                  <el-button
                    size="small"
                    v-if="disabledJudge===false"
                    @click="disabledJudge=true"
                  >取 消</el-button>
                </span>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </el-card>

    <!-- 修改密码 -->
    <el-dialog title="修改密码" :visible.sync="updatePasswordVisible" width="30%">
      <el-form ref="passwordFormRef" :model="passwordForm" :rules="passwordFormRules">
        <el-form-item label="登录密码:" prop="password">
          <el-input type="password" v-model="passwordForm.password" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="确认密码:" prop="ensurePassword">
          <el-input type="password" v-model="passwordForm.ensurePassword" style="width:300px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="updatePasswordCancel">取 消</el-button>
        <el-button type="primary" @click="updatePassword">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import cityData from "./citydata.js";
export default {
  data() {
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
      //修改密码对话框
      updatePasswordVisible: false,
      passwordForm: {},
      passwordFormRules: {
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          },
          {
            min: 6,
            max: 15,
            message: "长度在6到15个字符",
            trigger: "blur"
          }
        ],
        ensurePassword: [
          {
            required: true,
            message: "请再次输入密码",
            trigger: "blur"
          },
          {
            min: 6,
            max: 15,
            message: "长度在6到15个字符",
            trigger: "blur"
          }
        ]
      },
      //控制禁用的解除
      disabledJudge: true,
      //激活的面板页面
      activeName: "0",
      //获取城区地址
      cityData: cityData,
      //个人信息的验证规则
      informationRules: {
        phone: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur"
          },
          {
            validator: checkMobile,
            trigger: "blur"
          }
        ],
        username: [
          {
            required: true,
            message: "请输入昵称",
            trigger: "blur"
          }
        ]
      },

      //个人信息
      informationForm: {
        empId: window.sessionStorage.getItem("adminEmpId"),
        name: window.sessionStorage.getItem("adminName"),
        address: window.sessionStorage.getItem("adminAddress").split("/"),
        phone: window.sessionStorage.getItem("adminPhone"),
        username: window.sessionStorage.getItem("adminUsername")
      },
      //头像地址
      imageUrl: window.sessionStorage.getItem("adminPhotoUrl"),
      uploadURL:
        "admin/file/upload/" +
        window.sessionStorage.getItem("adminEmpId") +
        "/" +
        window.sessionStorage.getItem("adminName")
    };
  },
  created() {},
  methods: {
    //文件上传成功时的钩子
    handleAvatarSuccess(res, file) {
      if(res.status===200){
        this.$message.success(res.msg)
        this.imageUrl = res.obj.name;
       window.sessionStorage.setItem("adminPhotoUrl",res.obj.name)
      }else{
        return this.$message.error(res.msg)
      }
      
    },
    //上传文件之前的钩子
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //将禁用状态变为修改状态
    update() {
      this.disabledJudge = false;
      this.activeName = 1 + "";
    },
    //将修改状态变为禁用状态
    noupdate() {
      this.disabledJudge = true;
    },
    //修改基本信息的确定按钮
    editInformation() {
      if (this.informationForm.address.length === 0) {
        return this.$message.error("请先选择地址！");
      } else {
        this.informationForm.address = this.informationForm.address.join("/");
        this.$refs.informationFormRef.validate(async valid => {
          if (!valid) {
            return;
          } else {
            const { data: res } = await this.$http.put(
              "admin/myselfUpdate",
              this.informationForm
            );
            if (res.status === 200) {
              this.$message.success(res.msg);
              window.sessionStorage.setItem(
                "adminPhone",
                this.informationForm.phone
              );
              window.sessionStorage.setItem(
                "adminAddress",
                this.informationForm.address
              );
              this.informationForm.address = window.sessionStorage
                .getItem("adminAddress")
                .split("/");
              window.sessionStorage.setItem(
                "adminUsername",
                this.informationForm.username
              );
              this.disabledJudge = true;
            } else {
              return this.$message.error(res.msg);
            }
          }
        });
      }
    },
    //修改密码对话框的打开
    updatePasswordDialog() {
      this.updatePasswordVisible = true;
    },
    //修改密码的确认按钮
    updatePassword() {
      this.$refs.informationFormRef.validate(async valid => {
        if (!valid) {
          return;
        } else {
          if (this.passwordForm.password === this.passwordForm.ensurePassword) {
            const { data: res } = await this.$http.put(
              "admin/updatePassword/" + this.passwordForm.password
            );
            if (res.status === 200) {
              this.$message.success(res.msg);
              this.updatePasswordVisible = false;
              this.passwordForm.password = "";
              this.passwordForm.ensurePassword = "";
            } else {
              return this.$message.error(res.msg);
            }
          } else {
            return this.$message.error("密码错误,请重新输入密码！");
          }
        }
      });
    },
    //修改密码的取消按钮
    updatePasswordCancel() {
      this.updatePasswordVisible = false;
      this.passwordForm.password = "";
      this.passwordForm.ensurePassword = "";
    }
  }
};
</script>
<style lang="less" scoped>
.el-card {
  width: 400px;
  height: 680px;
  margin-left: 400px;
  margin-top: 20px;
}
.dialog-footer {
  margin-left: 165px;
}
.el-tooltip {
  margin-left: 8px;
}
</style>

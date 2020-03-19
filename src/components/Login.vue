<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/pic/logo.png" alt />
      </div>
      <!-- 登录表单区域 -->
      <el-form
        ref="loginFromRef"
        :rules="loginFromRules"
        :model="loginFrom"
        label-width="0px"
        class="login_form"
      >
        <!-- 管理员名称 -->
        <el-form-item prop="username">
          <el-input v-model="loginFrom.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="loginFrom.password"
            prefix-icon="iconfont icon-3702mima"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginFrom: {
        username: "百晓生",
        password: "123456"
      },
      //表单验证规则
      loginFromRules: {
        username: [
          {
            required: true,
            message: "请输入名称",
            trigger: "blur"
          },
          {
            min: 1,
            max: 10,
            message: "长度在1到10个字符",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入账号密码",
            trigger: "blur"
          },
          {
            min: 6,
            max: 15,
            message: "长度在6到15个字符",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {},
  methods: {
    //重置操作
    resetLoginForm() {
      //清空表单内容
      this.$refs.loginFromRef.resetFields();
    },
    //登录
    login() {
      // 预验证，先获取引用对象，在调用validate函数
      this.$refs.loginFromRef.validate(async valid => {
        if (!valid) {
          return;
        } else {
          //登录请求
          const { data: result } = await this.$http.post(
            "admin/login",
            this.loginFrom
          );
          if (result.status === 500) {
            return this.$message.error(result.msg);
          } else {
            this.$message.success(result.msg);
             //1.将登录成功之后的token，保存到客户端的sessionStorage中
            //  1.1 项目中除了登录之外的其他API接口，必须在登录之后才能访问
            //  1.2 token 只应该在当前网站打开期间生效，所以将token保存到sessionStorage中
            window.sessionStorage.setItem("token",result.obj.token);
            window.sessionStorage.setItem("adminEmpId",result.obj.empId);
            window.sessionStorage.setItem("adminName",result.obj.name);
            window.sessionStorage.setItem("adminPhone",result.obj.phone);
            window.sessionStorage.setItem("adminAddress",result.obj.address);
            window.sessionStorage.setItem("adminUsername",result.obj.username);
            window.sessionStorage.setItem("adminPhotoUrl",result.obj.photoUrl);
            //2.通过编程式导航跳转到后台主页
            this.$router.push("/home");
          }
        }
      });
    }
  }
};
</script>
<style lang='less' scoped>
//scoped表示样式只在该页面生效
.login_container {
  background-color: white;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #2b4b6b;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.btns {
  display: flex;
  justify-content: flex-end;
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
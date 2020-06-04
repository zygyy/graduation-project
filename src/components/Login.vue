<template>
  <div class="homepage-hero-module">
    <div class="video-container">
      <div class="filter"></div>
      <video
        autoplay
        loop
        muted
        playsinline
        src="../assets/pic/Down_by_the_River.mp4"
        class="fillWidth"
      ></video>
      <div class="poster hidden">
        <img src alt />
      </div>

      <div class="login_container">
        <div class="login_box">
          <div class="avatar_box">
            <img src="../assets/pic/logo.png" alt />
          </div>
          <el-form
            ref="loginFromRef"
            :rules="loginFromRules"
            :model="loginFrom"
            label-width="0px"
            class="login_form"
          >
            <el-form-item prop="username">
              <el-input v-model="loginFrom.username" prefix-icon="iconfont icon-user"></el-input>
            </el-form-item>
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
    </div>
  </div>
</template>

<script>
import $ from "jquery";
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
  created() {
    // jQuery is required to run this code
    $(document).ready(function() {
      scaleVideoContainer();

      initBannerVideoSize(".video-container .poster img");
      initBannerVideoSize(".video-container .filter");
      initBannerVideoSize(".video-container video");

      $(window).on("resize", function() {
        scaleVideoContainer();
        scaleBannerVideoSize(".video-container .poster img");
        scaleBannerVideoSize(".video-container .filter");
        scaleBannerVideoSize(".video-container video");
      });
    });

    function scaleVideoContainer() {
      var height = $(window).height() + 5;
      var unitHeight = parseInt(height) + "px";
      $(".homepage-hero-module").css("height", unitHeight);
    }

    function initBannerVideoSize(element) {
      $(element).each(function() {
        $(this).data("height", $(this).height());
        $(this).data("width", $(this).width());
      });

      scaleBannerVideoSize(element);
    }

    function scaleBannerVideoSize(element) {
      var windowWidth = $(window).width(),
        windowHeight = $(window).height() + 5,
        videoWidth,
        videoHeight;

      // console.log(windowHeight);
      $(element).each(function() {
        var videoAspectRatio = $(this).data("height") / $(this).data("width");
        $(this).width(windowWidth);
        if (windowWidth < 1000) {
          videoHeight = windowHeight;
          videoWidth = videoHeight / videoAspectRatio;
          $(this).css({
            "margin-top": 0,
            "margin-left": -(videoWidth - windowWidth) / 2 + "px"
          });
          $(this)
            .width(videoWidth)
            .height(videoHeight);
        }
        $(".homepage-hero-module .video-container video").addClass(
          "fadeIn animated"
        );
      });
    }
  },
  methods: {
    //重置操作
    resetLoginForm() {
      //清空表单内容
      this.$refs.loginFromRef.resetFields();
      this.loginFrom.username = "";
      this.loginFrom.password = "";
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
            window.sessionStorage.setItem("token", result.obj.token);
            window.sessionStorage.setItem("adminEmpId", result.obj.empId);
            window.sessionStorage.setItem("adminName", result.obj.name);
            window.sessionStorage.setItem("adminPhone", result.obj.phone);
            window.sessionStorage.setItem("adminAddress", result.obj.address);
            window.sessionStorage.setItem("adminUsername", result.obj.username);
            window.sessionStorage.setItem("adminPhotoUrl", result.obj.photoUrl);
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

//视频

.homepage-hero-module {
  border-right: none;
  border-left: none;
  position: relative;
}

.no-video .video-container video,
.touch .video-container video {
  display: none;
}

.no-video .video-container .poster,
.touch .video-container .poster {
  display: block !important;
}

.video-container {
  position: relative;
  bottom: 0%;
  left: 0%;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background: #000;
}

.video-container .poster img {
  width: 100%;
  bottom: 0;
  position: absolute;
}

.video-container .filter {
  z-index: 100;
  position: absolute;
  background: rgba(0, 0, 0, 0.4);
  width: 100%;
}

.video-container video {
  position: absolute;
  z-index: 0;
  bottom: 0;
}

.video-container video.fillWidth {
  width: 100%;
}
</style>
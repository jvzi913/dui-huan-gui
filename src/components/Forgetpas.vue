<template>
  <div id="forgetpas">
    <div class="login-left-img">
      <img src="../assets/img/login/loginBg.png" alt="">
    </div>
    <div class="login-right">
      <div class="login-logo" :style="loginLogo"></div>
      <div class="login-sign" :style="loginSign"></div>
      <div class="sign-infor">
        <el-form ref="form" :model="form">
          <el-form-item label-width="auto">
            <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
            <span class="iconfont5">&#xe604;</span>
          </el-form-item>
          <el-form-item label-width="auto">
            <el-input v-model="form.code" placeholder="请输入验证码"></el-input>
            <span class="iconfont5">&#xe60e;</span>
            <div id="forget-code">
              <div class="iconfont5 iconfont2">&#xe605;</div>
              <el-button type="default" :disabled="codeDisabled" class="getCode" @click="getCode">{{codeTipstext}}</el-button>
            </div>
          </el-form-item>
          <el-form-item label-width="auto">
            <el-input type="password" v-model="form.pws" placeholder="请输入新密码"></el-input>
            <span class="iconfont5 iconfont1">&#xe60c;</span>
          </el-form-item>
          <div class="forget-tips" @click="gotoLogin">去登录</div>
          <el-form-item>
            <el-button type="primary" @click="onSubmit" class="ok">确定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

  </div>
</template>

<script>
// 正则验证邮箱
var checkemail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
export default {
  name: 'forgetpas',
  data () {
    return {
      loginLogo: {
        backgroundImage: 'url(' + require('../assets/img/login/logo.png') + ')',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%'
      },
      loginSign: {
        backgroundImage: 'url(' + require('../assets/img/login/forget.png') + ')',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%'
      },
      form: {
        email: '',
        code: '',
        pws: ''
      },
      codeDisabled: false,
      codeTipstext: '获取验证码',
      counts: 60,
      emailCode: '',
      usId: 0
    }
  },
  methods: {
    settime () {
      var that = this
      if (that.counts == 0) {
        that.codeDisabled = false
        that.codeTipstext = '获取验证码'
        that.counts = 60
        return false
      } else {
        that.codeDisabled = true
        that.codeTipstext = '重新发送(' + that.counts + ')s'
        that.counts--
      }
      setTimeout(function () {
        that.settime()
      }, 1000)
    },
    getCode () {
      var that = this
      if (that.form.email == '') {
        that.$message({
          message: '请输入需要验证的邮箱！',
          customClass: 'myMessage'
        })
      } else if (!checkemail.test(that.form.email)) {
        that.$message({
          message: '请输入正确的邮箱地址！',
          customClass: 'myMessage'
        })
      } else {
        that.settime()
        that.$axios({
          url: that.$globalAPI + 'user/forgetPassword',
          method: 'post',
          params: {
            usEmail: that.form.email
          }
        }).then(function (res) {
          if (res.data.code == 0) {
            that.emailCode = res.data.emailCode
            that.usId = res.data.usId
          } else {
            that.$message({
              message: res.data.msg,
              customClass: 'myMessage'
            })
          }
        }).catch(function (error) {
          console.log(error)
        })
      }
    },
    onSubmit () {
      var that = this
      if (that.form.code != '' && that.form.pws != '') {
        if (that.form.code != that.emailCode) {
          that.$message({
            message: '请输入正确的验证码！',
            customClass: 'myMessage'
          })
        } else {
          that.$axios({
            url: that.$globalAPI + 'user/updatePassword',
            method: 'post',
            params: {
              usId: that.usId,
              code: that.form.code,
              newPassword: that.form.pws
            }
          }).then(function (res) {
            that.$message({
              message: res.data.msg,
              customClass: 'myMessage'
            })
            if (res.data.code == 0) {
              setTimeout(function () {
                that.$router.push('/Login')
              }, 2000)
            }
          }).catch(function (error) {
            console.log(error)
          })
        }
      } else if (that.form.code == '') {
        that.$message({
          message: '请先验证您的邮箱地址！',
          customClass: 'myMessage'
        })
      } else if (that.form.pws == '') {
        that.$message({
          message: '请重置您的登录密码！',
          customClass: 'myMessage'
        })
      } else {
        that.$message({
          message: '请您核对需要填写的信息！',
          customClass: 'myMessage'
        })
      }
    },
    gotoLogin () {
      this.$router.push('/Login')
    }
  }
}
</script>

<style>
  body {
    padding: 0;
    margin: 0;
  }

  img {
    width: 100%;
    height: 100%;
  }
</style>
<style scoped>
  #forgetpas {
    display: flex;
  }

  .login-left-img {
    width: 67%;
    height: 100vh;
  }

  .login-right {
    width: 32%;
    height: 100vh;
  }

  .login-logo {
    margin: 0 auto;
    margin-top: 20%;
    width: 80%;
    height: 0.4rem;
  }

  .login-sign {
    margin: 0 auto;
    margin-top: 3%;
    width: 25%;
    height: 0.32rem;
  }

  .sign-infor {
    margin: 0 auto;
    margin-top: 8%;
    width: 75%;
  }

  .el-form-item {
    margin: 0 !important;
    padding: 0 !important;
    padding-bottom: 0.3rem !important;
  }

  /deep/ .el-input__inner {
    position: relative;
    padding-left: 0.55rem;
    height: 0.7rem;
  }

  .iconfont5 {
    font-family: "iconfont" !important;
    font-size: 0.28rem;
    font-style: normal;
    color: #4a66e5;
    position: absolute;
    left: 0.15rem;
    color: #4a66e5;
    line-height: 0.7rem !important;
  }

  .iconfont1 {
    position: absolute;
    left: 0.1rem;
    font-size: 0.32rem !important;
  }

  .iconfont2 {
    line-height: 0.58rem !important;
  }

  .forget-tips {
    cursor: pointer;
    padding-right: 0.1rem;
    margin-top: -0.2rem;
    margin-bottom: 0.4rem;
    text-align: right;
    font-size: 0.18rem;
    color: #ccc;
  }

  #forget-code {
    position: absolute;
    right: 0.05rem;
    top: 0;
    bottom: 0;
    margin: auto;
    width: 42%;
    height: 80%;
  }

  /deep/ .el-form-item__content {
    margin-left: 0 !important;
  }

  .el-button {
    height: 0.7rem;
    width: 100%;
  }

  .getCode {
    border: 0 !important;
    height: 100%;
    color: #4584ee;
  }

  .getCode:focus,
  .getCode:hover {
    background-color: transparent;
  }
</style>

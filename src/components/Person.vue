<template>
  <div id="person">
    <div class="teacher-search">
      <div style="font-size: 0.24rem!important;line-height: 0.9rem;margin-left:0.2rem;font-weight: bolder;">个人信息</div>
    </div>
    <div class="teacher-container">
      <el-form ref="form" :model="form" :rules="rules" label-width="90px" class="teacher-dia-mid person-dia-mid">
        <el-form-item label="姓名:" class="teacher-dia-mid-item" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="性别:" class="teacher-dia-mid-item">
          <el-radio v-model="form.radio" label="1">男</el-radio>
          <el-radio v-model="form.radio" label="2">女</el-radio>
        </el-form-item>
        <el-form-item label="年龄:" class="teacher-dia-mid-item" prop="age">
          <el-input v-model="form.age" placeholder="请输入年龄"></el-input>
        </el-form-item>
        <el-form-item label="民族:" class="teacher-dia-mid-item" prop="nation">
          <el-input v-model="form.nation" placeholder="请输入民族"></el-input>
        </el-form-item>
        <el-form-item label="身份证号:" class="teacher-dia-mid-item" prop="idnum">
          <el-input v-model="form.idnum" placeholder="请输入身份证号"></el-input>
        </el-form-item>
        <el-form-item label="手机号:" class="teacher-dia-mid-item" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="邮箱:" class="teacher-dia-mid-item" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱地址"></el-input>
        </el-form-item>
        <el-form-item label="办公电话:" class="teacher-dia-mid-item">
          <el-input v-model="form.tel" placeholder="请输入办公电话"></el-input>
        </el-form-item>
        <el-form-item label="登录账号:" class="teacher-dia-mid-item" prop="account">
          <el-input v-model="form.account" placeholder="请设置登录账号"></el-input>
        </el-form-item>
        <el-form-item label="登录密码:" class="teacher-dia-mid-item" prop="paw">
          <el-input type="password" v-model="form.paw" placeholder="请设置登录密码"></el-input>
        </el-form-item>
      </el-form>
      <div class="person-footer">
        <el-button @click="reset">取 消</el-button>
        <el-button type="primary" @click="changePerson">修 改</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    inject: ['reload'],
    name: 'person',
    data() {
      return {
        form: {
          name: '',
          age: '',
          radio: '1',
          nation: '',
          idnum: '',
          phone: '',
          email: '',
          tel: '',
          account: '',
          paw: ''
        },
        rules: {
          name: [{
            required: true,
            message: '请输入姓名',
            trigger: 'blur'
          }],
          age: [{
            required: true,
            message: '请输入年龄',
            trigger: 'blur'
          }],
          nation: [{
            required: true,
            message: '请输入民族',
            trigger: 'blur'
          }],
          idnum: [{
            required: true,
            message: '请输入身份证号',
            trigger: 'blur'
          }],
          email: [{
            required: true,
            message: '请输入邮箱地址',
            trigger: 'blur'
          }],
          phone: [{
              required: true,
              message: '请输入手机号码',
              trigger: 'blur'
            },
            {
              validator: function(rule, value, callback) {
                if (/^1[34578]\d{9}$/.test(value) == false) {
                  callback(new Error('请输入正确的手机号'))
                } else {
                  callback()
                }
              },
              trigger: ['blur', 'change']
            }
          ],
          account: [{
            required: true,
            message: '请输入登录账号',
            trigger: 'blur'
          }],
          paw: [{
              required: true,
              message: '密码不能为空',
              trigger: 'blur'
            },
            {
              min: 6,
              message: '长度需大于6个字符',
              trigger: 'blur'
            }
          ]
        }
      }
    },
    mounted() {
      this.getUserinfo()
    },
    methods: {
      reset() {
        this.reload()
      },
      getUserinfo() {
        var usId = JSON.parse(localStorage.getItem('userInfo')).usId
        var that = this
        that.$axios({
          url: that.$globalAPI + 'user/getUserinfo',
          method: 'get',
          params: {
            usId: usId
          }
        }).then(function(res) {
          if (res.data.code == 0) {
            that.form.name = res.data.data.usName
            if (res.data.data.usSex == 1) {
              that.form.radio = '1'
            } else {
              that.form.radio = '2'
            }
            that.form.age = res.data.data.usAge
            that.form.nation = res.data.data.usNation
            that.form.idnum = res.data.data.usIdentity
            that.form.phone = res.data.data.usPhone
            that.form.email = res.data.data.usEmail
            that.form.tel = res.data.data.usTelephone
            that.form.account = res.data.data.usAccount
            that.form.paw = res.data.data.usPassword
          }
        }).catch(function(error) {
          console.log(error)
        })
      },
      changePerson() {
        var that = this
        that.$refs['form'].validate((valid) => {
          if (!valid) {
            that.$message({
              message: '请先填入正确的内容！',
              customClass: 'myMessage'
            })
          } else {
            var usId = JSON.parse(localStorage.getItem('userInfo')).usId
            that.$axios({
              url: that.$globalAPI + 'user/updateUserinfo',
              method: 'put',
              params: {
                usId: usId,
                usName: that.form.name,
                usSex: that.form.radio,
                usAge: that.form.age,
                usNation: that.form.nation,
                usIdentity: that.form.idnum,
                usEmail: that.form.email,
                usPhone: that.form.phone,
                usTelephone: that.form.tel,
                usAccount: that.form.account,
                usPassword: that.form.paw
              }
            }).then(function(res) {
              that.$message({
                message: res.data.msg,
                customClass: 'myMessage'
              })
              if (res.data.code == 0) {
                that.resetSetItem('userInfo', JSON.stringify(res.data.user));
                setTimeout(function() {
                  that.reload()
                }, 2000)
              }
            }).catch(function(error) {
              console.log(error)
            })
          }
        })
      }
    }
  }
</script>

<style scoped>
  .person-dia-mid {
    padding-top: 0.2rem;
  }

  .person-footer {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 1rem;
  }

  .person-footer .el-button {
    height: 0.5rem;
  }
</style>

<template>
  <div class="leftslide">
    <el-container>
      <el-aside>
        <div class="index-logo">
          <img src="../assets/img/index/logo.png" alt="" class="index-logo-img">
        </div>
        <el-menu ref='menu' :collapse-transition="false" :default-active="$route.path" class="el-menu-vertical-demo"
          @select="handleOpen" router text-color="#fff" active-text-color="#fff">
          <template v-for="item in menuList">
            <el-menu-item :index="item.path" :key="item.id" v-if="item.children==null">
              <i class="iconfont" :class="item.icon"></i>
              <span slot="title">{{item.name}}</span>
            </el-menu-item>
            <el-submenu :index="item.path" v-if="item.children!=null">
              <template slot="title">
                <i class="iconfont" :class="item.icon"></i>
                <span>{{item.name}}</span>
              </template>
              <el-menu-item-group :key="item1.id" v-for="item1 in item.children">
                <template slot="title">
                  <i class="iconfont" :class="item1.icon"></i>
                  <span>{{item1.name}}</span>
                </template>
                <el-menu-item :index="item2.path" :key="item2.id" class="student-item" v-for="item2 in item1.children">
                  <span style="padding-left: 0.4rem;">{{item2.name}}</span>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </template>

        </el-menu>
      </el-aside>
      <el-container class="index-container">
        <el-header>
          <div class="index-header-img" :style="loginLogo"></div>
          <div class="index-header-right">
            <span class="index-header-right-name">欢迎您：<span class="header-usname">{{personName}}</span></span>
            <i class="iconfont3" style="margin-right: 15px;font-size: 0.22rem;" @click="dialogVisible=true">&#xe606;</i>
          </div>
        </el-header>

        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
    <el-dialog title="登出系统" :visible.sync="dialogVisible" width="25%" :before-close="handleClose" destroy-on-close>
      <div class="tips-content">您确定要登出系统吗？</div>
      <span slot="footer" class="dialog-footer all-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="exit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'leftslide',
    data() {
      return {
        loginLogo: {
          backgroundImage: 'url(' + require('../assets/img/login/logo.png') + ')',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%'
        },
        usId: 0,
        personName: '',
        dialogVisible: false,
        menuList: [],
        pathArray: [],
        readyData: {
          path: '',
          title: ''
        },
      }
    },
    mounted() {
      var that = this;
      that.usId = JSON.parse(localStorage.getItem('userInfo')).usId;
      that.getMenuList()
      setTimeout(function() {
        that.personName = JSON.parse(localStorage.getItem('userInfo')).usName;
      }, 500)
    },
    created() {
      var that = this;
      window.addEventListener('setItem', () => {
        that.personName = JSON.parse(localStorage.getItem('userInfo')).usName;
      })
    },
    methods: {
      getMenuList() {
        var that = this
        that.$axios({
          url: that.$globalAPI + 'menu/getMenuList',
          method: 'get',
          params: {
            usId: that.usId
          }
        }).then(function(res) {
          if (res.data.code == 0) {
            that.menuList = res.data.data
          }
        }).catch(function(error) {
          console.log(error)
        })
      },
      exit() {
        var that = this
        localStorage.removeItem('userInfo')
        setTimeout(function() {
          that.dialogVisible = false
          that.$router.push('/Login')
        }, 1000)
      },
      handleOpen(key, keyPath) {
        var that = this
        // that.readyData = {}
        // setTimeout(function() {
        //   that.readyData.path = key
        //   that.readyData.title = that.$route.meta.title
        //   if (JSON.stringify(that.pathArray).indexOf(JSON.stringify(that.readyData)) == -1) {
        //     that.pathArray.push(that.readyData)
        //   }
        // }, 500)
      },
      // getId(id) {
      //   this.$router.push({
      //     path: `/Student/${id}`
      //   })
      // },
      handleClose(done) {}
    }
  }
</script>

<style>
  body {
    padding: 0;
    margin: 0;
    background-color: #eaf1ff;
  }
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-aside {
    width: 15.8% !important;
    height: 100vh;
    background: linear-gradient(to bottom, #4a66e5, #6f63fb);
  }

  .index-logo {
    width: 100%;
    height: 22%;
  }

  .index-logo-img {
    width: 1.52rem;
    height: 1.52rem;
    margin: 0.3rem 0.75rem;
  }

  .el-menu {
    background-color: transparent !important;
    border-right: none !important;
    font-size: 0.26rem !important;
  }

  .el-menu-item:hover,
  .el-menu-item.is-active,
  .el-submenu__title.is-active {
    background-color: #3a7efa !important;
  }

  /deep/.el-menu-item-group .el-menu-item-group__title {
    background-color: #676cff !important;
    height: 0.45rem;
    line-height: 0.45rem;
    font-size: 0.14rem;
    color: #fff !important;
  }

  /deep/.el-menu-item-group .el-menu-item-group__title:hover {
    background-color: #3a7efa !important;
  }

  /deep/.el-submenu .el-submenu__title:hover {
    background-color: #3a7efa !important;
  }

  .student-item {
    background-color: #7276fe;
  }

  /deep/ .el-submenu__title i {
    color: #fff;
  }
  /deep/ .el-submenu__icon-arrow{
    margin-top: -5px;
  }
  /deep/ .el-dialog__headerbtn .el-dialog__close {
    color: #7276fe;
    background-color: rgba(255,255,255,.6);
    border-radius: 50%;
  }

  .index-container {
    width: 84% !important;
    height: 100vh;
  }

  .el-header {
    margin: auto;
    margin-top: 0.05rem;
    /* padding: 0 0.2rem; */
    width: 96%;
    color: #333;
    line-height: 0.65rem;
    background-color: #fff;
    border-radius: 0.1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .index-header-img {
    width: 45%;
    height: 0.45rem;
  }

  .index-header-right {
    font-size: 0.16rem;
  }

  .index-header-right-name {
    font-weight: bolder;
    font-size: 0.20rem;
    margin-right: 0.1rem;
  }

  .header-usname {
    font-size: 0.16rem;
    color: #3a7efa !important;
  }

  .el-main {
    padding: 0 !important;
    margin: 0 auto;
    margin-top: 0.08rem;
    width: 96%;
    border-radius: 0.1rem;
  }

  .tips-content {
    margin-bottom: 0.2rem !important;
  }

  .all-footer .el-button {
    padding: 0;
    width: 0.95rem !important;
    text-align: center !important;
    height: 0.55rem;
    line-height: 0.55rem;
  }
</style>

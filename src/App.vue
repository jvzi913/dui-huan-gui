<template>
  <div id="app">
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
  export default {
    name: 'app',
    provide() {
      return {
        reload: this.reload
      }
    },
    data() {
      return {
        isRouterAlive: true
      }
    },
    methods: {
      reload() {
        this.isRouterAlive = false
        this.$nextTick(function() {
          this.isRouterAlive = true
        })
      }
    }
  }
</script>

<style>
  body .el-table th.gutter {
    display: table-cell !important;
  }

  .teacher-search {
    margin-bottom: 0.05rem;
    width: 100%;
    height: 0.9rem;
    background-color: #fff;
    border-radius: 0.1rem;
    display: flex;
    justify-content: space-between;
  }

  .teacher-search-left,
  .teacher-search-btn {
    height: 100%;
    display: flex;
    align-items: center;
  }

  .teacher-search-left {
    margin-left: 0.2rem;
  }

  .teacher-search-left .el-button,
  .teacher-search-left .el-input {
    margin-right: 0.15rem;
    background-color: #4a66e5;
    color: #fff;
  }

  .teacher-search-left .el-input {
    background-color: transparent;
  }

  /deep/.teacher-search-left .el-input input::-webkit-input-placeholder {
    color: #333 !important;
  }

  .teacher-search-btn {
    margin-right: 0.2rem;
  }

  .teacher-search-btn .el-button:first-child {
    background-color: #4a66e5;
    color: #fff;
  }

  .teacher-search-btn .el-button:last-child:focus {
    background-color: transparent;
  }

  .teacher-container {
    width: 100%;
    height: 100%;
    border-radius: 0.1rem;
    background-color: #fff;
    overflow-y: scroll;
  }

  .teacher-container .el-table {
    max-height: 68vh;
  }

  .el-pagination {
    width: 100%;
    height: 0.4rem;
    margin-right: 0.2rem;
    text-align: right;
    float: right;
    margin-top: 0.5rem;
  }

  /deep/.el-pagination .number {
    background-color: #fff !important;
    border: 1px solid #ccc;
    font-weight: normal !important;
  }

  /deep/.el-pagination .number.active {
    background-color: #4a66e5 !important;
    border: 1px solid #ccc;
    font-weight: normal !important;
  }

  ::-webkit-scrollbar {
    display: none;
  }

  .teacher-dia-mid {
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 92%;
  }

  .teacher-dia-mid-item {
    width: 49.5%;
    height: 0.45rem;
  }

  /deep/.teacher-dia-mid-item input {
    background-color: #f4f7ff !important;
    border: 1px solid #c0d2ff !important;
  }

  /deep/.teacher-dia-mid-item .el-radio {
    margin-right: 0.2rem !important;
  }

  /deep/.teacher-dia-mid-item .el-radio:first-child {
    margin-left: 0.15rem !important;
  }

  .el-dialog__header {
    padding: 0 0.2rem !important;
    background: #4a66e5;
    height: 0.6rem !important;
    line-height: 0rem !important;
  }

  .el-dialog__title {
    color: #fff !important;
    font-size: 0.14rem;
  }

  .el-dialog__headerbtn {
    margin-top: -0.05rem !important;
  }

  .el-dialog__footer {
    height: 1rem;
    display: flex !important;
    justify-content: center;
    line-height: 0rem !important;
    margin: -0.3rem !important;
  }

  .dialog-footer {
    margin: -0.05rem !important;
  }

  .dialog-footer .el-button {
    width: 2rem !important;
  }

  .dialog-footer .el-button:first-child {
    border: 1px solid #4994fb;
    color: #4994fb;
  }

  .dialog-footer .el-button:last-child {
    background-color: #4a66e5;
  }

  .ope-btn {
    color: #4a66e5 !important;
    font-size: 0.14rem;
  }

  .ope-btn-del {
    color: #222 !important;
    font-size: 0.14rem;
  }

  .required {
    color: #ff0000;
  }

  .noData {
    padding: 0.5rem 0;
    width: 100%;
    font-size: 0.14rem;
    text-align: center;
  }
</style>
<style lang="less">
  .myMessage {
    font-size: 0.22rem !important;
  }
</style>

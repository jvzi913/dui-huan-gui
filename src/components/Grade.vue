<template>
  <div id="grade">
    <div class="teacher-search">
      <div class="teacher-search-left">
        <el-button size="medium" @click="openAdd">+新增</el-button>
        <el-input size="medium" v-model="gradeName" placeholder="年级名称"></el-input>
      </div>
      <div class="teacher-search-btn">
        <el-button size="medium" @click="searchList()">搜索</el-button>
        <el-button size="medium" @click="resetSearch()">重置</el-button>
      </div>
    </div>
    <div class="teacher-container">
      <el-table :data="tableData"  v-if="tableData.length>0" style="width: 100%" stripe height="95%">
        <el-table-column type="index" label="序号" align="center" width="60">
        </el-table-column>
        <el-table-column prop="grName" label="年级名称" align="center">
        </el-table-column>
        <el-table-column prop="grCreateDate" label="创建时间" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text"><span class="ope-btn"><span class="iconfont3">&#xe65c;</span>修改</span></el-button>
            <el-popconfirm title="您确认要删除该年级(包含班级及班级下的学生)的所有信息吗？" @confirm="confirmDel(scope.row)">
              <el-button slot="reference" type="text"><span class="ope-btn-del"><span class="iconfont-del">&#xe69b;</span>删除</span></el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background layout="total,prev, pager, next,jumper" :page-size="pageSize" :current-page="pageNo"
        :total="gradeTotal" @current-change="getPageList" v-if="tableData.length>0">
      </el-pagination>
      <div class="noData" v-if="tableData.length<=0">暂无更多~</div>
      <el-dialog :title="title" :visible.sync="dialogVisible" width="55%" :before-close="handleClose" destroy-on-close>
        <el-form ref="form" :model="form" :rules="rules" label-width="90px" class="teacher-dia-mid grade-dia-mid">
          <el-form-item label="年级名称:" class="teacher-dia-mid-item grade-dia-mid-item" prop="name">
            <el-input v-model="form.name" placeholder="请输入年级名称"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="changeGrade">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  inject: ['reload'],
  name: 'grade',
  data () {
    return {
      pageNo: 1,
      pageSize: 10,
      gradeTotal: 0,
      gradeName: '',
      dialogVisible: false,
      tableData: [],
      title: '添加年级信息',
      form: {
        grId: 0,
        name: ''
      },
      rules: {
        name: [{
          required: true,
          message: '请输入教师姓名',
          trigger: 'blur'
        }]
      }
    }
  },
  mounted () {
    this.getGradeList()
  },
  methods: {
    getGradeList () {
      var that = this
      that.$axios({
        url: that.$globalAPI + 'grade/getGradeListPage',
        method: 'get',
        params: {
          pageNo: that.pageNo,
          pageSize: that.pageSize
        }
      }).then(function (res) {
        that.tableData = res.data.data
        that.gradeTotal = res.data.count
      }).catch(function (error) {
        console.log(error)
      })
    },
    getPageList (res) {
      var that = this
      that.pageNo = res
      setTimeout(function () {
        if (that.gradeName != '') {
          that.searchList()
        } else {
          that.getGradeList()
        }
      }, 500)
    },
    searchList () {
      var that = this
      that.pageNo = 1
      if (that.gradeName != '') {
        that.$axios({
          url: that.$globalAPI + 'grade/getGradeListPage',
          method: 'get',
          params: {
            gradeName: that.gradeName,
            pageNo: that.pageNo,
            pageSize: that.pageSize
          }
        }).then(function (res) {
          that.tableData = res.data.data
          that.gradeTotal = res.data.count
        }).catch(function (error) {
          console.log(error)
        })
      } else {
        that.$message({
          message: '请先输入您要查询的条件',
          customClass: 'myMessage'
        })
      }
    },
    openAdd () {
      this.dialogVisible = true
      this.form.grId = 0
      this.title = '添加年级信息'
    },
    resetSearch () {
      this.reload()
    },
    handleClick (row) {
      var that = this
      that.form.grId = row.grId
      that.dialogVisible = true
      that.form.name = row.grName
      that.title = '修改年级信息'
    },
    changeGrade () {
      var that = this
      that.$refs['form'].validate((valid) => {
        if (!valid) {
          that.$message({
            message: '请先填入正确的内容！',
            customClass: 'myMessage'
          })
        } else {
          if (that.form.grId != '0') {
            that.$axios({
              url: that.$globalAPI + 'grade/updateGrade',
              method: 'post',
              data: {
                grId: that.form.grId,
                grName: that.form.name
              }
            }).then(function (res) {
              that.$message({
                message: res.data.msg,
                customClass: 'myMessage'
              })
              if (res.data.code == 0) {
                setTimeout(function () {
                  that.reload()
                }, 2000)
              }
            }).catch(function (error) {
              console.log(error)
            })
          } else {
            that.$axios({
              url: that.$globalAPI + 'grade/addGrade',
              method: 'post',
              data: {
                grName: that.form.name
              }
            }).then(function (res) {
              that.$message({
                message: res.data.msg,
                customClass: 'myMessage'
              })
              if (res.data.code == 0) {
                setTimeout(function () {
                  that.reload()
                }, 2000)
              }
            }).catch(function (error) {
              console.log(error)
            })
          }
        }
      })
    },
    confirmDel (row) {
      var that = this
      that.$axios({
        url: that.$globalAPI + 'grade/deleteGradeById',
        method: 'DELETE',
        params: {
          grId: row.grId
        }
      }).then(function (res) {
        that.$message({
          message: res.data.msg,
          customClass: 'myMessage'
        })
        if (res.data.code == 0) {
          setTimeout(function () {
            that.reload()
          }, 2000)
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    handleClose (done) {
      this.form = {
        name: ''
      }
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped>
  .grade-dia-mid-item{
    width: 100%!important;
  }
  /deep/.teacher-dia-mid-item input{
    background-color: #f4f7ff!important;
    border: 1px solid #c0d2ff!important;
  }
</style>

<template>
  <div id="classes">
    <div class="teacher-search">
      <div class="teacher-search-left">
        <el-button size="medium" @click="openAdd">+新增</el-button>
        <el-input size="medium" v-model="gradeName" placeholder="年级名称"></el-input>
        <el-input size="medium" v-model="classesName" placeholder="班级名称"></el-input>
        <el-input size="medium" v-model="teacherName" placeholder="教师名称"></el-input>
      </div>
      <div class="teacher-search-btn">
        <el-button size="medium" @click="searchList()">搜索</el-button>
        <el-button size="medium" @click="resetSearch()">重置</el-button>
      </div>
    </div>
    <div class="teacher-container">
      <el-table :data="tableData" v-if="tableData.length>0" style="width: 100%" stripe height="95%">
        <el-table-column type="index" label="序号" align="center" width="60">
        </el-table-column>
        <el-table-column prop="gradeName" label="年级名称" align="center">
        </el-table-column>
        <el-table-column prop="clName" label="班级名称" align="center">
        </el-table-column>
        <el-table-column prop="teacherName" label="教师名称" align="center">
        </el-table-column>
        <el-table-column prop="studentCount" label="班级人数" align="center">
        </el-table-column>
        <el-table-column prop="totalIntegral" label="总积分" align="center">
        </el-table-column>
        <el-table-column prop="clCreateDate" label="创建时间" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row,2)" type="text"><span class="ope-btn"><span class="iconfont3">&#xe65c;</span>修改</span></el-button>
            <el-popconfirm title="您确认要删除该班级(包含班级下的学生)的所有信息吗？" @confirm="confirmDel(scope.row)">
              <el-button slot="reference" type="text"><span class="ope-btn-del"><span class="iconfont-del">&#xe69b;</span>删除</span></el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background layout="total,prev, pager, next,jumper" :page-size="pageSize" :current-page="pageNo"
        :total="teacherTotal" @current-change="getPageList" v-if="tableData.length>0">
      </el-pagination>
      <div class="noData" v-if="tableData.length<=0">暂无更多~</div>
      <el-dialog :title="title" :visible.sync="dialogVisible" width="55%" :before-close="handleClose" destroy-on-close>
        <el-form ref="form" :model="form" :rules="rules" label-width="90px" class="teacher-dia-mid">
          <el-form-item label="年级名称:" class="teacher-dia-mid-item">
            <el-select v-model="form.name" :disabled="disabled" placeholder="请选择年级名称" @change="selectGrade">
              <template v-for="item in gradeList">
                <el-option :label="item.grName" :value="item.grId"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="班级名称:" class="teacher-dia-mid-item" prop="name">
            <el-input v-model="form.classesUname" placeholder="请输入班级名称"></el-input>
          </el-form-item>
          <el-form-item label="教师名称:" class="teacher-dia-mid-item">
            <el-select v-model="form.teaUname" placeholder="请选择负责教师" @change="selectTeacher">
              <template v-for="item in teacherList">
                <el-option :label="item.teacherName" :value="item.teId"></el-option>
              </template>
            </el-select>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="changeClasses()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  inject: ['reload'],
  name: 'classes',
  data () {
    return {
      pageNo: 1,
      pageSize: 10,
      teacherTotal: 0,
      dialogVisible: false,
      gradeName: '',
      classesName: '',
      teacherName: '',
      disabled: true,
      title: '添加班级信息',
      tableData: [],
      gradeList: [],
      teacherList: [],
      form: {
        clId: 0,
        grId: 0,
        teId: 0,
        name: '',
        classesUname: '',
        teaUname: ''
      },
      rules: {
        name: [{
          required: true,
          message: '必填项不能为空',
          trigger: 'blur'
        }]
      }
    }
  },
  mounted () {
    this.getClassesList()
    this.getGrade()
    this.getTeacher()
  },
  methods: {
    getGrade () {
      var that = this
      that.$axios({
        url: that.$globalAPI + 'grade/getGradeList',
        method: 'get',
        params: {}
      }).then(function (res) {
        that.gradeList = res.data.data
      }).catch(function (error) {
        console.log(error)
      })
    },
    selectGrade (e) {
      this.form.grId = e
    },
    selectTeacher (e) {
      this.form.teId = e
    },
    getTeacher () {
      var that = this
      that.$axios({
        url: that.$globalAPI + 'user/getTeacherListAll',
        method: 'get',
        params: {}
      }).then(function (res) {
        that.teacherList = res.data.data
      }).catch(function (error) {
        console.log(error)
      })
    },
    getClassesList () {
      var that = this
      that.$axios({
        url: that.$globalAPI + 'classes/getClassesList',
        method: 'get',
        params: {
          pageNo: that.pageNo,
          pageSize: that.pageSize
        }
      }).then(function (res) {
        that.tableData = res.data.data
        that.teacherTotal = res.data.count
      }).catch(function (error) {
        console.log(error)
      })
    },
    getPageList (res) {
      var that = this
      that.pageNo = res
      setTimeout(function () {
        if (that.gradeName != '' || that.classesName != '' || that.teacherName != '') {
          that.searchList()
        } else {
          that.getClassesList()
        }
      }, 500)
    },
    searchList () {
      var that = this
      that.pageNo = 1
      if (that.gradeName != '' || that.classesName != '' || that.teacherName != '') {
        that.$axios({
          url: that.$globalAPI + 'classes/getClassesList',
          method: 'get',
          params: {
            gradeName: that.gradeName,
            classessName: that.classesName,
            teacherName: that.teacherName,
            pageNo: that.pageNo,
            pageSize: that.pageSize
          }
        }).then(function (res) {
          that.tableData = res.data.data
          that.teacherTotal = res.data.count
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
      this.form.clId = 0
      this.form.grId = 0
      this.form.teId = 0
      this.disabled = false
      this.title = '添加班级信息'
    },
    resetSearch () {
      this.reload()
    },
    handleClick (row) {
      var that = this
      that.form.clId = row.clId
      that.form.name = row.gradeName
      that.form.classesUname = row.clName
      that.form.teaUname = row.teacherName
      that.title = '修改班级信息'
      that.dialogVisible = true
    },
    changeClasses () {
      var that = this
      that.$refs['form'].validate((valid) => {
        if (!valid) {
          that.$message({
            message: '请先填入正确的内容！',
            customClass: 'myMessage'
          })
        } else {
          if (that.form.clId != '0') {
            that.$axios({
              url: that.$globalAPI + 'classes/updateClasses',
              method: 'post',
              data: {
                clId: that.form.clId,
                teId: that.form.teId,
                clName: that.form.classesUname
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
              url: that.$globalAPI + 'classes/addClasses',
              method: 'post',
              data: {
                grId: that.form.grId,
                teId: that.form.teId,
                clName: that.form.classesUname
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
        url: that.$globalAPI + 'classes/deleteClassesById',
        method: 'DELETE',
        params: {
          clId: row.clId
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
        usId: 0,
        name: '',
        age: '',
        radio: '1',
        nation: '',
        idnum: '',
        email: '',
        phone: '',
        tel: '',
        account: '',
        paw: ''
      }
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped>
  /deep/.teacher-dia-mid-item input {
    background-color: #f4f7ff !important;
    border: 1px solid #c0d2ff !important;
  }

  .el-select {
    width: 100% !important;
  }
</style>

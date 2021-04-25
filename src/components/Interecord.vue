<template>
  <div id="record">
    <div class="teacher-search">
      <div class="teacher-search-left">
        <el-input size="medium" v-model="points" placeholder="消费积分"></el-input>
        <el-select v-model="chooseType" placeholder="请选择积分分类">
          <template v-for="item in intetypeList">
            <el-option :label="item.inName" :value="item.inId"></el-option>
          </template>
        </el-select>
        <el-input size="medium" v-model="person" placeholder="学生名称"></el-input>
        <el-input size="medium" v-model="grade" placeholder="年级名称"></el-input>
        <el-input size="medium" v-model="classes" placeholder="班级名称"></el-input>
      </div>
      <div class="teacher-search-btn">
        <el-button size="medium" @click="searchList()">搜索</el-button>
        <el-button size="medium" @click="resetSearch()">重置</el-button>
      </div>
    </div>
    <div class="teacher-container">
      <el-table :data="tableData" v-if="tableData.length>0" id="export-table" style="width: 100%" stripe height="95%">
        <el-table-column type="index" label="序号" align="center" width="80">
        </el-table-column>
        <el-table-column prop="adIntegral" label="积分情况" align="center" sortable>
        </el-table-column>
        <el-table-column prop="initName" label="积分分类" align="center">
        </el-table-column>
        <el-table-column prop="userName" label="学生名称" align="center">
        </el-table-column>
        <el-table-column prop="gradeName" label="年级名称" align="center">
        </el-table-column>
        <el-table-column prop="classesName" label="班级名称" align="center">
        </el-table-column>
        <el-table-column prop="teacherName" label="教师名称" align="center">
        </el-table-column>
		<el-table-column prop="adRemark" label="备注" align="center"  width="200">
		</el-table-column>
        <el-table-column prop="adCreateDate" label="积分时间" align="center"  width="220">
        </el-table-column>
      </el-table>
      <el-pagination background layout="total,prev, pager, next,jumper" :page-size="pageSize" :current-page="pageNo"
        :total="teacherTotal" @current-change="getPageList" v-if="tableData.length>0">
      </el-pagination>
      <div class="noData" v-if="tableData.length<=0">暂无更多~</div>
    </div>
  </div>
</template>

<script>
export default {
  inject: ['reload'],
  name: 'record',
  data () {
    return {
      usId: 0,
      pageNo: 1,
      pageSize: 10,
      teacherTotal: 0,
      points: '',
      goods: '',
      person: '',
      grade: '',
      classes: '',
      tableData: [],
	  intetypeList: [],
	  chooseType: ''
    }
  },
  mounted () {
    this.usId = JSON.parse(localStorage.getItem('userInfo')).usId
    this.intetypeList = JSON.parse(localStorage.getItem('intetypeList'))
    this.getRecordList()
  },
  methods: {
    getRecordList () {
      var that = this
      that.$axios({
        url: that.$globalAPI + 'addscorerecord/getAddscorerecordList',
        method: 'get',
        params: {
          usId: that.usId,
          pageNo: that.pageNo,
          pageSize: that.pageSize
        }
      }).then(function (res) {
		  console.log(res)
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
        if (that.points != '' || that.chooseType != '' || that.person != '' || that.grade != '' || that.classes != '') {
          that.searchList()
        } else {
          that.getRecordList()
        }
      }, 500)
    },
    searchList () {
      var that = this
      that.pageNo = 1
      if (that.points != '' || that.chooseType != '' || that.person != '' || that.grade != '' || that.classes != '') {
        that.$axios({
          url: that.$globalAPI + 'addscorerecord/getAddscorerecordList',
          method: 'get',
          params: {
            usId: that.usId,
            integral: that.points,
            inId: that.chooseType,
            userName: that.person,
            gradeName: that.grade,
            classesName: that.classes,
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
    resetSearch () {
      this.reload()
    }
  }
}
</script>

<style scoped="scoped">
</style>

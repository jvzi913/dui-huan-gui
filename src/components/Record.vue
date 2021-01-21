<template>
  <div id="record">
    <div class="teacher-search">
      <div class="teacher-search-left">
        <el-button size="medium" @click="handleExport">↑导出</el-button>
        <el-input size="medium" v-model="points" placeholder="消费积分"></el-input>
        <el-input size="medium" v-model="goods" placeholder="兑换商品"></el-input>
        <el-input size="medium" v-model="person" placeholder="兑换人"></el-input>
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
        <el-table-column prop="exIntegral" label="消费积分" align="center" sortable>
        </el-table-column>
        <el-table-column prop="commodityName" label="兑换商品" align="center">
        </el-table-column>
        <el-table-column prop="userName" label="兑换人" align="center">
        </el-table-column>
        <el-table-column prop="gradeName" label="年级名称" align="center">
        </el-table-column>
        <el-table-column prop="classesName" label="班级名称" align="center">
        </el-table-column>
        <el-table-column prop="teacherName" label="教师名称" align="center">
        </el-table-column>
        <el-table-column prop="exCreateDate" label="创建时间" align="center">
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
      tableData: []
    }
  },
  mounted () {
    this.usId = JSON.parse(localStorage.getItem('userInfo')).usId
    this.getRecordList()
  },
  methods: {
    getRecordList () {
      var that = this
      that.$axios({
        url: that.$globalAPI + 'exchange/getExchangeList',
        method: 'get',
        params: {
          usId: that.usId,
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
        if (that.points != '' || that.goods != '' || that.person != '' || that.grade != '' || that.classes != '') {
          that.searchList()
        } else {
          that.getRecordList()
        }
      }, 500)
    },
    searchList () {
      var that = this
      that.pageNo = 1
      if (that.points != '' || that.goods != '' || that.person != '' || that.grade != '' || that.classes != '') {
        that.$axios({
          url: that.$globalAPI + 'exchange/getExchangeList',
          method: 'get',
          params: {
            usId: that.usId,
            integral: that.points,
            commodityName: that.goods,
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
    },
    handleExport () {
      this.$confirm('该操作将导出选中的数据，是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 导出
        require.ensure([], () => {
          const {
            export_json_to_excel
          } = require('@/assets/excel/Export2Excel') // 注意这个Export2Excel路径
          const tableHeader = ['消费积分', '兑换商品', '兑换人', '年级名称', '班级名称', '负责教师', '创建时间'] // 设置Excel表格的表头
          const filterVal = ['exIntegral', 'commodityName', 'userName', 'gradeName', 'classesName', 'teacherName', 'exCreateDate'] // 跟表格表头对应的绑定的prop
          let list = this.tableData // this.selectList为选中的要导出的数据，用filterTableData方法先处理一下数据格式(要进行深度拷贝，以免过滤的时候，影响页面上展示的数据)，再存到list
          let data = this.formatJson(filterVal, list)
          export_json_to_excel(tableHeader, data, '兑换记录信息表') // 最后一个是导出表格的名字
        })
      }).catch(() => {})
    },
    formatJson (filterVal, Data) {
      return Data.map(v => filterVal.map(j => v[j]))
    }
  }
}
</script>

<style>
</style>

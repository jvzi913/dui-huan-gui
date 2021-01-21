<template>
  <div id="goods">
    <div class="teacher-search">
      <div class="teacher-search-left">
        <!-- <el-button size="medium" @click="openAdd">+新增</el-button> -->
        <el-button size="medium" class="export" @click="handleExport">↑导出</el-button>
        <el-input size="medium" v-model="goodsName" placeholder="商品名称"></el-input>
        <el-input size="medium" v-model="needInte" placeholder="所需积分"></el-input>
      </div>
      <div class="teacher-search-btn">
        <el-button size="medium" @click="searchList()">搜索</el-button>
        <el-button size="medium" @click="resetSearch()">重置</el-button>
      </div>
    </div>
    <div class="teacher-container">
      <el-table :data="tableData" v-if="tableData.length>0" id="export-table" style="width: 100%" stripe height="95%"
      @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center">
        </el-table-column>
        <el-table-column prop="coXh" label="序号" align="center" width="60">
        </el-table-column>
        <el-table-column prop="coName" label="名称" align="center">
        </el-table-column>
        <el-table-column prop="coSlotName" label="货道名称" align="center">
        </el-table-column>
        <el-table-column prop="coIndex" label="货道号" align="center">
        </el-table-column>
        <el-table-column prop="coStatusH" label="货道状态" align="center">
        </el-table-column>
        <el-table-column prop="coCount" label="当前库存" align="center">
        </el-table-column>
        <el-table-column label="商品图片" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.coImgSrc" width="40" height="40" class="head_pic" />
          </template>
        </el-table-column>
        <el-table-column prop="coIntegral" label="所需积分" align="center" sortable width="150">
        </el-table-column>
        <el-table-column prop="coUpdateDate" label="修改时间" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row,1)" type="text"><span class="ope-btn"><span class="iconfont3">&#xe67f;</span>查看</span></el-button>
            <el-button @click="handleClick(scope.row,2)" type="text"><span class="ope-btn"><span class="iconfont3">&#xe65c;</span>修改</span></el-button>
            <!-- <el-popconfirm title="您确认要删除该商品的信息吗？" @confirm="confirmDel(scope.row)">
              <el-button slot="reference" type="text"><span class="ope-btn-del"><span class="iconfont-del">&#xe69b;</span>删除</span></el-button>
            </el-popconfirm> -->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background layout="total,prev, pager, next,jumper" :page-size="pageSize" :current-page="pageNo"
        :total="teacherTotal" @current-change="getPageList" v-if="tableData.length>0">
      </el-pagination>
      <div class="noData" v-if="tableData.length<=0">暂无更多~</div>
      <el-dialog :title="title" :visible.sync="dialogVisible" width="55%" :before-close="handleClose" destroy-on-close>
        <el-form ref="form" :model="form" :rules="rules" label-width="90px" class="teacher-dia-mid">
          <el-form-item label="名称:" class="teacher-dia-mid-item" prop="name">
            <el-input v-model="form.name" placeholder="请输入商品名称"></el-input>
          </el-form-item>
          <el-form-item label="库存:" class="teacher-dia-mid-item" prop="goodsStock">
            <el-input v-model="form.goodsStock" placeholder="请输入当前库存"></el-input>
          </el-form-item>
          <el-form-item label="大小:" class="teacher-dia-mid-item" prop="goodsSize">
            <el-input v-model="form.goodsSize" placeholder="请输入商品大小"></el-input>
          </el-form-item>
          <el-form-item label="颜色:" class="teacher-dia-mid-item" prop="goodsColor">
            <el-input v-model="form.goodsColor" placeholder="请输入商品颜色"></el-input>
          </el-form-item>
          <el-form-item label="所需积分:" class="teacher-dia-mid-item" prop="needInte">
            <el-input type="number" v-model="form.needInte" placeholder="请输入商品所需积分"></el-input>
          </el-form-item>
          <el-form-item label="货道名称:" class="teacher-dia-mid-item">
            <el-input disabled v-model="form.loadName"></el-input>
          </el-form-item>
          <el-form-item label="货道号:" class="teacher-dia-mid-item">
            <el-input disabled v-model="form.loadNum"></el-input>
          </el-form-item>
          <el-form-item label="货道状态:" class="teacher-dia-mid-item">
            <el-input disabled v-model="form.loadStatus"></el-input>
          </el-form-item>
          <el-form-item label="容量:" class="teacher-dia-mid-item">
            <el-input disabled v-model="form.oversize" placeholder="请输入最大容量"></el-input>
          </el-form-item>
          <el-form-item label="图片:" class="teacher-dia-mid-item" v-if="footerBtn==false">
            <img :src="uploadFile[0].url" alt="" class="watchImg" v-if="uploadFile.length>0" @click="handlePictureCardPreview()">
          </el-form-item>
          <el-form-item label="图片:" class="teacher-dia-mid-item goods-dia-mid-item" v-if="footerBtn==true">
            <el-upload ref="upload" :action="uploadUrl" list-type="picture-card" :auto-upload="false" :file-list="uploadFile"
              :multiple="false" accept="image/jpeg,image/gif,image/png" :on-change="handleChange" :on-success="handleSuccess">
              <i slot="default" class="el-icon-plus"></i>
              <div slot="file" :slot-scope="uploadFile[0]" v-if="uploadFile.length>0">
                <img class="el-upload-list__item-thumbnail" :src="uploadFile[0].url" alt="">
                <span class="el-upload-list__item-actions">
                  <span class="el-upload-list__item-preview" @click="handlePictureCardPreview()">
                    <i class="el-icon-zoom-in"></i>
                  </span>
                  <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove()">
                    <i class="el-icon-delete"></i>
                  </span>
                </span>
              </div>
            </el-upload>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer" v-if="footerBtn==true">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="changeTeacher()">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="查看图片详情" :visible.sync="dialogVisible1" style="height: 85vh;margin-top: 0.5rem;">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  inject: ['reload'],
  name: 'goods',
  data () {
    return {
      pageNo: 1,
      pageSize: 10,
      teacherTotal: 0,
      dialogVisible: false,
      goodsName: '',
      needInte: '',
      tableData: [],
      footerBtn: false,
      isChange: false,
      title: '',
      fileList: [],
      form: {
        coId: 0,
        name: '',
        goodsSize: '',
        goodsColor: '',
        needInte: '',
        loadNum: '',
        loadName: '',
        loadStatus: '',
        goodsStock: '',
        oversize: ''
      },
      rules: {
        name: [{
          required: true,
          message: '请输入商品名称',
          trigger: 'blur'
        }],
        needInte: [{
          required: true,
          message: '请输入商品所需积分',
          trigger: 'blur'
        }],
        goodsSize: [{
          required: true,
          message: '请输入商品大小尺寸',
          trigger: 'blur'
        }],
        goodsColor: [{
          required: true,
          message: '请输入商品颜色',
          trigger: 'blur'
        }],
        goodsStock: [{
          required: true,
          message: '请添加商品数量',
          trigger: 'blur'
        }]
      },
      // 文件上传部分
      dialogImageUrl: '',
      dialogVisible1: false,
      disabled: false,
      uploadFile: [],
      uploadUrl: this.$globalAPI + 'Commodity/upload',
      selectList: [] // 导出
    }
  },
  mounted () {
    this.getGoodsList()
  },
  methods: {
    getGoodsList () {
      var that = this
      that.$axios({
        url: that.$globalAPI + 'Commodity/getCommodityInfoList',
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
        if (that.goodsName != '' || that.needInte != '') {
          that.searchList()
        } else {
          that.getGoodsList()
        }
      }, 500)
    },
    searchList () {
      var that = this
      that.pageNo = 1
      if (that.goodsName != '' || that.needInte != '') {
        that.$axios({
          url: that.$globalAPI + 'Commodity/getCommodityInfoList',
          method: 'get',
          params: {
            coName: that.goodsName,
            coIntegral: that.needInte,
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
    handleClick (row, status) {
      var that = this
      that.dialogVisible = true
      that.form.coId = row.coId
      that.form.name = row.coName
      var goodsImg = {}
      that.uploadFile = []
      goodsImg.url = row.coImgSrc
      that.uploadFile.push(goodsImg)
      that.form.goodsSize = row.coSize
      that.form.goodsColor = row.coColor
      that.form.needInte = row.coIntegral
      that.form.loadNum = row.coIndex
      that.form.loadName = row.coSlotName
      that.form.loadStatus = row.coStatusH
      that.form.goodsStock = row.coCount
      that.form.oversize = row.coMaxcount
      if (status == 1) {
        that.title = '查看商品信息'
      } else if (status == 2) {
        that.title = '修改商品信息'
        that.footerBtn = true
      }
    },
    changeTeacher () {
      var that = this
      that.$refs['form'].validate((valid) => {
        if (!valid) {
          that.$message({
            message: '请先填入正确的内容！',
            customClass: 'myMessage'
          })
        } else if (that.uploadFile.length <= 0) {
          that.$message({
            message: '请选择上传商品图片！',
            customClass: 'myMessage'
          })
        } else {
          var coImgSrc
          if (that.isChange == false) {
            coImgSrc = that.uploadFile[0].url
          } else {
            coImgSrc = that.uploadFile[0].response.data
          }
          var usId = JSON.parse(localStorage.getItem('userInfo')).usId;
          setTimeout(function(){
            that.$axios({
              url: that.$globalAPI + 'Commodity/updateCommodityInfo',
              method: 'post',
              params: {
                coId: that.form.coId,
                usId: usId,
                coName: that.form.name,
                coImgSrc: coImgSrc,
                coSize: that.form.goodsSize,
                coColor: that.form.goodsColor,
                coIntegral: that.form.needInte,
                coCount: that.form.goodsStock
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
          },500)
        }
      })
    },
    // confirmDel(row) {
    //   var that = this;
    //   console.log(row);
    //   that.$axios({
    //     url: that.$globalAPI + 'Commodity/deleteCommodityInfo',
    //     method: 'DELETE',
    //     params: {
    //       coId: row.coId
    //     },
    //   }).then(function(res) {
    //     console.log(res);
    //     that.$message(res.data.msg);
    //     if (res.data.code == 0) {
    //       setTimeout(function() {
    //         that.reload();
    //       }, 2000)
    //     }
    //   }).catch(function(error) {
    //     console.log(error);
    //   });
    // },
    handleClose (done) {
      this.form = {
        coId: 0,
        name: '',
        goodsSize: '',
        goodsColor: '',
        needInte: '',
        loadNum: '',
        loadName: '',
        loadStatus: '',
        goodsStock: '',
        oversize: ''
      }
      this.footerBtn = false
      this.isChange = false
      this.dialogVisible = false
    },
    handleChange (file, fileList) {
      var aa = fileList.slice(-1)
      this.uploadFile = []
      this.uploadFile.push(aa[0])
      var that = this
      setTimeout(function () {
        that.$refs.upload.submit()
      }, 1000)
    },
    handleSuccess (response, file, fileList) {
      var that = this
      if (response.code == 0) {
        that.isChange = true
        var goodsImg = {}
        that.uploadFile = []
        goodsImg.url = response.data
        that.uploadFile.push(goodsImg)
      } else {
        that.$message({
          message: response.msg,
          customClass: 'myMessage'
        })
      }
    },
    handleRemove (file) {
      this.uploadFile = []
    },
    handlePictureCardPreview () {
      this.dialogImageUrl = this.uploadFile[0].url
      this.dialogVisible1 = true
    },
    handleSelectionChange (row) {
      this.selectList = row // 将选中的数据给selectList
    },
    handleExport () {
      if (this.selectList.length === 0) {
        this.$message({
          message: '请至少选择一条需要导出的数据',
          type: 'warning',
          customClass: 'myMessage'
        })
        return
      }
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
          const tableHeader = ['商品名称', '货道名称', '货道号', '货道状态', '当前库存', '所需积分', '创建时间'] // 设置Excel表格的表头
          const filterVal = ['coName', 'coSlotName', 'coIndex', 'coStatusH', 'coCount', 'coIntegral', 'coCreateDate'] // 跟表格表头对应的绑定的prop
          let list = this.selectList// this.selectList为选中的要导出的数据，用filterTableData方法先处理一下数据格式(要进行深度拷贝，以免过滤的时候，影响页面上展示的数据)，再存到list
          let data = this.formatJson(filterVal, list)
          export_json_to_excel(tableHeader, data, '商品信息表') // 最后一个是导出表格的名字
        })
      }).catch(() => {})
    },
    formatJson (filterVal, Data) {
      return Data.map(v => filterVal.map(j => v[j]))
    }

  }
}
</script>

<style scoped>
  .export {
    margin-left: 0rem !important;
  }

  .teacher-search-left .el-input,
  .teacher-search-left .el-select {
    width: 20% !important;
    margin-right: 0.2rem !important;
  }

  /deep/.teacher-dia-mid-item input {
    background-color: #f4f7ff !important;
    border: 1px solid #c0d2ff !important;
  }

  .goods-dia-mid-item .el-input {
    width: 72.5%;
  }

  .goods-dia-mid-item .el-upload {
    margin: 0 !important;
    margin-top: -0.45rem !important;
    padding: 0 !important;
    width: 0.45rem;
    height: 0.45rem;
    font-size: 0.4rem !important;
    background-color: #f4f7ff !important;
    border: 1px solid #c0d2ff !important;
    color: #ccc;
  }

  .teacher-dia-mid-item .el-select {
    width: 100% !important;
  }

  .head_pic {
    width: 0.5rem !important;
    height: 0.5rem !important;
  }

  /deep/.el-upload--picture-card {
    width: 0.8rem;
    height: 0.8rem;
  }

  /deep/ .el-upload {
    padding-top: 0.05rem;
    width: 0.8rem;
    height: 0.8rem;
    line-height: 0.8rem;
  }

  /deep/ .el-upload-list--picture-card .el-upload-list__item {
    width: 0.8rem;
    height: 0.8rem;
    line-height: 0.8rem;
  }

  /deep/ .el-upload-list--picture-card .el-upload-list__item-thumbnail {
    width: 0.8rem;
    height: 0.8rem;
    line-height: 0.8rem;
  }

  /deep/ .avatar {
    width: 0.8rem;
    height: 0.8rem;
  }

  /deep/.el-upload-list__item-delete {
    margin-left: -0.02rem !important;
  }

  .watchImg {
    width: 0.8rem;
    height: 0.8rem;
    border: 1px solid #c0d2ff !important;
  }
</style>

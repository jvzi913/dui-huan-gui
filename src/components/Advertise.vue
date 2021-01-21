<template>
  <div id="advert">
    <div class="teacher-search">
      <div class="teacher-search-left">
        <!-- <el-button size="medium" @click="dialogVisible=true">+新增</el-button> -->
        <el-input size="medium" v-model="advName" placeholder="广告名称"></el-input>
        <el-input size="medium" v-model="advContent" placeholder="广告内容"></el-input>
        <el-input size="medium" v-model="advFormat" placeholder="格式"></el-input>
        <el-input size="medium" v-model="advFilename" placeholder="文件名称"></el-input>
      </div>
      <div class="teacher-search-btn">
        <el-button size="medium" @click="searchList()">搜索</el-button>
        <el-button size="medium" @click="resetSearch()">重置</el-button>
      </div>
    </div>
    <div class="teacher-container">
      <el-table :data="tableData" v-if="tableData.length>0" style="width: 100%" stripe height="95%">
        <el-table-column prop="adXh" label="序号" align="center" width="60">
        </el-table-column>
        <el-table-column prop="adName" label="广告名称" align="center">
        </el-table-column>
        <el-table-column prop="adContent" label="广告内容" align="center">
        </el-table-column>
        <el-table-column prop="adSize" label="大小" align="center">
        </el-table-column>
        <el-table-column prop="adFileFormat" label="格式" align="center">
        </el-table-column>
        <el-table-column prop="adFileName" label="文件名称" align="center">
        </el-table-column>
        <el-table-column prop="adUpdateDate" label="修改时间" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text"><span class="ope-btn"><span class="iconfont3">&#xe65c;</span>修改</span></el-button>
            <!-- <el-button @click="handleClick(scope.row,3)" type="text"><span class="ope-btn-del"><span class="iconfont-del">&#xe69b;</span>删除</span></el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background layout="total,prev, pager, next,jumper" :page-size="pageSize" :current-page="pageNo"
        :total="teacherTotal" @current-change="getPageList" v-if="tableData.length>0">
      </el-pagination>
      <div class="noData" v-if="tableData.length<=0">暂无更多~</div>
      <el-dialog title="修改广告信息" :visible.sync="dialogVisible" width="55%" :before-close="handleClose" destroy-on-close>
        <el-form ref="form" :model="form" :rules="rules" label-width="90px" class="teacher-dia-mid">
          <el-form-item label="广告名称:" class="teacher-dia-mid-item" prop="advName">
            <el-input v-model="form.advName" placeholder="请输入广告名称"></el-input>
          </el-form-item>
          <el-form-item label="上传文件:" class="teacher-dia-mid-item goods-dia-mid-item">
            <el-upload ref="upload" :action="uploadUrl" list-type="picture-card" :auto-upload="false" :file-list="uploadFile"
              :multiple="false" accept="image/jpeg,image/gif,image/png,video/mp4" :on-change="handleChange" :on-success="handleSuccess">
              <i slot="default" class="el-icon-plus"></i>
              <div slot="file" :slot-scope="uploadFile[0]" v-if="uploadFile.length>0">
                <video class="" :src="uploadFile[0].url" v-if="fileFomatter=='.mp4'"></video>
                <img class="el-upload-list__item-thumbnail" :src="uploadFile[0].url" alt="" v-if="fileFomatter=='.jpeg'||'.jpg'||'.gif'||'.png'">
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
          <el-form-item label="广告内容:" class="teacher-dia-mid-item adv-dia-mid-item" prop="advContent">
            <el-input type="textarea" v-model="form.advContent" placeholder="请输入广告内容"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="changeAdv">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="查看图片/视频详情" :visible.sync="dialogVisible1" style="height: 85vh;margin-top: 0.5rem;">
        <video width="100%" :src="dialogImageUrl"  v-if="fileFomatter=='.mp4'" autoplay controls></video>
        <img width="100%" :src="dialogImageUrl" alt="" v-if="fileFomatter=='.jpeg'||'.jpg'||'.gif'||'.png'">
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  inject: ['reload'],
  name: 'advert',
  data () {
    return {
      pageNo: 1,
      pageSize: 10,
      teacherTotal: 0,
      dialogVisible: false,
      isChange : false,
      advName: '',
      advContent: '',
      advFormat: '',
      advFilename: '',
      tableData: [],
      form: {
        adId: 0,
        advName: '',
        advFile: '',
        advContent: '',
        adSize:''
      },
      rules: {
        advName: [{
          required: true,
          message: '请输入广告名称',
          trigger: 'blur'
        }],
        advContent: [{
          required: true,
          message: '请输入广告内容',
          trigger: 'blur'
        }]
      },
      fileFomatter: '',
      // 文件上传部分
      dialogImageUrl: '',
      dialogVisible1: false,
      disabled: false,
      uploadFile: [],
      uploadUrl: this.$globalAPI + 'Advertising/upload'
    }
  },
  mounted () {
    this.getAdvList()
  },
  methods: {
    getAdvList () {
      var that = this
      that.$axios({
        url: that.$globalAPI + 'Advertising/getAdvertisingInfoList',
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
        if (that.advName != '' || that.advContent != '' || that.advFormat != '' || that.advFilename != '') {
          that.searchList()
        } else {
          that.getAdvList()
        }
      }, 500)
    },
    searchList () {
      var that = this
      that.pageNo = 1
      if (that.advName != '' || that.advContent != '' || that.advFormat != '' || that.advFilename != '') {
        that.$axios({
          url: that.$globalAPI + 'Advertising/getAdvertisingInfoList',
          method: 'get',
          params: {
            adName: that.advName,
            adContent: that.advContent,
            adFileFormat: that.advFormat,
            adFileName: that.advFilename,
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
    handleClick (row) {
      var that = this
      that.dialogVisible = true
      that.form.adId = row.adId
      that.form.adSize = row.adSize
      that.form.advName = row.adName
      that.form.advContent = row.adContent
      that.fileFomatter = row.adFileFormat
      var goodsImg = {}
      that.uploadFile = [];
      goodsImg.url = row.adFileSrc
      that.uploadFile.push(goodsImg)
    },
    changeAdv () {
      var that = this
      that.$refs['form'].validate((valid) => {
        if (!valid) {
          that.$message({
            message: '请先填入正确的内容！',
            customClass: 'myMessage'
          })
        } else if (that.uploadFile.length <= 0) {
          that.$message({
            message: '请选择上传广告文件！',
            customClass: 'myMessage'
          })
        } else {
          var adSize,adFileSrc,adFileName,adFileFormat;
          if(that.isChange==false){
            adSize=that.form.adSize;
            adFileSrc = that.uploadFile[0].url;
            adFileName = that.form.advName;
            adFileFormat = that.fileFomatter;
          }else{
            adSize=that.uploadFile[0].response.data.adSize;
            adFileSrc = that.uploadFile[0].response.data.fileUrl;
            adFileName = that.uploadFile[0].response.data.adFileName;
            adFileFormat = that.uploadFile[0].response.data.adFileFormat;
          }
          var usId = JSON.parse(localStorage.getItem('userInfo')).usId;
          setTimeout(function(){
            that.$axios({
              url: that.$globalAPI + 'Advertising/updateCommodityInfo',
              method: 'post',
              params: {
                adId: that.form.adId,
                adUpdateBy: usId,
                adName: that.form.advName,
                adContent: that.form.advContent,
                adSize: adSize,
                adFileSrc: adFileSrc,
                adFileName: adFileName,
                adFileFormat: adFileFormat
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
        that.isChange = true;
        var goodsImg = {}
        that.uploadFile = []
        goodsImg.url = response.data.fileUrl
        that.fileFomatter = response.data.adFileFormat
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
    handleClose (done) {
      this.form = {
        adId: 0,
        advName: '',
        advFile: '',
        advContent: '',
        adSize:''
      }
      this.fileFomatter='';
      this.isChange=false;
      this.dialogVisible = false;
    }
  }
}
</script>

<style scoped>
  /deep/.teacher-dia-mid-item input{
    background-color: #f4f7ff!important;
    border: 1px solid #c0d2ff!important;
  }
  .adv-dia-mid-item{
    width: 100%!important;
  }
  /deep/.adv-dia-mid-item textarea{
    height: 0.7rem;
    resize: none;
    background-color: #f4f7ff!important;
    border: 1px solid #c0d2ff!important;
  }
  .goods-dia-mid-item .el-input{
    width: 73.6%;
  }
  .goods-dia-mid-item .el-button{
    background-color: #b6b7ba;
    border: 1px solid #b6b7ba;
    color: #fff;
  }
  /deep/.el-upload--picture-card {
    width: 0.6rem;
    height: 0.6rem;
  }

  /deep/ .el-upload {
    padding-top: 0.05rem;
    width: 0.6rem;
    height: 0.6rem;
    line-height: 0.6rem;
  }

  /deep/ .el-upload-list--picture-card .el-upload-list__item {
    width: 0.6rem;
    height: 0.6rem;
    line-height: 0.6rem;
  }

  /deep/ .el-upload-list--picture-card .el-upload-list__item-thumbnail {
    width: 0.6rem;
    height: 0.6rem;
    line-height: 0.6rem;
  }

  /deep/ .avatar {
    width: 0.6rem;
    height: 0.6rem;
  }

  /deep/.el-upload-list__item-delete {
    margin-left: -0.02rem !important;
  }

  .watchImg {
    width: 0.6rem;
    height: 0.6rem;
    border: 1px solid #c0d2ff !important;
  }

</style>

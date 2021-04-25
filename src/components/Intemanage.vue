<template>
	<div id="inteManage">
		<div class="inteItem">
			<div class="teacher-search">
				<div class="teacher-search-left">
					<el-button size="medium" @click="openAdd">+新增分类</el-button>
				</div>
			</div>
			<div class="inteTypeList">
				<div class="typelistItem typelistItem1">
					<div>分类名称</div>
					<div>增加积分</div>
				</div>
				<div class="typelistItem" v-for="item in intetypeList" @click="changeType(item)">
					<div>{{item.inName}}</div>
					<div>{{item.inIntegral}}</div>
				</div>
			</div>
		</div>
		<div class="inteItem inteItem1">
			<div class="inteItem-item">
				<div class="inteTypeList inteTypeList1">
					<div class="typelistItem typelistItem1">
						<div>单日教师可增加积分上限</div>
						<div>单日教师可减少积分上限</div>
					</div>
					<div class="typelistItem">
						<div>
							<el-input v-model="totalMax"></el-input>
						</div>
						<div>
							<el-input v-model="totalMin"></el-input>
						</div>
					</div>
				</div>
				<div class="dialog-footer">
					<el-button @click="cancelSetting()">重 置</el-button>
					<el-button type="primary" @click="changeTypeinte(1)">修 改</el-button>
				</div>
			</div>
			<div class="inteItem-item">
				<div class="inteTypeList inteTypeList1">
					<div class="typelistItem typelistItem1">
						<div>单日学生可增加积分上限</div>
						<div>单日学生可减少积分上限</div>
					</div>
					<div class="typelistItem">
						<div>
							<el-input v-model="stuMax"></el-input>
						</div>
						<div>
							<el-input v-model="stuMin"></el-input>
						</div>
					</div>
				</div>
				<div class="dialog-footer">
					<el-button @click="cancelSetting()">重 置</el-button>
					<el-button type="primary" @click="changeTypeinte(2)">修 改</el-button>
				</div>
			</div>
		</div>
		<el-dialog :title="title" :visible.sync="dialogVisible" width="55%" :before-close="handleClose" destroy-on-close>
			<el-form ref="form" :model="inteItem" :rules="rules" label-width="90px" class="teacher-dia-mid">
				<el-form-item label="分类名称:" class="teacher-dia-mid-item" prop="inName">
					<el-input v-model="inteItem.inName" placeholder="请输入分类名称"></el-input>
				</el-form-item>
				<el-form-item label="增加积分:" class="teacher-dia-mid-item" prop="inIntegral">
					<el-input v-model="inteItem.inIntegral" placeholder="请输入可增加的积分数"></el-input>
				</el-form-item>
			</el-form>

			<span slot="footer" class="dialog-footer">
				<el-button @click="handleClose">取 消</el-button>
				<el-popconfirm
				  title="是否确认删除该积分新增分类？"
				  @confirm="delIntetype()"
				>
				  <el-button slot="reference" class="dele" v-if="isDel!=false">删 除</el-button>
				</el-popconfirm>
				<el-button type="primary" @click="changeIntetype()">确定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
export default {
  inject: ['reload'],
  name: 'inteManage',
  data () {
    return {
      title: '修改积分分类',
      dialogVisible: false,
      totalMax: 0,
      totalMin: 0,
      stuMax: 0,
      stuMin: 0,
      form: {
        typeName: '',
        typeInte: '',
        typeId: ''
      },
      rules: {
        inName: [{
          required: true,
          message: '请输入积分分类',
          trigger: 'blur'
        }],
        inIntegral: [{
          required: true,
          message: '请输入可增加积分数',
          trigger: 'blur'
        }]
      },
      intetypeList: [],
      inteItem: {
        inName: '',
        inId: '',
        inIntegral: ''
      },
      isDel: true
    }
  },
  mounted () {
    this.intetypeList = JSON.parse(localStorage.getItem('intetypeList'))
    this.getIntetype1()
  },
  methods: {
    getIntetype1 () {
      var that = this
      that.$axios({
        url: that.$globalAPI + 'limit/getLimitById',
        method: 'get',
        data: {}
      }).then(function (res) {
        that.totalMax = res.data.data.liTeacherup
        that.totalMin = res.data.data.liTeacherdown
        that.stuMax = res.data.data.liStudentup
        that.stuMin = res.data.data.liStudentdown
      }).catch(function (error) {
        console.log(error)
      })
    },
    handleClose () {
      var that = this
      that.inteItem = {}
      that.isDel = true
      that.title = '修改积分分类'
      that.dialogVisible = false
    },
    getIntetype () {
      var that = this
      that.$axios({
        url: that.$globalAPI + 'integralclassification/getIntegralClassificationList',
        method: 'get',
        params: {}
      }).then(function (res) {
        localStorage.setItem(
          'intetypeList',
          JSON.stringify(res.data.data)
        )
      }).catch(function (error) {
        console.log(error)
      })
    },
    changeIntetype () {
      var that = this
      if (that.inteItem.inName != '' && that.inteItem.inIntegral != '') {
        if (that.inteItem.inId != '') {
          that.$axios({
            url: that.$globalAPI + 'integralclassification/updateIntegralClassification',
            method: 'post',
            data: {
              inId: that.inteItem.inId,
              inName: that.inteItem.inName,
              inIntegral: that.inteItem.inIntegral
            }
          }).then(function (res) {
            that.$message({
              message: res.data.msg,
              customClass: 'myMessage'
            })
            if (res.data.code == 0) {
              that.getIntetype()
              setTimeout(function () {
                that.reload()
              }, 2000)
            }
          }).catch(function (error) {
            console.log(error)
          })
        } else {
          that.$axios({
            url: that.$globalAPI + 'integralclassification/addIntegralClassification',
            method: 'post',
            data: {
              inName: that.inteItem.inName,
              inIntegral: that.inteItem.inIntegral
            }
          }).then(function (res) {
            that.$message({
              message: res.data.msg,
              customClass: 'myMessage'
            })
            if (res.data.code == 0) {
              that.getIntetype()
              setTimeout(function () {
                that.reload()
              }, 2000)
            }
          }).catch(function (error) {
            console.log(error)
          })
        }
      } else {
        that.$message({
          message: '必填项不能为空！',
          customClass: 'myMessage'
        })
      }
    },
    delIntetype () {
      var that = this
      that.$axios({
		  url: that.$globalAPI + 'integralclassification/deleteIntegralClassificationById',
		  method: 'delete',
		  params: {
		    inId: that.inteItem.inId
		  }
      }).then(function (res) {
		  that.$message({
		    message: res.data.msg,
		    customClass: 'myMessage'
		  })
		  if (res.data.code == 0) {
		    that.getIntetype()
		    setTimeout(function () {
		      that.reload()
		    }, 2000)
		  }
      }).catch(function (error) {
		  console.log(error)
      })
    },
    openAdd () {
      this.title = '新增积分分类'
      this.isDel = false
      this.dialogVisible = true
    },
    cancelSetting () {
      this.reload()
    },
    changeType (inteItem) {
      this.inteItem = inteItem
      this.dialogVisible = true
    },
    changeTypeinte (status) {
      var that = this
      var datalist = {}
      if (status == 1) {
        datalist.liTeacherup = that.totalMax
        datalist.liTeacherdown = that.totalMin
      } else {
        datalist.liStudentup = that.stuMax
        datalist.liStudentdown = that.stuMin
      }
      setTimeout(function () {
        that.$axios({
          url: that.$globalAPI + 'limit/updateLimit',
          method: 'post',
          data: datalist
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
      }, 1000)
    }
  }
}
</script>

<style scoped>
	#inteManage {
		width: 100%;
		height: 60vh;
		display: flex;
		justify-content: space-between;
	}

	.inteItem {
		width: 49.7%;
		height: 100%;
		background-color: #fff;
		border-radius: 0.15rem;
	}

	.inteItem1 {
		position: relative;
		background-color: transparent;
	}

	.inteItem1 .inteItem-item:last-child {
		position: absolute;
		bottom: 0;
		left: 0;
	}

	.inteItem-item {
		width: 100%;
		height: 49.2%;
		border-radius: 0.15rem;
		background-color: #fff;
	}

	.inteTypeList {
		margin: 0 auto;
		width: 95%;
		height: 75%;
		overflow: scroll;
	}

	.inteTypeList1 {
		padding-top: 0.5rem;
		height: 48%;
	}

	.typelistItem {
		width: 100%;
		display: flex;
		justify-content: space-evenly;
		color: #777;
	}

	.typelistItem div {
		width: 50%;
		height: 0.4rem;
		line-height: 0.4rem;
		text-align: center;
		background-color: #f4f7ff;
		border: 1px solid #c0d2ff;
		font-size: 0.2rem;
		overflow-x: scroll;
		overflow-y: hidden;
	}

	.typelistItem div:last-child {
		border-left: 0;
	}

	.inteTypeList .typelistItem div {
		border-top: 0;
	}

	.inteTypeList .typelistItem:first-child div {
		border-top: 1px solid #c0d2ff;
	}

	.typelistItem1 {
		font-weight: bolder;
		font-size: 0.22rem;
		color: #000 !important;
	}

	/deep/.typelistItem div .el-input {
		width: 100%;
		height: 0.4rem;
		overflow-y: hidden;
	}

	/deep/.typelistItem div .el-input .el-input__inner {
		border: none !important;
		outline: none !important;
		height: 0.39rem !important;
		text-align: center;
		background-color: transparent;
	}

	.inteItem1 .dialog-footer {
		width: 30%;
		margin: 0 auto !important;
		height: 0.6rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.inteItem1 .dialog-footer .el-button {
		margin: 0 !important;
		width: 1rem !important;
		height: 0.45rem;
		line-height: 0rem;
	}

	.dele{
		color: orange!important;
		border: 1px solid orange!important;
		background-color: transparent!important;
	}
</style>

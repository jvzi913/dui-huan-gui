<template>
	<div id="teacher">
		<div class="teacher-search">
			<div class="teacher-search-left">
				<el-button size="medium" @click="openAdd">+新增</el-button>
				<el-input size="medium" v-model="usName" placeholder="姓名"></el-input>
				<el-input size="medium" v-model="usPhone" placeholder="手机号"></el-input>
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
				<el-table-column prop="usName" label="姓名" align="center">
				</el-table-column>
				<el-table-column prop="usSex" label="性别" :formatter="sexMethods" align="center">
				</el-table-column>
				<el-table-column prop="usAge" label="年龄" align="center">
				</el-table-column>
				<el-table-column prop="usNation" label="民族" align="center">
				</el-table-column>
				<el-table-column prop="usPhone" label="手机号" align="center">
				</el-table-column>
				<el-table-column prop="usEmail" label="邮箱" align="center">
				</el-table-column>
				<el-table-column prop="usTelephone" label="办公电话" align="center">
				</el-table-column>
				<el-table-column prop="usAccount" label="登录账号" align="center">
				</el-table-column>
				<el-table-column prop="usCreateDate" label="创建时间" align="center">
				</el-table-column>
				<el-table-column label="操作" align="center" width="200">
					<template slot-scope="scope">
						<el-button @click="handleClick(scope.row,1)" type="text"><span class="ope-btn"><span class="iconfont3">&#xe67f;</span>查看</span></el-button>
						<el-button @click="handleClick(scope.row,2)" type="text"><span class="ope-btn"><span class="iconfont3">&#xe65c;</span>修改</span></el-button>
						<el-popconfirm title="您确认要删除该教师的信息吗？" @confirm="confirmDel(scope.row)">
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
					<el-form-item label="邮箱:" class="teacher-dia-mid-item" prop="email">
						<el-input v-model="form.email" placeholder="请设置邮箱地址"></el-input>
					</el-form-item>
					<el-form-item label="手机号:" class="teacher-dia-mid-item" prop="phone">
						<el-input v-model="form.phone" placeholder="请输入手机号"></el-input>
					</el-form-item>
					<el-form-item label="办公电话:" class="teacher-dia-mid-item">
						<el-input v-model="form.tel" placeholder="请输入办公电话"></el-input>
					</el-form-item>
					<el-form-item label="登录账号:" class="teacher-dia-mid-item" prop="account">
						<el-input v-model="form.account" placeholder="请设置登录账号"></el-input>
					</el-form-item>
					<el-form-item label="登录密码:" class="teacher-dia-mid-item password" prop="paw">
						<el-input v-model="form.paw" placeholder="请设置登录密码"></el-input>
						<el-button @click="onekeyCreate()">一键生成</el-button>
					</el-form-item>
				</el-form>

				<span slot="footer" class="dialog-footer" v-if="footerBtn==true">
					<el-button @click="handleClose">取 消</el-button>
					<el-button type="primary" @click="changeTeacher()">确 定</el-button>
				</span>
			</el-dialog>
		</div>
	</div>
</template>

<script>
export default {
  inject: ['reload'],
  name: 'teacher',
  data () {
    return {
      pageNo: 1,
      pageSize: 10,
      teacherTotal: 0,
      dialogVisible: false,
      usName: '',
      usPhone: '',
      tableData: [],
      footerBtn: false,
      title: '添加教师信息',
      form: {
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
      },
      rules: {
        name: [{
          required: true,
          message: '请输入教师姓名',
          trigger: 'blur'
        }],
        age: [{
          required: true,
          message: '请输入教师年龄',
          trigger: 'blur'
        }],
        nation: [{
          required: true,
          message: '请输入教师民族',
          trigger: 'blur'
        }],
        idnum: [{
          required: true,
          message: '请输入教师身份证号',
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
          validator: function (rule, value, callback) {
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
          message: '请输入登录密码',
          trigger: ['change']
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
  mounted () {
    this.getTeacherList()
  },
  methods: {
    getTeacherList () {
      var that = this
      that.$axios({
        url: that.$globalAPI + 'user/getTeacherList',
        method: 'get',
        params: {
          usRole: 1,
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
        if (that.usName != '' || that.usPhone != '') {
          that.searchList()
        } else {
          that.getTeacherList()
        }
      }, 500)
    },
    sexMethods (sex) {
      return sex.usSex == 1 ? '男' : '女'
    },
    searchList () {
      var that = this
      that.pageNo = 1
      if (that.usName != '' || that.usPhone != '') {
        that.$axios({
          url: that.$globalAPI + 'user/getTeacherList',
          method: 'get',
          params: {
            usRole: 1,
            name: that.usName,
            usPhone: that.usPhone,
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
      this.footerBtn = true
      this.form.usId = 0
      this.title = '添加教师信息'
    },
    resetSearch () {
      this.reload()
    },
    handleClick (row, status) {
      var that = this
      that.form.usId = row.usId
      that.dialogVisible = true
      that.form.name = row.usName
      if (row.usSex == 1) {
        that.form.radio = '1'
      } else {
        that.form.radio = '2'
      }
      that.form.age = row.usAge
      that.form.nation = row.usNation
      that.form.idnum = row.usIdentity
      that.form.email = row.usEmail
      that.form.phone = row.usPhone
      that.form.tel = row.usTelephone
      that.form.account = row.usAccount
      that.form.paw = row.usPassword
      if (status == 1) {
        that.title = '查看教师信息'
      } else if (status == 2) {
        that.title = '修改教师信息'
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
        } else {
          if (that.form.usId != '0') {
            that.$axios({
              url: that.$globalAPI + 'user/updateUserinfo',
              method: 'put',
              params: {
                usId: that.form.usId,
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
              url: that.$globalAPI + 'user/addUserinfo',
              method: 'post',
              params: {
                usRole: 1,
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
        url: that.$globalAPI + 'user/deleteUserinfo',
        method: 'DELETE',
        params: {
          usId: row.usId
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
    onekeyCreate () {
      var arr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u',
        'v', 'w',
        'x', 'y', 'z', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
      ]
      var rand1 = Math.floor((Math.random() * 36))
      var rand2 = Math.floor((Math.random() * 36))
      var rand3 = Math.floor((Math.random() * 36))
      var rand4 = Math.floor((Math.random() * 36))
      var rand5 = Math.floor((Math.random() * 36))
      var rand6 = Math.floor((Math.random() * 36))
      var newPassword = arr[rand1] + arr[rand2] + arr[rand3] + arr[rand4] + arr[rand5] + arr[rand6]
      this.form.paw = newPassword
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
	html {
		font-size: 0.24rem !important;
	}

	/deep/.teacher-dia-mid-item input {
		background-color: #f4f7ff !important;
		border: 1px solid #c0d2ff !important;
	}

	.password {
		position: relative;
	}

	/* .password .el-input {
		width: 68.5%;
		margin: 0 !important;
	} */

	.password .el-button {
		position: absolute;
		top: 0;
		right: 0;
		/* margin: 0;
		margin-left: -0.05rem; */
		width: 31%;
		padding-left: 0;
		padding-right: 0;
		background-color: #0770F6;
		color: #fff;
	}
</style>

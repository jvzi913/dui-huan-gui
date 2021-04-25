<template>
	<div id="student">
		<div class="teacher-search">
			<div class="teacher-search-left">
				<el-button size="medium" @click="openAdd">+新增</el-button>
				<el-button size="medium" class="export" @click="handleExport">↑导出</el-button>
				<el-upload action="" :auto-upload="false" :show-file-list="false" accept=".xls,.xlsx" class="ceshi"
				 :on-change="importStudent">
					<el-button size="medium" type="success">+批量导入</el-button>
				</el-upload>
				<el-input size="medium" v-model="usName" placeholder="姓名"></el-input>
				<el-input size="medium" v-model="usSex" placeholder="性别"></el-input>
				<el-input size="medium" v-model="usNum" placeholder="学号"></el-input>
				<el-input size="medium" v-model="usInte" placeholder="积分数"></el-input>
			</div>
			<div class="teacher-search-btn">
				<el-button size="medium" @click="searchList()">搜索</el-button>
				<el-button size="medium" @click="resetSearch()">重置</el-button>
			</div>
		</div>
		<div class="teacher-container">
			<el-table :data="tableData" v-if="tableData.length>0" id="export-table" style="width: 100%" stripe @selection-change="handleSelectionChange">
				<el-table-column type="selection" align="center">
				</el-table-column>
				<el-table-column type="index" label="序号" align="center" width="50">
				</el-table-column>
				<el-table-column prop="usName" label="姓名" align="center">
				</el-table-column>
				<el-table-column prop="usSex" label="性别" align="center" :formatter="sexMethods" width="50">
				</el-table-column>
				<el-table-column prop="usAge" label="年龄" align="center">
				</el-table-column>
				<el-table-column prop="usNation" label="民族" align="center" width="50">
				</el-table-column>
				<el-table-column prop="usNumber" label="学号" align="center">
				</el-table-column>
				<el-table-column prop="usIntegral" label="当前积分" align="center" sortable width="100">
				</el-table-column>
				<el-table-column prop="exchangeCount" label="兑换记录" align="center" sortable width="100">
				</el-table-column>
				<el-table-column prop="usAccount" label="登录账号" align="center">
				</el-table-column>
				<el-table-column prop="usCreateDate" label="创建时间" align="center" width="120">
				</el-table-column>
				<el-table-column label="操作" align="center" width="280">
					<template slot-scope="scope">
						<el-button @click="handleClick(scope.row,1)" type="text"><span class="ope-btn"><span class="iconfont3">&#xe67f;</span>查看</span></el-button>
						<el-button @click="handleClick(scope.row,2)" type="text"><span class="ope-btn"><span class="iconfont3">&#xe65c;</span>修改</span></el-button>
						<el-button @click="handleClick(scope.row,3)" type="text"><span class="ope-btn"><span class="iconfont3">&#xe65c;</span>积分</span></el-button>
						<el-popconfirm title="您确认要删除该学生的个人信息吗？" @confirm="confirmDel(scope.row)">
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
					<el-form-item label="姓名:" class="teacher-dia-mid-item" prop="name" v-if="reason2==1">
						<el-input v-model="form.name" placeholder="请输入姓名"></el-input>
					</el-form-item>
					<el-form-item label="性别:" class="teacher-dia-mid-item" v-if="reason2==1">
						<el-radio v-model="form.radio" label="1">男</el-radio>
						<el-radio v-model="form.radio" label="2">女</el-radio>
					</el-form-item>
					<el-form-item label="年龄:" class="teacher-dia-mid-item" prop="age" v-if="reason2==1">
						<el-input v-model="form.age" placeholder="请输入年龄"></el-input>
					</el-form-item>
					<el-form-item label="学号:" class="teacher-dia-mid-item" prop="studentNum" v-if="reason2==1">
						<el-input v-model="form.studentNum" placeholder="请输入学号"></el-input>
					</el-form-item>
					<el-form-item label="民族:" class="teacher-dia-mid-item" prop="nation" v-if="reason2==1">
						<el-input v-model="form.nation" placeholder="请输入民族"></el-input>
					</el-form-item>
					<el-form-item label="当前积分:" class="teacher-dia-mid-item" prop="nowInte" v-if="reason2==2">
						<el-input-number v-model="form.nowInte" :min="0"></el-input-number>
					</el-form-item>
					<el-form-item label="积分分类:" class="teacher-dia-mid-item" v-if="reason2==2">
						<el-select v-model="form.changeReason" placeholder="请选择积分分类" @change="selectReason">
							<template v-for="item in intetypeList">
								<el-option :label="item.inName" :value="item.inId"></el-option>
							</template>
						</el-select>
					</el-form-item>
					<el-form-item label="其它备注:" class="teacher-dia-mid-item remarks" v-if="reason2==2">
						<el-input type="textarea" v-model="form.otherReason" placeholder="其它备注…"></el-input>
					</el-form-item>
					<el-form-item label="联系人:" class="teacher-dia-mid-item" prop="helpUsname" v-if="reason2==1">
						<el-input v-model="form.helpUsname" placeholder="请输入紧急联系人姓名"></el-input>
					</el-form-item>
					<el-form-item label="联系电话:" class="teacher-dia-mid-item" prop="helpPhone" v-if="reason2==1">
						<el-input v-model="form.helpPhone" placeholder="请输入紧急联系人电话"></el-input>
					</el-form-item>
					<el-form-item label="登录账号:" class="teacher-dia-mid-item" prop="account" v-if="reason2==1">
						<el-input v-model="form.account" placeholder="请设置登录账号"></el-input>
					</el-form-item>
					<el-form-item label="登录密码:" class="teacher-dia-mid-item" prop="paw" v-if="reason2==1">
						<el-input type="password" v-model="form.paw" placeholder="请设置登录密码"></el-input>
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
		name: 'student',
		mounted() {
			this.clId = this.$route.params.id
			this.getClassesUserList()
			this.usIdLs = JSON.parse(localStorage.getItem('userInfo')).usId;
			this.intetypeList = JSON.parse(localStorage.getItem('intetypeList'))
		},
		watch: {
			$route() {
				this.clId = this.$route.params.id
				this.getClassesUserList()
			}
		},
		data() {
			return {
				usIdLs: '',
				clId: 0,
				pageNo: 1,
				pageSize: 10,
				teacherTotal: 0,
				dialogVisible: false,
				usName: '',
				usSex: '',
				usNum: '',
				usInte: '',
				tableData: [],
				footerBtn: false,
				title: '添加人员信息',
				reason2: 1,
				form: {
					usId: 0,
					name: '',
					radio: '1',
					age: '',
					studentNum: '',
					nation: '',
					nowInte: '',
					changeReason: '',
					otherReason: '',
					reasonId: '',
					helpUsname: '',
					helpPhone: '',
					account: '',
					paw: ''
				},
				nochangeInte: '',
				rules: {
					name: [{
						required: true,
						message: '请输入姓名',
						trigger: 'blur'
					}],
					age: [{
						required: true,
						message: '请输入学生年龄',
						trigger: 'blur'
					}],
					studentNum: [{
						required: true,
						message: '请输入学生学号',
						trigger: ['blur', 'change']
					}],
					nation: [{
						required: true,
						message: '请输入学生民族',
						trigger: 'blur'
					}],
					nowInte: [{
						required: true,
						message: '请输入学生积分',
						trigger: ['blur', 'change']
					}],
					helpUsname: [{
						required: true,
						message: '请输入联系人姓名',
						trigger: ['blur', 'change']
					}],
					helpPhone: [{
							required: true,
							message: '请输入联系人手机号码',
							trigger: 'blur'
						},
						{
							validator: function(rule, value, callback) {
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
							message: '密码不能为空',
							trigger: 'blur'
						},
						{
							min: 6,
							message: '长度需大于6个字符',
							trigger: 'blur'
						}
					]
				},
				selectList: [],
				intetypeList: []
			}
		},
		methods: {
			getClassesUserList() {
				var that = this
				that.$axios({
					url: that.$globalAPI + 'user/getUserList',
					method: 'get',
					params: {
						clId: that.clId,
						pageNo: that.pageNo,
						pageSize: that.pageSize
					}
				}).then(function(res) {
					console.log(res)
					that.tableData = res.data.data
					that.teacherTotal = res.data.count
				}).catch(function(error) {
					console.log(error)
				})
			},
			getPageList(res) {
				var that = this
				that.pageNo = res
				setTimeout(function() {
					if (that.usName != '' || that.usSex != '' || that.usNum != '' || that.usInte != '') {
						that.searchList()
					} else {
						that.getClassesUserList()
					}
				}, 500)
			},
			sexMethods(sex) {
				return sex.usSex == 1 ? '男' : '女'
			},
			importStudent(file, fileList) {
				var that = this
				const fileReader = new FileReader()
				fileReader.readAsBinaryString(file.raw)
				fileReader.onload = (event) => {
					try {
						const data = event.target.result
						const infor = this.XLSX.read(data, {
							type: 'binary'
						})
						let sheet = Object.keys(infor.Sheets)[0]
						let arr = [];
						arr = this.XLSX.utils.sheet_to_json(infor.Sheets[sheet]) // 第一列为键名的数组对象
						if (arr.length > 0) {
							var arr1 = []
							arr.map(item => {
								arr1.push({ // 数据拼接 根据Excel表格定义好的sheet title
									usName: item['姓名'],
									sex: item['性别'],
									usAge: item['年龄'],
									usNation: item['民族'],
									usNumber: item['学号'],
									usAccount: item['登录账号'],
									usPassword: item['登录密码'],
									usContacts: item['联系人'],
									usContactsPhone: item['联系方式']
								})
							})
							setTimeout(function() {
								that.$axios({
									url: that.$globalAPI + 'user/addBatchUser',
									method: 'post',
									data: {
										clId: that.clId,
										userList: arr1
									}
								}).then(function(res) {
									that.$message({
										message: res.data.msg,
										customClass: 'myMessage'
									})
									if (res.data.code == 0) {
										setTimeout(function() {
											that.reload()
										}, 2000)
									}
								}).catch(function(error) {
									console.log(error)
								})
							}, 1000)
						}
					} catch (e) {
						that.$message({
							message: "请选择符合格式的导入文件！",
							customClass: 'myMessage'
						})
					}
				}
			},
			searchList() {
				var that = this
				that.pageNo = 1
				if (that.usName != '' || that.usSex != '' || that.usNum != '' || that.usInte != '') {
					if (that.usSex == '男' || that.usSex == '女' || that.usSex == '') {
						that.$axios({
							url: that.$globalAPI + 'user/getUserList',
							method: 'get',
							params: {
								clId: that.clId,
								name: that.usName,
								sex: that.usSex,
								usNumber: that.usNum,
								integral: that.usInte,
								pageNo: that.pageNo,
								pageSize: that.pageSize
							}
						}).then(function(res) {
							that.tableData = res.data.data
							that.teacherTotal = res.data.count
						}).catch(function(error) {
							console.log(error)
						})
					} else {
						that.$message({
							message: '学生性别男/女',
							customClass: 'myMessage'
						})
					}
				} else {
					that.$message({
						message: '请先输入您要查询的条件',
						customClass: 'myMessage'
					})
				}
			},
			openAdd() {
				this.dialogVisible = true
				this.footerBtn = true
				this.form.usId = 0
				this.title = '添加学生人员信息'
			},
			resetSearch() {
				this.reload()
			},
			selectReason(e) {
				this.form.reasonId = e
				var that = this
				that.$axios({
					url: that.$globalAPI + 'integralclassification/getIntegralClassificationById',
					method: 'get',
					params: {
						inId: e
					}
				}).then(function(res) {
					console.log(res.data)
					that.form.nowInte = that.nochangeInte + res.data.data.inIntegral
					console.log(that.form.nowInte)
				}).catch(function(error) {
					console.log(error)
				})
			},
			handleClick(row, status) {
				var that = this
				that.form.usId = row.usId
				that.form.name = row.usName
				if (row.usSex == 1) {
					that.form.radio = '1'
				} else {
					that.form.radio = '2'
				}
				that.form.age = row.usAge
				that.form.nation = row.usNation
				that.form.studentNum = row.usNumber
				that.form.nowInte = row.usIntegral
				that.nochangeInte = row.usIntegral
				that.form.helpUsname = row.usContacts
				that.form.helpPhone = row.usContactsPhone
				that.form.account = row.usAccount
				that.form.paw = row.usPassword
				if (status == 1) {
					that.title = '查看学生个人信息'
				} else if (status == 2) {
					that.title = '修改学生个人信息'
					that.footerBtn = true
				} else if (status == 3) {
					that.title = '修改学生积分信息'
					that.reason2 = 2
					that.footerBtn = true
				}
				that.dialogVisible = true
			},
			changeTeacher() {
				var that = this
				that.$refs['form'].validate((valid) => {
					if (!valid) {
						that.$message({
							message: '请先填入正确的内容(必填项不能为空)！',
							customClass: 'myMessage'
						})
					} else {
						if (that.form.usId != '0') {
							if (that.title == '修改学生个人信息') {
								that.$axios({
									url: that.$globalAPI + 'user/updateUserinfo',
									method: 'put',
									params: {
										usId: that.form.usId,
										usName: that.form.name,
										usSex: that.form.radio,
										usAge: that.form.age,
										usNation: that.form.nation,
										usNumber: that.form.studentNum,
										usContacts: that.form.helpUsname,
										usContactsPhone: that.form.helpPhone,
										usAccount: that.form.account,
										usPassword: that.form.paw
									}
								}).then(function(res) {
									that.$message({
										message: res.data.msg,
										customClass: 'myMessage'
									})
									if (res.data.code == 0) {
										setTimeout(function() {
											that.reload()
										}, 2000)
									}
								}).catch(function(error) {
									console.log(error)
								})
							} else {
								if (Number.isInteger(that.form.nowInte) == true) {
									that.$axios({
										url: that.$globalAPI + 'addscorerecord/updateIntegral',
										method: 'put',
										params: {
											usIdLs: that.usIdLs,
											usIdXs: that.form.usId,
											integral: that.form.nowInte,
											adRemark: that.form.otherReason,
											inId: that.form.changeReason,
										}
									}).then(function(res) {
										that.$message({
											message: res.data.msg,
											customClass: 'myMessage'
										})
										if (res.data.code == 0) {
											setTimeout(function() {
												that.reload()
											}, 2000)
										}
									}).catch(function(error) {
										console.log(error)
									})
								} else {
									that.$message({
										message: '积分数需设置为整数',
										customClass: 'myMessage'
									})
								}
							}

						} else {
							that.$axios({
								url: that.$globalAPI + 'user/addUserinfo',
								method: 'post',
								params: {
									usRole: 2,
									clId: that.clId,
									usName: that.form.name,
									usSex: that.form.radio,
									usAge: that.form.age,
									usNation: that.form.nation,
									usNumber: that.form.studentNum,
									usIntegral: that.form.nowInte,
									usContacts: that.form.helpUsname,
									usContactsPhone: that.form.helpPhone,
									usAccount: that.form.account,
									usPassword: that.form.paw
								}
							}).then(function(res) {
								that.$message({
									message: res.data.msg,
									customClass: 'myMessage'
								})
								if (res.data.code == 0) {
									setTimeout(function() {
										that.reload()
									}, 2000)
								}
							}).catch(function(error) {
								console.log(error)
							})
						}
					}
				})
			},
			confirmDel(row) {
				var that = this
				that.$axios({
					url: that.$globalAPI + 'user/deleteUserinfo',
					method: 'DELETE',
					params: {
						usId: row.usId
					}
				}).then(function(res) {
					that.$message({
						message: res.data.msg,
						customClass: 'myMessage'
					})
					if (res.data.code == 0) {
						setTimeout(function() {
							that.reload()
						}, 2000)
					}
				}).catch(function(error) {
					console.log(error)
				})
			},
			handleClose(done) {
				this.form = {
					usId: 0,
					name: '',
					radio: '1',
					age: '',
					studentNum: '',
					nation: '',
					nowInte: '',
					changeReason: '',
					otherReason: '',
					reasonId: '',
					helpUsname: '',
					helpPhone: '',
					account: '',
					paw: ''
				}
				this.reason2 = 1
				this.footerBtn = false
				this.dialogVisible = false
			},
			handleSelectionChange(row) {
				this.selectList = row // 将选中的数据给selectList
			},
			handleExport() {
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
						const tableHeader = ['姓名', '性别', '年龄', '民族', '学号', '当前积分', '兑换记录', '登录账号', '创建时间'] // 设置Excel表格的表头
						const filterVal = ['usName', 'usSex', 'usAge', 'usNation', 'usNumber', 'usIntegral',
							'exchangeCount', 'usAccount', 'usCreateDate'
						] // 跟表格表头对应的绑定的prop
						let list = this.filterTableData(JSON.parse(JSON.stringify(this.selectList))) // this.selectList为选中的要导出的数据，用filterTableData方法先处理一下数据格式(要进行深度拷贝，以免过滤的时候，影响页面上展示的数据)，再存到list
						let data = this.formatJson(filterVal, list)
						export_json_to_excel(tableHeader, data, '班级人员信息表') // 最后一个是导出表格的名字
					})
				}).catch(() => {})
			},
			formatJson(filterVal, Data) {
				return Data.map(v => filterVal.map(j => v[j]))
			},
			// 导出数据前对数据处理
			filterTableData(data) {
				data.forEach(item => {
					item.usSex = item.usSex == 1 ? '男' : '女' // 将导出的时间转换成'YYYY-MM-DD'格式
				})
				return data
			}
		}
	}
</script>

<style scoped>
	.export {
		margin-left: 0rem !important;
	}

	/deep/.teacher-dia-mid-item input {
		background-color: #f4f7ff !important;
		border: 1px solid #c0d2ff !important;
	}

	/deep/.el-input-number {
		width: 100% !important;
	}

	/deep/.el-select {
		width: 100% !important;
	}

	/deep/.el-upload .el-button {
		outline: none !important;
	}

	.remarks {
		width: 100%;
	}

	/deep/.el-textarea textarea {
		resize: none !important;
		background-color: #f4f7ff !important;
		border: 1px solid #c0d2ff !important;
	}
	.ceshi{
		margin-top: -0.105rem!important;
		font-size: 0.30rem!important;	
	}
	.el-button--success{
		border: none!important;
	}
	.el-button--success:focus, .el-button--success:hover {
		background-color: #4A66E5!important;
		border-color: #4A66E5!important;
	}
	/deep/.el-table::before{
		height: 0!important;
	}
</style>

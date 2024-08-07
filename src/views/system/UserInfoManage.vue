<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.userName" placeholder="用户名" style="width: 200px; margin-right: 20px"
                class="filter-item" @keyup.enter.native="doSearch"/>
      <el-select class="filter-item" clearable style="margin-right: 20px" v-model="listQuery.roles" multiple
                 collapse-tags filterable placeholder="请选择角色">
        <el-option
          v-for="item in allUserRoles"
          :key="item.code"
          :label="item.desc"
          :value="item.code">
        </el-option>
      </el-select>
      <el-button v-waves class="filter-item" style="margin-right: 10px" type="primary" icon="el-icon-search"
                 @click="doSearch">
        搜索
      </el-button>
      <el-button class="filter-item" type="success" icon="el-icon-plus" @click="openCreateDialog">
        创建用户
      </el-button>
    </div>

    <el-table
      stripe
      :header-cell-style="{background: '#409EFF',color: '#FFFFFF'}"
      :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;"
              width="100%">
      <el-table-column label="用户名" prop="userName" align="center" min-width="20%">
        <template slot-scope="{row}">
          <span>{{ row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" min-width="20%" align="center">
        <template slot-scope="{row}">
          <span><el-tag style="margin: 0 5px" v-for="(role) in row.roles">{{ roleMap[role] }}</el-tag></span>
        </template>
      </el-table-column>
      <el-table-column label="备注" min-width="20%" align="center">
        <template slot-scope="{row}">
          <span>{{ row.memo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="20%" align="center">
        <template slot-scope="{row}">
          <span>{{ formatDateTime(row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!=='deleted'" size="mini" icon="el-icon-delete" type="danger"
                     @click="handleDelete(row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize"
                @pagination="getList"/>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" center>
      <el-form ref="dataForm" :rules="addUserRules" :model="temp" label-position="left" label-width="80px" style="width: 400px; margin:0 auto;text-align: center">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="temp.userName"/>
        </el-form-item>
        <el-form-item label="角色" prop="roles">
          <el-select clearable style="margin-right: 20px" v-model="temp.roles" multiple
                     collapse-tags filterable placeholder="请选择角色">
            <el-option
              v-for="item in allUserRoles"
              :key="item.code"
              :label="item.desc"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="temp.password"/>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="temp.confirmPassword"/>
        </el-form-item>
        <el-form-item label="备注" prop="memo">
          <el-input v-model="temp.memo"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">
            取消
          </el-button>
          <el-button type="primary" @click="dialogStatus==='create'?addUser():updateData()">
            确认
          </el-button>
      </span>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" center>
      <el-form ref="dataForm" :rules="updateUserRules" :model="temp" label-width="80px"
               style="width: 400px; margin:0 auto;">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="temp.userName"/>
        </el-form-item>
        <el-form-item label="角色" prop="roles">
          <el-select clearable style="margin-right: 20px" v-model="temp.roles" multiple
                     collapse-tags filterable placeholder="请选择角色">
            <el-option
              v-for="item in allUserRoles"
              :key="item.code"
              :label="item.desc"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="temp.password" placeholder="不修改密码请留空"/>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input type="password" v-model="temp.confirmPassword" placeholder="不修改密码请留空"/>
        </el-form-item>
        <el-form-item label="备注" prop="memo">
          <el-input v-model="temp.memo"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
            取消
          </el-button>
          <el-button type="primary" @click="dialogStatus==='create'?addUser():updateData()">
            确认
          </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import {parseTime} from '@/utils'
import Pagination from '@/components/Pagination/index.vue'
import {addUserInfo, deleteUserInfo, listAllUserRoles, listUserInfo, updateUserInfo} from "@/api/system/user";
import {formatDateTime} from "../../utils/time-util"; // secondary package based on el-pagination

export default {
  name: 'GoodsUnitManage',
  components: {Pagination},
  directives: {waves},
  filters: {},
  data() {
    let validatePassword = (rule, value, callback) => {
      if (this.dialogStatus === 'create') {
        if (this.temp.password === undefined || this.temp.password === '' || this.temp.password.trim() === '') {
          callback(new Error('密码不能为空'))
        }
        if (this.temp.confirmPassword === undefined || this.temp.confirmPassword === '' || this.temp.confirmPassword.trim() === '') {
          callback(new Error('确认密码不能为空'))
        }
        if (this.temp.password !== this.temp.confirmPassword) {
          callback(new Error('两次密码输入不一致'))
        } else {
          callback()
        }
      }
      if (this.dialogStatus === 'update') {
        let isPasswordEmpty = this.temp.password === undefined || this.temp.password === '' || this.temp.password.trim() === '';
        let isConfirmPasswordEmpty = this.temp.confirmPassword === undefined || this.temp.confirmPassword === '' || this.temp.confirmPassword.trim() === '';
        console.log(isPasswordEmpty, isConfirmPasswordEmpty)
        if (!(isPasswordEmpty && isConfirmPasswordEmpty)) {
          if (this.temp.password !== this.temp.confirmPassword) {
            callback(new Error('两次密码输入不一致'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
    }
    return {
      tableKey: 0,
      list: null,
      allUserRoles: [],
      total: 0,
      listLoading: true,
      listQuery: {
        pageNo: 1,
        pageSize: 20,
        userName: "",
        roles: []
      },
      temp: {
        id: null,
        userName: "",
        roles: [],
        password: "",
        confirmPassword: "",
        memo: "",
        avatarUrl: ""
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改用户信息',
        create: '创建用户信息'
      },
      roleMap: {
        admin: '管理员',
        user: '普通用户'
      },
      addUserRules: {
        userName: [{required: true, message: '用户名不能为空', trigger: 'blur'}],
        roles: [{required: true, message: '角色不能为空', trigger: 'blur'}],
        password: [{required: true, trigger: 'blur', validator: validatePassword}],
        confirmPassword: [{required: true, trigger: 'blur', validator: validatePassword}],
      },
      updateUserRules: {
        userName: [{required: true, message: '用户名不能为空', trigger: 'blur'}],
        roles: [{required: false, message: '角色不能为空', trigger: 'blur'}],
        password: [{required: false, trigger: 'blur', validator: validatePassword}],
        confirmPassword: [{required: false, trigger: 'blur', validator: validatePassword}],
      }
    }
  },
  created() {
    this.getList()
    this.getAllUserRoles()
  },
  methods: {
    formatDateTime,
    // 获取所有角色
    getAllUserRoles() {
      listAllUserRoles(this.listQuery).then(response => {
        this.allUserRoles = response.data
      }).catch(error => {
      })
    },
    // 获取用户列表
    getList() {
      this.listLoading = true
      listUserInfo(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      }).catch(error => {
        this.listLoading = false
      })
    },
    doSearch() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        unitName: "",
        createTime: undefined,
        updateTime: undefined,
        createUser: "",
        updateUser: ""
      }
    },
    // 打开新增面板
    openCreateDialog() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 发送新增请求
    addUser() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addUserInfo(this.temp).then(() => {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: '提醒',
              message: '操作成功',
              type: 'success',
              duration: 3000
            })
          }).catch(error => {
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateUserInfo(tempData).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '提醒',
              message: '操作成功',
              type: 'success',
              duration: 3000
            })
            this.getList()
          })
        }
      })
    },
    handleDelete(id) {
      deleteUserInfo(id).then(response => {
        this.$notify({
          title: '提醒',
          message: '操作成功',
          type: 'success',
          duration: 3000
        })
        this.getList()
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>

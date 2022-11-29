<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" placeholder="客户名称或联系人" style="width: 500px; margin-right: 20px" class="filter-item" @keyup.enter.native="doSearch" />
      <el-button v-waves class="filter-item" style="margin-right: 10px" type="primary" icon="el-icon-search" @click="doSearch">
        搜索
      </el-button>
      <el-button class="filter-item" type="success" icon="el-icon-plus" @click="openCreateDialog">
        新增
      </el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;" width="100%">
      <el-table-column label="客户名称" prop="customerName" align="center" min-width="25%">
        <template slot-scope="{row}">
          <span>{{ row.customerName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系人" prop="contactPerson" align="center" min-width="15%">
        <template slot-scope="{row}">
          <span>{{ row.contactPerson }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地址" prop="address" align="center" min-width="25%">
        <template slot-scope="{row}">
          <span>{{ row.country + " - " + row.state + " - " + row.city + " - " + row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="memo" align="center" min-width="15%">
        <template slot-scope="{row}">
          <span>{{ row.memo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" icon="el-icon-more" @click="handleUpdate(row)">
            详情
          </el-button>
          <el-popconfirm style="margin-left: 10px" title="确定要删除吗" @onConfirm="handleDelete(row.id)">
            <el-button slot="reference" size="mini" icon="el-icon-delete" type="danger">
              删除
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 500px; margin-left:50px;">
        <el-form-item label="客户名称" prop="customerName">
          <el-input v-model="temp.customerName" />
        </el-form-item>

        <el-form-item label="联系人" prop="contactPerson">
          <el-input v-model="temp.contactPerson" />
        </el-form-item>

        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="temp.phone" />
        </el-form-item>

        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model="temp.email" />
        </el-form-item>

        <el-form-item label="传真" prop="fax">
          <el-input v-model="temp.fax" />
        </el-form-item>

        <el-form-item label="QQ号" prop="qq">
          <el-input v-model="temp.qq" />
        </el-form-item>

        <el-form-item label="微信号" prop="wechat">
          <el-input v-model="temp.wechat" />
        </el-form-item>

        <el-form-item label="区域">
          <el-col :span="6">
            <el-form-item prop="country">
              <el-input v-model="temp.country" placeholder="国家" />
            </el-form-item>
          </el-col>
          <el-col class="line" :span="3">-</el-col>
          <el-col :span="6">
            <el-form-item prop="state">
              <el-input v-model="temp.state"  placeholder="省、自治区、州" />
            </el-form-item>
          </el-col>
          <el-col class="line" :span="3">-</el-col>
          <el-col :span="6">
            <el-form-item prop="city">
              <el-input v-model="temp.city"  placeholder="城市" />
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item label="地址" prop="address">
          <el-input v-model="temp.address" />
        </el-form-item>

        <el-form-item label="邮政编码" prop="postCode">
          <el-input v-model="temp.postCode" />
        </el-form-item>

        <el-form-item label="初始应收款" prop="initAccountsReceivable">
          <el-input v-model="temp.initAccountsReceivable" />
        </el-form-item>

        <el-form-item label="当前应收款" prop="currentAccountsReceivable">
          <el-input v-model="temp.currentAccountsReceivable" />
        </el-form-item>

        <el-form-item label="备注" prop="memo">
          <el-input v-model="temp.memo" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createGoodsUnit():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {addModifyCustomerInfo, deleteCustomerInfo, listCustomerInfo} from '@/api/customer'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'GoodsUnitManage',
  components: { Pagination },
  directives: { waves },
  filters: {

  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        pageNo: 1,
        pageSize: 20,
        keyword: ""
      },
      temp: {
        id: undefined,
        customerName: "",
        contactPerson: "",
        phone: "",
        email: "",
        fax: "",
        qq: "",
        wechat: "",
        country: "",
        state: "",
        city: "",
        address: "",
        postCode: "",
        initAccountsReceivable: 0.00,
        currentAccountsReceivable: 0.00,
        memo: ""
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新建'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        unitName: [{ required: true, message: '单位不能为空', trigger: 'change' }],
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取商品单位列表
    getList() {
      this.listLoading = true
      listCustomerInfo(this.listQuery).then(response => {
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
        customerName: "",
        contactPerson: "",
        phone: "",
        email: "",
        fax: "",
        qq: "",
        wechat: "",
        country: "",
        state: "",
        city: "",
        address: "",
        postCode: "",
        initAccountsReceivable: 0.00,
        currentAccountsReceivable: 0.00,
        memo: ""
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
    createGoodsUnit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addModifyCustomerInfo(this.temp).then(() => {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: '提醒',
              message: '操作成功',
              type: 'success',
              duration: 3000
            })
          }).catch(error => {
            this.$notify({
              title: '提醒',
              message: error.message,
              type: 'error',
              duration: 3000
            })
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
          console.log(tempData)
          addModifyCustomerInfo(tempData).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '提醒',
              message: '操作成功',
              type: 'success',
              duration: 3000
            })
            this.getList()
          }).catch(error => {
            this.$notify({
              title: '提醒',
              message: error.message,
              type: 'error',
              duration: 3000
            })
          })
        }
      })
    },
    handleDelete(id) {
      deleteCustomerInfo(id).then(response => {
        this.$notify({
          title: '提醒',
          message: '操作成功',
          type: 'success',
          duration: 3000
        })
        this.getList()
      }).catch(error => {
        this.$notify({
          title: '提醒',
          message: error.message,
          type: 'error',
          duration: 3000
        })
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

<style>
.line {
  text-align: center;
  margin: 0 auto;
}
</style>

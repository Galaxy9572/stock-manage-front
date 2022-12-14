<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" placeholder="供应商名称或联系人" style="width: 500px; margin-right: 20px" class="filter-item" @keyup.enter.native="doSearch" />
      <el-button v-waves class="filter-item" style="margin-right: 10px" type="primary" icon="el-icon-search" @click="doSearch">
        搜索
      </el-button>
      <el-button class="filter-item" type="success" icon="el-icon-plus" @click="openCreateDialog">
        新增供应商
      </el-button>
    </div>

    <el-table
      :header-cell-style="{background: '#409EFF',color: '#FFFFFF'}"
      :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row width="1200px">
      <el-table-column label="供应商名称" fixed prop="supplierName" align="center" width="300px">
        <template slot-scope="{row}">
          <span>{{ row.supplierName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系人" prop="contactPerson" align="center" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.contactPerson }}</span>
        </template>
      </el-table-column>
      <el-table-column label="国家" prop="country" align="center" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.country }}</span>
        </template>
      </el-table-column>
      <el-table-column label="省/州/自治区" prop="state" align="center" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.state }}</span>
        </template>
      </el-table-column>
      <el-table-column label="城市" prop="city" align="center" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.city }}</span>
        </template>
      </el-table-column>
      <el-table-column label="区/县" prop="district" align="center" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.district }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地址" prop="address" align="center" width="300px">
        <template slot-scope="{row}">
          <span>{{ row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="memo" align="center" width="200px">
        <template slot-scope="{row}">
          <span>{{ row.memo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" prop="createUserName" align="center" width="200px">
        <template slot-scope="{row}">
          <span>{{ row.createUser.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改人" prop="updateUserName" align="center" width="200px">
        <template slot-scope="{row}">
          <span>{{ row.updateUser.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center" width="250px" class-name="small-padding fixed-width">
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" center top="5vh">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-width="100px" style="width: 650px; margin:0 auto;text-align: center">

        <el-divider>基本信息</el-divider>

        <el-row>
          <el-col :span="14">
            <el-form-item label="供应商名称" prop="supplierName">
              <el-input v-model="temp.supplierName" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="联系人" prop="contactPerson">
              <el-input v-model="temp.contactPerson" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="memo">
              <el-input v-model="temp.memo" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider>联系信息</el-divider>

        <el-row>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="temp.phone"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="传真" prop="fax">
              <el-input v-model="temp.fax"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="QQ" prop="qq">
              <el-input v-model="temp.qq"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="微信" prop="wechat">
              <el-input v-model="temp.wechat"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="电子邮箱" prop="email">
              <el-input v-model="temp.email"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider>地址信息</el-divider>

        <el-form-item label="区域">
          <el-col :span="6">
            <el-form-item prop="country">
              <el-select clearable v-model="regionQuery.countryCode" filterable
                         placeholder="国家"
                         @focus="getRegionInfo('COUNTRY')"
                         @clear="resetRegion('','COUNTRY')">
                <el-option
                  v-for="item in regionList"
                  :key="item.id"
                  :label="item.countryDesc"
                  :value="item.countryCode"
                  @click.native="resetRegion(item.countryDesc,'COUNTRY')">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="1">
            <el-divider direction="vertical"></el-divider>
          </el-col>
          <el-col :span="7">
            <el-form-item prop="state">
              <el-select clearable v-model="regionQuery.stateCode" filterable
                         placeholder="省/自治区/州"
                         @focus="getRegionInfo('STATE')"
                         @clear="resetRegion('','STATE')">
                <el-option
                  v-for="item in regionList"
                  :key="item.id"
                  :label="item.stateDesc"
                  :value="item.stateCode"
                  @click.native="resetRegion(item.stateDesc,'STATE')">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="1">
            <el-divider direction="vertical"></el-divider>
          </el-col>
          <el-col :span="4">
            <el-form-item prop="city">
              <el-select clearable v-model="regionQuery.cityCode" filterable
                         placeholder="市"
                         @focus="getRegionInfo('CITY')"
                         @clear="resetRegion('','CITY')">
                <el-option
                  v-for="item in regionList"
                  :key="item.id"
                  :label="item.cityDesc"
                  :value="item.cityCode"
                  @click.native="resetRegion(item.cityDesc,'CITY')">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="1">
            <el-divider direction="vertical"></el-divider>
          </el-col>
          <el-col :span="4">
            <el-form-item prop="district">
              <el-select clearable v-model="regionQuery.districtCode" filterable
                         placeholder="区/县"
                         @change="resetRegion('','DISTRICT')"
                         @focus="getRegionInfo('DISTRICT')">
                <el-option
                  v-for="item in regionList"
                  :key="item.id"
                  :label="item.districtDesc"
                  :value="item.districtCode"
                  @click.native="resetRegion(item.districtDesc,'DISTRICT')">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-row>
          <el-col :span="16">
            <el-form-item label="地址" prop="address">
              <el-input v-model="temp.address"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="邮政编码" prop="postCode">
              <el-input v-model="temp.postCode"/>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createGoodsUnit():updateData()">
          确认
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {addModifySupplierInfo, deleteSupplierInfo, listSupplierInfo} from '@/api/supplier'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import {listRegions} from "@/api/region"; // secondary package based on el-pagination

export default {
  name: 'SupplierInfoManage',
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
      regionQuery: {
        countryCode: "",
        stateCode: "",
        cityCode: "",
        districtCode: "",
        level: ""
      },
      regionList: [],
      temp: {
        id: undefined,
        supplierName: "",
        contactPerson: "",
        phone: "",
        email: "",
        fax: "",
        qq: "",
        wechat: "",
        country: "",
        state: "",
        district: "",
        city: "",
        address: "",
        postCode: "",
        memo: ""
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑供应商',
        create: '新增供应商'
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
    getRegionInfo(level) {
      this.regionQuery.level = level
      listRegions(this.regionQuery).then(response => {
        this.regionList = response.data
      })
    },
    resetRegion(codeDesc, level){
      console.log("codeDesc: " + codeDesc + ", level: " + level)
      switch (level) {
        case 'COUNTRY': {
          this.regionQuery = {
            countryCode: this.regionQuery.countryCode,
            stateCode: "",
            cityCode: "",
            districtCode: "",
            level: "COUNTRY"
          }
          this.temp.country = codeDesc
          break
        }
        case 'STATE': {
          this.regionQuery = {
            countryCode: this.regionQuery.countryCode,
            stateCode: this.regionQuery.stateCode,
            cityCode: "",
            districtCode: "",
            level: "STATE"
          }
          this.temp.state = codeDesc
          break
        }
        case 'CITY': {
          this.regionQuery = {
            countryCode: this.regionQuery.countryCode,
            stateCode: this.regionQuery.stateCode,
            cityCode: this.regionQuery.cityCode,
            districtCode: "",
            level: "CITY"
          }
          this.temp.city = codeDesc
          break
        }
        case 'DISTRICT': {
          this.temp.district = codeDesc
          break
        }
        default: break
      }
    },
    // 获取供应商列表
    getList() {
      this.listLoading = true
      listSupplierInfo(this.listQuery).then(response => {
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
        supplierName: "",
        contactPerson: "",
        phone: "",
        email: "",
        fax: "",
        qq: "",
        wechat: "",
        country: "",
        state: "",
        city: "",
        district: "",
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
          addModifySupplierInfo(this.temp).then(() => {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: '提醒',
              message: '操作成功',
              type: 'success',
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
          addModifySupplierInfo(tempData).then(() => {
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
      deleteSupplierInfo(id).then(response => {
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

<style>
.line {
  text-align: center;
  margin: 0 auto;
}
</style>

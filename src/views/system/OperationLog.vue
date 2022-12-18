<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select class="filter-item" clearable style="margin-right: 20px" v-model="listQuery.module"
                 collapse-tags filterable placeholder="请选择模块"
                 @clear="resetModule">
        <el-option
          v-for="item in allModules"
          :key="item.code"
          :label="item.desc"
          :value="item.code">
        </el-option>
      </el-select>
      <el-select class="filter-item" clearable style="margin-right: 20px" v-model="listQuery.subModule"
                 collapse-tags filterable placeholder="请选择子模块"
                 @focus="getAllSubModules">
        <el-option
          v-for="item in allSubModules"
          :key="item.code"
          :label="item.desc"
          :value="item.code">
        </el-option>
      </el-select>
      <el-select class="filter-item" clearable style="margin-right: 20px" v-model="listQuery.operationType"
                 collapse-tags filterable placeholder="请选择操作类型">
        <el-option
          v-for="item in allOperationTypes"
          :key="item.code"
          :label="item.desc"
          :value="item.code">
        </el-option>
      </el-select>
      <el-date-picker
        style="margin-right: 20px"
        class="filter-item"
        v-model="operateTime"
        clearable
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="操作开始日期"
        end-placeholder="操作结束日期"
        :picker-options="pickerOptions"
        @change="changeOperationTime()">
      </el-date-picker>
      <el-button v-waves class="filter-item" style="margin-right: 10px" type="primary" icon="el-icon-search"
                 @click="doSearch">
        搜索
      </el-button>
    </div>

    <el-table
      stripe
      :header-cell-style="{background: '#409EFF',color: '#FFFFFF'}"
      :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 1400px;"
      width="100%">
      <el-table-column label="模块" fixed prop="module" align="center" width="200px">
        <template slot-scope="{row}">
          <span>{{ row.module }}</span>
        </template>
      </el-table-column>
      <el-table-column label="子模块" fixed prop="subModule" align="center" width="200px">
        <template slot-scope="{row}">
          <span>{{ row.subModule }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作类型" prop="operationType" align="center" width="200px">
        <template slot-scope="{row}">
          <span>{{ row.operationType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作描述" prop="operationDesc" align="center" width="400px">
        <template slot-scope="{row}">
          <span>{{ row.operationDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="业务ID" prop="moduleBusinessId" align="center" width="200px">
        <template slot-scope="{row}">
          <span>{{ row.moduleBusinessId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作人" prop="userName" align="center" width="200px">
        <template slot-scope="{row}">
          <span>{{ row.operateUser.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" width="200px" align="center">
        <template slot-scope="{row}">
          <span><el-tag style="margin: 0 5px" v-for="(role) in row.operateUser.roles">{{ roleMap[role] }}</el-tag></span>
        </template>
      </el-table-column>
      <el-table-column label="操作时间" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize"
                @pagination="getList"/>

  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import {parseTime} from '@/utils'
import Pagination from '@/components/Pagination/index.vue'
import {
  listAllModules,
  listAllOperationTypes,
  listAllSubModulesByModule,
  listOperationLogByPage,
} from "@/api/system/operation-log";
import * as DateUtils from '@/utils/date'// secondary package based on el-pagination

export default {
  name: 'GoodsUnitManage',
  components: {Pagination},
  directives: {waves},
  filters: {},
  data() {
    return {
      tableKey: 0,
      list: null,
      allModules: [],
      allSubModules: [],
      allOperationTypes: [],
      total: 0,
      listLoading: true,
      operateTime: [],
      listQuery: {
        pageNo: 1,
        pageSize: 20,
        module: "",
        subModule: "",
        operationType: "",
        operateUserId: null,
        operationStartTime: null,
        operationEndTime: null
      },
      roleMap: {
        admin: '管理员',
        user: '普通用户'
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = Date.today().clearTime()
            const start = Date.today().addWeeks(-1)
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = Date.today().clearTime()
            const start = Date.today().addMonths(-1)
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = Date.today().clearTime()
            const start = Date.today().addMonths(-3)
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近半年',
          onClick(picker) {
            const end = Date.today().clearTime()
            const start = Date.today().addMonths(-6)
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一年',
          onClick(picker) {
            const end = Date.today().clearTime()
            const start = Date.today().addYears(-1)
            picker.$emit('pick', [start, end]);
          }
        }]
      }
    }
  },
  created() {
    this.getList()
    this.getAllModules()
    this.getAllOperationTypes()
  },
  methods: {
    getAllModules() {
      listAllModules().then(response => {
        this.allModules = response.data
      })
    },
    getAllSubModules() {
      if (!this.listQuery.module) {
        return
      }
      listAllSubModulesByModule(this.listQuery.module).then(response => {
        this.allSubModules = response.data
      })
    },
    getAllOperationTypes() {
      listAllOperationTypes().then(response => {
        this.allOperationTypes = response.data
      })
    },
    // 获取用户列表
    getList() {
      this.listLoading = true
      listOperationLogByPage(this.listQuery).then(response => {
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
    resetModule() {
      this.listQuery.module = undefined
      this.listQuery.subModule = undefined
      this.allSubModules = []
    },
    changeOperationTime() {
      let minTime = this.operateTime.length > 0 ? this.operateTime[0] : null
      let maxTime = this.operateTime.length > 0 ? this.operateTime[1] : null
      this.listQuery.operationStartTime = minTime
      this.listQuery.operationEndTime = maxTime
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

<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.unitName" placeholder="单位名称" style="width: 200px; margin-right: 20px" class="filter-item" @keyup.enter.native="doSearch" />
      <el-button v-waves class="filter-item" style="margin-right: 10px" type="primary" icon="el-icon-search" @click="doSearch">
        搜索
      </el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="openCreateDialog">
        新增
      </el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;" width="100%">
      <el-table-column label="单位名称" prop="unitName" align="center" min-width="20%">
        <template slot-scope="{row}">
          <span>{{ row.unitName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="20%" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" min-width="20%" align="center">
        <template slot-scope="{row}">
          <span>{{ row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" min-width="15%" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createUserId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改人" min-width="15%" align="center">
        <template slot-scope="{row}">
          <span>{{ row.updateUserId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!=='deleted'" size="mini" type="danger" @click="handleDelete(row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" style="width: 400px; margin-left:50px;">
        <el-form-item label="单位名称" prop="unitName">
          <el-input v-model="temp.unitName" />
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
import { fetchPv, updateArticle } from '@/api/article'
import {listGoodsUnit, deleteGoodsUnit, addModifyGoodsUnit} from '@/api/goods'
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
        unitName: undefined,
        sort: '+createTime'
      },
      temp: {
        id: undefined,
        unitName: "",
        createTime: undefined,
        updateTime: undefined,
        createUser: "",
        updateUser: ""
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
      listGoodsUnit(this.listQuery).then(response => {
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
    createGoodsUnit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addModifyGoodsUnit(this.temp).then(() => {
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
          addModifyGoodsUnit(tempData).then(() => {
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
      deleteGoodsUnit(id).then(response => {
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

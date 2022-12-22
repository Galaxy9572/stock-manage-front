<template>
  <div class="app-container">
    <div class="filter-container" style="width: 1600px; margin: 0 auto">
      <el-input v-model="listQuery.unitName" placeholder="单位名称" style="width: 400px; margin-right: 20px" class="filter-item" @keyup.enter.native="doSearch" />
      <el-button v-waves class="filter-item" style="margin-right: 10px" type="primary" icon="el-icon-search" @click="doSearch">
        搜索
      </el-button>
      <el-button class="filter-item" type="success" icon="el-icon-plus" @click="openCreateDialog">
        新增计量单位
      </el-button>
    </div>

    <el-table
      stripe
      :header-cell-style="{background: '#409EFF',color: '#FFFFFF'}"
      :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 1600px; margin: 0 auto;">
      <el-table-column label="单位名称" fixed prop="unitName" align="center" width="300px">
        <template slot-scope="{row}">
          <span>{{ row.unitName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否允许小数" prop="allowDecimal" align="center" width="300px">
        <template slot-scope="{row}">
          <span>
            <el-tag type="success" v-if="row.allowDecimal">{{ booleanMap[row.allowDecimal] }}</el-tag>
            <el-tag type="danger" v-else-if="!row.allowDecimal">{{ booleanMap[row.allowDecimal] }}</el-tag>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createUser? row.createUser.userName : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改人" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.updateUser? row.updateUser.userName : '' }}</span>
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
      <el-table-column label="操作" fixed="right" align="center" width="199px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!=='deleted'" size="mini" icon="el-icon-delete" type="danger" @click="handleDelete(row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" center>
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin:0 auto;">
        <el-form-item label="单位名称" prop="unitName">
          <el-input v-model="temp.unitName" />
        </el-form-item>
        <el-form-item  label="是否允许小数" prop="allowDecimal">
          <el-switch
            v-model="temp.allowDecimal"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="true"
            inactive-value="false"
            value="false">
          </el-switch>
        </el-form-item>
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
import {listGoodsUnit, deleteGoodsUnit, addModifyGoodsUnit} from '@/api/goods/goods-unit'
import waves from '@/directive/waves'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'

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
        unitName: undefined
      },
      temp: {
        id: undefined,
        unitName: "",
        allowDecimal: null,
        createTime: undefined,
        updateTime: undefined,
        createUser: "",
        updateUser: ""
      },
      dialogFormVisible: false,
      dialogStatus: '',
      booleanMap: {
        true: '是',
        false: '否'
      },
      textMap: {
        update: '编辑计量单位',
        create: '新增计量单位'
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

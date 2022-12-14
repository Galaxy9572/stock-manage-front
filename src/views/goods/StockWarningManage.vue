<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.goodsName" placeholder="商品名称" style="width: 300px; margin-right: 20px" class="filter-item" @keyup.enter.native="doSearch" />
      <el-cascader class="filter-item" style="margin-right: 20px"
        placeholder="请选择商品类型"
        ref="goodsTypeCascader"
        :key="id"
        v-model="listQuery.goodsTypeId"
        clearable
        :options="goodsTypes"
        :props="{value: 'id', label: 'typeName', children: 'children', expandTrigger: 'hover' }"
        @change="handleGoodsTypeChange"
        @focus="listGoodsTypes">
      </el-cascader>
      <el-select class="filter-item" clearable v-load style="margin-right: 20px" v-model="value" filterable placeholder="请选择商品单位">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button v-waves class="filter-item" style="margin-right: 10px" type="primary" icon="el-icon-search" @click="doSearch">
        搜索
      </el-button>
      <el-button class="filter-item" type="success" icon="el-icon-plus" @click="openCreateDialog">
        新增
      </el-button>
    </div>

    <el-table
      :header-cell-style="{background:'#409EFF',color:'#FFFFFF'}"
      :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;" width="100%">
      <el-table-column label="商品名称" prop="goodsName" align="center" min-width="20%">
        <template slot-scope="{row}">
          <span>{{ row.goodsName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品类型" min-width="20%" align="center">
        <template slot-scope="{row}">
          <span>{{ row.goodsType.typeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单位" min-width="15%" align="center">
        <template slot-scope="{row}">
          <span>{{ row.goodsUnit.unitName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" min-width="20%" align="center">
        <template slot-scope="{row}">
          <span>{{ row.memo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="15%" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" icon="el-icon-more" @click="handleUpdate(row)">
            详情
          </el-button>
          <el-button v-if="row.status!=='deleted'" size="mini" icon="el-icon-delete" type="danger" @click="handleDelete(row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" style="width: 400px; margin-left:50px;">
        <el-form-item label="商品名称" prop="goodsName">
          <el-input v-model="temp.goodsName" />
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
import {
  listGoodsInfo,
  addModifyGoodsInfo,
  deleteGoodsInfo
} from '@/api/goods/goods-info'
import { listGoodsTypes } from '@/api/goods/goods-type'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'GoodsInfoManage',
  components: { Pagination },
  directives: { waves },
  filters: {

  },
  data() {
    return {
      tableKey: 0,
      list: null,
      goodsTypes: [],
      total: 0,
      listLoading: true,
      listQuery: {
        pageNo: 1,
        pageSize: 20,
        goodsTypeId: null,
        goodsUnitId: null,
        goodsName: ""
      },
      temp: {
        id: null,
        goodsTypeId: null,
        goodsUnitId: null,
        goodsName: "",
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
        goodsName: [{ required: true, message: '商品名称不能为空', trigger: 'change' }],
        goodsTypeId: [{ required: true, message: '商品类型不能为空', trigger: 'change' }],
        goodsUnitId: [{ required: true, message: '商品单位不能为空', trigger: 'change' }],
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
      listGoodsInfo(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      }).catch(error => {
        this.listLoading = false
        this.$notify({
          title: '提醒',
          message: error.message,
          type: 'error',
          duration: 3000
        })
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
        id: null,
        goodsTypeId: null,
        goodsUnitId: null,
        goodsName: "",
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
          addModifyGoodsInfo(this.temp).then(() => {
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
          addModifyGoodsInfo(tempData).then(() => {
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
      deleteGoodsInfo(id).then(response => {
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
    },
    handleGoodsTypeChange(value) {
      this.listQuery.goodsTypeId = value[value.length - 1]
    },
    listGoodsTypes() {
      listGoodsTypes().then(response => {
        this.goodsTypes = this.getTreeData(response.data);
        console.log(this.goodsTypes)
      }).catch(error => {
      })
    },
    getTreeData(data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].children.length < 1) {
          // children若为空数组，则将children设为undefined
          data[i].children = undefined;
        } else {
          // children若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].children);
        }
      }
      return data;
    },

  }
}
</script>

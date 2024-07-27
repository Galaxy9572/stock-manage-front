<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.goodsName" placeholder="请输入客户名称或订单号"
                style="width: 350px; margin-right: 20px" class="filter-item" @keyup.enter.native="doSearch"/>
      <el-cascader class="filter-item" style="margin-right: 20px"
                   placeholder="请选择商品类型"
                   ref="goodsTypeCascader"
                   v-model="listQuery.goodsTypeId"
                   clearable
                   :options="goodsTypes"
                   :props="{value: 'id', label: 'typeName', children: 'children', expandTrigger: 'hover'}"
                   @change="handleGoodsTypeChange"
                   @focus="listGoodsTypes">
      </el-cascader>
      <el-date-picker
        style="margin-right: 20px"
        class="filter-item"
        v-model="listQuery.orderTime"
        clearable
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="订单开始日期"
        end-placeholder="订单结束日期"
        :picker-options="pickerOptions">
      </el-date-picker>
      <el-button v-waves class="filter-item" style="margin-right: 10px" type="primary" icon="el-icon-search"
                 @click="doSearch">
        搜索
      </el-button>
    </div>
    <div class="filter-container">
      <el-button class="filter-item" type="success" icon="el-icon-plus" @click="openCreateDialog">
        新增订单
      </el-button>
    </div>
    <el-table
      stripe
      :header-cell-style="{background: '#409EFF',color: '#FFFFFF'}"
      :key="tableKey" v-loading="listLoading" :data="list"
      border fit highlight-current-row width="1400px">
      <el-table-column fixed label="订单号" prop="orderId" align="center" width="300px">
        <template slot-scope="{row}">
          <span>{{ row.orderId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单类型" prop="orderType" align="center" width="200px">
        <template slot-scope="{row}">
          <span>{{ row.orderType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户/供应商名称" min-width="300px" align="center">
        <template slot-scope="{row}">
          <span v-show="row.orderType==='REPLENISH'">{{ row.supplier.supplierName }}</span>
          <span v-show="row.orderType==='DISPATCH'">{{ row.customer.customerName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付方式" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.paymentMethod }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总价" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.totalPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" min-width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.memo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" width="200px">
        <template slot-scope="{row}">
          <span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center" width="200px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" icon="el-icon-more" @click="handleUpdate(row)">
            详情
          </el-button>
          <el-button size="mini" icon="el-icon-delete" type="danger" @click="handleDelete(row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize"
                @pagination="getList"/>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" center width="1200px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-width="80px" style="width: 1100px; margin: 0 auto">
        <el-form-item label="客户名称">
          <page-select class="filter-item"
                       style="margin-right: 20px"
                       select-label="customerName"
                       :queryMethod="selectSupplierInfo"/>
        </el-form-item>

        <el-form-item label="销售门店">
          <page-select class="filter-item"
                       style="margin-right: 20px"
                       select-label="shopName"
                       :queryMethod="selectShopInfo"/>
        </el-form-item>

        <el-form-item>
          <el-divider>商品详情</el-divider>
          <el-button class="filter-item" type="success" icon="el-icon-plus" @click="openCreateDialog">
            添加商品
          </el-button>
          <el-table
            stripe
            :header-cell-style="{background: '#409EFF',color: '#FFFFFF'}"
            :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 1000px;"
            width="1000px">
            <el-table-column label="商品名称" fixed prop="goodsName" align="center" width="300px">
              <template slot-scope="{row}">
                <span>{{ row.goodsName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="商品类型" width="100px" align="center">
              <template slot-scope="{row}">
                <span><el-tag>{{ row.goodsType.typeName }}</el-tag></span>
              </template>
            </el-table-column>
            <el-table-column label="单位" width="100px" align="center">
              <template slot-scope="{row}">
                <span><el-tag>{{ row.goodsUnit.unitName }}</el-tag></span>
              </template>
            </el-table-column>
            <el-table-column label="进货价" prop="purchasePrice" align="center" width="150px">
              <template slot-scope="{row}">
                <span>{{ row.purchasePrice }}</span>
              </template>
            </el-table-column>
            <el-table-column label="零售价" prop="retailPrice" align="center" width="150px">
              <template slot-scope="{row}">
                <span>{{ row.retailPrice }}</span>
              </template>
            </el-table-column>
            <el-table-column label="批发价" prop="wholesalePrice" align="center" width="150px">
              <template slot-scope="{row}">
                <span>{{ row.wholesalePrice }}</span>
              </template>
            </el-table-column>

            <el-table-column label="操作" fixed="right" align="center" width="150px" class-name="small-padding fixed-width">
              <template slot-scope="{row,$index}">
                <el-button v-if="row.status!=='deleted'" size="mini" icon="el-icon-delete" type="danger"
                           @click="handleDelete(row.id)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
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
import {addModifyGoodsInfo, deleteGoodsInfo} from '@/api/goods/goods-info'
import {listGoodsTypes} from '@/api/goods/goods-type'

import waves from '@/directive/waves' // waves directive
import {parseTime} from '@/utils'
import Pagination from '@/components/Pagination'
import PageSelect from '@/components/common/PageSelect'
import {listAllOrderTypeList, listOrderRecordsByPage} from "@/api/order/order";
import request from "@/utils/request"; // secondary package based on el-pagination

export default {
  name: 'DispatchOrderManage',
  components: {Pagination, PageSelect},
  directives: {waves},
  filters: {},
  data() {
    return {
      selectSupplierInfo: {
        url: '/api/info/customer/list',
        method: 'post',
        data: {
          pageNo: 1,
          pageSize: 10,
          total: 0,
          keyword: ''
        }
      },
      selectShopInfo: {
        url: '/api/info/shop/list',
        method: 'post',
        data: {
          pageNo: 1,
          pageSize: 10,
          total: 0,
          keyword: ''
        }
      },
      tableKey: 0,
      list: null,
      goodsTypes: [],
      orderTypes: [],
      total: 0,
      listLoading: true,
      listQuery: {
        pageNo: 1,
        pageSize: 20,
        goodsTypeId: null,
        keyword: null,
        orderTime: []
      },
      temp: {
        id: null,
        orderType: null,
        goodsTypeId: null,
        goodsUnitId: null,
        goodsName: "",
        memo: ""
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑订单',
        create: '新建订单'
      },
      rules: {
        goodsName: [{required: true, message: '商品名称不能为空', trigger: 'change'}],
        goodsTypeId: [{required: true, message: '商品类型不能为空', trigger: 'change'}],
        goodsUnitId: [{required: true, message: '商品单位不能为空', trigger: 'change'}],
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
    this.listOrderTypes()
  },
  methods: {
    // 获取商品单位列表
    getList() {
      this.listLoading = true
      listOrderRecordsByPage(this.listQuery).then(response => {
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
      })
    },
    listOrderTypes() {
      listAllOrderTypeList().then(response => {
        this.orderTypes = response.data;
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

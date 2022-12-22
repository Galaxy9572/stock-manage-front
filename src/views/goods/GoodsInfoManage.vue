<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.goodsName" placeholder="商品名称" style="width: 300px; margin-right: 20px"
                class="filter-item" @keyup.enter.native="doSearch"/>
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
      <el-button v-waves class="filter-item" style="margin-right: 10px" type="primary" icon="el-icon-search"
                 @click="doSearch">
        搜索
      </el-button>
      <el-button class="filter-item" type="success" icon="el-icon-plus" @click="openCreateDialog">
        新增商品
      </el-button>
    </div>

    <el-table
      stripe
      :header-cell-style="{background: '#409EFF',color: '#FFFFFF'}"
      :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;"
              width="100%">
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
      <el-table-column label="备注" align="center" width="200px">
        <template slot-scope="{row}">
          <span>{{ row.memo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" prop="createUserName" align="center" width="200px">
        <template slot-scope="{row}">
          <span>{{ row.createUser? row.createUser.userName : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改人" prop="updateUserName" align="center" width="200px">
        <template slot-scope="{row}">
          <span>{{ row.updateUser? row.updateUser.userName : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" width="200px">
        <template slot-scope="{row}">
          <span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" align="center" width="200px">
        <template slot-scope="{row}">
          <span>{{ row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="300px" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" icon="el-icon-more" @click="handleUpdate(row)">
            详情
          </el-button>
          <el-button type="warning" size="mini" icon="el-icon-more" @click="openGoodsStockWarningDialog(row)">
            库存告警设置
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
      <el-form ref="dataForm" :rules="rules" :model="temp" label-width="100px"
               style="width: 600px; margin: 0 auto">
        <el-row>
          <el-col :span="24">
            <el-form-item label="商品名称" prop="goodsName">
              <el-input v-model="temp.goodsName"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="14">
            <el-form-item label="商品类型" prop="goodsTypeId">
              <el-cascader placeholder="请选择商品类型"
                           ref="goodsTypeCascader"
                           v-model="temp.goodsTypeId"
                           clearable
                           :options="goodsTypes"
                           :props="{value: 'id', label: 'typeName', children: 'children', expandTrigger: 'hover'}"
                           @change="handleGoodsTypeChange">
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="商品单位" prop="goodsTypeId">
              <el-select ref="goodsUnitSelector" v-model="temp.goodsUnitId" placeholder="请选择商品单位" @change="updateSelectedGoodsUnit">
                <el-option
                  v-for="item in goodsUnits"
                  :key="item.id"
                  :label="item.unitName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="18" style="margin-right: 20px">
            <el-form-item label="进货价" prop="purchasePrice">
              <el-input type="number" min="0" v-model="temp.purchasePrice" @input="limitInput($event, 'purchasePrice')"/>
            </el-form-item>
          </el-col>
          <el-col :span="4" style="margin-left: 12px">
            <el-button icon="el-icon-s-marketing" type="primary" plain disabled>价格参考</el-button>
          </el-col>
        </el-row>

        <el-form-item label="零售价" prop="retailPrice">
          <el-input type="number" min="0" v-model="temp.retailPrice" @input="limitInput($event, 'retailPrice')"/>
        </el-form-item>
        <el-form-item label="批发价" prop="wholesalePrice">
          <el-input type="number" min="0" v-model="temp.wholesalePrice" @input="limitInput($event, 'wholesalePrice')"/>
        </el-form-item>
        <el-form-item v-show="dialogStatus==='create'" label="初始库存" prop="initStockNum">
          <el-col :span="20">
            <el-input type="number" min="0" v-model="temp.initStockNum" @input="limitInput($event, 'initStockNum')"/>
          </el-col>
          <el-col :span="4">
            <span style="margin-left: 10px">{{showTemp.selectedGoodsUnitName}}</span>
          </el-col>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">
            取消
          </el-button>
          <el-button type="primary" @click="dialogStatus==='create'?addModifyGoodsUnit():updateData()">
            确认
          </el-button>
      </span>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="stockDialogFormVisible" center>
      <el-form ref="goodsStockDataForm" :rules="goodsStockRules" :model="goodsStockTemp" label-position="left" label-width="150px"
               style="width: 400px; margin: 0 auto">
        <el-form-item label="商品名称" prop="goodsName">
          <span>{{goodsStockTemp.goodsName}}</span>
        </el-form-item>
        <el-form-item label="是否开启告警" prop="allowStockWarning">
          <el-switch
            v-model="goodsStockTemp.allowStockWarning"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="true"
            inactive-value="false"
            value="false">
          </el-switch>
        </el-form-item>
        <el-form-item label="告警下限" prop="minStockNum">
          <el-col :span="10">
            <el-input type="number" min="0" v-model="goodsStockTemp.minStockNum" :disabled="!goodsStockTemp.allowStockWarning" @input="limitInput($event, 'minStockNum')"/>
          </el-col>
          <el-col :span="4" style="margin-left: 10px">
            <span>{{goodsStockTemp.goodsUnit.unitName}}</span>
          </el-col>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="stockDialogFormVisible = false">
            取消
          </el-button>
          <el-button type="primary" @click="modifyGoodsStockWarning">
            确认
          </el-button>
      </span>
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
import { listGoodsUnit } from '@/api/goods/goods-unit'
import { modifyGoodsStockWarning } from '@/api/goods/goods-stock'
import waves from '@/directive/waves'
import {parseTime} from '@/utils'
import Pagination from '@/components/Pagination'
import Link from "@/layout/components/Sidebar/Link.vue";

export default {
  name: 'GoodsInfoManage',
  components: {Link, Pagination},
  directives: {waves},
  filters: {},
  data() {
    return {
      tableKey: 0,
      list: null,
      goodsTypes: [],
      goodsUnits: [],
      goodsTypeIdArr: [],
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
        purchasePrice: 0.00,
        retailPrice: 0.00,
        wholesalePrice: 0.00,
        initStockNum: 0.00,
        memo: ""
      },
      showTemp : {
        selectedGoodsUnitName: ""
      },
      goodsStockTemp: {
        id: null,
        goodsTypeId: null,
        goodsUnitId: null,
        goodsName: "",
        purchasePrice: 0.00,
        retailPrice: 0.00,
        wholesalePrice: 0.00,
        memo: "",
        allowStockWarning: true,
        minStockNum: 0.00,
        goodsUnit: {
          id: null,
          unitName: "",
          allowDecimal: false,
          createTime: null,
          updateTime: null,
          createUser: null,
          updateUser: null
        }
      },
      dialogFormVisible: false,
      stockDialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑商品',
        create: '新增商品',
        stock: '库存告警设置'
      },
      rules: {
        goodsName: [{required: true, message: '商品名称不能为空', trigger: 'blur'}],
        goodsTypeId: [{required: true, message: '商品类型不能为空', trigger: 'blur'}],
        goodsUnitId: [{required: true, message: '商品单位不能为空', trigger: 'blur'}],
        purchasePrice: [{required: true, message: '进货价不能为空', trigger: 'blur'}],
        retailPrice: [{required: true, message: '零售价不能为空', trigger: 'blur'}],
        wholesalePrice: [{required: false, message: '商品单位不能为空', trigger: 'blur'}],
      },
      goodsStockRules: {
        minStockNum: [{required: true, message: '告警下限非法', trigger: 'blur'}]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
    this.listGoodsTypes()
    this.getGoodsUnitList()
  },
  methods: {
    // 获取商品信息列表
    getList() {
      this.listLoading = true
      listGoodsInfo(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    // 获取商品信息列表
    getGoodsUnitList() {
      listGoodsUnit(this.listQuery).then(response => {
        this.goodsUnits = response.data.list
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
        purchasePrice: 0.00,
        retailPrice: 0.00,
        wholesalePrice: 0.00,
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
    addModifyGoodsUnit() {
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
    openGoodsStockWarningDialog(row) {
      this.goodsStockTemp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'stock'
      this.stockDialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['goodsStockDataForm'].clearValidate()
      })
    },
    modifyGoodsStockWarning() {
      this.$refs['goodsStockDataForm'].validate((valid) => {
        if (valid) {
          modifyGoodsStockWarning(this.goodsStockTemp).then(() => {
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
        if (response.data) {
          this.$notify({
            title: '提醒',
            message: '操作成功',
            type: 'success',
            duration: 3000
          })
        } else {
          this.$notify({
            title: '错误',
            message: '删除失败',
            type: 'error',
            duration: 3000
          })
        }
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
      this.temp.goodsTypeId = value[value.length - 1]
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
    //限制保留两个小数
    //限制只能输入两位小数
    limitInput(value, name) {
      // 第一步：转成字符串
      this.$refs.dataForm[name] = ('' + value)
        // 第二步：把不是数字，不是小数点的过滤掉
        .replace(/[^\d\\^.]+/g, '')
        // 第三步：第一位0开头，0后面为数字，则过滤掉，取后面的数字
        .replace(/^0+(\d)/, '$1')
        // 第四步：如果输入的第一位为小数点，则替换成 0. 实现自动补全
        .replace(/^\./, '0.')
      // 第五步：最终匹配得到结果 以数字开头，只有一个小数点，	而且小数点后面只能有0到2位小数
      .match(/^\d*(\.?\d{0,2})/g)[0] || ''
      this.temp[name] = this.$refs.dataForm[name]
    },
    updateSelectedGoodsUnit() {
      this.showTemp.selectedGoodsUnitName = this.$refs.goodsUnitSelector.selected.label
    }
  }
}
</script>

<style>

</style>

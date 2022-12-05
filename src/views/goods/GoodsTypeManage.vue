<template>
  <div class="app-container">
    <div class="filter-container" style="width: 60%; margin: 0 auto">
      <el-button class="filter-item" type="success" icon="el-icon-plus" @click="openCreateMainDialog">
        新增大类
      </el-button>
    </div>
    <el-table
      :data="list"
      style="width: 60%; margin: 0 auto"
      row-key="id"
      border
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column prop="typeName" label="类型名称" min-width="70%">
        <template slot-scope="{row}">
          <el-tag
            closable
            @close="handleDelete(row.id)"
            effect="dark"
            color="rgb(0,191,183)">
            <span>{{ row.typeName }}</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="30%" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="success" size="mini" icon="el-icon-plus" @click="openCreateSubDialog(row.id)">
            新增子类型
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px"
               style="width: 400px; margin: 0 auto; text-align: center">
        <el-form-item label="类型名称" prop="typeName">
          <el-input v-model="temp.typeName"/>
        </el-form-item>
        <el-form-item>
          <el-button @click="dialogFormVisible = false">
            取消
          </el-button>
          <el-button type="primary" @click="dialogStatus==='createMain' || dialogStatus=== 'createSub'?createGoodsType():updateData()">
            确认
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  addModifyGoodsType,
  deleteGoodsType,
  listGoodsTypes,
} from "@/api/goods";

export default {
  name: "index",
  data() {
    return {
      list: null,
      listLoading: true,
      listQuery: {},
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑商品类型',
        createMain: '新增大类',
        createSub: '新增子类型'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        typeName: [{required: true, message: '类型名称不能为空', trigger: 'change'}],
      },
      temp: {
        id: null,
        parentTypeId: null,
        typeName: "",
      },
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      listGoodsTypes().then(response => {
        this.list = response.data
        this.listLoading = false
      }).catch(error => {
        this.listLoading = false
      })
    },
    resetTemp() {
      this.temp = {
        id: null,
        parentTypeId: null,
        typeName: ""
      }
    },
    // 打开新增面板
    openCreateMainDialog() {
      this.resetTemp()
      this.dialogStatus = 'createMain'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    openCreateSubDialog(parentTypeId) {
      this.temp = {
        parentTypeId: parentTypeId,
        typeName: ""
      }
      this.dialogStatus = 'createSub'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 发送新增请求
    createGoodsType() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addModifyGoodsType(this.temp).then(() => {
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
      this.temp = {
        id: row.id,
        typeName: row.typeName
      }
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
          addModifyGoodsType(tempData).then(() => {
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
      deleteGoodsType(id).then(response => {
        this.$notify({
          title: '提醒',
          message: '操作成功',
          type: 'success',
          duration: 3000
        })
        this.getList()
      })
    }
  },
}
</script>

<style scoped>

</style>

<template>
  <div class="app-container">
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
          <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="openCreateDialog">
            新增大类
          </el-button>
        </template>
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            新增子类型
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" style="width: 400px; margin-left:50px;">
        <el-form-item label="类型名称" prop="typeName">
          <el-input v-model="temp.typeName" />
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
      listQuery: {
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
        typeName: [{ required: true, message: '类型名称不能为空', trigger: 'change' }],
      },
      temp: {
        id: undefined,
        typeName: "",
        createTime: undefined,
        updateTime: undefined,
        createUser: "",
        updateUser: ""
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
        console.log(response)
        this.list = response.data
        this.listLoading = false
      }).catch(error => {
        this.listLoading = false
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
          addModifyGoodsType(tempData).then(() => {
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
      deleteGoodsType(id).then(response => {
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
  },
}
</script>

<style scoped>

</style>

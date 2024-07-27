<template>
  <el-row>
    <el-col :span="24">
      <el-select v-model="selectVal" filterable clearable
                 placeholder="请选择" @change="changeValue"
                 :style="'width:100%'">
        <el-option
          v-for="item in dataList"
          :key="item.id"
          :label="item[selectLabel]"
          :value="item.id"
        >
        </el-option>
        <el-col :span="24">
          <div class="bottomPage">
            <!-- 分页组件 -->
            <el-pagination
            @current-change="onPageChange"
            :current-page="this.pageInfo.pageNo"
            :page-size="this.pageInfo.pageSize"
            layout="total, prev, pager, next"
            :total="this.pageInfo.total">
            </el-pagination>
          </div>
        </el-col>
      </el-select>
    </el-col>
  </el-row>
</template>

<script>
import request from '@/utils/request'

export default {
  name: "PageSelect",
  //接收参数
  props: {
    //请求地址
    queryMethod: {
      type: Object,
      require: true
    },
    //el-option label展示字段名
    selectLabel: {
      type: String,
      default: 'label'
    }
  },
  data() {
    return {
      selectVal: '',
      dataList: [],
      pageInfo: this.queryMethod.data,
      list: [],
      loading: false,
    };
  },
  created() {
    this.getList()
  },
  methods: {
    // 列表
    getList() {
      //this.getUrl 父组件接收的接口地址 这样设计利于不同页面使用 更灵活
      return request(this.queryMethod).then(res => {
        this.dataList = res.data.list
        this.pageInfo.total = res.data.total
        this.pageInfo.pageNo = res.data.pageNo
        this.pageInfo.pageSize = res.data.pageSize
      })
    },
    //翻页
    onPageChange(val) {
      //val获取点击页数，赋值刷新接口数据
      this.pageInfo.pageNo = val
      this.getList()
    },
    changeValue(e) {
      this.selectVal = e
      //e获取选择code 给父页面
      this.$emit('onPageChange', e);
    }
  }
};
</script>


<style scoped>
.bottomPage {
  display: flex;
  margin-bottom: 10px
}
</style>

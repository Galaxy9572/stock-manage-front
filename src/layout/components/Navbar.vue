<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device!=='mobile'">
<!--        <search id="header-search" class="right-menu-item" />-->

        <error-log class="errLog-container right-menu-item hover-effect" />

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-tooltip content="全局字体大小" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>

      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/profile/index">
            <el-dropdown-item>设置</el-dropdown-item>
          </router-link>
          <router-link to="/">
            <el-dropdown-item>仪表板</el-dropdown-item>
          </router-link>
<!--          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">-->
<!--            <el-dropdown-item>文档</el-dropdown-item>-->
<!--          </a>-->
          <el-dropdown-item divided @click.native="dialogFormVisible=true">
            <span style="display:block;">关于</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog :title="textMap[aboutTitle]" :visible.sync="dialogFormVisible" center>
      <el-form ref="dataForm" label-width="80px" style="width: 300px; margin: 0 auto">
        <el-row>
          <el-col :span="12" align="center">系统版本：</el-col>
          <el-col :span="12" align="center">1.0.0</el-col>
        </el-row>
        <el-divider style="margin-top: 0;padding-top: 0"></el-divider>
        <el-row>
          <el-col :span="12" align="center">版本日期：</el-col>
          <el-col :span="12" align="center">2022.12</el-col>
        </el-row>
        <el-divider style="margin-top: 0;padding-top: 0"></el-divider>
        <el-row>
          <el-col :span="12" align="center">版权所有：</el-col>
          <el-col :span="12" align="center">Liao.Junyao</el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false">
          确认
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    // Search
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ])
  },
  data() {
    return {
      dialogFormVisible: false,
      textMap: {
        'aboutTitle': '关于'
      },
      aboutTitle: 'aboutTitle'
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>

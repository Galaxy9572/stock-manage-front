<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
import CopyRight from './CopyRight'

export default {
  name: 'AppMain',
  components: {
    CopyRight
  },
  data() {
    return {
      isEnter: true
    }
  },
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header + .app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header + .app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}

.index {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.el-container {
  margin: 0 0;
  padding: 0 0;
  width: 100%;
  min-height: 98%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.el-main {
  margin: 0 0;
  padding: 0 0;
  height: 100%;
  overflow: hidden;
}

.el-footer {
  display: flex;
  width: 100%;
  align-items: center;
  box-shadow: 0 -1px rgba(0, 0, 0, .12);
}
</style>

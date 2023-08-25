<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <Sidebar></Sidebar>
      <router-view/>
    </div>
  </a-config-provider>
</template>
<style>
#app {
  display: flex;
}
</style>
<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
import Sidebar from '@/components/Sidebar'

export default {
  name: 'App',
  components: {Sidebar},
  data() {
    return {
      locale: zhCN,
    };
  },
}
</script>
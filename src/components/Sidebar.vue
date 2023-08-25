<template>
  <div id="sidebar">
    <Avatar></Avatar>
    <div class="icons-list">
      <router-link to="/note" title="笔记">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-biji"></use>
        </svg>
      </router-link>
      <router-link to="/notebooks" title="笔记本">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-bijiben"></use>
        </svg>
      </router-link>
      <router-link to="/trash" title="回收站">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-huishouzhan"></use>
        </svg>
      </router-link>
    </div>
    <div class="logout" @click="logout">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-tuichu"></use>
      </svg>
    </div>
  </div>
</template>

<script>
import Auth from '@/apis/auth'
import Avatar from "./Avatar.vue";
export default {
  name: "Sidebar",
  components: { Avatar },
  methods:{
    async logout(){
      await Auth.logout();
      await this.$router.push({path: '/login'})
    }
  }
};
</script>

<style lang="less" scoped>
.icon {
  width: 1.8em;
  height: 1.8em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
  color: #fff;
}
#sidebar {
  position: relative;
  width: 60px;
  height: 100vh;
  background-color: #2c333c;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 20px;
  padding-bottom: 50px;
}
.icons-list {
  width: 100%;
  height: 22%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
  a {
    width: 100%;
    text-align: center;
    padding: 6px 0;
  }
  .router-link-active {
    background-color: #5e6266;
  }
}

.logout {
  position: absolute;
  bottom: 24px;
}
</style>

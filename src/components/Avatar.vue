<template>
  <div id="avatar">
    <div class="avatar-img">
      <span :title="username">{{slug}}</span>
    </div>
  </div>
</template>

<script>
import Bus from '@/helpers/bus';
import Auth from "@/apis/auth";

export default {
  name: "Avatar",
  data() {
    return {
      username: ''
    };
  },
  computed:{
    slug(){
      return this.username.charAt(0).toUpperCase();
    }
  },
  async created() {
    Bus.$on('userInfo', msg=>{
      this.username = msg.username;
    })
    let {isLogin, data} = await Auth['getInfo']();
    if (isLogin){
      this.username = data.username;
    }else {
      this.username = '未登录';
    }
  }
};
</script>

<style lang="less" scoped>
.avatar-img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #ff9c00;
  display: flex;
  justify-content: center;
  align-items: center;
  span{
    color: white;
    font-weight: bold;
    font-size: 28px;
  }
}
</style>

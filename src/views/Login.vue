<template>
  <div id="login">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="main"></div>
          <div class="form">
            <h3 @click="change('register')">创建账户</h3>
            <transition name="slide">
              <div :class="{show: isRegister}" class="register">
                <input type="text" v-model="user.username" placeholder="用户名">
                <input type="password" v-model="user.password" placeholder="密码">
                <p :class="{error: user.isError}">{{ user.notice || '创建账户后，请记住用户名和密码' }}</p>
                <div class="button" @click="onSubmit('register')">创建账户</div>
              </div>
            </transition>
            <h3 @click="change('login')">登录</h3>
            <transition name="slide">
              <div :class="{show: isLogin}" class="login">
                <input type="text" v-model="user.username" placeholder="用户名">
                <input type="password" v-model="user.password" placeholder="密码">
                <p :class="{error: user.isError}">{{ user.notice || '输入用户名和密码' }}</p>
                <div class="button" @click="onSubmit('login')">登录</div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Auth from "@/apis/auth";
import Bus from "@/helpers/bus"

export default {
  name: "Login",
  data() {
    return {
      isRegister: false,
      isLogin: true,
      user: {
        username: '',
        password: '',
        notice: '',
        isError: false
      },
    };
  },
  methods: {
    change(e) {
      if (e === 'register' && this.isRegister === true) return;
      if (e === 'login' && this.isLogin === true) return;
      this.isRegister = !this.isRegister;
      this.isLogin = !this.isLogin;
      for (const userKey in this.user)
        if (userKey !== 'isError') this.user[userKey] = '';
      this.user.isError = false;
    },
    async onSubmit(e) {
      this.ruler()
      let {data,msg} = await Auth[e]({username: this.user.username, password: this.user.password});
      if (msg==='创建成功'||msg==='登录成功'){
        Bus.$emit('userInfo', {username: data.username})
        await this.$router.push({path: '/notebooks'})
      }
    },
    ruler() {
      if (!/^[\w\u4e00-\u9fa5]{3,15}$/.test(this.user.username)) {
        this.user.isError = true
        this.user.notice = '用户名3~15个字符，仅限于字母数字下划线中文'
        return
      }
      if (!/^.{6,16}$/.test(this.user.password)) {
        this.user.isError = true
        this.user.notice = '密码长度为6~16个字符'
        return
      }
      this.user.isError = false
      this.user.notice = ''
      console.log(`start register..., username: ${this.user.username} , password: ${this.user.password}`)
    }
  },
  async created() {
    let {isLogin, data} = await Auth['getInfo']();
    if (isLogin){
      Bus.$emit('userInfo', {username: data.username})
      await this.$router.push({path: '/notebooks'})
    }
  }
};
</script>

<style lang="less" scoped>
.modal-mask {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .7);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 800px;
  height: 500px;
  margin: 0 auto;
  background-color: white;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
  display: flex;

  .main {
    flex: 1;
    background: #36bc64 url(//cloud.hunger-valley.com/17-12-13/38476998.jpg-middle) center center no-repeat;
    background-size: contain;
  }

  .form {
    width: 270px;
    border-left: 1px solid #ccc;
    overflow: hidden;

    h3 {
      padding: 10px 20px;
      margin-top: -1px;
      font-size: 16px;
      border-top: 1px solid #eee;
      cursor: pointer;

      &:nth-of-type(2) {
        border-bottom: 1px solid #eee;
      }
    }

    .button {
      background-color: #2bb964;
      height: 36px;
      line-height: 36px;
      text-align: center;
      font-weight: bold;
      color: #fff;
      border-radius: 4px;
      margin-top: 12px;
      margin-bottom: 10px;
      cursor: pointer;
    }

    .login, .register {
      padding: 0 20px;
      border-top: 1px solid #eee;
      height: 0;
      overflow: hidden;
      transition: height .4s;

      &.show {
        height: 193px;
      }

      input {
        display: block;
        width: 100%;
        height: 35px;
        line-height: 35px;
        padding: 0 6px;
        border-radius: 4px;
        border: 1px solid #ccc;
        outline: none;
        font-size: 14px;
        margin-top: 12px;
      }

      input:focus {
        border: 3px solid #9dcaf8;
      }

      p {
        font-size: 12px;
        margin-top: 10px;
        color: #444;
      }

      .error {
        color: red;
      }
    }

    .login {
      border-top: 0;
    }
  }
}
</style>

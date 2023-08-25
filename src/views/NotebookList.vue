<template>
  <div class="detail" id="notebook-list">
    <header>
      <a href="#" class="btn" @click.prevent="onCreate">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-zengjia"></use>
        </svg>
        <span>新建笔记本</span>
      </a>
    </header>
    <main>
      <div class="layout">
        <h3>笔记本列表({{ notebooks.length }})</h3>
        <div class="book-list">
          <router-link v-for="(notebook,i) in notebooks" :key="i" :to="`/note?notebookId=${notebook.id}`"
                       class="notebook">
            <div>
              <a-icon type="book" /> {{ notebook.title }}
              <span>{{ notebook.noteCounts }}</span>
              <span class="action" @click.stop.prevent="onEdit(notebook)">编辑</span>
              <span class="action" @click.stop.prevent="onDelete(notebook)">删除</span>
              <span class="date">{{ notebook.createdAtFriendly }}</span>
            </div>
          </router-link>
        </div>
      </div>
    </main>
    <Model ref="collectionForm" :model="model" @cancel="handleCancel" @create="handleCreate"></Model>
  </div>
</template>

<script>
import {mapGetters,mapActions} from 'vuex';
import Model from "@/components/Modal"

export default {
  name: 'NotebookList',
  components: {Model},
  data() {
    return {
      msg: '',
      notebook: {},
      model: {
        title: '',
        visible: false,
        confirmLoading: false,
        ModalText: '',
        notebookName: ''
      }
    }
  },
  methods: {
    ...mapActions(['addNotebook','updateNotebook','getNotebooks','deleteNotebook']),
    async onCreate() {
      this.form.resetFields();
      this.model = {
        title: '新建笔记本',
        visible: true,
        ModalText: '请输入笔记本的名称'
      }
    },
    async onEdit(notebook) {
      this.form.resetFields();
      this.model = {
        title: '修改笔记本',
        visible: true,
        ModalText: '请输入笔记本的新名称',
        notebookName: notebook.title
      }
      this.notebook = notebook;
    },
    async onDelete(notebook) {
      const that = this;
      this.$confirm({
        title: '确定要删除这个笔记本？',
        content: () => <div style="color:red;">需要先彻底删除这个笔记本中的笔记</div>,
        async onOk() {
          await that.deleteNotebook({notebookId: notebook.id});
        },
        onCancel() {},
        class: 'test',
      });
    },
    handleCancel(visible) {
      this.model.visible = visible;
      this.form.resetFields();
    },
    handleCreate() {
      this.form.validateFields(async (err, values) => {
        if (err) {
          return;
        }
        this.model.confirmLoading = true;
        const {title} = values;
        if (this.model.title === "新建笔记本") {
          await this.addNotebook({title})
        } else {
          await this.updateNotebook({notebookId:this.notebook.id,title});
        }
        this.model.confirmLoading = false;
        this.model.visible = false;
      });
    }
  },
  computed:{
    ...mapGetters(['notebooks']),
    form(){
      return this.$refs.collectionForm.form;
    }
  },
  mounted() {
    this.getNotebooks();
  }
}
</script>

<style lang="less" scoped>
.icon {
  width: 1.2em;
  height: 1.2em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

#notebook-list {
  flex: 1;
  background-color: #f8f8f8;

  .btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100px;
    height: 26px;
    background-color: white;
    font-size: 12px;
    color: #666;
    cursor: pointer;
    margin-left: 10px;
    border: 1px solid #cccccc;
  }

  .btn .iconfont {
    font-size: 12px;
  }

  input {
    width: 300px;
    height: 30px;
    line-height: 30px;
    border: 1px solid #ccc;
    border-radius: 3px;
    padding: 3px 5px;
    outline: none;
  }

  header {
    padding: 12px;
    border-bottom: 1px solid #ccc;
  }

  main {
    padding: 30px 40px;
  }

  .layout {
    max-width: 966px;
    margin: 0 auto;
  }


  main h3 {
    font-size: 12px;
    color: #000;
  }

  main .book-list {
    margin-top: 10px;
    font-size: 14px;
    color: #666;
    background-color: #fff;
    border-radius: 4px;
    font-weight: bold;
  }

  main .book-list span {
    font-size: 12px;
    font-weight: bold;
    color: #b3c0c8;
  }

  main .date,
  main .action {
    float: right;
    margin-left: 10px;
  }

  main .iconfont {
    color: #1687ea;
    margin-right: 4px;
  }

  main .notebook {
    display: block;
    cursor: pointer;
  }

  main a.notebook:hover {
    background-color: #f7fafd;
  }

  main a.notebook div {
    border-bottom: 1px solid #ebebeb;
    padding: 12px 14px;
  }

  main .error-msg {
    font-size: 12px;
    color: red;
  }
}
</style>
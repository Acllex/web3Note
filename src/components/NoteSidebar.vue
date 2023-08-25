<template>
  <div id="node-sidebar">
    <header>
      <div class="no-book" v-if="notebooks.length===0">
        <span>没有笔记本</span>
      </div>
        <a-dropdown v-if="notebooks.length!==0" class="dropdowns" :trigger="['click']" placement="bottomCenter">
          <a class="ant-dropdown-link" @click="e => e.preventDefault()">{{ curBook.title }}
            <a-icon type="down"/>
          </a>
          <a-menu slot="overlay">
            <a-menu-item @click="selectBook(notebook)" v-for="notebook in notebooks" :key="notebook.id">
              <span>{{ notebook.title }}</span>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
        <a-button v-if="notebooks.length!==0" @click="addNote({notebookId: curBook.id})" class="right-button" size="small">添加笔记</a-button>
    </header>
    <main>
      <div class="menu">
        <div>更新时间</div>
        <div>标题</div>
      </div>
      <ul class="notes" v-if="notes.length!==0">
        <li v-for="(note,index) in notes" :key="index">
          <router-link :to="`/note?noteId=${note.id}&notebookId=${curBook.id}`">
            <span class="date">{{ note.updatedAtFriendly }}</span>
            <span class="title">{{ note.title }}</span>
          </router-link>
        </li>
      </ul>
      <div class="no-notes"  v-else-if="notes.length===0&&isShow"><span>当前笔记本没有笔记，请添加笔记</span></div>
    </main>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
export default {
  name: 'NoteSidebar',
  data() {
    return {
      isShow: false
    }
  },
  methods: {
    ...mapActions(['getNotebooks','getNotes','addNote']),
    async selectBook(notebook) {
      if (notebook.id===this.curBook.id)return;
      this.$store.commit('setCurBook', {curBookId: notebook.id});
      await this.getNotes({notebookId: this.curBook.id});
      await this.$router.push({path: `/note?noteId=${this.curNote.id}&notebookId=${this.curBook.id}`})
    }
  },
  computed:{
    ...mapGetters(['notebooks','notes','curBook','curNote'])
  },
  created() {
    this.$nextTick(async () => {
      await this.getNotebooks();
      const notebookId = Number(this.$route.query.notebookId);
      this.$store.commit('setCurBook', {curBookId: notebookId})
      await this.getNotes({notebookId: this.curBook.id});
      this.$store.commit('setCurNote', {curNoteId: Number(this.$route.query.noteId)})
      this.isShow= true;
    })

  }
}
</script>

<style lang="less" scoped>
#node-sidebar {
  width: 360px;
  height: 100vh;
  overflow: hidden;
  border-right: 1px solid #ccc;
  background-color: #eee;

  header {
    width: 100%;
    padding: 12px 8px;
    display: flex;
    justify-content: flex-start;
    position: relative;
    align-items: center;
    background-color: #f7f7f7;
    border-bottom: 1px solid #ccc;
    .no-book{
      width: 100%;
      display: flex;
      justify-content: center;
    }
    .dropdowns {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);

      .ant-dropdown-link {
        font-size: 20px;
      }
    }

    .right-button {
      margin-left: auto;
    }
  }

  main {
    width: 100%;
    height: 100%;
    dd,
    dl,
    dt,
    li,
    ol,
    ul {
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .menu {
      display: flex;

      div {
        font-size: 12px;
        padding: 2px 10px;
        flex: 1;
        border-right: 1px solid #ccc;
        border-bottom: 1px solid #ccc;

        &:last-child {
          border-right: none;
        }
      }
    }

    .notes {
      li {

        &:nth-child(odd) {
          background-color: #f2f2f2;
        }

        a {
          display: flex;
          padding: 3px 0;
          font-size: 12px;
          border: 2px solid transparent;
        }

        .router-link-exact-active {
          border: 2px solid #81c0f3;
          border-radius: 3px;
        }

        span {
          padding: 0 10px;
          flex: 1;
        }
      }
    }

    .no-notes {
      padding: 12px 0;
      width: 100%;
      display: flex;
      justify-content: center;
    }
  }
}
</style>
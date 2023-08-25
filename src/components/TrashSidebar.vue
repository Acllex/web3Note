<template>
  <div id="node-sidebar">
    <header>
      <span>回收站</span>
    </header>
    <main>
      <div class="menu">
        <div>删除时间</div>
        <div>标题</div>
      </div>
      <ul class="notes" v-if="trashNotes.length!==0">
        <li v-for="(note,index) in trashNotes" :key="index">
          <router-link :to="`/trash?trashNoteId=${note.id}&notebookId=${note.notebookId}`">
            <span class="date">{{ note.updatedAtFriendly }}</span>
            <span class="title">{{ note.title }}</span>
          </router-link>
        </li>
      </ul>
      <div class="no-notes"  v-else-if="trashNotes.length===0&&isShow"><span>当前回收站没有笔记</span></div>
    </main>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
export default {
  name: 'TrashSidebar',
  data(){
    return{
      isShow: true
    }
  },
  methods:{
    ...mapActions(['getTrashNotes','getNotebooks'])
  },
  computed:{
    ...mapGetters(['trashNotes','curTrashNote'])
  },
  mounted() {
    this.$nextTick(async ()=>{
      await this.getTrashNotes();
      await this.getNotebooks();
      this.$store.commit('setCurTrashNote',{curTrashNoteId: Number(this.$route.query.trashNoteId)})
      this.$store.commit('setCurBook', {curBookId: this.curTrashNote.notebookId});
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
    justify-content: center;
    position: relative;
    align-items: center;
    background-color: #f7f7f7;
    border-bottom: 1px solid #ccc;
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
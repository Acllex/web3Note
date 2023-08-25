<template>
  <div id="note">
    <TrashSidebar></TrashSidebar>
    <div class="note-detail">
      <div class="note-empty" v-show="!curTrashNote.id">请选择笔记</div>
      <div class="note-detail-ct" v-show="curTrashNote.id">
        <div class="note-bar">
          <span> 创建日期: {{ curTrashNote.createdAtFriendly }}</span>
          <span> 删除日期: {{ curTrashNote.updatedAtFriendly }}</span>
          <span> 所属笔记本: {{ curBook.title }}</span>
          <a @click.prevent="removeNote" :style="{float:'right',marginLeft:'4px',cursor: 'pointer'}">彻底删除</a>
          <a @click.prevent="revertNote" :style="{float:'right',marginRight:'4px',cursor: 'pointer'}">还原笔记</a>
        </div>
        <div class="note-title">
          <span>{{ curTrashNote.title }}</span>
        </div>
        <div class="editor">
          <div class="preview markdown-body" v-html="previewContent"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TrashSidebar from "@/components/TrashSidebar";
import {mapGetters, mapActions} from 'vuex';
import MarkdownIt from "markdown-it";

const md = new MarkdownIt();

export default {
  name: 'NoteDetail',
  components: {TrashSidebar},
  data() {
    return {}
  },
  methods: {
    ...mapActions(['revertTrashNote', 'deleteTrashNote']),
    async removeNote() {
      const that = this;
      this.$confirm({
        title: '确定要彻底删除这个笔记吗？',
        content: () => <div style="color:red;">将彻底删除笔记</div>,
        async onOk() {
          await that.deleteTrashNote({noteId: that.curTrashNote.id})
          await that.$router.replace({path: `/trash?trashNoteId=${that.curTrashNote.id}&notebookId=${that.curTrashNote.notebookId}`})
        },
        onCancel() {},
        class: 'test',
      });
    },
    async revertNote(){
      await this.revertTrashNote({noteId: this.curTrashNote.id});
      await this.$router.replace({path: `/trash?trashNoteId=${this.curTrashNote.id}&notebookId=${this.curTrashNote.notebookId}`})
    }
  },
  computed: {
    previewContent() {
      return md.render(this.curTrashNote.content || '')
    },
    ...mapGetters(['curTrashNote','curBook'])
  },
  beforeRouteUpdate(to, from, next) {
    this.$store.commit('setCurTrashNote', {curTrashNoteId: Number(to.query.trashNoteId)});
    this.$store.commit('setCurBook', {curBookId: this.curTrashNote.notebookId});
    next()
  }
}
</script>

<style lang="less" scoped>

#note {
  display: flex;
  align-items: stretch;
  background-color: #fff;
  flex: 1;
  overflow: hidden;
}

.note-detail {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding-bottom: 30px;

  .note-detail-ct {
    height: 100%;
  }

  .note-empty {
    font-size: 50px;
    color: #ccc;
    text-align: center;
    margin-top: 100px;
  }

  .note-bar {
    padding: 4px 30px;
    border-bottom: 1px solid #eee;

    a {
      font-size: 12px;
      padding: 2px 4px;
      border: 1px solid #2c333c;
      border-radius: 2px;
    }

    &
    :after {
      content: '';
      display: inline-block;
      clear: both;
    }

    span {
      font-size: 12px;
      color: #999;
      margin-right: 4px;
    }

  }

  .note-title {

    input, span {
      display: inline-block;
      width: 100%;
      border: none;
      outline: none;
      font-size: 18px;
      padding: 10px 20px;
    }

  }

  .editor {
    height: ~ "calc(100% - 70px)";
    position: relative;
  }

  textarea, .preview {
    position: absolute;
    width: 100%;
    height: 100%;
    padding: 20px 20px 0 20px;
  }

  textarea {
    border: none;
    resize: none;
    outline: none;
    font-size: 14px;
    font-family: 'Monaco', courier, monospace;
  }

  code {
    color: #f66;
  }

}
</style>
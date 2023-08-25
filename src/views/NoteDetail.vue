<template>
  <div id="note">
    <NoteSidebar v-show="isSidebar"></NoteSidebar>
    <div class="note-detail">
      <div class="note-empty" v-show="notebooks.length===0">请新建笔记本</div>
      <div class="note-empty" v-show="notebooks.length!==0&&!curNote.id">请选择笔记</div>
      <div class="note-detail-ct" v-show="curNote.id">
        <div class="note-bar">
          <span> 创建日期: {{ curNote.createdAtFriendly }}</span>
          <span> 更新日期: {{ curNote.updatedAtFriendly }}</span>
          <span> {{ statusText }}</span>
          <a-icon @click="removeNote" :style="{float:'right',marginLeft:'4px',fontSize:'20px',cursor: 'pointer'}"
                  type="delete"/>
          <a-icon @click="change" :style="{float:'right',marginRight:'8px',fontSize:'20px',cursor: 'pointer'}"
                  :type="editAndEye"/>
          <a-icon @click="changeSidebar" :type="fullscreenType"
                  :style="{float:'right',marginRight:'12px',fontSize:'20px',cursor: 'pointer'}"/>
        </div>
        <div class="note-title">
          <input v-show="isShowPreview" type="text" v-model="curNote.title" @input="updateNoteContent"
                 @keydown="statusText='正在输入...'"
                 placeholder="输入标题">
          <span v-show="!isShowPreview">{{ curNote.title }}</span>
        </div>
        <div class="editor">
          <textarea v-show="isShowPreview" v-model="curNote.content" @input="updateNoteContent"
                    @keydown="statusText='正在输入...'" placeholder="输入内容, 支持 markdown 语法"></textarea>
          <div class="preview markdown-body" v-show="!isShowPreview" v-html="previewContent"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NoteSidebar from "@/components/NoteSidebar";
import {mapGetters, mapActions} from 'vuex';
import MarkdownIt from "markdown-it";
import _ from "lodash";

const md = new MarkdownIt();

export default {
  name: 'NoteDetail',
  components: {NoteSidebar},
  data() {
    return {
      statusText: '笔记未改动',
      isShowPreview: true,
      editAndEye: 'eye',
      isSidebar: true,
      fullscreenType: 'fullscreen',
    }
  },
  methods: {
    ...mapActions(['updateNote', 'deleteNote']),
    updateNoteContent: _.debounce(async function () {
      await this.updateNote({noteId: this.curNote.id, title: this.curNote.title, content: this.curNote.content})
      this.statusText = '笔记已保存';
    }, 1000),
    async removeNote() {
      await this.deleteNote({noteId: this.curNote.id})
      await this.$router.replace({path: `/note?noteId=${this.curNote.id}&notebookId=${this.curBook.id}`})
    },
    change() {
      this.isShowPreview = !this.isShowPreview;
      this.editAndEye = this.isShowPreview === true ? 'eye' : 'edit';
    },
    changeSidebar() {
      this.isSidebar = !this.isSidebar;
      this.fullscreenType = this.isSidebar === true?'fullscreen':'fullscreen-exit'
    }
  },
  computed: {
    previewContent() {
      return md.render(this.curNote.content || '')
    },
    ...mapGetters(['curNote', 'curBook','notebooks'])
  },
  beforeRouteUpdate(to, from, next) {
    this.$store.commit('setCurNote', {curNoteId: Number(to.query.noteId)})
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
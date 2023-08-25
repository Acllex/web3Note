<template>
  <div>
    <a-modal
        :title="model.title"
        :visible="model.visible"
        :confirm-loading="model.confirmLoading"
        @cancel="() => { $emit('cancel',false) }"
        @ok="() => { $emit('create') }"
    >
      <a-form layout='vertical' :form="form">
        <a-form-item :label="model.ModalText">
          <a-input
              v-decorator="[
              'title',
              {
                initialValue: model.notebookName,
                rules: [{ required: true, max:30, message: '请输入笔记本名称，且最长为30字符' }],
              }
            ]"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
export default {
  props: ['model'],
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'form_in_modal' });
  },
};
</script>
import Notebooks from '@/apis/notebooks'
import {message} from 'ant-design-vue';

const notebooks = {
    state: () => ({
        notebooks: [],
        curBookId: null
    }),
    getters: {
        notebooks: state => state.notebooks,
        curBook: state => {
            return state.notebooks.find(notebook => notebook.id === state.curBookId) || state.notebooks[0] || {}
        }
    },
    mutations: {
        setNotebooks(state, payload) {
            state.notebooks = payload.notebooks;
        },
        addNotebook(state, payload) {
            state.notebooks.unshift(payload.notebook)
        },
        updateNotebook(state, payload) {
            let notebook = state.notebooks.find(notebook => notebook.id === payload.notebookId) || {};
            notebook.title = payload.title
        },
        deleteNotebook(state, payload) {
            state.notebooks = state.notebooks.filter(notebook => notebook.id !== payload.notebookId)
        },
        setCurBook(state, payload){
            state.curBookId = payload.curBookId;
        }
    },
    actions: {
        async getNotebooks({commit}) {
            const {data} = await Notebooks.getAll();
            commit('setNotebooks', {notebooks: data})
        },
        async addNotebook({commit}, payload) {
            const {msg, data} = await Notebooks.addNotebook({title: payload.title});
            message.success(msg);
            commit('addNotebook', {notebook: data});
        },
        async updateNotebook({commit}, payload) {
            const {msg} = await Notebooks.updateNotebook(payload.notebookId, {title: payload.title});
            message.success(msg);
            commit('updateNotebook', payload);
        },
        async deleteNotebook({commit}, payload) {
            const res = await Notebooks.deleteNotebook(payload.notebookId);
            if (res)message.success(res.msg)
            commit('deleteNotebook', payload)
        }
    }
}

export default notebooks;
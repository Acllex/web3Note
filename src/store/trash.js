import Trash from '@/apis/trash';
import {message} from 'ant-design-vue';

const trash = {
    state:{
        trashNotes: [],
        curTrashNoteId: null
    },
    getters:{
        trashNotes: state=>state.trashNotes,
        curTrashNote: state=>{
            return state.trashNotes.find(trashNote => trashNote.id === state.curTrashNoteId) || state.trashNotes[0] || {}
        }
    },
    mutations:{
        setTrashNotes(state, payload){
            state.trashNotes = payload.trashNotes;
        },
        deleteTrashNote(state,payload){
          state.trashNotes = state.trashNotes.filter(note=>note.id!==payload.noteId)
        },
        setCurTrashNote(state, payload) {
            state.curTrashNoteId = payload.curTrashNoteId;
        }
    },
    actions:{
        async getTrashNotes({commit}){
            const {data} = await Trash.getAll();
            commit('setTrashNotes',{trashNotes: data});
        },
        async deleteTrashNote({commit}, payload){
            const {msg} = await Trash.deleteNote({noteId: payload.noteId});
            message.success(msg)
            commit('deleteTrashNote', payload);
        },
        async revertTrashNote({commit},payload){
            const {msg} = await Trash.revertNote({noteId: payload.noteId});
            message.success(msg)
            commit('deleteTrashNote', payload);
        }
    }
}

export default trash;
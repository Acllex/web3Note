import Notes from '@/apis/notes'
import {message} from 'ant-design-vue';
import util from "@/helpers/util";

const notes = {
    state: () => ({
        notes: [],
        curNoteId: null
    }),
    getters: {
        notes: state => state.notes,
        curNote: state => {
            return state.notes.find(note => note.id === state.curNoteId) || state.notes[0] || {}
        }
    },
    mutations: {
        setNotes(state, payload) {
            state.notes = payload.notes;
        },
        addNote(state, payload) {
            payload.note.updatedAtFriendly = util.friendlyDate(payload.note.updatedAt)
            state.notes.unshift(payload.note);
        },
        updateNote(state, payload) {
            let note = state.notes.find(note => note.id === payload.noteId) || {};
            note.title = payload.title;
            note.content = payload.content;
        },
        deleteNote(state, payload) {
            state.notes = state.notes.filter(note => note.id !== payload.noteId)
        },
        setCurNote(state, payload) {
            state.curNoteId = payload.curNoteId
        }
    },
    actions: {
        async getNotes({commit}, payload) {
            try {
                const {data} = await Notes.getAll({notebookId: payload.notebookId});
                commit('setNotes', {notes: data})
            } catch (e) {
                console.log(e)
            }
        },
        async addNote({commit}, payload) {
            const {msg, data} = await Notes.addNote({notebookId: payload.notebookId}, {
                title: payload.title,
                content: payload.content
            });
            message.success(msg);
            commit('addNote', {note: data});
        },
        async updateNote({commit}, payload) {
            await Notes.updateNote({noteId: payload.noteId}, {title: payload.title, content: payload.content});
            commit('updateNote', payload);
        },
        async deleteNote({commit}, payload) {
            const {msg} = await Notes.deleteNote({noteId: payload.noteId});
            message.success(msg)
            commit('deleteNote', payload)
        }
    }
}

export default notes;
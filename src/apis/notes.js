import request from "@/helpers/request";
import util from "@/helpers/util";

const URL = {
    GET: '/notes/from/:notebookId',
    ADD: '/notes/to/:notebookId',
    UPDATE: '/notes/:noteId',
    DELETE: '/notes/:noteId'
}

export default {
    async getAll({notebookId}) {
        try {
            let res = await request(URL.GET.replace(':notebookId', notebookId));
            res.data = res.data.map(note => {
                note.createdAtFriendly = util.friendlyDate(note.createdAt);
                note.updatedAtFriendly = util.friendlyDate(note.updatedAt);
                return note;
            }).sort((note1, note2) => note1.updatedAt < note2.updatedAt ? 1 : -1);
            return res;
        } catch (e) {
            console.log(e)
            return;
        }

    },
    updateNote({noteId}, {title, content}) {
        return request(URL.UPDATE.replace(':noteId', noteId), 'PATCH', {title, content})
    },
    deleteNote({noteId}) {
        return request(URL.DELETE.replace(':noteId', noteId), 'DELETE')
    },
    addNote({notebookId}, {title = '', content = ''} = {title: '新建笔记', content: ''}) {
        return request(URL.ADD.replace(':notebookId', notebookId), 'POST', {title, content})
    }
}
import request from "@/helpers/request";
import util from '@/helpers/util'

const URL = {
    GET: '/notebooks',
    ADD: '/notebooks',
    UPDATE: '/notebooks/:id',
    DELETE: '/notebooks/:id'
}

export default {
    async getAll() {
        let res = await request(URL.GET);
        res.data.sort((notebook1, notebook2) =>
            notebook1.createdAt < notebook2.createdAt ? 1 : -1).forEach(notebook => {
            notebook.createdAtFriendly = util.friendlyDate(notebook.createdAt);
            notebook.updatedAtFriendly = util.friendlyDate(notebook.updatedAt);
        });
        return res;
    },
    updateNotebook(notebookId, {title = ''} = {title: ''}) {
        return request(URL.UPDATE.replace(':id', notebookId), 'PATCH', {title})
    },
    deleteNotebook(notebookId) {
        return request(URL.DELETE.replace(':id', notebookId), 'DELETE')
    },
    async addNotebook({title = ''} = {title: ''}) {
        let res = await request(URL.ADD, 'POST', {title});
        res.data.createdAtFriendly = util.friendlyDate(res.data.createdAt);
        res.data.updatedAtFriendly = util.friendlyDate(res.data.updatedAt);
        return res;
    }
}
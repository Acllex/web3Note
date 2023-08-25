import request from '@/helpers/request'
import util from "@/helpers/util";

const URL = {
    GET: '/notes/trash',
    REVERT: '/notes/:noteId/revert',
    DELETE: '/notes/:noteId/confirm'
}

export default {
    getAll() {
        return new Promise((resolve, reject) => {
            request(URL.GET)
                .then(res => {
                    res.data = res.data.sort((note1, note2) => note1.updatedAt < note2.updatedAt? 1 : -1)
                    res.data.forEach(note => {
                        note.createdAtFriendly = util.friendlyDate(note.createdAt)
                        note.updatedAtFriendly = util.friendlyDate(note.updatedAt)
                    })
                    resolve(res)
                }).catch(err => {
                reject(err)
            })
        })
    },

    deleteNote({ noteId }) {
        return request(URL.DELETE.replace(':noteId', noteId), 'DELETE')
    },

    revertNote({ noteId }) {
        return request(URL.REVERT.replace(':noteId', noteId), 'PATCH')
    }

}
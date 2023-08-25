import axios from "axios";
import { message } from 'ant-design-vue';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.baseURL = 'https://note-server.hunger-valley.com/';
// 开启跨域支持
axios.defaults.withCredentials = true;

export default async function(url, type='GET', data={}){
    let option = {
        url,
        method: type,
        validateStatus(status) {
            return status >= 200 && status < 300||status===400;
        }
    }
    if(type.toLowerCase() === 'get'){
        option.params = data;
    }else {
        option.data = data;
    }
    try {
        const {status,data} = await axios(option);
        if (status!==200){
            if (data.msg==='缺少 notebookId 参数或者 notebookId 无效')return;
            message.error(data.msg);
            return;
        }
        return data;
    }catch (error){
        message.error('网络错误')
        console.error({msg: '网络错误'})
    }

}
export default {
    friendlyDate(datsStr){
        let dataObj = typeof datsStr === 'object'?datsStr:new Date(datsStr)
        let time = dataObj.getTime()
        let now = Date.now()
        let str = '';
        let space = now - time;


        switch (true){
            case space<1000*60:
                str = '刚刚';
                break;
            case space<1000*3600:
                str = Math.floor(space/(1000*60))+'分钟前';
                break;
            case space<1000*3600*24:
                str = Math.floor(space/(1000*3600))+'小时前';
                break;
            default:
                str = Math.floor(space/(1000*3600*24))+'天前';
                break;
        }
        return str;
    }
}
import axios from 'axios';

function get(url,para) {
    var result;
    axios.get(url,para).then(res=>{
        console.log(res);
        result = res;
    }).catch(err=>{
        console.log(err);
    });

    return result;
}

function post(url,data) {
    var result;
    axios({
        url:url,
        data:data,
        method:"POST"
    }).then(res=>{
        result = res;
    })

    return result;
}
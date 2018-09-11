'use strict';
const express = require('express');
const path = require('path');
const https = require('https');
const fs = require('fs');

const app = express();
app.use(express.static(path.join(__dirname,'public')));

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname,'index.html'))
});
//代理方式实现跨域
app.get('/proxy',(req,res) => {
    let url = 'https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&nc=1536657936885&pid=hp';
    let dataStr = '';
    let picStr = '';
    https.get(url,(response) => {
        response.on('data',(chunk) => {
               dataStr += chunk;
        });
        response.on('end',() => {
            console.log(typeof dataStr);
            console.log(dataStr);

            let jsonStr = JSON.parse(dataStr);
            let picUrl = 'https://cn.bing.com'+jsonStr.images[0].url;
            // res.json(picUrl);
            https.get(picUrl,(picData) => {
                picData.setEncoding('binary');  //以二进制接收图片数据
                picData.on('data',(chunk) => {
                    picStr += chunk;
                });
                picData.on('end',() => {
                    let urlStr = path.join('public/image',path.basename(picUrl));
                    fs.writeFileSync(urlStr,picStr,'binary');
                    res.json(path.basename(picUrl));
                })
            })
        });

    })
});
app.listen(3001,() => {
    console.log('server is listening in port 3001')
});
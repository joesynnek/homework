const http = require('http');
const URL = require('url');
const querystring = require("querystring");

function sleep(timeout) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, timeout);
    })
}

function getData(page, pageSize) {
    if ((page - 1) * pageSize > 199) {
        return {
            code: 0,
            message: "no more content",
            data: {
                list: []
            }
        }
    }
    let list = [];
    let id = (page - 1) * pageSize + 1;
    for (let i = 0; i < Math.min(pageSize, 199 - (page - 1) * pageSize); i++) {
        list.push({
            id: id++,
            name: "姓名" + id
        })
    }
    return {
        code: 1,
        message: "success",
        count: 199,
        data: {
            list
        }
    }
}

http.createServer((request, response) => {
    const { method, url } = request;
    const urlObj = URL.parse(url);
    const { pathname } = urlObj;
    const params = querystring.parse(urlObj.query);
    console.log(urlObj)
    console.log(params.page, params.pageSize)
    console.log(pathname)
    if (method !== "GET" || !/^\/data$/.test(pathname)) {
        response.statusCode = 404;
        response.end();
    } else {
        let body = [];
        request.on('error', (err) => {
            console.error(err);
        }).on('data', (chunk) => {
            body.push(chunk);
        }).on('end', async () => {
            if (Math.random() > 0.5) await sleep(Math.random() * 1000);
            body = JSON.stringify(getData(params.page, params.pageSize)).toString();

            response.on('error', (err) => {
                console.error(err);
            });

            response.statusCode = 200;
            response.setHeader("Access-Control-Allow-Origin", "*");
            response.setHeader('Content-Type', 'application/json');

            response.write(body);
            response.end();

        });
    }
}).listen(8080, () => {
    console.log("servering on port 8080!");
});
import AV from 'leanengine';
import util from 'util';
import config from './config/env';
import app from './config/express';
import http from 'http';

AV.init({
    appId: process.env.LEANCLOUD_APP_ID,
    appKey: process.env.LEANCLOUD_APP_KEY,
    masterKey: process.env.LEANCLOUD_APP_MASTER_KEY
});

// 如果不希望使用 masterKey 权限，可以将下面一行删除
AV.Cloud.useMasterKey();

const server = http.createServer(app);
const PORT = config.port;

server.listen(PORT, function() {
    console.log('Node app is running, port:', PORT);
    // 注册全局未捕获异常处理器
    process.on('uncaughtException', function(err) {
        console.error("Caught exception:", err.stack);
    });
    process.on('unhandledRejection', function(reason, p) {
        console.error("Unhandled Rejection at: Promise ", p, " reason: ", reason.stack);
    });
});

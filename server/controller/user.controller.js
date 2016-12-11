import AV from 'leanengine';
// `AV.Object.extend` 方法一定要放在全局变量，否则会造成堆栈溢出。
// 详见： https://leancloud.cn/docs/js_guide.html#对象
function requestSmsCode(req, res, next) {
    const mobilePhoneNumber = req.params.mobilePhoneNumber;
    AV.Cloud.requestSmsCode(mobilePhoneNumber)
        .then(function(success) {
            res.json(success)
        }, function(err) {
            next(err)
        });
}

function verifyMobilePhone(req, res, next) {
    const smsCode = Number(req.body.smsCode);
    AV.User.verifyMobilePhone(smsCode).then(function() {
        res.success("验证成功", 200);
    }, function(err) {
        next(err)
    });
}

function signUpOrlogInWithMobilePhone(req, res, next) {
    const body = req.body,
        smsCode = body.smsCode,
        mobilePhoneNumber = body.mobilePhoneNumber,
        attributes = {
            username: body.username,
            password: body.password
        };
    AV.User.signUpOrlogInWithMobilePhone(mobilePhoneNumber, smsCode, attributes)
        .then(function(user) {
            res.json(user);
        }, function(err) {
            next(err)
        });
}

export default { requestSmsCode, verifyMobilePhone, signUpOrlogInWithMobilePhone }

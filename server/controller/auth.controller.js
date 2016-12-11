import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import AV from 'leanengine';
import APIError from '../helpers/APIError';

const config = require('../../config/env');
/**
 * Returns jwt token if valid username and phone is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function create(req, res, next) {
    const body = req.body;
    const smsCode = body.smsCode;
    const mobilePhoneNumber = body.mobilePhoneNumber;
    const attributes = { username: body.username };
    AV.User.signUpOrlogInWithMobilePhone(mobilePhoneNumber, smsCode, attributes)
        .then(function(user) {
            const username = user.username;
            const objectId = user.objectId;
            const mobilePhoneNumber = user.mobilePhoneNumber;
            const token = jwt.sign({
                username: username,
                objectId: objectId,
                mobilePhoneNumber: mobilePhoneNumber
            }, config.jwtSecret);
            return res.json({
                token,
                username: username,
                mobilePhoneNumber: mobilePhoneNumber
            });
        }, function(err) {
            err = new APIError('Authentication error', httpStatus.UNAUTHORIZED);
            return next(err);
        });
}

/**
 * This is a protected route. Will return random number only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
function getRandomNumber(req, res) {
    // req.user is assigned by jwt middleware if valid token is provided
    return res.json({
        user: req.user,
        num: Math.random() * 100
    });
}

export default { create, getRandomNumber };

/**
 * 测试 文件
 * @author ydr.me
 * @create 2016-05-17 12:13
 */


'use strict';

var jsonp = require('../src/index.js');
var howdo = require('blear.utils.howdo');

describe('测试文件', function () {
    it('base', function (done) {
        jsonp({
            url: '/jsonp/success/',
            callbackKey: 'callback',
            callbackVal: 'fn',
        }, function (err, data) {
            expect(data).toEqual(2);
            done();
        });
    });

    it('error', function (done) {
        jsonp({
            url: '/jsonp/error/',
            callbackKey: 'callback',
            callbackVal: 'fnError',
        }, function (err, data) {
            expect(err.type).toEqual('response');
            done();
        });
    });

    it('callbackVal', function (done) {
        jsonp({
            url: '/jsonp/callbackVal/',
            callbackKey: 'callback',
        }, function (err, data) {
            expect(data).toEqual(2);
            done();
        });
    });

    it('cache', function (done1) {
        howdo
            .task(function(done2){
                jsonp({
                    url: '/jsonp/cache/',
                    callbackKey: 'callback',
                    callbackVal: 'fnc1',
                }, function (err, data) {
                    done2(null,data);
                });
            })
            .task(function(done2){
                jsonp({
                    url: '/jsonp/cache/',
                    callbackKey: 'callback',
                    callbackVal: 'fnc2',
                    cache:false,
                }, function (err, data) {
                    done2(null,data);
                });
            })
            .together(function(err,data1,data2){
                expect(data1).not.toEqual(data2)
                done1();
            })
    });
});

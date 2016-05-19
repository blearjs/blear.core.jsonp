/**
 * 跨域强求 jsonp
 * @author zcl
 * 2016-04-12 15:23
 */

var url =    require('blear.utils.url');
var object = require('blear.utils.object');
var loader = require('blear.utils.loader');
var fun =    require('blear.utils.function');
var random = require('blear.utils.random');

var win = window;
var defaults = {
    callbackKey: 'callback',
    callbackVal: null,
    timeout: loader.defaults.timeout,
    query: {},
    cache: true
};

/**
 * 获取 callback name
 * @param options
 * @returns {*}
 */
var getCallbackVal = function (options) {
    var callbackVal = options.callbackVal;

    if (callbackVal) {
        return callbackVal;
    }

    return 'JSONP_CALLBACK_' + random.guid();
};


/**
 * JSONP
 *
 * @param {Object|Function} options
 * @param options.url {String} 请求地址
 * @param options.callbackKey {String} 查询键
 * @param options.callbackVal {String} 回调名称
 * @param options.timeout {Number} 超时时间
 * @param options.query {Object} query
 * @param options.cache {Boolean} cache
 * @param {Function} callback 请求成功以后回调函数
 */
function jsonp(options, callback) {
    options = object.assign({}, defaults, options);

    var callbackVal = getCallbackVal(options);
    var cleanup = fun.once(function () {
        //try {
        //    // @fuckie Object doesn't support this action
        //    delete(win[callbackVal]);
        //} catch (err) {
        win[callbackVal] = null;
        //}
    });
    var hasError = false;

    win[callbackVal] = function (json) {
        if (!hasError) {
            callback(null, json);
        }

        cleanup();
    };

    var query = options.query;
    query[options.callbackKey] = callbackVal;

    if (!options.cache) {
        query._ = Math.random();
    }

    var jsonpURL = options.url;
    jsonpURL = url.assignQuery(jsonpURL, query);

    return loader.js({
        url: jsonpURL,
        timeout: options.timeout
    }, function (err) {
        hasError = err;
        cleanup();

        if (err) {
            callback(err);
        }
    });
}

module.exports = jsonp;

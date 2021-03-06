const { NacosConfigClient } = require('nacos');

let configClient = null;

async function init(serverAddr='127.0.0.1:8848') {
    // for find address mode
    // configClient = new NacosConfigClient({
    //     endpoint: 'acm.aliyun.com',
    //     namespace: '***************',
    //     accessKey: '***************',
    //     secretKey: '***************',
    //     requestTimeout: 6000,
    // });
    // for direct mode
    return configClient = new NacosConfigClient({
        serverAddr: serverAddr,
    });
}

function subscribe (dataId='test', group='DEFAULT_GROUP', callback) {
    // listen data changed
    configClient.subscribe({
        dataId: dataId,
        group: group,
    }, content => {
        if (callback) {
            callback(content);
        }
    });
}

async function publish (dataId='test', group='DEFAULT_GROUP', content, callback) {
    // publish config
    const state = await configClient.publishSingle(dataId, group, content);
    if (state) {
        console.log('修改配置成功');
        callback && callback();
    } else {
        console.log('修改配置失败');
    }
}

async function close (dataId='test', group='DEFAULT_GROUP') {
    await configClient.remove(dataId, group);
    configClient = null;
}

async function getRemoteConfig (name='test', group='DEFAULT_GROUP') {
    return await configClient.getConfig(name, group);
}

module.exports = {
    init,
    getRemoteConfig,
    subscribe,
    publish,
    close
}
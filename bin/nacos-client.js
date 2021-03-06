const {
    NacosNamingClient,
} = require('nacos');


async function init(ip, port, nacosServerAddress, providerServiceName, providerNamespase) {
    console.info('[ssr-nacos] 注册SSR-Nacos服务');
    const logger = console;
    const client = new NacosNamingClient({
        logger,
        serverList: nacosServerAddress,
        namespace: providerNamespase,
    });

    await client.ready().then(() => {
        logger.info(`[ssr-nacos] 连接成功: ${ip}:${port}`);
    }).catch(err => {
        logger.info(`[ssr-nacos] 连接粗错: ${ip}:${port}`);
    });
    await client.registerInstance(providerServiceName, {
        ip: ip,
        port
    }).then(() => {
        logger.info(`[ssr-nacos] 注册成功: ${ip}:${port}`);
    }).catch(err => {
        logger.error(`[ssr-nacos] 注粗错: ${ip}:${port}`);
    });
    
    return client;
}

async function end(client) {
    try {
        await client.close();
        await client.deregisterInstance(providerServiceName, {
            ip: ipAddr,
            port
        });
        logger.info(`[ssr-nacos] 注销成功: ${ipAddr}:${port}`);
    } catch (err) {
        logger.error('[ssr-nacos] 注销失败: ' + err.toString());
    }
}

module.exports = {
    init: init,
    end: end
}
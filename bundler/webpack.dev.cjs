const { merge } = require('webpack-merge');
const commonConfiguration = require('./webpack.common.js');
const portFinderSync = require('portfinder-sync');

const infoColor = (_message) => {
    return `\u001b[1m\u001b[34m${_message}\u001b[39m\u001b[22m`;
};

module.exports = merge(commonConfiguration, {
    mode: 'development',
    devServer: {
        host: '0.0.0.0',
        port: portFinderSync.getPort(8080),
        static: './dist',
        open: true,
        allowedHosts: 'all',
        client: {
            overlay: true,
        },
        onListening: async function(server) {
            const port = server.options.port;
            const https = server.options.server && server.options.server.type === 'https' ? 's' : '';
            const internalIp = await import('internal-ip');
            const localIp = internalIp.internalIpV4Sync();  // Use the correct function to get IPv4 address
            const domain1 = `http${https}://${localIp}:${port}`;
            const domain2 = `http${https}://localhost:${port}`;

            console.log(`Project running at:\n  - ${infoColor(domain1)}\n  - ${infoColor(domain2)}`);
        },
    },
});

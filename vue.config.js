module.exports = {
    css: {
        loaderOptions: {
            less: {
                lessOptions: {
                    modifyVars: {
                        'primary-color': '#2c333c',
                    },
                    javascriptEnabled: true,
                    math: 'always',
                },
            },
        },
    },
    chainWebpack(config){
        //修改htmlWebpackPlugin
        config.plugin('html').tap(args => {
            args[0].title = 'MoonNote';
            return args;
        })
    }
};
/**
 * Created by nico on 07.03.16.
 */

function serverConfig(environment) {

    var config = {

        ports: {
            http: (environment === 'production') ? 80 : 3001
        },

        listEndpoint: '/api/list',
        posEndpoint: '/api/pos'

    };

    return config;
}

module.exports = serverConfig;

// print serverConfig values for command line arguments
var args = process.argv.slice(2);
var config = serverConfig(process.env.NODE_ENV);

args.forEach(function (val, index) {
    console.log(config[val]);
});


const branch = process.env.TRAVIS_BRANCH;
process.env.PATH_PREFIX = {
    'staging': '/find-livsforloeb-testversion',
    'master': '/soeg',
}[branch] || '';

const config = {
    plugins: ['transform-inline-environment-variables'],
};

if(branch === 'master') {
    config.targets = '> 0.25%, not dead';
}

module.exports = config;

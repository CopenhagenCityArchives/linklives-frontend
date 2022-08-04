const branch = process.env.TRAVIS_BRANCH;

process.env.PATH_PREFIX = {
    'staging': '/find-livsforloeb-testversion',
    'master': '/soeg',
}[branch] || '';

process.env.EXCLUDE_PATHS = {
    'staging': '^.(?!find-livsforloeb-testversion)', // ?! is a negative lookahead: exclude IF NOT followed by staging url
    'master': '/find-livsforloeb-testversion', // exclude only test version page
}[branch] || [];

const config = {
    plugins: ['transform-inline-environment-variables'],
};

if(branch === 'master') {
    config.targets = '> 0.25%, not dead';
}

module.exports = config;

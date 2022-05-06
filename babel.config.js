if(process.env.TRAVIS_BRANCH !== 'staging') {
    module.exports = {
        targets: '> 0.25%, not dead',
    };
}
else {
    module.exports = {};
}

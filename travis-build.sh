# build angular app and login-button script
if [ $TRAVIS_BRANCH == "staging" ]; then
    npx ng build --output-hashing none --configuration=staging
    npx babel src/lls-login-button.js --out-file dist/linklives/lls-login-button.js --source-maps
else
    npx ng build --output-hashing none --configuration=production
    npx babel src/lls-login-button.js --out-file dist/linklives/lls-login-button.js --presets=@babel/preset-env
fi

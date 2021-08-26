if [ $TRAVIS_BRANCH == "staging" ]; then
    ng build --output-hashing none --configuration=staging
else
    ng build --output-hashing none --configuration=production
fi

npm run test:func
cat ./output/functional/test.json | ./node_modules/.bin/cucumber-junit-enhance > testresults/xmloutput.xml

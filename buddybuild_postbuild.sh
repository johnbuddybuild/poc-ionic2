echo 'Built app is' $BUDDYBUILD_IPA_PATH
dirname $BUDDYBUILD_IPA_PATH
ls -la "$(dirname "$BUDDYBUILD_IPA_PATH")"

#Only run functional tests on debug scheme
if [ "$BUDDYBUILD_SCHEME" != "MyApp - Debug" ]; then
  echo 'Scheme is not debug - skipping functional tests'
else
  echo 'Executing functional tests'
  npm run test:func
  ls -la $BUDDYBUILD_WORKSPACE/output
  #Covert Cucumber JSON output to JUnit XML
  cat $BUDDYBUILD_WORKSPACE/output/functional/test.json | ./node_modules/.bin/cucumber-junit-enhance > testresults/xmloutput.xml
fi

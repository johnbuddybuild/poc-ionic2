#Only run functional tests on debug scheme
if [ "$BUDDYBUILD_SCHEME" != "MyApp - Debug" ]; then
  echo 'Scheme is not debug - skipping functional tests'
else
  echo 'Executing functional tests'

  npm install -g authorize-ios
  sudo authorize-ios

  npm run test:func
  echo 'Functional tests should have finished'
  ls -la $BUDDYBUILD_WORKSPACE
  ls -la $BUDDYBUILD_WORKSPACE/output/functional
  #Covert Cucumber JSON output to JUnit XML
  mkdir $BUDDYBUILD_WORKSPACE/testresults
  cat $BUDDYBUILD_WORKSPACE/output/functional/test.json | $BUDDYBUILD_WORKSPACE/node_modules/.bin/cucumber-junit-enhance > $BUDDYBUILD_WORKSPACE/testresults/xmloutput.xml
fi

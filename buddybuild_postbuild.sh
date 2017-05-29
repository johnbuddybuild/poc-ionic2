#Only run functional tests on debug scheme
if [ -z "$BUDDYBUILD_SCHEME" ]; then
  echo 'Not an iOS build - skipping functional tests'
else
  echo 'Executing functional tests'

  #npm install -g authorize-ios
  #sudo authorize-ios

  npm run test:func
  echo 'Functional tests should have finished'
  ls -la $BUDDYBUILD_WORKSPACE
  ls -la $BUDDYBUILD_WORKSPACE/output/functional
  #Covert Cucumber JSON output to JUnit XML
  mkdir $BUDDYBUILD_WORKSPACE/testresults
  cat $BUDDYBUILD_WORKSPACE/output/functional/test.json | $BUDDYBUILD_WORKSPACE/node_modules/.bin/cucumber-junit-enhance > $BUDDYBUILD_WORKSPACE/testresults/xmloutput.xml

  #Try copying JUnit XML in root folder
  mkdir ./testresults
  cp $BUDDYBUILD_WORKSPACE/testresults/xmloutput.xml ./testresults
fi

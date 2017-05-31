mkdir $BUDDYBUILD_CUSTOM_TEST_RESULTS

source .ctpinit
npm run test:unit

#Only run functional tests on debug scheme
if [ -z "$BUDDYBUILD_SCHEME" ]; then
  echo 'Not an iOS build - skipping functional tests'
else
  echo 'Executing functional tests'

  #npm install -g authorize-ios
  #sudo authorize-ios

  npm run test:func
  status=$?
  if [ $status -ne 0 ]; then
    echo 'Functional tests failed'
    exit 1
  else
    echo 'Functional tests succeeded'
  fi

  ls -la $BUDDYBUILD_CUSTOM_TEST_RESULTS

  #Convert Cucumber JSON output to JUnit XML
  mkdir $BUDDYBUILD_CUSTOM_TEST_RESULTS/testresults

  cat output/functional/test.json | node_modules/.bin/cucumber-junit-enhance > $BUDDYBUILD_CUSTOM_TEST_RESULTS/testresults/xmloutput.xml
  #Try copying JUnit XML in root folder
  mkdir ./testresults
  cp $BUDDYBUILD_CUSTOM_TEST_RESULTS/testresults/xmloutput.xml ./testresults
  ls -la $BUDDYBUILD_CUSTOM_TEST_RESULTS/testresults
fi

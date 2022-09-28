(function(step, stepResult, assertionObject) {

    assertionObject.executeStep = function(step, stepResult) {
        var MESSAGE_KEY_PAUSING = "Running pause. Click on the page and then press the escape key to continue running or else wait for the timeout of " + step.timeout + " seconds";
        var messages = new GwtMessage().getMessages([MESSAGE_KEY_PAUSING]);
        g_ui_testing_util.setTestStepStatusMessage(messages[MESSAGE_KEY_PAUSING]);

        var testFrameWindow = g_ui_testing_util.getTestIFrameWindow();


        var pauseCount = step.timeout;
        if (isNaN(pauseCount))
            pauseCount = 0;

        var utilInterval = null;
        var pauseInterval = null;

        if (pauseCount > 0) {
            // Add this event listener so make the wait happen
			try{
				testFrameWindow.document.body.addEventListener("keydown", cancelWait);
			}
			catch(e){
				
			}
            utilInterval = g_ui_testing_util._getAngularInjector("$interval");
            pauseInterval = utilInterval(doPause, 1000);
        } else {
            doPause(0);
        }

        function breakWait() {
            stepResult.success = true;
            if (utilInterval != null)
                utilInterval.cancel(pauseInterval);
            g_ui_testing_util.setTestStepStatusMessage(stepResult.message);
            step.defer.resolve();
        }

        function doPause(iterationCount) {
			var testFrameWindow = g_ui_testing_util.getTestIFrameWindow();
			testFrameWindow.document.body.addEventListener("keydown", cancelWait);
			testFrameWindow.alert = function(){ return true;};
			testFrameWindow.confirm = function(){ return true;};

            if (iterationCount >= pauseCount || utilInterval == null) {

                breakWait();
            }

        }


        function cancelWait(event) {
            var x = event.keyCode;
            if (x == 27) { // escape key
                breakWait();

            }
        }

    };
    assertionObject.canMutatePage = step.can_mutate_page;
})(step, stepResult, assertionObject);

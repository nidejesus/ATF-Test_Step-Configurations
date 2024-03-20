(function (step, stepResult, assertionObject) {

    assertionObject.executeStep = function (step, stepResult) {
        var MESSAGE_KEY_NO_QUERY_SELECTOR_PROVIDED = "FAILURE: No query selector provided";
        var MESSAGE_KEY_NO_VALUE_PROVIDED = "FAILURE: No value provided";
        var MESSAGE_KEY_WAITING_FOR_TIMEOUT = "Waiting {0} seconds before completing the step";
        var MESSAGE_KEY_UI_ELEMENT_NOT_FOUND = "Failure: No UI element matched the selector '{0}'.";
        var MESSAGE_KEY_SET_VALUE_SUCCESS = "The UI element that matched the selector '{0}' was successfully set.";
        var MESSAGE_KEY_UI_ELEMENT_NOT_VISIBLE = "Failure: UI element matched the selector '{0}' is not visible.";
        var MESSAGE_KEY_UI_ELEMENT_READ_ONLY = "The UI element that matched the selector '{0}' is read only.";
        var MESSAGE_KEY_INDEX_NOT_A_NUMBER = "FAILURE: The value of the index is not a number";


        var messages = new GwtMessage().getMessages([MESSAGE_KEY_NO_QUERY_SELECTOR_PROVIDED, MESSAGE_KEY_NO_VALUE_PROVIDED, MESSAGE_KEY_WAITING_FOR_TIMEOUT, MESSAGE_KEY_UI_ELEMENT_NOT_FOUND, MESSAGE_KEY_NO_VALUE_PROVIDED, MESSAGE_KEY_SET_VALUE_SUCCESS, MESSAGE_KEY_UI_ELEMENT_NOT_VISIBLE, MESSAGE_KEY_UI_ELEMENT_READ_ONLY,MESSAGE_KEY_INDEX_NOT_A_NUMBER]);

        // Function for updating the message that will appear in the step result.
        function updateStepResultMessage(message) {
            stepResult.message += (stepResult.message ? ("\n") : "") + message;
        }

        // Check the input and fail the query selector is missing
        if (!step.inputs.u_query_selector) {
            failStep(messages[MESSAGE_KEY_NO_QUERY_SELECTOR_PROVIDED]);
            return;
        }
        // Check the input and fail the query selector is missing
        if (!step.inputs.u_value) {
            failStep(messages[MESSAGE_KEY_NO_VALUE_PROVIDED]);
            return;
        }
        // Check the input and fail if the index is NaN
        if (isNaN(parseInt(step.inputs.u_index_of_element))) {
            failStep(messages[MESSAGE_KEY_INDEX_NOT_A_NUMBER]);
            return;
        }
        
        // Get inputs
        var querySelector = step.inputs.u_query_selector + "";
        querySelector = querySelector.trim();

        var value = step.inputs.u_value + "";
        value = value.trim();
                
        var elementIndex = parseInt(step.inputs.u_index_of_element);

        try {
            // Gets the window that's loaded into the Test Runner
            var testFrameWindow = g_ui_testing_util.getTestIFrameWindow();
            var uiElement;

            if(elementIndex || elementIndex === 0 ){
                // Get the uiElement based on selector and the index of resulting search
                uiElement = testFrameWindow.jQuery(querySelector).eq(elementIndex);
            }else{
                // Get the uiElement based only on selector
                uiElement = testFrameWindow.jQuery(querySelector);
            }
            
            //verify element is found, visable, and editable
            if (uiElement.length > 0 && uiElement.is(":visible") && !uiElement.is("[readonly]") && !uiElement.is("[disabled]")) {
                //Set the elements value and force change event
                uiElement.val(value).trigger("change");

                //Releasing for garbage collection in case of memory leak
                uiElement = null;
                testFrameWindow = null;

                passStep(querySelector);
            } else {
                if (uiElement.length <= 0) updateStepResultMessage(formatMessage(messages[MESSAGE_KEY_UI_ELEMENT_NOT_FOUND], querySelector));
                else if (!uiElement.is(":visible")) updateStepResultMessage(formatMessage(messages[MESSAGE_KEY_UI_ELEMENT_NOT_VISIBLE], querySelector));
                else if (uiElement.is("[readonly]") || uiElement.is("[disabled]")) updateStepResultMessage(formatMessage(messages[MESSAGE_KEY_UI_ELEMENT_READ_ONLY], querySelector));
                failStep();
            }

        } catch (e) {
            var msg = (e && e.message) ? e.message : e;
            updateStepResultMessage("Failure: " + msg);
            failStep();
        }

        function passStep(selector) {
            if (step.timeout > 0)
                g_ui_testing_util.setTestStepStatusMessage(formatMessage(messages[MESSAGE_KEY_WAITING_FOR_TIMEOUT], step.timeout));

            setTimeout(function () {
                _passStep(selector);
            }, step.timeout * 1000);

            function _passStep(selector) {
                stepResult.success = true;
                updateStepResultMessage(formatMessage(messages[MESSAGE_KEY_SET_VALUE_SUCCESS], selector));
                step.defer.resolve();
            }
        }


        function failStep(msg) {
            stepResult.success = false;
            step.defer.reject();
        }
    };
    assertionObject.canMutatePage = step.can_mutate_page;
})(step, stepResult, assertionObject);

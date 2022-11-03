(function(step, stepResult, assertionObject) {

	assertionObject.executeStep = function(step, stepResult) {
		var MESSAGE_KEY_NO_QUERY_SELECTOR_PROVIDED = "FAILURE: No query selector provided";
		var MESSAGE_KEY_WAITING_FOR_TIMEOUT = "Waiting {0} seconds before completing the step";
		var MESSAGE_KEY_UI_ELEMENT_NOT_FOUND = "Failure: No UI element matched the selector '{0}'.";
		var MESSAGE_KEY_UI_ELEMENT_NOT_VISIBLE = "Failure: UI element matched the selector '{0}' is not visible.";
		var MESSAGE_KEY_UI_ELEMENT_READ_ONLY = "The UI element that matched the selector '{0}' is read only.";
		var MESSAGE_KEY_VALIDATE_SUCCESS = "The UI element that matched the selector '{0}' was found on the page.";


		var messages = new GwtMessage().getMessages([MESSAGE_KEY_NO_QUERY_SELECTOR_PROVIDED, MESSAGE_KEY_WAITING_FOR_TIMEOUT, MESSAGE_KEY_UI_ELEMENT_NOT_FOUND,MESSAGE_KEY_UI_ELEMENT_NOT_VISIBLE, MESSAGE_KEY_UI_ELEMENT_READ_ONLY,MESSAGE_KEY_VALIDATE_SUCCESS]);

		// Function for updating the message that will appear in the step result.
		function updateStepResultMessage(message) {
			stepResult.message += (stepResult.message ? ("\n") : "") + message;
		}

		// Check the input and fail the query selector is missing
		if (!step.inputs.u_query_selector) {
			failStep(messages[MESSAGE_KEY_NO_QUERY_SELECTOR_PROVIDED]);
			return;
		}

		// Get the query selector
		var querySelector = step.inputs.u_query_selector + "";
		querySelector = querySelector.trim();

		var validationCheck = step.inputs.u_validation_check + "";
		validationCheck = validationCheck.trim();

		var checkVisible = false;
		var checkReadOnly = false;
		var checkNotReadOnly = false;
		
		switch(validationCheck){
			case 'read_only':
				checkReadOnly = true;
				checkVisible = true;
				break;
			case 'not_read_only':
				checkNotReadOnly = true;
				checkVisible = true;
				break;
			case 'visible':
				checkVisible = true;
				break;
			default:
				checkVisible = true;
				checkNotReadOnly = true;
		}

		try {
			// Gets the window that's loaded into the Test Runner
			var testFrameWindow = g_ui_testing_util.getTestIFrameWindow();
			//Get html elemnt
			var uiElement = testFrameWindow.jQuery(querySelector);
			//check there is element and it is: visible, not read only, or disabled.
			if (uiElement.length > 0 && (
				(uiElement.is(":visible") && checkVisible) || 
				(!uiElement.is("[readonly]") && !uiElement.is("[disabled]") && checkNotReadOnly) ||
				(uiElement.is("[readonly]") || uiElement.is("[disabled]") && checkReadOnly))) {

				uiElement = null;
				testFrameWindow = null;
				passStep(querySelector);
			} else {
				if (uiElement.length <= 0) updateStepResultMessage(formatMessage(messages[MESSAGE_KEY_UI_ELEMENT_NOT_FOUND], querySelector));
				else if (!uiElement.is(":visible") && checkVisible) updateStepResultMessage(formatMessage(messages[MESSAGE_KEY_UI_ELEMENT_NOT_VISIBLE], querySelector));
				else if (uiElement.is("[readonly]") || uiElement.is("[disabled]") && checkNotReadOnly) updateStepResultMessage(formatMessage(messages[MESSAGE_KEY_UI_ELEMENT_READ_ONLY], querySelector));
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

			setTimeout(function(){_passStep(selector);}, step.timeout * 1000);

			function _passStep(selector) {
				stepResult.success = true;
				updateStepResultMessage(formatMessage(messages[MESSAGE_KEY_VALIDATE_SUCCESS], selector));
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

# ATF-Test_Step-Configurations

In order to use the tests in the repository you will need do the following:

- Copy an existing UI Step Configuration
- Paste the test script and definition script
- Create the inputs/outputs that the test step uses
- Match any test step options

If you have not copied a UI Step Configuration before you can follow the steps outlined by Cody in this <a href="https://community.servicenow.com/community?id=community_article&sys_id=fc312999db9f9cd09e691ea66896197e">aticle</a>. If you have done this becore you can simply copy that test step and use it as a base fore the code in this repo. For convienece the article was pasted [below](#creating-your-first-custom-ui-test-step).

# Creating Your First Custom UI Test Step

At a high level, you'll need to do the following

Create a business rule so that you can copy an existing UI step configuration.
Copy an existing UI step configuration.
"Code" your custom step configuration.
Create a UI Policy so that you can have access to the timeout field when you create steps from your new step configuration.

## **Important Note: Reloading the Client Test Runner**

Before we get started, here's something you need to know. It seems that the Client Test Runner may cache the step configuration definitions, which is great for performance, but not so great when you are trying to iteratively code your step configuration. So, if you are making changes to your step configuration, and those changes don't seem to have an effect, close and reload the Client Test Runner window that may solve the problem.

Now, let's go.

## Create Business Rule

The UI step configurations are read-only. However, you can do an "insert" to create a new record. The insert will fail though because the name of the step configuration must be unique. The business rule you create will append "(Custom)" to the name and remove the read-only constraint.

Create a business rule with the following properties.

- Name: Create Custom from Read Only
- Table: Test Step Config [sys_atf_step_config]
- Advanced: true
- When: before
- Order: 200
- Insert: true
- Filter Conditions: Protection policy is Read-Only -or- Proection Policy is Protected
- Script:

```javascript
(function executeRule(current, previous /*null when async*/) {
/**
	This business rule is used to create a custom version of a read-only or protected ATF step configuration.
	It sets the protection policy to blank and appends " (Custom)" to the name.
	With this business rule, we can create custom UI step configurations.
*/
	var name = current.getValue("name");
	current.setValue('name', name + " (Custom)");
	current.setValue("sys_policy", "");
})(current, previous);​
```

## Copy an existing UI Step Configuration

Now that you have your business rule, you can create a copy of an existing UI step configuration. You can copy any one of them. It probably makes sense to use one that does something similar to what you want to do, but it's not a requirement. For this we'll start with Click Component (Custom UI).

Navigate to the Automated Test Framework (ATF) > Administration > Step Configurations module.

1. Find and open the Click Component (Custom UI) step configuration.
2. You'll see messages that the item is read-only.
3. Right click the record header, and choose Insert and Stay from the context menu.
   A new record will be created with the name Click Component (Custom UI) (Custom).
   You now have a custom UI Step Configuration to code as you want. We'll do that next.

## Code your UI Step Configuration

What needs to be done to code a UI step configuration is not documented. To learn how to do it yourself, you'll need to dig into the code of the existing UI step configurations--or other people can do it and post articles. I'm not going to explain how to code them here. Instead, I'm going to provide code for one that can be used to click a UI Element. It's one I've started using recently, and it's relatively simple. Some others like populating fields using JSON are more tricky, or they were more tricky for me.

Open the Click Component (Custom UI) (Custom) step configuration that you created and populate it with the following values:

Name: Click UI Element (Custom)

- Step environment: UI
- Category: Custom UI
- Template reminder: Click a UI element that you find with a JQuery selector
- HTML description: Click a UI element that you find with a jQuery selector
- Description generation script: -- see below --
- Step execution script: -- see below --
  Description generation script
  This is the script that will generate the description that appears in steps created from the step configuration.

```javascript
function generateDescription() {
    // the global variable 'step' represents the current glide record
    try {
        // the global variable 'step' represents the current glide record

        var tokens = [];

        var description = "";

        // your code here
        description = "Click on the UI element that matches the query selector '{0}'.";
        if (!gs.nil(step.inputs.u_query_selector.getDisplayValue())) {
            tokens.push(step.inputs.u_query_selector.getDisplayValue().trim());
        }
		description += "\nWhatever action would happen when the user clicked UI element will happen.";

        description = gs.getMessage(description, tokens);
        return description;
    } catch (e) {
        return description + "\n" + e;
    }

}
generateDescription();
Step execution script
This is the script that is executed by the client test runner.

(function(step, stepResult, assertionObject) {

    assertionObject.executeStep = function(step, stepResult) {
        var MESSAGE_KEY_NO_QUERY_SELECTOR_PROVIDED = "FAILURE: No query selector provided";
        var MESSAGE_KEY_WAITING_FOR_TIMEOUT = "Waiting {0} seconds before completing the step";
        var MESSAGE_KEY_UI_ELEMENT_NOT_FOUND = "Failure: No UI element matched the selector '{0}'.";
        var MESSAGE_KEY_NO_CLICK_FUNCTION = "Failure: The UI element that matched the selector '{0}' did not have a 'click' function.";
        var MESSAGE_KEY_CLICK_SUCCESS = "The UI element that matched the selector '{0}' was successfully clicked.";

        var messages = new GwtMessage().getMessages([MESSAGE_KEY_NO_QUERY_SELECTOR_PROVIDED, MESSAGE_KEY_WAITING_FOR_TIMEOUT, MESSAGE_KEY_UI_ELEMENT_NOT_FOUND, MESSAGE_KEY_NO_CLICK_FUNCTION, MESSAGE_KEY_CLICK_SUCCESS]);

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

        try {
            // Gets the window that's loaded into the Test Runner
            var testFrameWindow = g_ui_testing_util.getTestIFrameWindow();

            // Get the uiElement
			// Verify that only one element matches and that the element has a click function
			// Run the element's click function
            var uiElement = testFrameWindow.jQuery(querySelector);
            if (uiElement.length > 0) {
                if (uiElement.click != undefined) {
                    // Click the uiElement
                    uiElement[0].click();
                    passStep(querySelector);

                } else {
                    updateStepResultMessage(formatMessage(messages[MESSAGE_KEY_NO_CLICK_FUNCTION], querySelector));
                    failStep();
                }
            } else {
                updateStepResultMessage(formatMessage(messages[MESSAGE_KEY_UI_ELEMENT_NOT_FOUND], querySelector));
                failStep();
            }


        } catch (e) {
            var msg = (e && e.message) ? e.message : e;
            updateStepResultMessage("Failure: " + msg);
            failStep();
        }

        function passStep() {
            if (step.timeout > 0)
                g_ui_testing_util.setTestStepStatusMessage(formatMessage(messages[MESSAGE_KEY_WAITING_FOR_TIMEOUT], step.timeout));

            setTimeout(_passStep, step.timeout * 1000);

            function _passStep(selector) {
                stepResult.success = true;
                updateStepResultMessage(formatMessage(messages[MESSAGE_KEY_CLICK_SUCCESS], selector));
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
```

## Input Variables

If you look at the scripts, you'll see that there is an input variable step.inputs.u_query_selector.

![New Button](https://github.com/nidejesus/ATF-Test_Step-Configurations/blob/main/Images/new_button.JPG)

Add an input variable by scrolling to the bottom of the page, clicking the "New" button under the inputs related list, and submit the form with the following values:

- Type: String
- Label: Query selector
- Column name: u_query_selector
- Max length: 100

Now you have a coded UI step configuration that you can use. We're going to do one more thing, and then we'll use it in a sample test.

## Create UI Policy for Displaying the Timeout Field (Optional)

Sometimes in your UI step configurations, you're going to want to specify a timeout. You can always do it by displaying the timeout field on the list view, but we'll create a UI policy to make it easier.

Create a UI Policy record with the following properties

- Table: Test Step [sys_atf_step]
- Short description: Show timeout (Custom)
- Conditions: Step config.Step environment is UI -and- Step config.Protection policy is --None--

You will need to dot-walk to these fields. In the field list, click Show Related fields, which will be at the bottom of the list. Then in the field list, choose Step Config --> Test step config fields. The list will refresh and you can choose Step Environment field. Go through the same process to select the Step Config.Protection field.

- Global: true
- On load: true
- Reverse if false: false
- Inherit: false
- Order: 500
  You'll need to set the order on the list view. We are using 500 so our UI policy doesn't conflict with the out of the box UI policy for showing/hiding the timeout field.
  Add a UI Policy Action with the following properties

- Field name: Timeout
- Mandatory: Leave alone
- Visible: True
- Read only: Leave alone
  Now we'll be able to see the timeout field when we create test steps using our UI step configurations we create. We won't always need to use the field, but it will be available.

## Create a test that uses your custom test step (Optional)

We are going to create a test that goes to the incident list and clicks the personalize list icon to display the personalize list dialog and then closes the dialog.

Create a test with the following properties:

- Name: My personalize list.
- Description: Demonstrates the custom UI step configuration
  Add the following test steps:

1. Create User
   Name it what you want, give it the itil role, and impersonate the user.

2. Navigate to Module
   Module: My Incidents

3. Click UI Element (Custom)
   Query selector: #hdr_incident> th:nth-child(1) > i
   (You can find the query selector for a UI element using the browser debugger. Inspect the element, you want, and then copy the elements JS Path)
   image
   That will give you something like this:
   document.querySelector("#x4e929bc7db93c010660658b8dc96193b > li:nth-child(2) > a > span")
   Take the part in quotes.

4. Click UI Element (Custom)
   Query selector: #cancel_button

Run the test. You'll see the list appear. The Personalize List Columns dialog will appear and disappear, and the test will end.

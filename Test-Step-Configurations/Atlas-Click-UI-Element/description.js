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
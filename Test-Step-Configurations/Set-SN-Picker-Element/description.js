function generateDescription() {
    // the global variable 'step' represents the current glide record
    try {
        // the global variable 'step' represents the current glide record

        var tokens = [];

        var description = "";

        // your code here
        description = "Set SN Picker UI element that matches the query selector '{0}' to '{1}'.";
        if (!gs.nil(step.inputs.u_query_selector.getDisplayValue())) {
            tokens.push(step.inputs.u_query_selector.getDisplayValue().trim());
        }
        if (!gs.nil(step.inputs.u_query_selector.getDisplayValue())) {
            tokens.push(step.inputs.u_search_term.getDisplayValue().trim());
        }

        description = gs.getMessage(description, tokens);
        return description;
    } catch (e) {
        return description + "\n" + e;
    }

}
generateDescription();
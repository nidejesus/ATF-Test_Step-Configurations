function generateDescription() {
    // the global variable 'step' represents the current glide record
    try {
        // the global variable 'step' represents the current glide record

        var tokens = [];

        var description = "";

        // your code here
        description = "Set the value of a JQuery autocomplete UI element that is found with the selector '{0}' and the search term '{1}'.";
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
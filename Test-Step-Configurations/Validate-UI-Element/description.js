function generateDescription() {
    // the global variable 'step' represents the current glide record
    try {
        // the global variable 'step' represents the current glide record

        var tokens = [];

        var description = "";

        // your code here
        description = "Validate there is a UI element that matches the query selector '{0}'.";
        if (!gs.nil(step.inputs.u_query_selector.getDisplayValue())) {
            tokens.push(step.inputs.u_query_selector.getDisplayValue().trim());
        }
       
        description = gs.getMessage(description, tokens);
        return description;
    } catch (e) {
        return description + "\n" + e;
    }

}
generateDescription();

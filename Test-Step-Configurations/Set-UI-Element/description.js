function generateDescription() {
	// the global variable 'step' represents the current glide record
	try {
		// the global variable 'step' represents the current glide record

		var tokens = [];

		var description = "";

		// your code here
		description = "Set the UI element that matches the query selector '{0}' to '{1}'";
		if (!gs.nil(step.inputs.u_query_selector.getDisplayValue())) {
			tokens.push(step.inputs.u_query_selector.getDisplayValue().trim());
		}
		if (!gs.nil(step.inputs.u_value.getDisplayValue())) {
			tokens.push(step.inputs.u_value.getDisplayValue().trim());
		}
		if (!gs.nil(step.inputs.u_index_of_element.getDisplayValue())) {
			description = description + "at the index of '{2}'.";
			tokens.push(step.inputs.u_index_of_element.getDisplayValue().trim());
		}else{
			description = description + ".";
		}
		description = gs.getMessage(description, tokens);
		return description;
	} catch (e) {
		return description + "\n" + e;
	}

}
generateDescription();

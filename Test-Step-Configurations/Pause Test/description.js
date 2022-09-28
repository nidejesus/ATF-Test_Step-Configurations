function generateDescription() {
    // the global variable 'step' represents the current glide record
    var timeOut = current.timeout;
    if (gs.nil(timeOut)) {
        timeOut = 0;
    } else {
        // var x = new GlideDuration();
        timeOutString = timeOut.getDurationValue();
		
        var parts = timeOutString.split(":");

        var hrsSeconds = parseInt(parts[0].replace(/^0/, "")) * 60 * 60;
        var minSeconds = parseInt(parts[1].replace(/^0/, "")) * 60;
        var seconds = parseInt(parts[2].replace(/^0/, ""));

        timeOut = hrsSeconds + minSeconds + seconds;


    }
    var description = "Pause for " + timeOut + " seconds";

    return description;

}
generateDescription();

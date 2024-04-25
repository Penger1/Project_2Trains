function localToUTC(localTime) {
    // Get the local timezone offset in minutes
    var localOffset = localTime.getTimezoneOffset();

    // Calculate the UTC time by adding the local timezone offset
    var utcTime = new Date(localTime.getTime() + (localOffset * 60000));

    return utcTime;
}

// Get the current local time
var currentLocalTime = new Date();
console.log("Current Local Time:", currentLocalTime.toISOString());

function getStationFullName(stationCode) {
    switch (stationCode) {
        case "KE":
            return "Kerava";
        case "SAV":
            return "Savio";
        case "KRS":
            return "Korso";
        case "RKL":
            return "Rekola";
        case "KVY":
            return "Koivukylä";
        case "HKH":
            return "Hiekkaharju";
        case "TKL":
            return "Tikkurila";
        case "PLA":
            return "Puistola";
        case "TNA":
            return "Tapanila";
        case "ML":
            return "Malmi";
        case "PMK":
            return "Pukinmäki";
        case "OLK":
            return "Oulunkylä";
        case "KÄP":
            return "Käpylä";
        case "PSL":
            return "Pasila";
        case "HKI":
            return "Helsinki";
        default:
            return "Unknown";
    }
}

function loadAPI() {
    var select = document.getElementById("mySelect");
    var selectedValue = select.options[select.selectedIndex].value;

    var select2 = document.getElementById("mySelect2");
    var selectedValue2 = select2.options[select2.selectedIndex].value;

    // Checks if both selected values are the same
    if (selectedValue === selectedValue2) {
        document.getElementById("outputDiv").innerHTML = "Please select different stations for departure and arrival.";
        return; // Stops execution
    }

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var jsonData = JSON.parse(xmlhttp.responseText);

            var timetableRows = jsonData[0].timeTableRows;

            var output = "The next train from " + getStationFullName(selectedValue) + " to " + getStationFullName(selectedValue2) + " is <br>";

            var foundDeparture = false;

            // Modify the loop where you display the scheduled time
            for (var i = 0; i < timetableRows.length; i++) {
                var stationShortCode = timetableRows[i].stationShortCode;
                var scheduledTimeString = timetableRows[i].scheduledTime;
                var type = timetableRows[i].type;

                // Parse scheduled time string as a Date object
                var scheduledTime = new Date(scheduledTimeString);

                // Format scheduled time to display only hours, minutes, and seconds
                var formattedScheduledTime = scheduledTime.toLocaleTimeString('en-US', {hour12: false});

                if (stationShortCode === selectedValue && type === "DEPARTURE") {
                    output += "scheduled to depart at: " + formattedScheduledTime + "<br>";
                    foundDeparture = true;
                }
            }

            if (!foundDeparture) {
                output += "No scheduled departures at " + selectedValue + "<br>";
            }

            document.getElementById("outputDiv").innerHTML = output;
        }
    };

    var url = "https://rata.digitraffic.fi/api/v1/live-trains/station/" + selectedValue + "/" + selectedValue2 + "?startDate=" + currentLocalTime.toISOString() + "&limit=5&include_nonstopping=false";

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

// Function to update the clock
function updateClock() {
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();

    // Adds missing zeroes if needed
    hours = (hours < 10) ? '0' + hours : hours;
    minutes = (minutes < 10) ? '0' + minutes : minutes;
    seconds = (seconds < 10) ? '0' + seconds : seconds;

    var timeString = hours + ':' + minutes + ':' + seconds;

    // Display the time
    var clock = document.getElementById('clock');
    if (clock) {
        clock.textContent = timeString;
    }
}

// Updates the clock every second
setInterval(updateClock, 1000);

// Displays the clock immediately
updateClock();

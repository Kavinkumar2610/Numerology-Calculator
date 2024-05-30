var letterValues = { 'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 
                     'F': 8, 'G': 3, 'H': 5, 'I': 1, 'J': 1,
                     'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 7,
                     'P': 8, 'Q': 1, 'R': 2, 'S': 3, 'T': 4, 
                     'U': 6, 'V': 6, 'W': 6, 'X': 5, 'Y': 1,
                     'Z': 7 };


document.getElementById("plateForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    var letters = document.getElementById("letters").value.toUpperCase();
    var digitSum = parseInt(document.getElementById("digitSum").value);
    var desiredTotals = [];
    
    var desiredTotal1 = document.getElementById("desiredTotal1").value.trim();
    if (desiredTotal1 !== "") {
        desiredTotals.push(parseInt(desiredTotal1));
    }
    
    var desiredTotal2 = document.getElementById("desiredTotal2").value.trim();
    if (desiredTotal2 !== "") {
        desiredTotals.push(parseInt(desiredTotal2));
    }
    
    var desiredTotal3 = document.getElementById("desiredTotal3").value.trim();
    if (desiredTotal3 !== "") {
        desiredTotals.push(parseInt(desiredTotal3));
    }

    var validPlateNumbers = generatePlateNumbers(letters, digitSum, desiredTotals);

    var resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "";
    if (validPlateNumbers.length === 0) {
        resultDiv.innerHTML = "<h2>Results</h2><p>No valid plate numbers found.</p>";
        document.getElementById("showOtherNumbersBtn").style.display = "block";
    } else {
        var table = "<h2>Results</h2><table><tr><th>Plate Series</th><th>Plate Number</th><th>Desired Total</th></tr>";
        validPlateNumbers.forEach(function(plate) {
            table += "<tr><td>" + plate[0] + "</td><td>" + plate[1].substring(letters.length) + "</td><td>" + plate[2] + "</td></tr>";
        });
        table += "</table>";
        resultDiv.innerHTML = table;
        document.getElementById("showOtherNumbersBtn").style.display = "block";
    }
    
    var resultHeader = document.querySelector("#result h2");
    var infoIcon = document.createElement("i");
        infoIcon.classList.add("fas", "fa-info-circle", "info-icon");
        infoIcon.style.marginLeft = "10px";
        infoIcon.style.color = "#74C0FC";
        infoIcon.addEventListener("click", function() {
        var modal = document.getElementById("myModal");
        modal.style.display = "block";

        var span = document.getElementsByClassName("close")[0];
        span.onclick = function() {
            modal.style.display = "none";
        }

        window.onclick = function(event) {
            if (event.target == modal) {
            modal.style.display = "none";
            }
        }
        });
        resultHeader.appendChild(infoIcon);

    var letterSum = Array.from(letters).reduce(function(sum, char) {
        return sum + (letterValues[char] || 0);
    }, 0);
    document.getElementById("letterSum").innerHTML = "<p>Total Plate Series Value: " + letterSum + "</p>";
    // document.getElementById("plateSum").innerHTML = "<p>Total Plate Number Value: " + digitSum + "</p>";
});

document.getElementById("showOtherNumbersBtn").addEventListener("click", function() {
    var letters = document.getElementById("letters").value.toUpperCase();
    var digitSum = parseInt(document.getElementById("digitSum").value);
    var desiredTotals = [];
    
    var desiredTotal1 = document.getElementById("desiredTotal1").value.trim();
    if (desiredTotal1 !== "") {
        desiredTotals.push(parseInt(desiredTotal1));
    }
    
    var desiredTotal2 = document.getElementById("desiredTotal2").value.trim();
    if (desiredTotal2 !== "") {
        desiredTotals.push(parseInt(desiredTotal2));
    }
    
    var desiredTotal3 = document.getElementById("desiredTotal3").value.trim();
    if (desiredTotal3 !== "") {
        desiredTotals.push(parseInt(desiredTotal3));
    }

    var limit = document.getElementById("limitDropdown").value;
    var otherNumbersTableContainer = document.getElementById("otherNumbersTableContainer");
    otherNumbersTableContainer.style.display = "block";
    var otherNumbersResultDiv = document.getElementById("otherNumbersResult");
    otherNumbersResultDiv.innerHTML = "";

    var otherNumbers = generateOtherNumbers(letters, digitSum, desiredTotals, letterValues, limit);

    if (otherNumbers.length === 0) {
        otherNumbersResultDiv.innerHTML = "<p>No other plate numbers found.</p>";
    } else {
        var table = "<table id='otherNumbersTable'><tr><th>Plate Number</th><th>Desired Total</th></tr>";
        otherNumbers.forEach(function(number) {
            table += "<tr><td>" + letters  + " " + number[0]  + "</td><td>" + number[1] + "</td></tr>";
        });
        table += "</table>";
        otherNumbersResultDiv.innerHTML = table;
    }
    populateFilterDropdown(desiredTotals);
});

document.getElementById("searchInput").addEventListener("input", function() {
    var searchValue = this.value.toLowerCase();
    var rows = document.getElementById("otherNumbersTable").getElementsByTagName("tr");

    for (var i = 1; i < rows.length; i++) {
        var plateNumber = rows[i].getElementsByTagName("td")[0].textContent.toLowerCase();
        if (plateNumber.indexOf(searchValue) > -1) {
            rows[i].style.display = "";
        } else {
            rows[i].style.display = "none";
        }
    }
});

function populateFilterDropdown(desiredTotals) {
    var filterDropdown = document.getElementById("filterDropdown");
    filterDropdown.innerHTML = "<option value='all'>Show All</option>";
    desiredTotals.forEach(function(total) {
        filterDropdown.innerHTML += "<option value='" + total + "'>" + total + "</option>";
    });
}


document.getElementById("filterDropdown").addEventListener("change", function() {
    var filterValue = this.value;
    var rows = document.getElementById("otherNumbersTable").getElementsByTagName("tr");

    if (filterValue === "all") {
        for (var i = 1; i < rows.length; i++) {
            rows[i].style.display = "";
        }
    } else {
        for (var i = 1; i < rows.length; i++) {
            var desiredTotal = rows[i].getElementsByTagName("td")[1].textContent;
            if (desiredTotal !== filterValue) {
                rows[i].style.display = "none";
            } else {
                rows[i].style.display = "";
            }
        }
    }
});

document.getElementById("limitDropdown").addEventListener("change", function() {
    document.getElementById("showOtherNumbersBtn").click();
});

document.querySelector(".clear-btn").addEventListener("click", function(event) {
    event.preventDefault();
    document.getElementById("plateForm").reset();
    document.getElementById("result").innerHTML = "";
    document.getElementById("letterSum").innerHTML = "";
    document.getElementById("plateSum").innerHTML = "";
    document.getElementById("showOtherNumbersBtn").style.display = "none";
    document.getElementById("otherNumbersTableContainer").style.display = "none";
});

function calculateSingleDigitSum(number) {
    while (number >= 10) {
        number = Array.from(String(number), Number).reduce((a, b) => a + b, 0);
    }
    return number;
}

function generatePlateNumbers(letters, digitSum, desiredTotals) {
    var validPlateNumbers = [];
    var letterSum = Array.from(letters).reduce(function(sum, char) {
        return sum + (letterValues[char] || 0);
    }, 0);
    
    desiredTotals.forEach(function(desiredTotal) {
        var totalSum = letterSum + digitSum;
        var singleDigitSum = calculateSingleDigitSum(totalSum);
        if (singleDigitSum === desiredTotal) {
            validPlateNumbers.push([letters, letters + digitSum, desiredTotal]);
        }
    });

    return validPlateNumbers;
}

function generateOtherNumbers(letters, digitSum, desiredTotals, letterValues, limit) {
    var otherNumbers = [];
    var maxLimit = (limit === "all") ? 9999 : parseInt(limit);
    
    for (var i = 1; i <= 9999; i++) {
        var letterSum = Array.from(letters).reduce(function(sum, char) {
            return sum + (letterValues[char] || 0);
        }, 0);
        var totalSum = letterSum + i + digitSum;
        var singleDigitSum = calculateSingleDigitSum(totalSum);
        if (desiredTotals.includes(singleDigitSum)) {
            otherNumbers.push([i, singleDigitSum]);
        }
        if (otherNumbers.length >= maxLimit && limit !== "all") {
            break;
        }
    }

    return otherNumbers;
}

window.addEventListener("DOMContentLoaded", function() {
    var desiredTotals = [];
    var desiredTotal1 = document.getElementById("desiredTotal1").value.trim();
    var desiredTotal2 = document.getElementById("desiredTotal2").value.trim();
    var desiredTotal3 = document.getElementById("desiredTotal3").value.trim();
    
    if (desiredTotal1 !== "") {
        desiredTotals.push(parseInt(desiredTotal1));
    }
    if (desiredTotal2 !== "") {
        desiredTotals.push(parseInt(desiredTotal2));
    }
    if (desiredTotal3 !== "") {
        desiredTotals.push(parseInt(desiredTotal3));
    }

    populateFilterDropdown(desiredTotals);
});

document.getElementById("infoIcon").addEventListener("click", function() {
    var infoWindow = window.open("https://names4brands.com/images/indian-numerology-alphabet-chart-download.jpg", "_blank", "width=600,height=400");
    infoWindow.focus();
});



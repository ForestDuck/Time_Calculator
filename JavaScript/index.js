
// Getting reference to the input fields and other DOM elements
const date1Input = document.getElementById("date1");
const date2Input = document.getElementById("date2");
const resault = document.querySelector('#results__item');
const button = document.querySelector('.cybr-btn');
const timeIntervalSelect = document.querySelector("#time-interval");
const daysSelect = document.querySelector("#days-option");
const calcSelect = document.querySelector("#calc-option");
const lastState = localStorage.getItem('resault');

// Adding an event listener to the date1Input field for input event
// to check if the input field is active
date1Input.addEventListener("input",checkIfActive);

// Adding an event listener to the date1Input field for change event
// to set a minimum value for the date2Input field
date1Input.addEventListener("change",secondDataMin );

// Adding an event listener to the button element for click event
// to calculate the time interval between two dates
button.addEventListener('click',calculateTimeInterval);

// Adding an event listener to the timeIntervalSelect element for change event
// to update the daysSelect options based on the selected time interval
timeIntervalSelect.addEventListener("change",dataPreests);

// Adding an event listener to the document for DOMContentLoaded event
// to update the results table when the page is loaded
document.addEventListener('DOMContentLoaded',updateResultsTable);

// The checkIfActive() function is used to check if 
// the first date input field (date1Input) has a value. 
// If the value is not empty, it enables the other input 
// fields (date2Input, timeIntervalSelect, daysSelect, calcSelect) 
// and the button element. Otherwise, it disables them. 
// This ensures that the user cannot interact with the input 
// fields until the first date input field is filled
 function checkIfActive() {
    if (date1Input.value !== "") {
      date2Input.disabled = false;
      timeIntervalSelect.disabled = false;
      daysSelect.disabled = false;
      calcSelect.disabled = false;
      button.disabled = false;
    } else{
      date2Input.disabled = true;
      timeIntervalSelect.disabled = true;
      daysSelect.disabled = true;
      calcSelect.disabled = true;
      button.disabled = true;
    }
  }

  // This function is called when the user selects an option from the 
  // "Time Interval" select element. It checks which option is selected, 
  // and if "Week" or "Month" is selected, it calculates the date that 
  // is 7 or 30 days after the date entered in the "Date 1" input element,
  // respectively, and sets that date as the value of the "Date 2" input 
  // element. If "Custom" is selected, it clears the value of the "Date 2" 
  // input element.
  function dataPreests() {
    const selectedOption = timeIntervalSelect.value;
    if (selectedOption === "week") {
      const date1 = new Date(date1Input.value);
      const date2 = new Date(date1.getTime() + (1000*60*60*24*7)); // add 7 days
      date2Input.value = date2.toISOString().slice(0, 10);
    } else if (selectedOption === "month") {
      const date1 = new Date(date1Input.value);
      const date2 = new Date(date1.getTime() + (1000*60*60*24*30)); // add 30 days
      date2Input.value = date2.toISOString().slice(0, 10);
    } else {
      // clear the value of date2Input if "Custom" option is selected
      date2Input.value = "";
    }
  }
  
// This function is responsible for calculating the time interval between two dates 
// and displaying the results in an HTML table.
function calculateTimeInterval() {
  // Creates two Date objects representing the input dates.
  let date1 = new Date(date1Input.value);
  let date2 = new Date(date2Input.value);

  // Checks if the second date is entered by the user, and if not, displays an alert message.
  if (!date2Input.value) {
    alert("Please enter a second date.");
    return;
  }

  // Calculates the time difference between the two dates in milliseconds, using the Math.abs() function to ensure a positive result.
  let diffInMs = Math.abs(date2 - date1);

  // Calculates the duration between the two dates based on the selected option in the "Days" dropdown menu.
  let selectedDaysOption = daysSelect.value;
  let duration = 0;

  if (selectedDaysOption === "weekdays") {
    // Calculates the duration between two dates only considering weekdays (Monday - Friday).
    let currentDate = new Date(date1);
    while (currentDate <= date2) {
      let dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        duration++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
  } else if (selectedDaysOption === "weekends") {
    // Calculates the duration between two dates only considering weekends (Saturday and Sunday).
    let currentDate = new Date(date1);
    while (currentDate <= date2) {
      let dayOfWeek = currentDate.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        duration++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
  } else {
    // Calculates the duration between two dates considering all days.
    duration = diffInMs / (1000 * 60 * 60 * 24);
  }

  // Constructs a new row for the results table using template literals and the
  // appropriate unit of time (days, hours, minutes, or seconds), based 
  // on the selected option the "Calculate" dropdown menu .
  // The addResultToLocalStorage() function is 
  // called to store the new result in local storage, and the 
  // updateResultsTable() function is called to update the table with 
  // the new row.

  let selectedCalcOption = calcSelect.value;
  let resultRow = `<tr><td>${date1.toDateString()}</td><td>${date2.toDateString()}</td>`;
  if (selectedCalcOption === "days") {
    resultRow += `<td>${duration} days</td></tr>`;
  } else if (selectedCalcOption === "hours") {
    resultRow += `<td>${duration * 24} hours</td></tr>`;
  } else if (selectedCalcOption === "minutes") {
    resultRow += `<td>${duration * 24 * 60} minutes</td></tr>`;
  } else if (selectedCalcOption === "seconds") {
    resultRow += `<td>${duration * 24 * 60 * 60} seconds</td></tr>`;
  }

  addResultToLocalStorage(resultRow);
  updateResultsTable();
}


// This function is responsible for adding a new result row to the browser's 
// local storage, which allows the app to remember and display up to the
// last 10 calculations that the user has made.
  
function addResultToLocalStorage(resultRow) {
//Checks if there are any existing results in the local 
// storage by calling localStorage.getItem('results'). If there are existing 
// results, it parses them from a string to an array using JSON.parse() and 
// assigns them to the results variable. If there are no existing results, 
// it initializes an empty array and assigns it to results.
    if (localStorage.getItem('results') !== null) {
      results = JSON.parse(localStorage.getItem('results'));
  } else {
      
      results = []
  }
//  The new resultRow is added to the beginning of the results 
// array using the unshift() method.
    results.unshift(resultRow);

// If the results array now has more than 10 items, the oldest result 
// is removed from the end of the array using the pop() method.   
    if (results.length > 10) {
      results.pop();
    }
// The updated results array is stored back into the local 
// storage using localStorage.setItem('results', JSON.stringify(results))
    localStorage.setItem('results', JSON.stringify(results));
  }

  //Function that updates a results table in the HTML document based on data stored in local storage.
  function updateResultsTable() {
    // checks if there is any data stored in the 'results' key in local storage. 
    // If data is found, it is parsed from a string into object by JSON.parse() 
    // and stored in a variable called results. If no data is found, an empty array is created and 
    // stored in the results variable.
    if (localStorage.getItem('results') !== null) {
      results = JSON.parse(localStorage.getItem('results'));
  } else {
    
      results = []
  }
    // Builds the HTML for the results table by looping through each element in 
    // the results array and concatenating them into a string variable called resultsTable.
    let resultsTable = '';
    for (const result of results) {
      resultsTable += result;
    }
    // Update the results table in the HTML
    resault.innerHTML = resultsTable;
  }
  
// Function sets the minimum value of the second date input field to the value of the first date input field.
  function secondDataMin(){
    date2Input.min = date1Input.value;
  }


 






 
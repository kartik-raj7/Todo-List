let myLeads =[];
const inputEl = document.getElementById("input-el");
const inputBtn = document.getElementById("input-btn");
const ulEl = document.getElementById("ul-el");
const delbtn = document.getElementById("delete-btn");
let leadsFromLocalStorage = JSON.parse(localStorage.getItem("myLeads"));

delbtn.addEventListener('click', function(){
    localStorage.clear();
    myLeads = [];
    renderLeads();
});

if (leadsFromLocalStorage) {
    myLeads = leadsFromLocalStorage;
    renderLeads();
}

inputBtn.addEventListener("click", function() {
    if (inputEl.value !== "") {
        myLeads.push(inputEl.value);
    }
    inputEl.value = "";
    localStorage.setItem("myLeads", JSON.stringify(myLeads));
    renderLeads();
});

ulEl.addEventListener("click", function(event) {
    if (event.target.classList.contains("complete-icon")) {
        const index = event.target.dataset.index;
        deleteTask(index);
    } else if (event.target.classList.contains("edit-icon")) {
        const listItem = event.target.parentElement;
        const task = listItem.querySelector(".task").textContent;
        const index = listItem.dataset.index;
        const newTask = prompt("Enter the new task:", task);
        if (newTask) {
            editTask(index, newTask);
        }
    }
    else if (event.target.classList.contains("remove-icon")) {
        const index = event.target.dataset.index;
        deleteTask(index);
    } 
});
ulEl.addEventListener("dragstart", function(event) {
    event.dataTransfer.setData("text/plain", event.target.dataset.index);
});

ulEl.addEventListener("dragover", function(event) {
    event.preventDefault();
    const draggedIndex = event.dataTransfer.getData("text/plain");
    const draggedItem = ulEl.querySelector(`[data-index="${draggedIndex}"]`);
    const droppedItem = event.target.closest("li");
    if (draggedItem && droppedItem && draggedItem !== droppedItem) {
        const rect = droppedItem.getBoundingClientRect();
        const isAfter = event.clientY > rect.top + rect.height / 2;
        if (isAfter) {
            droppedItem.parentNode.insertBefore(draggedItem, droppedItem.nextSibling);
        } else {
            droppedItem.parentNode.insertBefore(draggedItem, droppedItem);
        }
    }
});
ulEl.addEventListener("drop", function(event) {
    event.preventDefault();
    const draggedIndex = event.dataTransfer.getData("text/plain");
    const droppedIndex = event.target;
    const draggedItem = ulEl.querySelector(`[data-index="${draggedIndex}"]`);
    const droppedItem = event.target.closest("li");

    if (draggedIndex && droppedIndex && draggedIndex !== droppedIndex) {
        if (draggedItem && droppedItem) {
            const rect = droppedItem.getBoundingClientRect();
            const isAfter = event.clientY > rect.top + rect.height / 2;
            if (isAfter) {
                droppedItem.parentNode.insertBefore(draggedItem, droppedItem.nextSibling);
            } else {
                droppedItem.parentNode.insertBefore(draggedItem, droppedItem);
            }
            const newIndex = Array.from(ulEl.children).indexOf(draggedItem);
            const movedItem = myLeads[draggedIndex];
            myLeads.splice(draggedIndex, 1);
            myLeads.splice(newIndex, 0, movedItem);
            localStorage.setItem("myLeads", JSON.stringify(myLeads));
            renderLeads();
        }
    }
});

function renderLeads() {
    let listItems = "";
    for (let i = 0; i < myLeads.length; i++) {
        listItems += `
            <li data-index="${i}" draggable="true">
                <span class="task">${myLeads[i]}</span>
                <span class="icon complete-icon">✅</span>
                <span class="icon edit-icon">🖊️</span>
                <span class="icon remove-icon">❌</span>
            </li>
        `;
    }
    ulEl.innerHTML = listItems;
}

function deleteTask(index) {
    myLeads.splice(index, 1);
    localStorage.setItem("myLeads", JSON.stringify(myLeads));
    renderLeads();
}

function editTask(index, newTask) {
    if (index >= 0 && index < myLeads.length) {
        myLeads[index] = newTask;
        localStorage.setItem("myLeads", JSON.stringify(myLeads));
        renderLeads();
    } else {
        alert("Invalid index. Please try again.");
    }
}

setInterval(showTime, 1000);

function showTime() {
    let time = new Date();
    let hour = time.getHours();
    let min = time.getMinutes();
    let sec = time.getSeconds();
    am_pm = "AM";

    if (hour > 12) {
        hour -= 12;
        am_pm = "PM";
    }
    if (hour == 0) {
        hr = 12;
        am_pm = "AM";
    }

    hour = hour < 10 ? "0" + hour : hour;
    min = min < 10 ? "0" + min : min;
    sec = sec < 10 ? "0" + sec : sec;

    let currentTime = hour + ":" + min + ":" + sec + am_pm;

    document.getElementById("clock").innerHTML = currentTime;
}

showTime();

if (showTime() === "00") {
    localStorage.clear();
    myLeads = [];
    renderLeads();
}
const downloadBtn = document.getElementById("download-btn");
downloadBtn.addEventListener("click", downloadAsCSV);

function downloadAsCSV() {
  if(myLeads.length!==0){
//   console.log(myLeads)
  const csvContent = prepareCSVContent(myLeads);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = "todo-list.csv";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
  }
}
function prepareCSVContent(data) {
   
    const csvRows = [];
    csvRows.push('"Task Number","Task"'); 
  
    data.forEach((item, index) => {
      const escapedValue = item.replace(/"/g, '""');
      const row = [`"Task${index + 1}","${escapedValue}"`]; 
      csvRows.push(row.join(","));
    });
    
    const csvContent = csvRows.join("\n");
    return csvContent;
  }
  function fetchQuote() {
    const apiUrl = 'https://api.quotable.io/random'; 
  
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        const quoteElement = document.getElementById('quote');
        quoteElement.textContent = data.content;
      })
      .catch(error => {
        console.log('Error fetching quote:', error);
      });
  }
  window.addEventListener('load', fetchQuote);
  const millisecondsPerDay = 24 * 60 * 60 * 1000; 
setInterval(fetchQuote, millisecondsPerDay);
  
// import randomWords from 'random-words';

const tableHead = [['#', '#'], ['Name', 'string'], ['Job', 'string'], ['Age', 'number'], ['Col5', 'jj'], ['Col6', 'jj'], ['Salary', 'number'], ['Have a car?', 'boolean'], ['Have a dog?', 'boolean'], ['Have a flat?', 'boolean']]
const tableDimention = { cols: tableHead.length, rows: 1000 }
let count = 0;


function fillTableCell(dataType) {
    let data = ''
    switch (dataType) {
        case '#': data = (++count); break;
        case 'boolean': data = Math.random() < 0.5 ? false : true; break;
        case 'number': data = Math.floor(Math.random() * 100); break;
        // case 'string': data = randomWords({ min: 3, max: 10 }); break;
        default: data = 'cell'; break;
    }
    return document.createTextNode(data)
}

function tableCreate(tableHead, tableDimention) {
    const body = document.body,
        table = document.createElement('table');
    table.id = 'table';
    let row;
    for (let i = 0; i < tableDimention.rows; i++) {
        if (i == 0) {
            let thead = table.createTHead();
            row = thead.insertRow();
        } else {
            row = table.insertRow();
        }
        for (let j = 0; j < tableDimention.cols; j++) {
            if (i == 0) {
                let th = document.createElement("th");
                let text = document.createTextNode(tableHead[j][0]);
                th.appendChild(text);
                row.appendChild(th);
            } else {
                let td = row.insertCell();
                td.appendChild(fillTableCell(tableHead[j][1]));
            }
        }
    }
    body.appendChild(table);
}

function cellEditHandler(e) {
    if (e.target.tagName === 'TD') {
        selectedTD = e.target
        selectedTD.contentEditable = true;
        // selectedTD.style.userSelect = 'none';
        // document.getSelection().empty()
        selectedTD.classList.add('edit')
        // selectedTD.focus()
    }
}

function stopCellEditHandler(e) {
    if (!selectedTD) return;
    if (selectedTD === e.target) return
    if (selectedTD.tagName === 'TD') {
        selectedTD.contentEditable = false;
        selectedTD.classList.remove('edit')
    }
}

// function dragNdrop(e) {
//     function moveAt(pageX, pageY) {
//         e.target.style.left = pageX - e.target.offsetWidth/2 + 'px';
//         e.target.style.top = pageY - e.target.offsetHeight/2 + 'px';
//     }

//     function onMouseMove(event) {
//         moveAt(event.pageX, event.pageY);
//     }

//     if (e.target.tagName === 'TH') {
//         e.target.style.position = 'absolute';
//         e.target.style.zIndex = 1000;
//         document.body.append(e.target)
//         moveAt(e.pageX, e.pageY)
//         document.addEventListener('mousemove', onMouseMove);
//         e.target.onmouseup = function() {
//             document.removeEventListener('mousemove', onMouseMove);
//             e.target.onmouseup = null;
//         }
//     }   
// }
function download_csv(csv, filename) {
    var csvFile;
    var downloadLink;

    // CSV FILE
    csvFile = new Blob([csv], {type: "text/csv"});

    // Download link
    downloadLink = document.createElement("a");

    // File name
    downloadLink.download = filename;

    // We have to create a link to the file
    downloadLink.href = window.URL.createObjectURL(csvFile);

    // Make sure that the link is not displayed
    downloadLink.style.display = "none";

    // Add the link to your DOM
    document.body.appendChild(downloadLink);

    // Lanzamos
    downloadLink.click();
}

function export_table_to_csv(html, filename) {
	var csv = [];
	var rows = document.querySelectorAll("table tr");
	
    for (var i = 0; i < rows.length; i++) {
		var row = [], cols = rows[i].querySelectorAll("td, th");
		
        for (var j = 0; j < cols.length; j++) 
            row.push(cols[j].innerText);
        
		csv.push(row.join(","));		
	}

    // Download CSV
    download_csv(csv.join("\n"), filename);
}


let selectedTD = null
tableCreate(tableHead, tableDimention);
table.addEventListener('dblclick', cellEditHandler)
table.addEventListener('click', stopCellEditHandler)
// table.addEventListener('mousedown', dragNdrop)
// let range = new Range();
// range.setStart(table.rows[2],1);
// range.setEnd(table.rows[2],3)
// document.getSelection().addRange(range)

var html = document.querySelector("table").outerHTML;
export_table_to_csv(html, "table.csv");

// const fileData = JSON.stringify(table);
// const blob = new Blob([fileData], {type: "text/plain"});
// const url = URL.createObjectURL(blob);
// const link = document.createElement('a');
// link.download = 'filename.json';
// link.href = url;
// link.click();

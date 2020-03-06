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
    const body = document.body;
    const table = document.createElement('table');
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
                th.draggable = "true";
                th.classList.add('column');
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
    csvFile = new Blob([csv], { type: "text/csv" });
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

function exportToExcel() {

    let tableArr = []
    const table = document.querySelector('table');
    const lenArr = table.rows.length;
    for (let i = 0; i < lenArr; i++) {
        const rowArr = [];
        for (let j = 0; j < table.rows[i].cells.length; j++) {
            rowArr.push(table.rows[i].cells[j].innerHTML)
        }
        tableArr.push(rowArr.join(","))
    }
    download_csv(tableArr.join("\n"), 'table.csv');
}

function loadFromFile(file) {
    var reader = new FileReader();

    // file reading started
    reader.addEventListener('loadstart', function () {
        console.log('File reading started');
    });

    // file reading finished successfully
    reader.addEventListener('load', function (e) {
        // contents as text
        var text = e.target.result;

        // will hold CSV data
        var data = [];

        // split by line breaks
        var rows = text.split("\n");

        for (var i = 0; i < rows.length; i++) {
            // split each row by comma
            var row_columns = rows[i].split(",");

            data.push(row_columns);
        }

        // CSV data
        console.log(data);
    });

    // file reading failed
    reader.addEventListener('error', function () {
        alert('Error : Failed to read file');
    });

    // file read progress 
    reader.addEventListener('progress', function (e) {
        if (e.lengthComputable == true) {
            var percent_read = Math.floor((e.loaded / e.total) * 100);
            console.log(percent_read + '% read');
        }
    });
    // read as text file
    reader.readAsText(file);
}

function clickHandler(e) {
    if (e.target.id === 'save_btn') exportToExcel()
    // if (e.target.id === 'read_btn') loadFromFile()
}

function showFile(e) {
    let file = e.target.files[0];
    loadFromFile(file)
}
var dragSrcEl = null;

function handleDragStart(e) {

    this.classList.add('move');  // this / e.target is the source node.
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragOver(e) {
    if (e.preventDefault) e.preventDefault(); // Necessary. Allows us to drop.

    e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
    return false;
}

function handleDragEnter(e) {
    // this / e.target is the current hover target.
    this.classList.add('over');
}

function handleDragLeave(e) {
    this.classList.remove('over');  // this / e.target is previous target element.
}

function handleDrop(e) {
    function dataExchange(selColumn1, selColumn2) {
        const table = document.querySelector('table');
        let elem1;
        let elem2;
        console.log('Th: ',document.querySelector('th'));
        
        for (let i = 1; i < table.rows.length; i++) {
            elem1 = table.rows[i].cells[selColumn1].innerHTML;
            elem2 = table.rows[i].cells[selColumn2].innerHTML;
            table.rows[i].cells[selColumn1].innerHTML = elem2;
            table.rows[i].cells[selColumn2].innerHTML = elem1;
        }
    }
    // this / e.target is current target element.
    if (e.stopPropagation) {
        e.stopPropagation(); // stops the browser from redirecting.
    }
    e.target.classList.remove('over');
    // See the section on the DataTransfer object.
    if (dragSrcEl != this) {
        // Set the source column's HTML to the HTML of the columnwe dropped on.
        dragSrcEl.innerHTML = this.innerHTML;
        this.innerHTML = e.dataTransfer.getData('text/html');
        dataExchange(dragSrcEl.cellIndex, this.cellIndex);
    }
    return false;
}

function handleDragEnd(e) {
    // this/e.target is the source node.

    [].forEach.call(cols, function (col) {
        col.classList.remove('over');
    });
}

let selectedTD = null
const header = document.createElement('div');

document.body.append(header);
const header_title = document.createElement('h3');
header_title.style.textAlign = 'center';
header_title.innerHTML = 'Table';
header.append(header_title);
const saveTableBtn = document.createElement('button');
saveTableBtn.innerText = 'export to Excel';
saveTableBtn.style.padding = '2px';
saveTableBtn.id = 'save_btn'
saveTableBtn.style.backgroundColor = 'orange'
saveTableBtn.style.border = '1px solid red';
saveTableBtn.style.marginLeft = '200px'
header_title.append(saveTableBtn);

const readDataBtn = document.createElement('input');
readDataBtn.innerText = 'load Data from file';
readDataBtn.type = "file";
readDataBtn.style.padding = '2px';
readDataBtn.style.backgroundColor = 'green'
readDataBtn.style.border = '1px solid red';
readDataBtn.style.marginLeft = '50px'
readDataBtn.id = 'read_btn'
header_title.append(readDataBtn);

tableCreate(tableHead, tableDimention);
table.addEventListener('dblclick', cellEditHandler)
table.addEventListener('click', stopCellEditHandler)
document.body.addEventListener('click', clickHandler)
readDataBtn.addEventListener('change', showFile)
var cols = document.querySelectorAll('.column');
[].forEach.call(cols, function (col) {
    col.addEventListener('dragstart', handleDragStart, false);
    col.addEventListener('dragenter', handleDragEnter, false)
    col.addEventListener('dragover', handleDragOver, false);
    col.addEventListener('dragleave', handleDragLeave, false);
    col.addEventListener('drop', handleDrop, false);
    col.addEventListener('dragend', handleDragEnd, false);
});

// table.addEventListener('mousedown', dragNdrop)
// let range = new Range();
// range.setStart(table.rows[2],1);
// range.setEnd(table.rows[2],3)
// document.getSelection().addRange(range)

// var html = document.querySelector("table").outerHTML;
// export_table_to_csv(html, "table.csv");
// console.log('table', table);

// const fileData = JSON.stringify({table});
// console.log('fileData', fileData);

// const blob = new Blob([fileData], {type: "text/plain"});
// const url = URL.createObjectURL(blob);
// console.log('url', url);

// const link = document.createElement('a');
// link.download = 'filename.json';
// link.href = url;
// link.click();

// parseTableDataToString();

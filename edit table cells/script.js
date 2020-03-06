let table = document.getElementById('bagua-table');
let editinCell;
document.querySelector('table').onclick = function(e) {

    let cell = event.target.closest('.edit-cancel,.edit-ok,td');
    if (!table.contains(cell)) return;

    // if (cell.className === 'edit-cancel') 

    const cellHeight = cell.offsetHeight;
    const cellWidth = cell.offsetWidth;
    console.log(cellHeight);
    
    const textArea = document.createElement('textarea');
    textArea.style.height = cellHeight + 'px';
    textArea.style.width = cellWidth + 'px';
    textArea.style.border = 'none';
    textArea.classList.add();
    textArea.value = cell.innerHTML
    cell.replaceWith(textArea)
    textArea.focus()
    textArea.insertAdjacentHTML("afterEnd",
    '<div class="edit-controls"><button class="edit-ok">OK</button><button class="edit-cancel">CANCEL</button></div>'
  );
}
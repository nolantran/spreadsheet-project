// button event handler
function createSpreadsheet() {
  var rows = parseInt(document.getElementById("txtRows").value);
  var columns = parseInt(document.getElementById("txtColumns").value);

  document.getElementById("SpreadsheetTable").innerHTML = buildTable(
    rows,
    columns
  );
}

// function builds the table based on rows and columns
function buildTable(rows, columns) {
  // start with the table declaration
  var divHTML =
    "<table border='1' cellpadding='0' cellspacing='0' class='TableClass' id='TableClass'>";

  // next do the column header labels
  divHTML += "<tr><th></th>";

  for (var j = 0; j < columns; j++)
    divHTML += "<th>" + String.fromCharCode(j + 65) + "</th>";

  // closing row tag for the headers
  divHTML += "</tr>";

  // now do the main table area
  for (var i = 1; i <= rows; i++) {
    divHTML += "<tr>";
    // ...first column of the current row (row label)
    divHTML += "<td id='" + i + "_0' class='BaseColumn'>" + i + "</td>";

    // ... the rest of the columns
    for (var j = 1; j <= columns; j++)
      divHTML +=
        "<td id='" +
        i +
        "_" +
        j +
        "' class='AlphaColumn' onclick='clearBorder(), clickCell(this)'></td>";

    // ...end of row
    divHTML += "</tr>";
  }

  // finally add the end of table tag
  divHTML += "</table>";

  //alert(divHTML);
  return divHTML;
}

var arrayCell = [];

var numText = [];

var arrayIndexSum = [];

// event handler fires when user clicks a cell
function clickCell(ref) {
  var rcArray = ref.id.split("_");
  var table = document.getElementById("TableClass");
  // var for clicked cell
  var cellChosen = table.rows[rcArray[0]].cells[rcArray[1]];
  //change border, background of the clicked cell
  cellChosen.style.border = "2px solid black";
  cellChosen.style.background = "#7edab0";
  // add row and column of the clicked cell in an array
  arrayCell.push(rcArray[0], rcArray[1]);
}

function clearBorder() {
  if (arrayCell.length == 0) {
  } else {
    var table = document.getElementById("TableClass");
    var cellChosen = table.rows[arrayCell[0]].cells[arrayCell[1]];
    cellChosen.style.border = "1px solid black";
    cellChosen.style.background = "#bfdccf";
    arrayCell = [];
  }
}
function enterNum() {
  var table = document.getElementById("TableClass");
  // get a cell with row and column added in the array
  var cellChosen = table.rows[arrayCell[0]].cells[arrayCell[1]];

  var num = document.getElementById("numText").value;
  // recognize value written no the numText
  var inputVal = sumCalculate(num, arrayCell[0], arrayCell[1]);
  // variable an index
  var index = String(arrayCell[0] + "," + arrayCell[1]);
  // check the index === index in the Array
  var findInd = numText.findIndex((x) => x.id === index);
  // if do not find index
  if (findInd === -1) {
    //push new Object to the Array
    numText.push({
      id: String(arrayCell[0] + "," + arrayCell[1]),
      row: arrayCell[0],
      column: arrayCell[1],
      val: inputVal,
    });
    // show value on cell
    cellChosen.innerHTML = inputVal;
    //
    numText[numText.length - 1].val = inputVal;
  } else {
    // if find index === index in the Array
    // update value cell
    cellChosen.innerHTML = inputVal;
    //update value
    numText[findInd].val = inputVal;
  }
  // update SUM if there is a change of a cell
  updateSum();
  document.getElementById("numText").value = "";
}

function clearNum() {
  //clear all data of all array
  arrayCell = [];
  numText = [];
  arrayIndexSum = [];
  // clear all data on table
  var rows = parseInt(document.getElementById("txtRows").value);
  var columns = parseInt(document.getElementById("txtColumns").value);
  var table = document.getElementById("TableClass");
  for (i = 1; i <= rows; i++) {
    for (j = 1; j <= columns; j++) {
      var cellChosen = table.rows[i].cells[j];
      cellChosen.innerHTML = "";
    }
  }
  
}

function sumCalculate(txt, row, cell) {
  // if Number or SUM
  if (
    !isNaN(txt) ||
    txt.substr(0, 4) === "=SUM" ||
    txt.substr(0, 4) === "=sum"
  ) {
    if (!isNaN(txt)) {
      // if Number entered
      return txt;
    } else if (txt.substr(0, 4) === "=SUM" || txt.substr(0, 4) === "=sum") {
      // variable for row and cell
      var firstColumn = Number();
      var secondColumn = Number();
      var firstRow = Number();
      var secondRow = Number();
      // get firstColumn and firstRow
      firstColumn = txt.charCodeAt(5) - 64;
      firstRow = parseFloat(txt.substr(6, 2));
      // get 3 string from the end of txt
      var check = parseFloat(txt.substr(-3));

      // if user enter length text with number <10. Ex: =SUM(A1:B1)
      if (txt.length === 11) {
        //get secondColumn and secondRow
        secondColumn = txt.charCodeAt(8) - 64;
        secondRow = parseFloat(txt.substr(-2));
      }
      // if user enter length text with number <10. Ex: =SUM(A12:B1) or =SUM(A1:B10)
      else if (txt.length === 12) {
        // if check is NUMBER
        if (check) {
          secondRow = check;
          secondColumn = txt.charCodeAt(8) - 64;
        }
        // if check is NaN.
        else {
          secondRow = parseFloat(txt.substr(-2));
          secondColumn = txt.charCodeAt(9) - 64;
        }
      }
      // if user enter length text with number <10. Ex: =SUM(A12:B11)
      else if (txt.length === 13) {
        secondRow = check;
        secondColumn = txt.charCodeAt(9) - 64;
      }

      // push a cell which is used =SUM to an array
      arrayIndexSum.push({
        id: String(row + "," + cell),
        col1: firstColumn,
        col2: secondColumn,
        row1: firstRow,
        row2: secondRow,
      });
      // a loop to calculate SUM

      if (firstColumn <= secondColumn) {
        if (firstRow <= secondRow) {
          return calSum(firstColumn, secondColumn, firstRow, secondRow);
        } else {
          return calSum(firstColumn, secondColumn, secondRow, firstRow);
        }
      } else {
        if (firstRow <= secondRow) {
          return calSum(secondColumn, firstColumn, firstRow, secondRow);
        } else {
          return calSum(secondColumn, firstColumn, secondRow, firstRow);
        }
      }
    }
  } else {
    // if wrong type
    return txt;
  }
}

function updateSum() {
  // a loop to find a cell which is used to SUM before
  for (i = 0; i < arrayIndexSum.length; i++) {
    // find index
    var index = numText.findIndex((x) => x.id === arrayIndexSum[i].id);
    // if index exists
    if (index !== -1) {
      var table = document.getElementById("TableClass");
      // position of the cell
      var rowChosen = numText[index].row;
      var columnChosen = numText[index].column;
      // position of the cell
      var cellChosen = table.rows[rowChosen].cells[columnChosen];

      let firstColumn = arrayIndexSum[i].col1;
      let secondColumn = arrayIndexSum[i].col2;
      let firstRow = arrayIndexSum[i].row1;
      let secondRow = arrayIndexSum[i].row2;
      var totalSum = 0;
      if (firstColumn <= secondColumn) {
        if (firstRow <= secondRow) {
          totalSum = calSum(firstColumn, secondColumn, firstRow, secondRow);
        } else {
          totalSum = calSum(firstColumn, secondColumn, secondRow, firstRow);
        }
      } else {
        if (firstRow <= secondRow) {
          totalSum = calSum(secondColumn, firstColumn, firstRow, secondRow);
        } else {
          totalSum = calSum(secondColumn, firstColumn, secondRow, firstRow);
        }
      }
      // update the SUM of the cell and update value of the cell
      cellChosen.innerHTML = totalSum;
      numText[index].val = totalSum;
    }
  }
}

function calSum(firstCol, secondCol, firstRow, secondRow) {
  // variable a Sum
  var totalSum = 0;
  for (i = firstCol; i <= secondCol; i++) {
    for (j = firstRow; j <= secondRow; j++) {
      var index = numText.findIndex((x) => x.id === String(j + "," + i));
      if (index !== -1) {
        totalSum += parseFloat(numText[index].val);
        console.log(totalSum);
      }
    }
  }
  return totalSum;
}

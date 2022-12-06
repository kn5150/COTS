// global variables
const ss = SpreadsheetApp.getActiveSpreadsheet();

const dataEntry = ss.getSheetByName("Data Entry");
const settings = ss.getSheetByName("Settings");
const eeInfo = ss.getSheetByName("Employee Info");

const idCell = dataEntry.getRange("C5");
const searchCell = dataEntry.getRange("B3");

const fieldRange = ["G12", "I12", "B8", "C8", "D8", "C10","C11", "C12", "C14", "C15", "C17", "C18", "C19", "C20", "C21", "C22", "C24", "C25", "C26", "C28", "C29", "C30", "C31", "C32", "F18"];
const fieldValues = fieldRange.map(f => dataEntry.getRange(f).getValue());


function createNewRecord() {
  const fieldValues = fieldRange.map(f => dataEntry.getRange(f).getValue());

  const nextIDCell = settings.getRange("A2");
  const nextID = nextIDCell.getValue();
  fieldValues.unshift(nextID);

  idCell.setValue(nextID);
  nextIDCell.setValue(nextID+1);
  ss.toast("Record ID:" + nextID, "New Record Created!");
}

function saveRecord() {
  
  const id = idCell.getValue();

  if(id == ""){
    createNewRecord();
    return;
  }

  const cellFound = eeInfo.getRange("C:C")
            .createTextFinder(id)
            .matchCase(true).matchEntireCell(true)
            .findNext()
  
  if(!cellFound) return;
  const row = cellFound.getRow();
  const fieldValues = fieldRange.map(f => dataEntry.getRange(f).getValue());
  fieldValues.unshift(id);
  eeInfo.getRange(row,3,1,fieldValues.length).setValue([[]]);
  searchCell.clearContent();
  ss.toast("Record ID:" + id, "Record Updated!");
}

// new record function
function newRecord() {
  fieldRange.forEach(f => dataEntry.getRange(f).clearContent());
  searchCell.clearContent();
  idCell.clearContent();
}

// search function
function search() {
  const searchValue = searchCell.getValue();
  const info = eeInfo.getRange("A2:Y").getValues();
  const infoFound = info.filter(r => r[24] == searchValue);

  eeInfo.setValue(infoFound[0][0]);

  fieldRange.forEach((f,i) => dataEntry.getRange(f).setValue(infoFound[0][i+1]));

}

// delete function
function deleteRecord() {
  
  const id = idCell.getValue();

  if(id == "") return;

  const cellFound = eeInfo.getRange("A:A")
            .createTextFinder(id)
            .matchCase(true).matchEntireCell(true)
            .findNext()
  
  if(!cellFound) return;
  const row = cellFound.getRow();
  dataEntry.deleteRow(row);
  newRecord();
  ss.toast("Record ID:" + id, "Record Deleted!");

}


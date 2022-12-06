function onEdit(e) {
  if(e.range.getA1Notation() !== "B3") return;
  if(e.source.getSheetName() !== "Data Entry") return;
  search();
}

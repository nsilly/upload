import XLSX from 'xlsx';
export class ReadFile {
  read(file) {
    var workbook = XLSX.readFile(file);
    var sheet_name_list = workbook.SheetNames[0];
    var Sheet1 = workbook.Sheets[sheet_name_list];
    var rows = XLSX.utils.decode_range(Sheet1['!ref']);
    rows = XLSX.utils.sheet_to_json(Sheet1);
    return rows;
  }
}

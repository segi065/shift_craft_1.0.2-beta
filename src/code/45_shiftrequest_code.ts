function get_shiftrequest_data() {
    const ss = getsheet('shiftrequest');
    const lastrow = ss.getLastRow();
    if (lastrow < 2)
        return []; // データなし対策
    const values = ss.getRange("A1:J"+lastrow).getValues();
    return values.map((row,index) =>{
      if(index === 0){
        row[1] = Utilities.formatDate(row[1], "Asia/Tokyo", "MM/dd");
        row[2] = Utilities.formatDate(row[2], "Asia/Tokyo", "MM/dd");
        row[3] = Utilities.formatDate(row[3], "Asia/Tokyo", "MM/dd");
        row[4] = Utilities.formatDate(row[4], "Asia/Tokyo", "MM/dd");
        row[5] = Utilities.formatDate(row[5], "Asia/Tokyo", "MM/dd");
        row[6] = Utilities.formatDate(row[6], "Asia/Tokyo", "MM/dd");
        row[7] = Utilities.formatDate(row[7], "Asia/Tokyo", "MM/dd");
      }
      return row;
    });
}
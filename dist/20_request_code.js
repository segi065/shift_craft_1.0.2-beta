"use strict";
function generate_requesttable() {
    const data = getsheet('shiftrequest_form').getRange("A1:D" + getsheet('shiftrequest_form').getLastRow()).getValues();
    const table_ss = getsheet('shiftrequest');
    data.shift();
    data.forEach(row => {
        row[1] = Utilities.formatDate(row[1], "Asia/Tokyo", "yyyy/MM/dd");
    });
    const staff = getsheet('staff').getRange("A1:A" + getsheet('staff').getLastRow()).getValues();
    const names = [...new Set(staff.slice(1).map(row => row[0]))];
    const needs_data = getsheet('shiftneeds').getRange("A1:H" + getsheet('shiftneeds').getLastRow()).getValues();
    const dates = [...new Set(data.map(row => row[1]))].sort();
    const output = [];
    output.push(["名前", ...dates]);
    names.forEach(name => {
        const row = [name];
        dates.forEach(date => {
            const request = data
                .filter(row => row[0] === name && row[1] === date)
                .map(row => `${Utilities.formatDate(row[2], "Asia/Tokyo", "HH:mm")}-${Utilities.formatDate(row[3], "Asia/Tokyo", "HH:mm")}`);
            row.push(request.join("\n"));
        });
        output.push(row);
    });
    console.log(output);
    table_ss.clearContents();
    table_ss.getRange(1, 1, output.length, output[0].length).setValues(output);
}
;

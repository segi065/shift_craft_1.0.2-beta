"use strict";
function get_staff_data() {
    const ss = getsheet('staff');
    const lastrow = ss.getLastRow();
    if (lastrow < 2)
        return []; // データなし対策
    const values = ss.getRange("A1:C"+lastrow).getValues();
    return values;
}
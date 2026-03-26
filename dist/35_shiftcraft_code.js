"use strict";
function totaltime(row) {
    const ss = getsheet('shiftcraft_person');
    const line = ss.getRange(row + 1, 2, 1, 7).getValues();
    let totalminutes = 0;
    line.forEach(values => {
        values.forEach(value => {
            const [start, end] = value.split("-");
            const [startH, startM] = start.split(":").map(Number);
            const [endH, endM] = start.split(":").map(Number);
            let startminutes = startH * 60 + startM;
            let endminutes = endH * 60 + endM;
            if (endminutes < startminutes)
                endminutes += 24 * 60;
            totalminutes += endminutes - startminutes;
        });
    });
    const hours = Math.floor(totalminutes / 60);
    const minutes = totalminutes % 60;
    const total = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    ss.getRange(row + 1, 8).setValue(total);
    return total;
}
;

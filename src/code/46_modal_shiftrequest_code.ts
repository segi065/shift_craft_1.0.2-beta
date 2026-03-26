function save_shiftrequest(result:{data:string[]; row:string; column:string;}){
    const ss = getsheet("shiftrequest");

    const row = Number(result.row)+1;
    const column = Number(result.column)+1;

    let times = "";

    if (result.data && result.data.length > 0) {
        times = result.data.join("\n");
    };

    console.log(ss.getRange(row,column).getA1Notation()+"\n"+times);
    ss.getRange(row,column).setValue(times);
};
    
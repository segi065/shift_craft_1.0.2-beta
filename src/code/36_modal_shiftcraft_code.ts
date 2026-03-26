function save_shiftcraft(result:{data:string[]; row:string; column:string;}){
    const ss = getsheet("shiftcraft");

    const row = Number(result.row)+1;
    const column = Number(result.column)+1;

    let times = "";

    if (result.data && result.data.length > 0) {
        times = result.data.join("\n");
    };

    console.log(ss.getRange(row,column).getA1Notation()+"\n"+times);
    ss.getRange(row,column).setValue(times);
    


    let calc = 0;
    ss.getRange(row, 2, 1, 7).getValues().forEach((values) => { 
        values.forEach(value => {

            const times = value.trim().split('\n');
            times.forEach((t: string) => {
                if (!/^\d{2}:\d{2}-\d{2}:\d{2}$/.test(t)) {
                    return;
                };

                const [start, end] = t.split('-');
                if(start && end){                            
                    const [sh, sm] = start.split(':').map(Number);
                    let [eh, em] = end.split(':').map(Number);

                    if(start> end){
                        eh += 24;
                    }

                    calc += (eh * 60 + em) - (sh * 60 + sm);
                };
            });
        });
    });

    const total = `${Math.floor(calc/60)}時間${(calc%60).toString().padStart(2,"0")}分`;

    ss.getRange(row, 9).setValue(total);
    return total;
        
    };
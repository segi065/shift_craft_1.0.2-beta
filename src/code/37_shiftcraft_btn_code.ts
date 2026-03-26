/*function shiftcraft_btn() {

    const CONFIG = {
    MAX_DAILY_HOURS: 8, // 1日最大勤務時間
    START_ROW: 2,
    DAYS: ["月","火","水","木","金","土","日"]
    };

    const ss = getsheet('shiftcraft');
    const ss_request = getsheet('shiftrequest').getRange('A1:J'+getsheet('shiftrequest').getLastRow()).getValues();
    const ss_needs = getsheet('shiftneeds').getRange('A1:H'+getsheet('shiftneeds').getLastRow()).getValues();

    if(ss_request[0][1] === ss_needs[0][1]){
        console.log("シフト希望と必要人数の日付が一致していません。");
        return;
    };

    const [request_daily, request_states] = format_request(ss_request);
    const needs_data = format_needs(ss_needs);

    const shift_data = generate_shift(request_daily, request_states, needs_data);
    console.log(shift_data);

    write_shift(shift_data);

    const staffData = sheetA.getDataRange().getValues();
    const needData = sheetB.getDataRange().getValues();

    let staffList = parseStaffData(staffData);
    let needList = parseNeedData(needData);

    let shiftResult = generateShift(staffList, needList, CONFIG);

    writeShift(sheetC, shiftResult, CONFIG);

};

function format_request(data: any[][]) {

    let result: { name: string, min: number, max: number, assigned: number, score: number, daily: any[], days: { [key: number]: { start: string, end: string }[] } }[] = [];

    data.forEach((row,index) => {
        if(index === 0) return;
        let staff: { name: string, min: number, max: number, assigned: number, score: number, daily: any[], days: { [key: number]: { start: string, end: string }[] } } = {            
            name: row[0],
            min: Number(row[8]),
            max: Number(row[9]),
            assigned: 0,
            daily: [],
            days: {},
            score: 0
        };

        for(let day=1; day<=7; day++){

            let cell = row[day];
            if(!cell) continue;

            cell.toString().split("\n").forEach((time: string) => {
                const [start, end] = time.split("-");
                if(start && end){
                    if(!staff.days[day]) staff.days[day] = [];
                    staff.days[day].push({start, end});
                };
            });

        }
        result.push(staff);
    });
    return result;
};*/

function format_needs(needs: any[][]) {

    let result: { 
        [day: number]: {
            [hour: string]: number
        } 
    } = {};

    needs.forEach((row,index) => {
        if(index === 0) return;
        let hour = Utilities.formatDate(new Date(row[0]), "Asia/Tokyo", "H");
        for(let day=1; day<=7; day++){
            let cell = row[day];
            if(!cell) continue;

            if(!result[day]) result[day] = {};
            result[day][hour] = Number(cell);
        };
    });

    return result;
};

/*function format_request(requests: string[][]) {
    let daily : { 
            [name: string]: {
                [day: number]: { start: number, end: number }[]
            } 
        } = {};

    let states : {
            [name: string]: {min: number, max: number, assigned: number, score: number}
        } = {};

    for (let i = 1; i < requests.length; i++) {
        const name = requests[i][0];
    
        let day_slots : { [key: number]: { start: number, end: number }[] } = {};

        for (let d = 1; d <= 7; d++) {
            let day = requests[i][d];
            if (!day) continue;
            

            day.split("\n").forEach((time: string) => {
                const [start, end] = time.split("-");
                const [sh, sm] = start.split(":").map(Number);
                const [eh, em] = end.split(":").map(Number);
                if (!day_slots[d]) day_slots[d] = [];
                day_slots[d].push({ start: sh, end: eh });
            });
        };
        
        daily[name] = day_slots;

        let min = Number(requests[i][8]);
        let max = Number(requests[i][9]);
        states[name] = { min, max, assigned: 0, score: 0 };
    };
    return [daily, states];
};

function generate_shift(
    request_daily: { [name: string]: { [day: number]: { start: number, end: number }[] } },
    request_states: { [name: string]: { min: number, max: number, assigned: number, score: number } },
    needs_data: { [key: number]: { hour: string, need: number }[] }
    ) 
    {

    let member_table: { [key: string]: { [key: number]: { time: number[], assigned: number } } } = {};
    let time_table: { [key: number]: { [key: number]: {members: string[], assigned: number} } } = {};

    request_data.forEach(staff=>{
        member_table[staff.name] = {};
        for(let d=1; d<=7; d++){
            member_table[staff.name][d] = { time: [], assigned: 0 };
        };
    });

    for (let h = 0; h < 24; h++) {
        time_table[h] = {};
        for (let d = 1; d <= 7; d++) {
            time_table[h][d] = { members: [], assigned: 0 };
        };
    };

    for(let d=1; d<=7; d++){

        for(let h=0; h<24; h++){

            let need = needs_data[d][h].need;
            if(!need) continue;

            for(let n=0; n<need; n++){

                let candidates = request_data.filter(staff=>{

                    let dayshift = staff.days[d];
                    if(!dayshift) return false;

                    let available = dayshift.some(shift=>{

                        const start = Number(shift.start.split(":")[0]);
                        const end = Number(shift.end.split(":")[0]);

                        return h >= start && h < end;
                    });
                    if(!available) return false;

                    if(staff.assigned >= staff.max) return false;

                    //if((staff.daily[d] || 0) >= CONFIG.MAX_DAILY_HOURS) return false;

                    return true;
                });

                if(candidates.length === 0)continue;

                for(let i=candidates.length-1; i>0; i--){

                    let j = Math.floor(Math.random()*i+1);
                    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
                };

                candidates.forEach(staff=>{
                    
                    let progress = staff.assigned / staff.min;
                    let maxprogress = staff.assigned / staff.max;

                    staff.score = (1-progress)*2 - maxprogress + Math.random()*0.5;;                    
                });
                
                candidates.sort((a,b)=>b.score - a.score);

                if(!member_table[candidates[0].name][d]) member_table[candidates[0].name][d] = { time: [], assigned: 0 };
                if(!time_table[h][d]) time_table[h][d] = { members: [], assigned: 0 };

                member_table[candidates[0].name][d].time.push(h);
                time_table[h][d].members.push(candidates[0].name);

                member_table[candidates[0].name][d].assigned++;
                time_table[h][d].assigned++;

                candidates[0].assigned++;
                candidates[0].daily[d] = (candidates[0].daily[d] || 0) + 1;
            };
        };
    };
    const result = { member_table, time_table };

    return result;
};
            let assigned: string[] = [];

    // 希望してるスタッフ探す
            request_data.forEach(staff=>{

                let dayShift = staff.days[d];

                if(!dayShift) return;

                dayShift.forEach(shift=>{

                    const start = Number(shift.start.split(":")[0]);
                    const end = Number(shift.end.split(":")[0]);

                    if(h >= start && h < end){

                    assigned.push(staff.name);

                    }

                });

            });

    // 必要人数分だけ採用
            assigned = assigned.slice(0,need);

    // resultに記録
            assigned.forEach(name=>{

                if(!result[name][d]) result[name][d] = [];
                result[name][d].push(h);
            });
        };
    };
    return result;
};*/

function write_shift(result: { member_table: { [key: string]: { [key: number]: { time: number[], assigned: number } } }, time_table: { [key: number]: { [key: number]: { members: string[], assigned: number } } } }) {

    getsheet("a").getRange("A2:I" + getsheet("a").getLastRow()).clearContent();

    const [member_table, time_table] = [result.member_table, result.time_table];

    let row = 2;
    for(let name in member_table){

        console.log(name, member_table[name]);
        getsheet("a").getRange(row,1).setValue(name);

        let totalAssigned = 0;
        for(let d=1; d<=7; d++){

            let dayData = member_table[name][d];

            if(!dayData) continue;

            let hours = dayData.time;
            let start = Math.min(...hours);
            let end = Math.max(...hours)+1;

            getsheet("a").getRange(row,d+1).setValue(start+":00~"+end+":00");
            totalAssigned += dayData.assigned;

        };
        getsheet("a").getRange(row,9).setValue(totalAssigned);

        row++;

    };

    getsheet("b").getRange("A2:I" + getsheet("b").getLastRow()).clearContent();

    row = 2;

    for(let hour in time_table){

        getsheet("b").getRange(row,1).setValue(hour+":00~"+(Number(hour)+1)+":00");
        let assigned = 0;

        for(let day in time_table[Number(hour)]){

            getsheet("b").getRange(row,Number(day)+1).setValue(time_table[Number(hour)][Number(day)].members.join(", "));
            assigned += time_table[Number(hour)][Number(day)].assigned;
        };

        getsheet("b").getRange(row,9).setValue(assigned);

        row++;
    };

};
function onOpen() {
    const ui = SpreadsheetApp.getUi();
    
    ui.createMenu("カスタムメニュー")
        .addItem("シフト調整", "generate_shifttable_time")
        .addItem("シフト調整(表示用)", "generate_shifttable_person")
        .addItem("シフト希望", "generate_requesttable")
        .addItem("シフト希望フォーム", "showsidebar")
        .addToUi();

};

function doGet(e: { parameter: { page: any; }; }) {
    type Page = keyof typeof routes;
    const page = ((e && e.parameter && e.parameter.page) || "index") as Page;
    //if (typeof routes[page] !== "function") {
    if(!routes[page]){
        return render("index");
    }
    return routes[page]();
}

const routes = {
    index: () => render("20_index"),
    shiftcraft: () => {
        const template = HtmlService.createTemplateFromFile("30_shiftcraft");
        template.data = get_shiftcraft_data();
        return template.evaluate()
                        .setTitle('ShiftCraft：shiftcraft')
                        .addMetaTag("viewport", "width=device-width, initial-scale=1");
    },
    shiftrequest: () => {
        const template = HtmlService.createTemplateFromFile("40_shiftrequest");
        template.data = get_shiftrequest_data();
        return template.evaluate()
                        .setTitle('ShiftCraft：shiftrequest')
                        .addMetaTag("viewport", "width=device-width, initial-scale=1");
    },
    staff: () => {
        const template = HtmlService.createTemplateFromFile("50_staff");
        template.data = get_staff_data();
        return template.evaluate()
                        .setTitle('ShiftCraft：staff')
                        .addMetaTag("viewport", "width=device-width, initial-scale=1");
    },
    needshift: () => {
        const template = HtmlService.createTemplateFromFile("60_shiftneeds");
        template.data = get_needshift_data();
        return template.evaluate()
                        .setTitle('ShiftCraft：needshift')
                        .addMetaTag("viewport", "width=device-width, initial-scale=1");
    }
};

function render(page: string) {
    return HtmlService.createTemplateFromFile(page)
        .evaluate()
        .setTitle("index")
        .addMetaTag("viewport", "width=device-width, initial-scale=1");
};
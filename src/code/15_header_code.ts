"use strict";
function getheaderData() {
    return {
        today: Utilities.formatDate(new Date(), "Asia/Tokyo", "M/d（E）"),
        staff_count: "18",
        next_shift: "完了"
    };
};

function getBaseUrl() {
    return ScriptApp.getService().getUrl();
};

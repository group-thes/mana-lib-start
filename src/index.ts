import * as _ from "lodash";

declare var The$: any;

export function CallMeIfYouCan() {
    let arr = [1, 2, 3, 4];
    let miny = _.min(arr);
    alert(miny);
}

export function OnScriptReady() {
    The$('#JQStatus').text("Ready!!!");
}

//alert("Library's loaded!");

The$(document).ready(function () {
    OnScriptReady();
    
});
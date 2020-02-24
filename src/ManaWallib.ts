import axios from "axios";
import { ManaWallibFunc } from "./ManaWallibFunc";

declare var The$: any;

var scriptForMana = document.createElement("script");
scriptForMana.src = "https://the$app.onmana.net";
document.head.appendChild(scriptForMana);

const titleName = "v7.3 Unit test Func window";

(<any>window).TheSAppHybridFuncsReady = TheSAppHybridFuncsReady;

const titleBarId = "#appTitleBar";
const titleTextId = "#appTitleText";

var func = new ManaWallibFunc();

hideContent();

export function GetCustomTitle() {
    var title = The$(titleTextId).text();
    return title;
}

export function GetBootstrapTitle(): string {
    var title = The$("nav .navbar-brand").text();
    return title;
}

function TheSAppHybridFuncsReady(fromWeb = false) {
    if (fromWeb) {
        CheckPlatformByOnline();
    }
    else {
        SetRunOnDevice(false, "SetManaRunonDevice This is *Mana*");
    }
}

async function CheckPlatformByOnline() {
    var statusCode = await func.CheckPlatformByOnline();

    if (statusCode.browserCode == null && statusCode.manaCode == null) {
        return;
    } else if (statusCode.browserCode == "403" && statusCode.manaCode == null) {
        showContent();
        SetRunOnDevice(true, "CheckCallOnline 403 This is *FromWeb*");
    }
    else if (statusCode.browserCode == "0" && statusCode.manaCode == null) {
        SetRunOnDevice(false, "TheSHybridFunc true This is *Mana*");
    }
    else if (statusCode.browserCode == "0" && statusCode.manaCode == "200") {
        SetRunOnDevice(false, "CheckCallOnlineNLocal This is *Mana*");
    }
    else if (statusCode.browserCode == "0" && statusCode.manaCode == "0") {
         //will show content ? if *No internet* add retry check TheSHybridFunc ?
        setTimeout(() => {
            if ((<any>window).TheSHybridFunc) {
                SetRunOnDevice(false, "CheckCallOnlineNLocal with Retry This is *Mana*");
            } else {
                SetRunOnDevice(true, "CheckCallOnlineNLocal This is *No internet*");
            }
        }, 50);
    }
}

function SetRunOnDevice(fromWeb: boolean, SetDeviceMsg: string = "") {
    func.SetRunOnDevice(fromWeb);
    The$("#SrunOn").text(SetDeviceMsg);
}

function hideContent() {
    var hideContentStyle = document.querySelector("style#app-hide-content");

    if (!hideContentStyle) {
        var style = document.createElement("style");
        style.setAttribute("id", "app-hide-content");
        style.type = "text/css";
        var css = "#app-form-submit {display: none;} ion-header:not(.home-header) {display: none;} nav {display:none !important;} " + titleBarId + " {display:none;}";
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    }
}

function showContent() {
    var hideContentStyle = document.querySelector("style#app-hide-content");

    if (hideContentStyle) {
        document.head.removeChild(hideContentStyle);
        var titleMargin = The$("ion-header").outerHeight(true);

        //Ionic add margin to content
        The$("ion-content .fixed-content").css("margin-top", titleMargin);
        The$("ion-content .scroll-content").css("margin-top", titleMargin);
    }
}

export function GetLib() {
    return func.GetLib();
}

The$(document).ready(function () {
    The$(".titleName").text(titleName);
    setTimeout(() => {
        TheSAppHybridFuncsReady(true);
    }, 50);
});
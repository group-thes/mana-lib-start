import { ManaFactory } from "./ManaFactory";
import axios from 'axios';

declare var The$: any;

The$("head").append("<script src='https://the$app.onmana.net'></script>");

const titleName = "v6.12 Alway Check online Use TheSHybridFunc";

(<any>window).TheSAppHybridFuncsReady = TheSAppHybridFuncsReady;

const browserUrl = "https://safebrowsing.googleapis.com/v4/threatLists";
const manaUrl = "https://jsonplaceholder.typicode.com/todos/1";
const titleBarId = "#appTitleBar";
const titleTextId = "#appTitleText";

var isMana: boolean;

var fac = new ManaFactory();

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
    if (isMana) return;
    if (fromWeb) {
        CheckPlatformByOnline();
    }
    else {
        SetRunOnDevice(false, "SetManaRunonDevice This is *Mana*");
    }
}

function CheckPlatformByOnline() {
    if (isMana) return;
    axios.get(browserUrl).catch(err => {
        console.log(JSON.stringify(err));
        if (err.response && err.response.status == "403") {
            showContent();
            SetRunOnDevice(true, "CheckCallOnline 403 This is *FromWeb*");
        } else {
            if ((<any>window).TheSHybridFunc) {
                SetRunOnDevice(false, "TheSHybridFunc true This is *Mana*");
            } else {
                if (isMana) return;
                axios.get(manaUrl).then(res => {
                    SetRunOnDevice(false, "CheckCallOnlineNLocal This is *Mana*");
                }).catch(err => {
                    setTimeout(() => {
                        if ((<any>window).TheSHybridFunc) {
                            SetRunOnDevice(false, "CheckCallOnlineNLocal with Retry This is *Mana*");
                        } else {
                            SetRunOnDevice(true, "CheckCallOnlineNLocal This is *No internet*");
                        }
                    }, 50);
                });
            }
        }
    });
}

function SetRunOnDevice(fromWeb: boolean, SetDeviceMsg: string) {
    if (isMana == false && fromWeb == false) {
        window.location.assign(window.location.href);
        return;
    };
    if (isMana) return;
    isMana = !fromWeb;
    fac.SetRunOnDevice(fromWeb);
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
    return fac.GetManaLib();
}

The$(document).ready(function () {
    The$(".titleName").text(titleName);
    setTimeout(() => {
        TheSAppHybridFuncsReady(true);
    }, 50);
});
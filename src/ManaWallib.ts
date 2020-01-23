import { ManaFactory } from "./ManaFactory";
import axios from 'axios';

var scriptForMana = document.createElement("script");
scriptForMana.src = "https://the$app.onmana.net";
document.head.appendChild(scriptForMana);

(<any>window).TheSAppHybridFuncsReady = TheSAppHybridFuncsReady;

export declare var The$: any;
(<any>window).The$G = The$;

var browserUrl = "https://safebrowsing.googleapis.com/v4/threatLists";
var manaUrl = "https://jsonplaceholder.typicode.com/todos/1";

var isMana: boolean;

var fac = new ManaFactory();

hideContent();

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
            if ((<any>window).TheSAppHybridAvail) {
                SetRunOnDevice(false, "TheSAppHybridAvail true This is *Mana*");
            } else {
                if (isMana) return;
                axios.get(manaUrl).then(res => {
                    SetRunOnDevice(false, "CheckCallOnlineNLocal This is *Mana*");
                }).catch(err => {
                    SetRunOnDevice(true, "CheckCallOnlineNLocal This is *No internet*");
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
        var css = "#app-form-submit {display: none;} ion-header:not(.home-header) {display: none;} nav {display:none !important;}";
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
    setTimeout(() => {
        TheSAppHybridFuncsReady(true);
    }, 50);
});
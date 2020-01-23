import { ITheSManaLibProvider } from "./ITheSManaLibProvider"
import axios from 'axios';

axios.interceptors.response.use(response => {
    return response.data;
});

export class ManaRestService implements ITheSManaLibProvider {

    private apiBase: string = "https://api-mana.azurewebsites.net";
    private apiUrls: Map<string, string> = new Map<string, string>();

    http: any;
    constructor() { }

    initPageApi(mcontentid: string): Promise<any> {
        return new Promise<any>((resolver, rejector) => {
            if (this.apiUrls.has(mcontentid)) {
                resolver(this.apiUrls.get(mcontentid));
            } else {
                console.log('Get mcid: ' + mcontentid);
                axios.get<InitPageAPI>(this.apiBase + "/api/mcontent/form/" + mcontentid).then((data: any) => {
                    this.apiUrls.set(mcontentid, data.url);
                    resolver(data.url);
                }).catch(err => rejector(err));
            }
        });
    }

    initPageApiWithCallBack(mcontentid: string, fn: () => void): Promise<any> {
        return new Promise<any>((resolver, rejector) => {
            if (this.apiUrls.has(mcontentid)) {
                resolver(this.apiUrls.get(mcontentid));
            } else {
                console.log('Get mcid: ' + mcontentid);
                axios.get<InitPageAPI>(this.apiBase + "/api/mcontent/form/" + mcontentid).then((data: any) => {
                    this.apiUrls.set(mcontentid, data.url);
                    resolver(data.url);
                }).catch(err => rejector(err));
            }
        });
    }

    getApiData(mcid: string): Promise<any> {
        return this.initPageApi(mcid).then(url => {
            console.log('[getApiData]: ' + url);
            return axios.get(url);
        });
    }

    getApiDataWithEndpointId(mcid: string, endpointId: string): Promise<any> {
        return this.initPageApi(mcid).then((url: any) => {
            console.log('[getApiData]: ' + url);
            return this.http.get(url + "/" + endpointId).toPromise()
        });
    }

    submitFormData(mcid: string, data: any, manualClose: boolean) {
        console.log("post data : " + JSON.stringify(data));
        var prom = this.initPageApi(mcid).then(url => axios.post(url, data));
        if (!manualClose) {
            //How to use navCtrl
            //this.navCtrl.popToRoot();
        }
        return prom;
    }
    submitFormDataWithEndpointId(mcid: string, data: any, endpointId: string, manualClose: boolean) {
        var prom = this.initPageApi(mcid).then(url => this.http.post(url + "/" + endpointId, data).toPromise());
        if (!manualClose) {
            //How to use navCtrl
            //this.navCtrl.popToRoot();;
        }
        return prom;
    }
    callApiGet(mcid: string, url: string): Promise<any> {
        return this.http.get(url).toPromise();
    }
    callApiPost(mcid: string, data: any): Promise<any> {
        var prom = this.initPageApi(mcid).then(url => this.http.post(url, data).toPromise());
        return prom;
    }
    callApiDelete(mcid: string): Promise<any> {
        return this.initPageApi(mcid).then(url => this.http.delete(url).toPromise());
    }
    visitEndpoint(mcid: string, url: string): void {
        switch (url) {
            //How to use navCtrl
            // case "user-profile-edit-name": this.navCtrl.push("UserProfileEditNamePage", url); break;
            // case "user-profile-edit-address": this.navCtrl.push("UserProfileEditAddressPage", url); break;
            default: window.location.assign(url); break;
        }
    }
    callTrigger(mcid: string, triggerName: string): void {
        switch (triggerName) {
            default: window.location.assign(triggerName); break;
        }
    }
    validForm(valid: boolean) {
        console.log("form validation status :" + valid)
    }
    confirmForm(meesage: import("./ITheSManaLibProvider").confirmMessage): Promise<any> {
        throw new Error("Method not implemented.");
    }
    getAppBridge() {
        return new Promise<any>(() => { });
    }
    selectImage(mcid: string): Promise<any> {
        return new Promise<any>(() => { });
    }
    setButtonVisibility(isVisible: boolean) {
        console.log("setButtonVisibility:" + isVisible)
    }
    setStateChangedHandler(fn: (param: any) => void) {
        console.log("setStateChangedHandler");
    }
    addToolbarAction(fn: (action: any) => void) {
        console.log("addToolbarItem");
    }
    showOptionDialog(mcid: any, params: any): Promise<any> {
        return new Promise<any>(() => { });
    }
    initOptionDialog(mcid: string, fn: (param: any) => any): Promise<any> {
        return new Promise<any>(() => { });
    }

}

interface InitPageAPI {
    url: string;
}
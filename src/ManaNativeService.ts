import { ITheSManaLibProvider } from "./ITheSManaLibProvider";

declare function TheSHybridCall(methodName: string, parameter: any): void;
declare function TheSHybridFunc(methodName: string, parameter: string, callback: any): void;

export class ManaNativeService implements ITheSManaLibProvider {
    
    getName(): string {
        return "ManaNativeService";
    }

    private callBackFunc: () => void;
    private onStateChangedFunc: (param: any) => void;
    private onSelectToolbar: (action: any) => void;
    private onOptionSelected: (response: any) => any;

    //How to use NgZone
    private static zone: any;

    constructor() {
        (<any>window).refreshOnGoBack = () => { this.executeCallBackFunc() };

        (<any>window).OnStateChanged = (param: any) => { this.executeOnStateChanged(param) };

        (<any>window).OnSelectToolbar = (action: any) => { this.excuteToolbarItemFunc(action) };

        (<any>window).onOptionSelected = (response: any) => { return this.excuteOnOptionSelected(response) };
    }

    initPageApi(mcontentid: string): Promise<any> {
        return this.callAppMethod('initPageApi', mcontentid);
    }

    initPageApiWithCallBack(mcontentid: string, fn: () => void): Promise<any> {
        this.callBackFunc = fn;

        return this.callAppMethod('initPageApi', mcontentid);
    }
    getApiData(mcid: string): Promise<any> {
        return this.callNativeFunc('getApiData', mcid);
    }
    getApiDataWithEndpointId(mcid: string, endpointId: string): Promise<any> {
        return this.callNativeFunc('getApiDataWithEndpointId', JSON.stringify({ mcid: mcid, endpointId: endpointId }));
    }
    submitFormData(mcid: string, data: any, manualClose: boolean) {
        this.callAppMethod('submitFormData', { mcid: mcid, data: data, shouldClose: !manualClose });
    }
    submitFormDataWithEndpointId(mcid: string, data: any, endpointId: string, manualClose: boolean) {
        this.callAppMethod('submitFormDataWithEndpointId', { mcid: mcid, data: data, endpointId: endpointId, shouldClose: !manualClose });
    }
    callApiGet(mcid: string, url: string): Promise<any> {
        console.log("Hello callApiGet Bridge " + mcid);
        return this.callNativeFunc('callApiGet', JSON.stringify({ mcid: mcid, url: url }));
    }
    callApiPost(mcid: string, data: any): Promise<any> {
        return this.callNativeFunc('callApiPost', JSON.stringify({ mcid: mcid, data: data }))
    }
    callApiDelete(mcid: string): Promise<any> {
        return this.callNativeFunc('getApiData', mcid);
    }
    visitEndpoint(mcid: string, url: string): void {
        this.callNativeFunc('visitEndpoint', JSON.stringify({ mcid: mcid, url: url }));
    }
    callTrigger(mcid: string, triggerName: string): void {
        this.callNativeFunc('callTrigger', JSON.stringify({ mcid: mcid, triggerName: triggerName }));
    }
    validForm(valid: boolean) {
        this.callAppMethod('validForm', valid);
    }
    confirmForm(meesage: import("./ITheSManaLibProvider").confirmMessage): Promise<any> {
        return this.callNativeFunc('confirmForm', JSON.stringify(meesage));
    }
    getAppBridge() {
        return this.retry(() => this.retryGetTheSHybridFunc(), [1500, 999, 500, 200, 99, 50, 50, 50, 50, 20, 10]);
    }
    selectImage(mcid: string): Promise<any> {
        return this.callNativeFunc('selectImage', mcid);
    }
    setButtonVisibility(isVisible: boolean) {
        this.callAppMethod('setButtonVisibility', isVisible);
    }
    setStateChangedHandler(fn: (param: any) => void) {
        this.onStateChangedFunc = fn;
    }
    addToolbarAction(fn: (action: any) => void) {
        this.onSelectToolbar = fn;
    }
    showOptionDialog(mcid: any, params: any): Promise<any> {
        return this.callNativeFunc('showOptionDialog', JSON.stringify({ mcid: mcid, params: params }));
    }
    initOptionDialog(mcid: string, fn: (param: any) => any): Promise<any> {
        this.onOptionSelected = fn;
        return this.callNativeFunc('initOptionDialog', JSON.stringify({ mcid: mcid }));
    }

    private callAppMethod(fName: string, fParam: any) {
        return new Promise((resolve, reject) => {
            try {
                TheSHybridCall(fName, fParam);
                resolve({});
            } catch (error) {
                console.log(error);
                resolve("error callAppMethod : " + error);
            }
        });
    }

    retryGetTheSHybridFunc(): Promise<any> {
        return new Promise((resolver, rejector) => {
            if (typeof TheSHybridFunc == "undefined" || !TheSHybridFunc) {
                rejector();
            } else {
                resolver(this);
            }
        });
    }

    private callNativeFunc(fName: string, fParam: string) {
        return new Promise((resolve, reject) => {
            try {
                TheSHybridFunc(fName, fParam, (rsp: any) => resolve(rsp));
            } catch (error) {
                resolve("error callNativeFunc : " + error);
            }
        });
    }

    private retry(fn: () => Promise<{}>, intervals = [150, 99, 89, 79]) {
        return new Promise((resolve, reject) => {
            let fn2call = fn;
            if (intervals.length > 0) {
                let waitTime = 2 * +intervals[intervals.length - 1];
                fn2call = () => this.circuitBreaker(fn, waitTime);
            }
            fn2call()
                .then(resolve)
                .catch((error) => {
                    if (intervals.length == 0) {
                        // reject('maximum retries exceeded');
                        reject(error);
                        return;
                    } else {
                        var interval = intervals.pop();
                        setTimeout(() => {
                            // Passing on "reject" is the important part
                            this.retry(fn, intervals).then(resolve, reject);
                        }, interval);
                    }
                });
        });
    }

    private circuitBreaker(fn: () => Promise<{}>, internval: number): Promise<{}> {
        return new Promise((resolve, reject) => {
            let timer = setTimeout(() => {
                reject({ timeout: true });
            }, internval);
            let prom = fn();
            prom.then(it => {
                clearTimeout(timer);
                resolve(it);
            }).catch(reject);
        });
    }

    private executeCallBackFunc() {
        if (this.callBackFunc) {
            ManaNativeService.zone.run(() => {
                this.callBackFunc();
            });
        }
    }

    private executeOnStateChanged(param: any) {
        if (this.onStateChangedFunc) {
            ManaNativeService.zone.run(() => {
                this.onStateChangedFunc(param);
            });
        }
    }

    private excuteToolbarItemFunc(action: any) {
        if (this.onSelectToolbar) {
            ManaNativeService.zone.run(() => {
                this.onSelectToolbar(action);
            });
        }
    }

    private excuteOnOptionSelected(response: any): any {
        if (this.onOptionSelected) {
            return this.onOptionSelected(response);
        }
    }
}
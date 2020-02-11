export interface ITheSManaLibProvider {
    initPageApi(mcontentid: string): Promise<any>;

    initPageApiWithCallBack(mcontentid: string, fn: () => void): Promise<any>;

    getApiData(mcid: string): Promise<any>;

    getApiDataWithEndpointId(mcid: string, endpointId: string): Promise<any>;

    submitFormData(mcid: string, data: any, manualClose: boolean): any;

    submitFormDataWithEndpointId(mcid: string, data: any, endpointId: string, manualClose: boolean): any;

    callApiGet(mcid: string, url: string): Promise<any>;

    callApiPost(mcid: string, data: any): Promise<any>;

    callApiDelete(mcid: string): Promise<any>;

    visitEndpoint(mcid: string, url: string): void;

    callTrigger(mcid: string, triggerName: string): void;

    validForm(valid: boolean): any;

    confirmForm(meesage: confirmMessage): Promise<any>;

    getAppBridge(): any;

    selectImage(mcid: string): Promise<any>;

    setButtonVisibility(isVisible: boolean): any;

    setStateChangedHandler(fn: (param: any) => void): any;

    addToolbarAction(fn: (action: any) => void): any;

    showOptionDialog(mcid: any, params: any): Promise<any>;

    initOptionDialog(mcid: string, fn: (param: any) => any): Promise<any>;

    getName():string;
}

export class confirmMessage {
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    constructor(title: string, message: string, confirmText?: string, cancelText?: string) {
        this.title = title;
        this.message = message;
        this.confirmText = confirmText;
        this.cancelText = cancelText;
    }
}
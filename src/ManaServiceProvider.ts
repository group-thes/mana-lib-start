import { ManaFactory } from "./ManaFactory";
import { confirmMessage } from "./ITheSManaLibProvider";

export class ManaServiceProvider {

  fac: ManaFactory;

  constructor() {
    // this.fac = new ManaFactory();
  }

  public async initPageApi(mcid: string) {
    var manaSvc = await this.fac.GetManaLib();
    manaSvc.initPageApi(mcid);
  }

  public async initPageApiWithCallBack(mcid: string, fn: () => void) {
    var manaSvc = await this.fac.GetManaLib();
    manaSvc.initPageApiWithCallBack(mcid, fn);
  }

  public async getApiData(mcid: string): Promise<any> {
    var manaSvc = await this.fac.GetManaLib();
    return this.retry(() => manaSvc.getApiData(mcid));
  }

  public async getApiDataWithEndpointId(mcid: string, endpointId: string): Promise<any> {
    var manaSvc = await this.fac.GetManaLib();
    return this.retry(() => manaSvc.getApiDataWithEndpointId(mcid, endpointId));
  }

  public async submitFormData(mcid: string, data: any, manualClose: boolean = false) {
    var manaSvc = await this.fac.GetManaLib();
    return manaSvc.submitFormData(mcid, data, manualClose);
  }

  public async submitFormDataWithEndpointId(mcid: string, data: any, manualClose: boolean, endpointId: string) {
    var manaSvc = await this.fac.GetManaLib();
    return manaSvc.submitFormDataWithEndpointId(mcid, data, endpointId, manualClose);
  }

  public async callApiGet(mcid: string, url: string): Promise<any> {
    var manaSvc = await this.fac.GetManaLib();
    return this.retry(() => manaSvc.callApiGet(mcid, url));
  }

  public async callApiPost(mcid: string, data: any): Promise<any> {
    var manaSvc = await this.fac.GetManaLib();
    return manaSvc.callApiPost(mcid, data);
  }

  public async callApiDelete(mcid: string): Promise<any> {
    var manaSvc = await this.fac.GetManaLib();
    return manaSvc.callApiDelete(mcid);
  }

  public async visitEndpoint(mcid: string, url: string) {
    var manaSvc = await this.fac.GetManaLib();
    manaSvc.visitEndpoint(mcid, url);
  }

  public async callTrigger(mcid: string, triggerName: string) {
    var manaSvc = await this.fac.GetManaLib();
    manaSvc.callTrigger(mcid, triggerName);
  }

  public async validForm(valid: boolean) {
    var manaSvc = await this.fac.GetManaLib();
    manaSvc.validForm(valid);
  }

  public async confirmForm(message: confirmMessage): Promise<any> {
    var manaSvc = await this.fac.GetManaLib();
    return manaSvc.confirmForm(message);
  }

  public async selectImage(mcid: string): Promise<any> {
    var manaSvc = await this.fac.GetManaLib();
    return manaSvc.selectImage(mcid);
  }

  public async setButtonVisibility(isVisible: boolean): Promise<any> {
    var manaSvc = await this.fac.GetManaLib();
    return manaSvc.setButtonVisibility(isVisible);
  };

  public async setStateChangedHandler(fn: (paeam: any) => void) {
    var manaSvc = await this.fac.GetManaLib();
    manaSvc.setStateChangedHandler(fn);
  }

  public async addToolbarAction(fn: (action: any) => void) {
    var manaSvc = await this.fac.GetManaLib();
    manaSvc.addToolbarAction(fn);
  }

  public async showOptionDialog(mcid: any, params: any): Promise<any> {
    var manaSvc = await this.fac.GetManaLib();
    return manaSvc.showOptionDialog(mcid, params);
  }

  public async initOptionDialog(mcid: string, fn: (param: any) => any): Promise<any> {
    var manaSvc = await this.fac.GetManaLib();
    return this.retry(() => manaSvc.initOptionDialog(mcid, fn));
  }

  private retry(fn: () => Promise<{}>, intervals = [250, 250, 222, 200]) {
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

}
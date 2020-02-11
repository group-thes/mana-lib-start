import { ITheSManaLibProvider } from "./ITheSManaLibProvider";
import { ManaRestService } from "./ManaRestService";
import { ManaNativeService } from "./ManaNativeService";

export class ManaFactory {
    private static promResolve: any;
    private ILib: Promise<ITheSManaLibProvider>;

    constructor() {
        this.ILib = new Promise((resolve, reject) => {
            ManaFactory.promResolve = resolve;
        });
    }

    public async GetManaLib(): Promise<ITheSManaLibProvider> {
        return this.ILib;
    }

    public async SetRunOnDevice(fromWeb: boolean) {
        if (fromWeb) {
            var restservice = new ManaRestService();
            ManaFactory.promResolve(restservice);
        } else {
            // var manaservice = new ManaNativeService();
            // ManaFactory.promResolve(manaservice);
            this.getAppBridge().then(() => {
                var manaservice = new ManaNativeService();
                ManaFactory.promResolve(manaservice);
            }).catch(err => {
                console.log(err);
                window.location.assign(window.location.href);
            });
        }
    }

    getAppBridge(): Promise<any> {
        return this.retry(() => this.retryGetTheSHybridFunc(), [1000, 500, 250, 150, 50, 50]);
    }

    retryGetTheSHybridFunc(): Promise<any> {
        return new Promise((resolver, rejector) => {
            if (typeof (<any>window).TheSHybridFunc == "undefined" || !((<any>window).TheSHybridFunc)) {
                rejector("TheSHybridFunc is null or undefined");
            } else {
                resolver();
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
                        reject("Out of time : " + error);
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
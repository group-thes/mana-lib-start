import { ManaFactory } from "./ManaFactory";
import axios, { AxiosInstance } from "axios";

export class ManaWallibFunc {
    private browserUrl = "https://safebrowsing.googleapis.com/v4/threatLists";
    private manaUrl = "https://jsonplaceholder.typicode.com/todos/1";
    private fac = new ManaFactory();
    private axiosInstance: AxiosInstance;
    private runningOnMana?: boolean;

    constructor(axiosInstance: AxiosInstance = axios) {
        this.axiosInstance = axiosInstance;
    }

    private ReloadPage(){
        window.location.assign(window.location.href);
    };

    public GetLib() {
        return this.fac.GetManaLib();
    }

    public SetRunOnDevice(fromWeb: boolean) {
        if (this.runningOnMana == true) return;
        if (this.runningOnMana == false && fromWeb == false) {
            this.ReloadPage();
            return;
        };
        this.runningOnMana = !fromWeb;
        this.fac.SetRunOnDevice(fromWeb);
    }

    public CheckPlatformByOnline(): Promise<any> {
        return new Promise((resolve, reject) => {

            if (this.runningOnMana) resolve({ browserCode: null, manaCode: null });

            this.axiosInstance.get(this.browserUrl).catch(err => {
                if (err.response && err.response.status == "403") {
                    resolve({ browserCode: "403", manaCode: null });;
                } else {
                    if ((<any>window).TheSHybridFunc) {
                        resolve({ browserCode: "0", manaCode: null });
                    } else {

                        if (this.runningOnMana) resolve({ browserCode: null, manaCode: null });

                        this.axiosInstance.get(this.manaUrl).then(res => {
                            resolve({ browserCode: "0", manaCode: "200" });
                        }).catch(err => {
                            resolve({ browserCode: "0", manaCode: "0" });
                        });
                    }
                }
            });
        });
    }
}


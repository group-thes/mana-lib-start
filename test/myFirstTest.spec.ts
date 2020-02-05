import { ManaFactory } from '../src/ManaFactory';
import { ManaRestService } from '../src/ManaRestService';
import { ManaNativeService } from '../src/ManaNativeService';
import { ManaWallibFunc } from '../src/ManaWallibFunc';
import axios, { AxiosStatic, AxiosInstance } from 'axios';
import * as moxios from 'moxios';

var fac = new ManaFactory();

var browserUrl = "https://safebrowsing.googleapis.com/v4/threatLists";
var manaUrl = "https://jsonplaceholder.typicode.com/todos/1";

(<any>global).window = jasmine.createSpy();

describe("ManaFactory", () => {
    it('When SetRunOnDevice with true then GetManaLib it should be ManaRestService', () => {
        fac.SetRunOnDevice(true);
        expect(typeof (fac.GetManaLib())).toBe(typeof (new ManaRestService()));
    })
    it('When SetRunOnDevice with false then GetManaLib it should be ManaNativeService', () => {
        fac.SetRunOnDevice(false);
        expect(typeof (fac.GetManaLib())).toBe(typeof (new ManaNativeService()));
    })
});

describe("ManaWallibFunc", () => {
    var axiosInstance = axios.create();

    beforeEach(() => {
        moxios.install(axiosInstance);
    });

    afterEach(() => {
        moxios.uninstall(axiosInstance);
        (<any>global).window.TheSHybridFunc = false;
    });

    it('When run on browser status code must be 403 and null', async () => {
        moxios.stubFailure("get", browserUrl, {
            status: 403
        });

        var manaFunc = new ManaWallibFunc(axiosInstance);
        var result = await manaFunc.CheckPlatformByOnline();
        expect(result.browserCode).toBe("403");
        expect(result.manaCode).toBeNull();
    })
    it('When run on mana status code must be 0 and 200', async () => {
        moxios.stubFailure("get", browserUrl, {
            status: 400
        });

        moxios.stubRequest(manaUrl, {
            status: 200
        });

        var manaFunc = new ManaWallibFunc(axiosInstance);
        var result = await manaFunc.CheckPlatformByOnline();
        expect(result.browserCode).toBe("0");
        expect(result.manaCode).toBe("200");
    });

    it('When running on Mana status code must be null and null', async () => {
        var manaFunc = new ManaWallibFunc();
        manaFunc.SetRunOnDevice(false);
        var result = await manaFunc.CheckPlatformByOnline();
        expect(result.browserCode).toBeNull();
        expect(result.manaCode).toBeNull();
    });

    it('When check TheSHybridFunc status code must be 0 and null', async () => {
        moxios.stubFailure("get", browserUrl, {
            status: 400
        });

        (<any>global).window.TheSHybridFunc = true;

        var manaFunc = new ManaWallibFunc(axiosInstance);

        var result = await manaFunc.CheckPlatformByOnline();
        expect(result.browserCode).toBe("0");
        expect(result.manaCode).toBeNull();
    });

    it('When it no internet and run on browser status code must be 0 and 0', async ()=>{
        moxios.stubFailure("get", browserUrl, {
            status: 400
        });

        moxios.stubFailure("get", manaUrl, {
            status: 400
        });

        var manaFunc = new ManaWallibFunc(axiosInstance);
        var result = await manaFunc.CheckPlatformByOnline();
        expect(result.browserCode).toBe("0");
        expect(result.manaCode).toBe("0");
    });
});
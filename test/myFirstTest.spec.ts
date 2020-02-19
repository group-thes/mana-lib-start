import { ManaFactory } from '../src/ManaFactory';
import { ManaWallibFunc } from '../src/ManaWallibFunc';
import axios from 'axios';
import * as moxios from 'moxios';
import { JSDOM } from 'jsdom';

var browserUrl = "https://safebrowsing.googleapis.com/v4/threatLists";
var manaUrl = "https://jsonplaceholder.typicode.com/todos/1";

const dom = new JSDOM("<!DOCTYPE html><html><head><script src='../src/theSjquery-slim.js'></script></head></html>", {
    url: "https://example.org/",
    contentType: "text/html",
});

(<any>global).window = dom.window;

describe("ManaFactory", () => {
    afterEach(() => {
        (<any>global).window.TheSHybridFunc = undefined;
    });
    
    it('When SetRunOnDevice with true then GetManaLib it should be ManaRestService', async () => {
        var fac = new ManaFactory();
        fac.SetRunOnDevice(true);
        var lib = await fac.GetManaLib();
        var result = lib.getName();
        expect(result).toBe("ManaRestService");
    })
    it('When SetRunOnDevice with false then GetManaLib it should be ManaNativeService', async () => {
        (<any>global).window.TheSHybridFunc = true;
        var fac = new ManaFactory();
        fac.SetRunOnDevice(false);
        var lib = await fac.GetManaLib();
        var result = lib.getName();
        expect(result).toBe("ManaNativeService");
    })
});

describe("ManaWallibFunc CheckPlatformByOnline", () => {
    var axiosInstance = axios.create();

    beforeEach(() => {
        moxios.install(axiosInstance);
    });
    afterEach(() => {
        moxios.uninstall(axiosInstance);
        (<any>global).window.TheSHybridFunc = undefined;
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

    it('When TheSHybridFunc is not undefine status code must be 0 and null', async () => {
        moxios.stubFailure("get", browserUrl, {
            status: 400
        });

        (<any>global).window.TheSHybridFunc = true;

        var manaFunc = new ManaWallibFunc(axiosInstance);

        var result = await manaFunc.CheckPlatformByOnline();
        expect(result.browserCode).toBe("0");
        expect(result.manaCode).toBeNull();
    });

    it('When it no internet and run on browser status code must be 0 and 0', async () => {
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

describe("ManaWallibFunc SetRunOnDevice", () => {
    afterEach(() => {
        (<any>global).window.TheSHybridFunc = undefined;
    });

    it('When set device run on Mana and set device run on browser again it device must be Mana', async () => {
        (<any>global).window.TheSHybridFunc = true;
        var manaFunc = new ManaWallibFunc();
        manaFunc.SetRunOnDevice(false);
        manaFunc.SetRunOnDevice(true);
        var lib = await manaFunc.GetLib();
        var result = lib.getName();
        expect(result).toBe("ManaNativeService");
    })

    it('When set device run on browser and set device run on Mana it must be call reload page', () => {
        (<any>global).window.TheSHybridFunc = true;
        var manaFunc = new ManaWallibFunc();
        spyOn<any>(manaFunc, "ReloadPage");
        manaFunc.SetRunOnDevice(true);
        manaFunc.SetRunOnDevice(false);
        expect((<any>manaFunc).ReloadPage).toHaveBeenCalledTimes(1);
    });

    it('When set device run on Mana and set device run on Mana fac.SetRunOnDevice must call once time', () => {
        (<any>global).window.TheSHybridFunc = true;
        var manaFunc = new ManaWallibFunc();
        spyOn<any>((<any>manaFunc).fac, "SetRunOnDevice");
        manaFunc.SetRunOnDevice(false);
        manaFunc.SetRunOnDevice(false);
        expect((<any>manaFunc).fac.SetRunOnDevice).toHaveBeenCalledTimes(1);
        
    });
});
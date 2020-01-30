import { ManaFactory } from '../src/ManaFactory';
import { ManaRestService } from '../src/ManaRestService';
import * as manawall from '../src/ManaWallib';

var fac = new ManaFactory();

// describe("ManaFactory", () => {
//     fac.SetRunOnDevice(true);
//     it('When GetManaLib it should be ManaRestService', () => {
//         expect(typeof (fac.GetManaLib())).toBe(typeof (new ManaRestService()));
//     })

// });

describe("ManaWallib", () => {
    fac.SetRunOnDevice(false);
    it('When GetManaLib it should be ManaRestService', () => {
        expect(typeof (manawall.GetLib())).toBe(typeof (new ManaRestService()));
    })

});
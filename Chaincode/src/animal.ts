/*
  SPDX-License-Identifier: Apache-2.0
*/

import {Object, Property} from 'fabric-contract-api';

@Object()
export class Animal {

    @Property()
    public ID: string;
    
    @Property()
    public name: string;

    @Property()
    public breed: string;

    @Property()
    public birthDate: string;

    @Property()
    public imgUrl: string;

    @Property()
    public description: string;

    @Property()
    public type: string;

    @Property()
    public pedigree: string;
}

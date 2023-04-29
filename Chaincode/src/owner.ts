import {Object, Property} from 'fabric-contract-api';

@Object()
export class Owner {

    @Property()
    public ownerId: string;
    
    @Property()
    public ownerName: string;

    @Property()
    public ownerLastname: string;
}
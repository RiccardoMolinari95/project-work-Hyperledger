import * as grpc from '@grpc/grpc-js';
import {Gateway, Identity, Signer} from '@hyperledger/fabric-gateway';

export interface BlockchainServiceInterface {
    newGrpcConnection(): Promise<grpc.Client>;
    newIdentity(): Promise<Identity>;
    newSigner(): Promise<Signer>
    connect(): Promise<Gateway>
}

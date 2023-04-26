import {BlockchainServiceInterface} from './interface/BlockchainServiceInterface';
import {connect, Gateway, Identity, Signer, signers} from '@hyperledger/fabric-gateway';
import * as grpc from '@grpc/grpc-js';
import {promises as fs} from 'fs';
import path from 'path';
import crypto from 'crypto';
import config from '../../config/Config';

export class BlockchainService implements BlockchainServiceInterface {

	private channelName = config.fabric.channel.name;
	private chaincodeName = config.fabric.chaincode.name;
	private mspId: string = config.fabric.mspId;

	async connect(): Promise<Gateway> {
		const client = await this.newGrpcConnection();
		return connect({
			client,
			identity: await this.newIdentity(),
			signer: await this.newSigner(),
			// Default timeouts for different gRPC calls
			evaluateOptions: () => {
				return { deadline: Date.now() + 5000 }; // 5 seconds
			},
			endorseOptions: () => {
				return { deadline: Date.now() + 15000 }; // 15 seconds
			},
			submitOptions: () => {
				return { deadline: Date.now() + 5000 }; // 5 seconds
			},
			commitStatusOptions: () => {
				return { deadline: Date.now() + 60000 }; // 1 minute
			},
		});
	}

	async newGrpcConnection(): Promise<grpc.Client> {
		const tlsRootCert = await fs.readFile(config.fabric.tlsCertPath);
		const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
		return new grpc.Client(config.fabric.peerEndpoint, tlsCredentials, {
			'grpc.ssl_target_name_override': config.fabric.peerHostAlias,
		});
	}

	async newIdentity(): Promise<Identity> {
		const credentials = await fs.readFile(config.fabric.certPath);
		const mspId = this.mspId;
		return { mspId, credentials };
	}

	async newSigner(): Promise<Signer> {
		const files = await fs.readdir(config.fabric.keyDirectoryPath);
		const keyPath = path.resolve(config.fabric.keyDirectoryPath, files[0]);
		const privateKeyPem = await fs.readFile(keyPath);
		const privateKey = crypto.createPrivateKey(privateKeyPem);
		return signers.newPrivateKeySigner(privateKey);
	}

}

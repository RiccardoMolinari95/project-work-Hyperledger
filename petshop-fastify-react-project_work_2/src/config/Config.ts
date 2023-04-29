import * as dotenv from 'dotenv';

export interface Config {
    fabric: {
        cryptoPath: string;
        keyDirectoryPath: string;
        certPath: string;
        tlsCertPath: string;
        peerEndpoint: string;
        peerHostAlias: string;
        mspId: string;
        channel: {
            name: string;
        };
        chaincode: {
            name: string;
        }
        
    };
}

class EnvConfig implements Config {
    private __dotenv = dotenv.config();

    fabric = {
    	cryptoPath: this.getOrFail('FABRIC_KEY_DIRECTORY_PATH'),
    	keyDirectoryPath: this.getOrFail('FABRIC_KEY_DIRECTORY_PATH'),
    	certPath: this.getOrFail('FABRIC_CERT_PATH'),
    	tlsCertPath: this.getOrFail('FABRIC_TLS_CERT_PATH'),
    	peerEndpoint: this.getOrFail('FABRIC_PEER_ENDPOINT'),
    	peerHostAlias: this.getOrFail('FABRIC_PEER_HOST_ALIAS'),
    	mspId: this.getOrFail('FABRIC_MSP_ID'),
    	channel: {
    		name: this.getOrFail('FABRIC_CHANNEL_NAME')
    	},
    	chaincode: {
    		name: this.getOrFail('FABRIC_CHAINCODE_NAME')
    	}
    };

    private getOrFail(key: string) {
    	const val = process.env[key];
    	if (!val) {
    		throw new Error('Required environment variable is not set: ' + key);
    	}
    	return val;
    }
}

const config: Config = new EnvConfig();
export default config;

import * as OneSignal from '@onesignal/node-onesignal';

const ONESIGNAL_APP_ID = '218efe78-b7b8-4559-ae07-84a23fe3e43f';

const app_key_provider = {
    getToken() {
        return 'os_v2_app_eghp46fxxbcvtlqhqsrd7y7eh5yqw4n7oqye7jmgykkkxlx6dw6ipk36en2vk3n3sw6drxba5ezgf3h6ellulyd4bv2twhgghauepmq';
    }
};

const configuration = OneSignal.createConfiguration({
    authMethods: {
        app_key: {
            tokenProvider: app_key_provider
        }
    }
});

const client = new OneSignal.DefaultApi(configuration);

export { client, ONESIGNAL_APP_ID };
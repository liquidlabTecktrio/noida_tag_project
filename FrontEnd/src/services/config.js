import { serverIP } from './const'
import { serverPORT } from './const'

const config = {
   
    baseUrl: `http://${serverIP}:${serverPORT}/v1/admin/`,
    // baseUrl: `https://${serverIP}/manager/`,

};
export default config;
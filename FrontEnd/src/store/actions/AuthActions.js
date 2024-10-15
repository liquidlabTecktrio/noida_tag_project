import axios from 'axios';
import {
    formatError,
    login,
    runLogoutTimer,
    saveTokenInLocalStorage,
    signUp,
} from '../../services/AuthService';
import config from '../../services/config';


export const SIGNUP_CONFIRMED_ACTION = '[signup action] confirmed signup';
export const SIGNUP_FAILED_ACTION = '[signup action] failed signup';
export const LOGIN_CONFIRMED_ACTION = '[login action] confirmed login';
export const LOGIN_FAILED_ACTION = '[login action] failed login';
export const LOADING_TOGGLE_ACTION = '[Loading action] toggle loading';
export const LOGOUT_ACTION = '[Logout action] logout action';

export function signupAction(username, password, history) {
    return (dispatch) => {
        signUp(username, password)
        .then((response) => {
            saveTokenInLocalStorage(response.data);
            runLogoutTimer(
                dispatch,
                response.data.expiresIn * 1000,
                history,
            );
            dispatch(confirmedSignupAction(response.data));
            history.push('/dashboard');
        })
        .catch((error) => {
            const errorMessage = formatError(error.response.data);
            dispatch(signupFailedAction(errorMessage));
        });
    };
}

export function logout(history) {
    localStorage.removeItem('userDetails');
    history.push('/page-login');
    return {
        type: LOGOUT_ACTION,
    };
}

// export function loginAction(username, password, history) {
//     return (dispatch) => {
//         login(username, password)
//             .then(async(response) => {
//                 console.log('response: ', response);
                

//                 let loginObj = {
//                     username,password
//                 }
          

//                await axios({
//                    url:config.baseUrl+"managerLogin",
//                    method:"POST",
//                    data:loginObj
//             }).then((response)=>{
//                      if(response.data.status==200){
//                          console.log('response.data: ', response.data);

//                         // window.sessionStorage.setItem("clientadminlogin",JSON.stringify( {'token':response.data.data.token, 'id':response.data.data.id, 'client':response.data.data.client, isLogin:true }));
//                         window.sessionStorage.setItem("isAdminLogin",true);
//                         window.sessionStorage.setItem("token",response.data.data.token);
//                         window.sessionStorage.setItem("id",response.data.data.id);
//                         window.sessionStorage.setItem("accessLevel", response.data.data.accessLevel);
//                         // window.sessionStorage.setItem("ClientName",response.data.data.client);
//                         // window.sessionStorage.setItem("ClientImgUrl",response.data.data.clientImgUrl);

//                         // dispatch(loginConfirmedAction(response.data));
                      
//                         // runLogoutTimer(
//                         //     dispatch,
//                         //     3600*1000,
//                         //     history,
//                         // );
//                         history.push('/dashboard'); 


//                     }else{
//                         alert("Check user name and password")
//                     }
//                 })

               
                  

                
               
                
//             })
//             .catch((error) => {
// 				// console.log(error);
              
//                 // const errorMessage = formatError(error.response.data);
//                 // dispatch(loginFailedAction(errorMessage));

               
//             });
//     };
// }

export function loginFailedAction(data) {
    return {
        type: LOGIN_FAILED_ACTION,
        payload: data,
    };
}

export function loginConfirmedAction(data) {
    return {
        type: LOGIN_CONFIRMED_ACTION,
        payload: data,
    };
}

export function confirmedSignupAction(payload) {
    return {
        type: SIGNUP_CONFIRMED_ACTION,
        payload,
    };
}

export function signupFailedAction(message) {
    return {
        type: SIGNUP_FAILED_ACTION,
        payload: message,
    };
}

export function loadingToggleAction(status) {
    return {
        type: LOADING_TOGGLE_ACTION,
        payload: status,
    };
}
   
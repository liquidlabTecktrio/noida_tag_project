import axios from 'axios';
import swal from "sweetalert";
import React, {useState, useEffect} from 'react'


import {
    loginConfirmedAction,
    logout,
} from '../store/actions/AuthActions';
import config from './config';

export function signUp(email, password) {
    //axios call
    const postData = {
        email,
        password,
        returnSecureToken: true,
    };
    return axios.post(
        // `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD3RPAp3nuETDn9OQimqn_YF6zdzqWITII`,
        config.baseUrl+"login",
        postData,
    );
}

export function login(username, password) {
    const postData = {
        username,
        password,
        // returnSecureToken: true,
    };
    return axios({
        url:config.baseUrl+"adminLogin",
        method:'POST',
       data: postData,}
    );
}

export function formatError(errorResponse) {
    switch (errorResponse.error.message) {
        case 'EMAIL_EXISTS':
            //return 'Email already exists';
            swal("Oops", "Email already exists", "error");
            break;
        case 'EMAIL_NOT_FOUND':
            //return 'Email not found';
           swal("Oops", "Email not found", "error",{ button: "Try Again!",});
           break;
        case 'INVALID_PASSWORD':
            //return 'Invalid Password';
            swal("Oops", "Invalid Password", "error",{ button: "Try Again!",});
            break;
        case 'USER_DISABLED':
            return 'User Disabled';

        default:
            return '';
    }
}

export function saveTokenInLocalStorage(tokenDetails) {
    tokenDetails.expireDate = new Date(
        new Date().getTime() + tokenDetails.expiresIn * 1000,
    );
    localStorage.setItem('userDetails', JSON.stringify(tokenDetails));
}

export function runLogoutTimer(dispatch, timer, history) {
    setTimeout(() => {
        sessionStorage.removeItem('isLogin')
        dispatch(logout(history));
    }, timer);
}

// export function checkAutoLogin(dispatch, history) {
//     const tokenDetailsString = localStorage.getItem('userDetails');
//     let tokenDetails = '';
//     if (!tokenDetailsString) {
//         dispatch(logout(history));
//         return;
//     }

//     tokenDetails = JSON.parse(tokenDetailsString);
//     let expireDate = new Date(tokenDetails.expireDate);
//     let todaysDate = new Date();

//     if (todaysDate > expireDate) {
//         dispatch(logout(history));
//         return;
//     }
//     dispatch(loginConfirmedAction(tokenDetails));
//     console.log('tokenDetails: ', tokenDetails);

//     const timer = expireDate.getTime() - todaysDate.getTime();
//     // runLogoutTimer(dispatch, timer, history);
// }


//created by praveen

export function checkAutoLogin(dispatch, history){
    const tokenDetailsString = sessionStorage.getItem("isAdminLogin");
    // const tokenDetailsString = JSON.parse(sessionStorage.getItem("clientadminlogin"));
    console.log('tokenDetailsString: ', tokenDetailsString);
    if (!tokenDetailsString) {
                dispatch(logout(history));
                return;
            }
           let tokenDetails=''
            dispatch(loginConfirmedAction(tokenDetails));
            let timer=1000;
            // runLogoutTimer(dispatch, timer, history);

}










//Api for get Contact us
// export function getAllContacts() {
//     return axios.get(
//         `http://localhost:8000/admin/getAllContacts`,
      
//     );
// }


// export function getContactUs(){
//   const url = 'http://localhost:8000/admin/getAllContacts'
// //   const [result, setResult] = useState(null)

//   var tableData=[];
//   useEffect(() => {
//     axios.get(url)
//     .then((response)=>{
//     //   setResult(response.data)
//       tableData=response.data;
//       // axios returns API response body in .data
//     })
//   }, []) // second param [] is a list of dependency to watch and run useEffect

//   return tableData;
    
// }

// export default function Parent() {

//     const [notes, getNotes] = useState('');
    
//     const url = 'http://localhost:8000/admin/getAllContacts';
//     var allNotes;
//     const getAllNotes = () => {
//     axios.get(`${url}`)
//     .then( (response) => {
//         console.log("response.data",response.data)
//      allNotes = response.data;
//     }).catch(error => console.error(`Error:${error}`));
// }
//     return allNotes

// }

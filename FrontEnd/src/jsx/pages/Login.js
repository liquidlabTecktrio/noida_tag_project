import React, { useState } from 'react'
import { connect, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom'
import {
	loadingToggleAction, loginAction,
} from '../../store/actions/AuthActions';
import axios from 'axios';
import config from '../../services/config';
import { useHistory } from 'react-router-dom';
import parkoLogo from "../../images/DesignaLogo.png";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Login(props) {
	//   const [email, setEmail] = useState('demo@example.com');
	const [email, setEmail] = useState("");
	let errorsObj = { email: '', password: '' };
	const [errors, setErrors] = useState(errorsObj);
	// const [password, setPassword] = useState('123456');
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false)
	const history = useHistory();

	const dispatch = useDispatch();

	function onLogin(e) {
		e.preventDefault();
		let error = false;
		const errorObj = { ...errorsObj };
		if (email === '') {
			errorObj.email = 'Email is Required';
			error = true;
		}
		if (password === '') {
			errorObj.password = 'Password is Required';
			error = true;
		}
		setErrors(errorObj);
		if (error) {
			return;

		}
		const loginObj = {

			username: email,
			password: password

		}
		LoginApi(loginObj)

	}

	// dispatch(loginAction(email, password, props.history));
	const createToast = (data) => toast(`${data}`)
	function LoginApi(loginObj) {

		setLoading(true)
		axios({
			url: config.baseUrl + "adminLogin",
			method: "POST",
			"Content-Type": "application/json",
			headers: {
				token: sessionStorage.getItem("token"),
			},
			data: loginObj,
		})
			.then((res) => {

				console.log("res", res.status)
				if (res.status === 200) {
					createToast(res.data.message)
					console.log('response.data: ', res.data);
					window.sessionStorage.setItem("isAdminLogin", true);
					window.sessionStorage.setItem("token", res.data.data.token??'');
					window.sessionStorage.setItem("_id", res.data.data.id??'');
					// window.sessionStorage.setItem("orgId", res.data.data.organisationId??'');
					// window.sessionStorage.setItem("clientId",res.data.data.clientId??'')
					// window.sessionStorage.setItem("clientName",res.data.data.clientName??'')
					// window.sessionStorage.setItem("projectId",res.data.data.projectId??'')
					// window.sessionStorage.setItem("projectName",res.data.data.projectName??'')
					// window.sessionStorage.setItem("parkingAccess", JSON.stringify(res.data.data.parkingAccess??''));
					// window.sessionStorage.setItem("accessLevel", res.data.data.accessLevel);
					// var accessLevel =  window.sessionStorage.getItem("accessLevel", res.data.data.accessLevel);
					// console.log("accessLevel",accessLevel)
					setLoading(false)
					// if(accessLevel == 5){
						
					// 	history.push('/app-ParkingReports');
					// }else{
						history.push('/dashBoard');

					// }
					




					// window.location.reload()
				}
				if (res.status === 201) {
				console.log("loginAPI", res.data.message);
				createToast(res.data.message)

				}
				if (res.status === 404) {

					console.log("loginAPI", res.data.message);



				}
				// else{
				
					createToast(res.data.message)
				// }


				setLoading(false)
			})
			.catch((err) => {
			
				// if (err.response?.data.status == 401) {
					// alert("you are unauthorized.. please login to continue");
					createToast(err.response?.data.message)

				// }
				setLoading(false)
			});
	}

	return (
		<>
	

			<div className="authincation h-100 py-5 ">
				
				<div className="container h-100 mt-5 ">
				
					<div className="row d-flex justify-content-center h-100 align-items-center">
					<ToastContainer/>
					
						<div className="col-md-6 ">
							<div className="authincation-content">
								<div className="row no-gutters">
									<div className="col-xl-12">
								
										<div className="auth-form">
											<div className="text-center mb-3">
											
												<Link to={"#"}>
													<img src={parkoLogo} height="100" alt="" />
										
												</Link>
											</div>
											<h4 className="text-center mb-4">WAVE RFID Access Control System</h4>
											<h6 className="text-center mb-4">Sign into your account</h6>
											{props.errorMessage && (
												<div className='bg-red-300 text-red-900 border border-red-900 p-1 my-2'>
													{props.errorMessage}
												</div>
											)}
											{props.successMessage && (
												<div className='bg-green-300 text-green-900 border border-green-900 p-1 my-2'>
													{props.successMessage}
												</div>
											)}
											<form onSubmit={onLogin}>
												<div className="mb-3">
													<label className="mb-1"><strong>User Name</strong></label>
													<input type="text" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)}
														placeholder="Type Your User Name"
													/>
													{errors.email && <div className="text-danger fs-12">{errors.email}</div>}
												</div>
												<div className="mb-3">
													<label className="mb-1"><strong>Password</strong></label>
													<input type="password" className="form-control" value={password}
														placeholder="Type Your Password"
														onChange={(e) =>
															setPassword(e.target.value)
														}
													/>
													{errors.password && <div className="text-danger fs-12">{errors.password}</div>}
												</div>
												{/* <div className="form-row d-flex justify-content-between mt-4 mb-2">
													<div className="mb-3">
													   <div className="form-check custom-checkbox ms-0">
															<input type="checkbox" className="form-check-input" id="basic_checkbox_1" />
															<label className="form-check-label" htmlFor="basic_checkbox_1">Remember my preference</label>
														</div>
													</div>													
												</div> */}
												{/* {error && (
													// Show the error message if it exists
													<div className="alert alert-danger" role="alert">
														{error}
													</div>
												)} */}
												<div className="text-center">
													<button
														type="submit"
														className="btn btn-primary btn-block"
														disabled={loading} // Disable the button when loading is true
													>
														{loading ? (
															// Show the small rounding loader while the response is being processed
															<div className="spinner-border text-light" role="status">
																<span className="visually-hidden">Loading...</span>
															</div>
														) : (
															// Show the "Sign In" text when not loading
															"Sign In"
														)}
													</button>
												</div>
											</form>
											{/* <div className="new-account mt-3">
												<p className="mb-0 mb-sm-3">Don't have an account? <Link to={"./page-register"} className="text-primary">Sign up</Link></p>
											</div> */}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

		</>
	);
};

const mapStateToProps = (state) => {
	return {
		errorMessage: state.auth.errorMessage,
		successMessage: state.auth.successMessage,
		showLoading: state.auth.showLoading,
	};
};
export default connect(mapStateToProps)(Login);

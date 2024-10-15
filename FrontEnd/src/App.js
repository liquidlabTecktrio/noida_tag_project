import { lazy, Suspense, useEffect, useState } from 'react';

/// Components
import Index from "./jsx";
import { connect, useDispatch } from 'react-redux';
import { Route, Switch, withRouter } from 'react-router-dom';
// action
import { checkAutoLogin } from './services/AuthService';
import { isAuthenticated } from './store/selectors/AuthSelectors';
/// Style
import "./vendor/bootstrap-select/dist/css/bootstrap-select.min.css";
import "./css/style.css";
import 'font-awesome/css/font-awesome.min.css';
import { logout } from './store/actions/AuthActions';



const Login = lazy(() => import('./jsx/pages/Login'));
// const TimeSheetApprove = lazy(() => import('./jsx/components/table/ManageStaff/TimeSheetApprove'));
// const Login = lazy(() => {
//     return new Promise(resolve => {
//     setTimeout(() => resolve(import('./jsx/pages/Login')), 500);
//   });
// });

let path = window.location.pathname;
// path = path.split("?")[0];
// path = path[path.length - 1];
console.log('path: ', path);

let isTimeSheetApprovePage = path.includes("page-timeSheet");
console.log('isTimeSheetApprovePage: ', isTimeSheetApprovePage);
// let isTimeSheetApprovePage = path.split("-").includes("timeSheet");

function App(props) {
    const dispatch = useDispatch();
    useEffect(() => {


        if (!isTimeSheetApprovePage) {
            checkAutoLogin(dispatch, props.history);
        }
        // handleToggle();
    }, [dispatch, props.history]);


    let routes = (
        <Switch>
            <Route path='/page-login' exact component={Login} />
            {/* <Route path='/TimeSheetApprove' exact component={TimeSheetApprove} /> */}

        </Switch>
    );


    // console.log('props.isAuthenticated: ', props.isAuthenticated);
    if (!props.isAuthenticated) {
        return (
            console.log("contion"),
            <>
                <Suspense fallback={
                    <div id="preloader">
                        <div className="sk-three-bounce">
                            <div className="sk-child sk-bounce1"></div>
                            <div className="sk-child sk-bounce2"></div>
                            <div className="sk-child sk-bounce3"></div>
                        </div>
                    </div>
                }
                >
                    <Index />

                </Suspense>
            </>
        );

    } else {

        // console.log("rotes");
        return (
            <div className="vh-100">
                <Suspense fallback={
                    <div id="preloader">
                        <div className="sk-three-bounce">
                            <div className="sk-child sk-bounce1"></div>
                            <div className="sk-child sk-bounce2"></div>
                            <div className="sk-child sk-bounce3"></div>
                        </div>
                    </div>
                }
                >

                    {routes}
                </Suspense>
            </div>
        );
    }
};

const mapStateToProps = (state) => {
    console.log('state: ', state);
    return {

        // isAuthenticated: isAuthenticated(state),
    };
};

// export default withRouter(connect(mapStateToProps)(App)); 
export default withRouter((App));



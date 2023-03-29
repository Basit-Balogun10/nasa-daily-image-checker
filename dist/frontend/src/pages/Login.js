"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const axios_1 = __importDefault(require("axios"));
const react_toastify_1 = require("react-toastify");
const fa_1 = require("react-icons/fa");
const react_router_dom_1 = require("react-router-dom");
const GoogleButton_1 = __importDefault(require("../components/GoogleButton"));
const UserContext_1 = __importDefault(require("../contexts/UserContext"));
const Login = () => {
    const [formData, setFormData] = (0, react_1.useState)({
        email: "",
        password: "",
    });
    const { user, handleUserChange } = (0, react_1.useContext)(UserContext_1.default);
    const navigate = (0, react_router_dom_1.useNavigate)();
    let [searchParams, setSearchParams] = (0, react_router_dom_1.useSearchParams)();
    const { email, password } = formData;
    (0, react_1.useEffect)(() => {
        if (user) {
            console.log(searchParams, 'params');
            navigate("/");
        }
        else {
            if (searchParams.get("error")) {
                const errorMsg = "Google authentication failed: " +
                    JSON.parse(searchParams.get("error")).message;
                react_toastify_1.toast.error(errorMsg, {
                    position: react_toastify_1.toast.POSITION.BOTTOM_CENTER,
                });
            }
        }
    }, [user, navigate, searchParams]);
    const onChange = (e) => {
        setFormData((prevState) => (Object.assign(Object.assign({}, prevState), { [e.target.name]: e.target.value })));
    };
    const onSubmit = (e) => {
        e.preventDefault();
        const userData = {
            email,
            password,
        };
        axios_1.default
            .post("/api/v1/auth/login", userData)
            .then((res) => {
            console.log("logging");
            react_toastify_1.toast.success("Logged in successfully", {
                position: react_toastify_1.toast.POSITION.TOP_LEFT,
            });
            handleUserChange(res.data);
        })
            .catch((err) => {
            console.log("logging2");
            react_toastify_1.toast.error(err.response.data.message, {
                position: react_toastify_1.toast.POSITION.BOTTOM_CENTER,
            });
        });
    };
    const googleLoginHandler = () => {
        axios_1.default
            .get("/api/v1/auth/google?obtainAuthUrl=true")
            .then((res) => {
            window.location.href = res.data["googleAuthUrl"];
        })
            .catch((err) => {
            react_toastify_1.toast.error(err.response.data.message, {
                position: react_toastify_1.toast.POSITION.BOTTOM_CENTER,
            });
        });
    };
    return (<>
            <section className="heading">
                <h1 id="login">
                    <fa_1.FaSignInAlt /> Login
                </h1>
                {/* <p>Please login to see today's image</p> */}
                <div className="google-btn-container">
                    <GoogleButton_1.default buttonText="Sign in with Google" onClickHandler={googleLoginHandler}/>
                </div>
            </section>

            <section className="form">
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <input type="email" className="form-control" id="email" name="email" value={email} placeholder="Enter your email" onChange={onChange}/>
                    </div>
                    <div className="form-group">
                        <input type="password" className="form-control" id="password" name="password" value={password} placeholder="Enter password" onChange={onChange}/>
                    </div>

                    <div className="form-group">
                        <button type="submit" className="btn btn-block">
                            Submit
                        </button>
                    </div>
                </form>
            </section>
        </>);
};
exports.default = Login;

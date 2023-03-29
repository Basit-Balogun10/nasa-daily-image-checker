"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const axios_1 = __importDefault(require("axios"));
const react_toastify_1 = require("react-toastify");
const fa_1 = require("react-icons/fa");
const react_router_dom_1 = require("react-router-dom");
const UserContext_1 = __importDefault(require("../contexts/UserContext"));
function Header() {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const { user, handleUserChange } = (0, react_1.useContext)(UserContext_1.default);
    const onLogout = () => {
        axios_1.default
            .get("/api/v1/auth/logout")
            .then((res) => {
            handleUserChange(null);
        })
            .catch((err) => {
            react_toastify_1.toast.error(err.response.data.message, {
                position: react_toastify_1.toast.POSITION.BOTTOM_CENTER,
            });
        });
        navigate("/login");
    };
    return (<header className="header">
            <div className="logo">
                <react_router_dom_1.Link to="/">NASA Daily Image</react_router_dom_1.Link>
            </div>
            <ul>
                {user ? (<li>
                        <button className="btn" onClick={onLogout}>
                            <fa_1.FaSignOutAlt /> Logout
                        </button>
                    </li>) : (<>
                        <li>
                            <react_router_dom_1.Link to="/login">
                                <fa_1.FaSignInAlt /> Login
                            </react_router_dom_1.Link>
                        </li>
                        <li>
                            <react_router_dom_1.Link to="/register">
                                <fa_1.FaUser /> Register
                            </react_router_dom_1.Link>
                        </li>
                    </>)}
            </ul>
        </header>);
}
exports.default = Header;

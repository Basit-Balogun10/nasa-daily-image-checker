import { useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../contexts/UserContext";
import type { User } from "../contexts/UserContext";

function Header() {
    const navigate = useNavigate();
    const { user, handleUserChange } = useContext(UserContext);

    const onLogout = () => {
        axios
            .get("/api/v1/auth/logout")
            .then((res) => {
                handleUserChange(null);
            })
            .catch((err) => {
                toast.error(err.response.data.message, {
                    position: toast.POSITION.BOTTOM_CENTER,
                });
            });

        navigate("/login");
    };

    return (
        <header className="header">
            <div className="logo">
                <Link to="/">NASA Daily Image</Link>
            </div>
            <ul>
                {user ? (
                    <li>
                        <button className="btn" onClick={onLogout}>
                            <FaSignOutAlt /> Logout
                        </button>
                    </li>
                ) : (
                    <>
                        <li>
                            <Link to="/login">
                                <FaSignInAlt /> Login
                            </Link>
                        </li>
                        <li>
                            <Link to="/register">
                                <FaUser /> Register
                            </Link>
                        </li>
                    </>
                )}
            </ul>
        </header>
    );
}

export default Header;

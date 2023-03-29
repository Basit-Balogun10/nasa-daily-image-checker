import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaSignInAlt } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import GoogleButton from "../components/GoogleButton";
import UserContext from "../contexts/UserContext";

interface formDataType {
    email: string;
    password: string;
}

const Login = () => {
    const [formData, setFormData] = useState<formDataType>({
        email: "",
        password: "",
    });

    const { user, handleUserChange } = useContext(UserContext);
    const navigate = useNavigate();
    let [searchParams, setSearchParams] = useSearchParams();

    const { email, password } = formData;

    useEffect(() => {
        if (user) {
            console.log(searchParams, 'params')
            navigate("/");
        } else {
            if (searchParams.get("error")) {
                const errorMsg =
                    "Google authentication failed: " +
                    JSON.parse(searchParams.get("error")!).message;
                toast.error(errorMsg, {
                    position: toast.POSITION.BOTTOM_CENTER,
                });
            }
        }
    }, [user, navigate, searchParams]);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const userData = {
            email,
            password,
        };

        axios
            .post("/api/v1/auth/login", userData)
            .then((res) => {
                console.log("logging");
                toast.success("Logged in successfully", {
                    position: toast.POSITION.TOP_LEFT,
                });
                handleUserChange(res.data);
            })
            .catch((err) => {
                console.log("logging2");
                toast.error(err.response.data.message, {
                    position: toast.POSITION.BOTTOM_CENTER,
                });
            });
    };

    const googleLoginHandler = () => {
        axios
            .get("/api/v1/auth/google?obtainAuthUrl=true")
            .then((res) => {
                window.location.href = res.data["googleAuthUrl"]
            })
            .catch((err) => {
                toast.error(err.response.data.message, {
                    position: toast.POSITION.BOTTOM_CENTER,
                });
            });
    };

    return (
        <>
            <section className="heading">
                <h1>
                    <span><FaSignInAlt /></span> <span>Please login to see today's image</span>
                </h1>
                <div className="google-btn-container">
                    <GoogleButton
                        buttonText="Sign in with Google"
                        onClickHandler={googleLoginHandler}
                    />
                    <p>OR</p>
                </div>
            </section>

            <section className="form">
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={email}
                            placeholder="Enter your email"
                            onChange={onChange}
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            value={password}
                            placeholder="Enter password"
                            onChange={onChange}
                        />
                    </div>

                    <div className="form-group">
                        <button type="submit" className="btn btn-block">
                            Submit
                        </button>
                    </div>
                </form>
            </section>
        </>
    );
};

export default Login;

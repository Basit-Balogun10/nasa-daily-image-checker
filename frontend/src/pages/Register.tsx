import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import UserContext from "../contexts/UserContext";
import { capitalizeString } from "../utils";
import GoogleButton from "../components/GoogleButton";

interface formDataType {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    password2: string;
}

const Register = () => {
    const [formData, setFormData] = useState<formDataType>({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        password2: "",
    });

    const { user, handleUserChange } = useContext(UserContext);
    const navigate = useNavigate();
    let [searchParams, setSearchParams] = useSearchParams();

    const { firstName, lastName, email, password, password2 } = formData;

    useEffect(() => {
        if (user) {
            console.log(searchParams, "params");
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
        let userData;

        if (password !== password2) {
            toast.error("Passwords do not match", {
                    position: toast.POSITION.BOTTOM_CENTER,
                });
        } else {
            userData = {
                firstName: capitalizeString(firstName),
                lastName: capitalizeString(lastName),
                email,
                password,
            };
        }

        axios
            .post("/api/v1/auth/signup", userData)
            .then((res) => {
                toast.success("Account created successfully", {
                    position: toast.POSITION.TOP_LEFT,
                });
                handleUserChange(res.data);
            })
            .catch((err) => {
                toast.error(err.response.data.message, {
                    position: toast.POSITION.BOTTOM_CENTER,
                });
            });
    };

    const googleSignupHandler = () => {
        axios
            .get("/api/v1/auth/google?obtainAuthUrl=true?isSignup=true")
            .then((res) => {
                window.location.href = res.data["googleAuthUrl"];
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
                    <span>
                        <FaUser />
                    </span>{" "}
                    <span>Please sign up to see today's image</span>
                </h1>
                <div className="google-btn-container">
                    <GoogleButton
                        buttonText="Sign up with Google"
                        onClickHandler={googleSignupHandler}
                    />
                    <p>OR</p>
                </div>
            </section>

            <section className="form">
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            id="first_name"
                            name="firstName"
                            value={firstName}
                            placeholder="Enter your first name"
                            onChange={onChange}
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            id="last_name"
                            name="lastName"
                            value={lastName}
                            placeholder="Enter your last name"
                            onChange={onChange}
                        />
                    </div>
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
                        <input
                            type="password"
                            className="form-control"
                            id="password2"
                            name="password2"
                            value={password2}
                            placeholder="Confirm password"
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

export default Register;

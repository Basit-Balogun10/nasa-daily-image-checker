import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import UserContext from "../contexts/UserContext";

interface imageDataType {
    copyright: string;
    date: string;
    explanation: string;
    hdUrl: string;
    mediaType: string;
    serviceVersion: string;
    title: string;
    url: string;
}

const Home = () => {
    const [todayImageData, setTodayImageData] = useState<imageDataType | null>(
        null
    );
    const { user, handleUserChange } = useContext(UserContext);
    const navigate = useNavigate();
    let [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        console.log("my user", user);
        if (!user) {
            if (searchParams.get("user")) {
                handleUserChange(JSON.parse(atob(searchParams.get("user")!)).user);
            } else {
                navigate("/login");
            }
        }

        axios
            .get("/api/v1/today-image")
            .then((res) => {
                console.log('res data', res);
                setTodayImageData(res.data);
            })
            .catch((err) => {
                toast.error(err.response.data.message, {
                    position: toast.POSITION.BOTTOM_CENTER,
                });
            });
    }, [setTodayImageData, navigate, user, handleUserChange, searchParams]);

    return (
        <>
            <section className="heading">
                <h1 id="greeting">
                    Welcome, {user?.firstName} {user?.lastName}
                </h1>
                <p className="nasa-image-info">
                    Image of the day: {todayImageData?.date}
                </p>
                <p className="nasa-image-info">
                    {todayImageData?.title} &copy; {todayImageData?.copyright}{" "}
                </p>

                <img
                    id="nasa-image"
                    src={todayImageData?.url}
                    alt={todayImageData?.title}
                />
                <p id="nasa-image-explanation">{todayImageData?.explanation}</p>
            </section>
        </>
    );
};

export default Home;

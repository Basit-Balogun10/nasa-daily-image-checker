"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const axios_1 = __importDefault(require("axios"));
const react_toastify_1 = require("react-toastify");
const react_router_dom_1 = require("react-router-dom");
const UserContext_1 = __importDefault(require("../contexts/UserContext"));
const Home = () => {
    const [todayImageData, setTodayImageData] = (0, react_1.useState)(null);
    const { user, handleUserChange } = (0, react_1.useContext)(UserContext_1.default);
    const navigate = (0, react_router_dom_1.useNavigate)();
    let [searchParams, setSearchParams] = (0, react_router_dom_1.useSearchParams)();
    (0, react_1.useEffect)(() => {
        console.log("my user", user);
        if (!user) {
            if (searchParams.get("user")) {
                handleUserChange(JSON.parse(searchParams.get("user")).user);
            }
            else {
                navigate("/login");
            }
        }
        axios_1.default
            .get("/api/v1/today-image")
            .then((res) => {
            console.log('res data', res);
            setTodayImageData(res.data);
        })
            .catch((err) => {
            react_toastify_1.toast.error(err.response.data.message, {
                position: react_toastify_1.toast.POSITION.BOTTOM_CENTER,
            });
        });
    }, [setTodayImageData, navigate, user, handleUserChange, searchParams]);
    return (<>
            <section className="heading">
                <h1 id="greeting">
                    Welcome, {user === null || user === void 0 ? void 0 : user.firstName} {user === null || user === void 0 ? void 0 : user.lastName}
                </h1>
                <p className="nasa-image-info">
                    Image of the day: {todayImageData === null || todayImageData === void 0 ? void 0 : todayImageData.date}
                </p>
                <p className="nasa-image-info">
                    {todayImageData === null || todayImageData === void 0 ? void 0 : todayImageData.title} &copy; {todayImageData === null || todayImageData === void 0 ? void 0 : todayImageData.copyright}{" "}
                </p>

                <img id="nasa-image" src={todayImageData === null || todayImageData === void 0 ? void 0 : todayImageData.url} alt={todayImageData === null || todayImageData === void 0 ? void 0 : todayImageData.title}/>
                <p id="nasa-image-explanation">{todayImageData === null || todayImageData === void 0 ? void 0 : todayImageData.explanation}</p>
            </section>
        </>);
};
exports.default = Home;

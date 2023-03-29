"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const react_toastify_1 = require("react-toastify");
require("react-toastify/dist/ReactToastify.css");
const Header_1 = __importDefault(require("./components/Header"));
const Home_1 = __importDefault(require("./pages/Home"));
const Login_1 = __importDefault(require("./pages/Login"));
const Register_1 = __importDefault(require("./pages/Register"));
const UserContext_1 = require("./contexts/UserContext");
function App() {
    const [user, setUser] = (0, react_1.useState)(null);
    const handleUserChange = (user) => {
        localStorage.setItem("NDIC-user", JSON.stringify(user));
        setUser(user);
    };
    (0, react_1.useEffect)(() => {
        if (localStorage.getItem("NDIC-user")) {
            setUser(JSON.parse(localStorage.getItem("NDIC-user")));
        }
    }, []);
    return (<UserContext_1.UserProvider value={{ user, handleUserChange }}>
          <react_router_dom_1.BrowserRouter>
              <div className="container">
                  <Header_1.default />
                  <react_router_dom_1.Routes>
                      <react_router_dom_1.Route path="/" element={<Home_1.default />}/>
                      <react_router_dom_1.Route path="/login" element={<Login_1.default />}/>
                      <react_router_dom_1.Route path="/register" element={<Register_1.default />}/>
                  </react_router_dom_1.Routes>
              </div>
          </react_router_dom_1.BrowserRouter>
          <react_toastify_1.ToastContainer />
      </UserContext_1.UserProvider>);
}
exports.default = App;

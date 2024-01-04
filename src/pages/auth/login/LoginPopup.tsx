import Header from "../../../components/layout/header/Header";
import metamask from "../../../assets/auth/metamask.svg";
import "./loginPopup.scss";
import cancelIcon from "../../../assets/auth/cancel.svg";
import { Link } from "react-router-dom";

const LoginPopup = () => {
  return (
    <Header>
      <div className="login">
        <div className="popup">
          <Link to="/register">
            <img className="close-btn" src={cancelIcon} alt="" />
          </Link>
          <h3>Select your wallet</h3>
          <button className="btn">
            <img src={metamask} alt="" />
            <span>MetaMask</span>
          </button>
        </div>
      </div>
    </Header>
  );
};

export default LoginPopup;

import Header from "../../../components/layout/header/Header";
import metamask from "../../../assets/auth/metamask.svg";
import "./loginPopup.scss";
import cancelIcon from "../../../assets/auth/cancel.svg";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import {
  useConnect,
  useAccount,
  useSignMessage,
  useChainId,
  ConnectorAlreadyConnectedError,
} from "wagmi";
import { useLoading } from "../../../store/useLoading";
import { useAuthStore } from "../../../store/useAuthStore";
import Loading from "../../../utils/Loading";
import { createSiweMessage } from "../../../utils";

const LoginPopup = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { connectors, isLoading: connectLoading, connectAsync } = useConnect();
  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  const { signMessageAsync, isLoading: signLoading } = useSignMessage();

  const [clickConnectFlag, setClickConnectFlag] = useState(false);

  const { isLoading, setLoading } = useLoading();
  const { loginAsync, refreshNounce } = useAuthStore();

  console.log("loading", isLoading);

  useEffect(() => {
    setLoading(connectLoading || signLoading);
  }, [connectLoading, signLoading, setLoading]);

  useEffect(() => {
    if (isConnected && address && clickConnectFlag) {
      const signAndLogin = async () => {
        // get nonce
        let nonce: string = "";
        try {
          nonce = await refreshNounce(address);
        } catch (error) {
          setClickConnectFlag(false);
          return;
        }
        // sign message
        try {
          const msg = createSiweMessage(
            address,
            chainId,
            nonce,
            "Welcom Quick Accounting"
          );
          const signResult = await signMessageAsync({ message: msg });
          await loginAsync(
            {
              domain: window.location.origin,
              message: msg,
              signature: signResult,
              wallet: address,
            },
            navigate
          );
        } catch (error) {
          setClickConnectFlag(false);
        }
      };
      signAndLogin();
    }
  }, [isConnected, address, clickConnectFlag]);

  const onClickConnect = async () => {
    const connector = connectors[0];
    if (!connector.ready) {
      alert("Please install MetaMask");
      return;
    }
    try {
      // connect
      await connectAsync({ connector });
      setClickConnectFlag(true);
    } catch (error) {
      if (error instanceof ConnectorAlreadyConnectedError) {
        if (isConnected && address) {
          setClickConnectFlag(true);
        }
      }
    }
  };
  return (
    <Header>
      {isLoading && <Loading />}
      <div className="login">
        <div className="popup">
          <Link to="/">
            <img className="close-btn" src={cancelIcon} alt="" />
          </Link>
          <h3>{t("login.LoginTitle")}</h3>
          <button className="btn" onClick={onClickConnect}>
            <img src={metamask} alt="" />
            <span>{t("login.MetaMask")}</span>
          </button>
        </div>
      </div>
    </Header>
  );
};

export default LoginPopup;
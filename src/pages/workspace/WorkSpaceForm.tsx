import Header from "../../components/layout/header/Header";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useState } from "react";
import { InputLabel, TextField } from "@mui/material";
import {
  Button,
  CreateSafe,
  Safe,
  WorkspaceContainer,
  WorkspaceForm,
  ChainMenuItem,
  SelectBox,
  FormHeader,
} from "./WorkSpaceForm.style";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  getOwnedSafes,
  OwnedSafes,
} from "@safe-global/safe-gateway-typescript-sdk";
import useAsync from "../../hooks/useAsync";
import CHAINS from "../../utils/chain";
import { useWorkspace } from "../../store/useWorkspace";
import { useLoading } from "../../store/useLoading";
import Loading from "../../utils/Loading";
import { useAccount } from "wagmi";
import cancelBtn from "../../assets/auth/x.svg";

const WorkSpaceForm = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { createWorkspace } = useWorkspace();
  const { isLoading } = useLoading();
  const { address } = useAccount();

  const [safe, setSafe] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [selectChainId, setSelectChanId] = useState(CHAINS[0].chainId);

  const [data, error, loading] = useAsync<OwnedSafes>(
    () => {
      return getOwnedSafes(String(selectChainId), address!);
    },
    [selectChainId, address],
    false
  );
  console.log(data, error, loading);
  const safeList = loading ? [] : data?.safes || [];

  const handleChange = (event: SelectChangeEvent) => {
    setSafe(event.target.value);
  };

  const formData = {
    chain_id: selectChainId,
    name: workspaceName,
    vault_wallet: safe,
  };
  const handleCreateWorkspace = () => {
    createWorkspace(formData, navigate);
    console.log("Clicked");
  };

  const onSelectChain = (e: any) => {
    setSelectChanId(e.target.value);
  };
  console.log(formData);

  return (
    <>
      {isLoading && <Loading />}
      <WorkspaceContainer>
        <WorkspaceForm>
          <FormHeader>
            <div>
              <h3>{t("workspaceForm.FormTitle")}</h3>
              <img src={cancelBtn} alt="" onClick={() => navigate(-1)} />
            </div>
            <p>{t("workspaceForm.FormDescription")}</p>
          </FormHeader>
          <Safe className="safe">
            <InputLabel
              htmlFor="Workspace name"
              sx={{
                pb: 1,
                fontSize: "14px",
                fontWeight: "600",
                color: "var(--clr-primary-900)",
              }}
            >
              {t("workspaceForm.WorkspaceName")}
            </InputLabel>
            <TextField
              id="outlined-basic"
              variant="outlined"
              placeholder="Enter your workspace name"
              size="small"
              sx={{ minWidth: "100%" }}
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
            />
            <CreateSafe>
              <p>{t("workspaceForm.AddASafe")}</p>
              <a href="https://safe.global/" target="_blank" rel="noreferrer">
                {t("workspaceForm.CreateASafe")} &nbsp;&gt;
              </a>
            </CreateSafe>
            {/* select */}
            <SelectBox>
              <Select
                value={selectChainId}
                onChange={onSelectChain}
                size="small"
              >
                {CHAINS.map((item) => (
                  <MenuItem value={item.chainId} key={item.chainId}>
                    <ChainMenuItem>
                      <img src={item.logoPath} alt="" />
                      {item.chainName}
                    </ChainMenuItem>
                  </MenuItem>
                ))}
              </Select>
              <Select
                fullWidth
                size="small"
                value={safe}
                onChange={handleChange}
                sx={{ overflow: "hidden" }}
              >
                {safeList.map((item) => (
                  <MenuItem value={item} key={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </SelectBox>
            <Button
              onClick={handleCreateWorkspace}
              disabled={!workspaceName || !safe || !workspaceName.trim()}
            >
              {t("workspaceForm.FormSubmitBtn")}
            </Button>
          </Safe>
        </WorkspaceForm>
      </WorkspaceContainer>
    </>
  );
};

export default WorkSpaceForm;

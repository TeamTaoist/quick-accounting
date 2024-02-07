import { useParams } from "react-router-dom";
import Header from "../../../components/layout/header/Header";
import WorkspaceItemDetailsLayout from "../../../components/layout/WorkspaceItemDetailsLayout";
import { useEffect, useState } from "react";
import {
  FormControl,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";

import arrowBottom from "../../../assets/workspace/arrow-bottom.svg";
import multiSelect from "../../../assets/workspace/multi-select.svg";
import selectIcon from "../../../assets/workspace/select.svg";
import categoryIcon from "../../../assets/workspace/category-icon.svg";
import optionsIcon from "../../../assets/workspace/option.svg";
import linkIcon from "../../../assets/workspace/link-icon.svg";
import transferArrow from "../../../assets/workspace/transfer-arrow.svg";
import {
  DeleteIcon,
  Image,
  NoteInfo,
  NoteInformation,
  RequestSubmit,
} from "../../workspaceDashboard/newPaymentRequest/newPaymentRequest.style";
import styled from "@emotion/styled";
import ReactSelect from "../../../components/ReactSelect";
import data from "../../../data/tableData";
import usePaymentsStore from "../../../store/usePayments";
import { useLoading } from "../../../store/useLoading";
import CHAINS from "../../../utils/chain";
import { useWorkspace } from "../../../store/useWorkspace";
import { formatNumber } from "../../../utils/number";
import { getShortAddress } from "../../../utils";
import { useCategoryProperty } from "../../../store/useCategoryProperty";
interface PaymentRequestDetailsProps {
  setOpen: (open: boolean) => void;
}
export interface ReactSelectOption {
  value: string;
  label: string;
}
interface PropertyValues {
  name?: string;
  type?: string;
  values?: string;
}

const BookkeepingTransferDetails = ({ setOpen }: any) => {
  const { id } = useParams();

  const { workspace } = useWorkspace();
  const chainData = CHAINS.find(
    (chain) => chain.chainId === workspace?.chain_id
  );

  const { paymentRequestDetails, updatePaymentRequestCategory } =
    usePaymentsStore();
  const { workspaceCategoryProperties } = useCategoryProperty();
  const { isLoading } = useLoading();

  const [selectedValue, setSelectedValue] = useState("Option1");

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedValue(event.target.value);
  };

  // handle react select
  const [selectedValues, setSelectedValues] = useState<ReactSelectOption[]>([]);
  const [selectSingleValue, setSelectSingleValue] =
    useState<ReactSelectOption>();
  const [propertyValues, setPropertyValues] = useState<{
    [key: string]: PropertyValues;
  }>({});
  const [propertyMultiValues, setPropertyMultiValues] = useState<{
    [key: string]: PropertyValues;
  }>({});

  const handleSelectChange = (
    selectedOptions: ReactSelectOption[],
    name: string,
    type: string
  ) => {
    setSelectedValues(selectedOptions);
    console.log(selectedOptions, name, type);
    const v = selectedOptions?.map((p) => p.value);
    setPropertyMultiValues({
      ...propertyMultiValues,
      [name]: {
        name: name,
        type: type,
        values: selectedOptions.map((option) => option.value).join(";"),
      },
    });
  };

  const handleSelectSingleChange = (
    selectedOption: ReactSelectOption,
    name: string,
    type: string
  ) => {
    setSelectSingleValue(selectedOption);
    setPropertyValues({
      ...propertyValues,
      [name]: {
        name: name,
        type: type,
        values: selectedOption.value,
      },
    });
  };

  // property value input
  const [propertyContent, setPropertyContent] = useState<string>("");
  const [proPertyTextValue, setPropertyTextValue] = useState<{
    [name: string]: any;
  }>({});
  const handlePropertyText = (e: any, name: string, type: string) => {
    const value = e.target.value;
    setPropertyTextValue({
      ...proPertyTextValue,
      [name]: {
        ...proPertyTextValue[name],
        values: value,
      },
    });
  };

  const [age, setAge] = useState("Category");

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

  // const handleSelectChange = (selectedOptions: any) => {
  //   setSelectedValues(selectedOptions);
  // };

  // get the selected category list
  const [categoryProperties, setCategoryProperties] = useState<any>([]);

  const [selectedCategoryID, setSelectedCategoryID] = useState<number>(
    paymentRequestDetails?.category_id
  );
  const [selectedCategory, setSelectedCategory] = useState<any>({});
  useEffect(() => {
    setSelectedCategoryID(paymentRequestDetails.category_id);
  }, [setOpen]);
  useEffect(() => {
    const selectedCategory = workspaceCategoryProperties?.find(
      (f) => f?.ID === selectedCategoryID
    );
    setSelectedCategory(selectedCategory);
    if (selectedCategory) {
      setCategoryProperties(selectedCategory?.properties);
    }
  }, [selectedCategoryID, workspaceCategoryProperties]);

  console.log("selected category ", selectedCategory);
  const handleCategory = async (categoryId: number) => {
    setSelectedCategoryID(categoryId);
    setPropertyValues({});
    setPropertyMultiValues({});
    setPropertyTextValue({});
    setPropertyContent("");
  };
  // form data
  const updatedPaymentBody = {
    category_id: selectedCategory?.ID,
    category_name: selectedCategory?.name,
    category_properties: [
      ...Object.keys(propertyValues).map(
        (key) =>
          ({
            name: key as string,
            type: "single-select",
            values: propertyValues[key as keyof PropertyValues]?.values,
          } as ICategoryProperties)
      ),
      ...Object.keys(propertyMultiValues).map(
        (key) =>
          ({
            name: key as string,
            type: "multi-select",
            values: propertyMultiValues[key as keyof PropertyValues]?.values,
          } as ICategoryProperties)
      ),
      ...Object.keys(proPertyTextValue).map(
        (key) =>
          ({
            name: key,
            type: "Text",
            values: proPertyTextValue[key].values,
          } as ICategoryProperties)
      ),
    ],
  };
  let parseCategoryProperties: any;
  // if (paymentRequestDetails) {
  if (paymentRequestDetails.category_properties !== "") {
    const categoryProperties = paymentRequestDetails?.category_properties;
    if (categoryProperties) {
      parseCategoryProperties = JSON.parse(categoryProperties);
    }
  }
  useEffect(() => {
    const initialSelectSingleValue: { [name: string]: any } = {};
    const initialSelectedValues: { [name: string]: any } = {};
    const initialPropertyTextValue: { [name: string]: any } = {};
    const initialText: { [name: string]: any } = {};

    parseCategoryProperties.forEach((property: any) => {
      if (property.type === "single-select") {
        initialSelectSingleValue[property.name] = {
          name: property.name,
          type: property.type,
          values: property.values,
        };
        // initialSelectSingleValue[property.name] = property.values;
      } else if (property.type === "multi-select") {
        initialSelectedValues[property.name] = {
          name: property.name,
          type: property.type,
          values: property.values,
        };
      } else if (property.type === "Text") {
        initialPropertyTextValue[property.name] = {
          name: property.name,
          type: property.type,
          values: property.values,
        };
        // initialText[property.name] = property.values;
      }
    });

    // setPropertyTextValue(initialPropertyTextValue);
    setPropertyMultiValues(initialSelectedValues);
    setPropertyValues(initialSelectSingleValue);
    setPropertyTextValue(initialPropertyTextValue);
  }, []);

  useEffect(() => {
    const initialSelectedCategory = workspaceCategoryProperties?.find(
      (f) => f?.ID === selectedCategoryID
    );
    setSelectedCategory(initialSelectedCategory);
    if (initialSelectedCategory) {
      setCategoryProperties(initialSelectedCategory?.properties);
    }
  }, []);

  const handleUpdateCategory = async () => {
    await updatePaymentRequestCategory(
      id,
      paymentRequestDetails.ID.toString(),
      updatedPaymentBody
    );
  };
  console.log("body", updatedPaymentBody);

  if (isLoading) return <p></p>;

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZoneName: "short",
    };

    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
      date
    );
    return formattedDate + " +UTC";
  };
  return (
    // <Header>
    <WorkspaceItemDetailsLayout title="Transfer Detail" setOpen={setOpen}>
      <RequestDetails>
        <TransferTable>
          <TableContainer
            // component={Paper}
            // sx={{ boxShadow: "none", border: "1px solid var(--border)" }}
            sx={{ boxShadow: "none" }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Safe</TableCell>
                  <TableCell>Counterparty</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Currency</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* {data.slice(0, 1).map((row) => ( */}
                <TableRow>
                  <TableCell
                    sx={{
                      borderRight: "1px solid var(--border-table)",
                      borderLeft: "1px solid var(--border-table)",
                      borderBottom: "1px solid var(--border-table)",
                      // borderRadius: "7px",
                      padding: 0,
                      paddingLeft: "12px",
                    }}
                  >
                    <SafeSection>
                      <div>{getShortAddress(workspace.vault_wallet)}</div>
                      <Logo>
                        <img src={transferArrow} alt="" />
                      </Logo>
                    </SafeSection>
                  </TableCell>
                  <TableCell
                    sx={{
                      borderRight: "1px solid var(--border-table)",
                      borderBottom: "1px solid var(--border-table)",
                      // borderRadius: "7px",
                      padding: 0,
                      paddingLeft: "12px",
                    }}
                  >
                    {getShortAddress(paymentRequestDetails.recipient)}
                  </TableCell>
                  <TableCell
                    sx={{
                      borderRight: "1px solid var(--border-table)",
                      borderBottom: "1px solid var(--border-table)",
                      // borderRadius: "7px",
                      padding: 0,
                      paddingLeft: "12px",
                    }}
                  >
                    {formatNumber(Number(paymentRequestDetails.amount))}
                  </TableCell>
                  <TableCell
                    sx={{
                      borderBottom: "1px solid var(--border-table)",
                      borderRight: "1px solid var(--border-table)",
                      // borderRadius: "7px",
                      padding: 0,
                      paddingLeft: "12px",
                    }}
                  >
                    {paymentRequestDetails.currency_name}
                  </TableCell>
                </TableRow>
                {/* ))} */}
              </TableBody>
            </Table>
          </TableContainer>
        </TransferTable>
        {/* Transaction hash */}
        <TransactionHash>
          <h3>Transaction hash</h3>
          <div>
            <p>{paymentRequestDetails.tx_hash}</p>
            <a
              href={`${chainData?.explore}/tx/${paymentRequestDetails.tx_hash}`}
              target="_blank"
              rel="noreferrer"
            >
              <img src={linkIcon} alt="" />
            </a>
          </div>
        </TransactionHash>
        <TransactionHash>
          <h3>Transaction date</h3>
          <div>
            {/* <p>Oct-15-2023 01:04:34 PM +UTC</p> */}
            <p>{formatTimestamp(paymentRequestDetails.tx_timestamp)}</p>
          </div>
        </TransactionHash>
        {/* note info */}
        <NoteInformation>
          <h3>Note Information</h3>

          <TableContainer sx={{ borderRadius: "7px" }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableBody>
                <TableRow
                  sx={{
                    td: {
                      border: "1px solid var(--border-table)",
                      padding: 0,
                      paddingInline: 1,
                    },
                  }}
                >
                  <TableCell sx={{ height: 1, width: 200 }}>
                    <NoteInfo>
                      <Image src={categoryIcon} alt="" /> Category
                    </NoteInfo>
                  </TableCell>
                  <TableCell>
                    <FormControl
                      fullWidth
                      disabled={paymentRequestDetails.status === 2}
                    >
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={age}
                        label="Age"
                        size="small"
                        onChange={handleCategoryChange}
                        onBlur={handleUpdateCategory}
                        IconComponent={() => (
                          <InputAdornment position="start">
                            <img
                              src={arrowBottom}
                              alt="Custom Arrow Icon"
                              style={{ marginRight: "20px" }}
                            />
                          </InputAdornment>
                        )}
                        sx={{
                          minWidth: "100%",
                          "& fieldset": { border: "none" },
                        }}
                      >
                        <MenuItem disabled value="Category">
                          {/* {paymentRequestDetails.category_name} */}
                          {selectedCategory?.name}
                        </MenuItem>
                        {workspaceCategoryProperties.map((category) => (
                          <MenuItem
                            key={category.ID}
                            value={category.name}
                            // onBlur={handleUpdateCategory}
                            onClick={() => handleCategory(category.ID)}
                          >
                            {category.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                </TableRow>
                {selectedCategory.properties?.map((property: any) => (
                  <>
                    {property.type === "single-select" && (
                      <TableRow
                        sx={{
                          td: {
                            border: "1px solid var(--border-table)",
                            padding: 1,
                            paddingInline: 1,
                          },
                        }}
                      >
                        <TableCell sx={{ height: 1, width: 200 }}>
                          <NoteInfo>
                            <Image src={selectIcon} alt="" /> {property.name}
                          </NoteInfo>
                        </TableCell>
                        <TableCell onBlur={handleUpdateCategory}>
                          <ReactSelect
                            isMulti={false}
                            isDisabled={paymentRequestDetails.status === 2}
                            value={selectSingleValue}
                            onChange={(selectedOption: ReactSelectOption) =>
                              handleSelectSingleChange(
                                selectedOption,
                                property.name,
                                property.type
                              )
                            }
                            options={property.values
                              .split(";")
                              .map((v: string) => ({
                                value: v,
                                label: v,
                              }))}
                            defaultValues={parseCategoryProperties
                              .filter(
                                (p: any) =>
                                  p.type === "single-select" &&
                                  p.name === property.name
                              )
                              .map((p: any) =>
                                p.values.split(";").map((v: string) => ({
                                  value: v,
                                  label: v,
                                }))
                              )
                              .flat()}
                          />
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
                {selectedCategory.properties?.map((property: any) => (
                  <>
                    {property.type === "multi-select" && (
                      <TableRow
                        sx={{
                          td: {
                            border: "1px solid var(--border-table)",
                            padding: 1,
                            paddingInline: 1,
                          },
                        }}
                      >
                        <TableCell sx={{ height: 1, width: 200 }}>
                          <NoteInfo>
                            <Image src={multiSelect} alt="" /> {property.name}
                          </NoteInfo>
                        </TableCell>

                        <TableCell onBlur={handleUpdateCategory}>
                          <ReactSelect
                            isDisabled={paymentRequestDetails.status === 2}
                            value={selectedValues}
                            onChange={(selectedOptions: ReactSelectOption[]) =>
                              handleSelectChange(
                                selectedOptions,
                                property.name,
                                property.type
                              )
                            }
                            options={property.values
                              .split(";")
                              .map((v: string) => ({
                                value: v,
                                label: v,
                              }))}
                            // defaultValues={property.values
                            //   .split(";")
                            //   .map((v: string) => ({
                            //     value: v,
                            //     label: v,
                            //   }))}
                            defaultValues={parseCategoryProperties
                              .filter(
                                (p: any) =>
                                  p.type === "multi-select" &&
                                  p.name === property.name
                              )
                              .map((p: any) =>
                                p.values.split(";").map((v: string) => ({
                                  value: v,
                                  label: v,
                                }))
                              )
                              .flat()}
                          />
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
                {selectedCategory.properties?.map((property: any) => (
                  <>
                    {property.type === "Text" && (
                      <TableRow
                        sx={{
                          td: {
                            border: "1px solid var(--border-table)",
                            padding: 1,
                            paddingInline: 1,
                          },
                        }}
                      >
                        <TableCell sx={{ height: 1, width: 200 }}>
                          <NoteInfo>
                            <Image src={optionsIcon} alt="" /> {property.name}
                          </NoteInfo>
                        </TableCell>

                        <TableCell onBlur={handleUpdateCategory}>
                          <TextField
                            disabled={paymentRequestDetails.status === 2}
                            sx={{
                              "& fieldset": { border: "none" },
                            }}
                            size="small"
                            fullWidth
                            value={
                              proPertyTextValue[property.name]?.values || ""
                            }
                            // id="fullWidth"
                            placeholder="Enter content"
                            onChange={(e) =>
                              handlePropertyText(
                                e,
                                property.name,
                                property.type
                              )
                            }
                            InputProps={{
                              style: { padding: 0 },
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </NoteInformation>
        {/* <ReactSelect /> */}
      </RequestDetails>
    </WorkspaceItemDetailsLayout>
    // </Header>
  );
};

export default BookkeepingTransferDetails;

const RequestDetails = styled.div`
  padding-bottom: 50px;
`;
const TransferTable = styled.div`
  /* padding-bottom: 50px; */
  margin-inline: 46px;
  margin-top: 20px;
`;
const TransactionHash = styled.div`
  margin-inline: 46px;
  margin-top: 30px;
  img {
    cursor: pointer;
  }
  h3 {
    font-size: 18px;
    padding-bottom: 8px;
    font-weight: 400;
  }
  div {
    border: 1px solid var(--border-table);
    padding: 10px 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    p {
      color: var(--text-secondary);
      font-size: 16px;
    }
    img {
      width: 22px;
    }
  }
`;
export const SafeSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* height: 100%; */
`;
export const Logo = styled.div`
  /* flex: 0 0 30%; */
  /* height: 44px; */
  img {
    /* width: 20px; */
    /* height: 100%; */
  }
`;

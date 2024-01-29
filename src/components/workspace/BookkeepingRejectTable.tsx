import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Checkbox,
} from "@mui/material";
import data from "../../data/tableData";
import { useNavigate } from "react-router-dom";
import {
  Logo,
  SafeSection,
} from "../../pages/workspace/bookkeeping/Bookkeeping";
import { useEffect, useState } from "react";
import rightArrow from "../../assets/workspace/right-arrow.svg";
import hide from "../../assets/workspace/hide.svg";
import styled from "@emotion/styled";
import { useBookkeeping } from "../../store/useBookkeeping";
import { CategoryTitle } from "../../pages/workspace/category/category.style";

interface RejectTableProps {
  workspaceId: number;
  paymentRequest: boolean;
  filterData: IBookkeeping[];
  handleBookkeepingDetails: (
    paymentRequestId: number,
    paymentId: number
  ) => void;
}
const recipientFormate = (n: string) => {
  return `${n.slice(0, 6)}...${n.slice(-4)}`;
};
const BookkeepingRejectTable = ({
  workspaceId,
  paymentRequest,
  filterData,
  handleBookkeepingDetails,
}: RejectTableProps) => {
  const navigate = useNavigate();

  const { bookkeepingList, unHideBookkeepingList, getBookkeepingList } =
    useBookkeeping();

  // table logic
  const [selected, setSelected] = useState<number[]>([]);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelected(bookkeepingList.map((c) => c.ID));
    } else {
      setSelected([]);
    }
  };

  const handleCheckboxClick = (
    event: React.ChangeEvent<HTMLInputElement>,
    categoryId: number
  ) => {
    if (event.target.checked) {
      setSelected((prevSelected) => [...prevSelected, categoryId]);
    } else {
      setSelected((prevSelected) =>
        prevSelected.filter((id) => id !== categoryId)
      );
    }
  };

  const isSelected = (categoryId: number) => {
    return selected.indexOf(categoryId) !== -1;
  };

  // un-hide item
  const paymentRequestIds = selected.join(",");
  const handleUnHideBookkeepingList = async () => {
    await unHideBookkeepingList(workspaceId, paymentRequestIds);
    await getBookkeepingList(workspaceId, true);
  };
  console.log(selected);

  return (
    <div>
      {bookkeepingList.length === 0 && !paymentRequest ? (
        <Message>
          <h3>You don't have any hidden transactions.</h3>
          <p style={{ width: "509px", textAlign: "center" }}>
            Transactions that add tokens to or remove tokens from your Safe will
            show up here.
          </p>
        </Message>
      ) : (
        <>
          <UnhideBtn>
            <Btn onClick={handleUnHideBookkeepingList}>
              <img src={hide} alt="" />
              <p>Unhide</p>
            </Btn>
          </UnhideBtn>
          <TableContainer
            sx={{ border: "1px solid var(--border)", borderRadius: "10px" }}
          >
            <Table>
              <TableHead style={{ backgroundColor: "#f0f0f0" }}>
                <TableRow>
                  <TableCell>
                    <Checkbox
                      indeterminate={
                        selected.length > 0 &&
                        selected.length < bookkeepingList.length
                      }
                      checked={selected.length === bookkeepingList.length}
                      onChange={handleSelectAllClick}
                    />
                    Safe
                  </TableCell>
                  <TableCell>Counterparty</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filterData.map((bookkeeping) => (
                  <>
                    <TableRow>
                      <TableCell
                        style={{
                          padding: 0,
                          paddingLeft: "16px",
                          borderBottom: "1px solid #ddd",
                          borderTop: "none",
                        }}
                      >
                        <SafeSection>
                          <div>
                            <Checkbox
                              checked={isSelected(bookkeeping.ID)}
                              onChange={(event) =>
                                handleCheckboxClick(event, bookkeeping.ID)
                              }
                            />
                            {recipientFormate(
                              bookkeeping.currency_contract_address
                            )}
                          </div>
                          <Logo>
                            <img src={rightArrow} alt="" />
                          </Logo>
                        </SafeSection>
                      </TableCell>
                      <TableCell>
                        {recipientFormate(bookkeeping.recipient)}
                      </TableCell>
                      <TableCell>{bookkeeping.amount}</TableCell>
                      <TableCell>
                        <CategoryCell>{bookkeeping.category_name}</CategoryCell>
                      </TableCell>
                      <TableCell>
                        {bookkeeping.CreatedAt.slice(0, 10)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          sx={{
                            borderColor: "black",
                            color: "black",
                            textTransform: "lowercase",
                          }}
                          onClick={() =>
                            handleBookkeepingDetails(
                              bookkeeping.payment_request_id,
                              bookkeeping.ID
                            )
                          }
                        >
                          view more
                        </Button>
                      </TableCell>
                    </TableRow>
                  </>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </div>
  );
};

export default BookkeepingRejectTable;

const CategoryCell = styled.div`
  background: var(--bg-primary);
  padding: 4px;
  font-size: 14px;
  text-align: center;
  border-radius: 5px;
`;
const UnhideBtn = styled.div`
  display: flex;
  justify-content: end;
`;
export const Btn = styled.div`
  margin: 20px 0;
  display: flex;
  gap: 8px;
  border: 1px solid var(--border);
  padding: 6px 10px;
  border-radius: 5px;
  border: 1px solid #111;
  img {
    width: 22px;
  }
  p {
    font-size: 20px;
  }
`;
const Message = styled.div`
  height: 50vh;
  /* border: 1px solid var(--border); */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h3 {
    font-size: 30px;
    font-weight: 500;
  }
  p {
    font-size: 18px;
    padding: 30px 0;
  }
`;
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { CategoryCell } from "../../pages/workspace/paymentRequest/paymentRequest.style";
import statusIcon from "../../assets/workspace/status-icon.svg";
import styled from "@emotion/styled";
import CustomModal from "../../utils/CustomModal";
import PaymentRequestDetails from "../../pages/workspace/paymentRequest/PaymentRequestDetails";
import { useEffect, useState } from "react";
import usePaymentsStore from "../../store/usePayments";

interface RejectDataTableProps {
  searchTerm?: string | undefined;
  selectedValue?: string;
  isInQueue?: boolean;
}
const recipientFormate = (n: string) => {
  return `${n.slice(0, 6)}...${n.slice(-4)}`;
};
const RejectDataTable = ({
  searchTerm,
  selectedValue,
  isInQueue,
}: RejectDataTableProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [list, setList] = useState<IPaymentRequest[]>([]);
  const [total, setTotal] = useState(0);

  const { getPaymentRequestDetails, getFailedPaymentRequestList } =
    usePaymentsStore();

  const handleOpenModal = (paymentRequestId: number, paymentId: number) => {
    setOpenModal(true);
    getPaymentRequestDetails(Number(id), paymentRequestId, paymentId);
  };
  // filter table data
  const filterData = searchTerm
    ? list.filter((data) => {
        const searchItem = data.recipient
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const filterByCategory =
          selectedValue === "" || data.category_name === selectedValue;
        return searchItem && filterByCategory;
      })
    : list;

  useEffect(() => {
    getFailedPaymentRequestList(Number(id), isInQueue).then(
      (res: IPageResponse<IPaymentRequest>) => {
        setTotal(res?.total || 0);
        setList(res?.rows || []);
      }
    );
  }, [isInQueue]);

  return (
    <div>
      <CustomModal
        open={openModal}
        setOpen={setOpenModal}
        component={PaymentRequestDetails}
      />
      <TableContainer component={Paper} sx={{ maxHeight: 600, minWidth: 800 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ background: "var(--bg-primary)" }}>
                Recipient
              </TableCell>
              <TableCell sx={{ background: "var(--bg-primary)" }}>
                Amount
              </TableCell>
              <TableCell sx={{ background: "var(--bg-primary)" }}>
                Category
              </TableCell>
              <TableCell sx={{ background: "var(--bg-primary)" }}>
                Status
              </TableCell>
              <TableCell sx={{ background: "var(--bg-primary)" }}>
                Date
              </TableCell>
              <TableCell sx={{ background: "var(--bg-primary)" }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filterData?.map((payment) => (
              <TableRow key={payment.ID}>
                <TableCell>{recipientFormate(payment.recipient)}</TableCell>
                <TableCell>{payment.amount} USDT</TableCell>
                <TableCell>
                  <CategoryCell>{payment.category_name}</CategoryCell>
                </TableCell>
                <TableCell>
                  <Status>
                    <img src={statusIcon} alt="" />
                    {"Rejected"}
                  </Status>
                </TableCell>
                <TableCell>{payment.CreatedAt.slice(0, 10)}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    sx={{
                      borderColor: "black",
                      color: "black",
                      textTransform: "lowercase",
                    }}
                    onClick={() =>
                      handleOpenModal(payment.payment_request_id, payment.ID)
                    }
                  >
                    view more
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default RejectDataTable;

export const Status = styled.div`
  display: flex;
  gap: 5px;
  img {
    width: 7px;
  }
`;
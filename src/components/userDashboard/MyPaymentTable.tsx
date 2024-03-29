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
import { formatNumber } from "../../utils/number";
import { Status } from "../workspace/paymentRequest/RejectPaymentRequestTable";
import statusIcon from "../../assets/workspace/status-icon.svg";
import { getPaymentStatus, getPaymentUpdateTime } from "../../utils/payment";

interface MyPaymentTableProps {
  filterData: IPaymentRequest[];
  handleUserPaymentDetails: (data: IPaymentRequest) => void;
}

const recipientFormate = (n: string) => {
  return `${n.slice(0, 6)}...${n.slice(-4)}`;
};
const MyPaymentTable = ({
  filterData,
  handleUserPaymentDetails,
}: MyPaymentTableProps) => {
  return (
    <TableContainer
      component={Paper}
      sx={{
        maxHeight: "100%",
        overflow: "auto",
        minWidth: 800,
        "&::-webkit-scrollbar": {
          display: "none",
        },
        "-ms-overflow-style": "none",
        scrollbarWidth: "none",
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                background: "var(--bg-primary)",
              }}
            >
              Safe
            </TableCell>
            <TableCell
              sx={{
                background: "var(--bg-primary)",
              }}
            >
              Amount
            </TableCell>
            <TableCell
              sx={{
                background: "var(--bg-primary)",
              }}
            >
              Status
            </TableCell>
            <TableCell
              sx={{
                background: "var(--bg-primary)",
              }}
            >
              Date
            </TableCell>
            <TableCell
              sx={{
                background: "var(--bg-primary)",
              }}
            ></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filterData.map((payment) => (
            <TableRow key={payment.ID}>
              <TableCell>
                <div>
                  <p>{payment.workspace_name}</p>
                  <p>{recipientFormate(payment.vault_wallet)}</p>
                </div>
              </TableCell>
              <TableCell>
                {formatNumber(Number(payment.amount))} {payment.currency_name}
              </TableCell>
              <TableCell>
                <Status>
                  <img src={statusIcon} alt="" />
                  {getPaymentStatus(payment.status)}
                </Status>
              </TableCell>
              <TableCell>{getPaymentUpdateTime(payment)}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: "black",
                    color: "black",
                    textTransform: "lowercase",
                  }}
                  onClick={() => handleUserPaymentDetails(payment)}
                >
                  view more
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MyPaymentTable;

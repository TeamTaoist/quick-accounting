import styled from "@emotion/styled";

export const UserDashboardSection = styled.div`
  display: flex;
`;

export const Details = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 500px;
  h2 {
    font-size: 30px;
    font-weight: 500;
    text-align: center;
  }
`;
export const PaymentTable = styled.div`
  height: 90vh;
  overflow-y: scroll;
`;
export const Pagination = styled.div`
  /* display: flex; */
  padding: 20px 30px;
`;

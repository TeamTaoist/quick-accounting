import { useEffect, useState } from "react";
import Sidebar from "../../components/layout/sidebar/Sidebar";
import UserSidebar from "../../components/userDashboard/userSidebar/UserSidebar";
import { useUserPayment } from "../../store/useUserPayment";
import UserPaymentRequest from "./UserPaymentRequest";
import {
  Details,
  Pagination,
  PaymentTable,
  UserDashboardSection,
} from "./userDashboard.style";
import { useLoading } from "../../store/useLoading";
import Loading from "../../utils/Loading";
import ReactPaginate from "react-paginate";
import styled from "@emotion/styled";

const UserDashboard = () => {
  const { getUserPayment, userPayment } = useUserPayment();
  const { isLoading } = useLoading();

  // pagination
  const [pageNumbers, setPageNumbers] = useState(0);
  const pageSize = userPayment.size;
  const totalItem = userPayment.total;

  const pageCount = Math.ceil(totalItem / pageSize);

  const handlePageClick = (event: any) => {
    setPageNumbers(event.selected);
  };
  // get user payment request
  useEffect(() => {
    getUserPayment(pageNumbers);
  }, [getUserPayment, pageNumbers]);
  return (
    <div>
      {isLoading && <Loading />}
      <Sidebar>
        <UserDashboardSection>
          <UserSidebar>
            {userPayment.rows.length === 0 ? (
              <Details>
                <h2>
                  You don't have any payment <br /> request
                </h2>
              </Details>
            ) : (
              <PaymentTable>
                <UserPaymentRequest />
                {/* pagination */}
                <Pagination>
                  <ReactPaginate
                    breakLabel="..."
                    nextLabel=">"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={3}
                    pageCount={pageCount}
                    previousLabel="<"
                    renderOnZeroPageCount={null}
                    containerClassName="pagination"
                    pageLinkClassName="page-num"
                    previousLinkClassName="page-arrow"
                    nextLinkClassName="page-arrow"
                    activeLinkClassName="active"
                    // initialPage={2}
                    forcePage={0}
                  />
                </Pagination>
              </PaymentTable>
            )}
          </UserSidebar>
        </UserDashboardSection>
      </Sidebar>
    </div>
  );
};

export default UserDashboard;

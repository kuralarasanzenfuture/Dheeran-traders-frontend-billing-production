import React from "react";

export const CustomerDetail = () => {
  return (
    <>
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="d-flex gap-2 justify-content-end mb-3">
            <button className="excel-btn"><i class="fi fi-tr-file-excel"></i>Export Excel</button>
            <button className="pdf-btn"><i class="fi fi-tr-file-pdf"></i>Pdf</button>
            <button className="print-btn"><i class="fi fi-tr-print"></i>Print</button>
          </div>
          <div className="full_page_view">
            <div className="page_container">
              <table className="table mb-0 verify-table">
                <tbody>
                  <tr>
                    <th colSpan={2} className="bg">
                      Customer Details
                    </th>
                  </tr>
                  <tr>
                    <th>Customer Id</th>
                    <td>200001</td>
                  </tr>
                  <tr>
                    <th>Name</th>
                    <td>Anitha P</td>
                  </tr>
                  <tr>
                    <th>Email</th>
                    <td>anithap092003@gmail.com</td>
                  </tr>
                  <tr>
                    <th>Phone</th>
                    <td>9876543210</td>
                  </tr>
                  <tr>
                    <th>Address</th>
                    <td>21,Duabai Cross Street, Dubai Main Road, Dubai</td>
                  </tr>
                  <tr>
                    <th colSpan={2} className="bg-1">
                      Product 1
                    </th>
                  </tr>
                  <tr>
                    <th>Product Name</th>
                    <td>Bullet rice</td>
                  </tr>
                  <tr>
                    <th>Product ID</th>
                    <td>pd001</td>
                  </tr>
                  <tr>
                    <th>Brand</th>
                    <td>Bullet</td>
                  </tr>
                  <tr>
                    <th>Categorey</th>
                    <td>Full Boil</td>
                  </tr>
                  <tr>
                    <th>Quantity</th>
                    <td>26 Kg</td>
                  </tr>
                  <tr>
                    <th>Stock</th>
                    <td>30 Bag</td>
                  </tr>
                  <tr>
                    <th colSpan={2} className="bg-1">
                      Product 2
                    </th>
                  </tr>
                  <tr>
                    <th>Product Name</th>
                    <td>Bullet rice</td>
                  </tr>

                  <tr>
                    <th>Product ID</th>
                    <td>pd001</td>
                  </tr>
                  <tr>
                    <th>Brand</th>
                    <td>Bullet</td>
                  </tr>
                  <tr>
                    <th>Categorey</th>
                    <td>Full Boil</td>
                  </tr>
                  <tr>
                    <th>Quantity</th>
                    <td>26 Kg</td>
                  </tr>
                  <tr>
                    <th>Stock</th>
                    <td>30 Bag</td>
                  </tr>
                  <tr>
                    <th>Total</th>
                    <td>18000</td>
                  </tr>
                  <tr>
                    <th>Advance Amount</th>
                    <td>10000</td>
                  </tr>
                  <tr>
                    <th>Pending Amount</th>
                    <td>8000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

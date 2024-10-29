import React from "react";
import { Link } from "react-router-dom";

const Table = ({ name, matchData = [] }) => {
  console.log(name, matchData);
  return (
    <div>
      <section>
        <div className="mx-auto">
          <div className="relative flex flex-col w-full h-full text-black bg-white shadow-md rounded-lg bg-clip-border">
            <table className="w-full text-left table-auto pb-1">
              <thead>
                <tr>
                  {name.map((na, index) => (
                    <th
                      key={index} // Ensure unique key for each header cell
                      className="p-4 border-b border-slate-200 bg-slate-50"
                    >
                      <p className="text-sm leading-none text-gray-900 font-medium">
                        {na}
                      </p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matchData.map((data, index) => (
                  <tr
                    key={data._id || index} // Use _id or fallback to index for unique key
                    className="hover:bg-slate-50 border-b border-slate-200"
                  >
                    <td className="p-4 py-5">
                      <Link
                        to={`/product-details/${data?.productId}`}
                        className="text-sm hover:underline text-gray-900 font-medium"
                      >
                        {data?.invoiceId || "N/A"}
                      </Link>
                    </td>
                    <td className="p-4 py-5">
                      <Link
                        to={`/product-details/${data?.productId}`}
                        className="text-sm hover:underline text-gray-900 font-medium"
                      >
                        {data?.productName || "N/A"}
                      </Link>
                    </td>
                    <td className="p-4 py-5">
                      <p className="text-sm text-gray-900 font-medium">
                        {data?.size
                          ? Array.isArray(data.size)
                            ? data.size.join(", ")
                            : data.size
                          : "N/A"}
                      </p>
                    </td>
                    <td className="p-4 py-5">
                      <p className="text-sm text-gray-900 font-medium">
                        {data?.quantity || 0}
                      </p>
                    </td>
                    <td className="p-4 py-5">
                      <p className="text-sm text-gray-900 font-medium">
                        {data?.discount ? `${data.discount}` : "0"}%
                      </p>
                    </td>
                    <td className="p-4 py-5">
                      <p className="text-sm text-gray-900 font-medium">
                        ৳
                        {data?.quantity && data?.price
                          ? `${data.quantity * data.price}`
                          : "N/A"}
                      </p>
                    </td>
                    <td className="p-4 py-5">
                      <p className="text-sm text-gray-900 font-medium">
                        {data?.status === "Awaiting Check Payment" ? (
                          <button className="cursor-not-allowed flex items-center gap-2 bg-[#439DDF] text-white rounded font-semibold px-3 py-1">
                            Waiting For Successful Payment
                          </button>
                        ) : data?.status === "Receive Payment" ? (
                          <button className="cursor-not-allowed flex items-center gap-2 bg-[#439DDF] text-white rounded font-semibold px-3 py-1">
                            Payment Received
                          </button>
                        ) : data?.status === "Delivery" ? (
                          <button className="cursor-not-allowed flex items-center gap-2 bg-[#439DDF] text-white rounded font-semibold px-3 py-1">
                            Delivery
                          </button>
                        ) : data?.status === "Completed Order" ? (
                          <button className="cursor-not-allowed flex items-center gap-2 bg-[#439DDF] text-white rounded font-semibold px-3 py-1">
                            Completed Order
                          </button>
                        ) : (
                          <div className="flex gap-2 items-center">
                            <Link to={`/CheckOut/${data.productId}`}>
                              <button className="uppercase flex items-center gap-2 bg-[#439DDF] hover:bg-[#B63155] text-white rounded font-semibold px-3 py-1">
                                Payment
                              </button>
                            </Link>
                            <button className="uppercase flex items-center gap-2 bg-[#B63155] text-white rounded font-semibold px-3 py-1">
                              Cancel
                            </button>
                          </div>
                        )}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Table;

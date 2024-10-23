<div class="relative flex  flex-col w-full h-full text-black bg-white shadow-md rounded-lg bg-clip-border">
<table className="w-full text-left table-auto pb-1">
  <thead>
    <tr>
      <th className="p-4 border-b border-slate-200 bg-slate-50">
        <p className="text-sm  leading-none text-gray-900 font-medium">
          Invoice Id
        </p>
      </th>
      <th className="p-4 border-b border-slate-200 bg-slate-50">
        <p className="text-sm  leading-none text-gray-900 font-medium">
          Product Name
        </p>
      </th>
      <th className="p-4 border-b border-slate-200 bg-slate-50">
        <p className="text-sm  leading-none text-gray-900 font-medium">
          Size
        </p>
      </th>
      <th className="p-4 border-b border-slate-200 bg-slate-50">
        <p className="text-sm  leading-none text-gray-900 font-medium">
          Quantity
        </p>
      </th>
      <th className="p-4 border-b border-slate-200 bg-slate-50">
        <p className="text-sm  leading-none text-gray-900 font-medium">
          Discount
        </p>
      </th>
      <th className="p-4 border-b border-slate-200 bg-slate-50">
        <p className="text-sm  leading-none text-gray-900 font-medium">
          Amount
        </p>
      </th>

      <th className="p-4 border-b border-slate-200 bg-slate-50">
        <p className="text-sm  leading-none text-gray-900 font-medium">
          Delivery Status
        </p>
      </th>
    </tr>
  </thead>
  <tbody>
    {matchIncompleteData.map((data, index) => (
      <tr
        key={index}
        className="hover:bg-slate-50 border-b border-slate-200"
      >
        <td className="p-4 py-5">
          <Link
            to={`/product-details/${data?.productId}`}
            className="text-sm hover:underline text-gray-900 font-medium"
          >
            {data?.invoiceId}
          </Link>{" "}
          {/* Replace with actual data field */}
        </td>
        <td className="p-4 py-5">
          <Link
            to={`/product-details/${data?.productId}`}
            className="text-sm hover:underline text-gray-900 font-medium"
          >
            {data?.productName}
          </Link>{" "}
          {/* Replace with actual data field */}
        </td>
        <td className="p-4 py-5">
          <p className="text-sm text-gray-900 font-medium">
            {data?.size
              ? Array.isArray(data.size)
                ? data.size.join(", ") // Join sizes with a comma if it's an array
                : data.size // Display the size directly if it's a single value
              : "N/A"}
          </p>

          {/* Replace with actual data field */}
        </td>
        <td className="p-4 py-5">
          <p className="text-sm text-gray-900 font-medium">
            {data?.quantity}
          </p>{" "}
          {/* Replace with actual data field */}
        </td>

        <td className="p-4 py-5">
          <p className="text-sm text-gray-900 font-medium">
            {data?.discount ? <>{data?.discount}</> : <>0</>}%
          </p>{" "}
          {/* Replace with actual data field */}
        </td>
        <td className="p-4 py-5">
          <p className="text-sm text-gray-900 font-medium">
            ৳
            {data?.quantity && data?.price
              ? `${data.quantity * data.price}`
              : "N/A"}{" "}
          </p>{" "}
          {/* Replace with actual data field */}
        </td>
        <td className="p-4 py-5">
          <p className="text-sm text-gray-900 font-medium">
            {data?.status === "Awaiting Check Payment" ? (
              <button className="cursor-not-allowed flex disable items-center gap-2 bg-[#439DDF] text-white rounded font-semibold px-3 py-1">
                Waiting For Successful Payment
              </button>
            ) : data?.status === "Receive Payment" ? (
              <button className="cursor-not-allowed flex disable items-center gap-2 bg-[#439DDF] text-white rounded font-semibold px-3 py-1">
                Payment Received
              </button>
            ) : data?.status === "Delivery" ? (
              <button className="cursor-not-allowed flex disable items-center gap-2 bg-[#439DDF] text-white rounded font-semibold px-3 py-1">
                Delivery
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




<div class="mx-auto">
<div class="relative flex flex-col w-full h-full text-black bg-white shadow-md rounded-lg bg-clip-border">
  <table className="w-full text-left table-auto">
    <thead>
      <tr>
        <th className="p-4 border-b border-slate-200 bg-slate-50">
          <p className="text-sm  leading-none text-gray-900 font-medium">
            Invoice Id
          </p>
        </th>
        <th className="p-4 border-b border-slate-200 bg-slate-50">
          <p className="text-sm  leading-none text-gray-900 font-medium">
            Product Name
          </p>
        </th>
        <th className="p-4 border-b border-slate-200 bg-slate-50">
          <p className="text-sm  leading-none text-gray-900 font-medium">
            Size
          </p>
        </th>
        <th className="p-4 border-b border-slate-200 bg-slate-50">
          <p className="text-sm  leading-none text-gray-900 font-medium">
            Quantity
          </p>
        </th>
        <th className="p-4 border-b border-slate-200 bg-slate-50">
          <p className="text-sm  leading-none text-gray-900 font-medium">
            Discount
          </p>
        </th>
        <th className="p-4 border-b border-slate-200 bg-slate-50">
          <p className="text-sm  leading-none text-gray-900 font-medium">
            Amount
          </p>
        </th>

        <th className="p-4 border-b border-slate-200 bg-slate-50">
          <p className="text-sm  leading-none text-gray-900 font-medium">
            Delivery Status
          </p>
        </th>
      </tr>
    </thead>
    <tbody>
      {matchCompleteData.map((data, index) => (
        <tr
          key={index}
          className="hover:bg-slate-50 border-b border-slate-200"
        >
          <td className="p-4 py-5">
            <Link
              to={`/product-details/${data?.productId}`}
              className="text-sm hover:underline text-gray-900 font-medium"
            >
              {data?.invoiceId}
            </Link>{" "}
            {/* Replace with actual data field */}
          </td>
          <td className="p-4 py-5">
            <Link
              to={`/product-details/${data?.productId}`}
              className="text-sm hover:underline text-gray-900 font-medium"
            >
              {data?.productName}
            </Link>{" "}
            {/* Replace with actual data field */}
          </td>
          <td className="p-4 py-5">
            <p className="text-sm text-gray-900 font-medium">
              {data?.size
                ? Array.isArray(data.size)
                  ? data.size.join(", ") // Join sizes with a comma if it's an array
                  : data.size // Display the size directly if it's a single value
                : "N/A"}
            </p>

            {/* Replace with actual data field */}
          </td>
          <td className="p-4 py-5">
            <p className="text-sm text-gray-900 font-medium">
              {data?.quantity}
            </p>{" "}
            {/* Replace with actual data field */}
          </td>

          <td className="p-4 py-5">
            <p className="text-sm text-gray-900 font-medium">
              {data?.discount ? <>{data?.discount}</> : <>0</>}%
            </p>{" "}
            {/* Replace with actual data field */}
          </td>
          <td className="p-4 py-5">
            <p className="text-sm text-gray-900 font-medium">
              ৳
              {data?.quantity && data?.price
                ? `${data.quantity * data.price}`
                : "N/A"}{" "}
            </p>{" "}
            {/* Replace with actual data field */}
          </td>
          <td className="p-4 py-5">
            <p className="text-sm text-gray-900 font-medium">
              <div className="flex gap-2 items-center">
                {data?.status === "Completed Order" ? (
                  <button className=" flex disable items-center gap-2 bg-[#439DDF] text-white rounded font-semibold px-3 py-1">
                    Completed Order
                  </button>
                ) : (
                  ""
                )}
              </div>
            </p>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
</div>
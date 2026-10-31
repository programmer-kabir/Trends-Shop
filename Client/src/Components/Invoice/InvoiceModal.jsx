import React, { useEffect } from "react";
import {
  FiPrinter,
  FiX,
  FiCheckCircle,
  FiClock,
  FiTruck,
  FiShoppingBag,
  FiMapPin,
  FiPhone,
  FiMail,
  FiCopy,
  FiShield,
  FiCreditCard,
} from "react-icons/fi";
import { RiSparklingFill } from "react-icons/ri";
import toast from "../Toast/LuxuryToast";

const InvoiceModal = ({ isOpen, onClose, order, shoes = [] }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !order) return null;

  // Extract items list
  let items = [];
  if (Array.isArray(order.items) && order.items.length > 0) {
    items = order.items;
  } else {
    // Single item fallback
    const matchingShoe = shoes.find(
      (s) => s._id === (order.products || order.productId)
    );
    items = [
      {
        productId: order.products || order.productId,
        name: matchingShoe?.name || order.name || "Handcrafted Footwear",
        category: matchingShoe?.category || "Men's Luxury",
        image:
          matchingShoe?.mainImage ||
          order.image ||
          "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop",
        size: order.size || 42,
        quantity: order.quantity || 1,
        price: Number(order.price) || Number(matchingShoe?.price) || 0,
        subtotal: Number(order.price) || Number(matchingShoe?.price) || 0,
      },
    ];
  }

  const invoiceId = order.invoiceId || `#INV-${order._id?.slice(-8).toUpperCase()}`;
  const subtotal = items.reduce(
    (acc, it) => acc + (Number(it.subtotal) || (Number(it.price) * (Number(it.quantity) || 1))),
    0
  );
  const shippingCost = Number(order.shippingCost) || 0;
  const discount = Number(order.discount) || 0;
  const grandTotal = subtotal + shippingCost - discount;

  const handlePrint = () => {
    window.print();
  };

  const copyInvoice = () => {
    navigator.clipboard.writeText(invoiceId);
    toast.success("Invoice ID copied to clipboard!", {
      title: "Copied 📋",
      badge: invoiceId,
      duration: 2500,
    });
  };

  return (
    <>
      {/* Print-specific style */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-invoice, #printable-invoice * {
            visibility: visible !important;
          }
          #printable-invoice {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 24px !important;
            background: #ffffff !important;
            color: #0f172a !important;
            box-shadow: none !important;
            border: none !important;
            z-index: 999999 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Modal Backdrop */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/75 backdrop-blur-md overflow-y-auto animate-fadeIn">
        <div
          className="relative w-full max-w-3xl my-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100 max-h-[92vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Control Bar (Hidden in Print) */}
          <div className="no-print flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 shrink-0">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                <RiSparklingFill />
                Official Atelier Invoice
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">
                Single Unified Order
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md shadow-amber-500/20 transition flex items-center gap-2"
              >
                <FiPrinter className="text-sm" />
                <span>Print / Save PDF</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition"
                aria-label="Close modal"
              >
                <FiX className="text-lg" />
              </button>
            </div>
          </div>

          {/* Printable Invoice Container */}
          <div
            id="printable-invoice"
            className="p-6 sm:p-8 space-y-6 overflow-y-auto print:p-0 print:overflow-visible print:bg-white print:text-slate-950"
          >
            {/* Header: Brand & Invoice Meta */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800 print:border-slate-300">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20 text-lg">
                    TS
                  </div>
                  <div>
                    <h1 className="text-xl font-black uppercase tracking-tight text-slate-950 dark:text-white print:text-black">
                      Trends Shop
                    </h1>
                    <p className="text-[11px] font-semibold tracking-widest uppercase text-amber-600 dark:text-amber-400 print:text-amber-700">
                      Artisan Leather Atelier
                    </p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 max-w-xs leading-relaxed print:text-slate-600">
                  House of Handcrafted Luxury Footwear. Pure full-grain leather,
                  timeless aesthetics and ergonomic comfort.
                </p>
              </div>

              <div className="text-left sm:text-right space-y-1">
                <div className="flex items-center sm:justify-end gap-1.5">
                  <span className="font-mono text-base font-black tracking-wide text-amber-600 dark:text-amber-400 print:text-amber-700">
                    {invoiceId}
                  </span>
                  <button
                    type="button"
                    onClick={copyInvoice}
                    className="no-print text-slate-400 hover:text-amber-500 transition"
                    title="Copy Invoice ID"
                  >
                    <FiCopy className="text-xs" />
                  </button>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 print:text-slate-600">
                  <span className="font-medium">Order Date:</span>{" "}
                  {order.orderDate || new Date().toISOString().split("T")[0]}
                </p>
                <div className="pt-1 sm:flex sm:justify-end">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 print:border-slate-400 print:bg-slate-100 print:text-slate-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>{order.status || "Order Placed"}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Customer & Delivery Address Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800 print:bg-slate-50 print:border-slate-200">
              <div className="space-y-1.5">
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 print:text-slate-500">
                  Billed & Shipped To
                </p>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white print:text-black">
                  {order.name || "Valued Client"}
                </h3>
                <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300 print:text-slate-700">
                  <p className="flex items-center gap-1.5">
                    <FiPhone className="text-amber-500 shrink-0" />
                    <span>{order.number || "Contact Not Provided"}</span>
                  </p>
                  {order.email && (
                    <p className="flex items-center gap-1.5">
                      <FiMail className="text-amber-500 shrink-0" />
                      <span>{order.email}</span>
                    </p>
                  )}
                  <p className="flex items-start gap-1.5 pt-0.5">
                    <FiMapPin className="text-amber-500 shrink-0 mt-0.5" />
                    <span className="leading-snug">{order.address || "Atelier Doorstep Delivery"}</span>
                  </p>
                </div>
              </div>

              <div className="space-y-1.5 sm:border-l sm:border-slate-200 dark:sm:border-slate-800 print:sm:border-slate-200 sm:pl-6">
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 print:text-slate-500">
                  Dispatch & Payment
                </p>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 print:text-slate-500">Method: </span>
                    <span className="font-semibold text-slate-900 dark:text-white print:text-black">
                      {order.paymentMethod || "Direct Payment"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 print:text-slate-500">TrxID: </span>
                    <span className="font-mono font-semibold text-amber-600 dark:text-amber-400 print:text-amber-700">
                      {order.transactionID || "COD (Direct Settlement)"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 print:text-slate-500">Scheduled Dispatch: </span>
                    <span className="font-medium text-slate-700 dark:text-slate-300 print:text-slate-800">
                      {order.deliveryDate || "Within 48-72 business hours"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items Table */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white print:text-black flex items-center gap-1.5">
                  <FiShoppingBag className="text-amber-500" />
                  <span>Artisan Order Items ({items.length})</span>
                </h3>
                <span className="text-[11px] text-slate-400 print:text-slate-500">
                  Consolidated Package
                </span>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 print:border-slate-300">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100/70 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 print:bg-slate-100 print:text-slate-800 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 print:border-slate-300">
                      <th className="py-3 px-4">Article</th>
                      <th className="py-3 px-4 text-center">Size</th>
                      <th className="py-3 px-4 text-center">Qty</th>
                      <th className="py-3 px-4 text-right">Unit Price</th>
                      <th className="py-3 px-4 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 print:divide-slate-200 text-xs">
                    {items.map((item, idx) => {
                      const itemSubtotal =
                        Number(item.subtotal) ||
                        (Number(item.price) * (Number(item.quantity) || 1));
                      return (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0 print:border-slate-300"
                                />
                              )}
                              <div>
                                <p className="font-bold text-slate-900 dark:text-white print:text-black line-clamp-1">
                                  {item.name}
                                </p>
                                <p className="text-[10px] text-amber-600 dark:text-amber-400 print:text-amber-700 uppercase font-semibold">
                                  {item.category || "Footwear"}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center font-bold text-slate-700 dark:text-slate-300 print:text-slate-800">
                            {item.size || "Standard"}
                          </td>
                          <td className="py-3 px-4 text-center font-bold text-slate-700 dark:text-slate-300 print:text-slate-800">
                            {item.quantity || 1}
                          </td>
                          <td className="py-3 px-4 text-right font-medium text-slate-600 dark:text-slate-300 print:text-slate-700">
                            ৳ {Number(item.price).toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-white print:text-black">
                            ৳ {itemSubtotal.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Calculations & Breakdown */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-2">
              <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400 max-w-sm print:text-slate-600">
                <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 print:text-amber-700 font-bold">
                  <FiShield />
                  <span>Trends Shop Authenticity Guarantee</span>
                </div>
                <p className="leading-relaxed">
                  Every pair is inspected for structural integrity, hand-finished
                  burnishing, and bespoke leather density. 7-day hassle-free size
                  exchange on unused items.
                </p>
              </div>

              <div className="w-full sm:w-64 space-y-2 rounded-2xl bg-slate-50 dark:bg-slate-950/40 p-4 border border-slate-200/80 dark:border-slate-800 print:bg-slate-50 print:border-slate-200 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400 print:text-slate-700">
                  <span>Subtotal ({items.length} items):</span>
                  <span className="font-semibold text-slate-900 dark:text-white print:text-black">
                    ৳ {subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400 print:text-slate-700">
                  <span>Flat Delivery Fee:</span>
                  <span className="font-semibold text-slate-900 dark:text-white print:text-black">
                    ৳ {shippingCost.toLocaleString()}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span>Voucher Privilege:</span>
                    <span className="font-semibold">- ৳ {discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 print:border-slate-300 flex justify-between items-baseline">
                  <span className="font-bold uppercase tracking-wider text-slate-900 dark:text-white print:text-black">
                    Grand Total:
                  </span>
                  <span className="text-base font-black text-amber-600 dark:text-amber-400 print:text-amber-700">
                    ৳ {grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 print:border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400 print:text-slate-500">
              <p>Thank you for choosing Trends Shop Luxury Atelier.</p>
              <p>Dhaka, Bangladesh • Hotline: +880 1700-000000</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoiceModal;

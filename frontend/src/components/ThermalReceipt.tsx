import { format } from 'date-fns';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

interface ThermalReceiptProps {
  order: any;
  autoPrint?: boolean;
}

const ThermalReceipt = ({ order, autoPrint = false }: ThermalReceiptProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (autoPrint) {
      setTimeout(() => window.print(), 500);
    }
  }, [autoPrint]);

  if (!mounted || !order) return null;

  return createPortal(
    <div id="thermal-root">
      <style
        dangerouslySetInnerHTML={{
          __html: `
/* ===========================
   GLOBAL RESET
=========================== */
#thermal-root {
  display: none;
}

/* ===========================
   PRINT MODE
=========================== */
@media print {
  @page {
    size: 58mm auto;
    margin: 0;
  }

  html, body {
    width: 58mm !important;
    max-width: 58mm !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
    background: white !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  body > *:not(#thermal-root) {
    display: none !important;
  }

  #thermal-root {
    display: block !important;
    width: 58mm;
  }

  #thermal-receipt {
    width: 58mm;
    font-family: Courier, monospace;
    font-size: 10px;
    line-height: 1.2;
    padding: 4px;
    color: black;
  }

  .center {
    text-align: center;
  }

  .bold {
    font-weight: bold;
  }

  .divider {
    text-align: center;
    margin: 4px 0;
  }

  .row {
    display: flex;
    justify-content: space-between;
    margin: 2px 0;
  }

  .small {
    font-size: 9px;
  }

  .total {
    font-weight: bold;
    font-size: 11px;
  }
}
          `,
        }}
      />

      <div id="thermal-receipt">
        {/* HEADER */}
        <div className="center bold">PETAL & PEARL</div>
        <div className="center small">
          House 23, Road 10<br />
          Banani, Dhaka<br />
          Tel: 017-XXXXXXX
        </div>

        <div className="divider">--------------------------</div>

        <div className="center bold">CASH RECEIPT</div>

        <div className="divider">--------------------------</div>

        {/* META */}
        <div className="row">
          <span>Order</span>
          <span>#{order.id}</span>
        </div>
        <div className="row">
          <span>Date</span>
          <span>
            {(() => {
              try {
                return order.createdAt ? format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm') : 'N/A';
              } catch (e) {
                return 'Invalid Date';
              }
            })()}
          </span>
        </div>

        <div className="divider">--------------------------</div>

        {/* ITEMS */}
        <div className="row bold">
          <span>Item</span>
          <span>Price</span>
        </div>

        {order.items && Array.isArray(order.items) && order.items.length > 0 ? (
          order.items.map((item: any, i: number) => item && (
            <div key={i}>
              <div className="row">
                <span>{item.name || 'Unknown'}</span>
                <span>{((Number(item.price) || 0) * (Number(item.quantity) || 0)).toFixed(1)}</span>
              </div>
              <div className="small">
                {item.quantity || 0} × {(Number(item.price) || 0).toFixed(1)}
              </div>
            </div>
          ))
        ) : (
          <div className="row">
            <span>No items</span>
            <span>0</span>
          </div>
        )}

        <div className="divider">--------------------------</div>

        {/* TOTAL */}
        <div className="row total">
          <span>Total</span>
          <span>৳ {(order.totalAmount || 0).toFixed(1)}</span>
        </div>

        <div className="row">
          <span>Payment</span>
          <span>{order.paymentMethod?.replace(/_/g, ' ') || 'N/A'}</span>
        </div>

        <div className="divider">--------------------------</div>

        {/* FOOTER */}
        <div className="center small">
          THANK YOU FOR SHOPPING
        </div>
        <div className="center small">
          www.petalandpearl.com
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ThermalReceipt;

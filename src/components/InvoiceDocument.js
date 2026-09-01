import React from "react";
import { dateTime, laborLineTotal, money, partLineTotal, vehicleName, customerName } from "../utils/formatters";

export default function InvoiceDocument({ invoice, printCopy = false }) {
  if (!invoice) return null;
  const {
    customer,
    car,
    repairOrder,
    repairParts = [],
    laborItems = [],
    partsSubtotal,
    laborSubtotal,
    subtotal,
    tax,
    total,
  } = invoice;
  const lineItemCount = repairParts.length + laborItems.length;
  const recommendations = repairOrder?.recommendations || repairOrder?.rocommendations || "";
  const narrativeLength = [
    repairOrder?.customerComplaint,
    repairOrder?.diagnosis,
    repairOrder?.mechanicNotes,
    recommendations,
  ].join("").length;
  const density = lineItemCount > 20 || narrativeLength > 1800
    ? "dense"
    : lineItemCount > 12 || narrativeLength > 900
      ? "compact"
      : "standard";

  return (
    <article
      id={printCopy ? "invoice-print-region" : undefined}
      className={`invoice-document invoice-density-${density}`}
    >
      <header className="invoice-header">
        <div>
          <span className="invoice-logo">MS</span>
          <div><h2>MechanicStream</h2><p>Professional automotive service</p></div>
        </div>
        <div className="invoice-title"><span>Invoice</span><strong>RO-{repairOrder?.id}</strong></div>
      </header>

      <section className="invoice-meta">
        <div><small>Customer</small><strong>{customerName(customer)}</strong><span>{customer?.phoneNumber || "No phone number"}</span><span>{customer?.email || "No email address"}</span></div>
        <div><small>Vehicle</small><strong>{vehicleName(car)}</strong><span>{car?.vin ? `VIN: ${car.vin}` : "VIN not recorded"}</span><span>{car?.licensePlate ? `Plate: ${car.licensePlate}` : "Plate not recorded"}</span></div>
        <div><small>Repair order</small><strong>RO-{repairOrder?.id}</strong><span>Opened: {dateTime(repairOrder?.createdAt)}</span><span>Mileage: {repairOrder?.mileageIn != null ? repairOrder.mileageIn.toLocaleString() : "—"} in / {repairOrder?.mileageOut != null ? repairOrder.mileageOut.toLocaleString() : "—"} out</span></div>
      </section>

      <section className="invoice-work-details">
        <div><small>Customer complaint</small><p>{repairOrder?.customerComplaint || "Not recorded."}</p></div>
        <div><small>Diagnosis</small><p>{repairOrder?.diagnosis || "Not recorded."}</p></div>
        <div><small>Mechanic notes</small><p>{repairOrder?.mechanicNotes || "Not recorded."}</p></div>
        <div><small>Recommendations</small><p>{recommendations || "Not recorded."}</p></div>
      </section>

      <section className="invoice-lines">
        <h3>Parts</h3>
        <div className="invoice-table">
          <div className="invoice-row invoice-row-head"><span>Description</span><span>Condition</span><span>Quantity</span><span>Unit price</span><span>Amount</span></div>
          {repairParts.length ? repairParts.map((part) => (
            <div className="invoice-row" key={part.id}>
              <span><strong>{part.partName}</strong><small>{part.partNumber}</small></span>
              <span>{part.partCondition}</span>
              <span>{part.quantity}</span>
              <span>{money(part.unitPrice)}</span>
              <span>{money(partLineTotal(part))}</span>
            </div>
          )) : <p className="invoice-empty">No parts billed.</p>}
        </div>
      </section>

      <section className="invoice-lines">
        <h3>Labor</h3>
        <div className="invoice-table">
          <div className="invoice-row labor-row invoice-row-head"><span>Technician</span><span>Hours</span><span>Rate</span><span>Amount</span></div>
          {laborItems.length ? laborItems.map((item) => (
            <div className="invoice-row labor-row" key={item.id}>
              <span><strong>{item.technician}</strong></span>
              <span>{Number(item.hours || 0).toFixed(2)}</span>
              <span>{money(item.laborRate)}</span>
              <span>{money(laborLineTotal(item))}</span>
            </div>
          )) : <p className="invoice-empty">No labor billed.</p>}
        </div>
      </section>

      <footer className="invoice-footer">
        <p>Thank you for choosing MechanicStream.</p>
        <div className="invoice-totals">
          <span>Parts subtotal<strong>{money(partsSubtotal)}</strong></span>
          <span>Labor subtotal<strong>{money(laborSubtotal)}</strong></span>
          <span>Subtotal<strong>{money(subtotal)}</strong></span>
          <span>Tax<strong>{money(tax)}</strong></span>
          <span className="invoice-grand-total">Total<strong>{money(total)}</strong></span>
        </div>
      </footer>
    </article>
  );
}

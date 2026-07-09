import jsPDF from 'jspdf';
import { formatCurrency, formatDateTime } from './format';

/**
 * Generate a single-page PDF receipt for an order and trigger download.
 *
 * @param {object} order  — OrderResponse from the backend
 * @param {object} meta   — { studentName, studentRoll, canteenName }
 */
export function downloadBill(order, meta = {}) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;

  // Header band
  doc.setFillColor(99, 102, 241); // brand-blue (Indigo)
  doc.rect(0, 0, pageWidth, 70, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(meta.canteenName || 'LBRCE Canteen', margin, 32);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Official Order Receipt', margin, 52);

  // Meta block
  doc.setTextColor(20, 20, 20);
  doc.setFontSize(11);
  let y = 100;
  const label = (k, v) => {
    doc.setFont('helvetica', 'bold'); doc.text(`${k}:`, margin, y);
    doc.setFont('helvetica', 'normal'); doc.text(String(v ?? '—'), margin + 80, y);
  };

  label('Order #',     order.orderNumber);
  label('Placed at',   formatDateTime(order.placedAt));
  label('Status',      order.status);
  label('Student',     meta.studentName || order.studentName);
  label('Roll No.',    meta.studentRoll || order.studentRoll);
  label('Payment',     `${order.paymentMethod} (${order.paymentStatus})`);

  // Items table header
  y += 30;
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y - 14, pageWidth - margin * 2, 22, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Item',          margin + 6, y);
  doc.text('Qty',           pageWidth - margin - 200, y);
  doc.text('Unit Price',    pageWidth - margin - 130, y);
  doc.text('Subtotal',      pageWidth - margin - 50,  y, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  y += 18;
  (order.items || []).forEach((it) => {
    doc.text(it.foodName, margin + 6, y);
    doc.text(String(it.quantity), pageWidth - margin - 200, y);
    doc.text(formatCurrency(it.unitPrice), pageWidth - margin - 130, y);
    doc.text(formatCurrency(it.subtotal),  pageWidth - margin - 50,  y, { align: 'right' });
    y += 16;
    if (y > 700) { doc.addPage(); y = 60; }
  });

  // Total
  y += 10;
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 18;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Total', pageWidth - margin - 130, y);
  doc.text(formatCurrency(order.totalAmount), pageWidth - margin - 50, y, { align: 'right' });

  // Footer
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(
    'This is a computer-generated receipt. Please retain for your records.',
    pageWidth / 2, 800, { align: 'center' }
  );

  doc.save(`${order.orderNumber}.pdf`);
}
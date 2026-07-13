import jsPDF from 'jspdf';
import { formatDateTime } from './format';

/**
 * Helper to format currency for PDF using plain text 'Rs.' to avoid font encoding issues.
 */
const formatPDFCurrency = (value) => `Rs. ${Number(value ?? 0).toFixed(2)}`;

/**
 * Generate a single-page PDF receipt for an order and trigger download.
 *
 * @param {object} order  — OrderResponse from the backend
 * @param {object} meta   — { studentName, studentRoll, canteenName }
 */
export function downloadBill(order, meta = {}) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;

  // Header band
  doc.setFillColor(37, 99, 235); // brand-blue (Blue-600)
  doc.rect(0, 0, pageWidth, 75, 'F');
  
  // Header Text
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(meta.canteenName || 'LBRCE Canteen', margin, 34);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(219, 234, 254); // Light blue-100
  doc.text('OFFICIAL ORDER RECEIPT', margin, 54);

  // Metadata Section
  let y = 110;
  
  // Row 1 Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139); // Slate-500
  doc.text('ORDER NUMBER', margin, y);
  doc.text('STUDENT NAME', 300, y);
  
  // Row 1 Content
  y += 16;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42); // Slate-900
  doc.text(String(order.orderNumber), margin, y);
  doc.text(String(meta.studentName || order.studentName || '—'), 300, y);
  
  // Row 2 Header
  y += 30;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('PLACED AT', margin, y);
  doc.text('ROLL NUMBER / ID', 300, y);
  
  // Row 2 Content
  y += 16;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(formatDateTime(order.placedAt), margin, y);
  doc.text(String(meta.studentRoll || order.studentRoll || '—'), 300, y);
  
  // Row 3 Header
  y += 30;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('PAYMENT INFO', margin, y);
  doc.text('ORDER STATUS', 300, y);
  
  // Row 3 Content
  y += 16;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(`${order.paymentMethod} (${order.paymentStatus})`, margin, y);
  doc.text(String(order.status), 300, y);

  // Table Separator Line
  y += 35;
  doc.setDrawColor(226, 232, 240); // Slate-200
  doc.setLineWidth(1);
  doc.line(margin, y, pageWidth - margin, y);
  
  // Table Header Background
  y += 25;
  doc.setFillColor(248, 250, 252); // Slate-50
  doc.rect(margin, y - 14, pageWidth - margin * 2, 22, 'F');
  
  // Table Header Text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105); // Slate-600
  doc.text('ITEM DESCRIPTION', margin + 8, y);
  doc.text('QTY', pageWidth - margin - 180, y, { align: 'right' });
  doc.text('UNIT PRICE', pageWidth - margin - 90, y, { align: 'right' });
  doc.text('AMOUNT', pageWidth - margin - 8, y, { align: 'right' });

  // Draw Items
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  
  y += 18;
  (order.items || []).forEach((it) => {
    // Draw row separator line
    doc.setDrawColor(241, 245, 249); // Slate-100
    doc.line(margin, y - 12, pageWidth - margin, y - 12);
    
    doc.text(it.foodName, margin + 8, y);
    doc.text(String(it.quantity), pageWidth - margin - 180, y, { align: 'right' });
    doc.text(formatPDFCurrency(it.unitPrice), pageWidth - margin - 90, y, { align: 'right' });
    doc.text(formatPDFCurrency(it.subtotal), pageWidth - margin - 8, y, { align: 'right' });
    y += 20;
    
    // Page break handling
    if (y > 700) {
      doc.addPage();
      y = 60;
    }
  });

  // Total Section
  y += 10;
  doc.setDrawColor(203, 213, 225); // Slate-300
  doc.setLineWidth(1.5);
  doc.line(margin, y, pageWidth - margin, y);
  
  y += 25;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('TOTAL AMOUNT DUE:', pageWidth - margin - 220, y);
  
  doc.setFontSize(13);
  doc.setTextColor(37, 99, 235); // brand-blue (Blue-600)
  doc.text(formatPDFCurrency(order.totalAmount), pageWidth - margin - 8, y, { align: 'right' });

  // Footer page positioning
  const footerY = pageHeight - 40;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184); // Slate-400
  doc.text(
    'Thank you for ordering with LBRCE Canteen! This is a computer-generated receipt.',
    pageWidth / 2, footerY - 12, { align: 'center' }
  );
  doc.text(
    'Please present this receipt at the counter to collect your order.',
    pageWidth / 2, footerY, { align: 'center' }
  );

  doc.save(`${order.orderNumber}.pdf`);
}
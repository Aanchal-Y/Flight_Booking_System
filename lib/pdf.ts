import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface TicketData {
  passengerName: string;
  airline: string;
  flightId: string;
  departureCity: string;
  arrivalCity: string;
  finalPrice: string;
  bookingDate: string;
  pnr: string;
}

export async function generateTicketPDF(ticketData: TicketData): Promise<void> {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          background: white;
        }
        .ticket-container {
          max-width: 800px;
          margin: 0 auto;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 10px;
          padding: 30px;
          color: white;
        }
        .ticket-header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid rgba(255, 255, 255, 0.3);
          padding-bottom: 20px;
        }
        .airline-name {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        .ticket-label {
          font-size: 12px;
          text-transform: uppercase;
          opacity: 0.9;
          letter-spacing: 1px;
        }
        .content-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }
        .info-block {
          background: rgba(255, 255, 255, 0.1);
          padding: 15px;
          border-radius: 8px;
        }
        .info-label {
          font-size: 11px;
          text-transform: uppercase;
          opacity: 0.8;
          letter-spacing: 0.5px;
          margin-bottom: 5px;
        }
        .info-value {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        .flight-route {
          grid-column: 1 / -1;
          background: rgba(255, 255, 255, 0.1);
          padding: 20px;
          border-radius: 8px;
          text-align: center;
        }
        .route-cities {
          display: flex;
          justify-content: space-around;
          align-items: center;
          font-size: 18px;
          font-weight: bold;
          margin: 15px 0;
        }
        .arrow {
          font-size: 24px;
        }
        .footer {
          border-top: 2px solid rgba(255, 255, 255, 0.3);
          padding-top: 20px;
          text-align: center;
          font-size: 12px;
          opacity: 0.9;
        }
      </style>
    </head>
    <body>
      <div class="ticket-container">
        <div class="ticket-header">
          <div class="airline-name">${ticketData.airline}</div>
          <div class="ticket-label">Flight Booking Confirmation</div>
        </div>
        
        <div class="content-section">
          <div class="info-block">
            <div class="info-label">Passenger Name</div>
            <div class="info-value">${ticketData.passengerName}</div>
          </div>
          
          <div class="info-block">
            <div class="info-label">Flight ID</div>
            <div class="info-value">${ticketData.flightId}</div>
          </div>
          
          <div class="flight-route">
            <div class="info-label">Route</div>
            <div class="route-cities">
              <div>${ticketData.departureCity}</div>
              <div class="arrow">→</div>
              <div>${ticketData.arrivalCity}</div>
            </div>
          </div>
          
          <div class="info-block">
            <div class="info-label">PNR</div>
            <div class="info-value">${ticketData.pnr}</div>
          </div>
          
          <div class="info-block">
            <div class="info-label">Final Price</div>
            <div class="info-value">₹${ticketData.finalPrice}</div>
          </div>
          
          <div class="info-block">
            <div class="info-label">Booking Date</div>
            <div class="info-value">${ticketData.bookingDate}</div>
          </div>
        </div>
        
        <div class="footer">
          <p>This is an electronic ticket. Please keep it safe for your records.</p>
          <p>For support, contact our customer service.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const canvas = await html2canvas(new DOMParser().parseFromString(htmlContent, 'text/html').body);
  const imgData = canvas.toDataURL('image/png');
  
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const imgWidth = 210;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
  pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
  pdf.save(`ticket_${ticketData.pnr}.pdf`);
}

export async function generateTicketPDFNode(ticketData: TicketData): Promise<Buffer> {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  // Background
  pdf.setFillColor(102, 126, 234);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');

  pdf.setTextColor(255, 255, 255);
  
  // Header
  pdf.setFontSize(24);
  pdf.text(ticketData.airline, pageWidth / 2, 20, { align: 'center' });
  
  pdf.setFontSize(10);
  pdf.text('FLIGHT BOOKING CONFIRMATION', pageWidth / 2, 28, { align: 'center' });

  // Separator
  pdf.setDrawColor(255, 255, 255);
  pdf.setLineWidth(0.5);
  pdf.line(10, 32, pageWidth - 10, 32);

  // Content
  let yPos = 45;

  const addInfoBlock = (label: string, value: string) => {
    pdf.setFontSize(9);
    pdf.setTextColor(200, 200, 200);
    pdf.text(label, 15, yPos);
    
    pdf.setFontSize(14);
    pdf.setTextColor(255, 255, 255);
    pdf.text(value, 15, yPos + 6);
    
    yPos += 18;
  };

  addInfoBlock('PASSENGER NAME', ticketData.passengerName);
  addInfoBlock('FLIGHT ID', ticketData.flightId);
  
  pdf.setFontSize(12);
  pdf.text('ROUTE', pageWidth / 2, yPos, { align: 'center' });
  yPos += 6;
  
  pdf.setFontSize(14);
  pdf.text(`${ticketData.departureCity} → ${ticketData.arrivalCity}`, pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;

  addInfoBlock('PNR', ticketData.pnr);
  addInfoBlock('FINAL PRICE', `₹${ticketData.finalPrice}`);
  addInfoBlock('BOOKING DATE', ticketData.bookingDate);

  // Footer
  pdf.setFontSize(9);
  pdf.setTextColor(200, 200, 200);
  pdf.text('This is an electronic ticket. Please keep it safe for your records.', pageWidth / 2, pageHeight - 10, { align: 'center' });

  return Buffer.from(pdf.output('arraybuffer'));
}

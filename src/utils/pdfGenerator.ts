
import { DatabaseBill } from '@/hooks/useBills';
import { ExpenditureRecord } from '@/hooks/useWorkers';

export const generateMonthlyPDF = (
  bills: DatabaseBill[],
  expenditures: ExpenditureRecord[],
  month: string,
  year: string
) => {
  const monthlyBills = bills.filter(bill => {
    const billDate = new Date(bill.date);
    return billDate.getMonth() === parseInt(month) - 1 && billDate.getFullYear() === parseInt(year);
  });

  const monthlyExpenditures = expenditures.filter(expenditure => {
    const expDate = new Date(expenditure.date);
    return expDate.getMonth() === parseInt(month) - 1 && expDate.getFullYear() === parseInt(year);
  });

  const totalBills = monthlyBills.reduce((sum, bill) => sum + bill.amount, 0);
  const totalExpenditures = monthlyExpenditures.reduce((sum, exp) => sum + exp.amount, 0);
  const grandTotal = totalBills + totalExpenditures;

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const content = `
    <html>
      <head>
        <title>Monthly Report - ${monthNames[parseInt(month) - 1]} ${year}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 10px; }
          .section { margin-bottom: 30px; }
          .section h2 { color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .summary { background-color: #f9f9f9; padding: 15px; border-radius: 5px; }
          .total { font-weight: bold; font-size: 18px; color: #2563eb; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Monthly Construction Report</h1>
          <h2>${monthNames[parseInt(month) - 1]} ${year}</h2>
        </div>

        <div class="section">
          <h2>Bills Summary</h2>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Shop Name</th>
                <th>Material</th>
                <th>Amount (₹)</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              ${monthlyBills.map(bill => `
                <tr>
                  <td>${new Date(bill.date).toLocaleDateString('en-IN')}</td>
                  <td>${bill.shop_name}</td>
                  <td>${bill.material}</td>
                  <td>₹${bill.amount.toLocaleString()}</td>
                  <td>${bill.location || '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="summary">
            <strong>Total Bills: ₹${totalBills.toLocaleString()}</strong>
          </div>
        </div>

        <div class="section">
          <h2>Worker Expenditures</h2>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Worker Phone</th>
                <th>Amount (₹)</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              ${monthlyExpenditures.map(exp => `
                <tr>
                  <td>${new Date(exp.date).toLocaleDateString('en-IN')}</td>
                  <td>${exp.worker?.phone || '-'}</td>
                  <td>₹${exp.amount.toLocaleString()}</td>
                  <td>${exp.notes || '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="summary">
            <strong>Total Expenditures: ₹${totalExpenditures.toLocaleString()}</strong>
          </div>
        </div>

        <div class="section">
          <div class="summary total">
            Grand Total: ₹${grandTotal.toLocaleString()}
          </div>
        </div>
      </body>
    </html>
  `;

  const blob = new Blob([content], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `monthly-report-${monthNames[parseInt(month) - 1]}-${year}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

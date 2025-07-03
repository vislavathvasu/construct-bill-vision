import React, { useState, useMemo } from 'react';
import { X, Calendar, DollarSign, Calculator, Download, Plus, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAttendance } from '@/hooks/useAttendance';
import { useWorkers } from '@/hooks/useWorkers';
import { Worker } from '@/hooks/useWorkers';
import AddAdvanceForm from './AddAdvanceForm';
import EditDailyWageModal from './EditDailyWageModal';
import jsPDF from 'jspdf';

interface WorkerSalaryModalProps {
  worker: Worker;
  onClose: () => void;
}

const WorkerSalaryModal: React.FC<WorkerSalaryModalProps> = ({ worker, onClose }) => {
  const { getWorkerAttendance, getWorkerAdvances } = useAttendance();
  const { expenditureRecords, updateWorker } = useWorkers();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showAdvanceForm, setShowAdvanceForm] = useState(false);
  const [showEditWage, setShowEditWage] = useState(false);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const attendanceData = useMemo(() => {
    const attendance = getWorkerAttendance(worker.id, selectedMonth.toString(), selectedYear.toString());
    const presentDays = attendance.filter(record => record.status === 'present').length;
    const absentDays = attendance.filter(record => record.status === 'absent').length;
    const totalDaysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    const notMarked = totalDaysInMonth - presentDays - absentDays;
    
    return {
      attendance,
      presentDays,
      absentDays,
      notMarked,
      totalDaysInMonth
    };
  }, [worker.id, selectedMonth, selectedYear, getWorkerAttendance]);

  const salaryData = useMemo(() => {
    const advances = getWorkerAdvances(worker.id, selectedMonth.toString(), selectedYear.toString());
    const totalAdvances = advances.reduce((sum, advance) => sum + advance.amount, 0);
    
    // Get expenditure records for the worker for the selected month
    const workerExpenditures = expenditureRecords.filter(record => {
      const recordDate = new Date(record.date + 'T00:00:00'); // Add time to avoid timezone shift
      return record.worker_id === worker.id &&
             recordDate.getMonth() === selectedMonth - 1 &&
             recordDate.getFullYear() === selectedYear;
    });
    const totalExpenditure = workerExpenditures.reduce((sum, record) => sum + record.amount, 0);
    
    const monthlyIncome = attendanceData.presentDays * (worker.daily_wage || 0);
    const netPayable = monthlyIncome - totalExpenditure;
    
    // Calculate advance balance if expenditure exceeds income
    const advanceBalance = totalExpenditure > monthlyIncome ? totalExpenditure - monthlyIncome : 0;
    
    return {
      advances,
      totalAdvances,
      totalExpenditure,
      workerExpenditures,
      monthlyIncome,
      netPayable,
      advanceBalance
    };
  }, [worker, selectedMonth, selectedYear, attendanceData.presentDays, getWorkerAdvances, expenditureRecords]);

  const generateCalendar = () => {
    const firstDay = new Date(selectedYear, selectedMonth - 1, 1);
    const lastDay = new Date(selectedYear, selectedMonth, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const calendar = [];
    const currentDate = new Date(startDate);
    
    for (let week = 0; week < 6; week++) {
      const weekDays = [];
      for (let day = 0; day < 7; day++) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const attendanceRecord = attendanceData.attendance.find(record => record.date === dateStr);
        const isCurrentMonth = currentDate.getMonth() === selectedMonth - 1;
        
        weekDays.push({
          date: new Date(currentDate),
          dateStr,
          day: currentDate.getDate(),
          isCurrentMonth,
          status: attendanceRecord?.status,
        });
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
      calendar.push(weekDays);
      
      if (currentDate > lastDay && week > 3) break;
    }
    
    return calendar;
  };

  const calendar = generateCalendar();

  const handleAdvanceAdded = () => {
    setShowAdvanceForm(false);
  };

  const generatePDF = () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.width;
    
    // Title
    pdf.setFontSize(20);
    pdf.text('MONTHLY REPORT', pageWidth / 2, 20, { align: 'center' });
    
    pdf.setFontSize(16);
    pdf.text(`${monthNames[selectedMonth - 1]} ${selectedYear}`, pageWidth / 2, 30, { align: 'center' });
    
    // Worker Info
    pdf.setFontSize(14);
    pdf.text(`Worker: ${worker.name}`, 20, 50);
    pdf.text(`Daily Wage: ₹${worker.daily_wage}`, 20, 60);
    
    // Attendance Summary
    pdf.setFontSize(12);
    pdf.text('ATTENDANCE SUMMARY:', 20, 80);
    pdf.text(`Present Days: ${attendanceData.presentDays}`, 30, 90);
    pdf.text(`Absent Days: ${attendanceData.absentDays}`, 30, 100);
    pdf.text(`Total Days in Month: ${attendanceData.totalDaysInMonth}`, 30, 110);
    
    // Financial Summary
    pdf.text('FINANCIAL SUMMARY:', 20, 130);
    pdf.text(`Monthly Income: ₹${salaryData.monthlyIncome.toLocaleString()} (${attendanceData.presentDays} days × ₹${worker.daily_wage})`, 30, 140);
    pdf.text(`Total Expenditure: ₹${salaryData.totalExpenditure.toLocaleString()}`, 30, 150);
    
    if (salaryData.advanceBalance > 0) {
      pdf.text(`Total Advance: ₹${salaryData.advanceBalance.toLocaleString()}`, 30, 160);
    } else {
      pdf.text(`Net Payable: ₹${Math.abs(salaryData.netPayable).toLocaleString()}`, 30, 160);
    }
    
    // Expenditure Records
    let currentYPos = 180;
    if (salaryData.workerExpenditures.length > 0) {
      pdf.text('EXPENDITURE RECORDS:', 20, currentYPos);
      currentYPos += 10;
      
      salaryData.workerExpenditures.forEach((exp, index) => {
        if (currentYPos > 250) {
          pdf.addPage();
          currentYPos = 20;
        }
        pdf.text(`${new Date(exp.date).toLocaleDateString()}: ₹${exp.amount.toLocaleString()}${exp.notes ? ' - ' + exp.notes : ''}`, 30, currentYPos);
        currentYPos += 10;
      });
    }
    
    // Attendance Calendar
    let calendarYPos = salaryData.workerExpenditures.length > 0 ? currentYPos + 20 : 200;
    if (calendarYPos > 200) {
      pdf.addPage();
      calendarYPos = 20;
    }
    
    pdf.text('ATTENDANCE CALENDAR:', 20, calendarYPos);
    calendarYPos += 20;
    
    // Calendar grid
    calendar.forEach((week, weekIndex) => {
      if (calendarYPos > 250) {
        pdf.addPage();
        calendarYPos = 20;
      }
      
      const weekText = week
        .filter(day => day.isCurrentMonth)
        .map(day => `${day.day}${day.status ? (day.status === 'present' ? '✓' : '✗') : '-'}`)
        .join(' ');
      
      if (weekText) {
        pdf.text(weekText, 30, calendarYPos);
        calendarYPos += 10;
      }
    });

    // Download the PDF
    pdf.save(`${worker.name}_${monthNames[selectedMonth - 1]}_${selectedYear}_Report.pdf`);
  };

  const handleUpdateDailyWage = async (workerId: string, newWage: number) => {
    try {
      await updateWorker(workerId, {
        name: worker.name,
        photo_url: worker.photo_url,
        phone: worker.phone,
        address: worker.address,
        daily_wage: newWage
      });
      setShowEditWage(false);
    } catch (error) {
      console.error('Failed to update daily wage:', error);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
            <div className="flex items-center space-x-4">
              {worker.photo_url ? (
                <img 
                  src={worker.photo_url} 
                  alt="Worker"
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-lg font-medium text-gray-600">
                    {worker.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <h2 className="text-xl font-bold text-gray-800">{worker.name}</h2>
                <div className="flex items-center space-x-2">
                  <p className="text-gray-600">Daily Wage: ₹{worker.daily_wage}</p>
                  <Button
                    onClick={() => setShowEditWage(true)}
                    variant="ghost"
                    size="sm"
                    className="p-1 h-6 w-6 text-blue-500 hover:text-blue-700"
                  >
                    <Edit size={12} />
                  </Button>
                </div>
              </div>
            </div>
            <Button onClick={onClose} variant="ghost" size="sm">
              <X size={20} />
            </Button>
          </div>

          <div className="p-6">
            {/* Month/Year Selection */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <Calendar size={20} className="text-gray-500" />
                <Select 
                  value={selectedMonth.toString()} 
                  onValueChange={(value) => setSelectedMonth(parseInt(value))}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {monthNames.map((month, index) => (
                      <SelectItem key={index + 1} value={(index + 1).toString()}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select 
                  value={selectedYear.toString()} 
                  onValueChange={(value) => setSelectedYear(parseInt(value))}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={() => setShowAdvanceForm(true)}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Plus size={16} className="mr-2" />
                Add Advance
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Attendance Calendar */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Attendance Calendar</h3>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="text-center text-sm font-medium text-gray-600 p-2">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  {calendar.map((week, weekIndex) => (
                    <div key={weekIndex} className="grid grid-cols-7 gap-1 mb-1">
                      {week.map((day, dayIndex) => (
                        <div
                          key={dayIndex}
                          className={`
                            text-center p-2 text-sm rounded
                            ${!day.isCurrentMonth ? 'text-gray-300' : 'text-gray-700'}
                            ${day.status === 'present' ? 'bg-green-200 text-green-800' : ''}
                            ${day.status === 'absent' ? 'bg-red-200 text-red-800' : ''}
                            ${day.isCurrentMonth && !day.status ? 'bg-white border border-gray-200' : ''}
                          `}
                        >
                          {day.day}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Attendance Summary */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="text-green-800 font-semibold">Present Days</div>
                    <div className="text-2xl font-bold text-green-600">{attendanceData.presentDays}</div>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="text-red-800 font-semibold">Absent Days</div>
                    <div className="text-2xl font-bold text-red-600">{attendanceData.absentDays}</div>
                  </div>
                </div>
              </div>

              {/* Salary Calculation */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Salary Calculation</h3>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-800 font-medium">Monthly Income</span>
                    <span className="text-xl font-bold text-blue-600">₹{salaryData.monthlyIncome.toLocaleString()}</span>
                  </div>
                  <div className="text-sm text-blue-600">
                    {attendanceData.presentDays} days × ₹{worker.daily_wage}
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-orange-800 font-medium">Total Expenditure</span>
                    <span className="text-xl font-bold text-orange-600">₹{salaryData.totalExpenditure.toLocaleString()}</span>
                  </div>
                  {salaryData.workerExpenditures.length > 0 && (
                    <div className="space-y-1">
                      {salaryData.workerExpenditures.map((expenditure) => (
                        <div key={expenditure.id} className="text-sm text-orange-600 flex justify-between">
                          <span>{new Date(expenditure.date).toLocaleDateString()}</span>
                          <span>₹{expenditure.amount.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {salaryData.advanceBalance > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-red-800">Total Advance</span>
                      <span className="text-2xl font-bold text-red-600">
                        ₹{salaryData.advanceBalance.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm text-red-600 mt-1">
                      Expenditure exceeds income
                    </div>
                  </div>
                )}

                <div className={`border-2 rounded-lg p-4 ${
                  salaryData.netPayable >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`font-bold ${
                      salaryData.netPayable >= 0 ? 'text-green-800' : 'text-red-800'
                    }`}>
                      Net {salaryData.netPayable >= 0 ? 'Payable' : 'Outstanding'}
                    </span>
                    <span className={`text-2xl font-bold ${
                      salaryData.netPayable >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ₹{Math.abs(salaryData.netPayable).toLocaleString()}
                    </span>
                  </div>
                </div>

                <Button 
                  onClick={generatePDF}
                  className="w-full bg-purple-500 hover:bg-purple-600"
                >
                  <Download size={16} className="mr-2" />
                  Export Monthly Report (PDF)
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAdvanceForm && (
        <AddAdvanceForm
          selectedWorkerId={worker.id}
          onSave={handleAdvanceAdded}
          onCancel={() => setShowAdvanceForm(false)}
        />
      )}

      {showEditWage && (
        <EditDailyWageModal
          worker={worker}
          onSave={handleUpdateDailyWage}
          onClose={() => setShowEditWage(false)}
        />
      )}
    </>
  );
};

export default WorkerSalaryModal;





"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function LeaveRequestForm({ employeeName, onClose }) {
  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
    numberOfDays: 0,
  });
  const [leaveBalances, setLeaveBalances] = useState(null);
  const [selectedLeaveBalance, setSelectedLeaveBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [overlapWarning, setOverlapWarning] = useState("");
  const [exceedsLeaveWarning, setExceedsLeaveWarning] = useState("");
  const [leaveMode, setLeaveMode] = useState("single"); // 'single' or 'multiple'
  const [multipleLeaves, setMultipleLeaves] = useState([]); // For multiple leave entries
  const [isDisclaimerAgreed, setIsDisclaimerAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const uniqueId = localStorage.getItem("uniqueId");

  useEffect(() => {
    const fetchLeaveBalances = async () => {
      try {
        if (!uniqueId) {
          console.error("Unique ID not found in localStorage.");
          setError("Please log in again.");
          setLoading(false);
          return;
        }
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/employee/employees/${uniqueId}/leave-balances`
        );
        if (response.data.success) {
          setLeaveBalances(response.data.data);
        } else {
          setError(response.data.message || "Failed to fetch leave balances.");
        }
      } catch (error) {
        console.error("Error fetching leave balances:", error);
        setError("An error occurred while fetching leave balances. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchLeaveBalances();
  }, [uniqueId]);

  let debounceTimeout;
  const debounce = (func, delay) => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(func, delay);
  };

  const checkForOverlaps = async (startDate, endDate) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/check-overlaps`, {
        params: { start_date: startDate, end_date: endDate },
      });
      if (response.data.message === "Overlap detected") {
        setOverlapWarning("The selected dates overlap with existing leave requests.");
      } else {
        setOverlapWarning("");
      }
    } catch (error) {
      console.error("Error checking overlaps:", error);
      setOverlapWarning("An error occurred while checking for overlaps.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const newData = { ...prevData, [name]: value };
      if (name === "startDate" || name === "endDate") {
        const currentStartDate = name === "startDate" ? value : prevData.startDate;
        const currentEndDate = name === "endDate" ? value : prevData.endDate;
        if (currentStartDate && currentEndDate) {
          const start = new Date(currentStartDate);
          const end = new Date(currentEndDate);
          const dayDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
          newData.numberOfDays = dayDiff > 0 ? dayDiff : 0;
        } else {
          newData.numberOfDays = 0;
        }
      }

      // Real-time leave balance validation
      if (
        selectedLeaveBalance !== null &&
        newData.numberOfDays > 0 &&
        formData.leaveType !== "LOP" &&
        formData.leaveType !== "Week Off"
      ) {
        const remainingAfterRequest = selectedLeaveBalance - newData.numberOfDays;
        if (remainingAfterRequest < 0) {
          setExceedsLeaveWarning("Requested leave exceeds your available balance.");
        } else {
          setExceedsLeaveWarning("");
        }
      } else {
        setExceedsLeaveWarning("");
      }

      return newData;
    });

    if (name === "leaveType") {
      if (value === "LOP" || value === "Week Off") {
        setSelectedLeaveBalance(null);
        setExceedsLeaveWarning("");
      } else if (leaveBalances) {
        const leaveFieldMapping = {
          "Paid Leave": "annual_leave",
          "Festive Leave": "sick_leave",
          "Casual Leave": "casual_leave",
        };
        const selectedField = leaveFieldMapping[value];
        const selectedBalance = leaveBalances[selectedField];
        setSelectedLeaveBalance(selectedBalance);
        if (formData.numberOfDays > 0 && selectedBalance - formData.numberOfDays < 0) {
          setExceedsLeaveWarning("Requested leave exceeds your available balance.");
        } else {
          setExceedsLeaveWarning("");
        }
      }
    }

    if (name === "startDate" || name === "endDate") {
      const currentStartDate = name === "startDate" ? value : formData.startDate;
      const currentEndDate = name === "endDate" ? value : formData.endDate;
      if (currentStartDate && currentEndDate) {
        debounce(() => checkForOverlaps(currentStartDate, currentEndDate), 500);
      }
    }
  };

  const handleAddLeaveEntry = () => {
    setMultipleLeaves([...multipleLeaves, { date: "", leaveType: "" }]);
  };

  const handleMultipleLeaveChange = (index, field, value) => {
    const updatedLeaves = [...multipleLeaves];
    updatedLeaves[index][field] = value;
    setMultipleLeaves(updatedLeaves);
  };

  const handleRemoveLeaveEntry = (index) => {
    const updatedLeaves = multipleLeaves.filter((_, i) => i !== index);
    setMultipleLeaves(updatedLeaves);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      if (leaveMode === "single") {
        if (
          !formData.leaveType ||
          !formData.startDate ||
          !formData.endDate ||
          !formData.reason ||
          formData.numberOfDays <= 0
        ) {
          alert("All fields are required and the number of days must be greater than zero.");
          return;
        }
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/leave-requests`, {
          unique_id: uniqueId,
          leave_type: formData.leaveType,
          start_date: formData.startDate,
          end_date: formData.endDate,
          reason: formData.reason,
          number_of_days: formData.numberOfDays,
        });
        if (response.data.success) {
          alert("Leave request submitted successfully!");
          onClose();
        } else {
          alert(response.data.message || "Failed to submit leave request.");
        }
      } else {
        if (multipleLeaves.some((leave) => !leave.date || !leave.leaveType)) {
          alert("All leave entries must have a valid date and leave type.");
          return;
        }
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/multiple-leave-requests`,
          {
            unique_id: uniqueId,
            leaves: multipleLeaves.map((leave) => ({
              date: leave.date,
              leave_type: leave.leaveType,
            })),
            reason: formData.reason,
          }
        );
        if (response.data.success) {
          alert("Multiple leave requests submitted successfully!");
          onClose();
        } else {
          alert(response.data.message || "Failed to submit multiple leave requests.");
        }
      }
    } catch (error) {
      console.error("Error submitting leave request:", error);
      alert("An error occurred while submitting the leave request. Please try again.");
    }finally {
    setIsSubmitting(false);
  }
  };

  const isSubmitDisabled =
    (selectedLeaveBalance !== null && selectedLeaveBalance <= 0) || exceedsLeaveWarning !== "";

  if (loading) return <p className="text-center text-blue-700 font-medium">Loading...</p>;
  if (error) return <p className="text-center text-red-500 font-medium">{error}</p>;

    // Disclaimer Component
  if (!isDisclaimerAgreed) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl h-[80vh] overflow-y-auto relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-xl font-bold text-blue-700 mb-4">Leave Policy Disclaimer</h2>
          <div className="space-y-6">
            {/* PAID LEAVES */}
            <div>
              <h3 className="text-lg font-semibold text-blue-700 mb-2">PAID LEAVES</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                <li>The utilization of paid leaves is restricted until six months from the date of joining.</li>
                <li>The maximum consecutive days for paid leave cannot exceed seven.</li>
                <li>Requests for paid leaves should be made exclusively through email to the HR.</li>
                <li>A request for paid leave must be submitted at least seven days in advance.</li>
                <li>Paid leaves are not permissible during the notice period and cannot be encashed.</li>
                <li>Paid leaves remain valid until the date of your resignation and do not expire.</li>
                <li>Paid leaves will be carried forward to the following year at the end of the year, specifically in December.</li>
              </ul>
            </div>

            {/* FESTIVE LEAVES */}
            <div>
              <h3 className="text-lg font-semibold text-blue-700 mb-2">FESTIVE LEAVES</h3>
              <ol className="list-decimal pl-5 space-y-1 text-sm text-gray-700">
                <li>If you choose to take a week off that overlaps with a festive off on the same day, it will be considered as having been used.</li>
                <li>It is necessary to request a festive off before the schedule for that week is live in order to use it.</li>
                <li>You are limited to using a maximum of two consecutive festive offs.</li>
                <li>Requests for Festive leaves should be made exclusively through email to the HR.</li>
                <li>If a request for festive leave is denied for any reason, and its approaching its expiration date, the expiration cannot be prolonged.</li>
                <li>Once you have exhausted your six festive offs, taking leave on a festival day later to that will result in Loss of Pay (LOP).</li>
              </ol>
            </div>

            {/* CASUAL LEAVES */}
            <div>
              <h3 className="text-lg font-semibold text-blue-700 mb-2">CASUAL LEAVES</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                <li>One leave will be credited every 2 months.</li>
                <li>The maximum consecutive days for casual leave cannot exceed two.</li>
                <li>Requests for casual leaves should be made exclusively through email to the HR.</li>
                <li>It is necessary to request a casual leave before the schedule for that week is live in order to use it.</li>
                <li>Casual leaves are not permissible during the training / notice period and cannot be encashed.</li>
                <li>Casual leaves remain valid until the end of the year and will not be carried forward.</li>
                <li>If a request for Casual leave is denied for any reason, and its approaching its expiration date, the expiration cannot be prolonged.</li>
              </ul>
            </div>

            {/* LAST MINUTE LOPs */}
            <div>
              <h3 className="text-lg font-semibold text-red-700 mb-2">LAST Minute LOPs</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                <li>If you take more than 2 days of loss of pay(LOP) in a single month after the schedule is live, any additional LOP days will be counted as double LOP.</li>
                <li>This means additional absences beyond the first two days will result in twice the salary deduction.</li>
              </ul>
              {/* <p className="text-sm text-gray-700">
                If you take more than 2 days of loss of pay(LOP) in a single month after the schedule is live, any additional LOP days will be counted as double LOP.
                <p>This means additional absences beyond the first two days will result in twice the salary deduction</p>
              </p> */}
            </div>

            {/* LEAVES DURING NOTICE PERIOD */}
            <div>
              <h3 className="text-lg font-semibold text-red-700 mb-2">LEAVES DURING NOTICE PERIOD</h3>
              <p className="text-sm text-gray-700">
                Any leave taken during the notice period will result in a deduction of 2 days pay.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsDisclaimerAgreed(true)}
            className="w-full px-4 py-2 mt-4 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700 transition duration-200"
          >
            I Agree
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md relative mx-auto my-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold text-blue-800 mb-6">Request Leave - {employeeName}</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Radio Buttons for Leave Mode */}
          <div className="flex space-x-6">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="leaveMode"
                value="single"
                checked={leaveMode === "single"}
                onChange={() => setLeaveMode("single")}
                className="form-radio text-blue-600"
              />
              <span className="ml-2 text-gray-700 font-medium">Single Leave Type</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="leaveMode"
                value="multiple"
                checked={leaveMode === "multiple"}
                onChange={() => setLeaveMode("multiple")}
                className="form-radio text-blue-600"
              />
              <span className="ml-2 text-gray-700 font-medium">Multiple Leave Types</span>
            </label>
          </div>

          {/* Single Leave Type Form */}
          {leaveMode === "single" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Leave Type</label>
                <select
                  name="leaveType"
                  value={formData.leaveType}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Select Leave Type</option>
                  <option value="LOP">Loss of Pay (LOP)</option>
                  <option value="Week Off">Week Off</option>
                  <option value="Paid Leave">Paid Leave</option>
                  <option value="Festive Leave">Festive Leave</option>
                  <option value="Casual Leave">Casual Leave</option>
                </select>
              </div>
              {formData.leaveType &&
                formData.leaveType !== "LOP" &&
                formData.leaveType !== "Week Off" &&
                leaveBalances && (
                  <p className="text-sm text-gray-600">
                    Remaining {formData.leaveType}:{" "}
                    {selectedLeaveBalance !== null ? selectedLeaveBalance : "Loading..."}
                  </p>
                )}
              

<div>
  <label className="block text-sm font-medium text-gray-700">Start Date</label>
  <input
    type="date"
    name="startDate"
    value={formData.startDate}
    onChange={handleInputChange}
    min={new Date().toISOString().split("T")[0]} // 🔒 Prevent past dates
    className="mt-1 block w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    required
  />
</div>

<div>
  <label className="block text-sm font-medium text-gray-700">End Date</label>
  <input
    type="date"
    name="endDate"
    value={formData.endDate}
    onChange={handleInputChange}
    min={formData.startDate || new Date().toISOString().split("T")[0]} 
    className="mt-1 block w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    required
  />
</div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Number of Days</label>
                <input
                  type="text"
                  value={formData.numberOfDays || 0}
                  readOnly
                  className="mt-1 block w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
                />
              </div>
              {overlapWarning && (
                <div className="rounded-md bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-yellow-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.778-.377 1.667-.377 2.444 0l2.082 1.041a1 1 0 010 1.882l-2.082 1.041a4.106 4.106 0 01-2.444 0L6.816 6.98a1 1 0 010-1.882l2.082-1.041zM10 15a1 1 0 100-2 1 1 0 000 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700 font-medium">{overlapWarning}</p>
                    </div>
                  </div>
                </div>
              )}
              {exceedsLeaveWarning && (
                <div className="rounded-md bg-red-50 border-l-4 border-red-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700 font-medium">{exceedsLeaveWarning}</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Multiple Leave Type Form */}
          {leaveMode === "multiple" && (
            <div>
              {multipleLeaves.map((leave, index) => (
                <div key={index} className="flex space-x-4 mb-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <input
                      type="date"
                      value={leave.date}
                      onChange={(e) => handleMultipleLeaveChange(index, "date", e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="mt-1 block w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Leave Type</label>
                    <select
                      value={leave.leaveType}
                      onChange={(e) => handleMultipleLeaveChange(index, "leaveType", e.target.value)}
                      className="mt-1 block w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="">Select Leave Type</option>
                      <option value="LOP">Loss of Pay (LOP)</option>
                      <option value="Week Off">Week Off</option>
                      <option value="Paid Leave">Paid Leave</option>
                      <option value="Festive Leave">Festive Leave</option>
                      <option value="Casual Leave">Casual Leave</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveLeaveEntry(index)}
                    className="self-end mt-7 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddLeaveEntry}
                className="w-full px-4 py-2 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700 transition duration-200"
              >
                Add Another Leave Entry
              </button>
            </div>
          )}

          {/* Common Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Reason</label>
            <textarea
              rows="3"
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter reason for leave..."
            ></textarea>
          </div>

          {/* Submit Button */}
          {/* <button
            type="submit"
            disabled={isSubmitDisabled}
            title={
              isSubmitDisabled
                ? "Leave request exceeds available balance or balance is zero."
                : ""
            }
            className={`w-full px-4 py-3 rounded-md font-medium transition duration-200 ${
              isSubmitDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Submit Request
          </button> */}

<button
  type="submit"
  disabled={isSubmitting}
  className={`w-full px-4 py-3 rounded-md font-medium transition duration-200 ${
    isSubmitting
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-blue-600 hover:bg-blue-700 text-white"
  }`}
>
  {isSubmitting ? (
    <span className="flex items-center justify-center">
      <svg
        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V2a10 10 0 1010 10h-2zm4-8a8 8 0 011.71 15.29L10 17.7V19a8 8 0 11-6-14z"
        ></path>
      </svg>
      Submitting...
    </span>
  ) : leaveMode === "single" ? "Submit Request" : "Submit Multiple Requests"}
</button>
        </form>
      </div>
    </div>
  );
}


















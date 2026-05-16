import { useEffect, useState } from "react";
import { getLeaveTypes, postLeaveRequest } from "../services/employeeService";

const LeaveRequestForm = ({ onSuccess }) => {
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // 1. One state object to track all form fields
    const [formData, setFormData] = useState({
        leave_type_id: "",
        start_date: "",
        end_date: "",
        reason: ""
    });

    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    // Fetch dropdown list data on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getLeaveTypes();
                setLeaveTypes(response.data);
            } catch (err) {
                console.error("Failed to load leave types", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // 2. Dynamic input handler to update form fields smoothly
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // 3. Submit Handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        try {
            // Send tracking data safely to Laravel backend
            const response = await postLeaveRequest(formData);
            
            setMessage(response.data.message || "Leave request submitted successfully!");
            
            // Clear form inputs after success
            setFormData({ leave_type_id: "", start_date: "", end_date: "", reason: "" });
            if (onSuccess) {
                await onSuccess(); 
            }
        } catch (err) {
            // Capture any validation errors thrown by your Laravel store() validations
            setError(err.response?.data?.error || err.response?.data?.message || "An error occurred");
        }
    };

    if (loading) return <p className="text-center mt-10">Loading form properties...</p>;

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Submit a Leave Request</h2>
            
            {message && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{message}</div>}
            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

            <form onSubmit={handleSubmit}>
                {/* Leave Type Dropdown */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Leave Type</label>
                    <select 
                        name="leave_type_id"
                        value={formData.leave_type_id}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md bg-gray-50"
                        required
                    >
                        <option value="">Select leave type</option>
                        {leaveTypes.map((type) => (
                            <option key={type.id} value={type.id}>{type.name}</option>
                        ))}
                    </select>
                </div>

                {/* Start Date */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Start Date</label>
                    <input 
                        type="date" 
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md bg-gray-50"
                        required
                    />
                </div>

                {/* End Date */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">End Date</label>
                    <input 
                        type="date" 
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md bg-gray-50"
                        required
                    />
                </div>

                {/* Reason */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Reason</label>
                    <textarea 
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md bg-gray-50"
                        rows="3"
                        placeholder="Optional reason details..."
                    />
                </div>

                <button 
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-200"
                >
                    Submit Request
                </button>
            </form>
        </div>
    );
};

export default LeaveRequestForm;
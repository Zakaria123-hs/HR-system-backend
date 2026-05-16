import LogoutButton from "./LogoutButton"
import { getMyBalances, getMyNotifications, getMyRequests } from "../services/employeeService"
import { useState, useEffect } from "react"
import LeaveRequestForm from "../components/LeaveRequestForm";
const EmployeeDashboard = () => {
    const [balances, setBalances] = useState([]);
    const [requests, setRequests] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    
    const fetchData = async () => {
        try {
            const [balancesRes, requestsRes, notificationsRes] = await Promise.all([
                getMyBalances(),
                getMyRequests(),
                getMyNotifications(),
            ]);
            setBalances(balancesRes.data.myBalance);
            setRequests(requestsRes.data.my_requests);
            setNotifications(notificationsRes.data.notifications);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);


    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <LogoutButton />
            <h1>Employee Dashboard</h1>

            {/* Balances */}
            <section>
                <h2>Leave Balances</h2>
                {balances.length === 0 ? <p>No balances found.</p> : (
                    <ul>
                        {balances.map((balance, index) => (
                            <li key={index}>
                                {balance.leave_type}: {balance.remaining_days} days remaining
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {/* Leave Requests */}
            <section>
                <h2>My Leave Requests</h2>
                {requests.length === 0 ? <p>No requests found.</p> : (
                    <ul>
                        {requests.map((req) => (
                            <li key={req.id}>
                                {req.leave_type} | {req.start_date} → {req.end_date} | Status: {req.status}
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {/* Notifications */}
            <section>
                <h2>Notifications</h2>
                {notifications.length === 0 ? <p>No notifications.</p> : (
                    <ul>
                        {notifications.map((notif) => (
                            <li key={notif.id}>
                                {notif.message}
                            </li>
                        ))}
                    </ul>
                )}
            </section>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <LeaveRequestForm onSuccess={fetchData}/>
        </div>
    );
};

export default EmployeeDashboard;

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RequestCard from "../components/RequestCard";
import "./ItemDetails.css";

function ItemDetails() {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [requests, setRequests] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [message, setMessage] = useState("");

    // TEMP: Replace with real user when auth is built
    const LOGGED_IN_USER_ID = 1;

    const fetchItemDetails = async () => {
        const res = await fetch(`/api/items/${id}`);
        const data = await res.json();
        setItem(data);
    };

    const fetchItemRequests = async () => {
        const res = await fetch(`/api/items/${id}/requests`);
        const data = await res.json();
        setRequests(data);
    };

    useEffect(() => {
        fetchItemDetails();
        fetchItemRequests();
    }, [id]);

    const updateRequestStatus = async (requestId, newStatus) => {
        await fetch(`/api/requests/${requestId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
        });
        fetchItemRequests();
    };

    const submitNewRequest = async () => {
        await fetch(`/api/requests`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                item_id: id,
                borrower_id: LOGGED_IN_USER_ID,
                message,
            }),
        });

        setMessage("");
        setShowForm(false);
        fetchItemRequests();
    };

    if (!item) return <div>Loading item...</div>;

    return (
        <>
            <div className="item-details">
                <h1>{item.title}</h1>
                <img src={item.image_url} width="250" />
                <p><strong>Description:</strong> {item.description}</p>
                <p><strong>Category:</strong> {item.category}</p>
                <p><strong>Location:</strong> {item.location}</p>
                <p><strong>Price:</strong> ${item.rent_price}</p>
                <p><strong>Owner:</strong> {item.user_id}</p>
            </div>

            <hr />

            {/* Request Item Button */}
            {item.user_id !== LOGGED_IN_USER_ID && (
                <div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        style={{ border: "none" }}
                    >
                        {showForm ? "Cancel Request" : "Request Item"}
                    </button>
                </div>
            )}

            {/* Form */}
            {showForm && (
                <div className="request-form">
                    <textarea
                        placeholder="Write your message to the owner..."
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        style={{ width: "100%", height: "80px", marginBottom: "10px" }}
                    />

                    <button 
                        onClick={submitNewRequest}
                        style={{
                            padding: "10px 15px",
                            background: "green",
                            color: "white",
                            borderRadius: "6px",
                            border: "none"
                        }}
                    >
                        Submit Request
                    </button>
                </div>
            )}

            <h2>Requests for This Item</h2>

            {requests.length === 0 && <p>No requests yet.</p>}

            {requests.map(req => (
                <RequestCard 
                    key={req.id}
                    req={req}
                    onUpdate={updateRequestStatus}
                />
            ))}
        </>
    );
}

export default ItemDetails;

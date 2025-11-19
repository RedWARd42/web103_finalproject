export default function RequestCard({ req, onUpdate }) {
    return (
        <div className="request-card">
            <p><strong>Borrower ID:</strong> {req.borrower_id}</p>
            <p><strong>Status:</strong> {req.status}</p>
            <p><strong>Message:</strong> {req.message}</p>
            <p><strong>Requested On:</strong> {new Date(req.created_at).toLocaleDateString()}</p>

            {req.status === "pending" && (
                <div style={{ display: "flex", gap: "10px" }}>
                    <button 
                        onClick={() => onUpdate(req.id, "accepted")}
                        style={{ background: "green", color: "white", padding: "6px 12px" }}
                    >
                        Accept
                    </button>

                    <button 
                        onClick={() => onUpdate(req.id, "rejected")}
                        style={{ background: "red", color: "white", padding: "6px 12px" }}
                    >
                        Reject
                    </button>
                </div>
            )}
        </div>
    );
}

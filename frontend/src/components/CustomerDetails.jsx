export default function CustomerDetails({ customer, onClick }) {
    if (!customer) return null;
    const Gender = {
        0 : "Male",
        1 : "Female",
        2 : "Other",
    }
    
    const formatDateTime = (date) => date ? new Date(date).toLocaleString() : "";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Customer Details</h2>
                    <button
                        onClick={() => onClick(null)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>
                <div className="p-6 space-y-2">
                    <p>
                        <strong>Name:</strong> {customer.name}
                    </p>
                    <p>
                        <strong>Gender:</strong> {Gender[customer.gender]}
                    </p>
                    <p>
                        <strong>Phone:</strong> {customer.phone}
                    </p>
                    <p>
                        <strong>Age:</strong> {customer.age}
                    </p>
                    <div>
                        <strong>Measurements:</strong>
                        <ul className="list-disc ml-5">
                            {customer.data &&
                                Object.entries(customer.data).map(
                                    ([key, value]) => (
                                        <li key={key}>
                                            {key}: {value}
                                        </li>
                                    )
                                )}
                        </ul>
                    </div>
                    <p>
                        <strong>Last Updated:</strong> {formatDateTime(customer.lastUpdated)}
                    </p>
                </div>
                <div className="p-4 border-t text-right">
                    <button
                        onClick={() => onClick(null)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
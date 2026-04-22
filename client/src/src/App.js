import axios from "axios";
import { useEffect, useState } from "react";

function App() {

    const [message, setMessage] = useState("");

    useEffect(() => {

        axios.get("http://localhost:5000/")
            .then(res => {
                setMessage(res.data)
            })

    }, [])

    return (
        <div>
            <h1>{message}</h1>
        </div>
    )

}

export default App;
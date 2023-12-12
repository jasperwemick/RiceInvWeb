import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Link } from "react-router-dom";
 
export default function Edit() {

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [ricePoints, setRicePoints] = useState("")
    const [file, setFile] = useState()

    const [url, setUrl] = useState("")

    const params = useParams();
    const navigate = useNavigate();
 
    useEffect(() => {
        async function fetchData() {
            const id = params.id.toString();
            try {
                const response = await fetch(`http://127.0.0.1:4000/api/profiles/${id}`);
                const profile = await response.json();

                setName(profile.name);
                setDescription(profile.description);
                setRicePoints(profile.ricePoints);
                setUrl(profile.imageUrl)
            }
            catch(err) {
                const message = `An error occurred: ${err}`;
                window.alert(message);
                return;
            }

        }

        fetchData();

        return;
    }, [params.id, navigate]);
 
    async function onSubmit(e) {
        e.preventDefault();

        const id = params.id.toString();
        
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("ricePoints", ricePoints);
        try {
            await fetch(`http://127.0.0.1:4000/api/profiles/${id}`, {
                method: "PATCH",
                body: formData
            })
        }
        catch(err){
            const message = `An error occurred: ${err}`;
            window.alert(message);
            return;
        }
        
        navigate("/");
    }

    async function updateImage(e) {
        e.preventDefault();

        const id = params.id.toString();

        setFile(e.target.files[0]);
        try {
            // Remove old image from database
            await fetch(`http://127.0.0.1:4000/api/profiles/${id}/images`, {
                method: "DELETE"
            });

            // Add new image to database
            const fileData = new FormData();
            fileData.append("image", e.target.files[0]);
            await fetch(`http://127.0.0.1:4000/api/profiles/images`, {
                method: "POST",
                body: fileData
            });

            // Update imageName field
            await fetch(`http://127.0.0.1:4000/api/profiles/${id}/images`, {
                method: "PATCH",
                body: fileData
            })

            // Show new image in editor
            const response = await fetch(`http://127.0.0.1:4000/api/profiles/${id}/images`);
            const profile = await response.json();
            setUrl(profile.imageUrl);
        }
        catch(err) {
            const message = `An error occurred: ${err}`;
            window.alert(message);
            return;
        }
    }
 
    // This following section will display the form that takes input from the user to update the data.
    return (
    <div>
        <h3>Update Profile</h3>
        <form onSubmit={onSubmit}>
            <input
            value={name}
            onChange={e => setName(e.target.value)}
            type="text"
            />
            <input
            value={description}
            onChange={e => setDescription(e.target.value)}
            type="text"
            />
            <input
            value={ricePoints}
            onChange={e => setRicePoints(e.target.value)}
            type="text"
            />
            <input
            onChange={e => updateImage(e)}
            type="file"
            accept="image/*"
            />
            <img src={url}></img>
            <input
            value="Update Profile"
            type="submit"
            />
        </form>
        
    </div>
    );
}
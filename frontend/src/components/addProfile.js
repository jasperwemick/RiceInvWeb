import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
 
export default function Add() {

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [ricePoints, setRicePoints] = useState("")
    const [file, setFile] = useState()

    const navigate = useNavigate();
    
    // This function will handle the submission.
    async function onSubmit(e) {
        e.preventDefault();
        
        // When a post request is sent to the create url, we'll add a new record to the database.
        const formData = new FormData();
        formData.append("name", name)
        formData.append("description", description)
        formData.append("ricePoints", ricePoints)
        formData.append("image", file)
        try {
            await fetch("http://127.0.0.1:4000/api/profiles", {
                method: "POST",
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
    
    // This following section will display the form that takes the input from the user.
    return (
    <div>
        <h3>Add Profile</h3>
        <form onSubmit={onSubmit}>
            <input 
            value={name} 
            onChange={e => setName(e.target.value)} 
            type="text" 
            placeholder="Name" />
            <input 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            type="text" 
            placeholder="Description" />
            <input 
            value={ricePoints} 
            onChange={e => setRicePoints(e.target.value)} 
            type="text" 
            placeholder="Points" />
            <input 
            onChange={e => setFile(e.target.files[0])} 
            type="file" 
            accept="image/*" />
            <button type="submit">Submit</button>
        </form>
    </div>
    );
}
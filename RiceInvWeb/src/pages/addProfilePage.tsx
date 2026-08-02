import React, { useState } from "react";
import { useLocation } from "wouter";
 
export default function Add() {

    const [name, setName] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const [file, setFile] = useState<File | null>()

    const [gamertag, setGamertag] = useState<string>("")
    const [user, setUser] = useState<string>("")

    const [location, navigate] = useLocation();
    
    // This function will handle the submission.
    async function onSubmit(e : React.FormEvent) {
        e.preventDefault();
        try {
            const profileData = new FormData();
            profileData.append("name", name)
            profileData.append("description", description)
            profileData.append("gamertag", gamertag)
            profileData.append("user", user)

            await fetch(`/api/profiles/default`, {
                method: "POST",
                credentials: "include",
                body: profileData
            })
        }
        catch(err){
            const message = `An error occurred: ${err}`;
            console.log(message)
            return;
        }
        
        navigate("/");
    }

    function validateNumber(e : React.ChangeEvent<HTMLInputElement>, setter : React.Dispatch<React.SetStateAction<number>>) {
        if (e.target.value.includes('-')) {
            if (e.target.value[0] !== '-') {
                e.preventDefault();
                return;
            }
        }
        else if (! /^[0-9]+$/.test(e.target.value) && e.target.value.length > 0) {
            e.preventDefault();
            return;
        }
        setter(Number(e.target.value));
    }
    
    return (
    <div>
        <h3>Add Profile</h3>
        <form onSubmit={onSubmit}>
            <input 
            value={name} 
            onChange={e => setName(e.target.value)} 
            type="text" 
            placeholder="Name"
            />
            <input 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            type="text" 
            placeholder="Description" />
            <input
            value={gamertag}
            onChange={e => setGamertag(e.target.value)}
            type="text"
            placeholder="Gamertag" />
            <input
            value={user}
            onChange={e => setUser(e.target.value)}
            type="text"
            placeholder="User" />
            <input 
            onChange={e => setFile(e.target.files ? e.target.files[0] : null)} 
            type="file" 
            accept="image/*" />
            <button type="submit">Submit</button>
        </form>
    </div>
    );
}
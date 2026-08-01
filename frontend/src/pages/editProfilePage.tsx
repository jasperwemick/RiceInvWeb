import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import GetUrl from "../GetUrl";
import apiFetch from "../fetch";
import { Profile } from "../data/types";
 
export default function Edit() {

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [url, setUrl] = useState("")

    const params = useParams();
    const [location, useNavigate] = useLocation();
 
    useEffect(() => {
        async function fetchData() {
            const id = params.id;
            try {
                const profile = await apiFetch<Profile>(`${GetUrl}/api/profiles/default/${id}`)

                console.log(profile)

                setName(profile.name);
                setDescription(profile.description);
                setUrl(profile.imageURL)

            }
            catch(err) {
                const message = `An error occurred: ${err}`;
                window.alert(message);
                return;
            }

        }

        fetchData();

        return;
    }, [params.id, location]);
 
    async function onSubmit(e : React.FormEvent) {
        e.preventDefault();

        const id = params.id;
                
        const profileData = new FormData();
        profileData.append("name", name);
        profileData.append("description", description);
        try {
            await fetch(`${GetUrl}/api/profiles/default/${id}`, {
                method: "PATCH",
                credentials: "include",
                body: profileData
            })
        }
        catch(err){
            const message = `An error occurred: ${err}`;
            window.alert(message);
            return;
        }
        
        useNavigate("/");
    }

    async function updateImage(e : React.ChangeEvent<HTMLInputElement>) {
        e.preventDefault();

        const id = params.id;

        try {
            // Remove old image from database
            await fetch(`${GetUrl}/api/profiles/default/${id}/images`, {
                method: "DELETE",
                credentials: "include"
            });

            if (!e.target.files) {
                throw new Error("No files");
            }
            // Add new image to database
            const fileData = new FormData();
            fileData.append("image", e.target.files[0]);
            await fetch(`${GetUrl}/api/profiles/default/images`, {
                method: "POST",
                credentials: "include",
                body: fileData
            });

            // Update imageName field
            await fetch(`${GetUrl}/api/profiles/default/${id}/images`, {
                method: "PATCH",
                credentials: "include",
                body: fileData
            })

            // Show new image in editor
            const response = await fetch(`${GetUrl}/api/profiles/default/${id}/images`);
            const profile = await response.json();
            setUrl(profile.imageUrl);
        }
        catch(err) {
            const message = `An error occurred: ${err}`;
            console.log(message);
            return;
        }
    }

    // function validateNumber(e, setter) {
    //     if (e.target.value.includes('-')) {
    //         if (e.target.value[0] !== '-') {
    //             e.preventDefault();
    //             return;
    //         }
    //     }
    //     else if (! /^[0-9]+$/.test(e.target.value) && e.target.value.length > 0) {
    //         e.preventDefault();
    //         return;
    //     }
    //     setter(Number(e.target.value));
    // }
 
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
            onChange={e => updateImage(e)}
            type="file"
            accept="image/*"
            />
            <img src={url} alt=""></img>
            <input
            value="Update Profile"
            type="submit"
            />
        </form>
        
    </div>
    );
}


"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import {
  loadProfile,
  updateUserProfile,
  removeAccount
} from "@/features/user/userSlice";

export default function EditProfilePage(){

  const dispatch = useDispatch();
  const router = useRouter();

  const { profile } = useSelector((state)=>state.user);

  const [name,setName] = useState("");
  const [phone,setPhone] = useState("");

  useEffect(()=>{
    dispatch(loadProfile());
  },[dispatch]);

  useEffect(()=>{

    if(profile){
      setName(profile.name || "");
      setPhone(profile.phone || "");
    }

  },[profile]);

  const handleSubmit = async (e)=>{

    e.preventDefault();

    await dispatch(updateUserProfile({
      name,
      phone
    }));

    alert("Profile updated");

    router.push("/account/profile");

  };

  const handleDelete = ()=>{

    if(confirm("Delete account permanently?")){
      dispatch(removeAccount());
      router.push("/");
    }

  };

  if(!profile) return <p>Loading...</p>;

  return(

    <div style={{padding:40,maxWidth:500}}>

      <h2>Edit Profile</h2>

      <form onSubmit={handleSubmit}>

        <div style={{marginBottom:10}}>
          <label>Name</label>

          <input
            value={name}
            onChange={(e)=>setName(e.target.value)}
            style={{width:"100%"}}
          />

        </div>

        <div style={{marginBottom:20}}>
          <label>Phone</label>

          <input
            value={phone}
            onChange={(e)=>setPhone(e.target.value)}
            style={{width:"100%"}}
          />

        </div>

        <button type="submit">
          Update Profile
        </button>

      </form>

      <hr style={{margin:"20px 0"}}/>

      <button
        onClick={handleDelete}
        style={{color:"red"}}
      >
        Delete Account
      </button>

    </div>

  );

}
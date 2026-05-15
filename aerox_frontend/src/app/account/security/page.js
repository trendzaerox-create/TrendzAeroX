"use client";

import { useState } from "react";
import api from "@/lib/apiClient";

export default function SecurityPage(){

  const [currentPassword,setCurrentPassword] = useState("");
  const [newPassword,setNewPassword] = useState("");

  const handleSubmit = async (e)=>{

    e.preventDefault();

    try{

      await api.put("/api/user/change-password",{
        currentPassword,
        newPassword
      });

      alert("Password updated");

      setCurrentPassword("");
      setNewPassword("");

    }catch(err){

      alert("Password change failed");

    }

  };

  return(

    <div style={{maxWidth:400,padding:40}}>

      <h2>Security</h2>

      <form onSubmit={handleSubmit}>

        <div>
          <label>Current Password</label>

          <input
            type="password"
            value={currentPassword}
            onChange={(e)=>setCurrentPassword(e.target.value)}
          />
        </div>

        <div>
          <label>New Password</label>

          <input
            type="password"
            value={newPassword}
            onChange={(e)=>setNewPassword(e.target.value)}
          />
        </div>

        <button type="submit">
          Change Password
        </button>

      </form>

    </div>

  );
}
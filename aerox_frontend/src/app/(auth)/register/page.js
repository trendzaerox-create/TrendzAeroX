// "use client";

// import { useState } from "react";
// import { useDispatch } from "react-redux";
// import { register } from "../../../features/auth/authSlice";
// import { useRouter } from "next/navigation";

// export default function RegisterPage() {

//   const dispatch = useDispatch();
//   const router = useRouter();

//   const [form, setForm] = useState({
//     name:"",
//     email:"",
//     password:""
//   });

//   const handleSubmit = async (e)=>{
//     e.preventDefault();

//     try {

//       await dispatch(register(form)).unwrap();

//       // ✅ success popup
//       alert("Registration successful! Please login.");

//       // redirect to login page
//       router.push("/login");

//     } catch (error) {

//       // ❌ error popup
//       alert(error?.message || "Registration failed");

//     }
//   }

//   return (
//     <div>

//       <h2>Register</h2>

//       <form onSubmit={handleSubmit}>

//         <input
//           placeholder="name"
//           onChange={(e)=>setForm({...form,name:e.target.value})}
//         />

//         <input
//           placeholder="email"
//           onChange={(e)=>setForm({...form,email:e.target.value})}
//         />

//         <input
//           placeholder="password"
//           type="password"
//           onChange={(e)=>setForm({...form,password:e.target.value})}
//         />

//         <button type="submit">
//           Register
//         </button>

//       </form>

//     </div>
//   );
// }




"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { register } from "../../../features/auth/authSlice";
import { useRouter } from "next/navigation";

export default function RegisterPage() {

  const dispatch = useDispatch();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {

    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      await dispatch(register(form)).unwrap();

      alert("Registration successful!");

      router.push("/login");

    } catch (error) {

      alert(error || "Registration failed"); // ✅ CHANGE

    } finally {

      setLoading(false);

    }

  };

  return (

    <div style={{
      maxWidth: "420px",
      margin: "auto",
      padding: "40px"
    }}>

      <h2>Create Account</h2>

      <form onSubmit={handleSubmit}>

        <div>
          <label>Name</label>

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full name"
            required
          />
        </div>

        <div>
          <label>Email</label>

          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email address"
            required
          />
        </div>

        <div>
          <label>Phone</label>

          <input
            name="phone"
            pattern="[0-9]{10}" // ✅ CHANGE
            maxLength="10" // ✅ CHANGE
            value={form.phone}
            onChange={handleChange}
            placeholder="10 digit phone"
            required
          />
        </div>

        <div>
          <label>Password</label>

          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? "Creating..." : "Register"}
        </button>

      </form>

      <p style={{marginTop:"20px"}}>
        Already have an account? <a href="/login">Login</a>
      </p>

    </div>

  );
}
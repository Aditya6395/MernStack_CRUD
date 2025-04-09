import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const Home = () => {
  const [inputUser, setInputUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setInputUser({ ...inputUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/createuser", inputUser);
      fetchAllUser();
      setInputUser({ name: "", email: "", password: "" });
    } catch (error) {
      console.error("Create user failed", error);
    }
  };

  const fetchAllUser = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8080/readalluser");
      setUserData(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch failed", err);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete this user?")) {
      await axios.delete(`http://localhost:8080/delete/${id}`);
      fetchAllUser();
    }
  };

  useEffect(() => {
    fetchAllUser();
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-gradient-to-r from-pink-100 via-yellow-100 to-blue-100 shadow-xl rounded-xl">
      <h1 className="text-4xl font-extrabold text-center text-purple-700 mb-10 animate-pulse">
        🚀 User Records Admin Panel
      </h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12"
      >
        {["name", "email", "password"].map((field) => (
          <div key={field}>
            <label className="block text-sm font-semibold text-gray-700 capitalize mb-1">
              {field}
            </label>
            <input
              type={field === "password" ? "password" : "text"}
              name={field}
              placeholder={`Enter ${field}`}
              value={inputUser[field]}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-200 transition-all duration-300 shadow-sm"
            />
          </div>
        ))}
        <div className="md:col-span-3 text-center">
          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-500 to-pink-500 hover:scale-105 text-white px-6 py-2 rounded-full shadow-lg transition-transform duration-300"
          >
            ➕ Add User
          </button>
        </div>
      </form>

      {/* Table */}
      {loading ? (
        <p className="text-center text-gray-600 text-lg">Loading users...</p>
      ) : userData.length === 0 ? (
        <p className="text-center text-red-500 font-semibold text-lg">
          No users found yet. Add one!
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="w-full text-sm text-left text-gray-700 border">
            <thead className="text-xs uppercase bg-gradient-to-r from-purple-300 to-blue-300 text-gray-900">
              <tr>
                <th className="px-6 py-3">SN</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Password</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {userData.map((item, i) => (
                <tr
                  key={item._id}
                  className="bg-white hover:bg-yellow-100 transition duration-200"
                >
                  <td className="px-6 py-4">{i + 1}</td>
                  <td className="px-6 py-4">{item.name}</td>
                  <td className="px-6 py-4">{item.email}</td>
                  <td className="px-6 py-4">{item.password}</td>
                  <td className="px-6 py-4 flex justify-center gap-4 text-sm font-medium">
                    <NavLink
                      to={`/readuser/${item._id}`}
                      className="text-green-600 hover:text-green-800 transition duration-200"
                    >
                      📘 Read
                    </NavLink>
                    <NavLink
                      to={`/updateuser/${item._id}`}
                      className="text-yellow-500 hover:text-yellow-700"
                    >
                      ✏️ Edit
                    </NavLink>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ❌ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Home;

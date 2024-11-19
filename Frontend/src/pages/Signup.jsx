import React from 'react';
import axios from 'axios';

function Signup() {
  const formHandler = async (e) => {
    e.preventDefault();
    
    // Create a new FormData object
    const formData = new FormData();
    formData.append('username', document.querySelector('#username').value);
    formData.append('email', document.querySelector('#email').value);
    formData.append('fullName', document.querySelector('#fullName').value);
    formData.append('password', document.querySelector('#password').value);
    formData.append('avatar', document.querySelector('#avatar').files[0]); // File input for avatar
    formData.append('coverImage', document.querySelector('#coverImage').files[0]); // File input for coverImage

    // Post the form data
    try {
      const { data } = await axios.post("/api/v1/users/register", formData, {
        headers: {
          'Content-Type': 'multipart/form-data' // Set correct headers for file upload
        }
      });
      console.log(data);
    } catch (error) {
      console.error("Error during signup", error);
    }
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-center mt-10">Signup Form</h1>
      <form
        id="registerForm"
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md mx-auto mt-10"
      >
        <div className="mb-4">
          <input
            type="text"
            placeholder="Username"
            name="username"
            id="username"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Email"
            name="email"
            id="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Full Name"
            name="fullName"
            id="fullName"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            placeholder="Password"
            name="password"
            id="password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <input
            type="file"
            name="avatar"
            id="avatar"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <input
            type="file"
            name="coverImage"
            id="coverImage"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex items-center justify-center">
          <button
            onClick={formHandler}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Submit
          </button>
        </div>
      </form>
    </>
  );
}

export default Signup;

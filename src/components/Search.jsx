import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { allCategories } from "../api/category";
import RecommendationForm from "./RecommendationForm";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../authSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RecommendedBookList from "./RecommendedBookList";

const Search = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const handleLogin = () => {
    // Dispatch the login action with user data
    dispatch(login({ username: "exampleUser", email: "user@example.com" }));
    toast.success("Successfully logged in!");
  };

  const handleLogout = () => {
    // Dispatch the logout action
    dispatch(logout());

    localStorage.removeItem("reduxState");
    window.location.reload();
    toast.success("Successfully logged out!");
  };

  const [data, setData] = useState(null); // State to hold the API response data
  const [searchQuery, setSearchQuery] = useState(""); // State to hold the search query
  const [genre, setGenre] = useState(""); // State to hold the selected genre
  const apiKey = process.env.REACT_APP_API_KEY; // Accessing the API key from environment variables

  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false); // State to manage dropdown visibility
  const [showModal1, setShowModal1] = useState(false);

  const dropdownRef = useRef(null); // Ref for dropdown element
  const handleCloseDropdown = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    if (!showModal1) {
      document.addEventListener("mousedown", handleCloseDropdown);
    }

    return () => {
      document.removeEventListener("mousedown", handleCloseDropdown);
    };
  }, [showModal1]);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const toggleDropdown = () => setShowDropdown(!showDropdown); // Function to toggle dropdown visibility

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/books/v1/volumes?q=${searchQuery}+subject:${genre}`,
          {
            params: {
              key: apiKey,
            },
          }
        );
        setData(response.data); // Update the state with the response data
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [apiKey, searchQuery, genre]);

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value); // Update the search query state when input changes
  };

  const handleGenreChange = (event) => {
    setGenre(event.target.value); // Update the genre state when filter option changes
  };

  const handleToggleModal1 = () => setShowModal1((prevState) => !prevState);

  return (
    <nav className="bg-gray-800 p-4">
      <div className="max-w-9xl mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex-shrink-0">
            <Link to="/" className="no-underline">
              <h1 className="text-white text-2xl cursor-pointer">
                Google Books Search
              </h1>
            </Link>
          </div>
          <div className="relative">
            <button
              className="bg-white p-2 rounded-lg"
              onClick={handleShowModal}
            >
              Submit Recommendation
            </button>
            <div className={showModal ? "block" : "hidden"}>
              <RecommendationForm
                show={showModal}
                handleClose={handleCloseModal}
              />
            </div>
          </div>
          <div className="flex items-center">
            <div className="ml-4">
              <input
                type="text"
                className="px-3 py-2 w-80 rounded border-gray-300 mr-4"
                placeholder="Search Books..."
                value={searchQuery}
                onChange={handleInputChange}
              />
              <select
                className="px-3 py-2 rounded border-gray-300"
                value={genre}
                onChange={handleGenreChange}
              >
                <option value="">All Genres</option>
                {allCategories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="relative" ref={dropdownRef}>
            <button
              className="bg-blue-500 px-3 py-2 text-white rounded-xl"
              onClick={toggleDropdown}
            >
              Account
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg">
                {isAuthenticated ? (
                  <div>
                    <button
                      onClick={handleLogout}
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                    >
                      Logout
                    </button>
                    <div>
                      <button
                        onClick={handleToggleModal1}
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                      >
                        Recommended BookList
                      </button>
                      <div className="hidden">
                        <RecommendedBookList
                          show={showModal1}
                          handleClose={() => setShowModal1(false)}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleLogin}
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                  >
                    Login
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        {data && data.items && searchQuery !== "" && (
          <div className="mt-2 bg-white shadow-md rounded">
            <ul>
              {data.items.slice(0, 10).map((item, index) => (
                <li
                  key={index}
                  className="px-4 py-2 border-b border-gray-200 hover:bg-gray-100"
                >
                  <Link
                    to={`/book/${item.id}`}
                    className="text-blue-500 hover:underline no-underline"
                  >
                    {item.volumeInfo.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </nav>
  );
};

export default Search;

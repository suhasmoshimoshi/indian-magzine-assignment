import React, { useEffect, useState } from "react";
import Search from "../components/Search";
import BookDisplay from "../components/BookDisplay";
import axios from "axios";

const Home = () => {
  const [books, setBooks] = useState([]); // State to hold the list of books

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/books/v1/volumes`,
          {
            params: {
              q: `""`, // Empty string as the query parameter
              key: process.env.REACT_APP_API_KEY,
            },
          }
        );
        setBooks(response.data.items); // Update the state with the array of books
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Search />
      <div className="container mx-auto mt-8 w-[90%] ">
        <h1 className="text-3xl font-semibold mb-4 text-white">
          List of Books
        </h1>
        <BookDisplay books={books} />
      </div>
    </div>
  );
};

export default Home;

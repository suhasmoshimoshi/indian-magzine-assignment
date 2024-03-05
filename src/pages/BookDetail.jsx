import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import Search from "../components/Search";
import { useDispatch, useSelector } from "react-redux";
import { addToFavorites, removeFromFavorites } from "../favoritesSlice";
import { addRating, removeRating } from "../ratingsSlice";
import { addComment, removeComment } from "../commentsSlice";

const BookDetail = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const favorites = useSelector((state) => state.favorites.books);
  const ratings = useSelector((state) => state.ratings.ratings);
  const comments = useSelector((state) => state.comments.comments);
  const dispatch = useDispatch();
  const [userRating, setUserRating] = useState(0);

  // State to manage comments for each book
  const [bookComments, setBookComments] = useState({});

  const handleToggleFavorite = (book) => {
    if (isAuthenticated) {
      if (favorites.some((favBook) => favBook.id === book.id)) {
        dispatch(removeFromFavorites(book));
      } else {
        dispatch(addToFavorites(book));
      }
    } else {
      alert("Please log in to add/remove favorites.");
    }
  };

  const handleRatingChange = (bookId, rating) => {
    if (isAuthenticated) {
      dispatch(addRating({ bookId, rating }));
    } else {
      alert("Please log in to rate books.");
    }
  };

  const handleAddComment = (bookId) => {
    if (isAuthenticated && bookComments[bookId].trim() !== "") {
      dispatch(addComment({ bookId, comment: bookComments[bookId] }));
      // Clear the comment textarea for the specific book after adding the comment
      setBookComments((prevComments) => ({
        ...prevComments,
        [bookId]: "",
      }));
    } else {
      alert("Please log in and enter a comment.");
    }
  };

  const handleRemoveComment = (bookId) => {
    dispatch(removeComment({ bookId }));
  };
  const [bookDetails, setBookDetails] = useState(null);
  const [booksByGenre, setBooksByGenre] = useState([]);
  const { id } = useParams(); // Get the book ID from the URL parameter

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/books/v1/volumes/${id}`, // Use the book ID in the API endpoint
          {
            params: {
              key: process.env.REACT_APP_API_KEY,
            },
          }
        );
        setBookDetails(response.data); // Update the state with the book details

        // Fetch books with the specified genre
        const genre = response.data.volumeInfo.categories[0];
        const genreResponse = await axios.get(
          `https://www.googleapis.com/books/v1/volumes?q=subject:${genre}`
        );
        setBooksByGenre(genreResponse.data.items || []);
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    };

    fetchBookDetails();
  }, [id]); // Re-run effect when the book ID changes

  if (!bookDetails) {
    return <div className="container mx-auto mt-8">Loading...</div>;
  }

  return (
    <>
      <div>
        <Search />
      </div>
      <div className="container mx-auto mt-8">
        <div className="bg-white rounded shadow-md p-8">
          <h2 className="text-3xl font-semibold mb-4">
            {bookDetails.volumeInfo.title}
          </h2>
          {/* Existing book details section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <img
                src={bookDetails.volumeInfo?.imageLinks?.thumbnail}
                alt={bookDetails.volumeInfo.title}
                className="w-full h-[30rem] object-cover mb-4"
              />
              <p className="text-sm text-gray-600 mb-2">
                Authors: {bookDetails.volumeInfo.authors}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Published Date: {bookDetails.volumeInfo.publishedDate}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Categories or Genre: {bookDetails.volumeInfo.categories}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Page Count: {bookDetails.volumeInfo.pageCount}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Language: {bookDetails.volumeInfo.language}
              </p>
              <p
                className="text-gray-700"
                dangerouslySetInnerHTML={{
                  __html: bookDetails.volumeInfo.description,
                }}
              ></p>
              {bookDetails.saleInfo && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    Saleability: {bookDetails.saleInfo.saleability}
                  </p>
                  <p className="text-sm text-gray-600">
                    Ebook Availability:{" "}
                    {bookDetails.saleInfo.isEbook ? "Yes" : "No"}
                  </p>
                  {bookDetails.saleInfo.listPrice && (
                    <p className="text-sm text-gray-600">
                      List Price: {bookDetails.saleInfo.listPrice.amount}{" "}
                      {bookDetails.saleInfo.listPrice.currencyCode}
                    </p>
                  )}
                  {bookDetails.saleInfo.retailPrice && (
                    <p className="text-sm text-gray-600">
                      Retail Price: {bookDetails.saleInfo.retailPrice.amount}{" "}
                      {bookDetails.saleInfo.retailPrice.currencyCode}
                    </p>
                  )}
                  {bookDetails.saleInfo.buyLink && (
                    <a
                      href={bookDetails.saleInfo.buyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Buy Now
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        {/* New section for books by genre */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Books by Genre</h2>
          <div className="overflow-x-scroll flex">
            {booksByGenre.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded shadow-md p-3 mr-4 h-[110vh]"
              >
                <div className="w-[15rem]">
                  <div className="flex justify-end ">
                    <button
                      onClick={() => handleToggleFavorite(book)}
                      className="text-red-500 hover:text-red-600 focus:outline-none"
                    >
                      {favorites.some((favBook) => favBook.id === book.id)
                        ? "❤️"
                        : "🖤"}
                    </button>
                  </div>
                  <Link to={`/book/${book.id}`} className="mb-0">
                    <img
                      src={book.volumeInfo?.imageLinks?.thumbnail}
                      alt={book.volumeInfo.title}
                      className="h-40 object-cover w-full mb-4"
                    />
                    <h2 className="text-lg font-semibold h-[4rem]">
                      {book.volumeInfo.title}
                    </h2>
                    <p className="text-sm text-gray-600 mb-2">
                      {book.volumeInfo.authors}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      Published Date: {book.volumeInfo.publishedDate}
                    </p>
                    <p className="text-gray-700 h-[6rem]">
                      {book.volumeInfo?.description?.slice(0, 100)}
                    </p>
                    <a
                      href={book.volumeInfo.infoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline mt-2 inline-block"
                    >
                      More Info
                    </a>
                  </Link>
                </div>
                <div className="bg-gray-200 pt-4 px-6 rounded-lg shadow-lg">
                  <div className="mb-4">
                    <label
                      htmlFor={`rating-${book.id}`}
                      className="block font-bold"
                    >
                      Your Rating:
                    </label>
                    <select
                      id={`rating-${book.id}`}
                      value={ratings[book.id] || userRating}
                      onChange={(e) =>
                        handleRatingChange(book.id, parseInt(e.target.value))
                      }
                      className="block w-full py-2 px-4 bg-white border border-gray-300 rounded shadow-inner focus:outline-none focus:border-blue-500"
                    >
                      <option value={0}>Not rated</option>
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                      <option value={5}>5</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor={`comment-${book.id}`}
                      className="block font-bold"
                    >
                      Your Comment:
                    </label>
                    <textarea
                      id={`comment-${book.id}`}
                      value={bookComments[book.id] || ""}
                      onChange={(e) =>
                        setBookComments((prevComments) => ({
                          ...prevComments,
                          [book.id]: e.target.value,
                        }))
                      }
                      className="block w-full py-2 px-4 bg-white border border-gray-300 rounded shadow-inner focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <button
                    onClick={() => handleAddComment(book.id)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Add Comment
                  </button>
                  {comments[book.id] && (
                    <div className="mt-2">
                      <p>{comments[book.id]}</p>
                      <button
                        onClick={() => handleRemoveComment(book.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove Comment
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default BookDetail;

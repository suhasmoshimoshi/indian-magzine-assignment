import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { addToFavorites, removeFromFavorites } from "../favoritesSlice";
import { addRating, removeRating } from "../ratingsSlice";
import { addComment, removeComment } from "../commentsSlice";

const BookDisplay = ({ books }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); // Just for testing, replace with actual authentication logic
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {books.map((book) => (
        <div
          key={book.id}
          className="bg-white rounded-lg shadow-lg shadow-black overflow-hidden"
        >
          <div className="relative">
            <button
              onClick={() => handleToggleFavorite(book)}
              className="absolute top-0 right-0 m-2 text-red-500 hover:text-red-600 focus:outline-none"
            >
              {favorites.some((favBook) => favBook.id === book.id)
                ? "❤️"
                : "🖤"}
            </button>
            <Link to={`/book/${book.id}`} className="block no-underline">
              <img
                src={book.volumeInfo?.imageLinks?.thumbnail}
                alt={book.volumeInfo.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-4 h-full">
                <h2 className="text-lg h-[4rem] font-semibold">
                  {book.volumeInfo.title}
                </h2>
                <div className="h-[5rem]">
                  <p className="text-sm text-gray-600 mb-2">
                    {book.volumeInfo.authors}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    Published Date: {book.volumeInfo.publishedDate}
                  </p>
                </div>

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
              </div>
            </Link>
          </div>
          <div className="bg-gray-200 py-4 px-6 rounded-lg shadow-lg">
            <div className="mb-4">
              <label htmlFor={`rating-${book.id}`} className="block font-bold">
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
              <label htmlFor={`comment-${book.id}`} className="block font-bold">
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
  );
};

export default BookDisplay;

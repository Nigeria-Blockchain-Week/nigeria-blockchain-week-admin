import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";

export default function Dashboard() {
  const [posts, setPosts] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      const querySnapshot = await getDocs(collection(db, "posts"));
      setPosts(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };
    fetchPosts();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deleteDoc(doc(db, "posts", id));
        setPosts(posts.filter(post => post.id !== id));
      } catch (error) {
        console.error("Error deleting post:", error);
        alert("Failed to delete post. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-4 md:p-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
          <h2 className="text-xl md:text-2xl font-bold">Blog Posts</h2>
          <div className="flex space-x-2">
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 md:px-4 py-2 rounded hover:bg-red-600 transition text-sm md:text-base"
            >
              Logout
            </button>
            <button
              onClick={() => navigate("/dashboard/new")}
              className="bg-blue-600 text-white px-3 md:px-4 py-2 rounded hover:bg-blue-700 transition text-sm md:text-base"
            >
              New Post
            </button>
          </div>
        </div>
        <ul className="space-y-4">
          {posts.map((post) => (
            <li
              key={post.id}
              className="flex flex-col sm:flex-row sm:items-center bg-gray-50 rounded p-4 shadow space-y-4 sm:space-y-0"
            >
              <img
                src={post.coverUrl}
                alt="cover"
                className="w-full sm:w-24 h-48 sm:h-24 object-cover rounded sm:mr-4"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{post.title}</h3>
                <p className="text-gray-600 text-sm">{post.description}</p>
                <p className="text-gray-500 text-xs">By {post.author}</p>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <button
                  onClick={() => navigate(`/dashboard/edit/${post.id}`)}
                  className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 transition text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post.id, post.title)}
                  className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition text-sm"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

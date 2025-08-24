import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { uploadToCloudinary } from "../cloudinary";
import { useNavigate, useParams } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";

export default function PostEditor() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [cover, setCover] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverUrl, setCoverUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        const docRef = doc(db, "posts", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title);
          setDescription(data.description || "");
          setAuthor(data.author || "");
          setMarkdown(data.markdown);
          setCoverUrl(data.coverUrl);
        }
      };
      fetchPost();
    }
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCover(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    document.getElementById('cover-input')?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let newCoverUrl = coverUrl;
    if (cover) {
      newCoverUrl = await uploadToCloudinary(cover);
    }
    const postData = {
      title,
      description,
      author,
      markdown,
      coverUrl: newCoverUrl,
    };
    if (id) {
      await updateDoc(doc(db, "posts", id), postData);
    } else {
      await addDoc(collection(db, "posts"), {
        ...postData,
        createdAt: new Date().toISOString(),
      });
    }
    setLoading(false);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="mr-4 text-gray-600 hover:text-gray-800 flex items-center"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h2 className="text-2xl font-bold flex-1 text-center">{id ? "Edit" : "New"} Blog Post</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div data-color-mode="light">
            <MDEditor
              value={markdown}
              onChange={(value) => setMarkdown(value || "")}
              height={300}
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Cover Image</label>
            <input
              id="cover-input"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={triggerFileInput}
              className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition text-gray-600 hover:text-blue-600"
            >
              {cover || coverUrl ? "Change Cover Image" : "Choose Cover Image"}
            </button>
            
            {(coverPreview || coverUrl) && (
              <div className="mt-4">
                <img
                  src={coverPreview || coverUrl}
                  alt="cover preview"
                  className="w-32 h-32 object-cover rounded mx-auto border"
                />
                <p className="text-center text-sm text-gray-500 mt-2">
                  {coverPreview ? "Preview (not uploaded yet)" : "Current cover image"}
                </p>
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full ${id ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"} text-white py-2 rounded transition`}
          >
            {loading ? (id ? "Saving..." : "Saving...") : id ? "Save Changes" : "Save Post"}
          </button>
        </form>
        <button
          onClick={() => navigate("/dashboard")}
          className="w-full mt-4 text-gray-600 hover:underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

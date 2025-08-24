import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { useNavigate, Outlet } from "react-router-dom";

export default function RequireAuth() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      setLoading(false);
      if (!u) navigate("/login");
    });
    return () => unsubscribe();
  }, [navigate]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    );
  if (!user) return null;
  return <Outlet />;
}


import type { Route } from "./+types/home";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Nigeria Blockchain Week" },
    { name: "description", content: "Welcome to Nigeria Blockchain Week!" },
  ];
}

export default function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/login", { replace: true });
  }, [navigate]);
  return null;
}

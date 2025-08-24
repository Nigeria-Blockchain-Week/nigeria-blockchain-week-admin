
import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),
	route("/login", "auth/Login.tsx"),
	route("/forgot-password", "auth/ForgotPassword.tsx"),
	route(
		"/dashboard",
		"auth/RequireAuth.tsx",
		[
			route("", "dashboard/Dashboard.tsx"),
			route("new", "dashboard/PostEditorNew.tsx"),
			route("edit/:id", "dashboard/PostEditorEdit.tsx"),
		]
	),
] satisfies RouteConfig;

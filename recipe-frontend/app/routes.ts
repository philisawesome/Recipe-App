import { 
	type RouteConfig,
	index, route 
} from "@react-router/dev/routes";

export default [
	index("./routes/home.tsx"),
	route("search/*", "./routes/search-page.tsx"),
	route("user/:uid", "./routes/user.tsx"),
	route("post/:pid", "./routes/post.tsx"),
	route("edit-post/:pid", "./routes/edit-post.tsx"),
	route("account", "./routes/account.tsx"),
	route("settings", "./routes/settings.tsx"),
	route("contact", "./routes/contact.tsx"),
	route("new-post", "./routes/new-post.tsx"),
] satisfies RouteConfig;

import { Link } from "react-router"
import {
  Sidebar,
  SidebarContent,
  SidebarTrigger,
  SidebarRail,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
} from "./ui/sidebar"
import {
	AvatarCard
} from "./avatar-card"
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "./ui/popover"
import {
	Button
} from "./ui/button"

interface MenuLink {
	name: string, link: string
}

const MenuLinks: MenuLink[] = [
	{
		name: "Home",
		link: "/", 
	},
	{
		name: "Search",
		link: "/search", 
	},
]

const AccountMenuLinks: MenuLink[] = [
	{
		name: "My Profile",
		link: "/user/bill",
	},
	{ 
		name: "My Account",
		link: "/account",
	},
	{
		name: "Contact",
		link: "/contact",
	},
]

export function AppSidebar() {
	return (<Sidebar variant="inset" side="right">
		<SidebarHeader>
			<Popover>
				<PopoverTrigger className="">
					<AvatarCard/>
				</PopoverTrigger>
				<PopoverContent>
					<Button variant="destructive" className="w-full">Logout</Button>
				</PopoverContent>
			</Popover>
		</SidebarHeader>
		<SidebarContent className="p-2">
			<Button asChild><Link to="/new-post">New Post</Link></Button>
			<SidebarGroup>
				<SidebarGroupLabel>Community</SidebarGroupLabel>
				<SidebarMenu>
					{MenuLinks.map((s: MenuLink, i: number) => {
						return (<SidebarMenuItem key={i}>
							<SidebarMenuButton asChild>
								<Link to={s.link}>
									<span>{s.name}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>)
					})}
				</SidebarMenu>
			</SidebarGroup>
			<SidebarGroup>
				<SidebarGroupLabel>Application</SidebarGroupLabel>
				<SidebarMenu>
					{AccountMenuLinks.map((s: MenuLink, i: number) => {
						return (<SidebarMenuItem key={i}>
							<SidebarMenuButton asChild>
								<Link to={s.link}>
									<span>{s.name}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>)
					})}
				</SidebarMenu>
			</SidebarGroup>
		</SidebarContent>
		<SidebarRail/>
	</Sidebar>)
}

export function LeftSidebar() {
	return (<Sidebar variant="inset" side="left" className="fixed bg-white">
		<SidebarHeader className="bg-white">
		</SidebarHeader>
		<SidebarContent className="bg-white">
		</SidebarContent>
	</Sidebar>)
}

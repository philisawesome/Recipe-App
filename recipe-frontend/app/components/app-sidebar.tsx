import { Link, useNavigate } from "react-router"
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
  SidebarMenuBadge,
  SidebarMenuSkeleton,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
} from "./ui/sidebar"
import { AvatarCard } from "./avatar-card"
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "./ui/popover"
import { Button } from "./ui/button"
import { useAuth } from "../hooks/use-auth"

interface MenuLink {
	name: string
	link: string
	auth?: true
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
	{
		name: "My Profile",
		link: "/user/bill",
		auth: true,
	},
]

const AccountMenuLinks: MenuLink[] = [
	/*
	{
		name: "My Profile",
		link: "/user/bill",
	},
	{ 
		name: "My Account",
		link: "/account",
	},
	*/
]

export function AppSidebar() {
	const auth = useAuth()
	const navigate = useNavigate()

	const hideClass = "group-data-[collapsible=icon]:hidden"

	const Logo = () => {
		return <Link to="/"><div className="flex pt-2 pl-2 group-data-[collapsible=icon]:p-0">
				<div
					className={"text-center title-font text-[2rem] "+hideClass}
				>Stovetop</div>
				<img className="w-[2rem]" src="/logo.svg"/>
			</div>
		</Link>
	}


	return (<Sidebar 
			collapsible="icon"
			className="flex flex-col justify-between" side="right">
		<SidebarHeader>
			<Logo/>	
		</SidebarHeader>
		<SidebarContent className={"h-full "+hideClass}>
			<SidebarGroup className="">
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild>
						</SidebarMenuButton>
					</SidebarMenuItem>

					{MenuLinks
						.filter((s: MenuLink) => auth.loggedIn || !s.auth)
						.map((s: MenuLink, i: number) => {
							return (<SidebarMenuItem key={i}>
								<SidebarMenuButton asChild>
									<Link to={s.link}>
										<span>{s.name}</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>)
						})
					}
				</SidebarMenu>
			</SidebarGroup>
			{/*
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
			*/}
			<SidebarFooter className="w-full absolute bottom-0">
			<div className="w-full gap-3 p-4 flex flex-col">
				<Popover>
					<PopoverTrigger className="">
						{auth.loggedIn && <AvatarCard/>}
					</PopoverTrigger>
					<PopoverContent>
						{auth.loggedIn && 
						<Button 
							variant="destructive"
							className="w-full"
							onClick={() => {
								auth.logout()
							}}>
							Logout
						</Button>}
					</PopoverContent>
				</Popover>
				{auth.loggedIn &&	
				<Button asChild 
					className="bg-(--color-4)">
					<Link to="/new-post">
						New Post
					</Link>
				</Button>
				}
				{!auth.loggedIn && <div className="flex gap-2 self-center">
					<Button 
						onClick={() => {navigate("/login")}}>
						Login
					</Button>
					<Button 
						variant="link"
						onClick={() => {navigate("/signup")}}>
						Signup
					</Button>
				</div>}
			</div>
			</SidebarFooter>
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

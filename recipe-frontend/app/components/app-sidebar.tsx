import {
  Sidebar,
  SidebarContent,
  SidebarTrigger,
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
	Avatar,
	AvatarImage,
	AvatarFallback,
} from "./ui/avatar"
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "./ui/popover"
import {
	Button
} from "./ui/button"

const MenuLinks = ["Home", "Search", "Trending Recipes"]
const AccountMenuLinks = ["My Profile", "Settings", "Contact"]

export function AppSidebar() {
	return (<Sidebar variant="inset" side="right" className="fixed">
		<SidebarHeader>
			<Popover>
				<PopoverTrigger className="">
					<div className="flex items-center justify-start gap-2">
						<Avatar className="m-2">
							<AvatarImage src="https://github.com/shadcn.png" />
							<AvatarFallback>CN</AvatarFallback>
						</Avatar>
						<div className="text-left">
							<p className="-mb-2">@linecook</p>
							<p><small>Link Cook</small></p>
						</div>
					</div>
				</PopoverTrigger>
				<PopoverContent>
					<Button variant="destructive" className="w-full">Logout</Button>
				</PopoverContent>
			</Popover>
		</SidebarHeader>
		<SidebarContent>
			<Button>New Post</Button>
			<SidebarGroup>
				<SidebarGroupLabel>Community</SidebarGroupLabel>
				<SidebarMenu>
					{MenuLinks.map((s: string, i: number) => {
						return (<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<a>
									<span>{s}</span>
								</a>
							</SidebarMenuButton>
						</SidebarMenuItem>)
					})}
				</SidebarMenu>
			</SidebarGroup>
			<SidebarGroup>
				<SidebarGroupLabel>Application</SidebarGroupLabel>
				<SidebarMenu>
					{AccountMenuLinks.map((s: string, i: number) => {
						return (<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<a>
									<span>{s}</span>
								</a>
							</SidebarMenuButton>
						</SidebarMenuItem>)
					})}
				</SidebarMenu>
			</SidebarGroup>
		</SidebarContent>
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

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, LogOut } from "lucide-react";
type Prop = {
  userName: string;
  profilePicture: string;
  onLogout: () => void;
};
function UserNav({ userName, profilePicture, onLogout }: Prop) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className=" gap-0  h-8 w-8 rounded-full !bg-transparent relative"
        >
          <Avatar className="h-10 w-10 !cursor-pointer">
            <AvatarImage
              className="cursor-pointer"
              src={profilePicture || ""}
            />
            <AvatarFallback className="bg-[var(--secondary-dark-color)] border !border-gray-700 text-white">
              {userName[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <ChevronDown className="!w-3 !h-3 ml-1 text-white" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 !bg-[var(--secondary-dark-color)] !text-white
         !border-gray-700"
        align="end"
        forceMount
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-semibold ">
            {userName || "null"}
          </DropdownMenuLabel>
          <DropdownMenuLabel className="text-xs text-gray-400 font-light">
            Free trial (12 days left)
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuSeparator className="bg-gray-700" />
          <DropdownMenuItem
            className="hover:!bg-gray-800 hover:!text-white"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserNav;

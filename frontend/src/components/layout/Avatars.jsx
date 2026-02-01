import { useEffect } from "react";
import { Crown } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAdminStore } from "@/store/useAdminStore";
import { useAuthContext } from "@/components/AuthProvider";

export default function Avatars() {
  const { userId, user } = useAuthContext();
  const { admins, owner, currentWorkspace, fetchAdmins } = useAdminStore();

  useEffect(() => {
    if (userId) {
      fetchAdmins(userId);
    }
  }, [userId, fetchAdmins]);

  // Build the list of avatars to display
  const getAvatarsToDisplay = () => {
    const avatars = [];

    if (currentWorkspace && !currentWorkspace.isOwnWorkspace) {
      // Scenario 2 - Option C: User is an admin viewing someone else's workspace
      // Show: Owner (prominent) + Current user

      // Add workspace owner
      if (currentWorkspace.workspaceOwner) {
        avatars.push({
          id: currentWorkspace.workspaceOwnerId,
          name: [currentWorkspace.workspaceOwner.first_name, currentWorkspace.workspaceOwner.last_name]
            .filter(Boolean).join(" ") || "Owner",
          image: currentWorkspace.workspaceOwner.image_url,
          role: "Owner",
          isOwner: true,
        });
      }

      // Add current user
      if (user) {
        avatars.push({
          id: userId,
          name: [user.firstName, user.lastName].filter(Boolean).join(" ") || "You",
          image: user.imageUrl,
          role: currentWorkspace.role || "Admin",
          isOwner: false,
        });
      }
    } else {
      // Scenario 1: User is the owner of the workspace
      // Show: Owner (self) + All admins

      // Add owner (current user)
      if (owner) {
        avatars.push({
          id: owner.id,
          name: [owner.first_name, owner.last_name].filter(Boolean).join(" ") || "You",
          image: owner.image_url,
          role: "Owner",
          isOwner: true,
        });
      } else if (user) {
        // Fallback to current user if owner not loaded
        avatars.push({
          id: userId,
          name: [user.firstName, user.lastName].filter(Boolean).join(" ") || "You",
          image: user.imageUrl,
          role: "Owner",
          isOwner: true,
        });
      }

      // Add admins
      admins.forEach((admin) => {
        avatars.push({
          id: admin.id,
          name: [admin.first_name, admin.last_name].filter(Boolean).join(" ") || "Admin",
          image: admin.image_url,
          role: admin.role,
          isOwner: false,
        });
      });
    }

    return avatars;
  };

  const avatarsToDisplay = getAvatarsToDisplay();
  const maxDisplay = 4;
  const displayAvatars = avatarsToDisplay.slice(0, maxDisplay);
  const remainingCount = avatarsToDisplay.length - maxDisplay;

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (avatarsToDisplay.length === 0) {
    return null;
  }

  return (
    <TooltipProvider>
      <div className="*:data-[slot=avatar]:ring-background flex -space-x-3 *:data-[slot=avatar]:ring-2">
        {displayAvatars.map((avatar) => (
          <Tooltip key={avatar.id}>
            <TooltipTrigger asChild>
              <div className="relative">
                <Avatar className="size-8 cursor-pointer hover:z-10 hover:scale-110 transition-transform">
                  <AvatarImage src={avatar.image} alt={avatar.name} />
                  <AvatarFallback>{getInitials(avatar.name)}</AvatarFallback>
                </Avatar>
                {avatar.isOwner && (
                  <Crown className="absolute -top-1 -right-1 h-3 w-3 text-yellow-500 fill-yellow-500" />
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-medium">{avatar.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{avatar.role}</p>
            </TooltipContent>
          </Tooltip>
        ))}

        {remainingCount > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="size-8 cursor-pointer">
                <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                  +{remainingCount}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>{remainingCount} more collaborators</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}
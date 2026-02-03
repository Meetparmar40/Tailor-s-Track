import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";
import {
  User,
  Mail,
  Calendar,
  Settings,
  Users,
  Shield,
  LogOut,
  ChevronRight,
  Plus,
  Trash2,
  UserCheck,
  Crown,
  Building2,
  ExternalLink,
} from "lucide-react";
import Header from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthContext } from "@/components/AuthProvider";
import { useAdminStore } from "@/store/useAdminStore";
import { cn } from "@/lib/utils";

function AccountCard({ title, description, icon: Icon, children, className }) {
  return (
    <Card className={cn("transition-all hover:shadow-md", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
          )}
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            {description && <CardDescription className="text-sm">{description}</CardDescription>}
          </div>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function QuickActionButton({ icon: Icon, label, onClick, variant = "outline" }) {
  return (
    <Button
      variant={variant}
      className="flex items-center justify-between w-full h-auto py-3 px-4"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5" />
        <span>{label}</span>
      </div>
      <ChevronRight className="h-4 w-4" />
    </Button>
  );
}

function AdminListItem({ admin, onRemove, isRemoving }) {
  const fullName = [admin.first_name, admin.last_name].filter(Boolean).join(" ") || "Unknown User";
  const initials = fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="flex items-center justify-between py-3 px-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={admin.image_url} alt={fullName} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-sm">{fullName}</p>
          <p className="text-xs text-muted-foreground">{admin.email}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant={admin.status === 'active' ? 'default' : 'secondary'}>
          {admin.role}
        </Badge>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => onRemove(admin.id)}
          disabled={isRemoving}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function WorkspaceItem({ workspace, isActive, onSwitch, isSwitching }) {
  const ownerName = [workspace.owner_first_name, workspace.owner_last_name]
    .filter(Boolean).join(" ") || "Unknown";
  const initials = ownerName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div
      className={cn(
        "flex items-center justify-between py-3 px-4 rounded-lg border transition-colors cursor-pointer",
        isActive ? "bg-primary/10 border-primary" : "bg-card hover:bg-accent/50"
      )}
      onClick={() => !isActive && onSwitch(workspace.owner_id)}
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={workspace.owner_image} alt={ownerName} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium text-sm">{ownerName}'s Workspace</p>
            {workspace.access_type === 'owner' && (
              <Crown className="h-4 w-4 text-yellow-500" />
            )}
          </div>
          <p className="text-xs text-muted-foreground">{workspace.owner_email}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {isActive ? (
          <Badge variant="default">Active</Badge>
        ) : (
          <Button variant="ghost" size="sm" disabled={isSwitching}>
            Switch
            <ExternalLink className="h-3 w-3 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}

export default function AccountPage() {
  const navigate = useNavigate();
  const { signOut, openUserProfile } = useClerk();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, userId } = useAuthContext();
  const {
    admins,
    owner,
    workspaces,
    currentWorkspace,
    loading,
    error,
    fetchAdmins,
    fetchWorkspaces,
    addAdmin,
    removeAdmin,
    switchWorkspace,
    clearWorkspace,
    initWorkspace,
    clearError
  } = useAdminStore();

  const [addAdminOpen, setAddAdminOpen] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminRole, setNewAdminRole] = useState("admin");
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  useEffect(() => {
    if (searchParams.get('addAdmin') === 'true') {
      setAddAdminOpen(true);
      // Remove the query param from URL
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (userId) {
      initWorkspace();
      fetchAdmins(userId);
      fetchWorkspaces(userId);
    }
  }, [userId, fetchAdmins, fetchWorkspaces, initWorkspace]);

  const handleAddAdmin = async () => {
    if (!newAdminEmail.trim()) return;
    
    setIsAdding(true);
    const result = await addAdmin(userId, newAdminEmail.trim(), newAdminRole);
    setIsAdding(false);
    
    setActionMessage({
      type: result.success ? 'success' : 'error',
      text: result.message
    });

    if (result.success) {
      setNewAdminEmail("");
      setNewAdminRole("admin");
      setAddAdminOpen(false);
    }

    // Clear message after 3 seconds
    setTimeout(() => setActionMessage(null), 3000);
  };

  const handleRemoveAdmin = async (adminId) => {
    setIsRemoving(true);
    const result = await removeAdmin(userId, adminId);
    setIsRemoving(false);
    
    setActionMessage({
      type: result.success ? 'success' : 'error',
      text: result.message
    });

    setTimeout(() => setActionMessage(null), 3000);
  };

  const handleSwitchWorkspace = async (targetUserId) => {
    setIsSwitching(true);
    const result = await switchWorkspace(userId, targetUserId);
    setIsSwitching(false);

    if (result.success) {
      // Reload the page to refresh all data for the new workspace
      window.location.reload();
    } else {
      setActionMessage({
        type: 'error',
        text: result.message
      });
      setTimeout(() => setActionMessage(null), 3000);
    }
  };

  const handleBackToOwnWorkspace = async () => {
    clearWorkspace();
    window.location.reload();
  };

  const handleLogout = async () => {
    clearWorkspace();
    await signOut();
    navigate("/");
  };

  const fullName = user ? [user.firstName, user.lastName].filter(Boolean).join(" ") : "User";
  const initials = fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  const email = user?.primaryEmailAddress?.emailAddress || "";
  const createdAt = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : "";

  // Build workspaces list
  const allWorkspaces = [];
  if (workspaces.ownWorkspace) {
    allWorkspaces.push(workspaces.ownWorkspace);
  }
  if (workspaces.sharedWorkspaces) {
    allWorkspaces.push(...workspaces.sharedWorkspaces);
  }

  return (
    <div className="flex-1 overflow-auto">
      <Header title="Account" description="Manage your profile and preferences" />

      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        {/* Action Message */}
        {actionMessage && (
          <div className={cn(
            "p-4 rounded-lg border",
            actionMessage.type === 'success' 
              ? "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200"
              : "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200"
          )}>
            {actionMessage.text}
          </div>
        )}

        {/* Current Workspace Banner */}
        {currentWorkspace && (
          <div className="p-4 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <div>
                  <p className="font-medium text-amber-800 dark:text-amber-200">
                    Viewing {currentWorkspace.workspaceOwner?.first_name || 'Shared'}'s Workspace
                  </p>
                  <p className="text-sm text-amber-600 dark:text-amber-400">
                    You're currently viewing data from another workspace
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleBackToOwnWorkspace}>
                Back to My Workspace
              </Button>
            </div>
          </div>
        )}

        {/* User Profile Card */}
        <AccountCard
          title="Profile Information"
          description="Your personal details from your account"
          icon={User}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.imageUrl} alt={fullName} />
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <div className="space-y-2 flex-1">
              <div>
                <p className="text-xl font-semibold">{fullName}</p>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{email}</span>
                </div>
              </div>
              {createdAt && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Member since {createdAt}</span>
                </div>
              )}
            </div>
            <Button variant="outline" onClick={() => openUserProfile()}>
              Edit Profile
            </Button>
          </div>
        </AccountCard>

        {/* Quick Actions */}
        <AccountCard
          title="Quick Actions"
          description="Common account actions"
          icon={Settings}
        >
          <div className="grid gap-3">
            <QuickActionButton
              icon={Settings}
              label="App Settings"
              onClick={() => navigate("/settings")}
            />
            <QuickActionButton
              icon={Shield}
              label="Security & Privacy"
              onClick={() => openUserProfile()}
            />
            <QuickActionButton
              icon={LogOut}
              label="Sign Out"
              onClick={handleLogout}
              variant="ghost"
            />
          </div>
        </AccountCard>

        {/* Workspaces */}
        <AccountCard
          title="Workspaces"
          description="Switch between workspaces you have access to"
          icon={Building2}
        >
          <div className="space-y-3">
            {allWorkspaces.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No workspaces found
              </p>
            ) : (
              allWorkspaces.map((workspace, index) => (
                <WorkspaceItem
                  key={workspace.owner_id || index}
                  workspace={workspace}
                  isActive={
                    workspace.access_type === 'owner' 
                      ? !currentWorkspace 
                      : currentWorkspace?.workspaceOwnerId === workspace.owner_id
                  }
                  onSwitch={handleSwitchWorkspace}
                  isSwitching={isSwitching}
                />
              ))
            )}
          </div>
        </AccountCard>

        {/* Manage Admins */}
        <AccountCard
          title="Manage Admins"
          description="Add other users who can access and manage your data"
          icon={Users}
        >
          <div className="space-y-4">
            {/* Owner */}
            {owner && (
              <div className="flex items-center justify-between py-3 px-4 rounded-lg border bg-primary/5 border-primary/20">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={owner.image_url} alt="Owner" />
                    <AvatarFallback>
                      {[owner.first_name, owner.last_name].filter(Boolean).join(" ").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "OW"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">
                        {[owner.first_name, owner.last_name].filter(Boolean).join(" ") || "You"}
                      </p>
                      <Crown className="h-4 w-4 text-yellow-500" />
                    </div>
                    <p className="text-xs text-muted-foreground">{owner.email}</p>
                  </div>
                </div>
                <Badge variant="secondary">Owner</Badge>
              </div>
            )}

            {/* Admin List */}
            {admins.length > 0 ? (
              <div className="space-y-2">
                {admins.map((admin) => (
                  <AdminListItem
                    key={admin.id}
                    admin={admin}
                    onRemove={handleRemoveAdmin}
                    isRemoving={isRemoving}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No admins added yet. Add admins to share access to your data.
              </p>
            )}

            {/* Add Admin Button */}
            <Dialog open={addAdminOpen} onOpenChange={setAddAdminOpen}>
              <DialogTrigger asChild>
                <Button className="w-full" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Admin
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Admin</DialogTitle>
                  <DialogDescription>
                    Enter the email of a user you want to give access to your workspace.
                    They must have a Mentro account.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@example.com"
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={newAdminRole} onValueChange={setNewAdminRole}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin (Full Access)</SelectItem>
                        <SelectItem value="editor">Editor (Edit Only)</SelectItem>
                        <SelectItem value="viewer">Viewer (Read Only)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setAddAdminOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddAdmin} disabled={isAdding || !newAdminEmail.trim()}>
                    {isAdding ? "Adding..." : "Add Admin"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </AccountCard>
      </div>
    </div>
  );
}

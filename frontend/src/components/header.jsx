import { useNavigate } from "react-router-dom"
import ViewToggle from "./layout/ViewToggle.jsx"
import Avatars from "@/components/layout/Avatars"
import SearchBar from "./layout/SearchBar.jsx"
import { Button } from "@/components/ui/button.jsx";
import { Share2, UserRoundPlus } from "lucide-react";
import BreadCrumbs from "@/components/BreadCrumbs"
import { useViewStore } from "@/hooks/use-view-store.js";
import { useAdminStore } from "@/store/useAdminStore";


export default function Header({ title, description, onAddNew }) {
    const navigate = useNavigate();
    const { view, setView } = useViewStore();
    const { currentWorkspace } = useAdminStore();
    const showViewToggle = title === "Dashboard";

    // Only show Add Admin button if user is the workspace owner
    const isOwner = !currentWorkspace || currentWorkspace.isOwnWorkspace;

    const handleAddAdmin = () => {
        // Navigate to account page with query param to auto-open add admin dialog
        navigate("/account?addAdmin=true");
    };
    
    return (
        <div className="my-2">
            <div className="flex justify-between">
                <BreadCrumbs className="text-muted-foreground" />
                <div className="flex gap-2">
                  <Avatars />
                  {isOwner && (
                    <Button variant="outline" onClick={handleAddAdmin}>
                      <UserRoundPlus fill="foreground" fillOpacity="20%" />
                      <span>Add Admin</span>
                    </Button>
                  )}
                </div>
            </div>
            <div className="text-accent-foreground text-2xl">{description}</div>
            <div className="flex items-center my-4 w-full">
                {showViewToggle && <ViewToggle setView={setView} view={view} className="hidden sm:flex" />}

                <div className="flex gap-x-2 ml-auto">
                    <SearchBar />
                    <Button  variant="outline" >
                        <Share2 />
                        <p>Share</p>
                    </Button>
                    
                    <Button onClick={onAddNew}>
                        <span>+</span>
                        <span>Add New</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}
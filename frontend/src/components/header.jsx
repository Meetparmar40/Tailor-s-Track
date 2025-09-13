import ViewToggle from "./layout/ViewToggle.jsx"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.jsx";
import SearchBar from "./layout/SearchBar.jsx"
import { Button } from "./ui/button.jsx";
import { Share2 } from "lucide-react";

export default function Header({title, discription}){
    return (
        <div className="mx-4 my-2">
          <div className="flex">
            <div className="inline-block">
              {/* Path */}
              <p className="text-sm text-slate-500">Path</p>
              <h1 className="text-3xl weight font-semibold">{title}</h1>
              <p className="text-slate-700">{discription}</p>
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <ViewToggle />
            <div className="flex gap-x-2">
              <SearchBar />
              <button className="flex gap-2 items-center border px-4 text-slate-700 rounded-xl hover:bg-slate-100">
                <Share2 className="w-4 h-4" />
                <p className="mb-1">Share</p>
              </button>
            </div>
          </div>
        </div>
    );
}
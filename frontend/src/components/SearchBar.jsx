import { Search } from "lucide-react";

export default function SearchBar({value, onChange}){
    return (
        <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search by name or date..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
      </div>
    )
}
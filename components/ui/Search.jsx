import { Search } from "lucide-react"

const SearchBtn = () => {
  return (
    <div className="relative w-full">
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
      />
      <input
        type="text"
        placeholder="Search location, property..."
        className="w-full pl-10 pr-4 py-2 rounded-xl
                   bg-(--bg-secondary)
                   text-[var(--text-primary)]
                   border border-[var(--border-color)]
                   focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
      />
    </div>
  )
}

export default SearchBtn

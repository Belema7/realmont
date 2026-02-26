import SearchBtn from "@/components/ui/Search";

export default function Home() {
  return (
     <div className="min-h-screen p-4 md:p-20 bg-(--bg-primary) text-(--text-primary) dark:bg-(--bg-primary) dark:text-(--text-primary)">
        <div className="md:hidden">
          <SearchBtn/>
        </div>
     </div>
  );
}






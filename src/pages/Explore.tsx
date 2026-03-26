import Logo from "@/components/Logo";
import { Link } from "react-router-dom";

const Explore = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="flex items-center justify-between px-6 md:px-12 py-6 border-b border-border">
        <Link to="/"><Logo /></Link>
      </nav>
      <div className="flex flex-col items-center justify-center py-32 px-6 text-center">
        <h1 className="font-serif text-4xl mb-4">Explore Jaiffersons</h1>
        <p className="text-muted-foreground text-[15px] max-w-[440px]">
          The public directory of upcoming sessions is coming soon. Browse topics, discover hosts, and apply to join.
        </p>
      </div>
    </div>
  );
};

export default Explore;

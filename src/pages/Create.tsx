import Logo from "@/components/Logo";
import { Link } from "react-router-dom";

const Create = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="flex items-center justify-between px-6 md:px-12 py-6 border-b border-border">
        <Link to="/"><Logo /></Link>
      </nav>
      <div className="flex flex-col items-center justify-center py-32 px-6 text-center">
        <h1 className="font-serif text-4xl mb-4">Create a Jaifferson</h1>
        <p className="text-muted-foreground text-[15px] max-w-[440px]">
          The conversational creation flow is coming soon. You'll be able to propose a topic, curate your table, and publish your session.
        </p>
      </div>
    </div>
  );
};

export default Create;

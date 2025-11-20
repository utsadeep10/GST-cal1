import { GSTCalculator } from "@/components/GSTCalculator";
import { ThemeToggle } from "@/components/ThemeToggle";

const Index = () => {
  return (
    <div className="min-h-screen bg-background py-12 px-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <GSTCalculator />
    </div>
  );
};

export default Index;

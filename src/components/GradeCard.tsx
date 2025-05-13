
import { Link } from "react-router-dom";
import { Book, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type GradeCardProps = {
  grade: number;
  title: string;
  description: string;
  color: string;
  icon?: React.ReactNode;
};

const GradeCard = ({ grade, title, description, color, icon }: GradeCardProps) => {
  return (
    <motion.div 
      className={cn(
        "relative overflow-hidden rounded-xl p-6 card-hover",
        color === "blue" && "bg-blue-600/10",
        color === "green" && "bg-green-600/10",
        color === "yellow" && "bg-yellow-600/10",
        color === "orange" && "bg-orange-600/10",
        color === "red" && "bg-red-600/10",
      )}
      whileHover={{ 
        scale: 1.03,
        transition: { duration: 0.2 } 
      }}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center space-x-2">
          <div className={cn(
            "p-2 rounded-full",
            color === "blue" && "bg-blue-600/20 text-blue-600",
            color === "green" && "bg-green-600/20 text-green-600",
            color === "yellow" && "bg-yellow-600/20 text-yellow-600",
            color === "orange" && "bg-orange-600/20 text-orange-600",
            color === "red" && "bg-red-600/20 text-red-600",
          )}>
            {icon || <Book className="h-5 w-5" />}
          </div>
          <h3 className={cn(
            "text-lg font-semibold",
            color === "blue" && "text-blue-600",
            color === "green" && "text-green-600",
            color === "yellow" && "text-yellow-600",
            color === "orange" && "text-orange-600",
            color === "red" && "text-red-600",
          )}>
            {title}
          </h3>
        </div>
        
        <p className="mt-2 text-gray-600 text-sm">{description}</p>
        
        <Link 
          to={`/dashboard?grade=${grade}`} 
          className={cn(
            "mt-4 inline-flex items-center text-sm font-medium",
            color === "blue" && "text-blue-600",
            color === "green" && "text-green-600",
            color === "yellow" && "text-yellow-600",
            color === "orange" && "text-orange-600",
            color === "red" && "text-red-600",
          )}
        >
          Enter Class <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>

      <div className={cn(
        "absolute -bottom-8 -right-8 h-24 w-24 rounded-full opacity-20",
        color === "blue" && "bg-blue-600",
        color === "green" && "bg-green-600",
        color === "yellow" && "bg-yellow-600",
        color === "orange" && "bg-orange-600",
        color === "red" && "bg-red-600",
      )}/>
      
      <div className={cn(
        "absolute top-3 right-3 text-3xl font-bold opacity-10",
        color === "blue" && "text-blue-600",
        color === "green" && "text-green-600",
        color === "yellow" && "text-yellow-600",
        color === "orange" && "text-orange-600",
        color === "red" && "text-red-600",
      )}>
        {grade}
      </div>
    </motion.div>
  );
};

export default GradeCard;


import React from "react";
import ChapterCard from "@/components/ChapterCard";
import { Button } from "@/components/ui/button";
import { Chapter } from "@/types/dashboard";

interface ChaptersListProps {
  chapters: Chapter[];
  subjectColor?: string;
}

const ChaptersList = ({ chapters, subjectColor = "blue" }: ChaptersListProps) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Mathematics Chapters</h2>
        <Button variant="ghost" size="sm" className="text-ap-blue">
          View All
        </Button>
      </div>
      <div className="space-y-4">
        {chapters.map((chapter, index) => (
          <ChapterCard 
            key={index}
            title={chapter.title}
            description={chapter.description}
            status={chapter.status}
            duration={chapter.duration}
            subjectColor={subjectColor}
            showStudyIcon={index === 0} // Show study icon for the first chapter as an example
          />
        ))}
      </div>
    </div>
  );
};

export default ChaptersList;

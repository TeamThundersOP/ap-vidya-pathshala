
import React from "react";
import ChapterCard from "@/components/ChapterCard";
import { Button } from "@/components/ui/button";
import { Chapter } from "@/types/dashboard";
import { useNavigate, useLocation } from "react-router-dom";

interface ChaptersListProps {
  chapters: Chapter[];
  subjectColor?: string;
  gradeId?: number;
}

const ChaptersList = ({ chapters, subjectColor = "blue", gradeId = 8 }: ChaptersListProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const showFractions = searchParams.get('showFractions') === 'true';
  
  const handleChapterClick = (chapter: Chapter, index: number) => {
    // If 8th grade and first chapter (Fractions)
    if (gradeId === 8 && index === 0) {
      navigate(`/chapter/grade/${gradeId}/fractions`);
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Mathematics Chapters</h2>
        <Button variant="ghost" size="sm" className="text-ev-blue">
          View All
        </Button>
      </div>
      <div className="space-y-4">
        {chapters.map((chapter, index) => {
          // For 8th grade, first chapter, set progress to 0 if showFractions is true
          let progress = undefined;
          if (gradeId === 8 && index === 0 && showFractions) {
            progress = 0;
          }
          
          return (
            <div key={index} onClick={() => handleChapterClick(chapter, index)}>
              <ChapterCard 
                title={chapter.title}
                description={chapter.description}
                status={chapter.status}
                duration={chapter.duration}
                subjectColor={subjectColor}
                showStudyIcon={index === 0} 
                progress={progress}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChaptersList;

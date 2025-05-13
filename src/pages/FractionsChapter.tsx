
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import AdaptiveQuiz, { QuizQuestion, LearningPathway } from '@/components/AdaptiveLearning/AdaptiveQuiz';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

// Mock data for the first diagnostic quiz on fractions
const diagnosticQuestions: QuizQuestion[] = [
  {
    id: 'Q1',
    question: 'Which of these is a proper fraction?',
    options: [
      { id: 'A', text: '5/4' },
      { id: 'B', text: '7/7' },
      { id: 'C', text: '3/8' },
      { id: 'D', text: '9/5' }
    ],
    correctAnswer: 'C',
    explanation: 'A proper fraction has a numerator that is less than its denominator. Only 3/8 has a numerator (3) less than its denominator (8).'
  },
  {
    id: 'Q2',
    question: 'Simplify: 18/24',
    options: [
      { id: 'A', text: '3/4' },
      { id: 'B', text: '2/3' },
      { id: 'C', text: '4/6' },
      { id: 'D', text: '6/9' }
    ],
    correctAnswer: 'A',
    explanation: 'To simplify 18/24, divide both the numerator and denominator by their greatest common factor (GCF), which is 6. 18÷6=3 and 24÷6=4, so 18/24 = 3/4.'
  },
  {
    id: 'Q3',
    question: 'Add: 3/5 + 2/3 = ?',
    options: [
      { id: 'A', text: '5/8' },
      { id: 'B', text: '13/15' },
      { id: 'C', text: '11/15' },
      { id: 'D', text: '6/8' }
    ],
    correctAnswer: 'C',
    explanation: 'To add fractions with unlike denominators, first find the LCD (15). Convert 3/5 to 9/15 and 2/3 to 10/15. Then add: 9/15 + 10/15 = 19/15 = 1 4/15.'
  },
  {
    id: 'Q4',
    question: 'Multiply: 7/8 × 2/3 = ?',
    options: [
      { id: 'A', text: '9/12' },
      { id: 'B', text: '14/24' },
      { id: 'C', text: '7/12' },
      { id: 'D', text: '10/11' }
    ],
    correctAnswer: 'C',
    explanation: 'To multiply fractions, multiply the numerators and denominators: 7/8 × 2/3 = (7×2)/(8×3) = 14/24 = 7/12 after simplifying.'
  },
  {
    id: 'Q5',
    question: 'Divide: (5/6) ÷ (2/3) = ?',
    options: [
      { id: 'A', text: '10/18' },
      { id: 'B', text: '15/12' },
      { id: 'C', text: '5/9' },
      { id: 'D', text: '5/4' }
    ],
    correctAnswer: 'D',
    explanation: 'To divide fractions, multiply by the reciprocal of the second fraction: 5/6 ÷ 2/3 = 5/6 × 3/2 = 15/12 = 5/4.'
  }
];

// Concepts for addition with unlike denominators
const additionRemedialQuestions: QuizQuestion[] = [
  {
    id: 'Q6',
    question: '4/7 + 1/3 = ?',
    options: [
      { id: 'A', text: '5/10' },
      { id: 'B', text: '19/21' },
      { id: 'C', text: '5/21' },
      { id: 'D', text: '7/10' }
    ],
    correctAnswer: 'B',
    explanation: 'First find the LCD of 7 and 3, which is 21. Convert to equivalent fractions: 4/7 = 12/21 and 1/3 = 7/21. Then add: 12/21 + 7/21 = 19/21.'
  },
  {
    id: 'Q7',
    question: '5/6 - 1/4 = ?',
    options: [
      { id: 'A', text: '4/2' },
      { id: 'B', text: '7/12' },
      { id: 'C', text: '1/12' },
      { id: 'D', text: '2/3' }
    ],
    correctAnswer: 'B',
    explanation: 'Find the LCD of 6 and 4, which is 12. Convert to equivalent fractions: 5/6 = 10/12 and 1/4 = 3/12. Subtract: 10/12 - 3/12 = 7/12.'
  },
  {
    id: 'Q8',
    question: '2/5 + 3/10 = ?',
    options: [
      { id: 'A', text: '7/15' },
      { id: 'B', text: '5/15' },
      { id: 'C', text: '7/10' },
      { id: 'D', text: '1/2' }
    ],
    correctAnswer: 'C',
    explanation: 'Find the LCD of 5 and 10, which is 10. Convert to equivalent fractions: 2/5 = 4/10 and 3/10 stays the same. Add: 4/10 + 3/10 = 7/10.'
  },
];

// Concepts for division using reciprocals
const divisionRemedialQuestions: QuizQuestion[] = [
  {
    id: 'Q9',
    question: '(4/5) ÷ (1/2) = ?',
    options: [
      { id: 'A', text: '8/5' },
      { id: 'B', text: '2/5' },
      { id: 'C', text: '4/10' },
      { id: 'D', text: '5/2' }
    ],
    correctAnswer: 'A',
    explanation: 'To divide fractions, multiply by the reciprocal of the second fraction: 4/5 ÷ 1/2 = 4/5 × 2/1 = 8/5.'
  },
  {
    id: 'Q10',
    question: '(2/3) ÷ (4/7) = ?',
    options: [
      { id: 'A', text: '14/12' },
      { id: 'B', text: '7/6' },
      { id: 'C', text: '8/21' },
      { id: 'D', text: '2/6' }
    ],
    correctAnswer: 'B',
    explanation: 'To divide fractions, multiply by the reciprocal: 2/3 ÷ 4/7 = 2/3 × 7/4 = 14/12 = 7/6.'
  },
  {
    id: 'Q11',
    question: '(6/7) ÷ (3/5) = ?',
    options: [
      { id: 'A', text: '10/21' },
      { id: 'B', text: '18/35' },
      { id: 'C', text: '10/7' },
      { id: 'D', text: '2/1' }
    ],
    correctAnswer: 'C',
    explanation: 'To divide fractions, multiply by the reciprocal: 6/7 ÷ 3/5 = 6/7 × 5/3 = 30/21 = 10/7.'
  },
];

type LearningStage = 
  | 'diagnosticAssessment' 
  | 'learningPathway' 
  | 'conceptReview' 
  | 'practiceReinforcement' 
  | 'finalAssessment'
  | 'results';

const FractionsChapter = () => {
  const navigate = useNavigate();
  const { gradeId } = useParams<{ gradeId: string }>();
  const [learningStage, setLearningStage] = useState<LearningStage>('diagnosticAssessment');
  const [quizResults, setQuizResults] = useState({
    score: 0,
    incorrectQuestions: [] as string[],
    masteredConcepts: [] as string[],
    needsReinforcementConcepts: [] as string[],
  });
  const [currentConceptQuiz, setCurrentConceptQuiz] = useState<QuizQuestion[]>([]);
  const [currentConceptIndex, setCurrentConceptIndex] = useState(0);
  
  const handleBackToSubject = () => {
    navigate(-1);
  };

  const handleCompleteDiagnostic = (
    score: number, 
    incorrectQuestions: string[], 
    masteredConcepts: string[], 
    needsReinforcementConcepts: string[]
  ) => {
    setQuizResults({
      score,
      incorrectQuestions,
      masteredConcepts,
      needsReinforcementConcepts
    });
    setLearningStage('learningPathway');
    
    // Auto-progress to concept review after a short delay
    setTimeout(() => {
      if (needsReinforcementConcepts.includes('addition_with_unlike_denominators')) {
        setCurrentConceptQuiz(additionRemedialQuestions);
        setLearningStage('conceptReview');
      } else if (needsReinforcementConcepts.includes('division_using_reciprocal')) {
        setCurrentConceptQuiz(divisionRemedialQuestions);
        setLearningStage('conceptReview');
      } else {
        setLearningStage('results');
        toast.success("Congratulations! You've mastered all the concepts in this chapter!");
      }
    }, 3000);
  };

  const handleCompleteConceptReview = (
    score: number, 
    incorrectQuestions: string[], 
    masteredConcepts: string[], 
    needsReinforcementConcepts: string[]
  ) => {
    // Update the quiz results with the new data
    setQuizResults(prev => ({
      ...prev,
      score,
      incorrectQuestions,
    }));

    // If there are still concepts needing reinforcement
    const remainingConcepts = [...quizResults.needsReinforcementConcepts];
    
    if (currentConceptQuiz === additionRemedialQuestions) {
      // Remove this concept from those needing reinforcement
      const index = remainingConcepts.indexOf('addition_with_unlike_denominators');
      if (index !== -1) {
        remainingConcepts.splice(index, 1);
      }
      
      // Add to mastered if score is good
      if (score >= 70) {
        setQuizResults(prev => ({
          ...prev,
          masteredConcepts: [...prev.masteredConcepts, 'addition_with_unlike_denominators'],
          needsReinforcementConcepts: remainingConcepts
        }));
      }
      
      // Check if division concept needs review next
      if (remainingConcepts.includes('division_using_reciprocal')) {
        setCurrentConceptQuiz(divisionRemedialQuestions);
        setCurrentConceptIndex(currentConceptIndex + 1);
        
        // Show toast and allow a slight pause before next quiz
        toast.success("Great job on addition! Let's work on division next.");
        
        // Stay in concept review stage for the next quiz
        return;
      }
    } else if (currentConceptQuiz === divisionRemedialQuestions) {
      // Remove this concept from those needing reinforcement
      const index = remainingConcepts.indexOf('division_using_reciprocal');
      if (index !== -1) {
        remainingConcepts.splice(index, 1);
      }
      
      // Add to mastered if score is good
      if (score >= 70) {
        setQuizResults(prev => ({
          ...prev,
          masteredConcepts: [...prev.masteredConcepts, 'division_using_reciprocal'],
          needsReinforcementConcepts: remainingConcepts
        }));
      }
    }
    
    // Move to final results
    setLearningStage('results');
    toast.success("Congratulations on completing your personalized learning path!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center">
          <Button variant="outline" onClick={handleBackToSubject} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Chapter: Fractions (Grade 8)</h1>
            <p className="text-gray-600">Personalized Adaptive Learning Journey</p>
          </div>
        </div>
        
        {learningStage === 'diagnosticAssessment' && (
          <AdaptiveQuiz
            title="Diagnostic Assessment"
            description="Answer the following questions to the best of your ability. This will help us personalize your learning experience."
            questions={diagnosticQuestions}
            onComplete={handleCompleteDiagnostic}
            chapterName="Fractions"
          />
        )}
        
        {learningStage === 'learningPathway' && (
          <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-sm">
            <h2 className="text-xl font-bold text-center mb-6">Building Your Personalized Learning Path...</h2>
            <div className="flex justify-center">
              <div className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-slate-200 h-10 w-10"></div>
                <div className="flex-1 space-y-6 py-1">
                  <div className="h-2 bg-slate-200 rounded"></div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                      <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                    </div>
                    <div className="h-2 bg-slate-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {learningStage === 'conceptReview' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold">
                Concept {currentConceptIndex + 1}: {
                  currentConceptQuiz === additionRemedialQuestions 
                    ? "Adding/Subtracting Fractions with Unlike Denominators" 
                    : "Dividing Fractions (Using Reciprocals)"
                }
              </h2>
              <p className="text-gray-600">
                Let's strengthen your understanding of this concept with practice questions.
              </p>
            </div>
            
            <AdaptiveQuiz
              title={
                currentConceptQuiz === additionRemedialQuestions 
                  ? "Practice: Addition & Subtraction with Unlike Denominators" 
                  : "Practice: Division of Fractions"
              }
              description={
                currentConceptQuiz === additionRemedialQuestions
                  ? "Remember: To add or subtract fractions with different denominators, find the LCD, convert to equivalent fractions, then add/subtract the numerators."
                  : "Remember: To divide fractions, multiply by the reciprocal of the second fraction."
              }
              questions={currentConceptQuiz}
              onComplete={handleCompleteConceptReview}
              showExplanations={true}
              chapterName="Fractions"
            />
          </div>
        )}
        
        {learningStage === 'results' && (
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center p-4 rounded-full bg-green-100 text-green-600">
                <CheckCircle className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-bold mt-4">Learning Journey Complete!</h2>
              <p className="text-gray-600 mt-2">
                You've completed your personalized learning journey for the Fractions chapter.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">Final Mastery Summary</h3>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <span className="text-green-600">✅</span>
                    <div>
                      <span className="font-medium">Mastered Concepts: </span>
                      {quizResults.masteredConcepts.length > 0 ? 
                        quizResults.masteredConcepts.map(c => {
                          switch(c) {
                            case 'proper_fractions': return 'Proper/Improper Fractions';
                            case 'simplification': return 'Simplification of Fractions';
                            case 'addition_with_unlike_denominators': return 'Addition with Unlike Denominators';
                            case 'multiplication': return 'Multiplication of Fractions';
                            case 'division_using_reciprocal': return 'Division using Reciprocal';
                            default: return c;
                          }
                        }).join(", ")
                      : "N/A"}
                    </div>
                  </div>
                  
                  {quizResults.needsReinforcementConcepts.length > 0 && (
                    <div className="flex gap-2">
                      <span className="text-amber-600">⚠️</span>
                      <div>
                        <span className="font-medium">Areas for More Practice: </span>
                        {quizResults.needsReinforcementConcepts.map(c => {
                          switch(c) {
                            case 'proper_fractions': return 'Proper/Improper Fractions';
                            case 'simplification': return 'Simplification of Fractions';
                            case 'addition_with_unlike_denominators': return 'Addition with Unlike Denominators';
                            case 'multiplication': return 'Multiplication of Fractions';
                            case 'division_using_reciprocal': return 'Division using Reciprocal';
                            default: return c;
                          }
                        }).join(", ")}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="border-l-4 border-blue-400 pl-4 py-2 bg-blue-50">
                <h3 className="font-medium">Next Steps Recommended:</h3>
                <ul className="mt-2 space-y-1">
                  <li>✓ Review visual models for fraction concepts</li>
                  <li>✓ Practice mixed word problems</li>
                  <li>✓ Explore the connection between fractions and decimals</li>
                </ul>
              </div>
              
              <div className="flex justify-center mt-6">
                <Button className="mr-4" variant="outline" onClick={handleBackToSubject}>
                  Back to Subject
                </Button>
                <Button onClick={() => window.location.reload()}>
                  Restart Chapter
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default FractionsChapter;

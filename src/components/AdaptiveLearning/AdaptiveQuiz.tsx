
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, HelpCircle, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export type QuizQuestion = {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
  explanation?: string;
};

export type LearningPathway = {
  id: string;
  name: string;
  description: string;
  concepts: {
    id: string;
    name: string;
    description: string;
    masteryLevel: number;
  }[];
};

type AdaptiveQuizProps = {
  title: string;
  description?: string;
  questions: QuizQuestion[];
  onComplete: (score: number, incorrectQuestions: string[], masteredConcepts: string[], needsReinforcementConcepts: string[]) => void;
  showExplanations?: boolean;
  minPassingScore?: number;
  chapterName?: string;
};

const AdaptiveQuiz = ({
  title,
  description = "Answer the following questions to the best of your ability.",
  questions,
  onComplete,
  showExplanations = true,
  minPassingScore = 60,
  chapterName = "Fractions"
}: AdaptiveQuizProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [incorrectQuestions, setIncorrectQuestions] = useState<string[]>([]);
  const [showingExplanation, setShowingExplanation] = useState(false);
  const [masteredConcepts, setMasteredConcepts] = useState<string[]>([]);
  const [needsReinforcementConcepts, setNeedsReinforcementConcepts] = useState<string[]>([]);

  // Simplified concept mapping for the demonstration
  const questionConceptMap: Record<string, string> = {
    'Q1': 'proper_fractions',
    'Q2': 'simplification',
    'Q3': 'addition_with_unlike_denominators',
    'Q4': 'multiplication',
    'Q5': 'division_using_reciprocal',
  };

  const conceptLabels: Record<string, string> = {
    'proper_fractions': 'Proper Fractions',
    'simplification': 'Simplification of Fractions',
    'addition_with_unlike_denominators': 'Addition with Unlike Denominators',
    'multiplication': 'Multiplication of Fractions',
    'division_using_reciprocal': 'Division using Reciprocal',
  };

  useEffect(() => {
    // Reset state when questions change
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setScore(0);
    setIncorrectQuestions([]);
  }, [questions]);

  const handleSelectAnswer = (questionId: string, answerId: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };

  const handleNextQuestion = () => {
    if (showingExplanation) {
      setShowingExplanation(false);
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        handleSubmitQuiz();
      }
    } else {
      const currentQuestion = questions[currentQuestionIndex];
      const isCorrect = selectedAnswers[currentQuestion.id] === currentQuestion.correctAnswer;
      
      if (!isCorrect && showExplanations) {
        setShowingExplanation(true);
      } else if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        handleSubmitQuiz();
      }
    }
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    const wrongQuestionIds: string[] = [];
    const masteredConceptsSet = new Set<string>();
    const needsReinforcementSet = new Set<string>();

    questions.forEach(question => {
      const isCorrect = selectedAnswers[question.id] === question.correctAnswer;
      if (isCorrect) {
        correctCount++;
        const concept = questionConceptMap[question.id];
        if (concept) masteredConceptsSet.add(concept);
      } else {
        wrongQuestionIds.push(question.id);
        const concept = questionConceptMap[question.id];
        if (concept) needsReinforcementSet.add(concept);
      }
    });

    const finalScore = Math.round((correctCount / questions.length) * 100);
    setScore(finalScore);
    setIncorrectQuestions(wrongQuestionIds);
    setQuizSubmitted(true);
    
    // Remove any concepts that are in both sets (student got some right and some wrong)
    masteredConceptsSet.forEach(concept => {
      if (needsReinforcementSet.has(concept)) {
        masteredConceptsSet.delete(concept);
      }
    });
    
    const masteredArray = Array.from(masteredConceptsSet);
    const needsReinforcementArray = Array.from(needsReinforcementSet);
    
    setMasteredConcepts(masteredArray);
    setNeedsReinforcementConcepts(needsReinforcementArray);
    
    onComplete(finalScore, wrongQuestionIds, masteredArray, needsReinforcementArray);
  };

  if (questions.length === 0) {
    return <div className="text-center p-8">No questions available for this quiz.</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isPassed = score >= minPassingScore;

  if (quizSubmitted) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle>{score >= minPassingScore ? "Congratulations!" : "Quiz Completed"}</CardTitle>
          <CardDescription>
            You scored {score}% on the {chapterName} Diagnostic Assessment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center my-8">
            <div className={cn(
              "inline-flex items-center justify-center p-6 rounded-full",
              isPassed ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"
            )}>
              {isPassed ? (
                <CheckCircle className="h-16 w-16" />
              ) : (
                <HelpCircle className="h-16 w-16" />
              )}
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg">
            <h3 className="font-medium text-lg mb-3">Diagnostic Summary:</h3>
            <div className="space-y-2">
              {masteredConcepts.length > 0 && (
                <div className="flex gap-2">
                  <span className="text-green-600">✅</span>
                  <div>
                    <span className="font-medium">Understands: </span>
                    {masteredConcepts.map(concept => conceptLabels[concept]).join(", ")}
                  </div>
                </div>
              )}
              
              {needsReinforcementConcepts.length > 0 && (
                <div className="flex gap-2">
                  <span className="text-red-600">❌</span>
                  <div>
                    <span className="font-medium">Needs support in: </span>
                    {needsReinforcementConcepts.map(concept => conceptLabels[concept]).join(", ")}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-lg mb-1">Learning Path Triggered:</h3>
            <ul className="list-disc list-inside space-y-1 pl-2">
              {needsReinforcementConcepts.length > 0 ? (
                needsReinforcementConcepts.map((concept, idx) => (
                  <li key={idx}>Concept Review: {conceptLabels[concept]}</li>
                ))
              ) : (
                <li>Advanced Topics: Converting Fractions to Decimals</li>
              )}
              <li>Visual & Real-world Problems to deepen understanding</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => window.location.reload()}>
            Continue Learning Path <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <div className="flex gap-2 mt-4">
          {questions.map((_, idx) => (
            <div 
              key={idx} 
              className={cn(
                "h-2 flex-1 rounded-full",
                idx < currentQuestionIndex ? "bg-green-500" : 
                idx === currentQuestionIndex ? "bg-blue-500" : 
                "bg-gray-200"
              )}
            />
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-lg font-medium">
            Q{currentQuestionIndex + 1}. {currentQuestion.question}
          </div>
          
          {showingExplanation ? (
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <h3 className="font-medium text-amber-800">Explanation:</h3>
              <p className="mt-1 text-amber-700">
                {currentQuestion.explanation || 
                 `The correct answer is ${
                   currentQuestion.options.find(opt => opt.id === currentQuestion.correctAnswer)?.text
                 }. Make sure to understand why this is the correct solution before moving to the next question.`
                }
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <div 
                  key={option.id}
                  onClick={() => handleSelectAnswer(currentQuestion.id, option.id)}
                  className={cn(
                    "p-4 border rounded-lg cursor-pointer transition-colors",
                    selectedAnswers[currentQuestion.id] === option.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
                  )}
                >
                  {option.text}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div>
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
        <Button
          onClick={handleNextQuestion}
          disabled={!selectedAnswers[currentQuestion.id] && !showingExplanation}
        >
          {showingExplanation 
            ? "Next Question" 
            : currentQuestionIndex === questions.length - 1 
              ? "Finish Quiz" 
              : "Next"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AdaptiveQuiz;

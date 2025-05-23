
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Download, Filter, Mail, Phone, Search, BookOpen, Calendar, School, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MOCK_TEACHERS } from "@/data/mockTeachers";
import { MOCK_SCHOOLS } from "@/data/mockSchools";

export default function TeacherManagement() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [showTeacherDialog, setShowTeacherDialog] = useState(false);
  
  // Filter teachers based on search query
  const filteredTeachers = MOCK_TEACHERS.filter(teacher => 
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.subjects.some(subj => subj.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleViewTeacher = (teacher: any) => {
    setSelectedTeacher(teacher);
    setShowTeacherDialog(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Teacher Management</h2>
          <p className="text-gray-600 mt-1">
            {user?.role === "admin" ? 
              "Manage all teachers across schools" : 
              "Manage teachers in your assigned schools"}
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Teacher
          </Button>
        </div>
      </div>

      <Card>
        <div className="p-4">
          <div className="flex items-center justify-between pb-4">
            <p className="text-sm text-muted-foreground">
              Showing {filteredTeachers.length} teachers
            </p>
            
            <div className="relative w-full max-w-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search teachers..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Teacher Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Subjects</TableHead>
                <TableHead>Grades</TableHead>
                <TableHead>School</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeachers.map((teacher) => {
                // Find the school for this teacher
                const school = MOCK_SCHOOLS.find(sch => sch.id === teacher.schoolId);
                
                return (
                  <TableRow key={teacher.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-medium">{teacher.name}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-2" />
                          <span>{teacher.email}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="h-3 w-3 mr-2" />
                          <span>{teacher.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {teacher.subjects.map((subject) => (
                          <Badge key={subject} variant="outline" className="bg-blue-50">
                            <BookOpen className="h-3 w-3 mr-1" />
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {teacher.grades.map((grade) => (
                          <Badge key={grade} variant="outline">Grade {grade}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <School className="h-3 w-3 mr-2" />
                        <span className="text-sm">{school?.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={
                          teacher.status === 'active' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 
                          teacher.status === 'leave' ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' : 
                          'bg-red-100 text-red-800 hover:bg-red-200'
                        }
                      >
                        {teacher.status === 'active' ? 'Active' : 
                        teacher.status === 'leave' ? 'On Leave' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => handleViewTeacher(teacher)}>
                        View Profile
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredTeachers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                    No teachers found matching your search
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Teacher Profile Dialog */}
      <Dialog open={showTeacherDialog} onOpenChange={setShowTeacherDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Teacher Profile</DialogTitle>
            <DialogDescription>
              Detailed information about {selectedTeacher?.name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedTeacher && (
            <div className="space-y-6">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-2xl font-bold">
                  {selectedTeacher.name.charAt(0)}
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold">{selectedTeacher.name}</h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <BookOpen className="h-3 w-3 mr-1" />
                    {selectedTeacher.subjects.join(", ")}
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Contact Information</h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{selectedTeacher.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{selectedTeacher.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <School className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{MOCK_SCHOOLS.find(s => s.id === selectedTeacher.schoolId)?.name}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Academic Information</h4>
                  <div className="mt-2 space-y-2">
                    <div>
                      <span className="text-gray-500">Qualification:</span>
                      <span className="ml-2">{selectedTeacher.qualification}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Specialization:</span>
                      <span className="ml-2">{selectedTeacher.specialization}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Join Date:</span>
                      <span className="ml-2">{new Date(selectedTeacher.joinDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">Teaching Load</h4>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded-md flex items-center">
                    <div className="rounded-full bg-blue-100 p-2">
                      <User className="h-4 w-4 text-blue-900" />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm text-gray-500">Students</div>
                      <div className="text-xl font-semibold">
                        {MOCK_SCHOOLS.find(s => s.id === selectedTeacher.schoolId)?.students / 3}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-3 rounded-md flex items-center">
                    <div className="rounded-full bg-green-100 p-2">
                      <Calendar className="h-4 w-4 text-green-900" />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm text-gray-500">Performance</div>
                      <div className="text-xl font-semibold">{85 + Math.floor(Math.random() * 10)}%</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setShowTeacherDialog(false)}>Close</Button>
                <Button>Edit Profile</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

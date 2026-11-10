import { useState } from "react";
import { Calendar, CheckCircle2, Clock, AlertCircle, Plus, FileText, GraduationCap, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { mockTasks } from "@/data/colleges";
import { Task } from "@/types";
import { toast } from "sonner";

const statusIcons = {
  upcoming: Clock,
  pending: AlertCircle,
  completed: CheckCircle2,
};

const typeIcons = {
  application: FileText,
  exam: GraduationCap,
  document: File,
  other: Calendar,
};

const statusColors = {
  upcoming: "bg-secondary/10 text-secondary border-secondary/30",
  pending: "bg-warning/10 text-warning border-warning/30",
  completed: "bg-success/10 text-success border-success/30",
};

export const Tracker = () => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: "",
    dueDate: "",
    status: "upcoming",
    type: "application",
    description: "",
  });

  const stats = {
    pending: tasks.filter(t => t.status === "pending").length,
    completed: tasks.filter(t => t.status === "completed").length,
    upcoming: tasks.filter(t => t.status === "upcoming").length,
    exams: tasks.filter(t => t.type === "exam").length,
  };

  const handleAddTask = () => {
    if (!newTask.title || !newTask.dueDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title!,
      dueDate: newTask.dueDate!,
      status: newTask.status as Task["status"],
      type: newTask.type as Task["type"],
      description: newTask.description,
    };

    setTasks([...tasks, task]);
    setNewTask({
      title: "",
      dueDate: "",
      status: "upcoming",
      type: "application",
      description: "",
    });
    setIsDialogOpen(false);
    toast.success("Task added successfully!");
  };

  const toggleTaskStatus = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const newStatus = task.status === "completed" ? "pending" : "completed";
        return { ...task, status: newStatus };
      }
      return task;
    }));
  };

  return (
    <section id="tracker" className="min-h-screen py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h2 className="text-4xl font-bold mb-2">Application Tracker</h2>
              <p className="text-xl text-muted-foreground">Stay on top of deadlines and tasks</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-5 w-5" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Task</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="task-title">Task Title *</Label>
                    <Input
                      id="task-title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      placeholder="e.g., Submit Application"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="task-type">Type</Label>
                      <Select
                        value={newTask.type}
                        onValueChange={(value) => setNewTask({ ...newTask, type: value as Task["type"] })}
                      >
                        <SelectTrigger id="task-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="application">Application</SelectItem>
                          <SelectItem value="exam">Exam</SelectItem>
                          <SelectItem value="document">Document</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="task-status">Status</Label>
                      <Select
                        value={newTask.status}
                        onValueChange={(value) => setNewTask({ ...newTask, status: value as Task["status"] })}
                      >
                        <SelectTrigger id="task-status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="upcoming">Upcoming</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="task-date">Due Date *</Label>
                    <Input
                      id="task-date"
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="task-desc">Description</Label>
                    <Textarea
                      id="task-desc"
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      placeholder="Additional details..."
                      rows={3}
                    />
                  </div>
                  <Button onClick={handleAddTask} className="w-full">
                    Add Task
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-card rounded-xl p-4 border border-border shadow-soft">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="h-4 w-4 text-warning" />
                <span className="text-sm text-muted-foreground">Pending</span>
              </div>
              <p className="text-2xl font-bold">{stats.pending}</p>
            </div>
            <div className="bg-card rounded-xl p-4 border border-border shadow-soft">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span className="text-sm text-muted-foreground">Completed</span>
              </div>
              <p className="text-2xl font-bold">{stats.completed}</p>
            </div>
            <div className="bg-card rounded-xl p-4 border border-border shadow-soft">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-4 w-4 text-secondary" />
                <span className="text-sm text-muted-foreground">Upcoming</span>
              </div>
              <p className="text-2xl font-bold">{stats.upcoming}</p>
            </div>
            <div className="bg-card rounded-xl p-4 border border-border shadow-soft">
              <div className="flex items-center gap-2 mb-1">
                <GraduationCap className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Exams</span>
              </div>
              <p className="text-2xl font-bold">{stats.exams}</p>
            </div>
          </div>
        </div>

        {/* Task Timeline */}
        <div className="space-y-4">
          {tasks.map((task, index) => {
            const StatusIcon = statusIcons[task.status];
            const TypeIcon = typeIcons[task.type];
            
            return (
              <div
                key={task.id}
                className="bg-card rounded-xl p-6 border border-border shadow-soft hover:shadow-medium transition-shadow animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleTaskStatus(task.id)}
                    className={`mt-1 p-2 rounded-lg transition-colors ${
                      task.status === "completed"
                        ? "bg-success/20 text-success"
                        : "bg-muted hover:bg-muted-foreground/10"
                    }`}
                  >
                    <StatusIcon className="h-5 w-5" />
                  </button>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className={`text-lg font-semibold ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}>
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Badge className={statusColors[task.status]}>
                          {task.status}
                        </Badge>
                        <Badge variant="outline" className="gap-1">
                          <TypeIcon className="h-3 w-3" />
                          {task.type}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Due: {new Date(task.dueDate).toLocaleDateString("en-US", { 
                        year: "numeric", 
                        month: "long", 
                        day: "numeric" 
                      })}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {tasks.length === 0 && (
          <div className="bg-card rounded-xl p-12 text-center shadow-soft">
            <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Tasks Yet</h3>
            <p className="text-muted-foreground mb-6">
              Add your first task to start tracking your application journey
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-5 w-5 mr-2" />
              Add Your First Task
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

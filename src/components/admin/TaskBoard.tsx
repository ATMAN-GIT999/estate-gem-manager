import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Calendar,
  User,
  Building,
  Megaphone,
  Wrench,
  MoreHorizontal,
  GripVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface Task {
  id: string;
  title: string;
  description: string | null;
  category: string;
  status: string;
  priority: string;
  assigned_to: string | null;
  due_date: string | null;
  created_at: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string | null;
  role: string;
}

const statusColumns = [
  { id: "todo", label: "To Do", color: "bg-slate-100" },
  { id: "in_progress", label: "In Progress", color: "bg-blue-50" },
  { id: "review", label: "Review", color: "bg-amber-50" },
  { id: "done", label: "Done", color: "bg-green-50" },
];

const categoryConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  booking: { icon: Calendar, color: "bg-blue-500", label: "Booking" },
  maintenance: { icon: Wrench, color: "bg-orange-500", label: "Maintenance" },
  marketing: { icon: Megaphone, color: "bg-pink-500", label: "Marketing" },
  other: { icon: MoreHorizontal, color: "bg-slate-500", label: "Other" },
};

const priorityConfig: Record<string, { color: string; label: string }> = {
  low: { color: "bg-slate-400", label: "Low" },
  medium: { color: "bg-blue-500", label: "Medium" },
  high: { color: "bg-orange-500", label: "High" },
  urgent: { color: "bg-red-500", label: "Urgent" },
};

export default function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    category: "other",
    priority: "medium",
    assigned_to: "",
    due_date: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTasks();
    fetchTeamMembers();
  }, []);

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setTasks(data as Task[]);
    }
    setLoading(false);
  };

  const fetchTeamMembers = async () => {
    const { data } = await supabase.from("team_members").select("*");
    if (data) {
      setTeamMembers(data as TeamMember[]);
    }
  };

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) {
      toast({ title: "Error", description: "Task title is required", variant: "destructive" });
      return;
    }

    const { error } = await supabase.from("tasks").insert({
      title: newTask.title,
      description: newTask.description || null,
      category: newTask.category,
      priority: newTask.priority,
      assigned_to: newTask.assigned_to || null,
      due_date: newTask.due_date || null,
    });

    if (error) {
      toast({ title: "Error", description: "Failed to create task", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Task created" });
      setIsCreateOpen(false);
      setNewTask({
        title: "",
        description: "",
        category: "other",
        priority: "medium",
        assigned_to: "",
        due_date: "",
      });
      fetchTasks();
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    const { error } = await supabase
      .from("tasks")
      .update({ status: newStatus })
      .eq("id", taskId);

    if (!error) {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );
    }
  };

  const getMemberName = (id: string | null) => {
    if (!id) return null;
    const member = teamMembers.find((m) => m.id === id);
    return member?.name || null;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const TaskCard = ({ task }: { task: Task }) => {
    const category = categoryConfig[task.category] || categoryConfig.other;
    const priority = priorityConfig[task.priority] || priorityConfig.medium;
    const CategoryIcon = category.icon;
    const assigneeName = getMemberName(task.assigned_to);

    return (
      <Card className="mb-2 cursor-pointer hover:shadow-md transition-shadow group">
        <CardContent className="p-3">
          <div className="flex items-start gap-2">
            <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <div className={cn("p-1 rounded", category.color)}>
                  <CategoryIcon className="h-3 w-3 text-white" />
                </div>
                <Badge
                  variant="outline"
                  className={cn("text-[10px] px-1.5 py-0", priority.color, "text-white border-0")}
                >
                  {priority.label}
                </Badge>
              </div>
              <p className="font-medium text-sm truncate">{task.title}</p>
              {task.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {task.description}
                </p>
              )}
              <div className="flex items-center justify-between mt-3">
                {assigneeName ? (
                  <div className="flex items-center gap-1.5">
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                        {getInitials(assigneeName)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground truncate max-w-[80px]">
                      {assigneeName}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <User className="h-3 w-3" />
                    Unassigned
                  </div>
                )}
                {task.due_date && (
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(task.due_date), "MMM d")}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Task Board</h2>
          <p className="text-muted-foreground">Manage tasks across your team</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter task title..."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter description..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Category</Label>
                  <Select
                    value={newTask.category}
                    onValueChange={(v) => setNewTask((prev) => ({ ...prev, category: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(categoryConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Priority</Label>
                  <Select
                    value={newTask.priority}
                    onValueChange={(v) => setNewTask((prev) => ({ ...prev, priority: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(priorityConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Assign To</Label>
                  <Select
                    value={newTask.assigned_to}
                    onValueChange={(v) => setNewTask((prev) => ({ ...prev, assigned_to: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select member" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Due Date</Label>
                  <Input
                    type="date"
                    value={newTask.due_date}
                    onChange={(e) => setNewTask((prev) => ({ ...prev, due_date: e.target.value }))}
                  />
                </div>
              </div>
              <Button onClick={handleCreateTask} className="mt-2">
                Create Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-4 min-w-max pb-4">
          {statusColumns.map((column) => {
            const columnTasks = tasks.filter((t) => t.status === column.id);
            return (
              <div
                key={column.id}
                className={cn(
                  "w-72 rounded-xl p-3 flex flex-col",
                  column.color
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm">{column.label}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {columnTasks.length}
                  </Badge>
                </div>
                <ScrollArea className="flex-1">
                  {loading ? (
                    <div className="space-y-2">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-24 w-full rounded-lg" />
                      ))}
                    </div>
                  ) : columnTasks.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      No tasks
                    </div>
                  ) : (
                    columnTasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => {
                          const nextStatus =
                            column.id === "todo"
                              ? "in_progress"
                              : column.id === "in_progress"
                              ? "review"
                              : column.id === "review"
                              ? "done"
                              : "todo";
                          handleStatusChange(task.id, nextStatus);
                        }}
                      >
                        <TaskCard task={task} />
                      </div>
                    ))
                  )}
                </ScrollArea>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

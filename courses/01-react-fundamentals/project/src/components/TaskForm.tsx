
import { useState } from "react";

interface Task {
  id: string | number;
  title: string;
  description: string;
  priority: string;
  completed: boolean;
  category: string;
  tags: string[];
}

interface TaskFormProps {
  onAddTask: (task: Task) => void;
}

export default function TaskForm({
  onAddTask,
}: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");
  const [priority, setPriority] =
    useState("Low");

  // Challenge 12
  const [category, setCategory] =
    useState("General");
  const [tagsInput, setTagsInput] =
    useState("");

  const [error, setError] = useState("");

  function handleSubmit(
  e: React.FormEvent
) {
  e.preventDefault();

  if (!title.trim()) {
    setError("Title is required");
    return;
  }

  if (
    !["Low", "Medium", "High"].includes(
      priority
    )
  ) {
    setError("Invalid priority");
    return;
  }

  setError("");

  onAddTask({
    id: Date.now(),
    title: title.trim(),
    description: description.trim(),
    priority,
    completed: false,
    category,
    tags: tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
  });

  setTitle("");
  setDescription("");
  setPriority("Low");
  setCategory("General");
  setTagsInput("");
}
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="task-title">
        Title
      </label>
      <input
        id="task-title"
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
      />

      <label htmlFor="task-description">
        Description
      </label>
      <textarea
        id="task-description"
        placeholder="Description"
        value={description}
        onChange={(e) =>
          setDescription(
            e.target.value
          )
        }
      />

      <label htmlFor="task-priority">
        Priority
      </label>
      <select
        id="task-priority"
        value={priority}
        onChange={(e) =>
          setPriority(e.target.value)
        }
      >
        <option value="Low">
          Low
        </option>
        <option value="Medium">
          Medium
        </option>
        <option value="High">
          High
        </option>
      </select>

      <label htmlFor="task-category">
        Category
      </label>
      <select
        id="task-category"
        value={category}
        onChange={(e) =>
          setCategory(e.target.value)
        }
      >
        <option value="General">
          General
        </option>
        <option value="Work">
          Work
        </option>
        <option value="Personal">
          Personal
        </option>
      </select>

      <label htmlFor="task-tags">
        Tags
      </label>
      <input
        id="task-tags"
        type="text"
        placeholder="react, frontend, urgent"
        value={tagsInput}
        onChange={(e) =>
          setTagsInput(e.target.value)
        }
      />

      {error && (
        <p id="task-form-error">
          {error}
        </p>
      )}

      <button type="submit">
        Add Task
      </button>
    </form>
  );
}

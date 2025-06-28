import { useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

function TaskCard({ task, index, moveTask }) {
  const [{ isDragging }, drag] = useDrag({
    type: 'task',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'task',
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveTask(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div ref={(node) => drag(drop(node))} className="p-4 border mb-2 rounded">
      {task.title}
    </div>
  );
}

export default function DraggableTaskList({ tasks, onReorder }) {
  const moveTask = (fromIndex, toIndex) => {
    const updatedTasks = [...tasks];
    const [moved] = updatedTasks.splice(fromIndex, 1);
    updatedTasks.splice(toIndex, 0, moved);
    onReorder(updatedTasks);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      {tasks.map((task, index) => (
        <TaskCard key={task.id} task={task} index={index} moveTask={moveTask} />
      ))}
    </DndProvider>
  );
}
import { useEffect, useState } from 'react';
import { Form, Task, TaskData } from './components';
import TaskService from './services/task.service';

function App() {
  const [tasks, setTasks] = useState<Array<TaskData>>([]);
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    TaskService.get().then((tasks) => {
      setTasks(tasks);
    });
    console.log(filter)
  }, []);

  const handleChange = (e)=>{
    setFilter(e.target?.value)
    console.log(filter)
    
  }

  useEffect(() => {
    if (filter == 'incompleted') {
      setTasks([...tasks.filter((task) => task.completed === false)])
    }else{
      setTasks([...tasks.filter((task) => task.completed === true)])
    }
  }, [filter])
  


  const onCreateTask = async (task: TaskData) => {
    try {
      const response = await TaskService.create(task);
      setTasks([...tasks, response]);
    } catch (error) {
      console.log('Algo salió mal');
    }
  };

  return (
    <div className="flex flex-col justify-center items-center bg-pink-50 h-screen">
      <div className=' m-5 p-2 w-1/2'>
        <select 
          name="select" 
          id="" 
          value={filter}
          className='w-full p-2'
          onChange={handleChange}
        >
          <option value="completed">Completas</option>
          <option value="incompleted">Incompletas</option>
        </select>
      </div>
      <div className="bg-white shadow-md w-3/5 rounded-tr-lg rounded-tl-lg">
        <p className="border-b border-b-gray-200 p-3">Tareas</p>
        <div className="p-3">
          {tasks.map((task, index) => (
            <Task
              key={`task-${task.id}`}
              task={task}
              toggleComplete={async () => {
                tasks[index].completed = !tasks[index].completed;
                TaskService.update(tasks[index]);
                setTasks([...tasks]);
              }}
            />
          ))}
        </div>
      </div>
      <Form onSubmit={onCreateTask} />
    </div>
  );
}

export default App;

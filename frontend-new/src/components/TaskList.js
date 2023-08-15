import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { gql } from "graphql.macro";

const GET_TASKS = gql`
  query {
    tasks {
      id
      title
      description
    }
  }
`;

const ADD_TASK = gql`
  mutation AddTask($title: String!, $description: String!) {
    addTaski(title: $title, description: $description) {
      id
      title
      description
    }
  }
`;

const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $title: String!, $description: String!) {
    updateTask(id: $id, title: $title, description: $description) {
      id
      title
      description
    }
  }
`;

const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id) {
      id
      title
      description
    }
  }
`;

function TaskList() {
  const { loading, error, data } = useQuery(GET_TASKS);
  const [addTask] = useMutation(ADD_TASK);
  const [updateTask] = useMutation(UPDATE_TASK);
  const [deleteTask] = useMutation(DELETE_TASK);

  const [formData, setFormData] = useState({ title: "", description: "" });
  const [isEditing, setIsEditing] = useState(null);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async event => {
    event.preventDefault();
    if (isEditing) {
      await updateTask({
        variables: {
          id: isEditing,
          title: formData.title,
          description: formData.description,
        },
        refetchQueries: [{ query: GET_TASKS }],
      });
      setIsEditing(null);
    } else {
      await addTask({
        variables: {
          title: formData.title,
          description: formData.description,
        },
        refetchQueries: [{ query: GET_TASKS }],
      });
    }
    setFormData({ title: "", description: "" });
  };

  const handleEdit = (id, title, description) => {
    setIsEditing(id);
    setFormData({ title, description });
  };

  const handleCancelEdit = () => {
    setIsEditing(null);
    setFormData({ title: "", description: "" });
  };

  const handleDelete = async id => {
    await deleteTask({
      variables: {
        id,
      },
      refetchQueries: [{ query: GET_TASKS }],
    });
  };

  const handleUpdateTask = async () => {
    await updateTask({
      variables: {
        id: isEditing,
        title: formData.title,
        description: formData.description,
      },
      refetchQueries: [{ query: GET_TASKS }],
    });
    setIsEditing(null);
    setFormData({ title: "", description: "" });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className='bg-gray-100 p-6 rounded-lg shadow-md'>
      <h2 className='text-xl font-semibold mb-4'>Task List</h2>
      <ul className='space-y-4'>
        {data.tasks.map(task => (
          <li key={task.id} className='border p-4 rounded-lg shadow-md'>
            {isEditing === task.id ? (
              <div className='space-y-3'>
                <label className='block text-sm font-medium text-gray-700'>
                  Title:
                  <input
                    type='text'
                    name='title'
                    value={formData.title}
                    onChange={handleInputChange}
                    className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50'
                  />
                </label>
                <label className='block text-sm font-medium text-gray-700'>
                  Description:
                  <input
                    type='text'
                    name='description'
                    value={formData.description}
                    onChange={handleInputChange}
                    className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50'
                  />
                </label>
                <div className='flex space-x-2'>
                  <button
                    onClick={handleUpdateTask}
                    className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50'
                  >
                    Update
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className='px-4 py-2 bg-gray-300 text-gray-600 rounded hover:bg-gray-400 focus:outline-none focus:ring focus:ring-gray-200 focus:ring-opacity-50'
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3 className='text-lg font-semibold'>{task.title}</h3>
                <p className='text-gray-600 mt-1'>{task.description}</p>
                <div className='mt-3 flex space-x-2'>
                  <button
                    onClick={() =>
                      handleEdit(task.id, task.title, task.description)
                    }
                    className='px-3 py-1 bg-yellow-500 text-white rounded'
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className='px-3 py-1 bg-red-500 text-white rounded'
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      {!isEditing && (
        <div>
          <h2 className='text-xl font-semibold mt-6'>Create New Task</h2>
          <form onSubmit={handleSubmit} className='space-y-3'>
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Title:
                <input
                  type='text'
                  name='title'
                  value={formData.title}
                  onChange={handleInputChange}
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50'
                />
              </label>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Description:
                <input
                  type='text'
                  name='description'
                  value={formData.description}
                  onChange={handleInputChange}
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50'
                />
              </label>
            </div>
            <button
              type='submit'
              className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50 ${
                isEditing ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isEditing}
            >
              {isEditing ? "Editing..." : "Create Task"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default TaskList;

document.addEventListener("DOMContentLoaded", () => {
  //grap the form elements
  const form = document.querySelector("#create-task-form");
  const input = document.querySelector("#new-task-description");
  const tasks = document.querySelector("#tasks");
  const date = document.querySelector("#due-date");
  const taskPriority = document.querySelector("#task-priority");
  const sortButton = document.querySelector(".fa-sort");
  form.addEventListener("submit", handleSubmit);

  //handle sort
  sortButton.addEventListener("click", handleSort);
  let ascendingOrder = true;
  function handleSort() {
    const todos = document.querySelectorAll(".todo-container");
    const sortedTodos = [...todos];
    sortedTodos.sort((a, b) => {
      const priorityMap = { High: 2, Medium: 1, Low: 0 };
      const priorityA = extractPriorityFromTodoContainer(a);
      const priorityB = extractPriorityFromTodoContainer(b);

      if (ascendingOrder) {
        return priorityMap[priorityA] - priorityMap[priorityB];
      } else {
        return priorityMap[priorityB] - priorityMap[priorityA];
      }
    });

    // Update the list with the sorted tasks
    tasks.innerHTML = "";
    sortedTodos.forEach((todo) => tasks.appendChild(todo));
    // Toggle the sort order for the next click
    ascendingOrder = !ascendingOrder;
  }

  // Extract the priority from a todo container
  function extractPriorityFromTodoContainer(todoContainer) {
    const priorityElement = todoContainer.querySelector(".date");
    const priorityText = priorityElement.textContent;
    const priority = priorityText.match(/Priority:\s+(High|Medium|Low)/i);
    return priority ? priority[1] : "Low";
  }

  // handle the submit event
  function handleSubmit(e) {
    e.preventDefault();

    // first check if the input is not empty
    if (input.value) {
      // get the task description
      const newTodo = input.value;
      const li = document.createElement("li");
      li.className = "todo";
      li.textContent = newTodo;
      li.style.textDecoration = "none";
      // add the color to the task text
      getTextColo(li, taskPriority.value);

      // get the due date
      const dueDateValue = date.value;
      const dueDate = document.createElement("p");
      dueDate.className = "date";
      dueDate.textContent = `Due Date: ${dueDateValue} ,  Priority:  ${taskPriority.value}`;

      // create a new todo container
      const todoContainer = document.createElement("div");
      todoContainer.className = "todo-container";

      // create todo description container
      const todoDescription = document.createElement("div");
      todoDescription.className = "todo-description";

      // append the task description to the container
      todoDescription.appendChild(li);
      todoDescription.appendChild(dueDate);
      todoContainer.appendChild(todoDescription);

      // create buttons container
      const btnContainer = document.createElement("div");
      btnContainer.className = "btn-container";

      // create delete button
      const deleteButton = document.createElement("button");
      deleteButton.className = "delete";
      deleteButton.addEventListener("click", handleDelete);
      const deleteIcon = document.createElement("i");
      deleteButton.appendChild(deleteIcon);

      // create edit button
      const editButton = document.createElement("button");
      editButton.addEventListener("click", handleEdit);
      editButton.className = "edit";
      const editIcon = document.createElement("i");
      deleteIcon.className = "fa-solid fa-trash-can";
      editIcon.className = "fa-solid fa-file-pen";
      editButton.appendChild(editIcon);

      // append the buttons to the task container
      btnContainer.appendChild(editButton);
      btnContainer.appendChild(deleteButton);
      todoContainer.appendChild(btnContainer);

      // append the tast to the list of tasks
      tasks.appendChild(todoContainer);

      // add lingthrough on completed tasts
      li.addEventListener("click", handleCompletedTask);

      // clear the form
      form.reset();
    }
  }

  // handle the deletion of the task
  function handleDelete(e) {
    e.target.closest(".todo-container").remove();
  }

  // handle editing the task
  function handleEdit(e) {
    const todoContainer = e.target.closest(".todo-container");

    // Replace the task description with an input field for editing
    const inputField = document.createElement("input");
    inputField.type = "text";
    const oldTodo = todoContainer.querySelector(".todo").innerText;
    const textColor = todoContainer.querySelector(".todo").style.color;
    const taskDescriptionElement = todoContainer.querySelector(".todo");
    inputField.value = oldTodo;
    inputField.addEventListener("keyup", function (event) {
      if (event.key === "Enter") {
        updateTaskDescription(todoContainer, inputField.value, textColor);
      }
    });

    // Replace the list item with the input field
    taskDescriptionElement.replaceWith(inputField);

    // Focus the input field to allow editing right away
    inputField.focus();
  }

  function updateTaskDescription(todoContainer, newTaskDescription, priority) {
    // Create a new <li> element with the updated task description
    const newTaskDescriptionElement = document.createElement("li");
    newTaskDescriptionElement.innerText = newTaskDescription;
    newTaskDescriptionElement.className = "todo";

    // Replace the input field with the updated <li> element
    const inputField = todoContainer.querySelector('input[type="text"]');
    inputField.replaceWith(newTaskDescriptionElement);

    // change the color back
    newTaskDescriptionElement.style.color = priority;

    // Re-attach the edit button click event listener to the new <li> element
    const editButton = todoContainer.querySelector(".btn-container .edit");
    editButton.addEventListener("click", handleEdit);

    // Re-attach the line-through click handler to the new <li> element
    newTaskDescriptionElement.style.textDecoration = "none";
    newTaskDescriptionElement.addEventListener("click", handleCompletedTask);
  }

  // add or remove line-through task on click
  function handleCompletedTask(e) {
    if (e.target.style.textDecoration === "none") {
      e.target.style.textDecoration = "line-through";
    } else {
      e.target.style.textDecoration = "none";
    }
  }

  // change the task text color based on the priority
  function getTextColo(todo, priority) {
    const red = "crimson";
    const yellow = "gold";
    const green = "teal";
    priority === "High"
      ? (todo.style.color = red)
      : priority === "Medium"
      ? (todo.style.color = yellow)
      : (todo.style.color = green);
  }
});

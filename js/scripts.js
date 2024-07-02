// seleção de elementos
const todoForm = document.querySelector("#add");
const todoAddTask = document.querySelector("#add-task");
const todoList = document.querySelector("#todo-list");
const todoEdit= document.querySelector("#edit");
const todoEditTask= document.querySelector("#edit-task");
const cancelEdit = document.querySelector("#edit-cancel");


// funções

// eventos
todoForm.addEventListener ("submit", (e) => {
    e.preventDefault();
    console.log("enviou o form");
    const taskText = todoAddTask.value;
    if (taskText) {
        console.log(taskText);
    }
})
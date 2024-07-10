//
// seleção de elementos
//

// seleciona o form de adição de task
const todoForm = document.querySelector(".add");

// seleciona a tag de entrada do texo no modo adição
const todoAddTask = document.querySelector("#add-task");

// seleciona a div da lista de task
const todoList = document.querySelector(".todo-list");

// seleciona o form de edição de task
const todoEdit = document.querySelector("#edit");

// seleciona a tag de entrada de texto no modo edição
const todoEditTask = document.querySelector("#edit-task");

// seleciona o botão de cancelamento da adição
const cancelEdit = document.querySelector("#edit-cancel");

// seleciona a tag de entrada de texto no modo pesquisa
const searchTask = document.querySelector("#search-input");

// seleciona o botão de apagar texto pesquisa
const searchErase = document.querySelector("#erase");

// seleciona a tag de filtro
const filterTask = document.querySelector("#filter-select");

// criando uma variável global, nível mais alto do script para acessar em várias funções
let oldElementTitle;

//
// funções
//

// esta função cria a task no document HTML, ao final limpa o campo de criação da task e coloca focus
const saveTask = (text, done = 0, save = 1) => {
  const recordTask = document.createElement("div");
  recordTask.classList.add("todo");

  const recordTitle = document.createElement("h3");
  recordTitle.innerText = text;
  recordTask.appendChild(recordTitle);

  const doneBtn = document.createElement("button");
  doneBtn.classList.add("finish-todo");
  doneBtn.innerHTML = `<i class="fa-solid fa-check"></i>`;
  recordTask.appendChild(doneBtn);

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-todo");
  editBtn.innerHTML = `<i class="fa-solid fa-pen"></i>`;
  recordTask.appendChild(editBtn);

  const removeBtn = document.createElement("button");
  removeBtn.classList.add("remove-todo");
  removeBtn.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
  recordTask.appendChild(removeBtn);

  // acoes no localstorage
  if (done) {
    recordTask.classList.add("done");
  }

  if (save) {
    saveTaskLocalStorage({ text, done });
  }

  // colocando na tela
  todoList.appendChild(recordTask);
  todoAddTask.value = "";
  todoForm.focus();
};

// esconde o campo incluir task, lista de tasks e evidencia o compa para editar a task, deixa pesquisar e filtro aparentes
const editForm = () => {
  todoEdit.classList.toggle("hide");
  todoForm.classList.toggle("hide");
  todoList.classList.toggle("hide");
};

// executa a troca do texto da task, após a edição
const changeTaskValue = (newTodo) => {
  const allTasks = document.querySelectorAll(".todo");
  allTasks.forEach((eachTask) => {
    let taskTitle = eachTask.querySelector("h3");
    if (taskTitle.innerText === oldElementTitle) {
      taskTitle.innerText = newTodo;

      // altera o título da task no local storage
      editTaskTitleLocalStorage(oldElementTitle, newTodo);
    }
  });
};

// executa o search da task, usa a tecnica de esconder o que não é procurado e sempre compara em lower case
const searchExecute = (text) => {
  const searchAllTasks = document.querySelectorAll(".todo");
  searchAllTasks.forEach((eachTask) => {
    let taskTitle = eachTask.querySelector("h3").innerText.toLowerCase();
    const normalizedSearch = text.toLowerCase();
    eachTask.style.display = "flex";
    if (!taskTitle.includes(normalizedSearch)) {
      eachTask.style.display = "none";
    }
  });
};

// executa os filtros utilizando a mesma técnica de esconder o que não é procurado
const searchFilterValue = (choice) => {
  const searchAllTasks = document.querySelectorAll(".todo");
  switch (choice) {
    case "all":
      searchAllTasks.forEach((eachTask) => (eachTask.style.display = "flex"));
      break;

    case "done":
      searchAllTasks.forEach((eachTask) =>
        eachTask.classList.contains("done")
          ? (eachTask.style.display = "flex")
          : (eachTask.style.display = "none")
      );
      break;

    case "todo":
      // aqui temos if then else simplificado

      searchAllTasks.forEach((eachTask) =>
        !eachTask.classList.contains("done")
          ? (eachTask.style.display = "flex")
          : (eachTask.style.display = "none")
      );
      break;

    default:
      break;
  }
};

// local storage

// recupero dados da local storage, se estivere vazio, crio o array, todos convertidos de JSON string pra array
const getTaskLocalSotarge = () => {
  const tasksLocalStorage =
    JSON.parse(localStorage.getItem("recordLocalStorageTasks")) || [];
  return tasksLocalStorage;
};

// para carregar as tasks salvas preciso recupera-los da local storage e usar a função que os imprime na tela - função saveTask
const loadTasksLocalStorage = () => {
  const tasksLocalStorage = getTaskLocalSotarge();
  tasksLocalStorage.forEach((task) => {
    saveTask(task.text, task.done, 0);
  });
};

// salvando os dados no localstorage e convertando pra JSON string
const saveTaskLocalStorage = (task) => {
  const tasksLocalStorage = getTaskLocalSotarge();
  tasksLocalStorage.push(task);
  localStorage.setItem(
    "recordLocalStorageTasks",
    JSON.stringify(tasksLocalStorage)
  );
};

// para remover a task da local storage , precisor pegar da local storage e filtrar a task a ser removida, comparando os textos a partir do botao de remover
const removeTaskLocalStorage = (taskTitle) => {
  const tasksLocalStorage = getTaskLocalSotarge();
  const filteredTasks = tasksLocalStorage.filter(
    (task) => task.text !== taskTitle
  );
  localStorage.setItem(
    "recordLocalStorageTasks",
    JSON.stringify(filteredTasks)
  );
};

// para marcar uma tarefa como done, precisa recuperar as tasks da localstore e com map se altera diretamente o dano que se deseja
const doneTaskLocalStorage = (taskTitle) => {
  const tasksLocalStorage = getTaskLocalSotarge();
  tasksLocalStorage.map((task) =>
    task.text === taskTitle ? (task.done = !task.done) : null
  );
  localStorage.setItem(
    "recordLocalStorageTasks",
    JSON.stringify(tasksLocalStorage)
  );
};

// para marcar uma tarefa como done, precisa recuperar as tasks da localstore e com map se altera diretamente o dano que se deseja
const editTaskTitleLocalStorage = (oldTaskTitle, newTaskTitle) => {
  const tasksLocalStorage = getTaskLocalSotarge();
  tasksLocalStorage.map((task) =>
    task.text === oldTaskTitle ? (task.text = newTaskTitle) : null
  );
  localStorage.setItem(
    "recordLocalStorageTasks",
    JSON.stringify(tasksLocalStorage)
  );
};

// sempre carrega as taks da local storage ao iniciar o programa
loadTasksLocalStorage();

//
// eventos
//

// espera o click no botão submite para coletar o valor do texto e envia-lo pra adição
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const taskText = todoAddTask.value;
  console.log(taskText);
  if (taskText) {
    saveTask(taskText);
  }
});

// espera o click em qualquer elemento do document e seleciona os que tem h3 e valor não nulo, depois os processa para executar as funções de feito, editar ou remover
document.addEventListener("click", (e) => {
  const elementClick = e.target;
  const elementParent = elementClick.closest("div");
  let elementTitle;

  if (elementParent && elementParent.querySelector("h3")) {
    elementTitle = elementParent.querySelector("h3").innerText;
  }

  if (elementClick.classList.contains("finish-todo")) {
    elementParent.classList.toggle("done");

    // aletra no local storage o parâmetro done para 1
    doneTaskLocalStorage(elementTitle);
  }

  if (elementClick.classList.contains("remove-todo")) {
    elementParent.remove();

    // remove da local storage
    removeTaskLocalStorage(elementTitle);
  }

  if (elementClick.classList.contains("edit-todo")) {
    editForm();
    todoEditTask.value = elementTitle;
    oldElementTitle = elementTitle;
  }
});

// epera pressionar o botão cancelar pra cancelar a edição de uma task
cancelEdit.addEventListener("click", (e) => {
  e.preventDefault();
  editForm();
});

// espera acionar o botão de edição pra iniciar a alteração do texto de uma task
todoEdit.addEventListener("submit", (e) => {
  e.preventDefault();
  const todoEditTaskValue = todoEditTask.value;
  if (todoEditTaskValue) {
    changeTaskValue(todoEditTaskValue);
  }
  editForm();
});

// Espera a entrada de dados no campo de pesquisa pra executar a pesquisa
searchTask.addEventListener("keyup", (e) => {
  const searchText = e.target.value;
  searchExecute(searchText);
});

// espera acionar o botão de erase do testo da pesquisa pra limpar o campo
searchErase.addEventListener("click", (e) => {
  e.preventDefault();
  searchTask.value = "";
  searchTask.dispatchEvent(new Event("keyup"));
});

// espera uma alteração na seleção de opções de filtro para executar a filtragem
filterTask.addEventListener("change", (e) => {
  const filterValue = e.target.value;
  searchFilterValue(filterValue);
});

const todoValue = document.getElementById('todoText');
const todoAlert = document.getElementById('Alert');
const listItems = document.getElementById('list-items');
const addUpdate = document.getElementById('AddUpdateClick');

let todo = JSON.parse(localStorage.getItem("todo-list"));
if (!todo) {
    todo = [];
}

function setLocalStorage() {
    localStorage.setItem("todo-list", JSON.stringify(todo));
    console.log("Saved", JSON.parse(localStorage.getItem("todo-list")));
}

todoValue.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        if(addUpdate.getAttribute("onclick") === "CreateToDoItems()") {
            CreateToDoItems();
        } else if(addUpdate.getAttribute("onclick") === "UpdateOnSelectionItems()") {
            UpdateOnSelectionItems();
        }
    }
});

function CreateToDoItems() {
    if (todoValue.value === "") {
        todoAlert.innerText = "Please enter a todo item";
        todoValue.focus();
    } else {
        let IsPresent = false;
        todo.forEach((element) => {
            if (element.item == todoValue.value) {
                IsPresent = true;
            }
        });

        if (IsPresent) {
            setAlertMessage("This item is already present in the list");
            return;
        }

        let li = document.createElement('li');
        const todoItems = `
            <div>
                <img class="check todo-controls" onclick="CompletedToDoItems(this)" src="images/square.png" />
                <span>${todoValue.value}</span>
            </div>
            <div>
                <img class="edit todo-controls" onclick="UpdateToDoItems(this)" src="images/edit.png" />
                <img class="delete todo-controls" onclick="DeleteToDoItems(this)" src="images/bin.png" />
            </div>`;
        li.innerHTML = todoItems;
        listItems.appendChild(li);

        let itemList = { item: todoValue.value, status: false };
        todo.push(itemList);
        setLocalStorage();
        updateCounters();
    }
    todoValue.value = "";
    setAlertMessage("To Do Item Added Successfully");
}

addUpdate.addEventListener('click', CreateToDoItems);

function ReadToDoItems() {
    todo.forEach((element) => {
        let li = document.createElement('li');
        const style = element.status ? "text-decoration: line-through" : "";
        const checkIcon = element.status ? "images/check.png" : "images/square.png";

        const todoItems = `
            <div>
                <img class="check todo-controls" onclick="CompletedToDoItems(this)" src="${checkIcon}" />
                <span style="${style}">${element.item}</span>
            </div>
            <div>
                ${!element.status ? `<img class="edit todo-controls" onclick="UpdateToDoItems(this)" src="images/edit.png" />` : ""}
                <img class="delete todo-controls" onclick="DeleteToDoItems(this)" src="images/bin.png" />
            </div>`;
        li.innerHTML = todoItems;
        listItems.appendChild(li);
    });
}


ReadToDoItems();
updateCounters();

function UpdateToDoItems(e) {
    const todoDiv = e.parentElement.parentElement.querySelector("div");
    const todoTextSpan = todoDiv.querySelector("span");

    if (todoTextSpan.style.textDecoration === "") {
        todoValue.value = todoTextSpan.innerText;
        updateText = todoTextSpan;
        addUpdate.setAttribute("onclick", "UpdateOnSelectionItems()");
        addUpdate.setAttribute("src", "images/update.png");
        todoValue.focus();
    }
}


function UpdateOnSelectionItems() {
    let IsPresent = false;
    todo.forEach((element) => {
        if (element.item === todoValue.value.trim()) {
            IsPresent = true;
        }
    });

    if (IsPresent) {
        setAlertMessage("This item is already present in the list");
        return;
    }

    todo.forEach((element) => {
        if (element.item === updateText.innerText.trim()) {
            element.item = todoValue.value.trim();
        }
    });
    setLocalStorage();
    updateCounters();

    updateText.innerText = todoValue.value.trim();
    addUpdate.setAttribute("onclick", "CreateToDoItems()");
    addUpdate.setAttribute("src", "images/plus.png");
    todoValue.value = "";
    setAlertMessage("To Do Item Updated Successfully");
}


function DeleteToDoItems(e) {
    const deleteValue = e.parentElement.parentElement.querySelector("span").innerText.trim();

    if (confirm(`Are you sure you want to delete this item: "${deleteValue}"?`)) {
        e.parentElement.parentElement.setAttribute("class", "deleted-item");

        todo = todo.filter(element => element.item !== deleteValue);
        setLocalStorage();

        setTimeout(() => {
            e.parentElement.parentElement.remove();
            updateCounters();
        }, 1000);

        fetch('/todos', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ item: deleteValue })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Server Response:', data);
            setAlertMessage("To Do Item Deleted Successfully");
        })
        .catch(error => {
            console.error('Error deleting item on server:', error);
        });
    }
}


function CompletedToDoItems(e) {
    const todoItemDiv = e.parentElement;
    const todoTextSpan = todoItemDiv.querySelector("span");
    const todoText = todoTextSpan.innerText.trim();
    const isCompleted = todoTextSpan.style.textDecoration === "line-through";

    if (isCompleted) {
        todoTextSpan.style.textDecoration = "";
        e.src = "images/square.png";
        todo.forEach((element) => {
            if (element.item === todoText) {
                element.status = false;
            }
        });

        const editHTML = `<img class="edit todo-controls" onclick="UpdateToDoItems(this)" src="images/edit.png" />`;
        todoItemDiv.nextElementSibling.innerHTML += editHTML;
    } else {
        todoTextSpan.style.textDecoration = "line-through";
        e.src = "images/check.png";
        todo.forEach((element) => {
            if (element.item === todoText) {
                element.status = true;
            }
        });

        const editIcon = todoItemDiv.nextElementSibling.querySelector("img.edit");
        if (editIcon) editIcon.remove();
        setAlertMessage("To Do Item Completed Successfully");
    }

    setLocalStorage();
    updateCounters();
}

function updateCounters() {
    const total = todo.length;
    const completed = todo.filter(item => item.status).length;
    const remaining = total - completed;

    document.getElementById("total-count").innerText = `Total: ${total}`;
    document.getElementById("checked-count").innerText = `Completed: ${completed}`;
    document.getElementById("unchecked-count").innerText = `Remaining: ${remaining}`;
}

function setAlertMessage(message) {
    todoAlert.removeAttribute("class");
    todoAlert.innerText = message;
    setTimeout(() => {
        todoAlert.classList.add("toggleMe");
    }, 1000);
}

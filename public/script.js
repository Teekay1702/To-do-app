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
            <div title="Hit Double Click and Complete" ondblclick="CompletedToDoItems(this)">
                ${todoValue.value}
            </div>
            <div>
                <img class="edit todo-controls" onclick="UpdateToDoItems(this)" src="images/edit.png" />
                <img class="delete todo-controls" onclick="DeleteToDoItems(this)" src="images/bin.png" />
            </div>
            `;
        li.innerHTML = todoItems;
        listItems.appendChild(li);

        if (!todo) {
            todo = [];
        }
        let itemList = { item: todoValue.value, status: false };
        todo.push(itemList);
        setLocalStorage();
    }
    todoValue.value = "";
    setAlertMessage("To Do Item Added Successfully");
}

addUpdate.addEventListener('click', CreateToDoItems);

function ReadToDoItems() {
    todo.forEach((element) => {
        let li = document.createElement('li');
        let style = "";
        if (element.status) {
            style = "text-decoration: line-through";
        }
        const todoItems = `
            <div title="Hit Double Click and Complete" ondblclick="CompletedToDoItems(this)" style="${style}">
                ${element.item} 
                ${style === "" ? "" : `<img class="todo-controls" src="images/check.png" />`}
            </div>
            <div>
                ${style === "" ? `<img class="edit todo-controls" onclick="UpdateToDoItems(this)" src="images/edit.png" />` : ""}
                <img class="delete todo-controls" onclick="DeleteToDoItems(this)" src="images/bin.png" />
            </div>`;
        li.innerHTML = todoItems;
        listItems.appendChild(li);
    });
}

ReadToDoItems();

function UpdateToDoItems(e) {
    if (e.parentElement.parentElement.querySelector("div").style.textDecoration === "") {
        todoValue.value = e.parentElement.parentElement.querySelector("div").innerText;
        updateText = e.parentElement.parentElement.querySelector("div");
        addUpdate.setAttribute("onclick", "UpdateOnSelectionItems()");
        addUpdate.setAttribute("src", "images/update.png");
        todoValue.focus();
    }
}

function UpdateOnSelectionItems() {
    let IsPresent = false;
    todo.forEach((element) => {
        if (element.item == todoValue.value.trim()) {
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

    updateText.innerText = todoValue.value.trim();
    addUpdate.setAttribute("onclick", "CreateToDoItems()");
    addUpdate.setAttribute("src", "images/plus.png");
    todoValue.value = "";
    setAlertMessage("To Do Item Updated Successfully");
}

function DeleteToDoItems(e) {
    let deleteValue = e.parentElement.parentElement.querySelector("div").innerText;

    if (confirm(`Are you sure you want to delete this item: "${deleteValue}"?`)) {
        e.parentElement.parentElement.setAttribute("class", "deleted-item");
        todoValue.focus();

        todo.forEach((element, index) => {
            if (element.item == deleteValue) {
                todo.splice(index, 1);
            }
        });

        setTimeout(() => {
            e.parentElement.parentElement.remove();
        }, 1000);

        setLocalStorage();
    }
}

function CompletedToDoItems(e) {
    if (e.parentElement.querySelector("div").style.textDecoration === "") {
        const img = document.createElement("img");
        img.src = "images/check.png";
        img.className = "todo-controls";
        e.parentElement.querySelector("div").style.textDecoration = "line-through";
        e.parentElement.querySelector("div").appendChild(img);
        e.parentElement.querySelector("img.edit").remove();

        todo.forEach((element) => {
            if (e.parentElement.querySelector("div").innerText.trim() == element.item) {
                element.status = true;
            }
        });

        setLocalStorage();

        setAlertMessage("To Do Item Completed Successfully");
    }
}

function setAlertMessage(message) {
    todoAlert.removeAttribute("class");
    todoAlert.innerText = message;
    setTimeout(() => {
        todoAlert.classList.add("toggleMe");
    }, 1000);
}

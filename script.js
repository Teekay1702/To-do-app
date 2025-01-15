const todoValue = document.querySelector('.todoText');
const todoAlert = document.querySelector('Alert');
const listItems = document.querySelector('list-items');
const addUpdate = document.querySelector('AddUpdateClick');

let todo = JSON.parse(localStorage.getItem("todo-list"));
if (!todo) {
    todo = [];
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
            <div title = "Hit Double Click and Complete" ondblclick = "CompletedToDoItems(this)">
                ${todoValue.value}
            </div>
            <div>
                <img class = "edit todo-controls" onclick = "UpdateToDoItems(this)" src = "/images/edit.png" />
                <img class = "delete todo-controls" onclick = "DeleteToDoItems(this)" src = "/images/bin.png" />
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
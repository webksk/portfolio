/*jshint esversion: 6 */
const uri = "/api/cat/";
let items = null;

document.addEventListener("DOMContentLoaded", function (event) {
    loadCategories();
    getCurrentUser();
});

//Получение текущего пользователя
function getCurrentUser() {
    let request = new XMLHttpRequest();
    request.open("POST", "/api/Account/isAuthenticated", true);
    request.onload = function () {
        let myObj = "";
        myObj = request.responseText !== "" ? JSON.parse(request.responseText) : {};
        document.getElementById("msg").innerHTML = myObj.message;
    };
    request.send();
}

//Загрузка категорий
function loadCategories() {
    var i, j, x = "";
    var request = new XMLHttpRequest();
    request.open("GET", uri, false);
    request.onload = function () {
        items = JSON.parse(request.responseText);
        for (i in items) {
            x += "<hr>";
            x += items[i].name + " - <a href='" + items[i].url + "'>" + items[i].url + "</a>";
            x += "<button type='button' class='btn btn-sm btn-outline-secondary btn-left' onclick='editCategory(" + items[i].categoryId + ");'>Edit</button>";
            x += "<button type='button' class='btn btn-sm btn-outline-secondary btn-left1' onclick='deleteCategory(" + items[i].categoryId + ");'>Delete</button>";
            x += "<div class='blocks'>";
            for (j in items[i].post) {
                x += "<div class='col-10'>";
                x += "<h4>" + items[i].post[j].title + "</h4>";
                x += "<p>" + items[i].post[j].content + "</p><br>";
                x += "</div>";
            }
            x += "</div>";
        }
        document.getElementById("categoriesDiv").innerHTML = x;
    };
    request.send();
}

//Удаление категории
function deleteCategory(id) {
    var request = new XMLHttpRequest();
    var url = uri + id;
    request.open("DELETE", url, false);
    request.onload = function () {

        if (request.status === 401)
        {
            alert("У вас не хватает прав для удаления");
        }
        else if(request.status === 201)
        {
            alert("Запись удалена");
        }
        loadCategories();
    };
    request.send();
}

//Редактирование категории
function editCategory(id) {
    let elm = document.querySelector("#editDiv");
    elm.style.display = "block";
    if (items) {
        let i;
        for (i in items) {
            if (id === items[i].categoryId) {
                document.querySelector("#editTitle").value = items[i].name;
                document.querySelector("#editUrl").value = items[i].url;
                document.querySelector("#editID").value = items[i].categoryId;
            }
        }
    }
}

//Обновление после редактирования категории
function updateCategory() {
    const category = {
        categoryId: document.querySelector("#editID").value,
        name: document.querySelector("#editTitle").value,
        url: document.querySelector("#editUrl").value
    };
    var request = new XMLHttpRequest();
    request.open("PUT", uri + category.categoryId);
    request.onload = function () {
        loadCategories();
        closeInput();
    };
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify(category));
}

//Скрыть форму редактирования
function closeInput() {
    let elm = document.querySelector("#editDiv");
    elm.style.display = "none";
}

//Создание категории с постом
function createCategory() {

    var urlText = document.getElementById("createURL").value;
    var titleText = document.getElementById("createTitle").value;

    var postTitle = document.getElementById("createPostTitle").value;
    var postContent = document.getElementById("createPostContent").value;
    var custId = document.getElementById("createCustID").value;

    var request = new XMLHttpRequest();
    request.open("POST", uri);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.onload = function () {
        // Обработка кода ответа
        if (request.status === 401)
        {
            alert("У вас не хватает прав");
        }
        else if (request.status === 201)
        {
            alert("Запись добавлена");
        }
        loadCategories();
    };
    request.send(JSON.stringify({
        url: urlText,
        name: titleText,
        post: [{
            customerId: custId,
            title: postTitle,
            content: postContent
        }]
    }));
}

//Вход в аккаунт
function logIn() {
    var email, password = "";
    // Считывание данных с формы
    email = document.getElementById("Email").value;
    password = document.getElementById("Password").value;
    var request = new XMLHttpRequest();
    request.open("POST", "/api/Account/Login");
    request.setRequestHeader("Content-Type",
        "application/json;charset=UTF-8");
    request.onreadystatechange = function () {
        // Очистка контейнера вывода сообщений
        document.getElementById("msg").innerHTML = "";
        var mydiv = document.getElementById('formError');
        while (mydiv.firstChild) {
            mydiv.removeChild(mydiv.firstChild);
        }
        // Обработка ответа от сервера
        if (request.responseText !== "") {
            var msg = null;
            msg = JSON.parse(request.responseText);
            document.getElementById("msg").innerHTML = msg.message;
            // Вывод сообщений об ошибках
            if (typeof msg.error !== "undefined" && msg.error.length >
                0) {
                for (var i = 0; i < msg.error.length; i++) {
                    var ul = document.getElementsByTagName("ul");
                    var li = document.createElement("li");
                    li.appendChild(document.createTextNode(msg.error[i]));
                    ul[0].appendChild(li);
                }
            }
            document.getElementById("Password").value = "";
        }
    };
    // Запрос на сервер
    request.send(JSON.stringify({
        email: email,
        password: password
    }));
}

//Выход из аккаунта
function logOff() {
    var request = new XMLHttpRequest();
    request.open("POST", "api/account/logoff");
    request.onload = function () {
        var msg = JSON.parse(this.responseText);
        document.getElementById("msg").innerHTML = "";
        var mydiv = document.getElementById('formError');
        while (mydiv.firstChild) {
            mydiv.removeChild(mydiv.firstChild);
        }
        document.getElementById("msg").innerHTML = msg.message;
    };
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send();
    $('#modal1').modal('toggle');
}

// Обработка кликов по кнопкам
document.getElementById("loginBtn").addEventListener("click", logIn);
document.getElementById("logoffBtn").addEventListener("click", logOff);

//Отображение модального окна для входа
function showModal() {
    let elm = document.querySelector("#modal1");
    elm.style.display = "block";
}

//Скрытие модального окна для входа
function closeModal() {
    let elm = document.querySelector("#modal1");
    elm.style.display = "none";
}
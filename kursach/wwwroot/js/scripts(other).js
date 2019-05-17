/*jshint esversion: 6 */
const uri = "/api/cat/";
let items = null;

document.addEventListener("DOMContentLoaded", function (event) {
    getCategories();
});

function getCount(data) {
    const el = document.querySelector("#counter");
    let text = "Find ";
    let text2 = " categories";
    if (data > 0) {
        el.innerText = text + data + text2;
    } else {
        el.innerText = "Nothing here yet";
    }
}

function getCategories() {
    let request = new XMLHttpRequest();
    request.open("GET", uri);
    request.onload = function () {
        let categories = "";
        let categoriesHTML = "";
        categories = JSON.parse(request.responseText);

        if (typeof categories !== "undefined") {
            getCount(categories.length);
            if (categories.length > 0) {
                if (categories) {
                    var i;
                    for (i in categories) {
                        categoriesHTML += '<div class="blogText"><span>' + categories[i].CategoryId + ' : ' + categories[i].Url + ' </span>';
                        categoriesHTML += '<button onclick="editCategory(' + categories[i].CategoryId + ')">Изменить</button>';
                        categoriesHTML += '<button onclick="deleteCategory(' + categories[i].CategoryId + ')">Удалить</button></div>';
                        if (typeof categories[i].post !== "undefined" && categories[i].post.length > 0) {
                            let j;
                            for (j in categories[i].post) {
                                categoriesHTML += "<p>" + categories[i].post[j].content + "</p>";
                            }
                        }
                    }
                }
            }
            items = categories;
            document.querySelector("#categoriesDiv").innerHTML = categoriesHTML;
        }
    };
    request.send();
}

function createCategory() {

    var urlText = document.querySelector("#createDiv").value;
    var request = new XMLHttpRequest();
    request.open("POST", uri);
    request.onload = function () {
        getCategories();
        document.querySelector("#createDiv").value = "";
    };
    request.setRequestHeader("Accepts", "application/json;charset=UTF-8");
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify({ Url: urlText }));
}

function editCategory(id) {
    let elm = document.querySelector("#editDiv");
    elm.style.display = "block";
    if (items) {
        let i;
        for (i in items) {
            if (id === items[i].CategoryId) {
                document.querySelector("#edit-id").value = items[i].CategoryId;
                document.querySelector("#edit-url").value = items[i].Url;
            }
        }
    }
}

function updateCategory() {
    const category = {
        CategoryId: document.querySelector("#edit-id").value,
        Url: document.querySelector("#edit-url").value
    };
    var request = new XMLHttpRequest();
    request.open("PUT", uri + category.CategoryId);
    request.onload = function () {
        getCategories();
        closeInput();
    };
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify(category));
}

function deleteCategory(id) {
    let request = new XMLHttpRequest();
    request.open("DELETE", uri + id, false);
    request.onload = function () {
        getCategories();
    };
    request.send();
}

function closeInput() {
    let elm = document.querySelector("#editDiv");
    elm.style.display = "none";
}

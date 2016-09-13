const kinveyAppID = 'kid_BJZA9I-w';
const kinveyAppSecret = '6fbad7cb905f4a37884bd3fcf738219f';
const kinveyServiceBaseUrl = 'https://baas.kinvey.com/';


function showView(viewId) {
    $("main > section").hide();
    $("#" + viewId).show();
}

function showHideNavigationLinks(){
    let loggedIn = sessionStorage.authToken != null;
    if (loggedIn) {
        $("#linkLogin").hide();
        $("#linkRegister").hide();
        $("#linkListBooks").show();
        $("#linkCreateBook").show();
        $("#linkLogout").show();
    } else {
        $("#linkLogin").show();
        $("#linkRegister").show();
        $("#linkListBooks").hide();
        $("#linkCreateBook").hide();
        $("#linkLogout").hide();
    }
}


function showHomeView(){
    showView('viewHome');
}


function showLoginView() {
    showView('viewLogin');
}

function login() {
    let authBase64 = btoa(kinveyAppID + ":" + kinveyAppSecret);
    let loginUrl = kinveyServiceBaseUrl + "user/" + kinveyAppID + "/login";
    let loginData = {
        username: $("#loginUser").val(),
        password: $("#loginPass").val()
    };

    $.ajax({
        method: "POST",
        url: loginUrl,
        data: loginData,
        headers: {"Authorization": "Basic " + authBase64 },
        success: loginSuccess,
        error: showAjaxError
    });
    function loginSuccess(data, status){
        sessionStorage.authToken = data._kmd.authtoken;
        showListBooksView();
        showHideNavigationLinks();
        showInfo("Login successful");
    }

}

function showInfo(messageText) {
    $("#infoBox").text(messageText).show().delay(3000).fadeOut(1000);
}

function showAjaxError(data, status){
    let errorMsg = '';
    if (typeof(data.readyState) != 'undefined' && data.readyState == 0)
    errorMsg = "Network error. Check your network connection";
    else if (data.responseJSON && data.responseJSON.description)
        errorMsg = data.responseJSON.description;
    else
        errorMsg = "Error: " + JSON.stringify(data);
    $('#errorBox').text(errorMsg).show();
}

function showRegisterView() {
    showView('viewRegister');
}

function register (){

    let authBase64 = btoa(kinveyAppID + ":" + kinveyAppSecret);
    let loginUrl = kinveyServiceBaseUrl + "user/" +
        kinveyAppID + "/";
    let loginData = {
        username: $("#registerUser").val(),
        password: $("#registerPass").val()
    };

    $.ajax({
        method: "POST",
        url: loginUrl,
        data: loginData,
        headers: {"Authorization": "Basic " + authBase64 },
        success: registerSuccess,
        error: showAjaxError
    });
    function registerSuccess(data, status){
        sessionStorage.authToken = data._kmd.authtoken;
        showListBooksView();
        showHideNavigationLinks();
        showInfo("User registered successfully");
    }
}

function showListBooksView() {

    showView('viewListBooks');
    let booksUrl = kinveyServiceBaseUrl + "appdata/" +
        kinveyAppID + "/books";
    let authHeaders = {"Authorization": "Kinvey " + sessionStorage.authToken};
    $.ajax({
        method: "GET",
        url: booksUrl,
        headers: authHeaders,
        success: booksLoaded,
        error: showAjaxError
    });
    function booksLoaded(books, status){

        $("#books").text('');

        let booksTable = $("<section></section>").append($('<div id="book-header">ALL BOOKS</div>'));
        showInfo("Books loaded");

            for (let book of books) {
                booksTable.append($("<br>"));
                booksTable.append($("<div id='book-title'></div>").text(book.title));
                booksTable.append($("<div id='book-author'></div>").text(book.author));
                booksTable.append($("<div id='book-description'></div>").text(book.description));
                booksTable.append($("<br>"));
                booksTable.append($("<hr>"));

            }
        $("#books").append(booksTable);
    }
}

function showCreateBookView() {
    showView('viewCreateBook');
}

function createBook() {
    let booksUrl = kinveyServiceBaseUrl + "appdata/" +
        kinveyAppID + "/books";
    let authHeaders = {
        "Authorization": "Kinvey " + sessionStorage.authToken,
        "Content-Type": "application/json"
    };
    let newBookData = {
        title: $("#bookTitle").val(),
        author: $("#bookAuthor").val(),
        description: $("#bookDescription").val(),
        comments: [{author: "pesho", commentText: "uahah"},
            {author: "gosho", commentText: "ehaa ujas"}]
    };
    $.ajax({
        method: "POST",
        url: booksUrl,
        data: JSON.stringify(newBookData),
        headers: authHeaders,
        success: bookCreated,
        error: showAjaxError
    });
    function bookCreated(data){
        showListBooksView();
        showInfo("Books created");
    }
}

function logout(){
    sessionStorage.clear();
    showHomeView();
    showHideNavigationLinks();
}

$(function() {
    $("#linkHome").click(showHomeView);
    $("#linkLogin").click(showLoginView);
    $("#linkRegister").click(showRegisterView);
    $("#linkListBooks").click(showListBooksView);
    $("#linkCreateBook").click(showCreateBookView);
    $("#linkLogout").click(logout);

    $("#formLogin").submit(function(e) {e.preventDefault(); login()});
    $("#formRegister").submit(function(e) {e.preventDefault(); register()});
    $("#formCreateBook").submit(function(e) {e.preventDefault(); createBook()});

    showHomeView();

    showHideNavigationLinks();

    $(document)
        .ajaxStart(function () {
            $("#loadingBox").show();
            })
        .ajaxStop(function () {
            $("#loadingBox").hide();
        });
});
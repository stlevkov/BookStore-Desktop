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
    $.ajax({
        method: "POST",
        url: loginUrl,
        data:
        {
            username: $("loginUser").val(),
            password: $("loginPass").val()

        },
        headers: {"Authorization": "Basic " + authBase64 },
        success: loginSuccess,
        error: showAjaxError
    });

    function loginSuccess(data, status){
        alert('success');
    }
}

function showAjaxError(data, status){
    let errorMsg = "Error: " + JSON.stringify(data);
    $('#errorBox').text(errorMsg).show();
}

function showRegisterView() {
    showView('viewRegister');
}

function register (){

}

function showListBooksView() {
    showView('viewListBooks');
}
function showCreateBookView() {
    showView('viewCreateBook');
}

function createBook() {

}

function logout(){
    alert('logout');
    showHomeView();
}

$(function() {
    $("#linkHome").click(showHomeView);
    $("#linkLogin").click(showLoginView);
    $("#linkRegister").click(showRegisterView);
    $("#linkListBooks").click(showListBooksView);
    $("#linkCreateBook").click(showCreateBookView);
    $("#linkLogout").click(logout);

    $("#buttonLogin").click(login);
    $("#buttonRegister").click(register);
    $("#buttonCreateBook").click(createBook);

    showHomeView();
    showHideNavigationLinks();
});
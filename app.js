let creat_acount_form = document.getElementById("creat_acount_form")
let login_form = document.getElementById("login_form")
function showForm(){
    creat_acount_form.style.display = "flex"
    login_form.style.display = "none"
}
function login_form_function() {
        creat_acount_form.style.display = "none"
    login_form.style.display = "flex"
}



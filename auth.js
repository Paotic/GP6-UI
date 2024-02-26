class Auth{
    constructor(){
        document.querySelector("body").style.display = "none";
        const auth = localStorage.getItem("auth");
        const user = JSON.parse(localStorage.getItem("user"));
        this.validateAuth(auth, user);
    }
    validateAuth(auth, user){
        if(auth !== 1){
            window.location.replace("/");
        }else{
            document.querySelector("body").style.display = "block";
            var span_username = document.querySelector("#fullname");
            span_username.innerHTML = user.fname + "" + user.lname;
        }
    }
    logOut(){
        localStorage.removeItem("auth");
        window.location.replace("/");
    }
}
function getUserToken() {
    return localStorage.getItem('userToken');
  }
var projectAPI = 'http://localhost:8080/';
class login {
    constructor(form, fields){
        this.form = form;
        this.fields = fields;
        this.validateOnSubmit();
    }
    validateOnSubmit(){
        let self = this;

        this.form.addEventListener("submit", (e) => {
            e.preventDefault();
            var data = {
                username: document.querySelector('input[name="userName"]').value,
                password: document.querySelector('input[name="password"]').value
            }
            console.log(data);
                fetch(projectAPI + 'auth/' + 'login',{
                    method: "POST",
                    body: JSON.stringify(data),
                    headers: {
                        "Content-type": "application/json"
                    },
                })
                .then((Response) => Response.json())
                .then((data) => {
                    if(data.error){
                        console.error("Error", data.message);
                        document.querySelector(".error-message-all").computedStyleMap.display = "block";
                        document.querySelector(".error-message-all").innerText = "Your password or username is incorrect, please try again.";
                    }
                    else {
                        localStorage.setItem("user", JSON.stringify(data));
                        
                        // Assuming the server returns a token upon successful login
                        const userToken = data.token;
                        localStorage.setItem("userToken", userToken);
                        localStorage.setItem("userId", data.userid);
                        console.log("data: ", localStorage.setItem("user", JSON.stringify(data)));
                        console.log("token: ", userToken);
          
                        // Check if the user is authorized based on the token
                        if (userToken !== null) {
                            console.log("token: ", userToken);
                            // Redirect to the admin_page.html
                            window.location.href = 'Project2.html';
                        }
                      }
                })
                .catch((data) => {
                    console.error("Error:", data.message);
                });     
                }
        )
    }
}   

const form = document.querySelector('.loginForm');
if(form){
    const fields = ["userName", "password"];
    const validator = new login(form, fields);
}
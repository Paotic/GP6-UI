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
            var error = 0;
            self.fields.forEach((fields) => {
                const input = document.querySelector(`#${fields}`);
                if(self.validateFields(input)==false){
                    error++;
                }
            });
            var data = {
                name: document.querySelector('input[name="userName"]').value,
                password: document.querySelector('input[name="password"]').value
            }
            if(error == 0){
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
                    // else{
                    //     localStorage.setItem("user", JSON.stringify(data));
                    //     localStorage.setItem("auth", 1);
                    //     this.form.submit();
                    //     window.location.href = 'admin_page.html';
                    // }
                    else {
                        localStorage.setItem("user", JSON.stringify(data));
          
                        // Assuming the server returns a token upon successful login
                        const userToken = data.token;
                        localStorage.setItem("userToken", userToken);
                        console.log("token: ", userToken);
          
                        // Check if the user is authorized based on the token
                        if (userToken !== null) {
                            console.log("token: ", userToken);
                            // Redirect to the admin_page.html
                            // window.location.href = 'admin_page.html';
                        }
                      }
                })
                .catch((data) => {
                    console.error("Error:", data.message);
                });     
                }
        })
    }

    validateFields(fields){
        if(fields.value.trim() == ""){
            this.setStatus(
                fields,
                `${fields.previousElementSibling.innerText} cannot be blank`,
                "error"
            );
            return false;
        } else{
            if(fields.type == "password"){
                if(fields.value.length < 8) {
                    this.setStatus(
                        fields,
                        `${fields.previousElementSibling.innerText} must be 8 characters`,
                        "error"
                    );
                }else{
                    this.setStatus(fields, null, "success");
                    return true;
                }
            }else{
                this.setStatus(fields, null, "success");
                return true;
            }
        }
    }
    setStatus(fields, message, status){
        const errorMessage = fields.parentElement.querySelector(".error-message");
        if(status == "success"){
            if(errorMessage){
                errorMessage.innerText="";
            }
            fields.classList.remove("input-error");
        }
        if (status =="error"){
            errorMessage.innerText = message;
            fields.classList.add('input-error');
        }
    }
}   

const form = document.querySelector('.loginForm');
if(form){
    const fields = ["userName", "password"];
    const validator = new login(form, fields);
}
console.log("the code working here");
var projectAPI = 'http://localhost:8080/';
class register {
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
                role: document.querySelector('input[name="role"]').value,
                username: document.querySelector('input[name="userName"]').value,
                email: document.querySelector('input[name="email"]').value, // Corrected to 'email'
                password: document.querySelector('input[name="password"]').value,
                confirmPassword: document.querySelector('input[name="confirmPassword"]').value,
            }
            console.log("the code working here");
            console.log(data);
                // fetch(projectAPI + 'auth/' + 'register',{
                //     method: "POST",
                //     body: JSON.stringify(data),
                //     headers: {
                //         "Content-type": "application/json"
                //     },
                // })
                // .then((Response) => Response.json())
                // .then((data) => {
                //     if(data.error){
                //         console.error("Error", data.message);
                //         document.querySelector(".error-message-all").computedStyleMap.display = "block";
                //         document.querySelector(".error-message-all").innerText = "Your password or username is incorrect, please try again.";
                //     }
                //     else {
                //         localStorage.setItem("user", JSON.stringify(data));
                //         // Check if the user is authorized based on the token
                //       }
                // })
                // .catch((data) => {
                //     console.error("Error:", data.message);
                // }); 
                fetch(projectAPI + 'auth/register', {
                    method: "POST",
                    body: JSON.stringify(data),
                    headers: {
                        "Content-type": "application/json"
                    },
                })
                .then((response) => {
                    if (!response.ok) {
                        return response.text().then(text => { throw new Error(text) });
                    }
                    return response.json();
                })
                .then((data) => {
                    if(data.error){
                                console.error("Error", data.message);
                                document.querySelector(".error-message-all").computedStyleMap.display = "block";
                                document.querySelector(".error-message-all").innerText = "Your password or username is incorrect, please try again.";
                            }
                })
                .catch((error) => {
                    console.error("Error:", error.message);
                    let errorMessage = "An error occurred. Please try again.";
                    if (error.message.includes("user already exists")) {
                        errorMessage = "This username is already taken. Please try another.";
                    }
                    document.querySelector(".error-message-all").style.display = "block";
                    document.querySelector(".error-message-all").innerText = errorMessage;
                });
                    
                }
        )
    }
}   

const form = document.querySelector('.registerForm');
if(form){
    const fields = ["role", "userName", "email", "password", "confirmPassword"];
    const validator = new register(form, fields);
}
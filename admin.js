var projectAPI = 'http://localhost:3000/';

function start(){
    getUser(renderUser);
    getProject(renderProject);
    getProjectData(renderProjectData);
    getProjectModel(renderProjectModel2);
    document.getElementById('userForm').addEventListener('submit', handleFormUser);
    document.getElementById('close').addEventListener('click', UndoUpdate);

}
start();

function getUser(callback){
    fetch(projectAPI + 'User')
    .then(function(response){
        return response.json();
    })
    .then(callback);
}

function getProject(callback){
    fetch(projectAPI + 'Project')
    .then(function(response){
        return response.json();
    })
    .then(callback);
}

function getProjectData(callback){
    fetch(projectAPI + 'Data')
    .then(function(response){
        return response.json();
    })
    .then(callback);
}

function getProjectModel(callback){
    fetch(projectAPI + 'Model')
    .then(function(response){
        return response.json();
    })
    .then(callback);
}

function renderUser(User){
    var UserDataBl = document.querySelector('#user-data');
    var htmls = User.map(function(Users){
        return `
        <tr class="User-${Users.id}">
            <td>${Users.id}</td>
            <td>${Users.name}</td>
            <td>${Users.email}</td>
            <td>${Users.password}</td>
            <td class ="button">
                <button class="btn btn-primary" type="button" onclick="openUpdateModal(${Users.id})">Update</button>
                <button class="btn btn-danger" type="button" onclick="handleDeleteUser(${Users.id})">Delete</button>
            </td>
        </tr>
        `;
    }); 
    UserDataBl.innerHTML =  htmls.join('');   
}

function renderProject(Project){
    var ProjectDataBl = document.querySelector('#admin_project_data');
    var htmls = Project.map(function(Projects){
        return `
        <tr class="project-item-${Projects.id}">
            <td>${Projects.name}</td>
            <td>${Projects.description}</td>
            <td class ="button">
                <button class="btn btn-primary" type="button" onclick="handleDetail(${Projects.id})">Detail</button>
            </td>    
        </tr>
        `;
    }); 
    ProjectDataBl.innerHTML =  htmls.join('');   
}

function renderProjectData(Data) {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = parseInt(urlParams.get('projectId'));  // Convert projectId to a number
    const ProjectDataDetailBl = document.querySelector('#admin_project_data_detail');
    
    console.log('projectId:', projectId); // Check if projectId is correct
    console.log('Data:', Data);

    // Filter the data to include only matching projectId
    const filteredData = Data.filter(dataItem => dataItem.projectId === projectId);
    
    console.log('filteredData:', filteredData);

    // Map the filtered data to HTML strings
    const html1 = filteredData.map(function(Datas) {
      return `
        <tr class="data-item-${Datas.id}">
          <td>${Datas.id}</td>
          <td>${Datas.data}</td>
          <td>${Datas.predicted}</td>
        </tr>
      `;
    });

    // Set the HTML content of the container
    ProjectDataDetailBl.innerHTML = html1.join('');
}

function renderProjectModel2(Model){
    var ProjectModel = document.querySelector('#admin_project_model');
    var html2 = Model.map(function(Models){
        return `
        <tr class="Model-${Models.id}">
            <td>${Models.id}</td>
            <td>${Models.name}</td>
            <td>${Models.description}</td>
        </tr>
        `;
    });
    ProjectModel.innerHTML =  html2.join('');
}

function createUser(data) {
    fetch(projectAPI + 'User', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(function(response) {
        console.log('Response received');
        if (!response.ok) {
            throw new Error('Network response was not OK');
        }
        return response.json();
    })
    .then(function(data) {
        console.log('Data processed', data);
        // window.location.href = 'Project2.html';
    })
    .catch(function(error) {
        console.error('Fetch error:', error);
    });
}

function handleDeleteUser(id){
    fetch(projectAPI + 'User' + '/' + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(function(response){
        return response.json();
    })
    .then(function(){
        var User = document.querySelector('.User-' + id);
        if (User){
            User.remove();
        }
    });
}
// function handleFormUser(){
//     var createBtn = document.querySelector('#save');
//     createBtn.onclick = function(){
//         var name = document.querySelector('input[name="UserName"]').value;
//         var email = document.querySelector('input[name="Email"]').value;
//         var password = document.querySelector('input[name="Password"]').value;
//         console.log(name)
//         var formData = {
//             name: name,
//             email: email,
//             password: password
//         }   
//         createUser(formData);
//     }   
// }
function handleFormUser(event){
    event.preventDefault(); // Add this line to prevent default form submission
    var id = document.querySelector('input[name="id"]').value;
    var name = document.querySelector('input[name="UserName"]').value;
    var email = document.querySelector('input[name="Email"]').value;
    var password = document.querySelector('input[name="Password"]').value;

    var formData = {
        name: name,
        email: email,
        password: password
    }   
    if(document.getElementById('actionType').value === 'create') {
        createUser(formData);
    } else {
        var formData2 = {
            id: id,
            name: name,
            email: email,
            password: password
        }
        updateUser(formData2);
    }
    // Reload the page after the action is completed
    window.location.reload();
}

function handleDetail(projectId){
    window.location.href = 'admin_project_data.html?projectId=' + projectId;
}

function updateUser(data) {
    fetch(projectAPI + 'User/' + data.id, {
        method: 'PUT', // or 'POST' if your API requires
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not OK');
        }
        return response.json();
    })
    .then(() => {
        console.log('User updated');
        window.location.reload(); // Reload the page
    })
    .catch(error => {
        console.error('Error updating user:', error);
    });
}

// Function to open the modal with user data
function openUpdateModal(userId) {
    document.getElementById('actionType').value = 'update';

    // Fetch user data for the given userId
    fetch(projectAPI + 'User' + '/' + userId)
        .then(response => response.json())
        .then(userData => {
            // Populate modal fields with user data
            document.getElementById('ID').value = userData.id;
            document.getElementById('name').value = userData.name;
            document.getElementById('email').value = userData.email;
            document.getElementById('password').value = userData.password;
            // Open the modal
            $('#staticBackdrop').modal('show'); // Assuming you're using Bootstrap for the modal
        })
        .catch(error => console.error('Error:', error));
        
}

function UndoUpdate(){
    document.getElementById('actionType').value = 'create';
    // Clear the values in the modal fields
    document.getElementById('ID').value = '';
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
}

// Bind the openUpdateModal function to each update button
// This assumes each update button has a class 'updateButton' and a data attribute 'data-userid'
document.querySelectorAll('.updateButton').forEach(button => {
    button.addEventListener('click', function() {
        const userId = this.getAttribute('data-userid');
        openUpdateModal(userId);
    });
});


function searchProjects() {
    // Variables to hold your HTML elements
    var input, filter, table, tr, tdProject, tdModel, i;
    
    // Get the search input value
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    
    // Get the table and its rows
    table = document.getElementById("admin_project_data");
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those that don't match the search query
    for (i = 0; i < tr.length; i++) {
        tdProject = tr[i].getElementsByTagName("td")[0]; // The Project Name column
        tdModel = tr[i].getElementsByTagName("td")[1]; // The Model Name column
        
        // If the row contains a Project or Model Name
        if (tdProject || tdModel) {
            if (tdProject.innerHTML.toUpperCase().indexOf(filter) > -1 || tdModel.innerHTML.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = ""; // This row matches the search, so show it
            } else {
                tr[i].style.display = "none"; // This row doesn't match the search, so hide it
            }
        }       
    }
}

function searchModels() {
    // Variables to hold your HTML elements
    var input, filter, table, tr, tdProject, tdModel, i;
    
    // Get the search input value
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    
    // Get the table and its rows
    table = document.getElementById("admin_project_model");
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those that don't match the search query
    for (i = 0; i < tr.length; i++) {
        tdProject = tr[i].getElementsByTagName("td")[0]; // The Project Name column
        tdModel = tr[i].getElementsByTagName("td")[1]; // The Model Name column
        
        // If the row contains a Project or Model Name
        if (tdProject || tdModel) {
            if (tdProject.innerHTML.toUpperCase().indexOf(filter) > -1 || tdModel.innerHTML.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = ""; // This row matches the search, so show it
            } else {
                tr[i].style.display = "none"; // This row doesn't match the search, so hide it
            }
        }       
    }
}

function searchUsers() {
    // Variables to hold your HTML elements
    var input, filter, table, tr, tdProject, tdModel, i;
    
    // Get the search input value
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    
    // Get the table and its rows
    table = document.getElementById("user-data");
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those that don't match the search query
    for (i = 0; i < tr.length; i++) {
        tdProject = tr[i].getElementsByTagName("td")[0]; // The Project Name column
        tdModel = tr[i].getElementsByTagName("td")[1]; // The Model Name column
        
        // If the row contains a Project or Model Name
        if (tdProject || tdModel) {
            if (tdProject.innerHTML.toUpperCase().indexOf(filter) > -1 || tdModel.innerHTML.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = ""; // This row matches the search, so show it
            } else {
                tr[i].style.display = "none"; // This row doesn't match the search, so hide it
            }
        }       
    }
}

function logoutUser() {
    // Remove the user token from localStorage
    localStorage.removeItem('userToken');

    // Redirect the user to the login page (or any other desired page)
    window.location.href = 'login.html'; // Replace with the appropriate URL
}

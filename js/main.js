let registerUserModalBtn = document.querySelector('#registerUser-modal');
let loginUserModalBtn = document.querySelector('#loginUser-modal');
let registerUserModalBlock = document.querySelector('#registerUser-block');
let loginUserModalBlock = document.querySelector('#loginUser-block');
let registerUserBtn = document.querySelector('#registerUser-btn');
let loginUserBtn = document.querySelector('#loginUser-btn');
let logoutUserBtn = document.querySelector('#logoutUser-btn');
let closeModalBtn = document.querySelector('.btn-close');
let showUsername = document.querySelector('#showUsername');
let adminPanel = document.querySelector('#admin-panel');
// inputs group
let usernameInp = document.querySelector('#reg-username');
let ageInp = document.querySelector('#reg-age');
let passwordInp = document.querySelector('#reg-password');
let passwordConfirmInp = document.querySelector('#reg-passwordConfirm');
let isAdminInp = document.querySelector('#isAdmin');
let loginUsernameInp = document.querySelector('#login-username');
let loginPasswordInp = document.querySelector('#login-password');

// account logic
registerUserModalBtn.addEventListener('click', () => {
    registerUserModalBlock.setAttribute('style', 'display: flex !important;');
    registerUserBtn.setAttribute('style', 'display: block !important;');
    loginUserModalBlock.setAttribute('style', 'display: none !important;');
    loginUserBtn.setAttribute('style', 'display: none !important;');
});

loginUserModalBtn.addEventListener('click', () => {
    registerUserModalBlock.setAttribute('style', 'display: none !important;');
    registerUserBtn.setAttribute('style', 'display: none !important;');
    loginUserModalBlock.setAttribute('style', 'display: flex !important;');
    loginUserBtn.setAttribute('style', 'display: block !important;');
});

// register
const USERS_API = 'http://localhost:8000/users';

async function checkUniqueUsername(username) {
    let res = await fetch(USERS_API);
    let users = await res.json();
    return users.some(user => user.username === username);
};

async function registerUser() {
    if(
        !usernameInp.value.trim() ||
        !ageInp.value.trim() ||
        !passwordInp.value.trim() ||
        !passwordConfirmInp.value.trim()
    ) {
        alert('Some inputs are empty!');
        return;
    };

    let uniqueUsername = await checkUniqueUsername(usernameInp.value);

    if(uniqueUsername) {
        alert('User with this username already exists!');
        return;
    };

    if(passwordInp.value !== passwordConfirmInp.value) {
        alert('Passwords don\'t match!');
        return;
    };

    let userObj = {
        username: usernameInp.value,
        age: ageInp.value,
        password: passwordInp.value,
        isAdmin: isAdmin.checked
    };

    fetch(USERS_API, {
        method: 'POST',
        body: JSON.stringify(userObj),
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    });

    usernameInp.value = '';
    ageInp.value = '';
    passwordInp.value = '';
    passwordConfirmInp.value = '';
    isAdminInp.checked = false;

    closeModalBtn.click();
};

registerUserBtn.addEventListener('click', registerUser);

// login
function checkLoginLogoutStatus() {
    let user = localStorage.getItem('user');
    if(!user) {
        loginUserModalBtn.parentNode.style.display = 'block';
        logoutUserBtn.parentNode.style.display = 'none';
        showUsername.innerText = 'No user';
    } else {
        loginUserModalBtn.parentNode.style.display = 'none';
        logoutUserBtn.parentNode.style.display = 'block';
        showUsername.innerText = JSON.parse(user).username;
    };

    showAdminPanel();
};
checkLoginLogoutStatus();

function checkUserInUsers(username, users) {
    return users.some(item => item.username === username);
};

function checkUserPassword(user, password) {
    return user.password === password;
};

function setUserToStorage(username, isAdmin) {
    localStorage.setItem('user', JSON.stringify({
        username,
        isAdmin
    }));
};

async function loginUser() {
    if(
        !loginUsernameInp.value.trim() ||
        !loginPasswordInp.value.trim()
    ) {
        alert('Some inpits are empty!');
        return;
    };

    let res = await fetch(USERS_API);
    let users = await res.json();

    if(!checkUserInUsers(loginUsernameInp.value, users)) {
        alert('User not found!');
        return;
    };

    let userObj = users.find(user => user.username === loginUsernameInp.value);

    if(!checkUserPassword(userObj, loginPasswordInp.value)) {
        alert('Wrong password!');
        return;
    };

    setUserToStorage(userObj.username, userObj.isAdmin);

    loginUsernameInp.value = '';
    loginPasswordInp.value = '';

    checkLoginLogoutStatus();

    closeModalBtn.click();
};

loginUserBtn.addEventListener('click', loginUser);

// logout
logoutUserBtn.addEventListener('click', () => {
    localStorage.removeItem('user');
    checkLoginLogoutStatus();
});

// product logic
function checkUserForProductCreate() {
    let user = JSON.parse(localStorage.getItem('user'));
    if(user) return user.isAdmin;
    return false;
};

function showAdminPanel() {
    if(!checkUserForProductCreate()) {
        adminPanel.setAttribute('style', 'display: none !important;');
    } else {
        adminPanel.setAttribute('style', 'display: flex !important;');
    };
};
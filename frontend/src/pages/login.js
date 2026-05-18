import { login, register } from '../api/auth.js';
let diagonalLineDir = 0;
let textPos = 0;
let titlePos = 0;


export function Login()
{
    const main = document.querySelector("main");
    if (!main) return;

    const nav = document.getElementById("nav-slot");
    nav.innerHTML = "";

    main.innerHTML = "";

    const footer = document.getElementById("footer-slot");
    if (footer) footer.innerHTML = "";



    const loginBox = document.createElement("div");
    loginBox.id = "loginBox";

    loginBox.className =
        "absolute inset-0 animate-aurora bg-aurora-gradient bg-[length:300%_200%] z-0";

    const loginBox1 = GenerateLoginForm();
    const loginForm = loginBox1.querySelector("#loginForm");
    loginForm.addEventListener("submit", handleLoginSubmit);

    const signUpButton = loginBox1.querySelector("#signupBtn");
    signUpButton.addEventListener("click", () => {
        SignUp()
    });

    loginBox1.className =
        "relative z-10 w-[560px] h-[760px] bg-transparent backdrop-blur-xs mt-50 rounded-lg flex flex-col items-start";

    const diagonalLine = document.createElement("div");
    diagonalLine.id = "diagonalLine";
    diagonalLine.className =
        "absolute left-[-40px] right-1/9 top-1/2 left-0 w-full h-px bg-linear-to-r from-black via-(--color-secondary) to-black rotate-110 shadow-[0_0_8px_var(--color-secondary)]";
    diagonalLine.style.background = `linear-gradient(
        90deg,
        transparent 0%,
        var(--color-main) 25%,
        var(--color-secondary) 50%,
        var(--color-main) 75%,
        transparent 100%
        )`;

    diagonalLine.style.boxShadow = "0 0 30px var(--color-secondary)";

    const wrapper = document.createElement("div");
    wrapper.style.position = "absolute";
    wrapper.style.inset = "0";
    wrapper.style.display = "flex";
    wrapper.style.alignItems = "center";
    wrapper.style.justifyContent = "flex-end";
    wrapper.style.paddingRight = "72px";

    const title = document.createElement("div");
    title.style.position = "absolute";
    title.style.left = "48px";
    title.style.top = "84px";
    title.innerHTML = `<h1 id="textTitle" class="hero-title font-bebas text-[clamp(4rem,14vw,12rem)] mb-4 hero-anim-2">
        <span class="glow-word">THE</span><br>FIELD
        </h1>
        `;
    
    wrapper.appendChild(loginBox1);
    main.appendChild(loginBox);
    main.appendChild(wrapper);
    main.appendChild(diagonalLine);
    main.appendChild(title);
}
function SignUp() 
{
    const signupBtn = document.getElementById('signupBtn');
    signupBtn.remove();

    const signUpBox = GenerateSignUpForm();

    const logInBtn = signUpBox.querySelector("#logInBtn");

    logInBtn.addEventListener("click", () => {
        BackToLogin()
    });
    
    const textTitle = document.getElementById('textTitle');
    const diagonalLine = document.getElementById('diagonalLine');
    

    diagonalLineDir += 90;
    textPos -= 60;
    titlePos += 70;

    signUpBox.style.transform = `translateX(${textPos}vw)`;
    textTitle.style.transform = `translateX(${titlePos}vw)`;
    diagonalLine.style.transform = `rotate(180deg)`;

    setupSignupValidation(signUpBox);
}
function BackToLogin()
{
    const logInBox = document.getElementById('loginBox1');

    const textTitle = document.getElementById('textTitle');
    const diagonalLine = document.getElementById('diagonalLine');

    diagonalLineDir -= 90;
    textPos += 60;
    titlePos -= 70;

    logInBox.style.transform = `translateX(${textPos}vw)`;
    textTitle.style.transform = `translateX(${titlePos}vw)`;
    diagonalLine.style.transform = `rotate(${diagonalLineDir}deg)`;

    // regenerate signup form
    const newLoginForm = GenerateLoginForm();
    logInBox.innerHTML = newLoginForm.innerHTML;

    // reattach listeners so they are not lost
    const loginForm = logInBox.querySelector("#loginForm");
    loginForm.addEventListener("submit", handleLoginSubmit);

    // Reattach signup button event
    const signupBtn = logInBox.querySelector("#signupBtn");

    signupBtn.addEventListener("click", () => {
        SignUp();
    });
}
function GenerateLoginForm()
{
    const loginBox1 = document.createElement("div");
    loginBox1.id = "loginBox1";
    loginBox1.innerHTML = `<div class = "ml-10 mt-10 text-4xl text-(--color-text-dif)"> Welcome back </div>
        <div class = "ml-12 mt-5 text-xl text-(--color-text-dif)"> Login to your account </div>
        <form id = "loginForm">
            <div id = "entryFields" class=" m-10 flex flex-col w-[150%]">
                <div class="mb-6">
                    <input type="email" id="email" class="bg-neutral-secondary-medium border border-(--color-secondary) border-default-medium rounded-lg h-15 text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" placeholder="Email address" required />
                </div>
                <div class="mb-6">
                    <input type="password" id="password" class="bg-neutral-secondary-medium border border-(--color-secondary) border-default-medium rounded-lg h-15 text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" placeholder="Password" required />
                </div>
                <div class="flex flex-col gap-6 max-w-sm mx-auto relative z-10">
                <button type="submit" id="loginSubmitBtn" class="group relative p-4 rounded-2xl backdrop-blur-xl border-2 border-(--color-border) bg-gradient-to-br from-(--color-line-dim)/35 via-(--color-secondary)/55 to-(--color-main) shadow-2xl hover:shadow-[0_0_24px_var(--color-glow)] hover:scale-[1.02] hover:-translate-y-1 active:scale-95 transition-all duration-500 ease-out cursor-pointer hover:border-(--color-line-bright)/60 overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-(--color-line-bright) to-transparent opacity-40 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                    <div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-(--color-secondary)/10 via-(--color-line-bright)/25 to-(--color-secondary)/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div class="relative z-10 flex items-center gap-4 w-50">
                        <div class="flex-1 text-left">
                            <p id = "loginBtnText" class="text-center text-[#fff] font-bold text-lg group-hover:text-(--color-line-bright) transition-colors duration-300 drop-shadow-sm">
                            LOG IN
                            </p>
                        </div>
                    </div>
                </button>
            </div>
            <button type="button" id="signupBtn" class="text-center text-(--color-main) text-(--color-secondary) hover:text-(--color-text-dif) transition-colors duration-300 cursor-pointer mt-2">
                create new account
            </button>
        </form>
        `;
    return loginBox1;
}

function GenerateSignUpForm()
{
    const signUpBox = document.getElementById('loginBox1');
    signUpBox.innerHTML = `<div class = "ml-10 mt-10 text-4xl text-(--color-text-dif)"> Create new account </div>
        <div class = "ml-12 mt-5 text-xl text-(--color-text-dif)"> Join us now </div>
        <form id="signupForm" m-20>
            <div id = "entryFields" class=" m-10 flex flex-col w-[150%]">
                <div class="mb-6">
                    <input type="text" id="firstName" class="bg-neutral-secondary-medium border border-(--color-secondary) border-default-medium rounded-lg h-15 text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" placeholder="Firstname" required />
                </div>
                <div class="mb-6">
                    <input type="text" id="lastName" class="bg-neutral-secondary-medium border border-(--color-secondary) border-default-medium rounded-lg h-15 text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" placeholder="Lastname" required />
                </div>
                <div class="mb-6">
                    <input type="text" id="username" class="bg-neutral-secondary-medium border border-(--color-secondary) border-default-medium rounded-lg h-15 text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" placeholder="Username" required />
                </div>
                <div class="mb-6">
                    <input type="email" id="email" class="bg-neutral-secondary-medium border border-(--color-secondary) border-default-medium rounded-lg h-15 text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" placeholder="Email address" required />
                </div>
                <div class="mb-6">
                    <input type="password" id="password" class="bg-neutral-secondary-medium border border-(--color-secondary) border-default-medium rounded-lg h-15 text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" placeholder="Password" required />
                </div>
                <div class="mb-6">
                    <input type="password" id="passwordCheck" class="bg-neutral-secondary-medium border border-(--color-secondary) border-default-medium rounded-lg h-15 text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" placeholder="Re-enter password" required />
                </div>
                <div class="flex flex-col gap-6 max-w-sm mx-auto relative z-10">
                <button type="submit" id = "signupSubmitBtn" class="group relative p-4 rounded-2xl backdrop-blur-xl border-2 border-(--color-border) bg-gradient-to-br from-(--color-line-dim)/35 via-(--color-secondary)/55 to-(--color-main) shadow-2xl hover:shadow-[0_0_24px_var(--color-glow)] hover:scale-[1.02] hover:-translate-y-1 active:scale-95 transition-all duration-500 ease-out cursor-pointer hover:border-(--color-line-bright)/60 overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-(--color-line-bright) to-transparent opacity-40 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                    <div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-(--color-secondary)/10 via-(--color-line-bright)/25 to-(--color-secondary)/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div class="relative z-10 flex items-center gap-4 w-50">
                        <div class="flex-1 text-left">
                            <p class="text-center text-[#fff] font-bold text-lg group-hover:text-(--color-line-bright) transition-colors duration-300 drop-shadow-sm">
                            CREATE ACCOUNT
                            </p>
                        </div>
                    </div>
                </button>
            </div>
            <button type="button" id="logInBtn" class="text-center text-(--color-main) text-(--color-secondary) hover:text-(--color-text-dif) transition-colors duration-300 cursor-pointer mt-2">
                already have an account? login
            </button>
        </form>`;
        return signUpBox;
}

function setupSignupValidation(loginBox1) 
{
    const signupForm = loginBox1.querySelector("#signupForm");

    signupForm.addEventListener("submit", handleSignupSubmit);
}

async function handleSignupSubmit(e) 
{
    e.preventDefault();

    const firstName = document.querySelector("#firstName").value;
    const lastName = document.querySelector("#lastName").value;
    const username = document.querySelector("#username").value;
    const email = document.querySelector("#email").value;
    const password =
        document.querySelector("#password").value;

    const passwordCheck =
        document.querySelector("#passwordCheck").value;

    const validation = validatePassword(password, passwordCheck);

    if (!validation.valid) {
        alert(validation.message);
        return;
    }

    await register({firstName, lastName, username, email, password});
    window.location.href = '/';
    alert("Account created successfully!");
}

function validatePassword(password, passwordCheck) {
    if (password !== passwordCheck) {
        return {
            valid: false,
            message: "Passwords do not match!"
        };
    }

    if (password.length < 8) {
        return {
            valid: false,
            message: "Password must be at least 8 characters."
        };
    }
    return {
        valid: true,
        message: ""
    };
}
async function handleLoginSubmit(e)
{
    e.preventDefault();
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    const btnText = document.querySelector("#loginBtnText");
    const submitBtn = document.querySelector("#loginSubmitBtn");

    try
    {
        btnText.innerText = "VERIFYING...";
        submitBtn.disabled = true;
   
        await login({ email, password });
        window.location.href = '/';
    }

    catch (error)
    {
        alert("Login Failed: " + error.message);
    }
    
    finally
    {
        btnText.innerText = "LOG IN";
        submitBtn.disabled = false;
    }
}
// this should be toggled to false after the backend logic is done
const isDev = true;

const loginMock = async (credentials) => {
    await new Promise(res => setTimeout(res, 1000)); // time out 1 second to simulate network lag
    if (credentials.email === "admin@test.com" && credentials.password === "12345678") {
        return { token: "abc-123-xyz", firstname: "Ahmad", lastname: "" };
    }
    throw new Error("Invalid email or password");
};
export const login = (creds) => isDev ? loginMock(creds) : fetch('http://localhost:8080/api/v1/auth/login', {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(creds), });

//this function checks whether the user is logged in or not by checking the authorization token
export function isAuthenticated() 
{
    return localStorage.getItem("auth_token") !== null;
}

export function getUserFirstName() 
{
    return localStorage.getItem("firstname") || "User"; 
}
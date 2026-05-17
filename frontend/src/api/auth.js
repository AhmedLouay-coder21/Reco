const BASE = 'http://localhost:8080/api/v1';

export const login = async (creds) => {
    const res = await fetch(`${BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(creds)
    });
    
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || "Invalid credentials");
    }
    localStorage.setItem("auth_token", data.accessToken);
    localStorage.setItem("firstname", data.firstname);
    localStorage.setItem("lastname", data.lastname);
    localStorage.setItem("role", data.role);
    return data;
};

// Generic API wrapper for authenticated requests
export async function api(path, opts = {}) {
    const token = localStorage.getItem("auth_token");
    const res = await fetch(`${BASE}${path}`, {
        ...opts,
        headers: { 
            'Content-Type': 'application/json', 
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(opts.headers || {}) 
        },
    });
    
    // Attempt to parse JSON body (some responses may be empty)
    const data = await res.json().catch(() => null);

    // If token is invalid or expired, clear local auth state
    // this line is commented because for this moment some parts of the backend isnt completed yet
    // and it throws 401 or 403 statues code which leads to cookies deletion 
    // if (res.status === 401 || res.status === 403) {
    //     ['auth_token','firstname','lastname','role','user_id'].forEach(k => localStorage.removeItem(k));
    //     throw new Error(data?.message || `${res.status} ${res.statusText}`);
    // }

    if (!res.ok) {
        throw new Error(data?.message || `${res.status} ${res.statusText}`);
    }
    return data;
}

// this function checks whether the user is logged in or not by checking the authorization token
export function isAuthenticated() 
{
    return localStorage.getItem("auth_token") !== null;
}

export function getUserFirstName() 
{
    return localStorage.getItem("firstname") || "User"; 
}
export function getUserRole()
{
    const token = localStorage.getItem('auth_token');
    if (token) {
        const payload = parseJwt(token);
        if (payload && payload.role) {
            // keep localStorage in sync with token claims
            localStorage.setItem('role', payload.role);
            return payload.role;
        }
    }
    return localStorage.getItem("role") || "User"; 
}
// parse a JWT without verifying signature
export function parseJwt(token) {
    if (!token) return null;
    try {
        const payload = token.split('.')[1];
        const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
        return JSON.parse(json);
    } catch (e) {
        return null;
    }
}

export function isTokenValid() {
    const token = localStorage.getItem('auth_token');
    if (!token) return false;

    const payload = parseJwt(token);
    if (!payload) return false;

    if (payload.exp && Date.now() >= payload.exp * 1000) {
        ['auth_token', 'firstname', 'lastname', 'role', 'user_id'].forEach(k => localStorage.removeItem(k));
        return false;
    }

    return true;
}
import decode from 'jwt-decode';

class AuthService {
    // retrieve data saved in token
    getProfile() {
        return decode(this.getToken());
    }

    // check of user is still logged in/token is valid
    loggedIn() {
        const token = this.getToken();
        // use type coersion to check if token is not undefied and not expired
        return !!token && !this.isTokenExpired(token);
    }

    isTokenExpired(token) {
        try {
            const decoded = decode(token);
            if (decoded.exp < Date.now() / 1000) {
                return true;
            }
            else {
                return false;
            }
        }
        catch (err) {
            return false;
        }
    }

    // retrieve from localStorage
    getToken() {
        return localStorage.getItem('id_token');
    }

    // set token to localStorage and reload to homepage
    login(idToken) {
        localStorage.setItem('id_token', idToken);

        window.location.assign('/');
    }

    // clear token and profile data from localStorage and force logout with reload
    logout() {
        localStorage.removeItem('id_token');
        // reload page and reset application state
        window.location.assign('/');
    }
}

export default new AuthService();
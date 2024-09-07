import React, { useState } from 'react'
import './Auth.scss'
import {authAPI} from "../../api/api";

const Auth: React.FC = () => {
    const [login, setLogin] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const handleLogin = async () => {
        if (!login.trim() || !password.trim()) {
            alert('Введите логин и пароль')
        } else {
            try {
                const response = await authAPI.authMe(login, password)
                localStorage.setItem('token', response.token)
                redirectUser()
            } catch (error) {
                console.error('Authentication failed', error)
                const err = error as any
                alert(err.response.data.message)
            }
        }
    }

    const redirectUser = () => {
        window.location.href = '/home'
    }

    return (
        <div className="auth">
            <h1>Login</h1>
            <div className="authInputs">
                <input value={login} onChange={(e) => setLogin(e.target.value)} placeholder="Login" />
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
            </div>
            <div className="authButtons">
                <button onClick={handleLogin}>Login</button>
            </div>
        </div>
    )
}

export default Auth

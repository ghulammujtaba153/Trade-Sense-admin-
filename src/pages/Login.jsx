import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
    const [data, setData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    
  const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const result = await login(data.email, data.password);
        
        if (!result.success) {
            setError(result.error);
            toast.error(result.error);
        }
        navigate('/');
        
        setLoading(false);
    }

    return (
        <div className="w-full h-screen flex justify-center items-center">
            <form onSubmit={handleSubmit} className="bg-[#dae2ee] flex flex-col gap-4 p-10 rounded-lg shadow-lg max-w-[600px]">
                {error && <div className="text-red-500">{error}</div>}
                
                <div className='flex flex-col gap-1'>
                    <label className='text-sm text-gray-800'>Email</label>
                    <input 
                        type="email" 
                        onChange={e => setData({ ...data, email: e.target.value })} 
                        placeholder="Enter your email" 
                        className='p-2 rounded-md'
                        required
                    />
                </div>

                <div className='flex flex-col gap-1'>
                    <label className='text-sm text-gray-800'>Password</label>
                    <input 
                        type="password" 
                        onChange={e => setData({ ...data, password: e.target.value })} 
                        placeholder="Enter your password" 
                        className='p-2 rounded-md'
                        required
                    />
                </div>

                {/* <p className='text-sm text-gray-800'>Have no account? <Link to="/register" className='text-blue-500'>Register</Link></p> */}

                <button disabled={loading} className="bg-blue-500 text-white p-2 rounded-md" type='submit'>
                    {loading ? "Loading..." : "Login"}
                </button>
            </form>
        </div>
    )
}

export default Login;
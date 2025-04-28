import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';
import { FaUser, FaLock } from 'react-icons/fa';

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
        <div className='w-full h-screen  shadow-lg flex justify-center items-center overflow-hidden'>
            <div className="max-w-[1000px] bg-gray-200 rounded-[20px] shadow-lg flex justify-center h-[70%]">
                <div className='flex-1 p-[40px]'>
                    <img src="/login.png" alt="trade-sense-logo" className='w-[400px] h-[400px] mx-auto' />
                </div>
                <form onSubmit={handleSubmit} className="bg-white flex-1 flex flex-col justify-center gap-4 py-10 px-10 w-full h-full">
                    {error && <div className="text-red-500">{error}</div>}


                    <h1 className='text-3xl font-bold'>Login</h1>

                    <div className='flex flex-col gap-1'>
                        <label className='text-sm text-gray-800'>Email</label>
                        <div className="relative">
                            <FaUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
                            <input
                                type="email"
                                onChange={e => setData({ ...data, email: e.target.value })}
                                placeholder="Enter your email"
                                className='p-2 pl-10 bg-slate-300 rounded-full w-full'
                                required
                            />
                        </div>
                    </div>

                    <div className='flex flex-col gap-1'>
                        <label className='text-sm text-gray-800'>Password</label>
                        <div className="relative">
                            <FaLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
                            <input
                                type="password"
                                onChange={e => setData({ ...data, password: e.target.value })}
                                placeholder="Enter your password"
                                className='p-2 pl-10 bg-slate-300 rounded-full w-full'
                                required
                            />
                        </div>
                    </div>

                    {/* <p className='text-sm text-gray-800'>Have no account? <Link to="/register" className='text-blue-500'>Register</Link></p> */}

                    <button disabled={loading} className="bg-blue-500 text-white p-2 hover:scale-105 transition-transform rounded-md" type='submit'>
                        {loading ? (
                            <Loading />
                        )
                            : (
                                'Login'
                            )
                        }
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login;
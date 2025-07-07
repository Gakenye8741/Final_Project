import { useForm } from 'react-hook-form';
import loginImage from '../../src/assets/image-UqgNANsLtSGIkgMfhkxPvvVyfWIhWH.png';
import { Navbar } from '../components/Navbar';
import { toast, Toaster } from 'sonner';
import { userApi } from '../features/APIS/UserApi';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/Auth/AuthSlice';

interface LoginDetails {
  email: string;
  password: string;
}

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginDetails>();
  const [LoginUser, { isLoading }] = userApi.useLoginUserMutation();
  const navigate = useNavigate();
  const Dispatch = useDispatch()

  const onSubmit = async (data: LoginDetails) => {
    const loadingToastId = toast.loading("Logging In...");
    console.log(data);
    try {
      const res = await LoginUser(data).unwrap(); 
      console.log(res);
      toast.success('✅ Logged in successfully', { id: loadingToastId });
      Dispatch(setCredentials(res))
      // navigate('/dashboard');
    } catch (error: any) {
      const ErrorMessage = error?.data?.error?.error || error?.data?.error || error?.error || '❌ Something went wrong. Please try again.';
      toast.error(`Failed to login: ${ErrorMessage}`, { id: loadingToastId });
    }
  };

  return (
    <>
      <Toaster richColors position='top-right' />
      <Navbar />
      <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gradient-to-br from-white to-slate-100 dark:from-gray-900 dark:to-gray-800">
        <div className="hidden md:block">
          <img
            src={loginImage}
            alt="Event Login"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex items-center justify-center p-6">
          <div className="bg-white dark:bg-gray-900 shadow-xl rounded-xl p-8 w-full max-w-sm">
            <h2 className="text-2xl font-bold mb-6 text-center text-primary">🎫 Event Portal Login</h2>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  className="input input-bordered w-full"
                  placeholder="Enter your email"
                  {...register('email', { required: true })}
                />
                {errors.email && (
                  <span className="text-red-500 text-sm mt-1 block">Email is required.</span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  className="input input-bordered w-full"
                  placeholder="Enter your password"
                  {...register('password', { required: true })}
                />
                {errors.password && (
                  <span className="text-red-500 text-sm mt-1 block">Password is required.</span>
                )}
              </div>

              <button type="submit" className="btn btn-primary w-full mt-4" disabled={isLoading}>
                {isLoading ? '🚀 Logging in...' : '🎯 Login'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;

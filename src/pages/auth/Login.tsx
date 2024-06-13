import { useNavigate } from 'react-router-dom';
import './auth.scss';
import FormInput from '../../components/authentication/form-input/FormInput';
import { Fragment, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

function Login() {
	const navigate = useNavigate();
	const [searchParam, setSearchParam] = useSearchParams();
	const [formalUser, setFormalUser] = useState({
		email: searchParam.get('email') ?? '',
		password: '',
	});

	const handleClick = () => {
		navigate('/');
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormalUser((userData) => ({
			...userData,
			[name]: value,
		}));
		if (name === 'email') {
			setSearchParam({ ...searchParam, [name]: value });
		}
	};
	return (
		<Fragment>
			<div className="auth__cover" onClick={handleClick} />
			<div className="auth__modal">
				<button className='cancel__btn'>
				<img src="/icons/cancel.svg" alt="" />

				</button>
				<div className="logo__container">
					<img src="/icons/logo.svg" />
					<p>Medix</p>
				</div>
				<form>
					<FormInput
						name="email"
						type="email"
						label
						id="email"
						handleChange={handleChange}
						value={formalUser.email}
						required
					/>
					<FormInput
						name="password"
						type="password"
						eyeicon
						label
						id="password"
						handleChange={handleChange}
						value={formalUser.password}
						required
					/>
					<label className="policy__label" htmlFor="policy">
						We use industry-standard encryption techniques to protect your
						password and other sensitive information.
					</label>
					<button className="submit__btn">Submit</button>

					<div className="social">
						<div className="social__text">
							<p>Social Login</p>
							<span className="hr__line" />
						</div>
						<button>
							<img src="/icons/goggle.svg" alt="" />
							<p>Continue with Google</p>
						</button>
					</div>

					<label className="policy__label" htmlFor="policy">
						Don't have an account? <Link to="/register">SIGN UP</Link>
					</label>
				</form>
			</div>
		</Fragment>
	);
}
export default Login;

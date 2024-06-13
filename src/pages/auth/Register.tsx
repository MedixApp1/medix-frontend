import './auth.scss';
import { Link } from 'react-router-dom';
import FormInput from '../../components/authentication/form-input/FormInput';
import { Fragment, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

function Register() {
	const [searchParam, setSearchParam] = useSearchParams();
	const [newUser, setNewUser] = useState({
		name: searchParam.get('name') ?? '',
		email: searchParam.get('email') ?? '',
		password: "",
	});
	const [policy, setPolicy] = useState(false);

   const changePolicy =()=> {
      setPolicy(!policy)
   }

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setNewUser((newUserData) => ({
			...newUserData,
			[name]: value,
		}));
		if (name !== "password") {
			setSearchParam({
				...searchParam,
				name: newUser.name,
				email: newUser.email,
				[name]: value,
			});
		}
	};

	return (
		<Fragment>
			<div className="auth__cover" />
			<div className="auth__modal">
			<div className="logo__container">
					<img src="/icons/logo.svg" />
					<p>Medix</p>
				</div>
				<form action="">
					<FormInput
						name="name"
						type="text"
						label
						id="name"
						handleChange={handleChange}
						value={newUser.name}
						required
					/>
					<FormInput
						name="email"
						type="email"
						label
						id="email"
						handleChange={handleChange}
						value={newUser.email}
						required
					/>
					<FormInput
						name="password"
						type="password"
						label
						id="password"
						handleChange={handleChange}
						value={newUser.password}
						eyeicon
						required
					/>
					<input
						type="radio"
						className="policy"
						id="policy"
						checked={policy}
						onClick={changePolicy}
					/>
					<label className="policy__label" htmlFor="policy">
						By opening an account you agree to the terms and conditions of
						our <Link to="/">privacy policy</Link>
					</label>
					<button className="submit__btn">Submit</button>
					<label className="policy__label" htmlFor="policy">
						Already have an account ? <Link to="/register">SIGN IN</Link>
					</label>
				</form>
			</div>

		</Fragment>
	);
}
export default Register;

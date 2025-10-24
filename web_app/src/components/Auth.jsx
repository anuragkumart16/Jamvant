import React from "react";

function Auth({fn}) {
    const [isLogin, setIsLogin] = React.useState(true);

    function toggleAuthMode() {
        setIsLogin(!isLogin);
    }

    return (
        <div className="py-10">
            {isLogin && <div className="flex items-center justify-center flex-col h-full w-full">
                <h1 className="text-3xl font-bold mb-8 text-orange-600">Login</h1>

                <div className="flex flex-col gap-2 border p-6 rounded-xl w-90">
                    <p className="mb-4">Login to your account</p>
                    <label htmlFor="email">Email:</label>
                    <input type="text" id="email" className="border rounded-xl p-2" />
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" className="border rounded-xl p-2" />
                    <p>Forgot your password? <span className="text-blue-500 underline">Reset it</span></p>
                    <button className="border-none bg-black py-3 mt-4 text-white rounded-xl" onClick={fn}>Login</button>

                    <p className="mt-4">Don't have an Account? <span onClick={toggleAuthMode} className="text-blue-500 underline">Signup</span></p>
                </div>
            </div>}
            {!isLogin && <div className="flex items-center justify-center flex-col h-full w-full">
                <h1 className="text-3xl font-bold mb-8 text-orange-600">Signup</h1>

                <div className="flex flex-col gap-2 border p-6 rounded-xl w-90">
                    <p className="mb-4">Signup to your account</p>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" className="border rounded-xl p-2" />
                    <label htmlFor="first-name">First name:</label>
                    <input type="text" id="first-name" className="border rounded-xl p-2" />
                    <label htmlFor="last-name">Last name:</label>
                    <input type="text" id="last-name" className="border rounded-xl p-2" />
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" className="border rounded-xl p-2" />
                    <button className="border-none bg-black py-3 mt-4 text-white rounded-xl">Signup</button>

                    <p className="mt-4">Already have an Account? <span onClick={toggleAuthMode} className="text-blue-500 underline">Login</span></p>
                </div>
            </div>}
        </div>
    );
}

export default Auth;

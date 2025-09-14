import React, { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js"; 

const Container = styled.div`
  display: flex;
  height: 100vh;
  align-items: center;
  justify-content: center;
  background-color: #f4f4f4;
  position: relative;
`;

const Wrapper = styled(motion.div)`
  display: flex;
  width: 700px;
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.2);
  position: relative;

  /* Up-Down Floating Animation */
  animation: float 3s ease-in-out infinite, breathing 3s infinite ease-in-out;

  @keyframes float {
    0% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0); }
  }

  @keyframes breathing {
    0% { transform: scale(1); }
    50% { transform: scale(1.02); }
    100% { transform: scale(1); }
  }
`;

const Section = styled(motion.div)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => (props.dark ? "#0b193f" : "#ffffff")};
  color: ${(props) => (props.dark ? "#ffffff" : "#0b193f")};
  transition: all 0.5s ease;
`;

const LoginForm = styled.div`
  padding: 2rem;
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  margin: 0.5rem 0;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled(motion.button)`
  width: 100%;
  padding: 0.8rem;
  background-color: #0b193f;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 1rem;
  transition: 0.3s;
  font-size: 1rem;
  font-weight: bold;

  &:hover {
    background-color: #09132d;
    transform: scale(1.05);
    box-shadow: 0 5px 15px rgba(11, 25, 63, 0.4);
  }
`;

const SmallButton = styled(Button)`
  position: absolute;
  width: auto;
  padding: 0.5rem 1rem;
`;

const BackButton = styled(SmallButton)`
  top: 20px;
  left: 20px;
`;

const ToggleButton = styled(SmallButton)`
  top: 10px;
  right: 20px;
`;

const Login = () => {
  const navigate = useNavigate();
  const [isFlipped, setIsFlipped] = useState(false);
  const [loginPassword, setLoginPassword] = useState("");
  const [, setLoggedIn] = useState(false);
  const [, setWalletAddressU] = useState("");
  const [, setWalletAddressS] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (isUniversity) => {
    const encryptedPrivateKey = localStorage.getItem(
      isUniversity ? "universityPrivateKey" : "StudentPrivateKey"
    );
    const savedWallet = localStorage.getItem(
      isUniversity ? "universityWallet" : "StudentWallet"
    );
    console.log(encryptedPrivateKey)
    if (!encryptedPrivateKey || !savedWallet) {
      setError(`No registered ${isUniversity ? "university" : "student"} found.`);
      return;
    }
  
    // Decrypt the private key
    const bytes = CryptoJS.AES.decrypt(encryptedPrivateKey, loginPassword);
    const privateKey = bytes.toString(CryptoJS.enc.Utf8);
  
    if (!privateKey) {
      setError("Invalid password.");
      return;
    }
  
    // Set logged-in state and display the wallet address
    setLoggedIn(true);
    if (isUniversity) {
      setWalletAddressU(savedWallet);
    } else {
      setWalletAddressS(savedWallet);
    }
    setError("");
    alert("Logged in successfully!");
  
    // Navigate to the appropriate dashboard based on user type
    if (isUniversity) {
      navigate("/dashboard", {
        state: { 
          privateKey, 
          loginPassword,
          walletAddress: savedWallet // Pass the university wallet address
        }
      });
    } else {
      navigate("/stddashboard", {
        state: { 
          privateKey, 
          loginPassword,
          walletAddress: savedWallet // Pass the student wallet address
        }
      });
    }
  };

  return (
    <Container>
      <BackButton onClick={() => navigate(-1)}>Back</BackButton>

      <Wrapper>
        <AnimatePresence mode="wait">
          <motion.div
            key={isFlipped ? "college" : "student"}
            style={{
              display: "flex",
              width: "100%",
              flexDirection: isFlipped ? "row-reverse" : "row",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Left Side - Dark Blue Section */}
            <Section dark>
              <h1>{isFlipped ? "College Login" : "Student Login"}</h1>
            </Section>

            {/* Right Side - Login Form */}
            <Section>
              <LoginForm>
                <Input
                  type="password"
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
                {error && <p style={{ color: "red" }}>{error}</p>}
                <Button onClick={() => handleLogin(isFlipped)}>Log In</Button>
              </LoginForm>
            </Section>
          </motion.div>
        </AnimatePresence>
      </Wrapper>
      <ToggleButton onClick={() => setIsFlipped(!isFlipped)}>
        {isFlipped ? "Student Login" : "College Login"}
      </ToggleButton>
    </Container>
  );
};

export default Login;
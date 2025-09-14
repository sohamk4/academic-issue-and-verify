import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Web3Context } from "../context/Web3Context"; 
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
  height: 500px;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.2);
  position: relative;
  animation: upDown 3s ease-in-out infinite;

  @keyframes upDown {
    0% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0); }
  }
`;

const Section = styled(motion.div)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: ${(props) => (props.dark ? "#0b193f" : "#ffffff")};
  color: ${(props) => (props.dark ? "#ffffff" : "#0b193f")};
  transition: all 0.5s ease;
`;

const FormContainer = styled.div`
  padding: 2rem;
  text-align: center;
  width: 90%;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  margin: 0.5rem 0;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Dropdown = styled.select`
  width: 100%;
  padding: 0.8rem;
  margin: 0.5rem 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  background: white;
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
  top: 20px;
  right: 20px;
`;

const years = Array.from({ length: 50 }, (_, i) => 1980 + i);

const SignUp = () => {
  const navigate = useNavigate();
  const [isFlipped, setIsFlipped] = useState(false);
  const { web3, contracts, account, isLoading } = useContext(Web3Context); 

  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [studentDomain, setStudentDomain] = useState("");
  const [password, setPassword] = useState("");
  const [formData, setFormData] = useState({
    uniadd: "",
    name: "",
    username: "",
    collegeName: "",
    collegeId: "",
    course: "",
    jy: "",
    py: "",
  });
  const [, setError] = useState("");
  const [, setTransactionHash] = useState("");

  useEffect(() => {
    if (isLoading) {
      console.log("Loading contracts...");
      return;
    }

    if (!contracts || !account) {
      console.error("Contracts or account not loaded.");
      setError("Contracts or account not loaded.");
    }
  }, [contracts, account, isLoading]);

  const handleRegisterUniversity = async () => {
    if (!contracts || !account) {
      console.error("Contracts or account not loaded.");
      setError("Contracts or account not loaded.");
      return;
    }

    try {
      const wallet = web3.eth.accounts.create();
      const ADS = wallet.address;

      const publicKeyBytes32 = web3.utils.keccak256(ADS);

      const encryptedPrivateKey = CryptoJS.AES.encrypt(wallet.privateKey, password).toString();

      localStorage.setItem("universityPrivateKey", encryptedPrivateKey);
      localStorage.setItem("universityWallet", ADS); // Save address for login

      const result = await contracts.methods
        .registerUniversity(
          ADS,
          name, 
          country, 
          state, 
          city, 
          pincode, 
          studentDomain,  
          publicKeyBytes32  
        )
        .send({ from: account });

      console.log("University registered successfully!", result);
      alert("University registered successfully!");
      setTransactionHash(result.transactionHash);
    } catch (error) {
      console.error("Error registering university:", error);
      setError("Error registering university. See console for details.");
      alert("Error registering university. See console for details.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const registerStudent = async () => {
    console.log('here')
    if (!web3 || !contracts || !account) {
      setError("Web3, contracts, or account not available.");
      console.log('here')
      return;
    }
  
    // if (
    //   !formData.name ||
    //   !formData.uniadd ||
    //   !formData.username ||
    //   !formData.collegeName ||
    //   !formData.course ||
    //   !formData.jy ||
    //   !formData.py
    // ) {
    //   setError("Please fill in all required fields.");
    //   return;
    // }
  
    try {
      const wallet = web3.eth.accounts.create();
      const sa = wallet.address;

      const publicKeyBytes32 = web3.utils.keccak256(sa);
  
      if (!sa) {
        setError("Failed to generate student wallet.");
        return;
      }

      const tx = await contracts.methods
        .registerStudent(
          sa,
          formData.uniadd,
          publicKeyBytes32,
          formData.name,
          formData.course,
          parseInt(formData.jy, 10), 
          parseInt(formData.py, 10)  
        )
        .send({ from: account });
  
      setTransactionHash(tx.transactionHash);
      setError("");
  
      // Fetch and log the approval ID for the registered student
      const approvalId = await contracts.methods.getApprovalId(sa).call();
      console.log("Approval ID for Student:", approvalId);
  
      const encryptedPrivateKey = CryptoJS.AES.encrypt(wallet.privateKey, password).toString();
      localStorage.setItem("StudentPrivateKey", encryptedPrivateKey);
      localStorage.setItem("StudentWallet", sa); 
  
      navigate("/login");
    } catch (err) {
      setError(`Error registering student: ${err.message}`);
      console.error("Error registering student:", err);
    }
  };  
  return (
    <Container>
      <BackButton onClick={() => navigate(-1)}>Back</BackButton>

      <Wrapper>
        <AnimatePresence mode="wait">
          <motion.div
            key={isFlipped ? "university" : "student"}
            style={{
              display: "flex",
              width: "100%",
              flexDirection: isFlipped ? "row-reverse" : "row",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Left Side - Blue Section */}
            <Section dark>
              <h1>{isFlipped ? "College Sign In" : "Student Sign In"}</h1>
            </Section>

            {/* Right Side - White Form */}
            <Section>
              <FormContainer>
                {isFlipped ? (
                  <>
                    <Input
                      type="text"
                      placeholder="College Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    <Input
                      type="text"
                      placeholder="Country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      required
                    />
                    <Input
                      type="text"
                      placeholder="State"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      required
                    />
                    <Input
                      type="text"
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                    <Input
                      type="text"
                      placeholder="Pincode"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      required
                    />
                    <Input
                      type="text"
                      placeholder="Student Domain"
                      value={studentDomain}
                      onChange={(e) => setStudentDomain(e.target.value)}
                      required
                    />
                    <Input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Button onClick={handleRegisterUniversity}>Sign In</Button>
                  </>
                ) : (
                  <>
                    <Input
                      type="text"
                      name="uniadd"
                      placeholder="College Address"
                      value={formData.uniadd}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                    <Dropdown
                      name="jy"
                      value={formData.jy}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Admission Year</option>
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </Dropdown>
                    <Dropdown
                      name="py"
                      value={formData.py}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Graduation Year</option>
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </Dropdown>
                    <Input
                      type="text"
                      name="collegeName"
                      placeholder="College Name"
                      value={formData.collegeName}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      type="text"
                      name="course"
                      placeholder="Course"
                      value={formData.course}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Button onClick={registerStudent}>Sign In</Button>
                  </>
                )}
              </FormContainer>
            </Section>
          </motion.div>
        </AnimatePresence>
      </Wrapper>

      <ToggleButton onClick={() => setIsFlipped(!isFlipped)}>
        {isFlipped ? "Student Sign In" : "College Sign In"}
      </ToggleButton>
    </Container>
  );
};

export default SignUp;
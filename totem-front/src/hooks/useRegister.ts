import { useState } from "react";
import { register } from "../service/auth";
import { User } from "../service/interfaces";

interface UseRegisterReturn {
  formData: Omit<User, "role">;
  confirmPassword: string;
  loading: boolean;
  error: string | null;
  success: string | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setConfirmPassword: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export function useRegister(): UseRegisterReturn {
  const [formData, setFormData] = useState<Omit<User, "role">>({
    name: "",
    email: "",
    password: "",
    phone: "",
    cpf: "",
  });
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (formData.password !== confirmPassword) {
        setError("As senhas não conferem.");
        setLoading(false);
        return;
      }

      await register({ ...formData, role: "CLIENT" });
      setSuccess("Registro realizado com sucesso!");
      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        cpf: "",
      });
      setConfirmPassword("");
    } catch {
      setError("Falha no registro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return {
    formData,
    confirmPassword,
    loading,
    error,
    success,
    handleChange,
    setConfirmPassword,
    handleSubmit,
  };
}
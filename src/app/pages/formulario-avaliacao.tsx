// pages/formulario-avaliacao.tsx
"use client";

import { toTitleCase } from "@/util/string";
import Image from "next/image";
import { useEffect, useState } from "react";
import logoFeira from "../../img/logo-feira-animated.svg";
import { AutoCompleteInput } from "../components/AutoCompleteInput";
import { NotaInput } from "../components/NotaInput";
import { AVALIADORES, EQUIPES, TRABALHOS } from "../data";
import { FormData, Trabalho } from "../types";

export default function FormularioAvaliacao() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    nomeAvaliador: "",
    titulo: "",
    numeroEquipe: "",
    dominioTema: "",
    exposicaoOral: "",
    usoRecursos: "",
    cumprimentoProposta: "",
    inovacaoCriatividade: "",
    observacoes: "",
  });
  const [notaFinal, setNotaFinal] = useState<number>(0);
  const camposNota = [
    "dominioTema",
    "exposicaoOral",
    "usoRecursos",
    "cumprimentoProposta",
    "inovacaoCriatividade",
  ];

  const [mostrarTodosTrabalhos, setMostrarTodosTrabalhos] = useState(false);
  const [trabalhosFiltrados, setTrabalhosFiltrados] = useState<Trabalho[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [trabalhoHasObservacoes, setTrabalhoHasObservacoes] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordValidated, setPasswordValidated] = useState(false);

  // Encontrar avaliador pelo nome
  const avaliadorSelecionado = AVALIADORES.find(
    (av) => av.nome === formData.nomeAvaliador
  );

  // Filtrar trabalhos quando o avaliador muda
  useEffect(() => {
    if (avaliadorSelecionado && !mostrarTodosTrabalhos) {
      const trabalhosDoAvaliador = TRABALHOS.filter((trabalho) =>
        trabalho.avaliadores.includes(avaliadorSelecionado.id)
      );
      setTrabalhosFiltrados(trabalhosDoAvaliador);
    } else {
      setTrabalhosFiltrados(TRABALHOS);
    }
  }, [avaliadorSelecionado, mostrarTodosTrabalhos]);

  const handleEmailSelect = (email: string) => {
    const emailParts = email.split("@");
    const emailUsuario = emailParts[0];
    const emailProvedor = emailParts[1];
    const avaliador = AVALIADORES.find(
      (a) =>
        a.emailUsuario === emailUsuario && a.emailProvedor === emailProvedor
    );
    if (avaliador) {
      setFormData((prev) => ({
        ...prev,
        nomeAvaliador: avaliador.nome,
      }));
    }
  };

  const handleNomeSelect = (nome: string) => {
    const avaliador = AVALIADORES.find((a) => a.nome === nome);
    if (avaliador) {
      setFormData((prev) => ({
        ...prev,
        email: avaliador.emailUsuario + "@" + avaliador.emailProvedor,
      }));
    }
  };

  // Atualizar título e equipe quando selecionar um trabalho
  const handleTrabalhoSelect = (titulo: string) => {
    const trabalho = TRABALHOS.find((t) => t.titulo === titulo);
    if (trabalho) {
      setFormData((prev) => ({
        ...prev,
        titulo: trabalho.titulo,
        numeroEquipe: trabalho.equipe,
      }));
    }
  };

  const handleNumeroEquipeSelect = (numeroEquipe: string) => {
    const trabalho = TRABALHOS.find(
      (t) => t.equipe === numeroEquipe.toLocaleUpperCase()
    );
    if (trabalho) {
      setFormData((prev) => ({
        ...prev,
        titulo: trabalho.titulo,
        numeroEquipe: trabalho.equipe,
      }));
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    if (field === "titulo" || field === "numeroEquipe") {
      const trabalho = TRABALHOS.find(
        (t) => t.titulo === value || t.equipe === value
      );
      if (trabalho && trabalho.hasObservacoes) {
        setTrabalhoHasObservacoes(trabalho.hasObservacoes);
      }
    }

    if (camposNota.includes(field)) {
      const novoFormData = { ...formData, [field]: value };
      const nota = Object.entries(novoFormData)
        .filter(([k]) => camposNota.includes(k))
        .reduce((soma, [, v]) => soma + (Number(v.replace(",", ".")) || 0), 0);

      console.log("📝 Nota final:", nota);
      setNotaFinal(nota);
    }
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    let validated = false;
    if (!validated) {
      validated = await verificarPalavraPasse();
    }
    if (!passwordValidated || validated === false) {
      alert("Palavra passe incorreta");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const SCRIPT_ID = process.env.NEXT_PUBLIC_SCRIPT_ID;
      const SCRIPT_URL = `https://script.google.com/macros/s/${SCRIPT_ID}/exec`;

      const payload = {
        email: formData.email,
        nomeAvaliador: formData.nomeAvaliador,
        titulo:
          formData.titulo[0].toUpperCase() +
          formData.titulo.substring(1).toLocaleLowerCase(),
        numeroEquipe: formData.numeroEquipe.toLocaleLowerCase(),
        dominioTema: formData.dominioTema.replace(".", ","),
        exposicaoOral: formData.exposicaoOral.replace(".", ","),
        usoRecursos: formData.usoRecursos.replace(".", ","),
        cumprimentoProposta: formData.cumprimentoProposta.replace(".", ","),
        inovacaoCriatividade: formData.inovacaoCriatividade.replace(".", ","),
        observacoes: formData.observacoes,
      };

      console.log("📤 Enviando dados:", payload);

      // Usando fetch com no-cors (como funcionou no console)
      await fetch(SCRIPT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        mode: "no-cors", // ← Isso que resolve o CORS
      });

      // Com no-cors não podemos verificar a resposta, mas assumimos sucesso
      console.log("✅ Requisição enviada com sucesso (no-cors)");

      setSubmitStatus("success");

      // Limpar formulário após sucesso
      // setFormData({
      //   email: formData.email,
      //   nomeAvaliador: formData.nomeAvaliador,
      //   titulo: "",
      //   numeroEquipe: "",
      //   dominioTema: "",
      //   exposicaoOral: "",
      //   usoRecursos: "",
      //   cumprimentoProposta: "",
      //   inovacaoCriatividade: "",
      //   observacoes: "",
      // });

      // Mostrar mensagem de sucesso
      setTimeout(() => {
        setSubmitStatus("idle");
      }, 5000);
    } catch (error: unknown) {
      console.error("❌ Erro ao enviar:", error);
      setSubmitStatus("error");

      // Mensagem de erro genérica, já que não podemos ver o erro específico com no-cors
      alert(
        "Erro ao enviar formulário. Verifique sua conexão e tente novamente."
      );

      // Resetar o status de erro após 5 segundos
      setTimeout(() => {
        setSubmitStatus("idle");
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nomesAvaliadores = AVALIADORES.map((av) => av.nome);
  const titulosTrabalhos = trabalhosFiltrados.map((t) => t.titulo);

  const verificarPalavraPasse = async () => {
    if (passwordValidated) {
      return true;
    }
    const response = await fetch("/api/validate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password: password }),
    });

    const data = await response.json();

    if (data.success) {
      setPasswordValidated(true);
      return true;
    } else {
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center w-full">
                <Image
                  src={logoFeira}
                  alt="Logo da Feira de Ciências"
                  width={500}
                  height={50}
                />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                Formulário de Avaliação
              </h1>
              <p className="text-gray-600 mt-2">
                Avaliação de Trabalhos Acadêmicos
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* E-mail */}
              <div>
                {/* <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="seu@email.com"
                /> */}
                <AutoCompleteInput
                  label="E-mail do Avaliador"
                  value={formData.email}
                  onChange={(value) => {
                    handleChange("email", value);
                    handleEmailSelect(value);
                  }}
                  options={AVALIADORES.map(
                    (a) => `${a.emailUsuario}@${a.emailProvedor}`
                  )}
                  placeholder="seu.nome@email.com"
                  required
                />
              </div>

              {/* Nome do Avaliador */}
              <AutoCompleteInput
                label="Nome do Avaliador"
                value={formData.nomeAvaliador}
                onChange={(value) => {
                  handleChange("nomeAvaliador", value);
                  handleNomeSelect(value);
                }}
                options={nomesAvaliadores.map((n) => toTitleCase(n, true))}
                required
              />

              {/* Título do Trabalho */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700"></label>
                  <button
                    type="button"
                    onClick={() =>
                      setMostrarTodosTrabalhos(!mostrarTodosTrabalhos)
                    }
                    className="text-sm text-green-600 hover:text-green-800 hover:cursor-pointer"
                  >
                    {mostrarTodosTrabalhos
                      ? "Clique aqui para mostrar APENAS trabalhos atribuídos a você"
                      : "Clique aqui para mostrar TODOS os trabalhos"}
                  </button>
                </div>

                <AutoCompleteInput
                  label="Título do Trabalho"
                  value={formData.titulo}
                  onChange={(value) => {
                    handleChange("titulo", value);
                    handleTrabalhoSelect(value);
                  }}
                  options={titulosTrabalhos}
                  placeholder="Selecione ou digite o título"
                  required
                />

                {avaliadorSelecionado && !mostrarTodosTrabalhos && (
                  <p className="text-xs text-gray-500 mt-1">
                    Mostrando {trabalhosFiltrados.length} trabalhos atribuídos a{" "}
                    {avaliadorSelecionado.nome}
                  </p>
                )}

                {trabalhoHasObservacoes && (
                  <p className="text-xs text-red-500 mt-1">
                    Este trabalho possui observações sobre a equipe. Consulte a
                    organização para entender.
                  </p>
                )}
              </div>

              {/* Número da Equipe */}
              <AutoCompleteInput
                label="Número da Equipe"
                value={formData.numeroEquipe}
                onChange={(value) => {
                  handleChange("numeroEquipe", value);
                  handleNumeroEquipeSelect(value);
                }}
                options={EQUIPES}
                placeholder="Ex: G1, G2, etc."
                required
              />

              {/* Campos de Nota */}
              <div className="grid grid-cols-1 gap-4">
                <NotaInput
                  label="Domínio do tema"
                  value={formData.dominioTema}
                  onChange={(value) => handleChange("dominioTema", value)}
                  required
                />

                <NotaInput
                  label="Exposição oral e integração da equipe"
                  value={formData.exposicaoOral}
                  onChange={(value) => handleChange("exposicaoOral", value)}
                  required
                />

                <NotaInput
                  label="Uso dos recursos empregados e qualidade do material"
                  value={formData.usoRecursos}
                  onChange={(value) => handleChange("usoRecursos", value)}
                  required
                />

                <NotaInput
                  label="Cumprimento da proposta e organização da equipe"
                  value={formData.cumprimentoProposta}
                  onChange={(value) =>
                    handleChange("cumprimentoProposta", value)
                  }
                  required
                />

                <NotaInput
                  label="Inovação e criatividade"
                  value={formData.inovacaoCriatividade}
                  onChange={(value) =>
                    handleChange("inovacaoCriatividade", value)
                  }
                  required
                />
              </div>

              <div className="flex flex-start items-center mb-2">
                <span className="text-sm text-gray-800 mr-2">Nota final: </span>
                <span className="text-sm text-green-600">
                  {notaFinal.toFixed(1)}
                </span>
              </div>

              {/* Observações */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observações adicionais
                </label>
                <textarea
                  value={formData.observacoes}
                  onChange={(e) => handleChange("observacoes", e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Ausência de aluno, observação sobre apresentação, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Palavra passe
                </label>
                <span className="text-sm text-red-600 mr-2">
                  Para submeter utilize a palavra passe que foi enviada pela
                  organização
                </span>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Palavra passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Botão Submit */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 hover:cursor-pointer"
                >
                  {isSubmitting ? "Enviando..." : "Enviar Avaliação"}
                </button>
              </div>

              {/* Mensagens de Status */}
              {submitStatus === "success" && (
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <p className="text-green-800">
                    Avaliação enviada com sucesso!
                  </p>
                </div>
              )}

              {submitStatus === "error" && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-red-800">
                    Erro ao enviar avaliação. Tente novamente.
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

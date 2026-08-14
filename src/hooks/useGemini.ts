import { useState, useRef, useCallback } from "react";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export interface Transcription {
  userText: string;
  modelText: string;
}

export function useGemini() {
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcription, setTranscription] = useState<Transcription>({ userText: "", modelText: "" });
  const [isSendingReport, setIsSendingReport] = useState(false);
  const [reportResult, setReportResult] = useState<any>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const nextPlaybackTimeRef = useRef<number>(0);

  const currentUtteranceRef = useRef<Transcription>({ userText: "", modelText: "" });
  const resumptionHandleRef = useRef<string | null>(null);

  const stopAllPlayback = useCallback(() => {
    activeSourcesRef.current.forEach(source => { try { source.stop() } catch (e) {} });
    activeSourcesRef.current = [];
    nextPlaybackTimeRef.current = 0;
    setIsSpeaking(false);
  }, []);

  const cleanupAudio = useCallback(() => {
    stopAllPlayback();
    if (micStreamRef.current) {
      try { micStreamRef.current.getTracks().forEach(track => track.stop()) } catch (e) {}
      micStreamRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      try { audioCtxRef.current.close() } catch (e) {}
      audioCtxRef.current = null;
    }
  }, [stopAllPlayback]);

  const stopLiveDialog = useCallback(() => {
    cleanupAudio();
    if (wsRef.current) { try { wsRef.current.close() } catch(e){} wsRef.current = null; }
    setIsRecordingVoice(false);
  }, [cleanupAudio]);

  const startLiveDialog = async (initialText?: string) => {
    setIsRecordingVoice(true);
    setTranscription({ userText: "", modelText: "" });
    currentUtteranceRef.current = { userText: "", modelText: "" };
    setReportResult(null);

    try {
      if (!API_KEY) {
        console.error("API Key (NEXT_PUBLIC_GEMINI_API_KEY) não encontrada.");
        setIsRecordingVoice(false);
        return;
      }

      if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      if (audioCtxRef.current.state === 'suspended') await audioCtxRef.current.resume();

      const processorName = `audio-processor-${Date.now()}`;
      const workletCode = `
        class AudioProcessor extends AudioWorkletProcessor {
          process(inputs, outputs, parameters) {
            const input = inputs[0];
            if (input.length > 0 && input[0].length > 0) {
              this.port.postMessage(input[0]);
            }
            return true;
          }
        }
        registerProcessor('${processorName}', AudioProcessor);
      `;
      const blob = new Blob([workletCode], { type: 'application/javascript' });
      const workletUrl = URL.createObjectURL(blob);
      await audioCtxRef.current.audioWorklet.addModule(workletUrl);
      URL.revokeObjectURL(workletUrl);

      const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = micStream;
      const micSource = audioCtxRef.current.createMediaStreamSource(micStream);
      const workletNode = new AudioWorkletNode(audioCtxRef.current, processorName);

      let audioPipelineStarted = false;

      const ws = new WebSocket(`wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${API_KEY}`);
      wsRef.current = ws;

      const startAudioPipeline = () => {
        if (audioPipelineStarted || ws.readyState !== WebSocket.OPEN) return;
        audioPipelineStarted = true;

        workletNode.port.onmessage = (e) => {
          if (ws.readyState !== WebSocket.OPEN) return;
          const inputData = e.data;
          const pcmData = new Int16Array(inputData.length);
          for (let i = 0; i < inputData.length; i++) {
            const s = Math.max(-1, Math.min(1, inputData[i]));
            pcmData[i] = s < 0 ? s * 32768 : s * 32767;
          }
          ws.send(JSON.stringify({ realtimeInput: { audio: { data: window.btoa(String.fromCharCode(...new Uint8Array(pcmData.buffer))), mimeType: "audio/pcm;rate=16000" } } }));
        }
        micSource.connect(workletNode);
      }

      ws.onopen = () => {
        console.log("[Donna] WebSocket conectado!");
        const tools = [{
          functionDeclarations: [
            {
              name: "pesquisar_e_salvar_lead",
              description: "Pesquisa uma marca no INPI e salva o contato do cliente no Notion para análise de viabilidade.",
              parameters: {
                type: "OBJECT",
                properties: {
                  marca: { type: "STRING", description: "O nome da marca a ser pesquisada." },
                  classe: { type: "STRING", description: "A classe de Nice para a pesquisa (ex: 25, 09, 35)." },
                  whatsapp: { type: "STRING", description: "O WhatsApp/telefone do cliente para contato." }
                },
                required: ["marca", "classe", "whatsapp"]
              }
            }
          ]
        }];

        const systemInstructionText = `
          Seu nome é Donna, você é a assistente virtual de voz inteligente da DG Advocacia (escritório especializado em propriedade intelectual e registro de marcas).
          Aja de forma simpática, prestativa e muito profissional.

          Fluxo de Conversa:
          1. Cumprimente o cliente com entusiasmo e pergunte o nome da marca que ele deseja consultar.
          2. Pergunte qual é a área de atuação ou segmento do negócio para que você possa sugerir ou confirmar a Classe de Nice apropriada (ex: vestuário é 25, tecnologia/software é 09, serviços em geral é 35).
          3. Peça o número do WhatsApp (telefone) do cliente para que possamos enviar o relatório e a análise de viabilidade.
          4. Assim que obtiver a Marca, a Classe e o WhatsApp, execute imediatamente a ferramenta 'pesquisar_e_salvar_lead'.
          5. Diga ao usuário que você está realizando a pesquisa em tempo real no banco de dados e salvando o contato dele.
          6. Ao receber o retorno da ferramenta, comente amigavelmente o resultado por áudio (se a marca parece livre ou se foram detectados processos) e conclua informando que nossa equipe entrará em contato pelo WhatsApp em breve.
        `;

        const setupPayload = {
          model: "models/gemini-3.1-flash-live-preview",
          generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Leda" } } }
          },
          tools,
          systemInstruction: { parts: [{ text: systemInstructionText }] }
        };

        console.log("[Donna] Enviando Setup payload...", setupPayload);
        ws.send(JSON.stringify({ setup: setupPayload }));
      }

      ws.onmessage = async (event) => {
        const data = JSON.parse(typeof event.data === 'string' ? event.data : await event.data.text());
        console.log("[Donna WS Message]", data);

        if (data.setupComplete) {
          console.log("[Donna] Setup completo, iniciando pipeline de áudio (microfone)");
          startAudioPipeline();
          if (initialText) {
            ws.send(JSON.stringify({
              clientContent: {
                turns: [
                  {
                    role: "user",
                    parts: [{ text: initialText }]
                  }
                ],
                turnComplete: true
              }
            }));
          }
          return;
        }

        if (data.serverContent?.interrupted) { 
          console.log("[Donna] Interrompido pelo servidor");
          stopAllPlayback(); 
          return; 
        }

        if (data.toolCall) {
            const calls = data.toolCall.functionCalls;
            const functionResponses = await Promise.all(calls.map(async (call: any) => {
              const args = call.args;
              if (call.name === "pesquisar_e_salvar_lead") {
                  console.log("[Donna] Executando pesquisa e salvando lead...", args);
                  setIsSendingReport(true);
                  try {
                    const response = await fetch("/api/inpi/send-report", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(args),
                    });
                    const resData = await response.json();
                    console.log("[Donna] Resultado do salvamento:", resData);
                    setReportResult(resData);
                    setIsSendingReport(false);
                    return {
                        id: call.id,
                        name: call.name,
                        response: { success: true, details: "Contato salvo com sucesso para " + args.whatsapp }
                    };
                  } catch (err: any) {
                    console.error("[Donna] Erro ao processar:", err);
                    setIsSendingReport(false);
                    return {
                        id: call.id,
                        name: call.name,
                        response: { success: false, error: err.message }
                    };
                  }
              }
              return {
                  id: call.id,
                  name: call.name,
                  response: { success: true }
              };
            }));

            ws.send(JSON.stringify({
                toolResponse: { functionResponses }
            }));
        }

        const serverContent = data.serverContent;
        if (serverContent) {
          const modelTurn = serverContent.modelTurn;
          const userTurn = serverContent.userTurn;
          let updated = false;

          if (userTurn?.parts) {
            if (currentUtteranceRef.current.modelText) {
                currentUtteranceRef.current = { userText: "", modelText: "" };
            }
            userTurn.parts.filter((p: any) => p.text).forEach((p: any) => { currentUtteranceRef.current.userText += p.text; updated = true; });
          }

          if (modelTurn?.parts) {
            modelTurn.parts.filter((p: any) => p.text).forEach((p: any) => { currentUtteranceRef.current.modelText += p.text; updated = true; });
          }

          if (updated) {
            setTranscription({ ...currentUtteranceRef.current });
          }
        }

        if (serverContent?.modelTurn?.parts) {
          const parts = serverContent.modelTurn.parts;
          for (const part of parts) {
            if (part.inlineData?.data) {
              const audioData = window.atob(part.inlineData.data);
              const int16 = new Int16Array(new Uint8Array(Array.from(audioData).map(c => c.charCodeAt(0))).buffer);
              const float32 = new Float32Array(int16.length);
              for (let i = 0; i < int16.length; i++) float32[i] = int16[i] / 32768.0;

              if (audioCtxRef.current) {
                try {
                  const buffer = audioCtxRef.current.createBuffer(1, float32.length, 24000);
                  buffer.getChannelData(0).set(float32);
                  const source = audioCtxRef.current.createBufferSource();
                  source.buffer = buffer;
                  source.connect(audioCtxRef.current.destination);
                  
                  const now = audioCtxRef.current.currentTime;
                  if (nextPlaybackTimeRef.current < now) nextPlaybackTimeRef.current = now + 0.04;
                  
                  source.start(nextPlaybackTimeRef.current);
                  nextPlaybackTimeRef.current += buffer.duration;
                  
                  activeSourcesRef.current.push(source);
                  setIsSpeaking(true);
                  source.onended = () => {
                    activeSourcesRef.current = activeSourcesRef.current.filter(s => s !== source);
                    if (activeSourcesRef.current.length === 0) setIsSpeaking(false);
                  }
                } catch(err) {
                  console.error("[Donna] Erro ao decodificar/reproduzir áudio:", err);
                }
              }
            }
          }
        }
      }
      
      ws.onerror = (e) => { console.error("[Donna WS Erro]", e); }
      ws.onclose = (e) => { console.log("[Donna WS Fechado]", e.code, e.reason); }
    } catch (e) {
      console.error("[Donna] Erro fatal no startLiveDialog:", e);
      setIsRecordingVoice(false);
    }
  };

  return { isRecordingVoice, isSpeaking, transcription, isSendingReport, reportResult, startLiveDialog, stopLiveDialog };
}
